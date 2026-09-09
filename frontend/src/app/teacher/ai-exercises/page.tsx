'use client';

import React, { useState, useEffect } from 'react';
import { AppLayout } from '../../../components/AppLayout';
import { aiService } from '../../../services/api';
import { validateAiPrompt } from '../../../utils/ai-validator';
import {
  BrainCircuit,
  CheckCircle2,
  XCircle,
  RotateCcw,
  BookOpen,
  Layers,
  Eye,
  PlusCircle,
  Clock,
  History,
  Printer,
  AlertTriangle,
  Check,
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

const TOPIC_ICONS: Record<string, string> = {
  'Thì Hiện Tại Hoàn Thành (Present Perfect Tense)': '⏳',
  'Câu Điều Kiện Loại 1, 2, 3 (Conditional Sentences)': '🔀',
  'Mệnh Đề Quan Hệ (Relative Clauses)': '🔗',
  'Câu Bị Động Nâng Cao (Passive Voice)': '🔄',
  'Cụm Động Từ Thông Dụng (Common Phrasal Verbs)': '🎯',
  'Từ Vựng Tiếng Anh Công Sở & Giao Tiếp (Business English)': '💼',
  'Tiếng Anh Chuyên Ngành Công Nghệ Thông Tin (IT & Tech)': '💻',
  'Từ Vựng Du Lịch, Khách Sạn & Khám Phá (Travel & Tourism)': '✈️',
  'Điện Ảnh, Âm Nhạc & Giải Trí (Entertainment & Media)': '🎬',
  'Giới Từ Chỉ Thời Gian & Nơi Chốn (Prepositions)': '📍',
  'Động Từ Khuyết Thiếu (Modal Verbs)': '🗝️',
  'Sự Hòa Hợp Chủ Vị (Subject-Verb Agreement)': '⚖️',
  'Câu Tường Thuật Gián Tiếp (Reported Speech)': '💬',
  'So Sánh Hơn & So Sánh Nhất (Comparatives & Superlatives)': '📈',
  'Từ Vựng IELTS Chủ Đề Môi Trường & Xã Hội': '🌿',
  'CUSTOM': '✍️',
};

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

export default function TeacherAiExercisesPage() {
  const [selectedTopic, setSelectedTopic] = useState(PREDEFINED_TOPICS[0]);
  const [customTopic, setCustomTopic] = useState('');
  const [cefr, setCefr] = useState('B1');
  const [soLuong, setSoLuong] = useState(5);
  const [loaiCauHoi, setLoaiCauHoi] = useState('MIXED');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  // Interactive quiz state
  const [userAnswers, setUserAnswers] = useState<Record<number, string | string[]>>({});
  const [submitted, setSubmitted] = useState(false);
  const [teacherViewKey, setTeacherViewKey] = useState(false);
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
    saveToSession(loadedResult, {}, false, teacherViewKey);
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
        if (parsed.loaiCauHoi) setLoaiCauHoi(parsed.loaiCauHoi);
      }
    } catch (e) {
      console.error('Lỗi đọc phiên bài tập:', e);
    }
  }, []);

  const saveToSession = (
    newResult: any,
    newAnswers: any,
    newSubmitted: boolean,
    newViewKey: boolean,
  ) => {
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
          loaiCauHoi,
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
    sessionStorage.removeItem('etc_ai_teacher_exercises');

    try {
      const res = await aiService.generateExercises(activeTopic, cefr, soLuong, loaiCauHoi);
      setResult(res);
      saveToSession(res, {}, false, teacherViewKey);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Có lỗi khi sinh bài tập.');
    } finally {
      setLoading(false);
      setCooldown(5); // 5s cooldown chống spam
    }
  };

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
        badgeLabel: '🔘 Chọn nhiều đáp án',
        badgeClass: 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
        instruction: 'Học viên có thể chọn nhiều phương án đúng',
      };
    }
    if (isTrueFalse) {
      return {
        isMulti: false,
        isTrueFalse: true,
        badgeLabel: '⚖️ Đúng / Sai',
        badgeClass: 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800',
        instruction: 'Dạng bài Đúng (True) hoặc Sai (False)',
      };
    }
    return {
      isMulti: false,
      isTrueFalse: false,
      badgeLabel: '🔘 Chọn 1 đáp án',
      badgeClass: 'bg-slate-100 dark:bg-[#1a2540] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-[#223052]',
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
    saveToSession(result, newAnswers, submitted, teacherViewKey);
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

  const isExamInProgress = !!result?.data?.cauHoi && !submitted;

  return (
    <AppLayout
      allowedRoles={['GIAO_VIEN', 'QUAN_LY']}
      title="Biên Soạn & Thử Nghiệm Bài Tập AI"
      subtitle="Giáo viên chủ động sinh bài luyện tập theo chuẩn khung CEFR, kiểm thử đáp án và lưu đề thi"
    >
      <div className="space-y-6">
        {/* Form Cấu Hình Sinh Đề */}
        <div className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-[#1e2d45] shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-[#1e2d45] pb-3">
            <div className="flex items-center space-x-2">
              <BrainCircuit className="w-4 h-4 text-teal-600" />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
                Biên Soạn Bộ Đề Bài Tập AI
              </span>
            </div>
            <button
              type="button"
              onClick={() => setShowHistoryModal(true)}
              className="px-3.5 py-1.5 min-h-[40px] rounded-xl bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 dark:hover:bg-teal-900/60 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800 text-xs font-bold flex items-center space-x-1.5 transition cursor-pointer self-start sm:self-auto shadow-2xs"
            >
              <History className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>Lịch Sử Đề Đã Tạo</span>
            </button>
          </div>

          <form onSubmit={handleGenerate} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
              <div className="md:col-span-4">
                <label className="block font-bold text-teal-800 dark:text-teal-400 uppercase tracking-wider mb-1.5 flex items-center space-x-1.5">
                  <Layers className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                  <span>Chọn Chủ Đề Ngữ Pháp / Từ Vựng</span>
                </label>
                <select
                  value={selectedTopic}
                  disabled={isExamInProgress}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#162032] border border-slate-200 dark:border-[#22324e] rounded-xl px-4 py-2.5 text-slate-900 dark:text-slate-100 font-semibold focus:outline-none focus:border-teal-500 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {PREDEFINED_TOPICS.map((t) => (
                    <option key={t} value={t}>
                      {t === 'CUSTOM'
                        ? '✍️ Nhập chủ đề tùy chỉnh khác...'
                        : `${TOPIC_ICONS[t] || '📘'} ${t}`}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Độ Khó CEFR
                </label>
                <select
                  value={cefr}
                  disabled={isExamInProgress}
                  onChange={(e) => setCefr(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#162032] border border-slate-200 dark:border-[#22324e] rounded-xl px-3 py-2.5 text-slate-900 dark:text-slate-100 font-bold focus:outline-none focus:border-teal-500 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <option value="A1">A1 — Sơ cấp</option>
                  <option value="A2">A2 — Tiền trung cấp</option>
                  <option value="B1">B1 — Trung cấp</option>
                  <option value="B2">B2 — Trung cao cấp</option>
                  <option value="C1">C1 — Cao cấp</option>
                  <option value="C2">C2 — Thành thạo</option>
                </select>
              </div>

              <div className="md:col-span-3">
                <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Dạng Câu Hỏi
                </label>
                <select
                  value={loaiCauHoi}
                  disabled={isExamInProgress}
                  onChange={(e) => setLoaiCauHoi(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#162032] border border-slate-200 dark:border-[#22324e] rounded-xl px-3 py-2.5 text-teal-800 dark:text-teal-300 font-bold focus:outline-none focus:border-teal-500 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <option value="MIXED">Hỗn hợp (Trắc nghiệm, Đúng/Sai, Nhiều đáp án)</option>
                  <option value="SINGLE">Chọn 1 đáp án (A, B, C, D)</option>
                  <option value="TRUE_FALSE">Đúng / Sai (True / False)</option>
                  <option value="MULTIPLE">Chọn nhiều đáp án</option>
                </select>
              </div>

              <div className="md:col-span-3">
                <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Số Lượng
                </label>
                <div className="flex items-center space-x-2 w-full">
                  <select
                    value={soLuong}
                    disabled={isExamInProgress}
                    onChange={(e) => setSoLuong(+e.target.value)}
                    className="w-24 shrink-0 bg-slate-50 dark:bg-[#162032] border border-slate-200 dark:border-[#22324e] rounded-xl px-2.5 py-2.5 text-teal-800 dark:text-teal-300 focus:outline-none focus:border-teal-500 font-bold cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <option value={5}>5 câu</option>
                    <option value={10}>10 câu</option>
                    <option value={15}>15 câu</option>
                  </select>
                  <button
                    type="submit"
                    disabled={loading || cooldown > 0 || isExamInProgress}
                    title={
                      isExamInProgress
                        ? 'Đang có bộ đề thử nghiệm dở dang. Vui lòng nộp bài hoặc nhấn "Hủy & Tạo Đề Khác" ở cuối trang để tạo đề mới.'
                        : 'Biên soạn bài tập mới với AI'
                    }
                    className={`flex-1 min-w-0 px-3.5 h-10 min-h-[40px] font-bold rounded-xl flex items-center justify-center space-x-1.5 shadow-md transition ${
                      isExamInProgress
                        ? 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 cursor-not-allowed opacity-75 shadow-none'
                        : 'bg-gradient-to-r from-teal-600 to-cyan-600 hover:opacity-95 text-white shadow-teal-600/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
                    }`}
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
                        <BrainCircuit className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">Sinh Đề</span>
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
              AI Trợ Giảng đang tổng hợp ngân hàng đề và sinh bài tập chuẩn CEFR {cefr}...
            </p>
          </div>
        )}

        {/* Result Area */}
        {result?.data?.cauHoi && (
          <div className="space-y-6">
            <div className="p-3.5 sm:p-4 rounded-xl bg-teal-50 dark:bg-[#13222e] border border-teal-200 dark:border-teal-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-2 text-teal-900 dark:text-teal-200 text-xs font-bold">
                <BookOpen className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                <span>
                  Chủ đề: <strong>{result.data.chuDe}</strong> — Trình độ: <strong>CEFR {result.data.trinhDo}</strong> ({result.data.cauHoi.length} câu)
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-start sm:justify-end">
                <button
                  type="button"
                  onClick={() => {
                    const nextKey = !teacherViewKey;
                    setTeacherViewKey(nextKey);
                    saveToSession(result, userAnswers, submitted, nextKey);
                  }}
                  className="px-3 py-1.5 min-h-[34px] rounded-lg bg-white dark:bg-[#162032] hover:bg-slate-50 dark:hover:bg-[#1e2d45] text-teal-800 dark:text-teal-300 text-xs font-bold flex items-center space-x-1.5 border border-slate-200 dark:border-slate-700 transition cursor-pointer shadow-xs"
                >
                  <Eye className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                  <span className="hidden sm:inline">{teacherViewKey ? 'Ẩn Đáp Án Mẫu' : 'Xem Nhanh Đáp Án (Teacher Mode)'}</span>
                  <span className="sm:hidden">{teacherViewKey ? 'Ẩn Đáp Án' : 'Xem Đáp Án'}</span>
                </button>
                <span
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${
                    result.mode === 'AI_CACHE' || result.mode === 'AI_COMMUNITY_CACHE'
                      ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800'
                      : result.mode === 'AI_GEMINI' || result.mode === 'GEMINI_AI'
                      ? 'bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border-teal-300 dark:border-teal-800'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                  }`}
                >
                  {result.mode === 'AI_CACHE'
                    ? '⚡ Bộ Nhớ Đệm AI (Tức Thì)'
                    : result.mode === 'AI_COMMUNITY_CACHE'
                    ? '⚡ Đề Tương Thích (Kho AI)'
                    : result.mode === 'AI_GEMINI' || result.mode === 'GEMINI_AI'
                    ? '✨ Trí Tuệ Nhân Tạo (AI)'
                    : '📦 Mẫu Dự Phòng (Fallback)'}
                </span>
                <button
                  type="button"
                  onClick={() => setPrintExamData(result.data)}
                  className="px-3 py-1.5 min-h-[34px] rounded-lg bg-white dark:bg-[#162032] hover:bg-slate-50 dark:hover:bg-[#1e2d45] text-teal-800 dark:text-teal-300 text-xs font-bold flex items-center space-x-1.5 border border-teal-200 dark:border-teal-800 transition cursor-pointer shadow-xs"
                  title="In phiếu bài tập ra giấy A4 hoặc lưu file PDF để phát cho học viên"
                >
                  <Printer className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                  <span>In Phiếu Bài Tập</span>
                </button>
              </div>
            </div>

            {/* Questions List */}
            <div className="space-y-4">
              {result.data.cauHoi.map((q: any, idx: number) => {
                const typeInfo = getQuestionTypeInfo(q);
                const selected = userAnswers[idx];
                const isCorrect = isQuestionCorrect(q, selected);
                const revealMode = submitted || teacherViewKey;

                return (
                  <div
                    key={q.id || idx}
                    className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-[#1e2d45] shadow-sm space-y-4"
                  >
                    <div className="flex items-start space-x-3">
                      <span className="w-6 h-6 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <div className="space-y-1 flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-relaxed">
                          {q.noiDung}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
                          {typeInfo.instruction}
                        </p>
                      </div>
                    </div>

                    {/* Options */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5 pl-0 sm:pl-9">
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

                          let btnClass = '';
                          let badgeClass = '';
                          let textClass = '';
                          let statusBadge = null;

                          if (revealMode) {
                            if (isAnswerKey) {
                              btnClass =
                                'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-400 dark:border-emerald-600 text-slate-900 dark:text-slate-100 font-bold ring-1 ring-emerald-300';
                              badgeClass =
                                'bg-emerald-600 text-white font-bold shadow-xs';
                              textClass =
                                'text-slate-900 dark:text-slate-100 font-bold';
                            } else if (isChosen && !isCorrect && submitted) {
                              btnClass =
                                'bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-600 text-rose-800 dark:text-rose-200 font-bold ring-1 ring-rose-300';
                              badgeClass =
                                'bg-rose-600 text-white font-bold shadow-xs';
                              textClass =
                                'text-slate-900 dark:text-slate-100 font-medium';
                            } else {
                              // Các phương án không chọn: rõ nét, dễ đọc, không bị mờ
                              btnClass =
                                'bg-slate-50/80 dark:bg-[#151f32] border-slate-200/90 dark:border-[#22334f]';
                              badgeClass =
                                'bg-slate-200/90 dark:bg-slate-700/80 text-slate-700 dark:text-slate-300 font-semibold';
                              textClass =
                                'text-slate-700 dark:text-slate-300 font-medium';
                            }
                          } else if (isChosen) {
                            btnClass =
                              'bg-teal-600 border-teal-600 shadow-sm ring-2 ring-teal-600/30';
                            badgeClass = 'bg-white/25 text-white shadow-xs font-bold';
                            textClass = 'text-white font-semibold';
                          } else {
                            btnClass =
                              'bg-slate-50 dark:bg-[#162238] border-slate-200 dark:border-[#223554] hover:border-teal-400 dark:hover:border-teal-500 hover:bg-teal-50/50 dark:hover:bg-teal-950/40';
                            badgeClass =
                              'bg-slate-200/90 dark:bg-[#253550] text-slate-800 dark:text-teal-300 border border-transparent dark:border-[#2d4265]';
                            textClass =
                              'text-slate-800 dark:text-slate-100 font-medium';
                          }

                          return (
                            <button
                              key={optKey}
                              type="button"
                              onClick={() => handleSelectOption(idx, optKey, typeInfo.isMulti)}
                              className={`p-3 min-h-[44px] rounded-xl border text-xs text-left transition flex items-center space-x-2.5 sm:space-x-3 cursor-pointer w-full ${btnClass}`}
                            >
                              <span
                                className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${badgeClass}`}
                              >
                                {optKey}
                              </span>
                              <span className={`flex-1 min-w-0 leading-snug break-words ${textClass}`}>
                                {optVal}
                              </span>
                              {!revealMode && typeInfo.isMulti && isChosen && (
                                <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0 ml-auto text-white">
                                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                                </span>
                              )}
                            </button>
                          );
                        })}
                    </div>

                    {/* Explanation */}
                    {revealMode && (
                      <div
                        className={`ml-0 sm:ml-9 p-3 sm:p-3.5 rounded-xl border text-xs ${
                          isCorrect
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/70 text-emerald-800 dark:text-emerald-200'
                            : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/70 text-rose-800 dark:text-rose-200'
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
                              : `Đáp án chuẩn là: [${formatCorrectAnswer(q)}]`}
                          </span>
                        </div>
                        <p className="text-[11px] leading-relaxed opacity-90 text-slate-800 dark:text-slate-200">
                          {q.giaiThich}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Bottom actions */}
            <div className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-[#1e2d45] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              {submitted ? (
                <>
                  <div className="flex items-center space-x-3">
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Kết quả trải nghiệm:</span>
                    <span className="text-xl font-black text-teal-700 dark:text-teal-400">
                      {calculateScore()} / {result.data.cauHoi.length} Câu Đúng
                    </span>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-300">
                      ({((calculateScore() / result.data.cauHoi.length) * 100).toFixed(0)}%)
                    </span>
                  </div>
                  <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:space-x-2 w-full sm:w-auto justify-between sm:justify-end">
                    <button
                      type="button"
                      onClick={() => setPrintExamData(result.data)}
                      className="flex-1 sm:flex-none justify-center px-3.5 py-2 min-h-[40px] bg-white dark:bg-[#162032] hover:bg-slate-50 dark:hover:bg-[#1e2d45] text-teal-800 dark:text-teal-300 text-xs font-bold rounded-xl flex items-center space-x-1.5 border border-teal-200 dark:border-teal-800 transition cursor-pointer shadow-xs"
                      title="In phiếu bài tập này ra giấy A4 hoặc lưu PDF"
                    >
                      <Printer className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                      <span>In Phiếu Bài Tập</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSubmitted(false);
                        setUserAnswers({});
                        saveToSession(result, {}, false, teacherViewKey);
                      }}
                      className="flex-1 sm:flex-none justify-center px-4 py-2 min-h-[40px] bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl flex items-center space-x-1.5 transition cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Làm Lại Đề Này</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleResetSession}
                      className="w-full sm:w-auto justify-center px-4 py-2 min-h-[40px] bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 dark:hover:bg-teal-900/60 text-teal-800 dark:text-teal-300 text-xs font-bold rounded-xl flex items-center space-x-1.5 border border-teal-200 dark:border-teal-800 transition cursor-pointer"
                    >
                      <PlusCircle className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                      <span>Tạo Đề Mới</span>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    Đã chọn thử:{' '}
                    <strong className="text-slate-900 dark:text-slate-100 font-bold">{countAnswered()}</strong> /{' '}
                    {result.data.cauHoi.length} câu
                  </span>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:space-x-2 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={handleResetSession}
                      className="px-4 py-2.5 sm:py-2 min-h-[42px] bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl flex items-center justify-center space-x-1.5 transition cursor-pointer border border-transparent dark:border-slate-700"
                    >
                      <PlusCircle className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                      <span>Hủy & Tạo Đề Khác</span>
                    </button>
                    <button
                      type="button"
                      disabled={countAnswered() < result.data.cauHoi.length}
                      onClick={() => {
                        setSubmitted(true);
                        saveToSession(result, userAnswers, true, teacherViewKey);
                      }}
                      className="px-6 py-2.5 min-h-[42px] bg-gradient-to-r from-teal-600 to-cyan-600 hover:opacity-95 text-white text-xs font-bold rounded-xl shadow-md shadow-teal-600/20 transition disabled:opacity-40 cursor-pointer flex items-center justify-center"
                    >
                      Nộp Bài Thử Nghiệm
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
