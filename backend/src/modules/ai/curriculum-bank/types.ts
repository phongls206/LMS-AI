export type QuestionType = 'SINGLE' | 'TRUE_FALSE' | 'MULTIPLE';

export interface CurriculumQuestionItem {
  id: number;
  noiDung: string;
  loaiCauHoi: QuestionType;
  luaChon: Record<string, string>;
  dapAnDung: string | string[];
  giaiThich: string;
  trinhDo?: 'A1' | 'A2' | 'B1' | 'B2' | 'C1';
}

export interface CurriculumTopicBank {
  key: string;
  tenChuDe: string;
  aliases: string[];
  questions: CurriculumQuestionItem[];
}

export interface FallbackExerciseSet {
  chuDe: string;
  trinhDo: string;
  cauHoi: CurriculumQuestionItem[];
  boDe?: number;
  tongSoBoDe?: number;
  tenBoDe?: string;
}
