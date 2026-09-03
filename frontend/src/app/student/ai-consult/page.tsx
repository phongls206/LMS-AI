'use client';

import React, { useState, useEffect } from 'react';
import { AppLayout } from '../../../components/AppLayout';
import { aiService, authService } from '../../../services/api';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Zap,
  Target,
  Compass,
  CheckCircle,
  Lightbulb,
  PlusCircle,
  Clock,
} from 'lucide-react';
import Link from 'next/link';

export default function StudentAiConsultPage() {
  const [cefr, setCefr] = useState('B1');
  const [selectedDays, setSelectedDays] = useState<number[]>([2, 4, 6]);
  const [mucTieu, setMucTieu] = useState(
    'Em muốn học cấp tốc trong 2-3 tháng để đạt chuẩn đầu ra đại học / chứng chỉ quốc tế, chú trọng tăng phản xạ Nói và củng cố Ngữ pháp.',
  );
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [mode, setMode] = useState<string>('');
  const [cooldown, setCooldown] = useState(0);

  // Bộ đếm ngược chống spam AI
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const quickGoals = [
    {
      label: '🎯 Luyện thi IELTS 6.5+ Cấp Tốc',
      text: 'Em cần luyện thi IELTS cấp tốc trong 3 tháng để nộp hồ sơ du học/tốt nghiệp, chú trọng Writing và Speaking.',
    },
    {
      label: '🗣️ Tăng Phản Xạ Giao Tiếp Tự Nhiên',
      text: 'Muốn rèn luyện phát âm chuẩn IPA, tăng tự tin giao tiếp với người nước ngoài và thuyết trình công việc.',
    },
    {
      label: '🚀 Lấy Lại Gốc Tiếng Anh Từ Đầu',
      text: 'Mất gốc tiếng Anh nhiều năm, cần một lộ trình bài bản từ cơ bản, giáo viên hướng dẫn chậm và nhiệt tình.',
    },
    {
      label: '💼 Tiếng Anh Đi Làm & Phỏng Vấn',
      text: 'Cần nâng cao kỹ năng viết Email thương mại, đàm phán hợp đồng và chuẩn bị phỏng vấn công ty đa quốc gia.',
    },
  ];

  useEffect(() => {
    // Khôi phục phiên tư vấn từ sessionStorage nếu đã có trước đó
    try {
      const saved = sessionStorage.getItem('etc_ai_consult_session');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.recommendations && parsed.recommendations.length > 0) {
          setRecommendations(parsed.recommendations);
          if (parsed.mode) setMode(parsed.mode);
          if (parsed.mucTieu) setMucTieu(parsed.mucTieu);
          if (parsed.selectedDays) setSelectedDays(parsed.selectedDays);
          if (parsed.cefr) setCefr(parsed.cefr);
        }
      }
    } catch (e) {
      console.error('Lỗi đọc phiên tư vấn:', e);
    }

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
    sessionStorage.removeItem('etc_ai_consult_session');

    try {
      const res = await aiService.consultClasses(
        cefr,
        {
          thu: selectedDays,
          gio: '18:00-21:00',
        },
        mucTieu,
      );
      const recs = res.data || [];
      const m = res.mode || '';
      setRecommendations(recs);
      setMode(m);
      try {
        sessionStorage.setItem(
          'etc_ai_consult_session',
          JSON.stringify({
            cefr,
            selectedDays,
            mucTieu,
            recommendations: recs,
            mode: m,
          }),
        );
      } catch (e) {}
    } catch (err: any) {
      alert(err.response?.data?.message || 'Có lỗi khi gọi AI tư vấn.');
    } finally {
      setLoading(false);
      setCooldown(5); // 5s cooldown chống spam
    }
  };

  return (
    <AppLayout
      allowedRoles={['HOC_VIEN', 'TU_VAN_VIEN', 'QUAN_LY']}
      title="Cố Vấn Lộ Trình & Tư Vấn Lớp Học Thông Minh (GenAI)"
      subtitle="Ứng dụng Trí tuệ Nhân tạo (AI) phân tích ngôn ngữ tự nhiên, so khớp đa chiều với CSDL lớp học thực tế"
    >
      <div className="space-y-6">
        {/* Form Container */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
          <form onSubmit={handleConsult} className="space-y-5 text-xs">
            {/* Free-text Goal Input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-indigo-300 font-bold uppercase tracking-wider text-xs flex items-center space-x-2">
                  <Target className="w-4 h-4 text-indigo-400" />
                  <span>Mục Tiêu & Nguyện Vọng Học Tập Của Bạn (Tự Nhiên)</span>
                </label>
                <span className="text-[11px] text-slate-400 font-medium">
                  AI hiểu văn bản tự do tiếng Việt
                </span>
              </div>
              <textarea
                rows={3}
                value={mucTieu}
                onChange={(e) => setMucTieu(e.target.value)}
                placeholder="Nhập bất kỳ mong muốn nào của bạn (VD: Muốn học tối 2-4-6, mục tiêu 6.5 IELTS trong 3 tháng, thích giáo viên phản xạ tốt...)"
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 leading-relaxed font-sans"
              />

              {/* Quick Goal Chips */}
              <div className="flex flex-wrap gap-2 pt-1">
                {quickGoals.map((g, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setMucTieu(g.text)}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-indigo-950 text-slate-300 hover:text-indigo-200 border border-slate-700 text-[11px] font-medium transition flex items-center space-x-1"
                  >
                    <span>{g.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Filter Row: CEFR + Days */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-slate-800/80">
              <div>
                <label className="block text-slate-300 font-semibold mb-2 uppercase tracking-wider">
                  Trình Độ CEFR Hiện Tại
                </label>
                <select
                  value={cefr}
                  onChange={(e) => setCefr(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white font-bold text-sm focus:outline-none focus:border-indigo-500"
                >
                  <option value="A1">A1 — Mất gốc / Người mới bắt đầu</option>
                  <option value="A2">A2 — Tiền Trung Cấp (Sơ cấp vững)</option>
                  <option value="B1">B1 — Trung Cấp (Giao tiếp cơ bản)</option>
                  <option value="B2">B2 — Trung Cao Cấp (Luyện thi chuyên sâu)</option>
                  <option value="C1">C1 — Cao Cấp (Thành thạo như bản xứ)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-2 uppercase tracking-wider">
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
              disabled={loading || cooldown > 0}
              className="w-full py-3.5 bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 hover:opacity-95 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition flex items-center justify-center space-x-2 text-sm disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Sparkles className="w-5 h-5 animate-spin" />
                  <span>Hệ Thống AI Đang Phân Tích Ngữ Cảnh & So Khớp Lớp Học...</span>
                </>
              ) : cooldown > 0 ? (
                <span className="flex items-center space-x-2 text-amber-300 font-semibold">
                  <Clock className="w-4 h-4 animate-spin text-amber-400" />
                  <span>Vui lòng chờ {cooldown}s trước khi yêu cầu AI tiếp tục...</span>
                </span>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>AI Phân Tích Toàn Diện & Đề Xuất Lộ Trình Lớp Học</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Security & Zero-Trust Notice */}
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              <strong>Bảo vệ Zero-Trust & Grounding DB:</strong> Hệ thống tự động lọc ảo giác, chỉ đề xuất các lớp học thực sự đang mở tuyển sinh và còn chỗ trống trong CSDL.
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-1.5 text-indigo-400 font-semibold text-[11px]">
            <Zap className="w-3.5 h-3.5" />
            <span>Tích hợp AI Tiên Tiến (Zero-Trust Verified)</span>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="py-20 flex flex-col items-center justify-center space-y-3">
            <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
            <p className="text-sm text-indigo-300 font-medium animate-pulse">
              Đang đối chiếu nguyện vọng với danh sách lớp học và xây dựng lộ trình...
            </p>
          </div>
        )}

        {/* Results */}
        {recommendations.length > 0 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-base flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Top Lớp Học Được AI Đề Xuất Dành Riêng Cho Bạn</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Được tính toán dựa trên mục tiêu: &ldquo;{mucTieu}&rdquo;
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span
                  className={`text-[11px] font-medium px-3 py-1 rounded-full border ${
                    mode === 'AI_GEMINI'
                      ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                      : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  }`}
                >
                  {mode === 'AI_GEMINI' ? '✨ Trí Tuệ Nhân Tạo (AI)' : '📋 Hệ Thống Quy Tắc (Rule-Based)'}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    sessionStorage.removeItem('etc_ai_consult_session');
                    setRecommendations([]);
                    setMode('');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-semibold flex items-center space-x-1 border border-slate-700/60 transition cursor-pointer"
                  title="Xóa kết quả hiện tại để tạo phiên tư vấn mới"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Tạo Phiên Mới</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recommendations.map((item, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-slate-900 border border-indigo-500/30 shadow-xl flex flex-col justify-between relative overflow-hidden group hover:border-indigo-500 transition-all duration-300"
                >
                  {/* Top glowing strip */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400"></div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-xs font-bold text-indigo-400 px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                        {item.maLopHoc}
                      </span>
                      <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>{item.doTuongThich || 95}% Phù hợp</span>
                      </span>
                    </div>

                    <div>
                      <h4 className="text-base font-bold text-white group-hover:text-indigo-300 transition leading-snug">
                        {item.tenLopHoc}
                      </h4>
                      {item.lichHocText && (
                        <p className="text-xs text-slate-400 mt-1 flex items-center space-x-1">
                          <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                          <span>Lịch học: {item.lichHocText}</span>
                        </p>
                      )}
                    </div>

                    {/* AI Reasoning Box */}
                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                      <div className="flex items-center space-x-1.5 text-amber-400 font-bold text-[11px] uppercase tracking-wider">
                        <Lightbulb className="w-3.5 h-3.5" />
                        <span>Phân Tích Của AI</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {item.lyDoPhuHop}
                      </p>
                    </div>

                    {/* Highlights & Roadmap */}
                    {item.diemNoiBat && (
                      <div className="text-xs text-slate-300 space-y-1">
                        <p className="text-indigo-400 font-semibold flex items-center space-x-1 text-[11px]">
                          <Zap className="w-3 h-3" />
                          <span>Điểm nổi bật:</span>
                        </p>
                        <p className="text-slate-300 pl-4">{item.diemNoiBat}</p>
                      </div>
                    )}

                    {item.loTrinhKhuyenNghi && (
                      <div className="text-xs text-slate-300 space-y-1">
                        <p className="text-emerald-400 font-semibold flex items-center space-x-1 text-[11px]">
                          <Compass className="w-3 h-3" />
                          <span>Lộ trình tiếp theo:</span>
                        </p>
                        <p className="text-slate-300 pl-4">{item.loTrinhKhuyenNghi}</p>
                      </div>
                    )}
                  </div>

                  <div className="pt-5 mt-4 border-t border-slate-800 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase font-semibold">Học phí</p>
                      <p className="text-sm font-bold text-amber-400">
                        {item.hocPhi ? Number(item.hocPhi).toLocaleString('vi-VN') + ' đ' : 'Theo quy chế'}
                      </p>
                    </div>
                    <Link
                      href="/student/enroll"
                      className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition flex items-center space-x-1.5 shadow-md shadow-indigo-600/30"
                    >
                      <span>Đăng Ký Ngay</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
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
