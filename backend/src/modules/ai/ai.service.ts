import { Injectable, Logger, NotFoundException, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
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

  // Anti-spam configuration (Rate Limiting & Cooldown)
  private readonly COOLDOWN_SECONDS = 5; // 5 giây giữa 2 yêu cầu AI liên tiếp
  private readonly MAX_REQUESTS_PER_MINUTE = 10; // Tối đa 10 yêu cầu trong 60 giây
  private userRateLimitMap = new Map<number, { lastRequestTime: number; timestamps: number[] }>();

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

  /**
   * Kiểm tra tính hợp lệ và lọc rác (Sanitization, Anti-Gibberish & Anti-Spam) cho prompt AI
   * Ngăn chặn người dùng nhập chuỗi số vô nghĩa, bàn phím gõ loạn hoặc prompt injection làm tiêu tốn quota token vô ích.
   */
  private validateAiPromptInput(rawInput: string, type: 'TOPIC' | 'GOAL'): string {
    const text = (rawInput || '').trim();
    const fieldName = type === 'TOPIC' ? 'Chủ đề bài tập' : 'Mục tiêu học tập';

    // 1. Kiểm tra độ dài tối thiểu & tối đa
    const minLen = type === 'TOPIC' ? 3 : 5;
    const maxLen = type === 'TOPIC' ? 100 : 300;
    if (text.length < minLen) {
      throw new BadRequestException(
        `${fieldName} quá ngắn! Vui lòng nhập tối thiểu ${minLen} ký tự (Ví dụ: ${
          type === 'TOPIC'
            ? 'Thì hiện tại hoàn thành, Mệnh đề quan hệ...'
            : 'Muốn nâng cao kỹ năng Nói để phỏng vấn xin việc...'
        }).`,
      );
    }
    if (text.length > maxLen) {
      throw new BadRequestException(
        `${fieldName} không được vượt quá ${maxLen} ký tự để tránh lãng phí tài nguyên hệ thống.`,
      );
    }

    // 2. Bắt buộc phải chứa ký tự chữ cái (chặn chuỗi chỉ toàn số hoặc ký tự đặc biệt)
    if (!/[a-zA-ZÀ-ỹ]/.test(text)) {
      throw new BadRequestException(
        `${fieldName} không hợp lệ! Vui lòng nhập bằng từ ngữ có nghĩa thay vì chỉ nhập số hoặc ký hiệu vô nghĩa.`,
      );
    }

    // 3. Chặn chuỗi chứa dãy số dài bất thường (>= 5 chữ số liên tiếp, ví dụ: 12345667764563253252, 213213213213123)
    const longDigitsMatch = text.match(/\d{5,}/);
    if (longDigitsMatch) {
      throw new BadRequestException(
        `${fieldName} chứa dãy số không phù hợp ("${longDigitsMatch[0]}"). Vui lòng nhập nội dung tiếng Anh hoặc mục tiêu học tập rõ ràng.`,
      );
    }

    // 4. Chặn chữ dính liền với >= 3 số không có dấu cách (ví dụ: aiúdhiuahsd2312321, àbbabsđáh213123)
    const gluedMatch = text.match(/[a-zA-ZÀ-ỹ]+\d{3,}|\d{3,}[a-zA-ZÀ-ỹ]+/i);
    if (gluedMatch) {
      throw new BadRequestException(
        `Phát hiện chuỗi ký tự và số dính liền vô nghĩa ("${gluedMatch[0]}"). Vui lòng nhập từ ngữ học tập thực tế.`,
      );
    }

    // 5. Chặn ký tự lặp vô nghĩa (ví dụ: aaaaa, zzzzz, 1111)
    if (/(.)\1{3,}/i.test(text)) {
      throw new BadRequestException(
        `${fieldName} chứa chuỗi ký tự lặp vô nghĩa! Vui lòng nhập nội dung ôn tập tiếng Anh thực tế.`,
      );
    }

    // 6. Chặn cụm n-gram lặp vô nghĩa (nhóm 2-4 ký tự lặp >= 3 lần, ví dụ: 213213213, asdasdasd, ababab)
    const repeatedNgram = text.match(/(.{2,4})\1{2,}/i);
    if (repeatedNgram) {
      throw new BadRequestException(
        `Phát hiện chuỗi lặp lại vô nghĩa ("${repeatedNgram[0]}"). Vui lòng nhập nội dung học tập thực tế.`,
      );
    }

    // 7. Chặn chuỗi phím gõ loạn phổ biến (Keyboard Mash)
    const KEYBOARD_MASH_PATTERNS = /(?:asdf|sdfg|dfgh|fghj|ghjk|hjkl|jkl;|qwerty|werty|ertyu|rtyui|tyuio|yuio|zxcv|xcvb|cvbn|vbnm)/i;
    if (KEYBOARD_MASH_PATTERNS.test(text)) {
      throw new BadRequestException(
        `Phát hiện chuỗi gõ loạn phím không có nghĩa. Vui lòng nhập nội dung học tiếng Anh thực tế.`,
      );
    }

    // 8. Chặn từ quá dài không dấu cách hoặc chứa cụm phụ âm bất thường
    const words = text.split(/\s+/);
    for (const word of words) {
      const cleanWord = word.replace(/[^a-zA-ZÀ-ỹ]/g, '').toLowerCase();
      // Từ đơn quá dài không có dấu gạch ngang (>= 15 ký tự)
      if (cleanWord.length >= 15 && !word.includes('-')) {
        throw new BadRequestException(
          `Phát hiện từ không hợp lệ quá dài: "${word}". Vui lòng nhập nội dung tiếng Anh hoặc tiếng Việt rõ nghĩa.`,
        );
      }
      // Cụm phụ âm liên tiếp >= 5 phụ âm (gõ loạn phím)
      if (/[bcdfghjklmnpqrstvwxyz]{5,}/i.test(cleanWord)) {
        throw new BadRequestException(
          `Phát hiện từ chứa chuỗi phụ âm bất thường: "${word}". Vui lòng nhập từ ngữ học tập hợp lệ.`,
        );
      }
      // Từ dài >= 6 ký tự nhưng không có nguyên âm nào
      if (cleanWord.length >= 6) {
        const hasVowels = /[aeiouyáàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵ]/.test(cleanWord);
        if (!hasVowels) {
          throw new BadRequestException(`Phát hiện từ không có nghĩa: "${word}". Vui lòng nhập nội dung hợp lệ.`);
        }
      }
    }

    // 9. Chặn Prompt Injection / Hack / Jailbreak
    const INJECTION_PATTERNS = [
      /ignore\s+(all\s+)?(previous\s+)?instructions/i,
      /system\s+prompt/i,
      /jailbreak/i,
      /dan\s+mode/i,
      /developer\s+mode/i,
      /override\s+instructions/i,
      /bỏ\s+qua\s+(toàn\s+bộ\s+)?(chỉ\s+thị|chỉ\s+dẫn|câu\s+lệnh)/i,
      /đóng\s+vai/i,
      /roleplay\s+as/i,
      /delete\s+from/i,
      /drop\s+table/i,
      /hack\s+system/i,
    ];

    for (const pattern of INJECTION_PATTERNS) {
      if (pattern.test(text)) {
        throw new BadRequestException(`${fieldName} vi phạm chính sách an toàn của hệ thống (Prompt Injection bị chặn).`);
      }
    }

    return text;
  }

  private validateTopic(rawTopic: string): string {
    return this.validateAiPromptInput(rawTopic, 'TOPIC');
  }

  /**
   * Kiểm tra cơ chế chống spam (Rate Limiting & Cooldown) cho các tác vụ AI
   */
  private checkAntiSpam(userId: number): void {
    if (!userId) return;
    const now = Date.now();
    const userLog = this.userRateLimitMap.get(userId);

    if (userLog) {
      // 1. Kiểm tra Cooldown liên tiếp (5s)
      const elapsedSeconds = (now - userLog.lastRequestTime) / 1000;
      if (elapsedSeconds < this.COOLDOWN_SECONDS) {
        const remaining = Math.ceil(this.COOLDOWN_SECONDS - elapsedSeconds);
        throw new HttpException(
          {
            statusCode: HttpStatus.TOO_MANY_REQUESTS,
            message: `Bạn đang gửi yêu cầu AI quá nhanh! Vui lòng chờ thêm ${remaining}s trước khi thử lại.`,
            retryAfter: remaining,
          },
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }

      // 2. Kiểm tra Sliding Window (Tối đa 10 yêu cầu trong 60 giây)
      const oneMinuteAgo = now - 60000;
      const recentTimestamps = userLog.timestamps.filter((ts) => ts > oneMinuteAgo);

      if (recentTimestamps.length >= this.MAX_REQUESTS_PER_MINUTE) {
        const oldestRecent = recentTimestamps[0];
        const waitTime = Math.ceil((oldestRecent + 60000 - now) / 1000);
        throw new HttpException(
          {
            statusCode: HttpStatus.TOO_MANY_REQUESTS,
            message: `Bạn đã thực hiện ${this.MAX_REQUESTS_PER_MINUTE} yêu cầu AI trong 1 phút. Vui lòng đợi ${waitTime}s để hệ thống hồi phục.`,
            retryAfter: waitTime,
          },
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }

      recentTimestamps.push(now);
      this.userRateLimitMap.set(userId, {
        lastRequestTime: now,
        timestamps: recentTimestamps,
      });
    } else {
      this.userRateLimitMap.set(userId, {
        lastRequestTime: now,
        timestamps: [now],
      });
    }

    // Dọn dẹp cache nếu có nhiều hơn 500 người dùng
    if (this.userRateLimitMap.size > 500) {
      const expiry = now - 120000;
      for (const [id, log] of this.userRateLimitMap.entries()) {
        if (log.lastRequestTime < expiry) {
          this.userRateLimitMap.delete(id);
        }
      }
    }
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
   * Wrapper gọi Gemini API có timeout và hỗ trợ Structured JSON Mode
   */
  private async callGeminiWithTimeout(model: string, prompt: string, isJson: boolean = true): Promise<string> {
    if (!this.ai) {
      throw new Error('GEMINI_API_KEY chưa được cấu hình hoặc không hợp lệ.');
    }

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('TIMEOUT')), this.timeoutMs),
    );

    const apiCallPromise = this.ai.models.generateContent({
      model,
      contents: prompt,
      ...(isJson ? { config: { responseMimeType: 'application/json' } } : {}),
    });

    const response = await Promise.race([apiCallPromise, timeoutPromise]);
    return response.text || '';
  }

  /**
   * UC012 — AI Tư vấn lớp học phù hợp (có Validation lọc ảo giác & Fallback Rule-based)
   */
  async consultClasses(dto: ConsultClassDto, userId: number) {
    this.checkAntiSpam(userId);
    if (dto.mucTieu && dto.mucTieu.trim().length > 0) {
      dto.mucTieu = this.validateAiPromptInput(dto.mucTieu, 'GOAL');
    }
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

    const defaultSoSanh = `Đối chiếu giữa các lớp đề xuất: Các lớp học đều được tuyển chọn sát với trình độ CEFR ${dto.cefr} và khung lịch rảnh của bạn. Lớp có độ tương thích cao nhất tối ưu thời gian biểu và đảm bảo khả năng tiếp thu cân bằng giữa Ngữ pháp và Phản xạ thực chiến. Bạn nên ưu tiên lớp có lịch học cố định phù hợp nhất với quỹ thời gian tuần của mình.`;

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
4. So sánh đối chiếu (soSanhLopHoc): Phân tích ngắn gọn ưu và nhược điểm đối chiếu giữa các lớp được đề xuất (về lịch học, đối tượng, trọng tâm kỹ năng), gợi ý lớp học phù hợp nhất với mục tiêu của học viên.
5. Trả về đúng định dạng JSON:
{
  "danhSachLop": [
    {
      "maLopHoc": "...",
      "tenLopHoc": "...",
      "doTuongThich": 95,
      "lyDoPhuHop": "...",
      "diemNoiBat": "...",
      "loTrinhKhuyenNghi": "..."
    }
  ],
  "soSanhLopHoc": "..."
}
`;

    let rawOutput: string | null = null;
    let validatedRecommendations: any[] = [];
    let soSanhLopHoc: string = defaultSoSanh;
    let status: TrangThaiYeuCauAI = TrangThaiYeuCauAI.THANH_CONG;

    try {
      rawOutput = await this.callGeminiWithTimeout(
        this.configService.get('GEMINI_FLASH_MODEL') || 'gemini-3.6-flash',
        prompt,
      );

      // Parse JSON
      const cleaned = rawOutput.replace(/```json/g, '').replace(/```/g, '').trim();
      let parsed: any = null;
      try {
        parsed = JSON.parse(cleaned);
      } catch {
        const objMatch = cleaned.match(/\{[\s\S]*\}/);
        const arrMatch = cleaned.match(/\[[\s\S]*\]/);
        if (objMatch) {
          try { parsed = JSON.parse(objMatch[0]); } catch {}
        }
        if (!parsed && arrMatch) {
          try { parsed = JSON.parse(arrMatch[0]); } catch {}
        }
      }

      let rawClasses: any[] = [];
      if (parsed) {
        if (Array.isArray(parsed)) {
          rawClasses = parsed;
        } else if (typeof parsed === 'object') {
          if (Array.isArray(parsed.danhSachLop)) {
            rawClasses = parsed.danhSachLop;
          } else if (Array.isArray(parsed.recommendations)) {
            rawClasses = parsed.recommendations;
          }

          if (typeof parsed.soSanhLopHoc === 'string' && parsed.soSanhLopHoc.trim()) {
            soSanhLopHoc = parsed.soSanhLopHoc.trim();
          } else if (parsed.insights?.soSanhLopHoc) {
            soSanhLopHoc = parsed.insights.soSanhLopHoc.trim();
          }
        }
      }

      if (rawClasses.length > 0) {
        // HẬU KIỂM TRA (Post-Validation): Lọc ảo giác — chỉ giữ lại lớp có trong DB
        validatedRecommendations = rawClasses
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
      soSanhLopHoc = defaultSoSanh;

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
      { recommendations: validatedRecommendations, soSanhLopHoc },
      status,
      duration,
    );

    return {
      success: true,
      mode: status === TrangThaiYeuCauAI.THANH_CONG ? 'AI_GEMINI' : 'RULE_BASED_FALLBACK',
      data: validatedRecommendations,
      soSanhLopHoc,
      insights: { soSanhLopHoc },
    };
  }

  /**
   * UC013 — AI Sinh bài luyện tập trắc nghiệm (Smart Caching + Gemini API + Fallback)
   */
  async generateExercises(dto: GenerateExercisesDto, userId: number) {
    this.checkAntiSpam(userId);
    const cleanTopic = this.validateTopic(dto.chuDe);
    dto.chuDe = cleanTopic;
    const startTime = Date.now();
    const count = dto.soLuong && [5, 10, 15].includes(Number(dto.soLuong)) ? Number(dto.soLuong) : 5;

    // GỌI GOOGLE GEMINI FLASH VỚI UNIQUE SESSION NONCE ĐỂ LUÔN TẠO BỘ ĐỀ MỚI MẺ
    const sessionNonce = `${Date.now()}_${Math.floor(Math.random() * 10000)}`;
    const formatInstruction =
      dto.loaiCauHoi === 'TRUE_FALSE'
        ? 'Tất cả các câu hỏi phải ở dạng ĐÚNG / SAI (True/False): trường "luaChon" BẮT BUỘC CHỈ CÓ ĐÚNG 2 LỰA CHỌN là {"A": "True", "B": "False"} (hoặc {"A": "True (Đúng)", "B": "False (Sai)"}). TUYỆT ĐỐI KHÔNG ĐƯỢC THÊM C, D (không tạo Not Given, None). "dapAnDung" bắt buộc chỉ là "A" hoặc "B", "loaiCauHoi": "TRUE_FALSE".'
        : dto.loaiCauHoi === 'MULTIPLE'
        ? 'Tất cả các câu hỏi phải ở dạng CHỌN NHIỀU ĐÁP ÁN ĐÚNG: trường "luaChon" gồm 4 lựa chọn {A, B, C, D}, "dapAnDung" là mảng gồm 2 hoặc 3 đáp án đúng (ví dụ: ["A", "C"]), "loaiCauHoi": "MULTIPLE". Cuối noiDung câu hỏi ghi rõ "(Chọn tất cả đáp án đúng)".'
        : dto.loaiCauHoi === 'SINGLE'
        ? 'Tất cả các câu hỏi ở dạng TRẮC NGHIỆM 1 ĐÁP ÁN ĐÚNG: trường "luaChon" gồm 4 lựa chọn {A, B, C, D}, "dapAnDung" là 1 ký tự ("A"|"B"|"C"|"D"), "loaiCauHoi": "SINGLE".'
        : 'Hãy tạo bài tập HỖN HỢP đa dạng gồm: trắc nghiệm 1 đáp án ("SINGLE" có 4 lựa chọn A, B, C, D), câu hỏi Đúng/Sai ("TRUE_FALSE" với BẮT BUỘC CHỈ 2 LỰA CHỌN là "A": "True" và "B": "False", TUYỆT ĐỐI KHÔNG ĐƯỢC THÊM C, D), và câu hỏi chọn nhiều đáp án đúng ("MULTIPLE" với dapAnDung là mảng như ["A", "C"]).';

    const prompt = `
Bạn là giáo viên tiếng Anh chuyên nghiệp.
Nhiệm vụ: Sinh 01 bài luyện tập trắc nghiệm HOÀN TOÀN MỚI VÀ KHÁC BIỆT, gồm đúng ${count} câu về chủ đề "${dto.chuDe}", độ khó chuẩn CEFR "${dto.trinhDo}".
Mã phiên sinh đề ngẫu nhiên: #${sessionNonce}.

YÊU CẦU DẠNG CÂU HỎI:
${formatInstruction}

RÀNG BUỘC NGHIÊM NGẶT:
- Các câu hỏi phải sáng tạo, câu từ và ngữ cảnh mới mẻ, không trùng lặp các câu hỏi thông dụng trước đó.
- BẮT BUỘC CHỈ SINH CHÍNH XÁC ĐÚNG ${count} CÂU HỎI (không nhiều hơn dù chỉ 1 câu, không ít hơn). Mảng "cauHoi" trong JSON phải có đúng ${count} phần tử.
- Đúng ${count} câu hỏi được đánh số id tuần tự từ 1 đến ${count}.
- QUY TẮC BẮT BUỘC: Với câu hỏi Đúng/Sai (True/False), "luaChon" CHỈ ĐƯỢC CÓ 2 ĐÁP ÁN A VÀ B (True và False), KHÔNG ĐƯỢC TẠO C, D.
- BẮT BUỘC GIẢI THÍCH CHI TIẾT CẢ ĐÁP ÁN ĐÚNG LẪN CÁC PHƯƠNG ÁN SAI:
  + "giaiThich": Trình bày đầy đủ cả 2 phần:
    (1) Lý do đáp án đúng là đúng (giải thích ngữ pháp, từ vựng, ngữ cảnh).
    (2) Phân tích vì sao các phương án còn lại là sai (chỉ ra cụ thể lỗi ngữ pháp, sai ngữ nghĩa hoặc sai thì của từng phương án sai).
  + "giaiThichChiTiet": Object giải thích cụ thể cho từng lựa chọn A, B, C, D (ví dụ: {"A": "...", "B": "...", "C": "...", "D": "..."} hoặc {"A": "...", "B": "..."} cho câu Đúng/Sai).
- Trả về JSON hợp lệ:
{
  "chuDe": "${dto.chuDe}",
  "trinhDo": "${dto.trinhDo}",
  "cauHoi": [
    {
      "id": 1,
      "noiDung": "...",
      "loaiCauHoi": "SINGLE" | "TRUE_FALSE" | "MULTIPLE",
      "luaChon": { "A": "...", "B": "..." },
      "dapAnDung": "A" hoặc ["A", "C"],
      "giaiThich": "✓ Giải thích đáp án đúng: ... ✗ Phân tích các phương án sai: ...",
      "giaiThichChiTiet": {
        "A": "Lý do lựa chọn A...",
        "B": "Lý do lựa chọn B..."
      }
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
          let questions = parsed.cauHoi.map((q: any, idx: number) => {
            let loai = q.loaiCauHoi;
            let dapAn = q.dapAnDung;

            if (typeof dapAn === 'string' && dapAn.includes(',')) {
              dapAn = dapAn.split(',').map((x: string) => x.trim().toUpperCase());
              loai = 'MULTIPLE';
            }

            if (!loai) {
              if (Array.isArray(dapAn)) {
                loai = 'MULTIPLE';
              } else if (
                (q.luaChon && Object.keys(q.luaChon).length === 2) ||
                (typeof q.noiDung === 'string' &&
                  (q.noiDung.includes('(True or False)') ||
                    q.noiDung.includes('True/False') ||
                    q.noiDung.includes('(Đúng hay Sai)')))
              ) {
                loai = 'TRUE_FALSE';
              } else {
                loai = 'SINGLE';
              }
            }

            const isTF =
              loai === 'TRUE_FALSE' ||
              (typeof q.noiDung === 'string' &&
                (q.noiDung.includes('(True or False)') ||
                  q.noiDung.includes('True/False') ||
                  q.noiDung.includes('(Đúng hay Sai)')));

            let finalLuaChon = q.luaChon || {};

            if (isTF) {
              loai = 'TRUE_FALSE';
              // BẮT BUỘC CHỈ GIỮ ĐÚNG 2 LỰA CHỌN A VÀ B, CẮT BỎ C VÀ D
              const trueVal =
                finalLuaChon['A'] || finalLuaChon['True'] || finalLuaChon['TRUE'] || 'True';
              const falseVal =
                finalLuaChon['B'] || finalLuaChon['False'] || finalLuaChon['FALSE'] || 'False';
              finalLuaChon = {
                A: typeof trueVal === 'string' && trueVal.toLowerCase().includes('true') ? trueVal : 'True',
                B: typeof falseVal === 'string' && falseVal.toLowerCase().includes('false') ? falseVal : 'False',
              };

              let d = typeof dapAn === 'string' ? dapAn.trim().toUpperCase() : 'A';
              if (d.includes('TRUE')) d = 'A';
              else if (d.includes('FALSE')) d = 'B';
              else if (d !== 'A' && d !== 'B') d = 'A';
              dapAn = d;
            }

            return {
              id: q.id || idx + 1,
              noiDung: q.noiDung || '',
              loaiCauHoi: loai,
              luaChon: finalLuaChon,
              dapAnDung: dapAn,
              giaiThich: q.giaiThich || '',
              giaiThichChiTiet: q.giaiThichChiTiet || null,
            };
          });

          // ÉP BUỘC CHÍNH XÁC SỐ LƯỢNG CÂU HỎI (EXACT COUNT CLAMPING)
          if (questions.length > count) {
            // Nếu Gemini sinh thừa (ví dụ yêu cầu 10 nhưng sinh 12), cắt bỏ các câu dư thừa
            questions = questions.slice(0, count);
          } else if (questions.length < count) {
            // Nếu Gemini sinh thiếu câu hỏi (ví dụ yêu cầu 15 nhưng dừng ở 12), bổ sung từ ngân hàng câu hỏi
            const needed = count - questions.length;
            const fallbackSupp = getFallbackExercises(dto.chuDe, dto.trinhDo, needed, dto.loaiCauHoi);
            const existingTexts = new Set(questions.map((q: any) => (q.noiDung || '').trim().toLowerCase()));
            const suppQuestions = fallbackSupp.cauHoi.filter(
              (q) => !existingTexts.has((q.noiDung || '').trim().toLowerCase()),
            );
            questions = [...questions, ...suppQuestions].slice(0, count);
          }

          parsed.cauHoi = questions.map((q: any, idx: number) => ({
            ...q,
            id: idx + 1,
          }));
          validatedJson = parsed;
        }
      }

      if (!validatedJson) throw new Error('PARSE_ERROR');
    } catch (error: any) {
      this.logger.warn('AI Gemini sinh bài tập gặp sự cố:', error?.message);
      status = error?.message === 'TIMEOUT' ? TrangThaiYeuCauAI.TIMEOUT : TrangThaiYeuCauAI.FALLBACK_APPLIED;

      // 1. TÌM KIẾM TRONG KHO DỮ LIỆU ĐỀ ĐÃ TẠO TỪ CÁC LẦN SINH ĐỀ TRƯỚC (COMMUNITY AI CACHE)
      let matchedCommunity: any = null;
      try {
        matchedCommunity = await this.findCommunityExerciseMatch(dto.chuDe, dto.trinhDo, count);
      } catch (e: any) {
        this.logger.error('Lỗi tra cứu đề bài từ kho cộng đồng:', e?.message);
      }

      if (matchedCommunity) {
        this.logger.log(`[AI FALLBACK] Tận dụng đề bài tương thích đã tạo từ kho cộng đồng cho chủ đề "${dto.chuDe}"`);
        validatedJson = matchedCommunity;
      } else {
        // 2. NẾU CHƯA TỪNG CÓ AI TẠO CHỦ ĐỀ NÀY (HOẶC ĐÃ BỊ XÓA HẾT), SỬ DỤNG BỘ ĐỀ MẪU SEED FALLBACK
        this.logger.log(`[AI FALLBACK] Chưa có ai tạo đề tương tự cho "${dto.chuDe}", áp dụng bộ đề mẫu dự phòng`);
        validatedJson = getFallbackExercises(dto.chuDe, dto.trinhDo, count, dto.loaiCauHoi);
      }
    }

    // ĐẢM BẢO CUỐI CÙNG (TRIPLE SAFETY LOCK): Số lượng câu hỏi BẮT BUỘC bằng đúng count (5, 10 hoặc 15)
    if (validatedJson && Array.isArray(validatedJson.cauHoi)) {
      if (validatedJson.cauHoi.length > count) {
        validatedJson.cauHoi = validatedJson.cauHoi.slice(0, count);
      } else if (validatedJson.cauHoi.length < count) {
        const needed = count - validatedJson.cauHoi.length;
        const fallbackSupp = getFallbackExercises(dto.chuDe, dto.trinhDo, needed, dto.loaiCauHoi);
        const existingTexts = new Set(validatedJson.cauHoi.map((q: any) => (q.noiDung || '').trim().toLowerCase()));
        const additions = fallbackSupp.cauHoi.filter(
          (q) => !existingTexts.has((q.noiDung || '').trim().toLowerCase()),
        );
        validatedJson.cauHoi = [...validatedJson.cauHoi, ...additions].slice(0, count);
      }
      validatedJson.cauHoi = validatedJson.cauHoi.map((q: any, idx: number) => ({
        ...q,
        id: idx + 1,
      }));
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

    const isCommunity = status !== TrangThaiYeuCauAI.THANH_CONG && Boolean(validatedJson?.__isCommunityMatch);
    if (validatedJson?.__isCommunityMatch) {
      delete validatedJson.__isCommunityMatch;
    }

    return {
      success: true,
      mode: status === TrangThaiYeuCauAI.THANH_CONG
        ? 'AI_GEMINI'
        : isCommunity
        ? 'AI_COMMUNITY_CACHE'
        : 'TEMPLATE_FALLBACK',
      data: validatedJson,
    };
  }

  /**
   * UC013 — Lấy lịch sử các bộ đề luyện tập đã sinh của người dùng
   */
  async getExerciseHistory(userId: number, limit: number = 30) {
    const records = await this.prisma.yeuCauAI.findMany({
      where: {
        nguoiDungId: BigInt(userId),
        loaiChucNang: LoaiChucNangAI.SINH_BAI_TAP,
        trangThai: {
          in: [TrangThaiYeuCauAI.THANH_CONG, TrangThaiYeuCauAI.FALLBACK_APPLIED],
        },
      },
      orderBy: { thoiGianGoi: 'desc' },
      take: limit,
      select: {
        id: true,
        thoiGianGoi: true,
        thoiGianXuLyMs: true,
        trangThai: true,
        validatedOutputJson: true,
      },
    });

    const history = records
      .filter((r) => r.validatedOutputJson && typeof r.validatedOutputJson === 'object')
      .map((r) => {
        const json: any = r.validatedOutputJson;
        const cauHoi = Array.isArray(json?.cauHoi) ? json.cauHoi : [];
        return {
          id: Number(r.id),
          thoiGianGoi: r.thoiGianGoi,
          thoiGianXuLyMs: r.thoiGianXuLyMs,
          trangThai: r.trangThai,
          mode: r.trangThai === TrangThaiYeuCauAI.THANH_CONG ? 'AI_GEMINI' : 'TEMPLATE_FALLBACK',
          chuDe: json.chuDe || 'Bài luyện tập tiếng Anh',
          trinhDo: json.trinhDo || 'B1',
          soCau: cauHoi.length,
          data: json,
        };
      });

    return history;
  }

  /**
   * Xóa 1 đề bài tập cụ thể trong lịch sử của người dùng
   */
  async deleteExerciseHistoryItem(userId: number, recordId: number) {
    const record = await this.prisma.yeuCauAI.findFirst({
      where: {
        id: BigInt(recordId),
        nguoiDungId: BigInt(userId),
        loaiChucNang: LoaiChucNangAI.SINH_BAI_TAP,
      },
    });

    if (!record) {
      throw new NotFoundException('Không tìm thấy đề bài tập trong lịch sử hoặc bạn không có quyền xóa.');
    }

    await this.prisma.yeuCauAI.delete({
      where: { id: BigInt(recordId) },
    });

    return {
      success: true,
      message: 'Đã xóa đề bài tập khỏi lịch sử thành công.',
    };
  }

  /**
   * Xóa toàn bộ lịch sử các đề bài tập đã tạo của người dùng
   */
  async clearExerciseHistory(userId: number) {
    const count = await this.prisma.yeuCauAI.count({
      where: {
        nguoiDungId: BigInt(userId),
        loaiChucNang: LoaiChucNangAI.SINH_BAI_TAP,
      },
    });

    if (count === 0) {
      throw new BadRequestException('Bạn chưa từng tạo đề bài tập nào trong lịch sử để xóa.');
    }

    const res = await this.prisma.yeuCauAI.deleteMany({
      where: {
        nguoiDungId: BigInt(userId),
        loaiChucNang: LoaiChucNangAI.SINH_BAI_TAP,
      },
    });

    return {
      success: true,
      count: res.count,
      message: `Đã xóa sạch toàn bộ ${res.count} đề bài tập trong lịch sử.`,
    };
  }

  /**
   * Tìm kiếm bộ đề tương thích từ các lần sinh đề trước đó của bất kỳ người dùng nào trong hệ thống
   * (Chỉ xét các bản ghi còn tồn tại trong DB, chưa bị người dùng xóa)
   */
  private async findCommunityExerciseMatch(
    chuDe: string,
    trinhDo: string,
    count: number,
  ): Promise<any | null> {
    const normTopic = this.normalizeSearchText(chuDe);
    if (!normTopic) return null;

    const pastExercises = await this.prisma.yeuCauAI.findMany({
      where: {
        loaiChucNang: LoaiChucNangAI.SINH_BAI_TAP,
        trangThai: TrangThaiYeuCauAI.THANH_CONG,
        validatedOutputJson: { not: null as any },
      },
      orderBy: { id: 'desc' },
      take: 100,
      select: {
        promptInput: true,
        validatedOutputJson: true,
      },
    });

    for (const record of pastExercises) {
      const json: any = record.validatedOutputJson;
      if (!json || !Array.isArray(json.cauHoi) || json.cauHoi.length === 0) continue;

      const recordTopic = this.normalizeSearchText(json.chuDe || '');
      const recordPrompt = this.normalizeSearchText(record.promptInput || '');

      const isMatch =
        recordTopic === normTopic ||
        (normTopic.length >= 3 && recordTopic.includes(normTopic)) ||
        (recordTopic.length >= 3 && normTopic.includes(recordTopic)) ||
        recordPrompt.includes(normTopic);

      if (isMatch) {
        const cloned = JSON.parse(JSON.stringify(json));
        cloned.chuDe = chuDe;
        cloned.trinhDo = trinhDo || json.trinhDo || 'B1';

        if (cloned.cauHoi.length > count) {
          cloned.cauHoi = cloned.cauHoi.slice(0, count);
        } else if (cloned.cauHoi.length < count) {
          const needed = count - cloned.cauHoi.length;
          const supplement = getFallbackExercises(chuDe, trinhDo, needed);
          const existingTexts = new Set(cloned.cauHoi.map((q: any) => (q.noiDung || '').trim().toLowerCase()));
          const extra = supplement.cauHoi.filter(
            (q) => !existingTexts.has((q.noiDung || '').trim().toLowerCase()),
          );
          cloned.cauHoi = [...cloned.cauHoi, ...extra].slice(0, count);
        }
        cloned.cauHoi = cloned.cauHoi.map((q: any, idx: number) => ({
          ...q,
          id: idx + 1,
        }));
        cloned.__isCommunityMatch = true;
        return cloned;
      }
    }

    return null;
  }

  private normalizeSearchText(text: string): string {
    return (text || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * UC014 — AI Tóm tắt tiến độ học tập (Phân biệt dữ liệu gốc, Zero-Trust Validation & Fallback quy tắc)
   */
  async summarizeProgress(dto: SummarizeProgressDto, userId: number) {
    this.checkAntiSpam(userId);
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
    const attendanceRate = totalSessions > 0 ? ((presentSessions / totalSessions) * 100).toFixed(1) : '0.0';

    // Xác định giai đoạn tiến độ học tập thực tế
    let giaiDoan = 'DANG_HOC_DAU_KHOA';
    let giaiDoanText = totalSessions === 0 ? 'Mới đăng ký (Chưa diễn ra buổi học nào)' : 'Đang học giai đoạn đầu (Chưa có điểm kiểm tra)';
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
      tyLeChuyenCan: totalSessions > 0 ? `${attendanceRate}%` : 'Chưa học',
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
- Chuyên cần: ${totalSessions > 0 ? `${presentSessions}/${totalSessions} buổi tham gia (${attendanceRate}%), Vắng: ${absentSessions} buổi, Đi muộn: ${lateSessions} buổi, Có phép: ${excusedSessions} buổi.` : 'Lớp học chưa bắt đầu / Chưa có buổi học nào được ghi nhận điểm danh.'}
- Điểm chuyên cần (20%): ${grade?.diemChuyenCan != null ? grade.diemChuyenCan : 'Chưa có'}
- Điểm giữa kỳ (30%): ${grade?.diemGiuaKy != null ? grade.diemGiuaKy : 'Chưa thi'}
- Điểm cuối kỳ (50%): ${grade?.diemCuoiKy != null ? grade.diemCuoiKy : 'Chưa thi'}
- Điểm tổng kết: ${grade?.diemTongKet != null ? grade.diemTongKet : 'Chưa tổng kết (Khóa đang diễn ra)'}
- Trạng thái hoàn thành: ${grade?.trangThaiHoanThanh ?? 'CHUA_XEP_LOAI'}
- Nhận xét của giáo viên phụ trách: ${grade?.nhanXet || 'Chưa có nhận xét riêng'}

YÊU CẦU ĐẶC BIỆT (PHÂN TÍCH SƯ PHẠM CHUYÊN SÂU & ĐỊNH HƯỚNG CẢI THIỆN BẢN THÂN):
1. Nhận diện chính xác giai đoạn học tập (${giaiDoanText}):
   - Nếu đang học giữa kỳ: Đánh giá chi tiết cơ hội, tính toán mục tiêu điểm bài thi cuối kỳ (chiếm 50% tổng điểm) cần đạt để bứt phá.
   - Nếu đã hoàn thành khóa học: Đánh giá toàn diện nguyên nhân Đạt hoặc Không Đạt (do chuyên cần thấp <80% hay điểm bài thi dưới chuẩn), rút ra bài học kinh nghiệm sâu sắc.
   - Nếu mới bắt đầu: Khích lệ và nhấn mạnh tầm quan trọng của kỷ luật chuyên cần ngay từ đầu.
2. Nội dung phân tích cần chi tiết, thấu đáo, mang tính hành động cao (Actionable Guidance) để người học cải thiện bản thân:
   - Phân tích rõ nguyên nhân gốc rễ (Root Cause) của điểm số và chuyên cần.
   - Trình bày dạng các gạch đầu dòng (•) rõ ràng, dễ đọc, mạch lạc.
   - Đưa ra lộ trình hành động cụ thể: thời lượng tự học mỗi ngày, các chủ điểm ngữ pháp/từ vựng cốt lõi cần củng cố và cách tận dụng bài tập AI để lấy lại nền tảng.
3. Tuyệt đối trung thực với dữ liệu số CSDL, không bịa đặt điểm số chưa thi.

Trả về đúng định dạng JSON hợp lệ:
{
  "diemManh": "• Thái độ & Kỷ luật: [Nhận xét cụ thể về chuyên cần hoặc tinh thần học tập]\n• Năng lực & Bài thi: [Nhận xét chi tiết về bài kiểm tra đã hoàn thành]\n• Điểm sáng nỗ lực: [Ghi nhận sự cố gắng vượt bậc hoặc tiềm năng của học viên]",
  "canKhacPhuc": "• Nguyên nhân gốc rễ: [Phân tích tác động của các buổi vắng/đi muộn hoặc thiếu hụt kiến thức cơ bản]\n• Điểm nghẽn kỹ năng: [Chỉ rõ phần bài thi/kỹ năng cần gia cố gấp]\n• Rủi ro cần phòng tránh: [Hậu quả nếu không khắc phục sớm ở các khóa học tiếp theo]",
  "loiKhuyen": "• Bước 1 - Củng cố nền tảng: [Chủ điểm ngữ pháp và từ vựng cốt lõi cần ôn lại ngay theo chuẩn CEFR ${student.trinhDoCEFR}]\n• Bước 2 - Kỷ luật rèn luyện: [Kế hoạch phân bổ 30-45 phút tự học mỗi ngày và cách luyện đề trắc nghiệm AI]\n• Bước 3 - Mục tiêu bứt phá: [Chiến lược cụ thể cho kỳ thi cuối kỳ hoặc kế hoạch học tập tiếp theo]",
  "tomTatChung": "[Đoạn nhận định sư phạm tổng thể 2-3 câu ngắn gọn, khách quan, mang tính xây dựng và tiếp thêm động lực cho học viên phấn đấu.]"
}
`;

    // 1. SMART DB CACHE LOOKUP: Trả về kết quả tức thì nếu dữ liệu học tập chưa thay đổi (và không yêu cầu forceRefresh)
    if (!dto.forceRefresh) {
      try {
        const cachedRecord = await this.prisma.yeuCauAI.findFirst({
          where: {
            loaiChucNang: LoaiChucNangAI.TOM_TAT_TIEN_DO,
            trangThai: TrangThaiYeuCauAI.THANH_CONG,
            AND: [
              { promptInput: { contains: student.maHocVien } },
              { promptInput: { contains: lopHoc.maLopHoc } },
            ],
          },
          orderBy: { id: 'desc' },
        });

        if (cachedRecord && cachedRecord.validatedOutputJson) {
          const cached = cachedRecord.validatedOutputJson as any;
          const cachedGroundTruth = cached.duLieuGoc;
          if (
            cachedGroundTruth &&
            cachedGroundTruth.tongBuoiHoc === duLieuGoc.tongBuoiHoc &&
            cachedGroundTruth.coMat === duLieuGoc.coMat &&
            cachedGroundTruth.tyLeChuyenCan === duLieuGoc.tyLeChuyenCan &&
            cachedGroundTruth.diemChuyenCan === duLieuGoc.diemChuyenCan &&
            cachedGroundTruth.diemGiuaKy === duLieuGoc.diemGiuaKy &&
            cachedGroundTruth.diemCuoiKy === duLieuGoc.diemCuoiKy &&
            cachedGroundTruth.diemTongKet === duLieuGoc.diemTongKet
          ) {
            return {
              success: true,
              mode: 'AI_GEMINI_CACHED',
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
                aiPhanTich: cached.aiInsights || cached.aiPhanTich,
              },
            };
          }
        }
      } catch (cacheErr) {
        this.logger.debug('Smart cache lookup skipped:', cacheErr);
      }
    }

    let rawOutput: string | null = null;
    let aiInsights: any = null;
    let status: TrangThaiYeuCauAI = TrangThaiYeuCauAI.THANH_CONG;

    try {
      rawOutput = await this.callGeminiWithTimeout(
        this.configService.get('GEMINI_FLASH_MODEL') || 'gemini-3.7-flash',
        prompt,
        true,
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
          totalSessions === 0
            ? 'Học viên đã hoàn tất ghi danh và sẵn sàng cho các buổi học đầu tiên.'
            : Number(attendanceRate) >= 80
            ? `Học viên duy trì tỷ lệ chuyên cần xuất sắc (${attendanceRate}%), tích cực tham gia các buổi học.`
            : `Học viên đã tham gia ${presentSessions} buổi học trong chương trình.`,
        canKhacPhuc:
          totalSessions === 0
            ? 'Lớp học hiện tại chưa diễn ra buổi học nào. Cần chuẩn bị tài liệu và đi học đúng giờ ngay từ buổi khai giảng.'
            : Number(attendanceRate) < 80
            ? `Tỷ lệ chuyên cần hiện tại (${attendanceRate}%) chưa đạt chuẩn tối thiểu 80%. Cần đi học đầy đủ để đảm bảo điều kiện hoàn thành khóa.`
            : grade?.diemGiuaKy != null && Number(grade.diemGiuaKy) < 60
            ? `Điểm giữa kỳ (${grade.diemGiuaKy}/100) còn thấp, cần ôn tập thêm để kéo điểm ở kỳ thi cuối khóa.`
            : `Cần chủ động luyện tập tương tác phản xạ nhiều hơn trong các giờ học kỹ năng.`,
        loiKhuyen: isMidterm
          ? `Học viên đang ở giai đoạn giữa khóa. Cần tập trung ôn luyện các chủ điểm ngữ pháp và từ vựng trọng tâm để chuẩn bị cho bài thi cuối kỳ (chiếm 50% tổng số điểm).`
          : `Tập trung ôn tập theo chuẩn khung CEFR ${student.trinhDoCEFR}, tích cực hoàn thành các bài tập trắc nghiệm AI.`,
        tomTatChung:
          totalSessions === 0
            ? `Lớp học chưa có buổi học nào diễn ra. Học viên chưa có dữ liệu chuyên cần và điểm số.`
            : isMidterm
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
