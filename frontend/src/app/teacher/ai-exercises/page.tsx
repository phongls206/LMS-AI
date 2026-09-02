'use client';

import React, { useState } from 'react';
import { AppLayout } from '../../../components/AppLayout';
import { aiService } from '../../../services/api';
import { Sparkles, CheckCircle2, HelpCircle, ArrowRight, BookOpen, Layers } from 'lucide-react';

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
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [showExplanation, setShowExplanation] = useState<Record<number, boolean>>({});

  const activeTopic = selectedTopic === 'CUSTOM' ? customTopic.trim() : selectedTopic;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTopic) {
      alert('Vui lòng chọn hoặc nhập chủ đề bài tập.');
      return;
    }

    setLoading(true);
    setResult(null);
    setShowExplanation({});

    try {
      const res = await aiService.generateExercises(activeTopic, cefr);
      setResult(res);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Lỗi gọi AI sinh bài tập.');
    } finally {
      setLoading(false);
    }
  };

  const toggleExplanation = (id: number) => {
    setShowExplanation((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <AppLayout
      allowedRoles={['GIAO_VIEN', 'HOC_VIEN', 'QUAN_LY']}
      title="Trợ Lý Giáo Viên AI: Sinh Đề Luyện Tập Trắc Nghiệm"
      subtitle="Tạo tức thì 05 câu hỏi trắc nghiệm tiếng Anh chuẩn khung CEFR kèm đáp án và giải thích"
    >
      <div className="space-y-6">
        {/* Form generator */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm">
          <form onSubmit={handleGenerate} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
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

              <div className="flex space-x-3">
                <div className="w-1/2">
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

                <div className="w-1/2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-10 mt-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold rounded-xl flex items-center justify-center space-x-1.5 shadow-lg shadow-purple-600/30 transition disabled:opacity-50"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{loading ? 'Đang Tạo...' : 'Sinh Đề AI'}</span>
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
            <p className="text-xs text-purple-300 font-medium animate-pulse">
              Gemini AI đang biên soạn 5 câu hỏi chuẩn CEFR {cefr}...
            </p>
          </div>
        )}

        {result && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-purple-950/30 border border-purple-800/40">
              <div className="flex items-center space-x-2 text-purple-300 text-xs">
                <BookOpen className="w-4 h-4 text-purple-400" />
                <span>
                  Chủ đề: <strong>{result.data?.chuDe}</strong> — Trình độ: <strong>CEFR {result.data?.trinhDo}</strong>
                </span>
              </div>
              <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Mode: {result.mode}
              </span>
            </div>

            <div className="space-y-4">
              {result.data?.cauHoi?.map((q: any, idx: number) => (
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
                      Object.entries(q.luaChon).map(([key, val]: [string, any]) => (
                        <div
                          key={key}
                          className={`p-3 rounded-xl border text-xs font-medium transition ${
                            key === q.dapAnDung
                              ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                              : 'bg-slate-950/60 border-slate-800 text-slate-300'
                          }`}
                        >
                          <span className="font-bold mr-2">[{key}]</span>
                          <span>{val}</span>
                        </div>
                      ))}
                  </div>

                  {/* Explanation toggle */}
                  <div className="pl-9 pt-2">
                    <button
                      type="button"
                      onClick={() => toggleExplanation(q.id || idx)}
                      className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center space-x-1"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>{showExplanation[q.id || idx] ? 'Ẩn Giải Thích' : 'Xem Đáp Án & Giải Thích Chi Tiết'}</span>
                    </button>

                    {showExplanation[q.id || idx] && (
                      <div className="mt-2.5 p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-slate-300 space-y-1">
                        <p className="text-emerald-400 font-semibold">
                          ✅ Đáp án đúng: <span className="font-bold font-mono">[{q.dapAnDung}]</span>
                        </p>
                        <p className="text-slate-400">{q.giaiThich}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
