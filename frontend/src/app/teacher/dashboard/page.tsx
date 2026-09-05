'use client';

import React, { useEffect, useState } from 'react';
import { AppLayout } from '../../../components/AppLayout';
import { classesService } from '../../../services/api';
import { Calendar, Users, ClipboardList, Award, Sparkles, Clock, MapPin } from 'lucide-react';
import Link from 'next/link';
import { formatTrangThaiLopHoc } from '../../../utils/formatters';

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
            className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:border-teal-400 hover:shadow-md transition group"
          >
            <ClipboardList className="w-6 h-6 text-teal-600 mb-2 group-hover:scale-110 transition" />
            <h4 className="font-bold text-slate-900 text-sm">Điểm Danh Buổi Học</h4>
            <p className="text-xs text-slate-500 mt-1">Ghi nhận 4 trạng thái chuyên cần cho lớp</p>
          </Link>

          <Link
            href="/teacher/grades"
            className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:border-cyan-400 hover:shadow-md transition group"
          >
            <Award className="w-6 h-6 text-cyan-600 mb-2 group-hover:scale-110 transition" />
            <h4 className="font-bold text-slate-900 text-sm">Nhập Điểm & Xếp Loại</h4>
            <p className="text-xs text-slate-500 mt-1">Tự động tính điểm tổng kết 20/30/50</p>
          </Link>

          <Link
            href="/teacher/ai-exercises"
            className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:border-teal-400 hover:shadow-md transition group"
          >
            <Sparkles className="w-6 h-6 text-teal-600 mb-2 group-hover:scale-110 transition" />
            <h4 className="font-bold text-slate-900 text-sm">Sinh Đề Trắc Nghiệm AI</h4>
            <p className="text-xs text-slate-500 mt-1">Tạo 5 - 15 câu hỏi chuẩn CEFR kèm đáp án</p>
          </Link>
        </div>

        {/* Schedule */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
          <div className="flex items-center space-x-2 mb-4">
            <Calendar className="w-5 h-5 text-teal-600" />
            <h3 className="font-bold text-slate-900 text-base">Lịch Giảng Dạy & Lớp Phụ Trách</h3>
          </div>

          {loading ? (
            <div className="py-12 flex justify-center">
              <div className="w-8 h-8 border-4 border-teal-500/20 border-t-teal-600 rounded-full animate-spin"></div>
            </div>
          ) : schedule.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {schedule.map((item) => (
                <div key={item.id} className="p-5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex justify-between items-start mb-2">
                    <span className="px-2.5 py-1 rounded bg-teal-50 text-teal-800 border border-teal-200 font-mono text-xs font-bold">
                      {item.lopHoc?.maLopHoc}
                    </span>
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                        item.lopHoc?.trangThai === 'DANG_HOC'
                          ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                          : item.lopHoc?.trangThai === 'DANG_MO_DANG_KY' || item.lopHoc?.trangThai === 'SAP_MO'
                          ? 'text-amber-700 bg-amber-50 border-amber-200'
                          : 'text-slate-600 bg-slate-100 border-slate-200'
                      }`}
                    >
                      {formatTrangThaiLopHoc(item.lopHoc?.trangThai) || 'Đang Học'}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm mb-1">{item.lopHoc?.tenLopHoc}</h4>
                  <p className="text-xs text-slate-500 mb-3">{item.lopHoc?.khoaHoc?.tenKhoaHoc}</p>

                  <div className="space-y-1.5 text-xs text-slate-700 border-t border-slate-200/80 pt-3">
                    {item.lopHoc?.lichHoc?.map((l: any) => (
                      <div key={l.id} className="flex items-center justify-between">
                        <span className="flex items-center text-slate-600 font-medium">
                          <Clock className="w-3.5 h-3.5 mr-1 text-teal-600" /> Thứ {l.thuTrongTuan}
                        </span>
                        <span className="flex items-center font-mono font-bold text-teal-800">
                          <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" /> {l.phongHoc}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 text-center py-10">Chưa có lịch giảng dạy nào được phân công.</p>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
