import { Injectable, Logger } from '@nestjs/common';
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
   * UC013 — AI Sinh bài luyện tập trắc nghiệm (Tùy chọn 5, 10, 15 câu, Validation & Fallback đề mẫu)
   */
  async generateExercises(dto: GenerateExercisesDto, userId: number) {
    const startTime = Date.now();
    const count = dto.soLuong && [5, 10, 15].includes(Number(dto.soLuong)) ? Number(dto.soLuong) : 5;

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

      // FALLBACK ĐỀ MẪU TĨNH ĐA DẠNG THEO CHỦ ĐỀ & KHUNG CEFR
      validatedJson = getFallbackExercises(dto.chuDe, dto.trinhDo);
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
   * UC014 — AI Tóm tắt tiến độ học tập (có Audit Log & Fallback tóm tắt quy tắc)
   */
  async summarizeProgress(dto: SummarizeProgressDto, userId: number) {
    const startTime = Date.now();

    const [student, attendances, grade] = await Promise.all([
      this.prisma.hoSoHocVien.findUnique({
        where: { id: BigInt(dto.hocVienId) },
        select: { hoTen: true, trinhDoCEFR: true },
      }),
      this.prisma.banGhiDiemDanh.findMany({
        where: {
          hocVienId: BigInt(dto.hocVienId),
          buoiHoc: { lopHocId: BigInt(dto.lopHocId) },
        },
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

    const totalSessions = attendances.length;
    const presentSessions = attendances.filter((a) => a.trangThai === 'CO_MAT').length;
    const absentSessions = attendances.filter((a) => a.trangThai === 'VANG').length;
    const attendanceRate = totalSessions > 0 ? ((presentSessions / totalSessions) * 100).toFixed(1) : '100';

    const prompt = `
Bạn là trợ lý học tập thông minh của ETC English.
Dữ liệu học tập của học viên ${student?.hoTen || 'Học viên'}:
- Tỷ lệ chuyên cần: ${attendanceRate}% (Có mặt ${presentSessions}/${totalSessions} buổi, Vắng ${absentSessions} buổi)
- Điểm chuyên cần: ${grade?.diemChuyenCan ?? 'Chưa có'}
- Điểm giữa kỳ: ${grade?.diemGiuaKy ?? 'Chưa có'}
- Điểm cuối kỳ: ${grade?.diemCuoiKy ?? 'Chưa có'}
- Điểm tổng kết: ${grade?.diemTongKet ?? 'Chưa có'}
- Xếp loại hiện tại: ${grade?.trangThaiHoanThanh ?? 'Chưa xếp loại'}

YÊU CẦU:
Tóm tắt ngắn gọn tiến độ học tập (dưới 150 từ) gồm 3 phần:
1. Điểm mạnh nổi bật.
2. Điểm cần khắc phục.
3. Lời khuyên ôn tập cho kỳ tới.
TUYỆT ĐỐI CHỈ DỰA TRÊN DỮ LIỆU ĐƯỢC CUNG CẤP, KHÔNG TỰ BỊA ĐẶT.
`;

    let rawOutput: string | null = null;
    let summaryText = '';
    let status: TrangThaiYeuCauAI = TrangThaiYeuCauAI.THANH_CONG;

    try {
      rawOutput = await this.callGeminiWithTimeout(
        this.configService.get('GEMINI_PRO_MODEL') || 'gemini-3.6-flash',
        prompt,
      );
      summaryText = rawOutput;
    } catch (error: any) {
      this.logger.warn('AI Tóm tắt thất bại, áp dụng Fallback tổng hợp:', error?.message);
      status = error?.message === 'TIMEOUT' ? TrangThaiYeuCauAI.TIMEOUT : TrangThaiYeuCauAI.FALLBACK_APPLIED;

      // FALLBACK NHẬN XÉT TỔNG HỢP THEO QUY TẮC
      summaryText = `Học viên tham gia ${presentSessions}/${totalSessions} buổi học (Chuyên cần: ${attendanceRate}%). Điểm giữa kỳ: ${grade?.diemGiuaKy ?? 'Chưa thi'}, Điểm cuối kỳ: ${grade?.diemCuoiKy ?? 'Chưa thi'}. ${Number(attendanceRate) >= 80 ? 'Duy trì tốt tỷ lệ chuyên cần.' : 'Cần chú ý tham gia đầy đủ các buổi học để đảm bảo điều kiện hoàn thành khóa.'}`;
    }

    const duration = Date.now() - startTime;
    await this.logAiRequest(
      userId,
      LoaiChucNangAI.TOM_TAT_TIEN_DO,
      prompt,
      rawOutput,
      { summary: summaryText },
      status,
      duration,
    );

    return {
      success: true,
      mode: status === TrangThaiYeuCauAI.THANH_CONG ? 'AI_GEMINI' : 'RULE_BASED_FALLBACK',
      data: {
        hocVien: student?.hoTen,
        chuyenCan: `${attendanceRate}%`,
        tomTatTienDo: summaryText,
      },
    };
  }
}
