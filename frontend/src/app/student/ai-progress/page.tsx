'use client';

import React, { useEffect, useState } from 'react';
import { AppLayout } from '../../../components/AppLayout';
import { aiService, authService, gradesService } from '../../../services/api';
import { Sparkles, Award, TrendingUp, CheckCircle, Lightbulb } from 'lucide-react';

export default function StudentAiProgressPage() {
  const [user, setUser] = useState<any>(null);
  const [schedule, setSchedule] = useState<any[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [me, sch] = await Promise.all([
          authService.getMe(),
          gradesService.getStudentSchedule(),
        ]);
        setUser(me);
        setSchedule(sch);
        if (sch.length > 0) setSelectedClassId(sch[0].lopHocId || sch[0].lopHoc?.id || 1);
      } catch (err) {
        console.error(err);
      }
    };
    fetch();
  }, []);

  const handleGenerateSummary = async () => {
    if (!user?.hoSoHocVien?.id) return;
    setLoading(true);
    setSummary(null);

    try {
      const res = await aiService.summarizeProgress(user.hoSoHocVien.id, selectedClassId);
      setSummary(res);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Có lỗi khi gọi AI tóm tắt.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout
      allowedRoles={['HOC_VIEN', 'GIAO_VIEN', 'QUAN_LY']}
      title="Báo Cáo Tóm Tắt Tiến Độ Học Tập AI"
      subtitle="AI phân tích tỷ lệ chuyên cần, điểm kiểm tra và đưa ra nhận xét cá nhân hóa cùng lời khuyên ôn tập"
    >
      <div className="space-y-6">
        {/* Class selector */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-900 p-4 rounded-2xl border border-slate-800">
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <label className="text-xs font-semibold text-slate-400 whitespace-nowrap">Chọn Lớp Đang Học:</label>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(+e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-semibold"
            >
              {schedule.map((enr) => (
                <option key={enr.id} value={enr.lopHocId || enr.lopHoc?.id}>
                  [{enr.lopHoc?.maLopHoc}] {enr.lopHoc?.tenLopHoc}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleGenerateSummary}
            disabled={loading}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:opacity-90 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>{loading ? 'AI Đang Tổng Hợp...' : 'Tạo Báo Cáo Tóm Tắt AI'}</span>
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="py-20 flex flex-col items-center justify-center space-y-3">
            <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
            <p className="text-xs text-indigo-300 font-medium animate-pulse">
              Gemini AI đang rà soát lịch sử điểm danh và điểm thi của bạn...
            </p>
          </div>
        )}

        {/* Summary Card */}
        {summary && (
          <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-6 shadow-xl">
            <div className="flex justify-between items-center pb-4 border-b border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Học Viên: {summary.data?.hocVien}</h3>
                  <p className="text-xs text-slate-400">
                    Tỷ lệ chuyên cần ghi nhận: <strong className="text-emerald-400">{summary.data?.chuyenCan}</strong>
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Mode: {summary.mode}
              </span>
            </div>

            <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800/80">
              <div className="flex items-center space-x-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-3">
                <Lightbulb className="w-4 h-4" />
                <span>Nhận Xét Chi Tiết & Lời Khuyên Cải Thiện</span>
              </div>
              <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-line">
                {summary.data?.tomTatTienDo}
              </p>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
