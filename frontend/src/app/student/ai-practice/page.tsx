'use client';

import React, { useState, useEffect } from 'react';
import { AppLayout } from '../../../components/AppLayout';
import { aiService } from '../../../services/api';
import { validateAiPrompt } from '../../../utils/ai-validator';
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Layers,
  Clock,
  PlusCircle,
  CheckSquare,
  HelpCircle,
  History,
  Printer,
} from 'lucide-react';
import { ExerciseHistoryModal } from '../../../components/ai/ExerciseHistoryModal';
import { PaperExamModal } from '../../../components/ai/PaperExamModal';

const PREDEFINED_TOPICS = [
  'Thì Hiện Tại Hoàn Thành (Present Perfect Tense)',
  'Câu Điều Kiện Loại 1, 2, 3 (Conditional Sentences)',
  'Mệnh Đề Quan Hệ (Relative Clauses)',
  'Câu Bị Động Nâng Cao (Passive Voice)',
  'Cụm Động Từ Thông Dụng (Common Phrasal Verbs)',
  'Từ Vựng Tiếng Anh Công Sở & Giao Tiếp (Business English)',
  'Tiếng Anh Chuyên Ngành Công Nghệ Thông Tin (IT & Tech)',
  'Từ Vựng Du Lịch, Khách Sạn & Khám Phá (Travel & Tourism)',
  'Điện Ảnh, Âm Nhạc & Giải Trí (Entertainment & Media)',
  'Giới Từ Chỉ Thời Gian & Nơi Chốn (Prepositions)',
  'Động Từ Khuyết Thiếu (Modal Verbs)',
  'Sự Hòa Hợp Chủ Vị (Subject-Verb Agreement)',
  'Câu Tường Thuật Gián Tiếp (Reported Speech)',
  'So Sánh Hơn & So Sánh Nhất (Comparatives & Superlatives)',
  'Từ Vựng IELTS Chủ Đề Môi Trường & Xã Hội',
  'CUSTOM',
];

const QUICK_SUGGESTIONS = [
  'Công nghệ thông tin (IT)',
  'Du lịch & Khám phá (Travel)',
  'Điện ảnh & Giải trí (Entertainment)',
  'Đảo ngữ (Inversion)',
  'Câu giả định (Subjunctive Mood)',
  'Phrasal verbs with "Look"',
  'Mạo từ A / An / The',
  'Gerund vs Infinitive',
  'IELTS Writing Task 2 Vocab',
];

