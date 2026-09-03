'use client';

import React, { useEffect, useState } from 'react';
import { AppLayout } from '../../../components/AppLayout';
import { gradesService } from '../../../services/api';
import { Award, CheckCircle, Sparkles } from 'lucide-react';

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
              <div key={g.id} className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <span className="font-mono text-xs font-bold text-teal-700 mr-2 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded">
                      {g.lopHoc?.maLopHoc}
                    </span>
                    <span className="text-base font-bold text-slate-900">{g.lopHoc?.tenLopHoc}</span>
                    <p className="text-xs text-slate-500 mt-0.5">{g.lopHoc?.khoaHoc?.tenKhoaHoc}</p>
                  </div>

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
