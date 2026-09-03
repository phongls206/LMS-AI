'use client';

import React, { useEffect, useState } from 'react';
import { AppLayout } from '../../../components/AppLayout';
import { classesService } from '../../../services/api';
import { GraduationCap, Users, Calendar, Clock } from 'lucide-react';
import Link from 'next/link';
import { formatTrangThaiLopHoc } from '../../../utils/formatters';

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
            <div className="w-8 h-8 border-4 border-teal-500/20 border-t-teal-600 rounded-full animate-spin"></div>
          </div>
        ) : classes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {classes.map((item) => {
              const lop = item.lopHoc;
              return (
                <div key={item.id} className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between hover:border-teal-400 hover:shadow-md transition">
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-mono text-xs font-bold text-teal-700 px-2.5 py-1 rounded bg-teal-50 border border-teal-200">
                        {lop?.maLopHoc}
                      </span>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 font-bold border border-teal-200">
                        {formatTrangThaiLopHoc(lop?.trangThai)}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 mb-1">{lop?.tenLopHoc}</h3>
                    <p className="text-xs text-slate-500 mb-4">{lop?.khoaHoc?.tenKhoaHoc}</p>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs text-slate-700 mb-4">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Sĩ số lớp:</span>
                        <span className="font-bold text-slate-900">{lop?.siSoHienTai || 0} / {lop?.siSoToiDa || 25} HV</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Thời gian học:</span>
                        <span className="font-medium">{lop?.lichHoc?.map((l: any) => `T${l.thuTrongTuan}`).join(', ')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-3 pt-3 border-t border-slate-100">
                    <Link
                      href={`/teacher/attendance?classId=${lop?.id}`}
                      className="flex-1 py-2 text-center rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition shadow-sm"
                    >
                      Điểm Danh
                    </Link>
                    <Link
                      href={`/teacher/grades?classId=${lop?.id}`}
                      className="flex-1 py-2 text-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition border border-slate-200"
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
