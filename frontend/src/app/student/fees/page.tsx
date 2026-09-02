'use client';

import React, { useEffect, useState } from 'react';
import { AppLayout } from '../../../components/AppLayout';
import { enrollmentsService, authService } from '../../../services/api';
import { HoaDon } from '../../../types';
import { Receipt, DollarSign, CheckCircle2 } from 'lucide-react';

export default function StudentFeesPage() {
  const [invoices, setInvoices] = useState<HoaDon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const me = await authService.getMe();
        if (me?.hoSoHocVien?.id) {
          const list = await enrollmentsService.getInvoices(undefined, me.hoSoHocVien.id);
          setInvoices(list);
        }
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
      title="Học Phí & Hóa Đơn Cá Nhân"
      subtitle="Theo dõi chi tiết công nợ học phí và lịch sử phiếu thu thanh toán"
    >
      <div className="space-y-6">
        {loading ? (
          <div className="py-20 flex justify-center items-center">
            <div className="w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
          </div>
        ) : invoices.length > 0 ? (
          <div className="space-y-4">
            {invoices.map((inv) => {
              const remaining = Number(inv.soTienPhaiTra) - Number(inv.soTienDaTra);
              return (
                <div key={inv.id} className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-mono text-xs font-bold text-indigo-400">{inv.maHoaDon}</span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        inv.trangThai === 'DA_HOAN_THANH'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {inv.trangThai === 'DA_HOAN_THANH' ? 'Đã Thanh Toán Đủ' : 'Chưa Hoàn Tất'}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-white mb-3">
                    Lớp: {inv.dangKyHoc?.lopHoc?.tenLopHoc || 'Khóa học tiếng Anh'}
                  </h4>

                  <div className="grid grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-center">
                    <div>
                      <p className="text-slate-400">Học Phí Phải Đóng</p>
                      <p className="text-sm font-bold text-white mt-1">
                        {Number(inv.soTienPhaiTra).toLocaleString()} đ
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-400">Số Tiền Đã Đóng</p>
                      <p className="text-sm font-bold text-emerald-400 mt-1">
                        {Number(inv.soTienDaTra).toLocaleString()} đ
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-400">Còn Nợ</p>
                      <p className="text-sm font-bold text-rose-400 mt-1">
                        {remaining.toLocaleString()} đ
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-slate-500 text-center py-16">Bạn không có hóa đơn học phí nào.</p>
        )}
      </div>
    </AppLayout>
  );
}
