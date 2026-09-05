'use client';

import React, { useState, useEffect } from 'react';
import {
  History,
  Clock,
  Printer,
  RotateCcw,
  BookOpen,
  ChevronDown,
  ChevronUp,
  X,
  Sparkles,
  Search,
  CheckCircle2,
  Trash2,
} from 'lucide-react';
import { aiService } from '../../services/api';

interface ExerciseHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectExercise: (item: any) => void;
  onPrintExercise: (item: any) => void;
}

export const ExerciseHistoryModal: React.FC<ExerciseHistoryModalProps> = ({
  isOpen,
  onClose,
  onSelectExercise,
  onPrintExercise,
}) => {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [clearingAll, setClearingAll] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    fetchHistory();
  }, [isOpen]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const data = await aiService.getExerciseHistory(30);
      setHistory(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Lỗi khi tải lịch sử bài tập:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async (id: number, chuDe: string) => {
    if (
      !window.confirm(
        `Bạn có chắc chắn muốn xóa đề "${chuDe || 'Bài luyện tập'}" khỏi lịch sử? Thao tác này sẽ giúp làm nhẹ hệ thống và không thể hoàn tác.`,
      )
    ) {
      return;
    }
    setDeletingId(id);
    try {
      await aiService.deleteExerciseHistoryItem(id);
      setHistory((prev) => prev.filter((item) => item.id !== id));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Có lỗi xảy ra khi xóa đề bài tập.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleClearAll = async () => {
    if (history.length === 0) return;
    if (
      !window.confirm(
        `Bạn có chắc chắn muốn xóa TOÀN BỘ ${history.length} đề bài tập trong lịch sử? Toàn bộ các đề đã tạo sẽ bị xóa vĩnh viễn để làm sạch lịch sử.`,
      )
    ) {
      return;
    }
    setClearingAll(true);
    try {
      await aiService.clearExerciseHistory();
      setHistory([]);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Có lỗi xảy ra khi xóa toàn bộ lịch sử.');
    } finally {
      setClearingAll(false);
    }
  };

  if (!isOpen) return null;

  const filteredHistory = history.filter((item) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    const topic = (item.chuDe || '').toLowerCase();
    const cefr = (item.trinhDo || '').toLowerCase();
    return topic.includes(term) || cefr.includes(term);
  });

  const formatDate = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      return d.toLocaleString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch {
      return isoStr;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto no-print">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 flex items-center justify-center text-teal-600 dark:text-teal-400">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <span>Lịch Sử Đề Bài Tập Đã Tạo (AI)</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 dark:bg-teal-900/60 dark:text-teal-300">
                  {filteredHistory.length} đề
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Xem lại danh sách đề đã sinh, chọn làm lại để ôn tập hoặc in phiếu bài tập A4
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search bar & Actions */}
        <div className="px-6 py-3 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm theo chủ đề, trình độ CEFR (VD: B1, Phrasal verbs, Passive Voice)..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-teal-500"
            />
          </div>
          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={fetchHistory}
              disabled={loading}
              className="px-3 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center space-x-1.5 transition cursor-pointer disabled:opacity-50"
            >
              <Clock className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Làm mới</span>
            </button>

            {/* Nút Xóa Nhanh Toàn Bộ Lịch Sử (chỉ kích hoạt nếu đã từng tạo đề) */}
            <button
              type="button"
              onClick={handleClearAll}
              disabled={loading || clearingAll || history.length === 0}
              className="px-3 py-2 text-xs font-semibold rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 flex items-center space-x-1.5 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              title={
                history.length === 0
                  ? 'Chưa có đề bài tập nào để xóa'
                  : 'Xóa sạch toàn bộ lịch sử các đề bài tập đã tạo'
              }
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{clearingAll ? 'Đang xóa...' : 'Xóa toàn bộ'}</span>
            </button>
          </div>
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {loading ? (
            <div className="py-16 flex flex-col items-center justify-center space-y-3">
              <div className="w-8 h-8 border-3 border-teal-500/20 border-t-teal-600 rounded-full animate-spin"></div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Đang tải lịch sử các đề bài tập...
              </p>
            </div>
          ) : filteredHistory.length === 0 ? (
            <div className="py-14 text-center space-y-2">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                <BookOpen className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                {searchTerm ? 'Không tìm thấy đề bài phù hợp' : 'Chưa có đề bài tập nào trong lịch sử'}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                {searchTerm
                  ? 'Vui lòng thử từ khóa khác hoặc xóa bộ lọc tìm kiếm.'
                  : 'Hãy tạo bài tập mới từ màn hình chính để hệ thống lưu lại vào lịch sử ôn luyện.'}
              </p>
            </div>
          ) : (
            filteredHistory.map((item) => {
              const isExpanded = expandedId === item.id;
              const isDeleting = deletingId === item.id;
              const cauHoiList = item.data?.cauHoi || [];

              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-teal-300 dark:hover:border-teal-800/80 bg-white dark:bg-slate-800/40 transition shadow-2xs space-y-3 ${
                    isDeleting ? 'opacity-50 pointer-events-none' : ''
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold text-teal-800 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 px-2.5 py-0.5 rounded-md">
                          CEFR {item.trinhDo}
                        </span>
                        <span className="text-xs font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 px-2 py-0.5 rounded-md">
                          {item.soCau} câu hỏi
                        </span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${
                            item.mode === 'AI_GEMINI' || item.mode === 'GEMINI_AI'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800'
                              : item.mode === 'AI_COMMUNITY_CACHE'
                              ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800'
                              : 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
                          }`}
                        >
                          {item.mode === 'AI_GEMINI' || item.mode === 'GEMINI_AI'
                            ? '✨ Trí Tuệ Nhân Tạo'
                            : item.mode === 'AI_COMMUNITY_CACHE'
                            ? '⚡ Đề Tương Thích (Kho AI)'
                            : '📦 Bộ Dự Phòng'}
                        </span>
                        <span className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{formatDate(item.thoiGianGoi)}</span>
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white pt-1">
                        {item.chuDe}
                      </h3>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          onSelectExercise(item);
                          onClose();
                        }}
                        className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center space-x-1.5 shadow-xs transition cursor-pointer"
                        title="Tải lại toàn bộ câu hỏi của đề này lên màn hình để làm bài ôn tập"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Làm lại đề này</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onPrintExercise(item)}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-bold flex items-center space-x-1.5 transition cursor-pointer"
                        title="In phiếu bài tập ra giấy A4 hoặc lưu file PDF"
                      >
                        <Printer className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                        <span>In phiếu bài tập</span>
                      </button>

                      {/* Nút Xóa Riêng Từng Đề */}
                      <button
                        type="button"
                        onClick={() => handleDeleteItem(item.id, item.chuDe)}
                        disabled={isDeleting}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition cursor-pointer"
                        title="Xóa đề này khỏi lịch sử"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setExpandedId(isExpanded ? null : item.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                        title={isExpanded ? 'Thu gọn' : 'Xem trước câu hỏi'}
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Question Preview */}
                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2.5 bg-slate-50/50 dark:bg-slate-900/40 p-3 rounded-lg text-xs">
                      <p className="font-bold text-slate-700 dark:text-slate-300">
                        Danh sách câu hỏi trong đề ({cauHoiList.length} câu):
                      </p>
                      <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                        {cauHoiList.map((q: any, qIdx: number) => (
                          <div
                            key={qIdx}
                            className="p-2.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60"
                          >
                            <p className="font-semibold text-slate-900 dark:text-slate-100">
                              <span className="text-teal-600 dark:text-teal-400 font-bold mr-1">
                                Câu {qIdx + 1}:
                              </span>
                              {q.noiDung}
                            </p>
                            <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium mt-1">
                              Đáp án: [{Array.isArray(q.dapAnDung) ? q.dapAnDung.join(', ') : q.dapAnDung}]
                              {q.giaiThich ? ` — ${q.giaiThich}` : ''}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>* Các đề bài đã tạo được lưu trữ an toàn trong hệ thống ETC English Center.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold transition cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
