/**
 * Tiện ích kiểm tra tính hợp lệ và lọc rác (Validation, Sanitization, Anti-Gibberish & Anti-Profanity)
 * cho chuỗi prompt đầu vào của các tính năng AI (AI Tư vấn lớp học & AI Tạo đề thi/bài tập).
 * Ngăn chặn tuyệt đối các từ ngữ tục tĩu, thô tục, chuỗi gõ loạn phím (keyboard mash cả tiếng Anh lẫn tiếng Việt),
 * các câu spam cợt nhả hoặc mục tiêu/chủ đề không liên quan đến học tập tiếng Anh.
 */

export interface ValidationResult {
  isValid: boolean;
  errorMessage?: string;
}

// 1. Danh sách từ ngữ tục tĩu, thô tục, chửi bậy, xúc phạm (Tiếng Việt & Tiếng Anh)
const PROFANITY_PATTERNS = [
  /\b(cứt|cut|phân)\b/i,
  /\b(cứt\s*trâu|bã\s*đậu)\b/i,
  /\b(địt|dit|đjt|djt|đụ|du|dume|đume|đụ\s*má|đụ\s*mẹ|du\s*ma|du\s*me)\b/i,
  /\b(lồn|lon|loz|lozquè|hãm\s*lồn|xàm\s*lồn|ngu\s*lồn|vãi\s*lồn)\b/i,
  /\b(cặc|cac|buồi|buoi|con\s*cặc|vãi\s*cặc)\b/i,
  /\b(đm|dm|dcm|dkm|đmm|dcmm|clgt|vcl|vkl|vl|vcc|cmn|cc|đéo|deo|đéo\s*biết)\b/i,
  /\b(chó\s*đẻ|óc\s*chó|súc\s*vật|đồ\s*chó|thằng\s*chó)\b/i,
  /\b(con\s*đĩ|thằng\s*đĩ|đĩ\s*thõa|đĩ\s*mẹ)\b/i,
  /\b(đồ\s*ngu|ngu\s*si|đần\s*độn|mất\s*dạy|dâm\s*dục)\b/i,
  /\b(mẹ\s*mày|bố\s*mày|ông\s*mày|bà\s*mày|chết\s*tiệt|mẹ\s*kiếp)\b/i,
  /\b(thằng\s*điên|con\s*điên|thằng\s*khùng|con\s*khùng)\b/i,
  /\b(fuck|fucking|fucker|shit|bitch|bastard|cunt|asshole|dick|pussy|motherfucker|whore|slut|damn|cock|retard|nigger|fag)\b/i,
];

// 2. Danh sách cụm từ cợt nhả, spam thử nghiệm vô nghĩa
const SPAM_NONSENSE_PATTERNS = [
  /\b(ahihi|hjhj|haha|hehe|hoho|huhu)\b/i,
  /\b(blabla|bla\s*bla|xyz|abc\s*xyz)\b/i,
  /\b(nhập\s*đại|nhập\s*bừa|gõ\s*bừa|gõ\s*đại|chẳng\s*biết|không\s*biết|khong\s*biet|ko\s*biet)\b/i,
  /\b(gì\s*cũng\s*được|sao\s*cũng\s*được|sao\s*chả\s*được|tùy\s*bạn|đại\s*đi|thử\s*xem|test\s*thử)\b/i,
  /\b(tào\s*lao|vớ\s*vẩn|linh\s*tinh|nhảm\s*nhí|nhảm\s*cứt)\b/i,
];

// 3. Chuỗi gõ phím hàng ngang / loạn phím phổ biến (Keyboard Mash)
const KEYBOARD_MASH_PATTERNS = /(?:asdf|sdfg|dfgh|fghj|ghjk|hjkl|jkl;|qwerty|werty|ertyu|rtyui|tyuio|yuio|zxcv|xcvb|cvbn|vbnm|qazwsx|edcrfv|tgbyhn)/i;

// 4. Ký tự mang thanh điệu trong tiếng Việt
const VIETNAMESE_TONE_CHARS = /[áắấéếíóốớúứýàằầèềìòồờùừỳảẳẩẻểỉỏổởủửỷãẵẫẽễĩõỗỡũữỹạặậẹệịọộợụựỵ]/gi;

