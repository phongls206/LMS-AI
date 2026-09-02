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
        <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-800/40 text-xs text-indigo-300 flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
          <span>
            <strong>Quy chuẩn hoàn thành khóa:</strong> Điểm Tổng Kết ≥ 50.00 điểm <strong>VÀ</strong> Chuyên Cần ≥ 80.00 điểm.
          </span>
        </div>

        {loading ? (
          <div className="py-20 flex justify-center items-center">
            <div className="w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
          </div>
        ) : grades.length > 0 ? (
          <div className="space-y-4">
            {grades.map((g) => (
              <div key={g.id} className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <span className="font-mono text-xs font-bold text-indigo-400 mr-2">[{g.lopHoc?.maLopHoc}]</span>
                    <span className="text-base font-bold text-white">{g.lopHoc?.tenLopHoc}</span>
                    <p className="text-xs text-slate-400">{g.lopHoc?.khoaHoc?.tenKhoaHoc}</p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      g.trangThaiHoanThanh === 'DAT'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : g.trangThaiHoanThanh === 'KHONG_DAT'
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                        : 'bg-slate-800 text-slate-400'
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
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                    <p className="text-[11px] text-slate-400 uppercase">Chuyên Cần (20%)</p>
                    <p className="text-lg font-bold text-white mt-1">{g.diemChuyenCan ?? '—'}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                    <p className="text-[11px] text-slate-400 uppercase">Giữa Kỳ (30%)</p>
                    <p className="text-lg font-bold text-white mt-1">{g.diemGiuaKy ?? '—'}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                    <p className="text-[11px] text-slate-400 uppercase">Cuối Kỳ (50%)</p>
                    <p className="text-lg font-bold text-white mt-1">{g.diemCuoiKy ?? '—'}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/30">
                    <p className="text-[11px] text-indigo-300 uppercase font-semibold">Điểm Tổng Kết</p>
                    <p className="text-xl font-black text-indigo-400 mt-1">{g.diemTongKet ?? '—'}</p>
                  </div>
                </div>

                {g.nhanXet && (
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs text-slate-300">
                    💬 <span className="font-semibold text-slate-400">Nhận xét của giáo viên:</span> {g.nhanXet}
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