export default function StudentAiPracticePage() {
  const [selectedTopic, setSelectedTopic] = useState(PREDEFINED_TOPICS[0]);
  const [customTopic, setCustomTopic] = useState('');
  const [cefr, setCefr] = useState('B1');
  const [soLuong, setSoLuong] = useState(5);
  const [loaiCauHoi, setLoaiCauHoi] = useState('MIXED');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [userAnswers, setUserAnswers] = useState<Record<number, string | string[]>>({});
  const [submitted, setSubmitted] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [printExamData, setPrintExamData] = useState<any>(null);

  const handleSelectPastExercise = (item: any) => {
    const loadedResult = {
      success: true,
      mode: item.mode || 'AI_GEMINI',
      data: item.data,
    };
    setResult(loadedResult);
    setUserAnswers({});
    setSubmitted(false);
    if (item.chuDe) setSelectedTopic(item.chuDe);
    if (item.trinhDo) setCefr(item.trinhDo);
    if (item.soCau) setSoLuong(item.soCau);
    saveToSession(loadedResult, {}, false);
    setTimeout(() => {
      window.scrollTo({ top: 350, behavior: 'smooth' });
    }, 100);
  };

  const handlePrintPastExercise = (item: any) => {
    setPrintExamData(item.data);
  };

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
        if (parsed.loaiCauHoi) setLoaiCauHoi(parsed.loaiCauHoi);
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
          loaiCauHoi,
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

    // Kiểm tra chủ đề rác / vô nghĩa ngay tại Frontend
    if (selectedTopic === 'CUSTOM') {
      const validation = validateAiPrompt(activeTopic, 'TOPIC');
      if (!validation.isValid) {
        alert(validation.errorMessage);
        return;
      }
    } else if (!activeTopic || activeTopic.length < 3) {
      alert('Chủ đề bài tập quá ngắn! Vui lòng chọn chủ đề hợp lệ.');
      return;
    }

    setLoading(true);
    setResult(null);
    setUserAnswers({});
    setSubmitted(false);
    sessionStorage.removeItem('etc_ai_practice_session');

    try {
      const res = await aiService.generateExercises(activeTopic, cefr, soLuong, loaiCauHoi);
      setResult(res);
      saveToSession(res, {}, false);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Có lỗi khi sinh bài trắc nghiệm.');
    } finally {
      setLoading(false);
      setCooldown(5); // 5s cooldown chống spam
    }
  };

  // Xác định câu hỏi thuộc dạng nào
  const getQuestionTypeInfo = (q: any) => {
    const isMulti = q.loaiCauHoi === 'MULTIPLE' || Array.isArray(q.dapAnDung);
    const isTrueFalse =
      !isMulti &&
      (q.loaiCauHoi === 'TRUE_FALSE' ||
        (typeof q.noiDung === 'string' &&
          (q.noiDung.includes('(True or False)') ||
            q.noiDung.includes('True/False') ||
            q.noiDung.includes('(Đúng hay Sai)'))) ||
        (q.luaChon &&
          Object.keys(q.luaChon).length === 2 &&
          Object.values(q.luaChon).some(
            (v: any) =>
              typeof v === 'string' &&
              (v.toLowerCase().includes('true') || v.toLowerCase().includes('đúng')),
          )));

    if (isMulti) {
      return {
        isMulti: true,
        isTrueFalse: false,
        badgeLabel: '☑ Chọn nhiều đáp án đúng',
        badgeClass: 'bg-purple-50 text-purple-700 border-purple-200',
        instruction: 'Bạn có thể chọn một hoặc nhiều phương án đúng',
      };
    }
    if (isTrueFalse) {
      return {
        isMulti: false,
        isTrueFalse: true,
        badgeLabel: '⚖️ Đúng / Sai (True / False)',
        badgeClass: 'bg-sky-50 text-sky-700 border-sky-200',
        instruction: 'Chọn Đúng (True) hoặc Sai (False)',
      };
    }
    return {
      isMulti: false,
      isTrueFalse: false,
      badgeLabel: '🔘 1 đáp án đúng (Single Choice)',
      badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
      instruction: 'Chọn 1 đáp án chính xác nhất',
    };
  };

  const getRenderOptions = (q: any, isTrueFalse: boolean): [string, any][] => {
    if (isTrueFalse) {
      // Dạng Đúng / Sai BẮT BUỘC chỉ hiển thị 2 lựa chọn A (True) và B (False)
      const trueVal =
        q.luaChon?.['A'] || q.luaChon?.['True'] || q.luaChon?.['TRUE'] || 'True (Đúng)';
      const falseVal =
        q.luaChon?.['B'] || q.luaChon?.['False'] || q.luaChon?.['FALSE'] || 'False (Sai)';
      return [
        [
          'A',
          typeof trueVal === 'string' && trueVal.toLowerCase().includes('true')
            ? trueVal
            : 'True (Đúng)',
        ],
        [
          'B',
          typeof falseVal === 'string' && falseVal.toLowerCase().includes('false')
            ? falseVal
            : 'False (Sai)',
        ],
      ];
    }
    return q.luaChon ? (Object.entries(q.luaChon) as [string, any][]) : [];
  };

  const handleSelectOption = (qIdx: number, optionKey: string, isMultiple: boolean) => {
    if (submitted) return;
    let newAnswers: Record<number, string | string[]>;

    if (isMultiple) {
      const current = Array.isArray(userAnswers[qIdx])
        ? [...(userAnswers[qIdx] as string[])]
        : userAnswers[qIdx]
        ? [userAnswers[qIdx] as string]
        : [];
      const next = current.includes(optionKey)
        ? current.filter((k) => k !== optionKey)
        : [...current, optionKey].sort();
      newAnswers = { ...userAnswers, [qIdx]: next };
    } else {
      newAnswers = { ...userAnswers, [qIdx]: optionKey };
    }

    setUserAnswers(newAnswers);
    saveToSession(result, newAnswers, submitted);
  };

  const isQuestionCorrect = (q: any, userAns: any) => {
    if (!userAns) return false;
    const typeInfo = getQuestionTypeInfo(q);

    if (typeInfo.isTrueFalse) {
      let correctKey = typeof q.dapAnDung === 'string' ? q.dapAnDung.trim().toUpperCase() : 'A';
      if (correctKey.includes('TRUE')) correctKey = 'A';
      else if (correctKey.includes('FALSE')) correctKey = 'B';
      else if (correctKey !== 'A' && correctKey !== 'B') correctKey = 'A';

      const userKey =
        typeof userAns === 'string'
          ? userAns.trim().toUpperCase()
          : Array.isArray(userAns)
          ? userAns[0]
          : '';
      return userKey === correctKey;
    }

    const correctAns = q.dapAnDung;

    if (Array.isArray(correctAns)) {
      const userArr = Array.isArray(userAns) ? userAns : [userAns];
      if (userArr.length !== correctAns.length) return false;
      return correctAns.every((k: string) => userArr.includes(k));
    }

    if (typeof correctAns === 'string' && correctAns.includes(',')) {
      const correctArr = correctAns.split(',').map((k: string) => k.trim().toUpperCase());
      const userArr = (Array.isArray(userAns) ? userAns : [userAns]).map((k: string) =>
        k.trim().toUpperCase(),
      );
      if (userArr.length !== correctArr.length) return false;
      return correctArr.every((k: string) => userArr.includes(k));
    }

    if (Array.isArray(userAns)) {
      return userAns.length === 1 && userAns[0] === correctAns;
    }
    return userAns === correctAns;
  };

  const formatCorrectAnswer = (q: any) => {
    const typeInfo = getQuestionTypeInfo(q);
    if (typeInfo.isTrueFalse) {
      const isA = q.dapAnDung === 'A' || String(q.dapAnDung).toUpperCase().includes('TRUE');
      return isA ? 'A — True (Đúng)' : 'B — False (Sai)';
    }
    if (Array.isArray(q.dapAnDung)) return q.dapAnDung.join(', ');
    return String(q.dapAnDung);
  };

  const calculateScore = () => {
    if (!result?.data?.cauHoi) return 0;
    let correct = 0;
    result.data.cauHoi.forEach((q: any, idx: number) => {
      if (isQuestionCorrect(q, userAnswers[idx])) correct++;
    });
    return correct;
  };

  const countAnswered = () => {
    if (!result?.data?.cauHoi) return 0;
    let count = 0;
    result.data.cauHoi.forEach((_: any, idx: number) => {
      const a = userAnswers[idx];
      if (Array.isArray(a) ? a.length > 0 : !!a) count++;
    });
    return count;
  };

  return (
    <AppLayout
      allowedRoles={['HOC_VIEN', 'GIAO_VIEN', 'QUAN_LY']}
      title="Luyện Tập Trắc Nghiệm Tương Tác AI"
      subtitle="Tạo bài luyện tập tức thì theo chủ đề (tùy chọn 5, 10, 15 câu), chấm điểm trực tiếp và xem giải thích"
    >
      <div className="space-y-6">
        {/* Form Cấu Hình Sinh Đề */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-teal-600" />
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                Cấu Hình Sinh Đề Bài Tập AI
              </span>
            </div>
            <button
              type="button"
              onClick={() => setShowHistoryModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-bold flex items-center space-x-1.5 transition cursor-pointer self-start sm:self-auto shadow-2xs"
            >
              <History className="w-3.5 h-3.5 text-teal-600" />
              <span>Lịch Sử Đề Đã Tạo</span>
            </button>
          </div>

          <form onSubmit={handleGenerate} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
              {/* Chủ đề */}
              <div className="md:col-span-5">
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

              {/* CEFR */}
              <div className="md:col-span-2">
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

              {/* Dạng câu hỏi */}
              <div className="md:col-span-3">
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Dạng Câu Hỏi
                </label>
                <select
                  value={loaiCauHoi}
                  onChange={(e) => setLoaiCauHoi(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-teal-800 font-bold focus:outline-none focus:border-teal-500 cursor-pointer"
                >
                  <option value="MIXED">🌟 Hỗn hợp (Trắc nghiệm, Đúng/Sai, Nhiều đáp án)</option>
                  <option value="SINGLE">🔘 Trắc nghiệm 1 đáp án (A, B, C, D)</option>
                  <option value="TRUE_FALSE">⚖️ Đúng / Sai (True / False)</option>
                  <option value="MULTIPLE">☑️ Chọn nhiều đáp án đúng</option>
                </select>
              </div>

              {/* Số lượng + Nút Sinh Đề */}
              <div className="md:col-span-2">
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Số Lượng
                </label>
                <div className="flex space-x-2">
                  <select
                    value={soLuong}
                    onChange={(e) => setSoLuong(+e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2.5 text-teal-800 focus:outline-none focus:border-teal-500 font-bold cursor-pointer"
                  >
                    <option value={5}>5 câu</option>
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
                        <span>{cooldown}s</span>
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
                  <span
                    className={`text-[10px] font-mono ${
                      customTopic.length > 80 ? 'text-amber-600' : 'text-slate-400'
                    }`}
                  >
                    {customTopic.length}/100 ký tự
                  </span>
                </div>
                <input
                  type="text"
                  required
                  maxLength={100}
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  placeholder="VD: Công nghệ thông tin, Du lịch khách sạn, Điện ảnh giải trí, Inversion..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-500 text-xs"
                />

                {/* Gợi ý chủ đề nhanh & thông dụng */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] text-slate-500 font-medium">💡 Gợi ý nhanh:</span>
                  {QUICK_SUGGESTIONS.map((sug) => (
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
              Hệ thống AI đang biên soạn {soLuong} câu hỏi tương tác chuẩn CEFR {cefr}...
            </p>
          </div>
        )}

        {/* Result & Quiz Area */}
        {result?.data?.cauHoi && (
          <div className="space-y-6">
            {/* Header Thống Kê */}
            <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-xs text-teal-900 font-bold">
                Bài tập: <strong>{result.data.chuDe}</strong> — Trình độ: <strong>CEFR {result.data.trinhDo}</strong> ({result.data.cauHoi.length} câu)
              </span>
              <div className="flex items-center space-x-2">
                <span
                  className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                    result.mode === 'AI_COMMUNITY_CACHE'
                      ? 'bg-amber-100 text-amber-800 border-amber-300'
                      : result.mode === 'GEMINI_AI'
                      ? 'bg-teal-100 text-teal-800 border-teal-300'
                      : 'bg-slate-100 text-slate-700 border-slate-300'
                  }`}
                >
                  {result.mode === 'AI_COMMUNITY_CACHE'
                    ? '⚡ Đề Tương Thích (Kho AI)'
                    : result.mode === 'GEMINI_AI'
                    ? '✨ Trí Tuệ Nhân Tạo (AI)'
                    : '📦 Mẫu Dự Phòng (Fallback)'}
                </span>
                <button
                  type="button"
                  onClick={() => setPrintExamData(result.data)}
                  className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-50 text-teal-800 text-[11px] font-bold flex items-center space-x-1 border border-teal-200 transition cursor-pointer shadow-xs"
                  title="In phiếu bài tập ra giấy A4 hoặc lưu file PDF để tự ôn luyện"
                >
                  <Printer className="w-3.5 h-3.5 text-teal-600" />
                  <span>In Phiếu Bài Tập</span>
                </button>
              </div>
            </div>

            {/* Danh Sách Câu Hỏi */}
            <div className="space-y-4">
              {result.data.cauHoi.map((q: any, idx: number) => {
                const typeInfo = getQuestionTypeInfo(q);
                const selected = userAnswers[idx];
                const isCorrect = isQuestionCorrect(q, selected);

                return (
                  <div
                    key={q.id || idx}
                    className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start space-x-3">
                        <span className="w-6 h-6 rounded-full bg-teal-50 border border-teal-200 text-teal-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <div className="space-y-1">
                          <p className="text-sm font-bold text-slate-900 leading-relaxed">
                            {q.noiDung}
                          </p>
                          <p className="text-[11px] text-slate-500 italic">
                            {typeInfo.instruction}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-md border shrink-0 ${typeInfo.badgeClass}`}
                      >
                        {typeInfo.badgeLabel}
                      </span>
                    </div>

                    <div
                      className={`grid gap-2.5 pl-9 ${
                        typeInfo.isTrueFalse ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2'
                      }`}
                    >
                      {getRenderOptions(q, typeInfo.isTrueFalse).map(([optKey, optVal]: [string, any]) => {
                          const isChosen = Array.isArray(selected)
                            ? selected.includes(optKey)
                            : selected === optKey;

                          const isAnswerKey = typeInfo.isTrueFalse
                            ? (optKey === 'A' &&
                                (q.dapAnDung === 'A' ||
                                  String(q.dapAnDung).toUpperCase().includes('TRUE'))) ||
                              (optKey === 'B' &&
                                (q.dapAnDung === 'B' ||
                                  String(q.dapAnDung).toUpperCase().includes('FALSE')))
                            : Array.isArray(q.dapAnDung)
                            ? q.dapAnDung.includes(optKey)
                            : typeof q.dapAnDung === 'string' && q.dapAnDung.includes(',')
                            ? q.dapAnDung
                                .split(',')
                                .map((k: string) => k.trim())
                                .includes(optKey)
                            : q.dapAnDung === optKey;

                          let btnClass =
                            'bg-slate-50 border-slate-200 text-slate-700 hover:border-teal-300 hover:bg-teal-50/40';

                          if (submitted) {
                            if (isAnswerKey) {
                              btnClass =
                                'bg-emerald-50 border-emerald-300 text-emerald-800 font-bold ring-1 ring-emerald-300';
                            } else if (isChosen && !isCorrect) {
                              btnClass =
                                'bg-rose-50 border-rose-300 text-rose-800 font-bold ring-1 ring-rose-300';
                            } else {
                              btnClass = 'bg-slate-50/50 border-slate-200 text-slate-400 opacity-60';
                            }
                          } else if (isChosen) {
                            btnClass =
                              'bg-teal-600 border-teal-600 text-white font-bold shadow-sm ring-2 ring-teal-600/30';
                          }

                          return (
                            <button
                              key={optKey}
                              type="button"
                              onClick={() => handleSelectOption(idx, optKey, typeInfo.isMulti)}
                              className={`p-3 rounded-xl border text-xs text-left transition flex items-center space-x-2.5 cursor-pointer ${btnClass}`}
                            >
                              <span
                                className={`w-5 h-5 rounded-md flex items-center justify-center font-bold text-[11px] shrink-0 ${
                                  isChosen
                                    ? 'bg-white/20 text-white'
                                    : 'bg-slate-200/80 text-slate-700'
                                }`}
                              >
                                {typeInfo.isMulti ? (
                                  isChosen ? '☑' : '☐'
                                ) : (
                                  optKey
                                )}
                              </span>
                              <span className="leading-snug">{optVal}</span>
                            </button>
                          );
                        })}
                    </div>

                    {/* Giải thích chi tiết sau khi nộp bài */}
                    {submitted && (
                      <div
                        className={`ml-9 p-3.5 rounded-xl border text-xs ${
                          isCorrect
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                            : 'bg-rose-50 border-rose-200 text-rose-800'
                        }`}
                      >
                        <div className="flex items-center space-x-1.5 font-bold mb-1">
                          {isCorrect ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          ) : (
                            <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                          )}
                          <span>
                            {isCorrect
                              ? 'Chính xác!'
                              : `Chưa đúng. Đáp án chuẩn là: [${formatCorrectAnswer(q)}]`}
                          </span>
                        </div>
                        <p className="text-slate-700 text-[11px] leading-relaxed">
                          {q.giaiThich}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Khung Hành Động Dưới Cùng */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              {submitted ? (
                <>
                  <div className="flex items-center space-x-3">
                    <span className="text-xs text-slate-500 font-medium">Kết quả:</span>
                    <span className="text-xl font-black text-teal-700">
                      {calculateScore()} / {result.data.cauHoi.length} Câu Đúng
                    </span>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-teal-50 border border-teal-200 text-teal-800">
                      ({((calculateScore() / result.data.cauHoi.length) * 100).toFixed(0)}%)
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => setPrintExamData(result.data)}
                      className="px-3.5 py-2 bg-white hover:bg-slate-50 text-teal-800 text-xs font-bold rounded-xl flex items-center space-x-1.5 border border-teal-200 transition cursor-pointer"
                      title="In phiếu bài tập này ra giấy A4 hoặc lưu PDF"
                    >
                      <Printer className="w-3.5 h-3.5 text-teal-600" />
                      <span>In Phiếu Bài Tập</span>
                    </button>
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
                    <button
                      type="button"
                      onClick={handleResetSession}
                      className="px-4 py-2 bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold rounded-xl flex items-center space-x-1.5 border border-teal-200 transition cursor-pointer"
                    >
                      <PlusCircle className="w-3.5 h-3.5 text-teal-600" />
                      <span>Tạo Phiên Mới</span>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <span className="text-xs text-slate-500 font-medium">
                    Đã hoàn thành:{' '}
                    <strong className="text-slate-900 font-bold">{countAnswered()}</strong> /{' '}
                    {result.data.cauHoi.length} câu
                  </span>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={handleResetSession}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-xl flex items-center space-x-1.5 transition cursor-pointer"
                    >
                      <PlusCircle className="w-3.5 h-3.5 text-slate-500" />
                      <span>Hủy & Tạo Đề Khác</span>
                    </button>
                    <button
                      type="button"
                      disabled={countAnswered() < result.data.cauHoi.length}
                      onClick={() => {
                        setSubmitted(true);
                        saveToSession(result, userAnswers, true);
                      }}
                      className="px-6 py-2.5 bg-gradient-to-r from-teal-600 to-cyan-600 hover:opacity-95 text-white text-xs font-bold rounded-xl shadow-md shadow-teal-600/20 transition disabled:opacity-40 cursor-pointer"
                    >
                      Nộp Bài & Chấm Điểm
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
        {/* Modals for Exercise History and Paper Exam Print */}
        <ExerciseHistoryModal
          isOpen={showHistoryModal}
          onClose={() => setShowHistoryModal(false)}
          onSelectExercise={handleSelectPastExercise}
          onPrintExercise={handlePrintPastExercise}
        />

        <PaperExamModal
          isOpen={!!printExamData}
          onClose={() => setPrintExamData(null)}
          examData={printExamData}
        />
      </div>
    </AppLayout>
  );
}
