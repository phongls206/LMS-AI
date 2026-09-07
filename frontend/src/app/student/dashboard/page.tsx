'use client';

import React, { useEffect, useState } from 'react';
import { AppLayout } from '../../../components/AppLayout';
import { gradesService, authService } from '../../../services/api';
import { Bot, BrainCircuit, TrendingUp, ArrowRight, Sparkles, BookOpen, Calendar, Clock, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { formatTrangThaiDangKy } from '../../../utils/formatters';

export default function StudentDashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [schedule, setSchedule] = useState<any[]>([]);
  const [grades, setGrades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [me, sch, grd] = await Promise.all([
          authService.getMe(),
          gradesService.getStudentSchedule(),
          gradesService.getStudentGrades(),
        ]);
        setUser(me);
        setSchedule(sch);
        setGrades(grd);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <AppLayout
      allowedRoles={['HOC_VIEN']}
      title="Góc Học Tập Cá Nhân"
      subtitle="Theo dõi tiến độ học, thời khóa biểu và trợ lý học tập thông minh"
    >
      <div className="space-y-4 sm:space-y-6">
        {/* Profile Banner - Trắng Xanh Teal Rực Rỡ với hiệu ứng hover sinh động */}
        <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-teal-700 via-teal-600 to-cyan-600 text-white shadow-lg shadow-teal-700/15 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 sm:gap-4 transition-all duration-300 hover:shadow-xl hover:shadow-teal-600/20 relative overflow-hidden group">
          {/* Subtle light sheen overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

          <div className="relative z-10 w-full sm:w-auto">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="p-1 rounded-lg bg-white/20 backdrop-blur-xs text-amber-200">
                <Sparkles className="w-4 h-4 animate-pulse" />
              </span>
              <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
                {user?.hoSoHocVien?.hoTen || 'Học Viên'}
              </h3>
              <span className="px-2.5 py-0.5 rounded-md bg-white/20 text-white font-mono text-xs font-bold border border-white/30 backdrop-blur-sm group-hover:bg-white/30 transition-colors">
                {user?.hoSoHocVien?.maHocVien || 'HV001'}
              </span>
            </div>
            <p className="text-xs text-teal-100 flex flex-wrap items-center gap-1.5 mt-0.5">
              <span>{user?.email}</span>
              <span className="hidden sm:inline">•</span>
              <span className="text-teal-200 font-medium">Chúc bạn một ngày học tập hứng khởi! 🌟</span>
            </p>
          </div>

          <div className="flex items-center space-x-3 bg-black/20 hover:bg-black/30 backdrop-blur-md p-2.5 sm:p-3 px-3.5 sm:px-4 rounded-xl border border-white/15 transition-all duration-200 hover:scale-105 hover:border-white/30 shadow-xs cursor-default relative z-10 w-full sm:w-auto justify-between sm:justify-start">
            <div>
              <p className="text-[10px] text-teal-100 uppercase font-bold tracking-wider">Trình Độ Hiện Tại</p>
              <p className="text-base sm:text-lg font-black text-amber-300 font-mono tracking-wide flex items-center gap-1">
                CEFR {user?.hoSoHocVien?.trinhDoCEFR || 'B1'}
              </p>
            </div>
          </div>
        </div>

        {/* AI Quick Tools với Micro-animations & Interactive Hover */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <Link
            href="/student/ai-consult"
            className="p-5 rounded-2xl bg-white dark:bg-[#141c2e] border border-slate-200/90 dark:border-slate-800 shadow-xs hover:border-teal-500 hover:shadow-xl hover:shadow-teal-500/10 hover:-translate-y-1.5 transition-all duration-200 group flex flex-col justify-between relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-11 h-11 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200/60 dark:border-teal-800 flex items-center justify-center group-hover:scale-110 group-hover:bg-teal-600 group-hover:border-teal-600 shadow-xs transition-all duration-200">
                <Bot className="w-5 h-5 text-teal-600 dark:text-teal-400 group-hover:text-white transition-colors duration-200" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-teal-600 dark:group-hover:text-teal-400 group-hover:translate-x-1 transition-all duration-200" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                AI Tư Vấn Lớp Học
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Gợi ý lộ trình chuẩn CEFR theo lịch rảnh và mục tiêu cá nhân
              </p>
            </div>
          </Link>

          <Link
            href="/student/ai-practice"
            className="p-5 rounded-2xl bg-white dark:bg-[#141c2e] border border-slate-200/90 dark:border-slate-800 shadow-xs hover:border-cyan-500 hover:shadow-xl hover:shadow-cyan-500/10 hover:-translate-y-1.5 transition-all duration-200 group flex flex-col justify-between relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-11 h-11 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200/60 dark:border-cyan-800 flex items-center justify-center group-hover:scale-110 group-hover:bg-cyan-600 group-hover:border-cyan-600 shadow-xs transition-all duration-200">
                <BrainCircuit className="w-5 h-5 text-cyan-600 dark:text-cyan-400 group-hover:text-white transition-colors duration-200" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 group-hover:translate-x-1 transition-all duration-200" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                AI Luyện Trắc Nghiệm
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Luyện 5 - 15 câu trắc nghiệm thông minh kèm giải thích chi tiết
              </p>
            </div>
          </Link>

          <Link
            href="/student/ai-progress"
            className="p-5 rounded-2xl bg-white dark:bg-[#141c2e] border border-slate-200/90 dark:border-slate-800 shadow-xs hover:border-indigo-500 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1.5 transition-all duration-200 group flex flex-col justify-between relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-11 h-11 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800 flex items-center justify-center group-hover:scale-110 group-hover:bg-indigo-600 group-hover:border-indigo-600 shadow-xs transition-all duration-200">
                <TrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400 group-hover:text-white transition-colors duration-200" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:translate-x-1 transition-all duration-200" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                AI Tóm Tắt Tiến Độ
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Phân tích điểm mạnh, điểm cần cải thiện & lời khuyên ôn tập
              </p>
            </div>
          </Link>
        </div>

        {/* Enrolled Classes với hover card sinh động */}
        <div className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-[#141c2e] border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Lớp Học Đang Tham Gia</h3>
            </div>
            <Link
              href="/student/enroll"
              className="text-xs text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-bold flex items-center space-x-1 group px-2.5 py-1 rounded-lg hover:bg-teal-50 dark:hover:bg-teal-950/50 transition-all"
            >
              <span>Đăng Ký Thêm Lớp</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <div className="py-12 flex justify-center">
              <div className="w-8 h-8 border-4 border-teal-500/20 border-t-teal-600 rounded-full animate-spin"></div>
            </div>
          ) : schedule.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {schedule.map((item) => (
                <div
                  key={item.id}
                  className="p-4.5 rounded-xl bg-slate-50 dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800/90 hover:border-teal-400 dark:hover:border-teal-500/60 hover:bg-white dark:hover:bg-[#162032] hover:shadow-lg hover:shadow-teal-500/5 hover:-translate-y-1 transition-all duration-200 group cursor-pointer relative overflow-hidden"
                >
                  <div className="flex justify-between items-start mb-2.5">
                    <span className="font-mono text-xs font-bold text-teal-700 dark:text-teal-300 px-2.5 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950/60 border border-teal-200/70 dark:border-teal-800 group-hover:bg-teal-600 group-hover:text-white group-hover:border-teal-600 transition-colors">
                      {item.lopHoc?.maLopHoc}
                    </span>
                    <span
                      className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold border transition-colors ${
                        item.trangThai === 'DA_XAC_NHAN' || item.trangThai === 'HOAN_THANH'
                          ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                          : item.trangThai === 'CHO_THANH_TOAN' || item.trangThai === 'CHO_XAC_NHAN'
                          ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {formatTrangThaiDangKy(item.trangThai)}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                    {item.lopHoc?.tenLopHoc}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {item.lopHoc?.khoaHoc?.tenKhoaHoc}
                  </p>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                      <span>Theo dõi lịch học & bảng điểm</span>
                    </span>
                    <span className="text-teal-600 dark:text-teal-400 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center">
                      <span>Chi tiết</span>
                      <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 dark:text-slate-400 text-center py-6">
              Bạn chưa đăng ký lớp học nào. Hãy khám phá danh sách khóa học để đăng ký nhé!
            </p>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
