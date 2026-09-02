'use client';

import React, { useEffect, useState } from 'react';
import { AppLayout } from '../../../components/AppLayout';
import { enrollmentsService, usersService } from '../../../services/api';
import { UserPlus, Receipt, Users, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function StaffDashboardPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const invList = await enrollmentsService.getInvoices();
        setInvoices(invList);
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
      allowedRoles={['TU_VAN_VIEN', 'QUAN_LY']}
      title="Bàn Làm Việc Tư Vấn Viên (Staff Workspace)"
      subtitle="Tiếp nhận học viên mới, ghi danh và thu học phí"
    >
      <div className="space-y-6">
        {/* Quick Action Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/staff/new-student"
            className="p-6 rounded-2xl bg-gradient-to-br from-indigo-950/60 to-slate-900 border border-indigo-500/30 hover:border-indigo-500/50 transition group"
          >
            <UserPlus className="w-8 h-8 text-indigo-400 mb-3 group-hover:scale-110 transition" />
            <h4 className="font-bold text-white text-base">Tiếp Nhận Học Viên Mới</h4>
            <p className="text-xs text-slate-400 mt-1">Đăng ký tài khoản, đánh giá CEFR đầu vào</p>
          </Link>

          <Link
            href="/staff/collect-fee"
            className="p-6 rounded-2xl bg-gradient-to-br from-emerald-950/60 to-slate-900 border border-emerald-500/30 hover:border-emerald-500/50 transition group"
          >
            <Receipt className="w-8 h-8 text-emerald-400 mb-3 group-hover:scale-110 transition" />
            <h4 className="font-bold text-white text-base">Ghi Danh & Thu Học Phí</h4>
            <p className="text-xs text-slate-400 mt-1">Đăng ký lớp học và lập phiếu thu</p>
          </Link>

          <Link
            href="/student/ai-consult"
            className="p-6 rounded-2xl bg-gradient-to-br from-purple-950/60 to-slate-900 border border-purple-500/30 hover:border-purple-500/50 transition group"
          >
            <Sparkles className="w-8 h-8 text-purple-400 mb-3 group-hover:scale-110 transition" />
            <h4 className="font-bold text-white text-base">AI Hỗ Trợ Tư Vấn Lớp</h4>
            <p className="text-xs text-slate-400 mt-1">Gợi ý lớp học phù hợp cho phụ huynh & học viên</p>
          </Link>
        </div>

        {/* Recent Invoices */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
          <h3 className="text-base font-bold text-white mb-4">Các Hóa Đơn Cần Thu Tiền Gần Đây</h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 uppercase text-[11px] font-semibold tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-5 py-3">Mã Hóa Đơn</th>
                  <th className="px-5 py-3">Học Viên</th>
                  <th className="px-5 py-3">Lớp Học</th>
                  <th className="px-5 py-3">Còn Nợ</th>
                  <th className="px-5 py-3">Trạng Thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {invoices.slice(0, 5).map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-800/40 transition">
                    <td className="px-5 py-3.5 font-mono font-bold text-indigo-400">{inv.maHoaDon}</td>
                    <td className="px-5 py-3.5 font-semibold text-white">{inv.hocVien?.hoTen}</td>
                    <td className="px-5 py-3.5">{inv.dangKyHoc?.lopHoc?.tenLopHoc}</td>
                    <td className="px-5 py-3.5 font-bold text-rose-400">
                      {(Number(inv.soTienPhaiTra) - Number(inv.soTienDaTra)).toLocaleString()} đ
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-400">
                        {inv.trangThai}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
