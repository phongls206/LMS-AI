'use client';

import React, { useState, useEffect } from 'react';
import { AppLayout } from '../../../components/AppLayout';
import { aiService } from '../../../services/api';
import { Sparkles, HelpCircle, CheckCircle2, XCircle, RotateCcw, Layers, Clock } from 'lucide-react';

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

export default function StudentAiPracticePage() {
  const [selectedTopic, setSelectedTopic] = useState(PREDEFINED_TOPICS[0]);
  const [customTopic, setCustomTopic] = useState('');
  const [cefr, setCefr] = useState('B1');
  const [soLuong, setSoLuong] = useState(5);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  // Bộ đếm ngược chống spam AI
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  // Khôi phục phiên làm bài từ sessionStorage khi chuyển qua lại giữa các trang
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('etc_ai_practice_session');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.result) setResult(parsed.result);
        if (parsed.userAnswers) setUserAnswers(parsed.userAnswers);
        if (typeof parsed.submitted === 'boolean') setSubmitted(parsed.submitted);
        if (parsed.selectedTopic) setSelectedTopic(parsed.selectedTopic);
        if (parsed.customTopic) setCustomTopic(parsed.customTopic);
        if (parsed.cefr) setCefr(parsed.cefr);
        if (parsed.soLuong) setSoLuong(parsed.soLuong);
      }
    } catch (e) {
      console.error('Lỗi đọc phiên làm bài:', e);
    }
  }, []);

  const saveToSession = (newResult: any, newAnswers: any, newSubmitted: boolean) => {
    try {
      sessionStorage.setItem(
        'etc_ai_practice_session',
        JSON.stringify({
          result: newResult,
          userAnswers: newAnswers,
          submitted: newSubmitted,
          selectedTopic,
          customTopic,
          cefr,
          soLuong,
        }),
      );
    } catch (e) {}
  };

  const handleResetSession = () => {
    sessionStorage.removeItem('etc_ai_practice_session');
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
      const isGibberish = words.some((w) => w.length > 18 && !w.includes('-'));
      if (isGibberish) {
        alert('Chủ đề chứa từ vô nghĩa quá dài. Vui lòng nhập chủ đề học thuật rõ ràng.');
        return;
      }
    }

    setLoading(true);
    setResult(null);
    setUserAnswers({});
    setSubmitted(false);
    sessionStorage.removeItem('etc_ai_practice_session');

    try {
      const res = await aiService.generateExercises(activeTopic, cefr, soLuong);
      setResult(res);
      saveToSession(res, {}, false);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Có lỗi khi sinh bài trắc nghiệm.');
    } finally {
      setLoading(false);
      setCooldown(5); // 5s cooldown chống spam
    }
  };

  const handleSelectOption = (qIdx: number, optionKey: string) => {
    if (submitted) return;
    const newAnswers = { ...userAnswers, [qIdx]: optionKey };
    setUserAnswers(newAnswers);
    saveToSession(result, newAnswers, submitted);
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
      allowedRoles={['HOC_VIEN', 'GIAO_VIEN', 'QUAN_LY']}
      title="Luyện Tập Trắc Nghiệm Tương Tác AI"
      subtitle="Tạo bài luyện tập tức thì theo chủ đề (tùy chọn 5, 10, 15 câu), chấm điểm trực tiếp và xem giải thích"
    >
      <div className="space-y-6">
        {/* Form */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
          <form onSubmit={handleGenerate} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div className="md:col-span-2">
                <label className="block font-bold text-teal-800 uppercase tracking-wider mb-1.5 flex items-center space-x-1.5">
                  <Layers className="w-3.5 h-3.5 text-teal-600" />
                  <span>Chọn Chủ Đề Ôn Tập Chuẩn Khung CEFR</span>
                </label>
                <select
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 font-semibold focus:outline-none focus:border-teal-500 cursor-pointer"
                >
                  {PREDEFINED_TOPICS.map((t) => (
                    <option key={t} value={t}>
                      {t === 'CUSTOM' ? '✍️ Nhập chủ đề tùy chỉnh khác...' : `📚 ${t}`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Độ Khó CEFR
                </label>
                <select
                  value={cefr}
                  onChange={(e) => setCefr(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 font-bold focus:outline-none focus:border-teal-500 cursor-pointer"
                >
                  <option value="A1">A1 — Sơ cấp</option>
                  <option value="A2">A2 — Tiền trung cấp</option>
                  <option value="B1">B1 — Trung cấp</option>
                  <option value="B2">B2 — Trung cao cấp</option>
                  <option value="C1">C1 — Cao cấp</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Số Lượng Câu Hỏi
                </label>
                <div className="flex space-x-2">
                  <select
                    value={soLuong}
                    onChange={(e) => setSoLuong(+e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-teal-800 focus:outline-none focus:border-teal-500 font-bold cursor-pointer"
                  >
                    <option value={5}>5 câu (Mặc định)</option>
                    <option value={10}>10 câu</option>
                    <option value={15}>15 câu</option>
                  </select>
                  <button
                    type="submit"
                    disabled={loading || cooldown > 0}
                    className="px-4 h-10 bg-gradient-to-r from-teal-600 to-cyan-600 hover:opacity-95 text-white font-bold rounded-xl flex items-center justify-center space-x-1.5 shadow-md shadow-teal-600/20 transition disabled:opacity-50 shrink-0 cursor-pointer disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    ) : cooldown > 0 ? (
                      <span className="flex items-center space-x-1 text-amber-100 text-[11px] font-bold">
                        <Clock className="w-3.5 h-3.5 text-amber-200 animate-spin" />
                        <span>Chờ {cooldown}s</span>
                      </span>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Làm Bài</span>
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
                  <label className="block font-bold text-teal-800 uppercase tracking-wider text-[11px]">
                    Nhập Chủ Đề Tùy Chỉnh Của Bạn:
                  </label>
                  <span className={`text-[10px] font-mono ${customTopic.length > 80 ? 'text-amber-600' : 'text-slate-400'}`}>
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
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-500 text-xs"
                />

                {/* Gợi ý chủ đề nhanh & lọc rác */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] text-slate-500 font-medium">💡 Gợi ý nhanh:</span>
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
                      className="px-2 py-0.5 rounded-md bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-[10px] font-semibold transition cursor-pointer"
                    >
                      +{sug}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Loading */}
        {loading && (
          <div className="py-20 flex flex-col items-center justify-center space-y-3">
            <div className="w-10 h-10 border-4 border-teal-500/20 border-t-teal-600 rounded-full animate-spin"></div>
            <p className="text-xs text-teal-700 font-bold animate-pulse">
              Hệ thống AI đang sinh {soLuong} câu hỏi tương tác chuẩn CEFR {cefr}...
            </p>
          </div>
        )}

        {/* Result & Quiz Area */}
        {result?.data?.cauHoi && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-between">
              <span className="text-xs text-teal-900 font-bold">
                Bài tập: <strong>{result.data.chuDe}</strong> (CEFR {result.data.trinhDo})
              </span>
              <div className="flex items-center space-x-2">
                <span
                  className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                    result.mode === 'AI_CACHE'
                      ? 'bg-amber-100 text-amber-800 border-amber-300'
                      : result.mode === 'AI_GEMINI'
                      ? 'bg-teal-100 text-teal-800 border-teal-300'
                      : 'bg-slate-100 text-slate-700 border-slate-300'
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

            <div className="space-y-4">
              {result.data.cauHoi.map((q: any, idx: number) => {
                const selected = userAnswers[idx];
                const isCorrect = selected === q.dapAnDung;

                return (
                  <div key={q.id || idx} className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4">
                    <div className="flex items-start space-x-3">
                      <span className="w-6 h-6 rounded-full bg-teal-50 border border-teal-200 text-teal-700 font-bold text-xs flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <p className="text-sm font-bold text-slate-900 leading-relaxed">{q.noiDung}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pl-9">
                      {q.luaChon &&
                        Object.entries(q.luaChon).map(([optKey, optVal]: [string, any]) => {
                          const isChosen = selected === optKey;
                          let btnClass = 'bg-slate-50 border-slate-200 text-slate-700 hover:border-teal-300 hover:bg-teal-50/40';

                          if (submitted) {
                            if (optKey === q.dapAnDung) {
                              btnClass = 'bg-emerald-50 border-emerald-300 text-emerald-800 font-bold';
                            } else if (isChosen && !isCorrect) {
                              btnClass = 'bg-rose-50 border-rose-300 text-rose-800 font-bold';
                            } else {
                              btnClass = 'bg-slate-50/50 border-slate-200 text-slate-400 opacity-60';
                            }
                          } else if (isChosen) {
                            btnClass = 'bg-teal-600 border-teal-600 text-white font-bold shadow-sm';
                          }

                          return (
                            <button
                              key={optKey}
                              type="button"
                              onClick={() => handleSelectOption(idx, optKey)}
                              className={`p-3 rounded-xl border text-xs text-left transition flex items-center space-x-2 cursor-pointer ${btnClass}`}
                            >
                              <span className="font-bold opacity-80">[{optKey}]</span>
                              <span>{optVal}</span>
                            </button>
                          );
                        })}
                    </div>

                    {/* Explanation after submit */}
                    {submitted && (
                      <div
                        className={`ml-9 p-3.5 rounded-xl border text-xs ${
                          isCorrect ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
                        }`}
                      >
                        <div className="flex items-center space-x-1.5 font-bold mb-1">
                          {isCorrect ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <XCircle className="w-4 h-4 text-rose-600" />}
                          <span>{isCorrect ? 'Chính xác!' : `Chưa đúng. Đáp án là [${q.dapAnDung}]`}</span>
                        </div>
                        <p className="text-slate-700 text-[11px] leading-relaxed">{q.giaiThich}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Bottom action */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex items-center justify-between">
              {submitted ? (
                <>
                  <div className="flex items-center space-x-3">
                    <span className="text-xs text-slate-500 font-medium">Kết quả của bạn:</span>
                    <span className="text-xl font-black text-teal-700">
                      {calculateScore()} / {result.data.cauHoi.length} Câu Đúng
                    </span>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-teal-50 border border-teal-200 text-teal-800">
                      ({((calculateScore() / result.data.cauHoi.length) * 100).toFixed(0)}%)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setUserAnswers({});
                      saveToSession(result, {}, false);
                    }}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center space-x-1.5 transition cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Làm Lại Đề Này</span>
                  </button>
                </>
              ) : (
                <>
                  <span className="text-xs text-slate-500 font-medium">
                    Đã chọn: <strong className="text-slate-900 font-bold">{Object.keys(userAnswers).length}</strong> / {result.data.cauHoi.length} câu
                  </span>
                  <button
                    type="button"
                    disabled={Object.keys(userAnswers).length < result.data.cauHoi.length}
                    onClick={() => {
                      setSubmitted(true);
                      saveToSession(result, userAnswers, true);
                    }}
                    className="px-6 py-2.5 bg-gradient-to-r from-teal-600 to-cyan-600 hover:opacity-95 text-white text-xs font-bold rounded-xl shadow-md shadow-teal-600/20 transition disabled:opacity-40 cursor-pointer"
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