// 5. Từ khóa hợp lệ liên quan đến học tiếng Anh, kỹ năng, lịch học hoặc mục tiêu
const LEARNING_KEYWORDS = /(?:học|tiếng\s*anh|anh\s*văn|ielts|toeic|toefl|cefr|cambridge|oxford|giao\s*tiếp|ngữ\s*pháp|từ\s*vựng|phát\s*âm|phản\s*xạ|luyện|ôn|mất\s*gốc|cấp\s*tốc|du\s*học|đi\s*làm|phỏng\s*vấn|chứng\s*chỉ|đầu\s*ra|nói|nghe|đọc|viết|speaking|listening|reading|writing|grammar|vocabulary|pronunciation|lớp|khóa|level|trình\s*độ|cơ\s*bản|nâng\s*cao|sơ\s*cấp|trung\s*cấp|thực\s*hành|kỹ\s*năng|tiến\s*bộ|giáo\s*viên|bản\s*ngữ|trung\s*tâm|tối|sáng|chiều|thứ|cuối\s*tuần|rảnh|tháng|tuần|buổi|giờ|lịch|mục\s*tiêu|mong\s*muốn|cần|muốn|nguyện\s*vọng|lộ\s*trình|thời\s*gian|cải\s*thiện|bắt\s*đầu|trau\s*dồi|rèn\s*luyện|đạt|điểm|bài\s*tập|đề\s*thi)/i;

// 6. Từ khóa chủ đề ôn tập tiếng Anh (cho chức năng tạo đề)
const TOPIC_KEYWORDS = /(?:thì|tense|grammar|ngữ\s*pháp|từ\s*vựng|vocabulary|ielts|toeic|toefl|bài\s*tập|câu|mệnh\s*đề|điều\s*kiện|bị\s*động|chủ\s*động|hoàn\s*thành|quá\s*khứ|hiện\s*tại|tương\s*lai|giới\s*từ|phrasal|verb|noun|adj|adv|pronoun|modal|passive|relative|conditional|so\s*sánh|comparative|superlative|giao\s*tiếp|du\s*lịch|travel|business|công\s*sở|it|công\s*nghệ|technology|môi\s*trường|environment|âm\s*nhạc|music|phim|movie|ẩm\s*thực|food|thể\s*thao|sport|gia\s*đình|family|speaking|writing|reading|listening|interview|work|job)/i;

// 7. Chặn Prompt Injection / Jailbreak
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
  /hack\s+system/i,
];

