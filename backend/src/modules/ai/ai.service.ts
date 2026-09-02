import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { ConsultClassDto, GenerateExercisesDto, SummarizeProgressDto } from './dto/ai.dto';
import { GoogleGenAI } from '@google/genai';
import { getFallbackExercises } from './fallback-data';
import {
  LoaiChucNangAI,
  TrangThaiYeuCauAI,
  TrangThaiLopHoc,
} from '@prisma/client';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private ai: GoogleGenAI | null = null;
  private readonly timeoutMs: number;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (apiKey && apiKey !== 'your-gemini-api-key-here') {
      this.ai = new GoogleGenAI({ apiKey });
    }
    this.timeoutMs = Number(this.configService.get<string>('GEMINI_TIMEOUT_MS')) || 30000;
  }

  private serializeBigInt(obj: any) {
    return JSON.parse(
      JSON.stringify(obj, (key, value) =>
        typeof value === 'bigint' ? Number(value) : value,
      ),
    );
  }

  /**
   * Lưu nhật ký kiểm toán vào bảng YeuCauAI
   */
  private async logAiRequest(
    userId: number,
    functionType: LoaiChucNangAI,
    prompt: string,
    rawOutput: string | null,
    validatedJson: any,
    status: TrangThaiYeuCauAI,
    processingTimeMs: number,
  ) {
    try {
      await this.prisma.yeuCauAI.create({
        data: {
          nguoiDungId: BigInt(userId),
          loaiChucNang: functionType,
          promptInput: prompt,
          rawOutput: rawOutput || '',
          validatedOutputJson: validatedJson,
          trangThai: status,
          thoiGianXuLyMs: Math.max(0, processingTimeMs),
        },
      });
    } catch (err) {
      this.logger.error('Lỗi lưu Audit Log YeuCauAI:', err);
    }
  }

  /**
   * Wrapper gọi Gemini API có timeout và bắt lỗi
   */
  private async callGeminiWithTimeout(model: string, prompt: string): Promise<string> {
    if (!this.ai) {
      throw new Error('GEMINI_API_KEY chưa được cấu hình hoặc không hợp lệ.');
    }

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('TIMEOUT')), this.timeoutMs),
    );

    const apiCallPromise = this.ai.models.generateContent({
      model,
      contents: prompt,
    });

    const response = await Promise.race([apiCallPromise, timeoutPromise]);
    return response.text || '';
  }

  /**
   * UC012 — AI Tư vấn lớp học phù hợp (có Validation lọc ảo giác & Fallback Rule-based)
   */
  async consultClasses(dto: ConsultClassDto, userId: number) {
    const startTime = Date.now();

    // 1. Lấy danh sách lớp đang mở và còn chỗ thực tế trong CSDL
    const availableClasses = await this.prisma.lopHoc.findMany({
      where: {
        trangThai: TrangThaiLopHoc.DANG_MO_DANG_KY,
      },
      include: {
        khoaHoc: { select: { tenKhoaHoc: true, trinhDoYeuCau: true, hocPhi: true } },
        lichHoc: true,
      },
    });

    const validClassMap = new Map(
      availableClasses.map((c) => [c.maLopHoc, c]),
    );

    const prompt = `
Bạn là Giám đốc Đào tạo & Chuyên gia Tư vấn Lộ trình cao cấp của trung tâm ngoại ngữ ETC English.
Dữ liệu học viên:
- Trình độ CEFR: ${dto.cefr}
- Lịch rảnh: ${JSON.stringify(dto.lichRanhJson || 'Tất cả các buổi tối')}
- Mục tiêu / Nguyện vọng cá nhân của học viên: "${dto.mucTieu || 'Mong muốn nâng cao trình độ và tìm lớp học phù hợp nhất với quỹ thời gian'}"

Danh sách lớp học thực tế đang mở tuyển sinh:
${JSON.stringify(
  availableClasses.map((c) => ({
    maLopHoc: c.maLopHoc,
    tenLopHoc: c.tenLopHoc,
    khoaHoc: c.khoaHoc.tenKhoaHoc,
    trinhDoYeuCau: c.khoaHoc.trinhDoYeuCau,
    hocPhi: Number(c.khoaHoc.hocPhi),
    conTrong: c.siSoToiDa - c.siSoHienTai,
    lichHoc: c.lichHoc.map((l) => `Thứ ${l.thuTrongTuan} (${new Date(l.gioBatDau).toLocaleTimeString('vi-VN', {hour: '2-digit', minute: '2-digit'})} - ${new Date(l.gioKetThuc).toLocaleTimeString('vi-VN', {hour: '2-digit', minute: '2-digit'})})`),
  })),
)}

YÊU CẦU PHÂN TÍCH TỪ AI:
1. Phân tích sâu nguyện vọng/mục tiêu của học viên và gợi ý tối đa 3 lớp học phù hợp nhất từ danh sách trên.
2. CHỈ ĐƯỢC CHỌN các lớp có trong danh sách được cung cấp. TUYỆT ĐỐI KHÔNG BỊA ĐẶT mã lớp ngoài danh sách.
3. Đánh giá độ tương thích (doTuongThich: số nguyên từ 75 đến 99), phân tích vì sao lớp này giúp học viên đạt mục tiêu, chỉ ra điểm nổi bật và lộ trình khuyến nghị tiếp theo.
4. Trả về đúng định dạng JSON:
[
  {
    "maLopHoc": "...",
    "tenLopHoc": "...",
    "doTuongThich": 95,
    "lyDoPhuHop": "...",
    "diemNoiBat": "...",
    "loTrinhKhuyenNghi": "..."
  }
]
`;

    let rawOutput: string | null = null;
    let validatedRecommendations: any[] = [];
    let status: TrangThaiYeuCauAI = TrangThaiYeuCauAI.THANH_CONG;

    try {
      rawOutput = await this.callGeminiWithTimeout(
        this.configService.get('GEMINI_FLASH_MODEL') || 'gemini-3.6-flash',
        prompt,
      );

      // Parse JSON
      const cleaned = rawOutput.replace(/```json/g, '').replace(/```/g, '').trim();
      const jsonMatch = cleaned.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);

        // HẬU KIỂM TRA (Post-Validation): Lọc ảo giác — chỉ giữ lại lớp có trong DB
        validatedRecommendations = parsed
          .filter((item: any) => validClassMap.has(item.maLopHoc))
          .map((item: any) => {
            const rawClass = validClassMap.get(item.maLopHoc);
            return {
              ...item,
              hocPhi: rawClass ? Number(rawClass.khoaHoc.hocPhi) : 0,
              lichHocText: rawClass ? rawClass.lichHoc.map((l) => `Thứ ${l.thuTrongTuan}`).join(', ') : '',
              conTrong: rawClass ? rawClass.siSoToiDa - rawClass.siSoHienTai : 0,
            };
          });
      }

      if (validatedRecommendations.length === 0) {
        throw new Error('FALLBACK_TRIGGER');
      }
    } catch (error: any) {
      this.logger.warn('AI Consult thất bại hoặc timeout, kích hoạt Fallback Rule-based:', error?.message);
      status = error?.message === 'TIMEOUT' ? TrangThaiYeuCauAI.TIMEOUT : TrangThaiYeuCauAI.FALLBACK_APPLIED;

      // FALLBACK RULE-BASED: Lọc lớp theo CEFR và sắp xếp theo chỗ trống
      const fallbackList = availableClasses
        .filter((c) => c.khoaHoc.trinhDoYeuCau === dto.cefr)
        .slice(0, 3)
        .map((c) => ({
          maLopHoc: c.maLopHoc,
          tenLopHoc: c.tenLopHoc,
          doTuongThich: 85,
          lyDoPhuHop: `Lớp học chuẩn trình độ ${dto.cefr}, còn ${c.siSoToiDa - c.siSoHienTai} chỗ trống. (Gợi ý tự động)`,
          diemNoiBat: `Khóa học ${c.khoaHoc.tenKhoaHoc} tiêu chuẩn quốc tế`,
          loTrinhKhuyenNghi: `Hoàn thành khóa học để củng cố trình độ ${dto.cefr} vững chắc`,
          hocPhi: Number(c.khoaHoc.hocPhi),
          lichHocText: c.lichHoc.map((l) => `Thứ ${l.thuTrongTuan}`).join(', '),
          conTrong: c.siSoToiDa - c.siSoHienTai,
        }));

      validatedRecommendations = fallbackList.length > 0 ? fallbackList : availableClasses.slice(0, 3).map((c) => ({
        maLopHoc: c.maLopHoc,
        tenLopHoc: c.tenLopHoc,
        doTuongThich: 75,
        lyDoPhuHop: `Lớp học mở gần nhất, còn ${c.siSoToiDa - c.siSoHienTai} chỗ trống. (Gợi ý tự động)`,
        diemNoiBat: `Khóa học ${c.khoaHoc.tenKhoaHoc}`,
        loTrinhKhuyenNghi: `Tham gia lớp để đánh giá và xếp trình độ phù hợp`,
        hocPhi: Number(c.khoaHoc.hocPhi),
        lichHocText: c.lichHoc.map((l) => `Thứ ${l.thuTrongTuan}`).join(', '),
        conTrong: c.siSoToiDa - c.siSoHienTai,
      }));
    }

    const duration = Date.now() - startTime;
    await this.logAiRequest(
      userId,
      LoaiChucNangAI.TU_VAN_LOP,
      prompt,
      rawOutput,
      validatedRecommendations,
      status,
      duration,
    );

    return {
      success: true,
      mode: status === TrangThaiYeuCauAI.THANH_CONG ? 'AI_GEMINI' : 'RULE_BASED_FALLBACK',
      data: validatedRecommendations,
    };
  }

  /**
   * UC013 — AI Sinh bài luyện tập trắc nghiệm (Smart Caching + Gemini API + Fallback)
   */
  async generateExercises(dto: GenerateExercisesDto, userId: number) {
    const startTime = Date.now();
    const count = dto.soLuong && [5, 10, 15].includes(Number(dto.soLuong)) ? Number(dto.soLuong) : 5;

    // 1. SMART DB CACHE LOOKUP: Kiểm tra xem trong CSDL đã có bộ đề cho chủ đề & trình độ này chưa
    try {
      const cachedRecord = await this.prisma.yeuCauAI.findFirst({
        where: {
          loaiChucNang: LoaiChucNangAI.SINH_BAI_TAP,
          trangThai: TrangThaiYeuCauAI.THANH_CONG,
          promptInput: {
            contains: `"${dto.chuDe}"`,
          },
        },
        orderBy: { id: 'desc' },
      });

      if (cachedRecord && cachedRecord.validatedOutputJson) {
        const cachedData = cachedRecord.validatedOutputJson as any;
        if (
          cachedData.trinhDo === dto.trinhDo &&
          Array.isArray(cachedData.cauHoi) &&
          cachedData.cauHoi.length >= count
        ) {
          this.logger.log(`⚡ AI Cache Hit: Trả về bộ đề từ CSDL cho chủ đề "${dto.chuDe}" [${dto.trinhDo}]`);
          const slicedQuestions = cachedData.cauHoi.slice(0, count).map((q: any, idx: number) => ({
            ...q,
            id: idx + 1,
          }));

          const responseData = {
            ...cachedData,
            cauHoi: slicedQuestions,
          };

          // Ghi nhận log truy vấn cache
          const duration = Date.now() - startTime;
          await this.logAiRequest(
            userId,
            LoaiChucNangAI.SINH_BAI_TAP,
            `[CACHE_HIT] ${dto.chuDe} - ${dto.trinhDo} - ${count} câu`,
            '[CACHED_RESULT]',
            responseData,
            TrangThaiYeuCauAI.THANH_CONG,
            duration,
          );

          return {
            success: true,
            mode: 'AI_CACHE',
            cached: true,
            data: responseData,
          };
        }
      }
    } catch (cacheErr: any) {
      this.logger.warn('Lỗi kiểm tra cache:', cacheErr?.message);
    }

    // 2. NẾU CHƯA CÓ TRONG CACHE -> GỌI GOOGLE GEMINI FLASH
    const prompt = `
Bạn là giáo viên tiếng Anh chuyên nghiệp.
Nhiệm vụ: Sinh 01 bài luyện tập trắc nghiệm đúng ${count} câu về chủ đề "${dto.chuDe}", độ khó chuẩn CEFR "${dto.trinhDo}".
RÀNG BUỘC:
- Đúng ${count} câu hỏi trắc nghiệm (4 lựa chọn A, B, C, D) được đánh số id từ 1 đến ${count}.
- Bắt buộc có đáp án đúng và giải thích ngắn gọn bằng tiếng Việt.
- Trả về JSON hợp lệ:
{
  "chuDe": "${dto.chuDe}",
  "trinhDo": "${dto.trinhDo}",
  "cauHoi": [
    {
      "id": 1,
      "noiDung": "...",
      "luaChon": { "A": "...", "B": "...", "C": "...", "D": "..." },
      "dapAnDung": "A",
      "giaiThich": "..."
    }
  ]
}
`;

    let rawOutput: string | null = null;
    let validatedJson: any = null;
    let status: TrangThaiYeuCauAI = TrangThaiYeuCauAI.THANH_CONG;

    try {
      rawOutput = await this.callGeminiWithTimeout(
        this.configService.get('GEMINI_FLASH_MODEL') || 'gemini-3.6-flash',
        prompt,
      );

      const cleaned = rawOutput.replace(/```json/g, '').replace(/```/g, '').trim();
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (Array.isArray(parsed.cauHoi) && parsed.cauHoi.length >= 1) {
          validatedJson = parsed;
        }
      }

      if (!validatedJson) throw new Error('PARSE_ERROR');
    } catch (error: any) {
      this.logger.warn('AI Sinh bài tập thất bại, áp dụng Đề mẫu Fallback:', error?.message);
      status = error?.message === 'TIMEOUT' ? TrangThaiYeuCauAI.TIMEOUT : TrangThaiYeuCauAI.FALLBACK_APPLIED;

      // FALLBACK ĐỀ MẪU TĨNH ĐA DẠNG THEO CHỦ ĐỀ & KHUNG CEFR (ĐỦ 5, 10 HOẶC 15 CÂU)
      validatedJson = getFallbackExercises(dto.chuDe, dto.trinhDo, count);
    }

    const duration = Date.now() - startTime;
    await this.logAiRequest(
      userId,
      LoaiChucNangAI.SINH_BAI_TAP,
      prompt,
      rawOutput,
      validatedJson,
      status,
      duration,
    );

    return {
      success: true,
      mode: status === TrangThaiYeuCauAI.THANH_CONG ? 'AI_GEMINI' : 'TEMPLATE_FALLBACK',
      data: validatedJson,
    };
  }

  /**
   * UC014 — AI Tóm tắt tiến độ học tập (Phân biệt dữ liệu gốc, Zero-Trust Validation & Fallback quy tắc)
   */
  async summarizeProgress(dto: SummarizeProgressDto, userId: number) {
    const startTime = Date.now();

    const [student, lopHoc, attendances, grade] = await Promise.all([
      this.prisma.hoSoHocVien.findUnique({
        where: { id: BigInt(dto.hocVienId) },
        include: { nguoiDung: { select: { email: true, soDienThoai: true } } },
      }),
      this.prisma.lopHoc.findUnique({
        where: { id: BigInt(dto.lopHocId) },
        include: { khoaHoc: true },
      }),
      this.prisma.banGhiDiemDanh.findMany({
        where: {
          hocVienId: BigInt(dto.hocVienId),
          buoiHoc: { lopHocId: BigInt(dto.lopHocId) },
        },
        include: { buoiHoc: true },
      }),
      this.prisma.ketQuaHocTap.findUnique({
        where: {
          lopHocId_hocVienId: {
            lopHocId: BigInt(dto.lopHocId),
            hocVienId: BigInt(dto.hocVienId),
          },
        },
      }),
    ]);

    if (!student) throw new NotFoundException('Không tìm thấy hồ sơ học viên.');
    if (!lopHoc) throw new NotFoundException('Không tìm thấy thông tin lớp học.');

    // Tính toán số liệu chuyên cần thực tế (Ground Truth)
    const totalSessions = attendances.length;
    const presentSessions = attendances.filter((a) => a.trangThai === 'CO_MAT').length;
    const absentSessions = attendances.filter((a) => a.trangThai === 'VANG').length;
    const lateSessions = attendances.filter((a) => a.trangThai === 'DI_MUON').length;
    const excusedSessions = attendances.filter((a) => a.trangThai === 'CO_PHEP').length;
    const attendanceRate = totalSessions > 0 ? ((presentSessions / totalSessions) * 100).toFixed(1) : '100';

    // Xác định giai đoạn tiến độ học tập thực tế
    let giaiDoan = 'DANG_HOC_DAU_KHOA';
    let giaiDoanText = 'Đang học giai đoạn đầu (Chưa có điểm kiểm tra)';
    if (grade?.diemCuoiKy != null || grade?.diemTongKet != null) {
      giaiDoan = 'DA_TONG_KET_CUOI_KHOA';
      giaiDoanText = 'Đã hoàn thành và tổng kết khóa học';
    } else if (grade?.diemGiuaKy != null) {
      giaiDoan = 'GIUA_KHOA_HOC';
      giaiDoanText = 'Đang ở giai đoạn giữa khóa (Đã có điểm thi giữa kỳ 30%)';
    } else if (grade?.diemChuyenCan != null) {
      giaiDoan = 'DA_CO_DIEM_CHUYEN_CAN';
      giaiDoanText = 'Đang tích lũy điểm chuyên cần (Chưa thi giữa kỳ/cuối kỳ)';
    }

    const duLieuGoc = {
      giaiDoan,
      giaiDoanText,
      tongBuoiHoc: totalSessions,
      coMat: presentSessions,
      vang: absentSessions,
      diMuon: lateSessions,
      coPhep: excusedSessions,
      tyLeChuyenCan: `${attendanceRate}%`,
      diemChuyenCan: grade?.diemChuyenCan != null ? Number(grade.diemChuyenCan) : null,
      diemGiuaKy: grade?.diemGiuaKy != null ? Number(grade.diemGiuaKy) : null,
      diemCuoiKy: grade?.diemCuoiKy != null ? Number(grade.diemCuoiKy) : null,
      diemTongKet: grade?.diemTongKet != null ? Number(grade.diemTongKet) : null,
      xepLoai: grade?.trangThaiHoanThanh || 'CHUA_XEP_LOAI',
      nhanXetGiaoVien: grade?.nhanXet || null,
    };

    const prompt = `
Bạn là Trợ lý AI Phân tích Học tập của Trung tâm Anh ngữ ETC.
Dữ liệu học tập thực tế (Ground Truth) của học viên:
- Họ và tên: ${student.hoTen} (Mã HV: ${student.maHocVien}, Trình độ: ${student.trinhDoCEFR})
- Lớp học: ${lopHoc.tenLopHoc} (${lopHoc.maLopHoc}) - Khóa học: ${lopHoc.khoaHoc?.tenKhoaHoc || ''}
- Giai đoạn học tập hiện tại: ${giaiDoanText}
- Chuyên cần: ${presentSessions}/${totalSessions} buổi tham gia (${attendanceRate}%), Vắng: ${absentSessions} buổi, Đi muộn: ${lateSessions} buổi, Có phép: ${excusedSessions} buổi.
- Điểm chuyên cần (20%): ${grade?.diemChuyenCan != null ? grade.diemChuyenCan : 'Chưa có'}
- Điểm giữa kỳ (30%): ${grade?.diemGiuaKy != null ? grade.diemGiuaKy : 'Chưa thi'}
- Điểm cuối kỳ (50%): ${grade?.diemCuoiKy != null ? grade.diemCuoiKy : 'Chưa thi'}
- Điểm tổng kết: ${grade?.diemTongKet != null ? grade.diemTongKet : 'Chưa tổng kết (Khóa đang diễn ra)'}
- Trạng thái hoàn thành: ${grade?.trangThaiHoanThanh ?? 'CHUA_XEP_LOAI'}
- Nhận xét của giáo viên: ${grade?.nhanXet || 'Chưa có nhận xét riêng'}

YÊU CẦU ĐẶC BIỆT:
1. Nhận diện chính xác giai đoạn học tập (${giaiDoanText}):
   - Nếu học viên đang ở giai đoạn giữa kỳ (chưa có điểm cuối kỳ): Đánh giá phong độ dựa trên chuyên cần và điểm giữa kỳ; phân tích cơ hội và mục tiêu điểm cần đạt ở bài thi cuối khóa (hệ số 50%) để đạt kết quả cao.
   - Nếu học viên đã hoàn thành khóa học: Đánh giá toàn diện kết quả đạt/không đạt.
   - Nếu học viên mới bắt đầu: Khích lệ tinh thần chuyên cần và định hướng phương pháp học tập.
2. Tuyệt đối trung thực với dữ liệu số, không bịa đặt cột điểm chưa thi.

Trả về định dạng JSON hợp lệ:
{
  "diemManh": "Phân tích điểm mạnh về thái độ học tập, chuyên cần hoặc kết quả giữa kỳ đạt được...",
  "canKhacPhuc": "Chỉ ra các điểm yếu hoặc lưu ý để chuẩn bị cho giai đoạn tiếp theo...",
  "loiKhuyen": "Lời khuyên lộ trình ôn tập cụ thể cho bài thi/giai đoạn tiếp theo...",
  "tomTatChung": "Đoạn nhận xét tổng quan ngắn gọn 1-2 câu về tiến độ hiện tại."
}
`;

    let rawOutput: string | null = null;
    let aiInsights: any = null;
    let status: TrangThaiYeuCauAI = TrangThaiYeuCauAI.THANH_CONG;

    try {
      rawOutput = await this.callGeminiWithTimeout(
        this.configService.get('GEMINI_PRO_MODEL') || 'gemini-3.6-flash',
        prompt,
      );

      const cleaned = rawOutput.replace(/```json/g, '').replace(/```/g, '').trim();
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (parsed.diemManh && parsed.canKhacPhuc && parsed.loiKhuyen) {
          aiInsights = parsed;
        }
      }

      if (!aiInsights) throw new Error('PARSE_ERROR');
    } catch (error: any) {
      this.logger.warn('AI Tóm tắt thất bại, kích hoạt Rule-Based Fallback:', error?.message);
      status = error?.message === 'TIMEOUT' ? TrangThaiYeuCauAI.TIMEOUT : TrangThaiYeuCauAI.FALLBACK_APPLIED;

      // RULE-BASED FALLBACK TỔNG HỢP THEO QUY TẮC ĐỐI SOÁT CHUẨN
      const isMidterm = grade?.diemGiuaKy != null && grade?.diemCuoiKy == null;
      aiInsights = {
        diemManh:
          Number(attendanceRate) >= 80
            ? `Học viên duy trì tỷ lệ chuyên cần xuất sắc (${attendanceRate}%), tích cực tham gia các buổi học.`
            : `Học viên đã tham gia ${presentSessions} buổi học trong chương trình.`,
        canKhacPhuc:
          Number(attendanceRate) < 80
            ? `Tỷ lệ chuyên cần hiện tại (${attendanceRate}%) chưa đạt chuẩn tối thiểu 80%. Cần đi học đầy đủ để đảm bảo điều kiện hoàn thành khóa.`
            : grade?.diemGiuaKy != null && Number(grade.diemGiuaKy) < 60
            ? `Điểm giữa kỳ (${grade.diemGiuaKy}/100) còn thấp, cần ôn tập thêm để kéo điểm ở kỳ thi cuối khóa.`
            : `Cần chủ động luyện tập tương tác phản xạ nhiều hơn trong các giờ học kỹ năng.`,
        loiKhuyen: isMidterm
          ? `Học viên đang ở giai đoạn giữa khóa. Cần tập trung ôn luyện các chủ điểm ngữ pháp và từ vựng trọng tâm để chuẩn bị cho bài thi cuối kỳ (chiếm 50% tổng số điểm).`
          : `Tập trung ôn tập theo chuẩn khung CEFR ${student.trinhDoCEFR}, tích cực hoàn thành các bài tập trắc nghiệm AI.`,
        tomTatChung: isMidterm
          ? `Học viên đã hoàn thành giai đoạn giữa khóa với điểm giữa kỳ: ${grade?.diemGiuaKy}/100 và chuyên cần ${attendanceRate}%. Đang trong tiến trình hướng đến bài thi cuối khóa.`
          : `Học viên tham gia ${presentSessions}/${totalSessions} buổi học (${attendanceRate}% chuyên cần). ${
              grade?.diemTongKet != null
                ? `Điểm tổng kết đạt ${grade.diemTongKet}/100 (${grade.trangThaiHoanThanh === 'DAT' ? 'ĐẠT' : 'KHÔNG ĐẠT'}).`
                : 'Đang trong quá trình tích lũy điểm đánh giá kết quả học tập.'
            }`,
      };
    }

    const duration = Date.now() - startTime;
    await this.logAiRequest(
      userId,
      LoaiChucNangAI.TOM_TAT_TIEN_DO,
      prompt,
      rawOutput,
      { duLieuGoc, aiInsights },
      status,
      duration,
    );

    return {
      success: true,
      mode: status === TrangThaiYeuCauAI.THANH_CONG ? 'AI_GEMINI' : 'RULE_BASED_FALLBACK',
      data: {
        hocVien: {
          id: Number(student.id),
          maHocVien: student.maHocVien,
          hoTen: student.hoTen,
          trinhDoCEFR: student.trinhDoCEFR,
        },
        lopHoc: {
          id: Number(lopHoc.id),
          maLopHoc: lopHoc.maLopHoc,
          tenLopHoc: lopHoc.tenLopHoc,
          tenKhoaHoc: lopHoc.khoaHoc?.tenKhoaHoc || '',
        },
        duLieuGoc,
        aiPhanTich: aiInsights,
      },
    };
  }
}
