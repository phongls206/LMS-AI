import { CurriculumTopicBank, CurriculumQuestionItem, FallbackExerciseSet, QuestionType } from './types';
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

  // Chặn ngay các câu chửi bới, cảm xúc cá nhân hoặc thô tục không thuộc học tập
  if (/\b(ghét|chán|ngu|mày|tao|địt|cặc|lồn|buồi|đụ|cút|biến|điên|khùng|vớ vẩn|nhảm)\b/i.test(lower)) {
    return null;
  }

  // 1. Kiểm tra trực tiếp key danh mục
  if (CURRICULUM_BANKS[raw.toUpperCase()]) {
    return raw.toUpperCase();
  }

  // 2. Kiểm tra từ viết tắt đặc thù công nghệ với điều kiện chặt chẽ
  if (
    lower === 'it' ||
    lower === 'cntt' ||
    /\b(ngành it|dân it|học it|chuyên ngành it|dân cntt)\b/i.test(lower) ||
    /\b(tech|technology|coding|developer|programmer|software|hardware|devops|backend|frontend|cybersecurity)\b/i.test(
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

  const words = lower.split(/\s+/);

  // 3. Quét lần lượt qua 15 bộ đề giáo trình
  for (const bank of Object.values(CURRICULUM_BANKS)) {
    // Khớp tiêu đề chính xác hoặc tiêu đề chứa cụm từ
    if (lower === bank.tenChuDe.toLowerCase()) {
      return bank.key;
    }

    if (bank.tenChuDe.toLowerCase().includes(lower) || lower.includes(bank.key.toLowerCase().replace(/_/g, ' '))) {
      return bank.key;
    }

    // Khớp qua danh sách aliases
    for (const alias of bank.aliases) {
      const aliasLower = alias.toLowerCase();
      if (lower === aliasLower) {
        return bank.key;
      }
      if (aliasLower.length <= 3) {
        if (words.length <= 2 && new RegExp(`\\b${aliasLower}\\b`, 'i').test(lower)) {
          return bank.key;
        }
      } else if (new RegExp(`\\b${aliasLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(lower)) {
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
 * Trích xuất câu hỏi theo dạng và ưu tiên độ khó CEFR theo khoảng cách gần nhất
 */
function selectQuestionsByLevelAndType(
  allQuestions: CurriculumQuestionItem[],
  targetLevel: string,
  targetType: QuestionType,
  neededCount: number,
  offset: number,
): CurriculumQuestionItem[] {
  const CEFR_ORDER = ['A1', 'A2', 'B1', 'B2', 'C1'];
  const targetIdx = CEFR_ORDER.indexOf(targetLevel) >= 0 ? CEFR_ORDER.indexOf(targetLevel) : 2;
  const sortedLevels = [...CEFR_ORDER].sort((a, b) => {
    return Math.abs(CEFR_ORDER.indexOf(a) - targetIdx) - Math.abs(CEFR_ORDER.indexOf(b) - targetIdx);
  });

  const matchingType = allQuestions.filter((q) => q.loaiCauHoi === targetType);
  const selected: CurriculumQuestionItem[] = [];

  for (const lvl of sortedLevels) {
    if (selected.length >= neededCount) break;
    const lvlQuestions = matchingType.filter((q) => (q.trinhDo || 'B1') === lvl);
    if (lvlQuestions.length > 0) {
      const rotated = rotateArray(lvlQuestions, offset);
      for (const q of rotated) {
        if (selected.length >= neededCount) break;
        if (!selected.some((existing) => existing.id === q.id || existing.noiDung === q.noiDung)) {
          selected.push(q);
        }
      }
    }
  }

  // Nếu vẫn chưa đủ, lấy thêm từ các câu cùng dạng còn lại
  if (selected.length < neededCount) {
    const rotated = rotateArray(matchingType, offset);
    for (const q of rotated) {
      if (selected.length >= neededCount) break;
      if (!selected.some((existing) => existing.id === q.id || existing.noiDung === q.noiDung)) {
        selected.push(q);
      }
    }
  }

  return selected;
}

/**
 * Tra cứu và trích xuất bộ đề luyện tập từ Ngân hàng đề mẫu chuẩn giáo trình trung tâm ETC.
 * - Lọc chuẩn xác theo trình độ CEFR (A1, A2, B1, B2, C1/C2) người dùng đã chọn.
 * - Lọc chuẩn xác theo dạng câu hỏi (SINGLE, TRUE_FALSE, MULTIPLE, MIXED).
 * - Đảm bảo đủ 100% số lượng câu hỏi yêu cầu (5, 10, 15 câu).
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

  // Chuẩn hóa CEFR: A1, A2, B1, B2, C1 (C2 gộp vào C1)
  const normalizedCefr = (cefr || 'B1').toUpperCase().trim();
  const targetLevel = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].includes(normalizedCefr)
    ? (normalizedCefr === 'C2' ? 'C1' : normalizedCefr)
    : 'B1';

  // Xác định bộ đề (1..10)
  const setNumber = boDe && boDe >= 1 && boDe <= 10 ? Math.floor(boDe) : Math.floor(Math.random() * 10) + 1;
  const offset = (setNumber - 1) * 3; // Bước nhảy xoay vòng giữa các bộ đề

  const targetCount = [5, 10, 15].includes(count) ? count : 5;
  let selectedQuestions: CurriculumQuestionItem[] = [];

  if (loaiCauHoi === 'SINGLE') {
    selectedQuestions = selectQuestionsByLevelAndType(allQuestions, targetLevel, 'SINGLE', targetCount, offset);
  } else if (loaiCauHoi === 'TRUE_FALSE') {
    selectedQuestions = selectQuestionsByLevelAndType(allQuestions, targetLevel, 'TRUE_FALSE', targetCount, offset);
  } else if (loaiCauHoi === 'MULTIPLE') {
    selectedQuestions = selectQuestionsByLevelAndType(allQuestions, targetLevel, 'MULTIPLE', targetCount, offset);
  } else {
    // DẠNG MIXED (HỖN HỢP CẢ 3 DẠNG CÂU HỎI)
    let sCount = 2;
    let tfCount = 2;
    let mCount = 1;

    if (targetCount === 15) {
      sCount = 6;
      tfCount = 5;
      mCount = 4;
    } else if (targetCount === 10) {
      sCount = 4;
      tfCount = 3;
      mCount = 3;
    }

    const singles = selectQuestionsByLevelAndType(allQuestions, targetLevel, 'SINGLE', sCount, offset);
    const trueFalses = selectQuestionsByLevelAndType(allQuestions, targetLevel, 'TRUE_FALSE', tfCount, offset);
    const multiples = selectQuestionsByLevelAndType(allQuestions, targetLevel, 'MULTIPLE', mCount, offset);

    selectedQuestions = [...singles, ...trueFalses, ...multiples];
  }

  // Đảm bảo đủ 100% số lượng câu yêu cầu
  if (selectedQuestions.length < targetCount) {
    const remaining = targetCount - selectedQuestions.length;
    const remainingCandidates = allQuestions.filter(
      (q) => !selectedQuestions.some((s) => s.id === q.id || s.noiDung === q.noiDung),
    );
    const CEFR_ORDER = ['A1', 'A2', 'B1', 'B2', 'C1'];
    const targetIdx = CEFR_ORDER.indexOf(targetLevel) >= 0 ? CEFR_ORDER.indexOf(targetLevel) : 2;
    remainingCandidates.sort((a, b) => {
      const distA = Math.abs(CEFR_ORDER.indexOf(a.trinhDo || 'B1') - targetIdx);
      const distB = Math.abs(CEFR_ORDER.indexOf(b.trinhDo || 'B1') - targetIdx);
      return distA - distB;
    });
    const rotated = rotateArray(remainingCandidates, offset);
    selectedQuestions.push(...rotated.slice(0, remaining));
  }

  // Đánh lại số thứ tự ID tuần tự từ 1 đến count cho học viên làm bài
  const formattedQuestions = selectedQuestions.map((q, idx) => ({
    ...q,
    id: idx + 1,
  }));

  return {
    chuDe: bank.tenChuDe,
    trinhDo: cefr || targetLevel,
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