export function validateAiPrompt(
  input: string,
  type: 'TOPIC' | 'GOAL' = 'TOPIC',
): ValidationResult {
  const text = (input || '').trim();
  const fieldName = type === 'TOPIC' ? 'Chủ đề bài tập' : 'Mục tiêu học tập';

  if (!text) {
    return {
      isValid: false,
      errorMessage: `Vui lòng nhập ${fieldName.toLowerCase()}.`,
    };
  }

  // 1. Kiểm tra độ dài cơ bản
  const minLen = type === 'TOPIC' ? 3 : 5;
  const maxLen = type === 'TOPIC' ? 100 : 300;

  if (text.length < minLen) {
    return {
      isValid: false,
      errorMessage: `${fieldName} quá ngắn! Vui lòng nhập tối thiểu ${minLen} ký tự.`,
    };
  }

  if (text.length > maxLen) {
    return {
      isValid: false,
      errorMessage: `${fieldName} không được vượt quá ${maxLen} ký tự.`,
    };
  }

  // 2. Chặn từ ngữ tục tĩu, thô tục, chửi bậy, xúc phạm
  for (const pattern of PROFANITY_PATTERNS) {
    if (pattern.test(text)) {
      return {
        isValid: false,
        errorMessage: 'Nội dung chứa từ ngữ không phù hợp hoặc thiếu văn minh. Vui lòng nhập thông tin học tập nghiêm túc.',
      };
    }
  }

  // 3. Chặn câu spam cợt nhả, thử nghiệm vô nghĩa
  for (const pattern of SPAM_NONSENSE_PATTERNS) {
    if (pattern.test(text)) {
      return {
        isValid: false,
        errorMessage: 'Vui lòng nhập mục tiêu hoặc chủ đề học tập cụ thể, tránh các từ ngữ cợt nhả hoặc thử nghiệm vô nghĩa.',
      };
    }
  }

  // 4. Phải chứa ký tự chữ cái (loại bỏ chuỗi full số hoặc chỉ có ký tự đặc biệt)
  if (!/[a-zA-ZÀ-ỹ]/.test(text)) {
    return {
      isValid: false,
      errorMessage: `${fieldName} không hợp lệ! Vui lòng nhập từ ngữ có nghĩa thay vì chỉ nhập số hoặc ký hiệu.`,
    };
  }

  // 5. Chặn dãy số dài >= 5 chữ số liên tiếp
  const longDigitsMatch = text.match(/\d{5,}/);
  if (longDigitsMatch) {
    return {
      isValid: false,
      errorMessage: `${fieldName} chứa dãy số không phù hợp ("${longDigitsMatch[0]}"). Vui lòng nhập nội dung học tập rõ ràng.`,
    };
  }

  // 6. Chặn chữ dính liền với >= 3 số không có khoảng cách
  const gluedMatch = text.match(/[a-zA-ZÀ-ỹ]+\d{3,}|\d{3,}[a-zA-ZÀ-ỹ]+/i);
  if (gluedMatch) {
    return {
      isValid: false,
      errorMessage: `Phát hiện chuỗi ký tự và số dính liền vô nghĩa ("${gluedMatch[0]}"). Vui lòng nhập nội dung thực tế.`,
    };
  }

  // 7. Chặn ký tự đơn lặp vô nghĩa (ví dụ: aaaaa, zzzzz, 1111)
  if (/(.)\1{3,}/i.test(text)) {
    return {
      isValid: false,
      errorMessage: `${fieldName} chứa ký tự lặp vô nghĩa! Vui lòng nhập nội dung học tập thực tế.`,
    };
  }

  // 8. Chặn cụm n-gram lặp vô nghĩa (2-4 ký tự lặp >= 3 lần, ví dụ: asdasdasd, ababab)
  const repeatedNgram = text.match(/(.{2,4})\1{2,}/i);
  if (repeatedNgram) {
    return {
      isValid: false,
      errorMessage: `Phát hiện chuỗi lặp lại vô nghĩa ("${repeatedNgram[0]}"). Vui lòng nhập từ ngữ có nghĩa.`,
    };
  }

  // 9. Chặn chuỗi phím gõ loạn phổ biến (Keyboard Mash)
  if (KEYBOARD_MASH_PATTERNS.test(text)) {
    return {
      isValid: false,
      errorMessage: 'Phát hiện chuỗi gõ loạn phím không có nghĩa. Vui lòng nhập nội dung tiếng Anh thực tế.',
    };
  }

  // 10. Chặn các tổ hợp phụ âm bất thường (vd: dsf, pfk, bcf, gjk, hdkjs...)
  const ABNORMAL_LETTER_CLUSTERS = /(?:[bcdfghjklmnpqrstvwxyz]{4,}|fk|jw|q[^u]|dsf|pfk|bcf|gjk|mkl|qj|vj|zj|xj)/i;
  const allowedClusters = /(?:str|spl|scr|spr|ngth)/i;

  // 11. Kiểm tra từng từ (Word-level check) để loại bỏ gõ loạn tiếng Việt / Telex mash (vd: ạođịakahdkjsa)
  const words = text.split(/\s+/);
  for (const word of words) {
    const cleanWord = word.replace(/[^a-zA-ZÀ-ỹ]/g, '').toLowerCase();
    if (!cleanWord) continue;

    // A. Chặn từ quá dài (>= 15 ký tự không có dấu gạch ngang)
    if (cleanWord.length >= 15 && !word.includes('-')) {
      return {
        isValid: false,
        errorMessage: `Phát hiện từ không hợp lệ quá dài: "${word}". Vui lòng nhập từ ngữ rõ nghĩa.`,
      };
    }

    // B. Tiếng Việt: Trong một âm tiết CHỈ CÓ TỐI ĐA 1 DẤU THANH
    // Nếu 1 từ có >= 2 ký tự mang dấu thanh (ví dụ "ạođịakahdkjsa" có 'ạ' và 'ị'), đó 100% là gõ loạn bàn phím!
    const toneMatches = cleanWord.match(VIETNAMESE_TONE_CHARS) || [];
    if (toneMatches.length >= 2) {
      return {
        isValid: false,
        errorMessage: `Phát hiện từ gõ loạn phím hoặc sai cấu trúc tiếng Việt ("${word}"). Vui lòng nhập từ ngữ có nghĩa.`,
      };
    }

    // C. Tiếng Việt: Một từ tiếng Việt đơn chuẩn không dài quá 7 ký tự (dài nhất là 'nghiêng').
    // Nếu từ có chứa dấu tiếng Việt mà dài >= 8 ký tự không có khoảng cách hay gạch nối, đó là dính phím / gõ loạn!
    const hasVietnameseAccent = /[àảãáạăằẳẵắặâầẩẫấậèẻẽéẹêềểễếệìỉĩíịòỏõóọôồổỗốộơờởỡớợùủũúụưừửữứựỳỷỹýỵđ]/.test(cleanWord);
    if (hasVietnameseAccent && cleanWord.length >= 8 && !word.includes('-')) {
      return {
        isValid: false,
        errorMessage: `Phát hiện từ gõ dính phím hoặc không rõ nghĩa: "${word}". Vui lòng nhập các từ cách nhau bằng khoảng trắng.`,
      };
    }

    // D. Tiếng Anh đơn lẻ dài >= 10 ký tự: Phải có hậu tố ngữ pháp hợp lệ
    if (words.length === 1 && cleanWord.length >= 10 && !word.includes('-') && !hasVietnameseAccent) {
      const hasValidEnglishSuffix = /(?:tion|sion|ment|ness|able|ible|ships|ship|less|hood|wise|tives|tive|ance|ence|tures|ture|ologies|ology|logy|ated|ting|icals|ical|ally|ular|ities|ity|isms|ism|ists|ist|als|al|ings|ing|ed|ies)$/i.test(cleanWord);
      if (!hasValidEnglishSuffix) {
        return {
          isValid: false,
          errorMessage: `Phát hiện từ không rõ nghĩa hoặc gõ phím ngẫu nhiên: "${word}". Vui lòng nhập nội dung học tiếng Anh cụ thể.`,
        };
      }
    }

    // E. Cụm phụ âm liên tiếp >= 4 (trừ cụm chuẩn tiếng Anh như str, spl, scr, spr, ngth)
    if (ABNORMAL_LETTER_CLUSTERS.test(cleanWord) && !allowedClusters.test(cleanWord)) {
      return {
        isValid: false,
        errorMessage: `Phát hiện từ chứa chuỗi phụ âm bất thường: "${word}". Vui lòng nhập từ ngữ học tập hợp lệ.`,
      };
    }

    // F. Từ dài >= 5 ký tự nhưng không có nguyên âm nào
    if (cleanWord.length >= 5) {
      const hasVowels = /[aeiouyáàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵ]/.test(cleanWord);
      if (!hasVowels) {
        return {
          isValid: false,
          errorMessage: `Phát hiện từ không có nghĩa: "${word}". Vui lòng nhập nội dung hợp lệ.`,
        };
      }
    }
  }

  // 12. Kiểm tra độ phù hợp ngữ cảnh (Relevance & Semantic check)
  if (type === 'GOAL') {
    // Với mục tiêu học tập: Nếu nhập câu quá ngắn (< 25 ký tự hoặc <= 3 từ),
    // bắt buộc phải chứa ít nhất 1 từ khóa liên quan đến tiếng Anh, học tập, lịch học hoặc kỹ năng.
    const isShortGoal = text.length < 25 || words.length <= 3;
    if (isShortGoal && !LEARNING_KEYWORDS.test(text)) {
      return {
        isValid: false,
        errorMessage: 'Mục tiêu học tập chưa rõ ràng hoặc không liên quan đến tiếng Anh. Vui lòng mô tả mong muốn của bạn (Ví dụ: Muốn học giao tiếp, Luyện thi IELTS 6.5, Học vào các buổi tối...).',
      };
    }
  } else if (type === 'TOPIC') {
    // Với chủ đề bài tập: Nếu nhập quá ngắn (< 15 ký tự hoặc <= 2 từ),
    // bắt buộc phải khớp với các khái niệm ngữ pháp, chủ đề hoặc từ vựng tiếng Anh.
    const isShortTopic = text.length < 15 || words.length <= 2;
    if (isShortTopic && !TOPIC_KEYWORDS.test(text)) {
      return {
        isValid: false,
        errorMessage: 'Chủ đề bài tập không phù hợp. Vui lòng nhập chủ đề tiếng Anh cụ thể (Ví dụ: Thì hiện tại hoàn thành, Mệnh đề quan hệ, Từ vựng du lịch, Job interview...).',
      };
    }
  }

  // 13. Chặn Prompt Injection cơ bản
  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(text)) {
      return {
        isValid: false,
        errorMessage: `${fieldName} vi phạm chính sách an toàn của hệ thống (Prompt Injection bị chặn).`,
      };
    }
  }

  return { isValid: true };
}
