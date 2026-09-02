'use client';

import React, { useState, useEffect } from 'react';
import { AppLayout } from '../../../components/AppLayout';
import { aiService, authService } from '../../../services/api';
import { Sparkles, CheckCircle2, ArrowRight, ShieldCheck, Clock } from 'lucide-react';
import Link from 'next/link';

export default function StudentAiConsultPage() {
  const [cefr, setCefr] = useState('B1');
  const [selectedDays, setSelectedDays] = useState<number[]>([2, 4, 6]);
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [mode, setMode] = useState<string>('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const me = await authService.getMe();
        if (me?.hoSoHocVien?.trinhDoCEFR) {
          setCefr(me.hoSoHocVien.trinhDoCEFR);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, []);

  const handleToggleDay = (day: number) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const handleConsult = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setRecommendations([]);

    try {
      const res = await aiService.consultClasses(cefr, {
        thu: selectedDays,
        gio: '18:00-21:00',
      });
      setRecommendations(res.data || []);
      setMode(res.mode);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Có lỗi khi gọi AI tư vấn.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout
      allowedRoles={['HOC_VIEN', 'TU_VAN_VIEN', 'QUAN_LY']}
      title="Tư Vấn Lộ Trình & Lớp Học Tự Động (GenAI)"
      subtitle="AI phân tích chuẩn CEFR và lịch rảnh để gợi ý tối đa 03 lớp học còn chỗ phù hợp nhất"
    >
      <div className="space-y-6">
        {/* Form */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm">
          <form onSubmit={handleConsult} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5 uppercase tracking-wider">
                  Trình Độ CEFR Cần Tư Vấn
                </label>
                <select
                  value={cefr}
                  onChange={(e) => setCefr(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white font-bold text-sm focus:outline-none focus:border-indigo-500"
                >
                  <option value="A1">A1 — Mất gốc / Bắt đầu</option>
                  <option value="A2">A2 — Tiền Trung Cấp</option>
                  <option value="B1">B1 — Trung Cấp</option>
                  <option value="B2">B2 — Trung Cao Cấp</option>
                  <option value="C1">C1 — Cao Cấp</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1.5 uppercase tracking-wider">
                  Các Buổi Bạn Rảnh Trong Tuần
                </label>
                <div className="flex flex-wrap gap-2">
                  {[2, 3, 4, 5, 6, 7, 8].map((day) => {
                    const isSelected = selectedDays.includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => handleToggleDay(day)}
                        className={`px-3 py-2 rounded-xl font-semibold transition ${
                          isSelected
                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                            : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {day === 8 ? 'Chủ Nhật' : `Thứ ${day}`}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-2 bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 hover:opacity-95 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{loading ? 'Gemini AI Đang Phân Tích Dữ Liệu...' : 'AI Phân Tích & Gợi Ý Lớp Học'}</span>
            </button>
          </form>
        </div>

        {/* Security & Zero-Trust Notice */}
        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            <strong>Bảo vệ Zero-Trust:</strong> Hệ thống tự động lọc các lớp học ảo giác, chỉ đề xuất lớp có thật và còn chỗ trống trong CSDL.
          </span>
        </div>

        {/* Results */}
        {loading && (
          <div className="py-20 flex flex-col items-center justify-center space-y-3">
            <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
            <p className="text-xs text-indigo-300 font-medium animate-pulse">
              Đang đối chiếu dữ liệu lớp học với mô hình Gemini AI...
            </p>
          </div>
        )}

        {recommendations.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-base">Top 3 Lớp Học Được AI Khuyên Dùng</h3>
              <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Chế độ: {mode}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recommendations.map((item, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-mono text-xs font-bold text-indigo-400 px-2 py-0.5 rounded bg-indigo-500/10">
                        {item.maLopHoc}
                      </span>
                      <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                        Gợi ý #{idx + 1}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-white mb-2">{item.tenLopHoc}</h4>
                    <p className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 mb-4 leading-relaxed">
                      💡 {item.lyDoPhuHop}
                    </p>
                  </div>

                  <Link
                    href="/student/enroll"
                    className="w-full py-2.5 text-center rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition flex items-center justify-center space-x-1"
                  >
                    <span>Đi Đến Đăng Ký Lớp</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
