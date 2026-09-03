'use client';

import React, { useState, useEffect } from 'react';
import { AppLayout } from '../../../components/AppLayout';
import { aiService } from '../../../services/api';
import { Sparkles, CheckCircle2, XCircle, RotateCcw, BookOpen, Layers, Eye, PlayCircle, PlusCircle, Clock } from 'lucide-react';

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
  const [cooldown, setCooldown] = useState(0);

  // Bộ đếm ngược chống spam AI
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  // Khôi phục phiên bài tập từ sessionStorage khi chuyển qua lại giữa các trang
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('etc_ai_teacher_exercises');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.result) setResult(parsed.result);
        if (parsed.userAnswers) setUserAnswers(parsed.userAnswers);
        if (typeof parsed.submitted === 'boolean') setSubmitted(parsed.submitted);
        if (typeof parsed.teacherViewKey === 'boolean') setTeacherViewKey(parsed.teacherViewKey);
        if (parsed.selectedTopic) setSelectedTopic(parsed.selectedTopic);
        if (parsed.customTopic) setCustomTopic(parsed.customTopic);
        if (parsed.cefr) setCefr(parsed.cefr);
        if (parsed.soLuong) setSoLuong(parsed.soLuong);
      }
    } catch (e) {
      console.error('Lỗi đọc phiên bài tập:', e);
    }
  }, []);

  const saveToSession = (newResult: any, newAnswers: any, newSubmitted: boolean, newViewKey: boolean) => {
    try {
      sessionStorage.setItem(
        'etc_ai_teacher_exercises',
        JSON.stringify({
          result: newResult,
          userAnswers: newAnswers,
          submitted: newSubmitted,
          teacherViewKey: newViewKey,
          selectedTopic,
          customTopic,
          cefr,
          soLuong,
        }),
      );
    } catch (e) {}
  };

  const handleResetSession = () => {
    sessionStorage.removeItem('etc_ai_teacher_exercises');
    setResult(null);
    setUserAnswers({});
    setSubmitted(false);
  };

  const activeTopic = selectedTopic === 'CUSTOM' ? customTopic.trim() : selectedTopic;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTopic || activeTopic.length < 3) {
      alert('Chủ đề bài tập quá ngắn! Vui lòng nhập tối thiểu 3 ký tự.');
      return;
    }

    // Kiểm tra chủ đề rác / vô nghĩa ngay tại Frontend
    if (selectedTopic === 'CUSTOM') {
      if (/(.)\1{4,}/.test(activeTopic) || !/[a-zA-ZÀ-ỹ]/.test(activeTopic)) {
        alert('Chủ đề chứa ký tự không hợp lệ hoặc chuỗi vô nghĩa. Vui lòng nhập chủ đề tiếng Anh cụ thể.');
        return;
      }
      const words = activeTopic.split(/\s+/);
      for (const word of words) {
        const clean = word.replace(/[^a-zA-ZÀ-ỹ]/g, '').toLowerCase();
        if (clean.length >= 6) {
          const hasVowel = /[aeiouyáàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵ]/.test(clean);
          if (!hasVowel) {
            alert(`Phát hiện từ không có nghĩa: "${word}". Vui lòng nhập chủ đề ngữ pháp / từ vựng tiếng Anh hợp lệ.`);
            return;
          }
        }
      }
    }

    setLoading(true);
    setResult(null);
    setUserAnswers({});
    setSubmitted(false);
    sessionStorage.removeItem('etc_ai_teacher_exercises');

    try {
      const res = await aiService.generateExercises(activeTopic, cefr, soLuong);
      setResult(res);
      saveToSession(res, {}, false, teacherViewKey);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Lỗi gọi AI sinh bài tập.');
    } finally {
      setLoading(false);
      setCooldown(5); // 5s cooldown chống spam
    }
  };

  const handleSelectOption = (qIdx: number, optionKey: string) => {
    if (submitted) return;
    const newAnswers = { ...userAnswers, [qIdx]: optionKey };
    setUserAnswers(newAnswers);
    saveToSession(result, newAnswers, submitted, teacherViewKey);
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
                    disabled={loading || cooldown > 0}
                    className="px-4 h-10 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold rounded-xl flex items-center justify-center space-x-1.5 shadow-lg shadow-purple-600/30 transition disabled:opacity-50 shrink-0 cursor-pointer disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    ) : cooldown > 0 ? (
                      <span className="flex items-center space-x-1 text-amber-300 text-[11px] font-bold">
                        <Clock className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                        <span>Chờ {cooldown}s</span>
                      </span>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Sinh Đề</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Custom topic input if selected */}
            {selectedTopic === 'CUSTOM' && (
              <div className="pt-2 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block font-semibold text-purple-300 uppercase tracking-wider text-[11px]">
                    Nhập Chủ Đề Tùy Chỉnh Của Bạn:
                  </label>
                  <span className={`text-[10px] font-mono ${customTopic.length > 80 ? 'text-amber-400' : 'text-slate-500'}`}>
                    {customTopic.length}/100 ký tự
                  </span>
                </div>
                <input
                  type="text"
                  required
                  maxLength={100}
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  placeholder="VD: Inversion, Subjunctive Mood, Phrasal Verbs with 'Look'..."
                  className="w-full bg-slate-950 border border-purple-500/50 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 text-xs"
                />

                {/* Gợi ý chủ đề nhanh & lọc rác */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] text-slate-400 font-medium">💡 Gợi ý nhanh:</span>
                  {[
                    'Đảo ngữ (Inversion)',
                    'Câu giả định (Subjunctive Mood)',
                    'Phrasal verbs with "Look"',
                    'Mạo từ A / An / The',
                    'Gerund vs Infinitive',
                    'IELTS Writing Task 2 Vocab',
                  ].map((sug) => (
                    <button
                      key={sug}
                      type="button"
                      onClick={() => setCustomTopic(sug)}
                      className="px-2 py-0.5 rounded-md bg-purple-950/50 hover:bg-purple-900/60 text-purple-300 border border-purple-800/40 text-[10px] transition cursor-pointer"
                    >
                      +{sug}
                    </button>
                  ))}
                </div>
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
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    const nextKey = !teacherViewKey;
                    setTeacherViewKey(nextKey);
                    saveToSession(result, userAnswers, submitted, nextKey);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 text-xs font-semibold flex items-center space-x-1.5 border border-indigo-500/30 transition cursor-pointer"
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
                <button
                  type="button"
                  onClick={handleResetSession}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-semibold flex items-center space-x-1 border border-slate-700/60 transition cursor-pointer"
                  title="Xóa đề hiện tại để tạo phiên bài mới"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-purple-400" />
                  <span>Tạo Phiên Mới</span>
                </button>
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
                      saveToSession(result, {}, false, teacherViewKey);
                    }}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl flex items-center space-x-1.5 transition cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Làm Lại Đề Này</span>
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
                    onClick={() => {
                      setSubmitted(true);
                      saveToSession(result, userAnswers, true, teacherViewKey);
                    }}
                    className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-600/30 transition disabled:opacity-40 cursor-pointer"
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
