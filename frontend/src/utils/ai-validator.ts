/**
 * Tiện ích kiểm tra tính hợp lệ của chuỗi prompt đầu vào cho các tính năng AI.
 * Ngăn chặn chuỗi số vô nghĩa, spam gõ phím (keyboard mash), chuỗi ký tự dính số
 * nhằm tránh lãng phí lượt gọi Gemini AI.
 */

export interface ValidationResult {
  isValid: boolean;
  errorMessage?: string;
}

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

  // 1. Kiểm tra độ dài
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

  // 2. Phải chứa ký tự chữ cái (loại bỏ chuỗi full số hoặc chỉ có ký tự đặc biệt)
  if (!/[a-zA-ZÀ-ỹ]/.test(text)) {
    return {
      isValid: false,
      errorMessage: `${fieldName} không hợp lệ! Vui lòng nhập từ ngữ có nghĩa thay vì chỉ nhập số hoặc ký hiệu.`,
    };
  }

  // 3. Chặn dãy số dài >= 5 chữ số liên tiếp (ví dụ: 12345667764563253252, 213213213213123)
  const longDigitsMatch = text.match(/\d{5,}/);
  if (longDigitsMatch) {
    return {
      isValid: false,
      errorMessage: `${fieldName} chứa dãy số không phù hợp ("${longDigitsMatch[0]}"). Vui lòng nhập nội dung học tập rõ ràng.`,
    };
  }

  // 4. Chặn chữ dính liền với >= 3 số không có khoảng cách (ví dụ: aiúdhiuahsd2312321, àbbabsđáh213123)
  const gluedMatch = text.match(/[a-zA-ZÀ-ỹ]+\d{3,}|\d{3,}[a-zA-ZÀ-ỹ]+/i);
  if (gluedMatch) {
    return {
      isValid: false,
      errorMessage: `Phát hiện chuỗi ký tự và số dính liền vô nghĩa ("${gluedMatch[0]}"). Vui lòng nhập nội dung thực tế.`,
    };
  }

  // 5. Chặn ký tự đơn lặp vô nghĩa (ví dụ: aaaaa, zzzzz, 1111)
  if (/(.)\1{3,}/i.test(text)) {
    return {
      isValid: false,
      errorMessage: `${fieldName} chứa ký tự lặp vô nghĩa! Vui lòng nhập nội dung học tập thực tế.`,
    };
  }

  // 6. Chặn cụm n-gram lặp vô nghĩa (2-4 ký tự lặp >= 3 lần, ví dụ: 213213213, asdasdasd)
  const repeatedNgram = text.match(/(.{2,4})\1{2,}/i);
  if (repeatedNgram) {
    return {
      isValid: false,
      errorMessage: `Phát hiện chuỗi lặp lại vô nghĩa ("${repeatedNgram[0]}"). Vui lòng nhập từ ngữ có nghĩa.`,
    };
  }

  // 7. Chặn chuỗi phím gõ loạn phổ biến (Keyboard Mash)
  const KEYBOARD_MASH_PATTERNS = /(?:asdf|sdfg|dfgh|fghj|ghjk|hjkl|jkl;|qwerty|werty|ertyu|rtyui|tyuio|yuio|zxcv|xcvb|cvbn|vbnm)/i;
  if (KEYBOARD_MASH_PATTERNS.test(text)) {
    return {
      isValid: false,
      errorMessage: `Phát hiện chuỗi gõ loạn phím không có nghĩa. Vui lòng nhập nội dung tiếng Anh thực tế.`,
    };
  }

  // 8. Chặn từ quá dài không dấu cách hoặc chứa cụm phụ âm bất thường
  const words = text.split(/\s+/);
  for (const word of words) {
    const cleanWord = word.replace(/[^a-zA-ZÀ-ỹ]/g, '').toLowerCase();

    // Từ đơn quá dài không có dấu gạch ngang (>= 15 ký tự)
    if (cleanWord.length >= 15 && !word.includes('-')) {
      return {
        isValid: false,
        errorMessage: `Phát hiện từ không hợp lệ quá dài: "${word}". Vui lòng nhập từ ngữ rõ nghĩa.`,
      };
    }

    // Cụm phụ âm liên tiếp >= 5 phụ âm (gõ phím loạn)
    if (/[bcdfghjklmnpqrstvwxyz]{5,}/i.test(cleanWord)) {
      return {
        isValid: false,
        errorMessage: `Phát hiện từ chứa chuỗi phụ âm bất thường: "${word}". Vui lòng nhập từ ngữ học tập hợp lệ.`,
      };
    }

    // Từ dài >= 6 ký tự nhưng không có nguyên âm nào
    if (cleanWord.length >= 6) {
      const hasVowels = /[aeiouyáàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵ]/.test(cleanWord);
      if (!hasVowels) {
        return {
          isValid: false,
          errorMessage: `Phát hiện từ không có nghĩa: "${word}". Vui lòng nhập nội dung hợp lệ.`,
        };
      }
    }
  }

  // 9. Chặn Prompt Injection cơ bản
  const INJECTION_PATTERNS = [
    /ignore\s+(all\s+)?(previous\s+)?instructions/i,
    /system\s+prompt/i,
    /jailbreak/i,
    /dan\s+mode/i,
    /developer\s+mode/i,
    /bỏ\s+qua\s+(toàn\s+bộ\s+)?(chỉ\s+thị|chỉ\s+dẫn|câu\s+lệnh)/i,
    /hack\s+system/i,
  ];

  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(text)) {
      return {
        isValid: false,
        errorMessage: `${fieldName} vi phạm chính sách an toàn của hệ thống.`,
      };
    }
  }

  return { isValid: true };
}
