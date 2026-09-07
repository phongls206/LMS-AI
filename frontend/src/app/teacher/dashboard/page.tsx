'use client';

import React, { useEffect, useState } from 'react';
import { AppLayout } from '../../../components/AppLayout';
import { classesService } from '../../../services/api';
import { Calendar, Users, ClipboardList, Award, BrainCircuit, Clock, MapPin, ArrowRight, BookOpen, Sparkles, ChevronRight } from 'lucide-react';
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
        {/* Quick Actions Bar với Micro-animations & Interactive Hover */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/teacher/attendance"
            className="p-5 rounded-2xl bg-white dark:bg-[#141c2e] border border-slate-200/90 dark:border-slate-800 shadow-xs hover:border-teal-400 dark:hover:border-teal-500/60 hover:shadow-xl hover:shadow-teal-500/10 hover:-translate-y-1.5 transition-all duration-200 group cursor-pointer relative overflow-hidden flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-11 h-11 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200/60 dark:border-teal-800 flex items-center justify-center text-teal-600 dark:text-teal-400 group-hover:scale-110 group-hover:bg-teal-600 group-hover:text-white group-hover:border-teal-600 shadow-xs transition-all duration-200">
                <ClipboardList className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-teal-600 dark:group-hover:text-teal-400 group-hover:translate-x-1.5 transition-all duration-200" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                Điểm Danh Buổi Học
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Ghi nhận 4 trạng thái chuyên cần cho lớp học
              </p>
            </div>
          </Link>

          <Link
            href="/teacher/grades"
            className="p-5 rounded-2xl bg-white dark:bg-[#141c2e] border border-slate-200/90 dark:border-slate-800 shadow-xs hover:border-cyan-400 dark:hover:border-cyan-500/60 hover:shadow-xl hover:shadow-cyan-500/10 hover:-translate-y-1.5 transition-all duration-200 group cursor-pointer relative overflow-hidden flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-11 h-11 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200/60 dark:border-cyan-800 flex items-center justify-center text-cyan-600 dark:text-cyan-400 group-hover:scale-110 group-hover:bg-cyan-600 group-hover:text-white group-hover:border-cyan-600 shadow-xs transition-all duration-200">
                <Award className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 group-hover:translate-x-1.5 transition-all duration-200" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                Nhập Điểm & Xếp Loại
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Tự động tính điểm tổng kết theo trọng số 20/30/50
              </p>
            </div>
          </Link>

          <Link
            href="/teacher/ai-exercises"
            className="p-5 rounded-2xl bg-white dark:bg-[#141c2e] border border-slate-200/90 dark:border-slate-800 shadow-xs hover:border-indigo-400 dark:hover:border-indigo-500/60 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1.5 transition-all duration-200 group cursor-pointer relative overflow-hidden flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-11 h-11 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 shadow-xs transition-all duration-200">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:translate-x-1.5 transition-all duration-200" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                Sinh Đề Trắc Nghiệm AI
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Tạo 5 - 15 câu hỏi chuẩn CEFR theo bài giảng kèm đáp án
              </p>
            </div>
          </Link>
        </div>

        {/* Schedule với Hover Card sinh động & Lối tắt tác vụ */}
        <div className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-[#141c2e] border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Lịch Giảng Dạy & Lớp Phụ Trách</h3>
            </div>
            <Link
              href="/teacher/classes"
              className="text-xs text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-bold flex items-center space-x-1 group px-2.5 py-1 rounded-lg hover:bg-teal-50 dark:hover:bg-teal-950/50 transition-all"
            >
              <span>Xem Tất Cả Lớp</span>
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
                  className="p-4 sm:p-5 rounded-xl bg-slate-50 dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800/90 hover:border-teal-400 dark:hover:border-teal-500/60 hover:bg-white dark:hover:bg-[#162032] hover:shadow-lg hover:shadow-teal-500/5 hover:-translate-y-1 transition-all duration-200 group relative overflow-hidden"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="px-2.5 py-1 rounded-md bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border border-teal-200/70 dark:border-teal-800 font-mono text-xs font-bold group-hover:bg-teal-600 group-hover:text-white group-hover:border-teal-600 transition-colors">
                      {item.lopHoc?.maLopHoc}
                    </span>
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full border transition-colors ${
                        item.lopHoc?.trangThai === 'DANG_HOC'
                          ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800'
                          : item.lopHoc?.trangThai === 'DANG_MO_DANG_KY' || item.lopHoc?.trangThai === 'SAP_MO'
                          ? 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800'
                          : 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {formatTrangThaiLopHoc(item.lopHoc?.trangThai) || 'Đang Học'}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                    {item.lopHoc?.tenLopHoc}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                    {item.lopHoc?.khoaHoc?.tenKhoaHoc}
                  </p>

                  <div className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300 border-t border-slate-200/80 dark:border-slate-800/80 pt-3">
                    {item.lopHoc?.lichHoc?.map((l: any) => (
                      <div key={l.id} className="flex items-center justify-between">
                        <span className="flex items-center text-slate-600 dark:text-slate-400 font-medium">
                          <Clock className="w-3.5 h-3.5 mr-1 text-teal-600 dark:text-teal-400" /> Thứ {l.thuTrongTuan}
                        </span>
                        <span className="flex items-center font-mono font-bold text-teal-800 dark:text-teal-300">
                          <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" /> {l.phongHoc}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Lối tắt tác vụ nhanh của giảng viên */}
                  <div className="mt-3.5 pt-2.5 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between sm:justify-end gap-2">
                    <Link
                      href="/teacher/attendance"
                      className="px-2.5 py-1 rounded-lg bg-teal-50 dark:bg-teal-950/50 hover:bg-teal-100 dark:hover:bg-teal-900 text-teal-700 dark:text-teal-300 border border-teal-200/60 dark:border-teal-800 text-[11px] font-bold transition-all hover:scale-105 inline-flex items-center gap-1 shadow-2xs"
                    >
                      <ClipboardList className="w-3 h-3" /> Điểm Danh
                    </Link>
                    <Link
                      href="/teacher/grades"
                      className="px-2.5 py-1 rounded-lg bg-cyan-50 dark:bg-cyan-950/50 hover:bg-cyan-100 dark:hover:bg-cyan-900 text-cyan-700 dark:text-cyan-300 border border-cyan-200/60 dark:border-cyan-800 text-[11px] font-bold transition-all hover:scale-105 inline-flex items-center gap-1 shadow-2xs"
                    >
                      <Award className="w-3 h-3" /> Bảng Điểm
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 dark:text-slate-400 text-center py-10">Chưa có lịch giảng dạy nào được phân công.</p>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
