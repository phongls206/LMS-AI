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
            <div className="w-8 h-8 border-4 border-teal-500/20 border-t-teal-600 rounded-full animate-spin"></div>
          </div>
        ) : enrollments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {enrollments.map((enr) => {
              const lop = enr.lopHoc;
              return (
                <div key={enr.id} className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:border-teal-400 hover:shadow-md transition">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-mono text-xs font-bold text-teal-700 px-2.5 py-1 rounded bg-teal-50 border border-teal-200">
                      {lop?.maLopHoc}
                    </span>
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
                        enr.trangThai === 'DA_XAC_NHAN' || enr.trangThai === 'HOAN_THANH'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : enr.trangThai === 'CHO_THANH_TOAN' || enr.trangThai === 'CHO_XAC_NHAN'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      {formatTrangThaiDangKy(enr.trangThai)}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-1">{lop?.tenLopHoc}</h3>
                  <p className="text-xs text-slate-500 mb-4">{lop?.khoaHoc?.tenKhoaHoc}</p>

                  <div className="space-y-2 text-xs text-slate-700 border-t border-slate-100 pt-3">
                    <div className="flex justify-between items-center text-slate-500">
                      <span>Giáo viên phụ trách:</span>
                      <span className="font-bold text-slate-900">
                        {lop?.phanCong?.[0]?.giaoVien?.hoTen || 'Đang cập nhật'}
                      </span>
                    </div>

                    <div className="space-y-1.5 pt-1">
                      {lop?.lichHoc?.map((l: any) => (
                        <div key={l.id} className="flex justify-between items-center p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                          <span className="flex items-center text-teal-800 font-bold">
                            <Clock className="w-3.5 h-3.5 mr-1.5 text-teal-600" /> Thứ {l.thuTrongTuan}
                          </span>
                          <span className="flex items-center text-slate-700 font-mono font-medium">
                            <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" /> {l.phongHoc}
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
