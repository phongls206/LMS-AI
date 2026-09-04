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
- Đúng ${count} câu hỏi được đánh số id từ 1 đến ${count}.
- QUY TẮC BẮT BUỘC: Với câu hỏi Đúng/Sai (True/False), "luaChon" CHỈ ĐƯỢC CÓ 2 ĐÁP ÁN A VÀ B (True và False), KHÔNG ĐƯỢC TẠO C, D.
- Bắt buộc có đáp án đúng ("dapAnDung") và giải thích ngắn gọn ("giaiThich") bằng tiếng Việt.
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
          parsed.cauHoi = parsed.cauHoi.map((q: any, idx: number) => {
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
            };
          });
          validatedJson = parsed;
        }
      }

      if (!validatedJson) throw new Error('PARSE_ERROR');
    } catch (error: any) {
      this.logger.warn('AI Sinh bài tập thất bại, áp dụng Đề mẫu Fallback:', error?.message);
      status = error?.message === 'TIMEOUT' ? TrangThaiYeuCauAI.TIMEOUT : TrangThaiYeuCauAI.FALLBACK_APPLIED;

      // FALLBACK ĐỀ MẪU TĨNH ĐA DẠNG THEO CHỦ ĐỀ & KHUNG CEFR (HỖ TRỢ IT, ENTERTAINMENT, TOURISM & MULTIPLE/TRUE_FALSE)
      validatedJson = getFallbackExercises(dto.chuDe, dto.trinhDo, count, dto.loaiCauHoi);
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

    // 1. SMART DB CACHE LOOKUP: Trả về kết quả tức thì nếu dữ liệu học tập chưa thay đổi
    try {
      const cachedRecord = await this.prisma.yeuCauAI.findFirst({
        where: {
          loaiChucNang: LoaiChucNangAI.TOM_TAT_TIEN_DO,
          trangThai: TrangThaiYeuCauAI.THANH_CONG,
          promptInput: {
            contains: student.maHocVien,
          },
        },
        orderBy: { id: 'desc' },
      });

      if (cachedRecord && cachedRecord.validatedOutputJson) {
        const cached = cachedRecord.validatedOutputJson as any;
        const cachedGroundTruth = cached.duLieuGoc;
        if (
          cachedGroundTruth &&
          cachedGroundTruth.tyLeChuyenCan === `${attendanceRate}%` &&
          cachedGroundTruth.diemTongKet === duLieuGoc.diemTongKet &&
          cachedGroundTruth.diemGiuaKy === duLieuGoc.diemGiuaKy
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
