'use client';

import React, { useEffect, useState } from 'react';
import { AppLayout } from '../../../components/AppLayout';
import { classesService } from '../../../services/api';
import { GraduationCap, Users, Calendar, Clock } from 'lucide-react';
import Link from 'next/link';

export default function TeacherClassesPage() {
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const list = await classesService.getTeacherSchedule();
        setClasses(list);
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
      title="Danh Sách Lớp Học Phụ Trách"
      subtitle="Theo dõi tiến độ, danh sách học viên và chuyển nhanh đến điểm danh hoặc nhập điểm"
    >
      <div className="space-y-6">
        {loading ? (
          <div className="py-20 flex justify-center items-center">
            <div className="w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
          </div>
        ) : classes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {classes.map((item) => {
              const lop = item.lopHoc;
              return (
                <div key={item.id} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-mono text-xs font-bold text-indigo-400 px-2.5 py-1 rounded bg-indigo-500/10">
                        {lop?.maLopHoc}
                      </span>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 font-semibold">
                        {lop?.trangThai}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white mb-1">{lop?.tenLopHoc}</h3>
                    <p className="text-xs text-slate-400 mb-4">{lop?.khoaHoc?.tenKhoaHoc}</p>

                    <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5 text-xs text-slate-300 mb-4">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Sĩ số lớp:</span>
                        <span className="font-bold text-white">{lop?.siSoHienTai || 0} / {lop?.siSoToiDa || 25} HV</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Thời gian học:</span>
                        <span>{lop?.lichHoc?.map((l: any) => `T${l.thuTrongTuan}`).join(', ')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-3 pt-3 border-t border-slate-800">
                    <Link
                      href={`/teacher/attendance?classId=${lop?.id}`}
                      className="flex-1 py-2 text-center rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition"
                    >
                      Điểm Danh
                    </Link>
                    <Link
                      href={`/teacher/grades?classId=${lop?.id}`}
                      className="flex-1 py-2 text-center rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
                    >
                      Bảng Điểm
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-slate-500 text-center py-16">Bạn chưa có lớp học nào được phân công.</p>
        )}
      </div>
    </AppLayout>
  );
}
