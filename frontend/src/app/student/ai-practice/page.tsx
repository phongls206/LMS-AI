'use client';

import React, { useState } from 'react';
import { AppLayout } from '../../../components/AppLayout';
import { aiService } from '../../../services/api';
import { Sparkles, HelpCircle, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';

export default function StudentAiPracticePage() {
  const [topic, setTopic] = useState('Từ Vựng Giao Tiếp IELTS & TOEIC');
  const [cefr, setCefr] = useState('B1');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setUserAnswers({});
    setSubmitted(false);

    try {
      const res = await aiService.generateExercises(topic, cefr);
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
      allowedRoles={['HOC_VIEN', 'GIAO_VIEN', 'QUAN_LY']}
      title="Luyện Tập Trắc Nghiệm Tương Tác AI"
      subtitle="Tạo bài luyện tập tức thì theo chủ đề mong muốn, chấm điểm trực tiếp và xem giải thích"
    >
      <div className="space-y-6">
        {/* Form */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm">
          <form onSubmit={handleGenerate} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end text-xs">
            <div className="md:col-span-2">
              <label className="block font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Chủ Đề Ôn Tập Mong Muốn
              </label>
              <input
                type="text"
                required
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="VD: Conditionals, Phrasal Verbs, Business English..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex space-x-3">
              <div className="w-1/2">
                <label className="block font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Độ Khó CEFR
                </label>
                <select
                  value={cefr}
                  onChange={(e) => setCefr(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-bold focus:outline-none focus:border-indigo-500"
                >
                  <option value="A1">A1</option>
                  <option value="A2">A2</option>
                  <option value="B1">B1</option>
                  <option value="B2">B2</option>
                  <option value="C1">C1</option>
                </select>
              </div>

              <div className="w-1/2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-10 mt-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold rounded-xl flex items-center justify-center space-x-1.5 shadow-lg shadow-purple-600/30 transition disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{loading ? 'Đang Tạo...' : 'Bắt Đầu Làm'}</span>
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Exercises */}
        {result?.data?.cauHoi && (
          <div className="space-y-4">
            {submitted && (
              <div className="p-4 rounded-2xl bg-indigo-950/60 border border-indigo-500/30 flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-white text-base">
                    Kết Quả: {calculateScore()} / {result.data.cauHoi.length} Câu Đúng
                  </h4>
                  <p className="text-xs text-indigo-300">
                    {calculateScore() >= 4 ? 'Xuất sắc! Bạn nắm rất vững kiến thức.' : 'Hãy xem lại các câu sai bên dưới nhé.'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setUserAnswers({});
                    setSubmitted(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-1.5 transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Làm Lại</span>
                </button>
              </div>
            )}

            <div className="space-y-4">
              {result.data.cauHoi.map((q: any, idx: number) => {
                const isAnswered = userAnswers[idx] !== undefined;
                const isCorrect = userAnswers[idx] === q.dapAnDung;

                return (
                  <div key={idx} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                    <div className="flex items-start space-x-3">
                      <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 font-bold text-xs flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <p className="text-sm font-semibold text-white leading-relaxed">{q.noiDung}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pl-9">
                      {q.luaChon &&
                        Object.entries(q.luaChon).map(([key, val]: [string, any]) => {
                          const selected = userAnswers[idx] === key;
                          let optionClass = 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700';

                          if (submitted) {
                            if (key === q.dapAnDung) {
                              optionClass = 'bg-emerald-500/10 border-emerald-500 text-emerald-300 font-bold';
                            } else if (selected && !isCorrect) {
                              optionClass = 'bg-rose-500/10 border-rose-500 text-rose-300 line-through';
                            }
                          } else if (selected) {
                            optionClass = 'bg-indigo-600/20 border-indigo-500 text-indigo-200 font-bold';
                          }

                          return (
                            <button
                              key={key}
                              type="button"
                              onClick={() => handleSelectOption(idx, key)}
                              className={`p-3 rounded-xl border text-xs text-left transition ${optionClass}`}
                            >
                              <span className="font-bold mr-2">[{key}]</span>
                              <span>{val}</span>
                            </button>
                          );
                        })}
                    </div>

                    {submitted && (
                      <div className="pl-9 pt-1">
                        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-slate-300 space-y-1">
                          <p className="text-emerald-400 font-semibold">
                            ✅ Giải thích: <span className="font-mono text-white">Đáp án [{q.dapAnDung}]</span>
                          </p>
                          <p className="text-slate-400">{q.giaiThich}</p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {!submitted && (
              <button
                type="button"
                onClick={() => setSubmitted(true)}
                disabled={Object.keys(userAnswers).length === 0}
                className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition disabled:opacity-50"
              >
                Nộp Bài & Chấm Điểm Ngay
              </button>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
