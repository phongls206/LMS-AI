import { CurriculumTopicBank, CurriculumQuestionItem, FallbackExerciseSet } from './types';
import { PRESENT_PERFECT_BANK } from './present-perfect';
import { CONDITIONALS_BANK } from './conditionals';
import { RELATIVE_CLAUSES_BANK } from './relative-clauses';
import { PASSIVE_VOICE_BANK } from './passive-voice';
import { PHRASAL_VERBS_BANK } from './phrasal-verbs';
import { BUSINESS_ENGLISH_BANK } from './business-english';
import { INFORMATION_TECHNOLOGY_BANK } from './information-technology';
import { TOURISM_TRAVEL_BANK } from './tourism-travel';
import { ENTERTAINMENT_BANK } from './entertainment';
import { PREPOSITIONS_BANK } from './prepositions';
import { MODAL_VERBS_BANK } from './modal-verbs';
import { SUBJECT_VERB_AGREEMENT_BANK } from './subject-verb-agreement';
import { REPORTED_SPEECH_BANK } from './reported-speech';
import { COMPARATIVES_BANK } from './comparatives';
import { ENVIRONMENT_SOCIETY_BANK } from './environment-society';

export * from './types';

export const CURRICULUM_BANKS: Record<string, CurriculumTopicBank> = {
  PRESENT_PERFECT: PRESENT_PERFECT_BANK,
  CONDITIONALS: CONDITIONALS_BANK,
  RELATIVE_CLAUSES: RELATIVE_CLAUSES_BANK,
  PASSIVE_VOICE: PASSIVE_VOICE_BANK,
  PHRASAL_VERBS: PHRASAL_VERBS_BANK,
  BUSINESS_ENGLISH: BUSINESS_ENGLISH_BANK,
  INFORMATION_TECHNOLOGY: INFORMATION_TECHNOLOGY_BANK,
  TOURISM_TRAVEL: TOURISM_TRAVEL_BANK,
  ENTERTAINMENT: ENTERTAINMENT_BANK,
  PREPOSITIONS: PREPOSITIONS_BANK,
  MODAL_VERBS: MODAL_VERBS_BANK,
  SUBJECT_VERB_AGREEMENT: SUBJECT_VERB_AGREEMENT_BANK,
  REPORTED_SPEECH: REPORTED_SPEECH_BANK,
  COMPARATIVES: COMPARATIVES_BANK,
  ENVIRONMENT_SOCIETY: ENVIRONMENT_SOCIETY_BANK,
};

export const CURRICULUM_BANK_KEYS = Object.keys(CURRICULUM_BANKS);

/**
 * Danh sách đăng ký các chủ đề giáo trình phục vụ UI và Prompt AI
 */
export const CURRICULUM_TOPIC_REGISTRY = Object.values(CURRICULUM_BANKS).map((b) => ({
  key: b.key,
  tenChuDe: b.tenChuDe,
  aliases: b.aliases,
}));

/**
 * Thuật toán khớp nhanh chủ đề bằng từ khóa, từ đồng nghĩa và cụm từ viết tắt.
 * Hỗ trợ nhận diện các từ ngắn như 'it', 'ai', 'tech', 'cntt' bằng ranh giới từ (word boundaries).
 */
export function matchTopicByKeywords(userTopic: string): string | null {
  if (!userTopic || typeof userTopic !== 'string') return null;
  const raw = userTopic.trim();
  const lower = raw.toLowerCase();

  // 1. Kiểm tra trực tiếp key danh mục
  if (CURRICULUM_BANKS[raw.toUpperCase()]) {
    return raw.toUpperCase();
  }

  // 2. Kiểm tra từ viết tắt đặc thù công nghệ (IT, CNTT, AI, Tech) với Word Boundary
  if (
    /\b(it|cntt|tech|technology|coding|code|developer|programmer|software|hardware|devops|backend|frontend|database|csdl|an ninh mạng|cybersecurity)\b/i.test(
      lower,
    ) ||
    lower.includes('công nghệ thông tin') ||
    lower.includes('cong nghe thong tin') ||
    lower.includes('lập trình') ||
    lower.includes('lap trinh') ||
    lower.includes('phần mềm') ||
    lower.includes('máy tính')
  ) {
    return 'INFORMATION_TECHNOLOGY';
  }

  // 3. Quét lần lượt qua 15 bộ đề giáo trình
  for (const bank of Object.values(CURRICULUM_BANKS)) {
    // Khớp tiêu đề chính xác
    if (lower === bank.tenChuDe.toLowerCase()) {
      return bank.key;
    }

    // Khớp nếu tiêu đề chứa chủ đề hoặc ngược lại
    if (bank.tenChuDe.toLowerCase().includes(lower) || lower.includes(bank.key.toLowerCase().replace(/_/g, ' '))) {
      return bank.key;
    }

    // Khớp qua danh sách aliases
    for (const alias of bank.aliases) {
      const aliasLower = alias.toLowerCase();
      if (aliasLower.length <= 3) {
        const regex = new RegExp(`\\b${aliasLower}\\b`, 'i');
        if (regex.test(lower)) {
          return bank.key;
        }
      } else if (lower.includes(aliasLower)) {
        return bank.key;
      }
    }
  }

  return null;
}

