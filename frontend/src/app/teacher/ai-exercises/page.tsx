'use client';

import React, { useState } from 'react';
import { AppLayout } from '../../../components/AppLayout';
import { aiService } from '../../../services/api';
import { Sparkles, CheckCircle2, XCircle, RotateCcw, BookOpen, Layers, Eye, PlayCircle } from 'lucide-react';

const PREDEFINED_TOPICS = [
  'Thì Hiện Tại Hoàn Thành (Present Perfect Tense)',
  'Câu Điều Kiện Loại 1, 2, 3 (Conditional Sentences)',
  'Mệnh Đề Quan Hệ (Relative Clauses)',
  'Câu Bị Động Nâng Cao (Passive Voice)',
  'Cụm Động Từ Thông Dụng (Common Phrasal Verbs)',
  'Từ Vựng Tiếng Anh Công Sở & Giao Tiếp (Business English)',
  'Giới Từ Chỉ Thời Gian & Nơi Chốn (Prepositions)',
  'Động Từ Khuyết Thiếu (Modal Verbs)',
  'Sự Hòa Hợp Chủ Vị (Subject-Verb Agreement)',
  'Câu Tường Thuật Gián Tiếp (Reported Speech)',
  'So Sánh Hơn & So Sánh Nhất (Comparatives & Superlatives)',
  'Từ Vựng IELTS Chủ Đề Môi Trường & Xã Hội',
  'CUSTOM',
];

