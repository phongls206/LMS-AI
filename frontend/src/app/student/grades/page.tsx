'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { AppLayout } from '../../../components/AppLayout';
import { gradesService } from '../../../services/api';
import { Award, CheckCircle, Sparkles, Calendar, ChevronRight } from 'lucide-react';

export default function StudentGradesPage() {
  const [grades, setGrades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const list = await gradesService.getStudentGrades();
        setGrades(list);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  // Tự động cuộn đến lớp học khi có anchor #class-{id}
  useEffect(() => {
    if (!loading && grades.length > 0) {
      const hash = typeof window !== 'undefined' ? window.location.hash : '';
      if (hash && hash.startsWith('#class-')) {
        const classId = parseInt(hash.replace('#class-', ''), 10);
        if (!isNaN(classId)) {
          setTimeout(() => {
            const el = document.getElementById(`class-${classId}`);
            if (el) {
              el.scrollIntoView({ behavior: 'smooth', block: 'center' });
              el.classList.add('ring-2', 'ring-teal-500', 'shadow-lg');
              setTimeout(() => {
                el.classList.remove('ring-2', 'ring-teal-500', 'shadow-lg');
              }, 2500);
            }
          }, 200);
        }
      }
    }
  }, [loading, grades]);

  return (
    <AppLayout
      allowedRoles={['HOC_VIEN']}
      title="Kết Quả Học Tập & Bảng Điểm Cá Nhân"
      subtitle="Chi tiết điểm Chuyên Cần (20%), Giữa Kỳ (30%), Cuối Kỳ (50%) và Xếp loại hoàn thành khóa"
    >
      <div className="space-y-6">
        <div className="p-3.5 rounded-xl bg-teal-50 border border-teal-200 text-xs text-teal-800 flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-teal-600 shrink-0" />
          <span>
            <strong>Quy chuẩn hoàn thành khóa:</strong> Điểm Tổng Kết ≥ 50.00 điểm <strong>VÀ</strong> Chuyên Cần ≥ 80.00 điểm.
          </span>
        </div>

        {loading ? (
          <div className="py-20 flex justify-center items-center">
            <div className="w-8 h-8 border-4 border-teal-500/20 border-t-teal-600 rounded-full animate-spin"></div>
          </div>
        ) : grades.length > 0 ? (
          <div className="space-y-4">
            {grades.map((g) => (
              <div
                key={g.id}
                id={`class-${g.lopHoc?.id || g.lopHocId}`}
                className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm transition-all duration-300 scroll-mt-6 hover:border-teal-300"
              >
                <div className="flex flex-wrap justify-between items-start gap-3 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-mono text-xs font-bold text-teal-700 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded">
                        {g.lopHoc?.maLopHoc}
                      </span>
                      <span className="text-base font-bold text-slate-900">{g.lopHoc?.tenLopHoc}</span>
                    </div>
                    <p className="text-xs text-slate-500">{g.lopHoc?.khoaHoc?.tenKhoaHoc}</p>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <Link
                      href={`/student/schedule#class-${g.lopHoc?.id || g.lopHocId}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 hover:bg-teal-600 text-slate-700 hover:text-white border border-slate-200 hover:border-teal-600 transition-all shadow-2xs group cursor-pointer"
                      title="Xem thời khóa biểu và lịch học của lớp này"
                    >
                      <Calendar className="w-3.5 h-3.5 text-teal-600 group-hover:text-white transition-colors" />
                      <span>Xem Thời Khóa Biểu</span>
                      <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </Link>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold border ${
                        g.trangThaiHoanThanh === 'DAT'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : g.trangThaiHoanThanh === 'KHONG_DAT'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      {g.trangThaiHoanThanh === 'DAT'
                        ? '🏆 ĐẠT YÊU CẦU'
                        : g.trangThaiHoanThanh === 'KHONG_DAT'
                        ? '❌ CHƯA ĐẠT'
                        : '⏳ Đang Học'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center my-4">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <p className="text-[11px] text-slate-500 font-bold uppercase">Chuyên Cần (20%)</p>
                    <p className="text-lg font-black text-slate-900 mt-1">{g.diemChuyenCan ?? '—'}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <p className="text-[11px] text-slate-500 font-bold uppercase">Giữa Kỳ (30%)</p>
                    <p className="text-lg font-black text-slate-900 mt-1">{g.diemGiuaKy ?? '—'}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <p className="text-[11px] text-slate-500 font-bold uppercase">Cuối Kỳ (50%)</p>
                    <p className="text-lg font-black text-slate-900 mt-1">{g.diemCuoiKy ?? '—'}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-teal-50 border border-teal-200">
                    <p className="text-[11px] text-teal-800 uppercase font-bold">Điểm Tổng Kết</p>
                    <p className="text-xl font-black text-teal-700 mt-1">{g.diemTongKet ?? '—'}</p>
                  </div>
                </div>

                {g.nhanXet && (
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
                    💬 <span className="font-bold text-slate-900">Nhận xét của giáo viên:</span> {g.nhanXet}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500 text-center py-16">Chưa có bảng điểm cho học kỳ này.</p>
        )}
      </div>
    </AppLayout>
  );
}