/**
 * Xoay mảng vòng tròn theo offset để tạo đề ngẫu nhiên nhưng ổn định
 */
function rotateArray<T>(arr: T[], offset: number): T[] {
  if (!arr || arr.length === 0) return [];
  const n = arr.length;
  const k = ((offset % n) + n) % n;
  return [...arr.slice(k), ...arr.slice(0, k)];
}

/**
 * Tra cứu và trích xuất bộ đề luyện tập từ Ngân hàng đề mẫu chuẩn giáo trình trung tâm ETC.
 * - Đảm bảo đủ 100% số lượng câu hỏi yêu cầu (5, 10, 15 câu) cho BẤT KỲ dạng câu nào (SINGLE, TRUE_FALSE, MULTIPLE, MIXED).
 * - Cung cấp chuẩn 10 Bộ đề độc lập (Bộ đề #1 đến Bộ đề #10) cho mỗi chủ đề.
 */
export function findCurriculumBankExercise(
  bankKeyOrTopic: string,
  displayTopicName: string,
  cefr: string,
  count: number = 5,
  loaiCauHoi?: string,
  boDe?: number,
): FallbackExerciseSet | null {
  // Xác định bankKey
  let bankKey = CURRICULUM_BANKS[bankKeyOrTopic]
    ? bankKeyOrTopic
    : matchTopicByKeywords(bankKeyOrTopic);

  if (!bankKey || !CURRICULUM_BANKS[bankKey]) {
    return null;
  }

  const bank = CURRICULUM_BANKS[bankKey];
  const allQuestions = bank.questions;

  // Xác định bộ đề (1..10)
  const setNumber = boDe && boDe >= 1 && boDe <= 10 ? Math.floor(boDe) : Math.floor(Math.random() * 10) + 1;
  const offset = (setNumber - 1) * 2; // Bước nhảy xoay vòng giữa các bộ đề

  const singles = allQuestions.filter((q) => q.loaiCauHoi === 'SINGLE');
  const trueFalses = allQuestions.filter((q) => q.loaiCauHoi === 'TRUE_FALSE');
  const multiples = allQuestions.filter((q) => q.loaiCauHoi === 'MULTIPLE');

  const targetCount = [5, 10, 15].includes(count) ? count : 5;
  let selectedQuestions: CurriculumQuestionItem[] = [];

  if (loaiCauHoi === 'SINGLE') {
    const rotated = rotateArray(singles, offset);
    selectedQuestions = rotated.slice(0, targetCount);
  } else if (loaiCauHoi === 'TRUE_FALSE') {
    const rotated = rotateArray(trueFalses, offset);
    selectedQuestions = rotated.slice(0, targetCount);
  } else if (loaiCauHoi === 'MULTIPLE') {
    const rotated = rotateArray(multiples, offset);
    selectedQuestions = rotated.slice(0, targetCount);
  } else {
    // DẠNG MIXED (HỖN HỢP CẢ 3 DẠNG CÂU HỎI)
    let sCount = 2;
    let tfCount = 2;
    let mCount = 1;

    if (targetCount === 15) {
      sCount = 5;
      tfCount = 5;
      mCount = 5;
    } else if (targetCount === 10) {
      sCount = 4;
      tfCount = 3;
      mCount = 3;
    }

    const rotatedS = rotateArray(singles, offset).slice(0, sCount);
    const rotatedTF = rotateArray(trueFalses, offset).slice(0, tfCount);
    const rotatedM = rotateArray(multiples, offset).slice(0, mCount);

    selectedQuestions = [...rotatedS, ...rotatedTF, ...rotatedM];
  }

  // Đánh lại số thứ tự ID tuần tự từ 1 đến count cho học viên làm bài
  const formattedQuestions = selectedQuestions.map((q, idx) => ({
    ...q,
    id: idx + 1,
  }));

  return {
    chuDe: bank.tenChuDe,
    trinhDo: cefr || 'B1',
    cauHoi: formattedQuestions,
    boDe: setNumber,
    tongSoBoDe: 10,
    tenBoDe: `Bộ Đề #${setNumber}`,
  };
}

/**
 * Fallback mặc định khi AI gặp sự cố (bảo toàn tương thích với code cũ)
 */
export function getFallbackExercises(
  topic: string,
  cefr: string,
  count: number = 5,
  loaiCauHoi?: string,
): FallbackExerciseSet {
  const matchedKey = matchTopicByKeywords(topic) || 'PRESENT_PERFECT';
  const result = findCurriculumBankExercise(matchedKey, topic, cefr, count, loaiCauHoi, 1);
  if (result) return result;

  return {
    chuDe: topic,
    trinhDo: cefr,
    cauHoi: PRESENT_PERFECT_BANK.questions.slice(0, count).map((q, idx) => ({ ...q, id: idx + 1 })),
    boDe: 1,
    tongSoBoDe: 10,
    tenBoDe: 'Bộ Đề #1',
  };
}
