'use client';

import React, { useEffect, useState } from 'react';
import { AppLayout } from '../../../components/AppLayout';
import { gradesService } from '../../../services/api';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { formatTrangThaiDangKy } from '../../../utils/formatters';

export default function StudentSchedulePage() {
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const list = await gradesService.getStudentSchedule();
        setEnrollments(list);
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
      title="Thời Khóa Biểu & Lịch Học Cá Nhân"
      subtitle="Theo dõi thời gian, phòng học và giáo viên phụ trách các lớp đang theo học"
    >
      <div className="space-y-6">
        {loading ? (
          <div className="py-20 flex justify-center items-center">
            <div className="w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
          </div>
        ) : enrollments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {enrollments.map((enr) => {
              const lop = enr.lopHoc;
              return (
                <div key={enr.id} className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-mono text-xs font-bold text-indigo-400 px-2.5 py-1 rounded bg-indigo-500/10">
                      {lop?.maLopHoc}
                    </span>
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${
                        enr.trangThai === 'DA_XAC_NHAN' || enr.trangThai === 'HOAN_THANH'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : enr.trangThai === 'CHO_THANH_TOAN' || enr.trangThai === 'CHO_XAC_NHAN'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      {formatTrangThaiDangKy(enr.trangThai)}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-1">{lop?.tenLopHoc}</h3>
                  <p className="text-xs text-slate-400 mb-4">{lop?.khoaHoc?.tenKhoaHoc}</p>

                  <div className="space-y-2 text-xs text-slate-300 border-t border-slate-800/80 pt-3">
                    <div className="flex justify-between items-center text-slate-400">
                      <span>Giáo viên phụ trách:</span>
                      <span className="font-semibold text-white">
                        {lop?.phanCong?.[0]?.giaoVien?.hoTen || 'Đang cập nhật'}
                      </span>
                    </div>

                    <div className="space-y-1 pt-1">
                      {lop?.lichHoc?.map((l: any) => (
                        <div key={l.id} className="flex justify-between items-center p-2 rounded-lg bg-slate-950/60">
                          <span className="flex items-center text-indigo-300 font-medium">
                            <Clock className="w-3.5 h-3.5 mr-1.5 text-indigo-400" /> Thứ {l.thuTrongTuan}
                          </span>
                          <span className="flex items-center text-slate-300 font-mono">
                            <MapPin className="w-3.5 h-3.5 mr-1 text-slate-500" /> {l.phongHoc}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-slate-500 text-center py-16">Bạn chưa có lịch học nào trong học kỳ này.</p>
        )}
      </div>
    </AppLayout>
  );
}