export default function TeacherAiExercisesPage() {
  const [selectedTopic, setSelectedTopic] = useState(PREDEFINED_TOPICS[0]);
  const [customTopic, setCustomTopic] = useState('');
  const [cefr, setCefr] = useState('B1');
  const [soLuong, setSoLuong] = useState(5);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  // Interactive quiz state
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [teacherViewKey, setTeacherViewKey] = useState(false);

  const activeTopic = selectedTopic === 'CUSTOM' ? customTopic.trim() : selectedTopic;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTopic) {
      alert('Vui lòng chọn hoặc nhập chủ đề bài tập.');
      return;
    }

    setLoading(true);
    setResult(null);
    setUserAnswers({});
    setSubmitted(false);

    try {
      const res = await aiService.generateExercises(activeTopic, cefr, soLuong);
      setResult(res);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Lỗi gọi AI sinh bài tập.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (qIdx: number, optionKey: string) => {
    if (submitted) return;
    setUserAnswers((prev) => ({ ...prev, [qIdx]: optionKey }));
  };

  const calculateScore = () => {
    if (!result?.data?.cauHoi) return 0;
    let correct = 0;
    result.data.cauHoi.forEach((q: any, idx: number) => {
      if (userAnswers[idx] === q.dapAnDung) correct++;
    });
    return correct;
  };

  return (
    <AppLayout
      allowedRoles={['GIAO_VIEN', 'HOC_VIEN', 'QUAN_LY']}
      title="Trợ Lý Giáo Viên AI: Sinh Đề Luyện Tập Trắc Nghiệm"
      subtitle="Tạo tức thì bộ câu hỏi trắc nghiệm tiếng Anh (tùy chọn 5, 10, 15 câu) chuẩn khung CEFR kèm đáp án và giải thích"
    >
      <div className="space-y-6">
        {/* Form generator */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm">
          <form onSubmit={handleGenerate} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div className="md:col-span-2">
                <label className="block font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center space-x-1.5">
                  <Layers className="w-3.5 h-3.5 text-purple-400" />
                  <span>Danh Mục Chủ Đề Ngữ Pháp / Từ Vựng Chuẩn</span>
                </label>
                <select
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white font-medium focus:outline-none focus:border-purple-500"
                >
                  {PREDEFINED_TOPICS.map((t) => (
                    <option key={t} value={t}>
                      {t === 'CUSTOM' ? '✍️ Nhập chủ đề tùy chỉnh khác...' : `📚 ${t}`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Độ Khó CEFR
                </label>
                <select
                  value={cefr}
                  onChange={(e) => setCefr(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-purple-500 font-bold"
                >
                  <option value="A1">A1 — Sơ cấp</option>
                  <option value="A2">A2 — Tiền trung cấp</option>
                  <option value="B1">B1 — Trung cấp</option>
                  <option value="B2">B2 — Trung cao cấp</option>
                  <option value="C1">C1 — Cao cấp</option>
                  <option value="C2">C2 — Thành thạo</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Số Lượng Câu Hỏi
                </label>
                <div className="flex space-x-2">
                  <select
                    value={soLuong}
                    onChange={(e) => setSoLuong(+e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-purple-300 focus:outline-none focus:border-purple-500 font-bold"
                  >
                    <option value={5}>5 câu (Mặc định)</option>
                    <option value={10}>10 câu</option>
                    <option value={15}>15 câu</option>
                  </select>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 h-10 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold rounded-xl flex items-center justify-center space-x-1 shadow-lg shadow-purple-600/30 transition disabled:opacity-50 shrink-0"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{loading ? '...' : 'Sinh Đề'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Custom topic input if selected */}
            {selectedTopic === 'CUSTOM' && (
              <div className="pt-2">
                <label className="block font-semibold text-purple-300 uppercase tracking-wider mb-1.5">
                  Nhập Chủ Đề Tùy Chỉnh Của Bạn:
                </label>
                <input
                  type="text"
                  required
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  placeholder="VD: Inversion, Subjunctive Mood, Phrasal Verbs with 'Look'..."
                  className="w-full bg-slate-950 border border-purple-500/50 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
                />
              </div>
            )}
          </form>
        </div>

        {/* Exercises Output */}
        {loading && (
          <div className="py-20 flex flex-col items-center justify-center space-y-3">
            <div className="w-10 h-10 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
            <p className="text-xs text-slate-400 animate-pulse font-medium">
              Hệ thống AI đang biên soạn {soLuong} câu hỏi chuẩn CEFR {cefr}...
            </p>
          </div>
        )}

        {result?.data?.cauHoi && (
          <div className="space-y-6">
            {/* Header info & view toggle */}
            <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-2 text-purple-300 text-xs">
                <BookOpen className="w-4 h-4 text-purple-400 shrink-0" />
                <span>
                  Chủ đề: <strong>{result.data.chuDe}</strong> — Trình độ: <strong>CEFR {result.data.trinhDo}</strong>
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => setTeacherViewKey(!teacherViewKey)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 text-xs font-semibold flex items-center space-x-1.5 border border-indigo-500/30 transition"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{teacherViewKey ? 'Ẩn Đáp Án Mẫu' : 'Xem Nhanh Đáp Án (Teacher Mode)'}</span>
                </button>
                <span
                  className={`text-[11px] font-medium px-2.5 py-1 rounded-full border ${
                    result.mode === 'AI_CACHE'
                      ? 'bg-amber-500/15 text-amber-300 border-amber-500/40'
                      : result.mode === 'AI_GEMINI'
                      ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                      : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  {result.mode === 'AI_CACHE'
                    ? '⚡ Bộ Nhớ Đệm AI (Tức Thì)'
                    : result.mode === 'AI_GEMINI'
                    ? '✨ Trí Tuệ Nhân Tạo (AI)'
                    : '📦 Mẫu Dự Phòng (Fallback)'}
                </span>
              </div>
            </div>

            {/* Questions List */}
            <div className="space-y-4">
              {result.data.cauHoi.map((q: any, idx: number) => {
                const selected = userAnswers[idx];
                const isCorrect = selected === q.dapAnDung;
                const revealMode = submitted || teacherViewKey;

                return (
                  <div key={q.id || idx} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                    <div className="flex items-start space-x-3">
                      <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 font-bold text-xs flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <p className="text-sm font-semibold text-white leading-relaxed">{q.noiDung}</p>
                    </div>

                    {/* Options */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pl-9">
                      {q.luaChon &&
                        Object.entries(q.luaChon).map(([optKey, optVal]: [string, any]) => {
                          const isChosen = selected === optKey;
                          let btnClass = 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700';

                          if (revealMode) {
                            if (optKey === q.dapAnDung) {
                              btnClass = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-semibold';
                            } else if (isChosen && !isCorrect && submitted) {
                              btnClass = 'bg-rose-500/20 border-rose-500 text-rose-300 font-semibold';
                            } else {
                              btnClass = 'bg-slate-950/40 border-slate-900 text-slate-600 opacity-60';
                            }
                          } else if (isChosen) {
                            btnClass = 'bg-purple-600 border-purple-500 text-white font-semibold shadow-md shadow-purple-500/30';
                          }

                          return (
                            <button
                              key={optKey}
                              type="button"
                              onClick={() => handleSelectOption(idx, optKey)}
                              className={`p-3 rounded-xl border text-xs text-left transition flex items-center space-x-2 ${btnClass}`}
                            >
                              <span className="font-bold opacity-80">[{optKey}]</span>
                              <span>{optVal}</span>
                            </button>
                          );
                        })}
                    </div>

                    {/* Explanation after submit or in teacher mode */}
                    {revealMode && (
                      <div
                        className={`ml-9 p-3.5 rounded-xl border text-xs ${
                          isCorrect || teacherViewKey
                            ? 'bg-emerald-950/30 border-emerald-800/50 text-emerald-300'
                            : 'bg-rose-950/30 border-rose-800/50 text-rose-300'
                        }`}
                      >
                        <div className="flex items-center space-x-1.5 font-bold mb-1">
                          {isCorrect || teacherViewKey ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <XCircle className="w-4 h-4 text-rose-400" />
                          )}
                          <span>
                            {teacherViewKey
                              ? `Đáp án đúng: [${q.dapAnDung}]`
                              : isCorrect
                              ? 'Chính xác!'
                              : `Chưa đúng. Đáp án là [${q.dapAnDung}]`}
                          </span>
                        </div>
                        <p className="text-slate-300 text-[11px]">{q.giaiThich}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Bottom action panel */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              {submitted ? (
                <>
                  <div className="flex items-center space-x-3">
                    <span className="text-xs text-slate-400">Kết quả làm thử:</span>
                    <span className="text-xl font-black text-indigo-400">
                      {calculateScore()} / {result.data.cauHoi.length} Câu Đúng
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300">
                      ({((calculateScore() / result.data.cauHoi.length) * 100).toFixed(0)}%)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setUserAnswers({});
                    }}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl flex items-center space-x-1.5 transition"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Làm Lại</span>
                  </button>
                </>
              ) : (
                <>
                  <span className="text-xs text-slate-400">
                    Đã chọn đáp án: <strong className="text-white">{Object.keys(userAnswers).length}</strong> /{' '}
                    {result.data.cauHoi.length} câu
                  </span>
                  <button
                    type="button"
                    disabled={Object.keys(userAnswers).length < result.data.cauHoi.length}
                    onClick={() => setSubmitted(true)}
                    className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-600/30 transition disabled:opacity-40"
                  >
                    Nộp Bài & Chấm Điểm
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
