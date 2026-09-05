'use client';

import React, { useEffect, useState } from 'react';
import { AppLayout } from '../../../components/AppLayout';
import { gradesService, authService } from '../../../services/api';
import { BookOpen, Award, Sparkles, ArrowRight } from 'lucide-react';
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
      <div className="space-y-6">
        {/* Profile Banner - Trắng Xanh Teal Rực Rỡ */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-teal-700 via-teal-600 to-cyan-600 text-white shadow-lg shadow-teal-700/15 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="text-xl font-bold text-white">{user?.hoSoHocVien?.hoTen || 'Học Viên'}</h3>
              <span className="px-2.5 py-0.5 rounded-md bg-white/20 text-white font-mono text-xs font-bold border border-white/30 backdrop-blur-sm">
                {user?.hoSoHocVien?.maHocVien || 'HV001'}
              </span>
            </div>
            <p className="text-xs text-teal-100">{user?.email}</p>
          </div>

          <div className="flex items-center space-x-3 bg-black/15 backdrop-blur-md p-3 rounded-xl border border-white/10">
            <div>
              <p className="text-[11px] text-teal-100 uppercase font-semibold">Trình Độ Hiện Tại</p>
              <p className="text-lg font-black text-amber-300 font-mono">
                CEFR {user?.hoSoHocVien?.trinhDoCEFR || 'B1'}
              </p>
            </div>
          </div>
        </div>

        {/* AI Quick Tools */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/student/ai-consult"
            className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:border-teal-500 hover:shadow-md transition group"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center mb-3 group-hover:bg-teal-600 transition">
              <Sparkles className="w-5 h-5 text-teal-600 group-hover:text-white transition" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm group-hover:text-teal-700 transition">AI Tư Vấn Lớp Học</h4>
            <p className="text-xs text-slate-500 mt-1">Gợi ý lớp chuẩn CEFR theo lịch rảnh</p>
          </Link>

          <Link
            href="/student/ai-practice"
            className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:border-cyan-500 hover:shadow-md transition group"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center mb-3 group-hover:bg-cyan-600 transition">
              <BookOpen className="w-5 h-5 text-cyan-600 group-hover:text-white transition" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm group-hover:text-cyan-700 transition">AI Luyện Trắc Nghiệm</h4>
            <p className="text-xs text-slate-500 mt-1">Luyện 5 - 15 câu trắc nghiệm kèm giải thích</p>
          </Link>

          <Link
            href="/student/ai-progress"
            className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:border-blue-500 hover:shadow-md transition group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-3 group-hover:bg-blue-600 transition">
              <Award className="w-5 h-5 text-blue-600 group-hover:text-white transition" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm group-hover:text-blue-700 transition">AI Tóm Tắt Tiến Độ</h4>
            <p className="text-xs text-slate-500 mt-1">Phân tích điểm mạnh và lời khuyên ôn tập</p>
          </Link>
        </div>

        {/* Enrolled Classes */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 text-base">Lớp Học Đang Tham Gia</h3>
            <Link href="/student/enroll" className="text-xs text-teal-600 hover:text-teal-700 font-semibold flex items-center space-x-1">
              <span>Đăng Ký Thêm Lớp</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="py-12 flex justify-center">
              <div className="w-8 h-8 border-4 border-teal-500/20 border-t-teal-600 rounded-full animate-spin"></div>
            </div>
          ) : schedule.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {schedule.map((item) => (
                <div key={item.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-mono text-xs font-bold text-teal-700 px-2 py-0.5 rounded bg-teal-50 border border-teal-200/60">
                      {item.lopHoc?.maLopHoc}
                    </span>
                    <span
                      className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold border ${item.trangThai === 'DA_XAC_NHAN' || item.trangThai === 'HOAN_THANH'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : item.trangThai === 'CHO_THANH_TOAN' || item.trangThai === 'CHO_XAC_NHAN'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                    >
                      {formatTrangThaiDangKy(item.trangThai)}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">{item.lopHoc?.tenLopHoc}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{item.lopHoc?.khoaHoc?.tenKhoaHoc}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 text-center py-6">Bạn chưa đăng ký lớp học nào.</p>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
