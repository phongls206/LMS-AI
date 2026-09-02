'use client';

import React, { useEffect, useState } from 'react';
import { AppLayout } from '../../../components/AppLayout';
import { classesService } from '../../../services/api';
import { Calendar, Users, ClipboardList, Award, Sparkles, Clock, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function TeacherDashboardPage() {
  const [schedule, setSchedule] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const list = await classesService.getTeacherSchedule();
        setSchedule(list);
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
      allowedRoles={['GIAO_VIEN']}
      title="Bàn Làm Việc Giảng Viên (Teacher Workspace)"
      subtitle="Quản lý lớp học phụ trách, lịch dạy tuần và công cụ trợ giảng AI"
    >
      <div className="space-y-6">
        {/* Quick Actions Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/teacher/attendance"
            className="p-5 rounded-2xl bg-gradient-to-br from-indigo-900/40 to-slate-900 border border-indigo-500/20 hover:border-indigo-500/40 transition group"
          >
            <ClipboardList className="w-6 h-6 text-indigo-400 mb-2 group-hover:scale-110 transition" />
            <h4 className="font-bold text-white text-sm">Điểm Danh Buổi Học</h4>
            <p className="text-xs text-slate-400 mt-1">Ghi nhận 4 trạng thái chuyên cần cho lớp</p>
          </Link>

          <Link
            href="/teacher/grades"
            className="p-5 rounded-2xl bg-gradient-to-br from-blue-900/40 to-slate-900 border border-blue-500/20 hover:border-blue-500/40 transition group"
          >
            <Award className="w-6 h-6 text-blue-400 mb-2 group-hover:scale-110 transition" />
            <h4 className="font-bold text-white text-sm">Nhập Điểm & Xếp Loại</h4>
            <p className="text-xs text-slate-400 mt-1">Tự động tính điểm tổng kết 20/30/50</p>
          </Link>

          <Link
            href="/teacher/ai-exercises"
            className="p-5 rounded-2xl bg-gradient-to-br from-purple-900/40 to-slate-900 border border-purple-500/20 hover:border-purple-500/40 transition group"
          >
            <Sparkles className="w-6 h-6 text-purple-400 mb-2 group-hover:scale-110 transition" />
            <h4 className="font-bold text-white text-sm">Sinh Đề Trắc Nghiệm AI</h4>
            <p className="text-xs text-slate-400 mt-1">Tạo 5 câu hỏi chuẩn CEFR kèm đáp án</p>
          </Link>
        </div>

        {/* Schedule */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center space-x-2 mb-4">
            <Calendar className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-white text-base">Lịch Giảng Dạy & Lớp Phụ Trách</h3>
          </div>

          {loading ? (
            <div className="py-12 flex justify-center">
              <div className="w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
            </div>
          ) : schedule.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {schedule.map((item) => (
                <div key={item.id} className="p-5 rounded-xl bg-slate-950/70 border border-slate-800/80">
                  <div className="flex justify-between items-start mb-2">
                    <span className="px-2.5 py-1 rounded bg-indigo-500/10 text-indigo-300 font-mono text-xs font-bold">
                      {item.lopHoc?.maLopHoc}
                    </span>
                    <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      {item.vaiTroPhanCong === 'CHINH' ? 'Giảng viên chính' : 'Trợ giảng'}
                    </span>
                  </div>

                  <h4 className="font-bold text-white text-sm mb-1">{item.lopHoc?.tenLopHoc}</h4>
                  <p className="text-xs text-slate-400 mb-3">{item.lopHoc?.khoaHoc?.tenKhoaHoc}</p>

                  <div className="space-y-1.5 text-xs text-slate-300 border-t border-slate-800/80 pt-3">
                    {item.lopHoc?.lichHoc?.map((l: any) => (
                      <div key={l.id} className="flex items-center justify-between">
                        <span className="flex items-center text-slate-400">
                          <Clock className="w-3.5 h-3.5 mr-1 text-slate-500" /> Thứ {l.thuTrongTuan}
                        </span>
                        <span className="flex items-center font-mono font-medium text-indigo-300">
                          <MapPin className="w-3.5 h-3.5 mr-1 text-slate-500" /> {l.phongHoc}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500 text-center py-8">Bạn chưa được phân công lớp học nào.</p>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
