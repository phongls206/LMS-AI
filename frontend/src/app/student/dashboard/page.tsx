'use client';

import React, { useEffect, useState } from 'react';
import { AppLayout } from '../../../components/AppLayout';
import { gradesService, authService } from '../../../services/api';
import { BookOpen, Calendar, Award, Sparkles, Receipt, ArrowRight } from 'lucide-react';
import Link from 'next/link';

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
      title="Góc Học Tập Cá Nhân (Student Workspace)"
      subtitle="Theo dõi tiến độ học, thời khóa biểu và trợ lý học tập thông minh"
    >
      <div className="space-y-6">
        {/* Profile Card */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-900/60 via-slate-900 to-slate-900 border border-indigo-500/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="text-xl font-bold text-white">{user?.hoSoHocVien?.hoTen || 'Học Viên'}</h3>
              <span className="px-2.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 font-mono text-xs font-bold border border-indigo-500/30">
                {user?.hoSoHocVien?.maHocVien || 'HV001'}
              </span>
            </div>
            <p className="text-xs text-slate-400">{user?.email}</p>
          </div>

          <div className="flex items-center space-x-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <div>
              <p className="text-[11px] text-slate-400 uppercase font-semibold">Trình Độ Hiện Tại</p>
              <p className="text-lg font-black text-emerald-400 font-mono">
                CEFR {user?.hoSoHocVien?.trinhDoCEFR || 'B1'}
              </p>
            </div>
          </div>
        </div>

        {/* AI Quick Tools */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/student/ai-consult"
            className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/60 to-slate-900 border border-indigo-500/30 hover:border-indigo-500/50 transition group"
          >
            <Sparkles className="w-6 h-6 text-indigo-400 mb-2 group-hover:scale-110 transition" />
            <h4 className="font-bold text-white text-sm">AI Tư Vấn Lớp Học</h4>
            <p className="text-xs text-slate-400 mt-1">Gợi ý lớp chuẩn CEFR theo lịch rảnh</p>
          </Link>

          <Link
            href="/student/ai-practice"
            className="p-5 rounded-2xl bg-gradient-to-br from-purple-950/60 to-slate-900 border border-purple-500/30 hover:border-purple-500/50 transition group"
          >
            <BookOpen className="w-6 h-6 text-purple-400 mb-2 group-hover:scale-110 transition" />
            <h4 className="font-bold text-white text-sm">AI Luyện Trắc Nghiệm</h4>
            <p className="text-xs text-slate-400 mt-1">Luyện 5 câu hỏi kèm giải thích</p>
          </Link>

          <Link
            href="/student/ai-progress"
            className="p-5 rounded-2xl bg-gradient-to-br from-cyan-950/60 to-slate-900 border border-cyan-500/30 hover:border-cyan-500/50 transition group"
          >
            <Award className="w-6 h-6 text-cyan-400 mb-2 group-hover:scale-110 transition" />
            <h4 className="font-bold text-white text-sm">AI Tóm Tắt Tiến Độ</h4>
            <p className="text-xs text-slate-400 mt-1">Phân tích điểm mạnh và lời khuyên ôn tập</p>
          </Link>
        </div>

        {/* Enrolled Classes */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-white text-base">Lớp Học Đang Tham Gia</h3>
            <Link href="/student/enroll" className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center space-x-1">
              <span>Đăng Ký Thêm Lớp</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="py-12 flex justify-center">
              <div className="w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
            </div>
          ) : schedule.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {schedule.map((item) => (
                <div key={item.id} className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-mono text-xs font-bold text-indigo-300 px-2 py-0.5 rounded bg-indigo-500/10">
                      {item.lopHoc?.maLopHoc}
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold">
                      {item.trangThai}
                    </span>
                  </div>
                  <h4 className="font-bold text-white text-sm">{item.lopHoc?.tenLopHoc}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">{item.lopHoc?.khoaHoc?.tenKhoaHoc}</p>
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
