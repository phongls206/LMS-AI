'use client';

import React, { useEffect, useState } from 'react';
import { AppLayout } from '../../../components/AppLayout';
import { enrollmentsService, authService } from '../../../services/api';
import { UserPlus, Receipt, Sparkles, DollarSign, Clock, CheckCircle, AlertCircle, ArrowRight, UserCheck, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import Link from 'next/link';
import { formatTrangThaiHoaDon } from '../../../utils/formatters';

export default function StaffDashboardPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [myPayments, setMyPayments] = useState<any[]>([]);
  const [pendingInvoices, setPendingInvoices] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'my_payments' | 'pending_invoices'>('my_payments');
  const [loading, setLoading] = useState(true);

  // Pagination states
  const [pagePayments, setPagePayments] = useState(1);
  const limitPayments = 8;
  const [pageInvoices, setPageInvoices] = useState(1);
  const limitInvoices = 8;

  useEffect(() => {
    const fetch = async () => {
      try {
        const user = await authService.getMe();
        setCurrentUser(user);

        const [paymentsRes, invoicesRes] = await Promise.all([
          enrollmentsService.getPayments(user.id),
          enrollmentsService.getInvoices(),
        ]);

        setMyPayments(paymentsRes || []);
        const pending = (invoicesRes || []).filter(
          (inv: any) => inv.trangThai === 'CHUA_THANH_TOAN' || inv.trangThai === 'THANH_TOAN_MOT_PHAN'
        );
        setPendingInvoices(pending);
      } catch (err) {
        console.error('Lỗi tải dữ liệu Staff Dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const totalCollectedByMe = myPayments.reduce(
    (sum, p) => sum + Number(p.soTien || 0),
    0
  );

  const totalPaymentsPages = Math.max(1, Math.ceil(myPayments.length / limitPayments));
  const displayedPayments = myPayments.slice(
    (pagePayments - 1) * limitPayments,
    pagePayments * limitPayments
  );

  const totalInvoicesPages = Math.max(1, Math.ceil(pendingInvoices.length / limitInvoices));
  const displayedInvoices = pendingInvoices.slice(
    (pageInvoices - 1) * limitInvoices,
    pageInvoices * limitInvoices
  );

  return (
    <AppLayout
      allowedRoles={['TU_VAN_VIEN', 'QUAN_LY']}
      title="Bàn Làm Việc Tư Vấn Viên (Staff Workspace)"
      subtitle={`Chào mừng ${currentUser?.tenDangNhap || 'Tư Vấn Viên'} — Quản lý tiếp nhận học viên, theo dõi phiếu thu cá nhân và hỗ trợ phụ huynh`}
    >
      <div className="space-y-6">
        {/* KPI Stat Cards cho riêng tư vấn viên này */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Doanh Thu Đã Thu Trong Ca
              </p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">
                {totalCollectedByMe.toLocaleString()} <span className="text-sm font-bold text-teal-700">đ</span>
              </h3>
              <p className="text-[11px] text-emerald-700 mt-1 flex items-center gap-1 font-bold">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Giao dịch chính chủ {currentUser?.tenDangNhap}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Phiếu Thu Bạn Đã Lập
              </p>
              <h3 className="text-2xl font-black text-emerald-700 mt-1">
                {myPayments.length} <span className="text-sm font-bold text-slate-500">phiếu thu</span>
              </h3>
              <p className="text-[11px] text-slate-500 mt-1">Lập và xác nhận thành công</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
              <Receipt className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Hóa Đơn Chờ Thu Tiền
              </p>
              <h3 className="text-2xl font-black text-amber-700 mt-1">
                {pendingInvoices.length} <span className="text-sm font-bold text-slate-500">hóa đơn</span>
              </h3>
              <p className="text-[11px] text-amber-700 mt-1 flex items-center gap-1 font-bold">
                <Clock className="w-3.5 h-3.5" /> Cần liên hệ thu học phí
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
              <AlertCircle className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Quick Action Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/staff/new-student"
            className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:border-teal-400 hover:shadow-md transition group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 group-hover:scale-110 transition">
                <UserPlus className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 group-hover:translate-x-1 transition" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Tiếp Nhận Học Viên Mới</h4>
              <p className="text-xs text-slate-500 mt-1">Đăng ký tài khoản, đánh giá CEFR đầu vào & phân lớp</p>
            </div>
          </Link>

          <Link
            href="/staff/collect-fee"
            className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:border-teal-400 hover:shadow-md transition group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 group-hover:scale-110 transition">
                <Receipt className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Quầy Thu Học Phí</h4>
              <p className="text-xs text-slate-500 mt-1">Ghi danh lớp học, lập phiếu thu thanh toán nhiều đợt</p>
            </div>
          </Link>

          <Link
            href="/student/ai-consult"
            className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:border-teal-400 hover:shadow-md transition group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 group-hover:scale-110 transition">
                <Sparkles className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 group-hover:translate-x-1 transition" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">AI Hỗ Trợ Tư Vấn Lớp</h4>
              <p className="text-xs text-slate-500 mt-1">Gợi ý lớp học phù hợp cho phụ huynh & học viên theo CEFR</p>
            </div>
          </Link>
        </div>

        {/* Tab Control */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setActiveTab('my_payments')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                  activeTab === 'my_payments'
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                Phiếu Thu Của Tôi ({currentUser?.tenDangNhap}) ({myPayments.length})
              </button>

              <button
                onClick={() => setActiveTab('pending_invoices')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                  activeTab === 'pending_invoices'
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                }`}
              >
                <AlertCircle className="w-4 h-4" />
                Hóa Đơn Chờ Thu ({pendingInvoices.length})
              </button>
            </div>

            <span className="text-[11px] text-slate-500">
              Đang làm việc với tư cách: <strong className="text-teal-700 font-bold">{currentUser?.tenDangNhap}</strong>
            </span>
          </div>

          {/* Nội dung Tab 1: Phiếu Thu Của Tôi */}
          {activeTab === 'my_payments' && (
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-600 uppercase text-[11px] font-bold tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Mã Giao Dịch</th>
                    <th className="px-4 py-3">Mã Hóa Đơn</th>
                    <th className="px-4 py-3">Học Viên</th>
                    <th className="px-4 py-3">Lớp Học</th>
                    <th className="px-4 py-3">Số Tiền Thu</th>
                    <th className="px-4 py-3">Hình Thức</th>
                    <th className="px-4 py-3">Thời Gian</th>
                    <th className="px-4 py-3">Trạng Thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {myPayments.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-8 text-center text-slate-400">
                        Chưa có phiếu thu nào được lập bởi tài khoản <strong>{currentUser?.tenDangNhap}</strong>.
                      </td>
                    </tr>
                  ) : (
                    displayedPayments.map((p) => (
                      <tr key={p.id} className="hover:bg-teal-50/30 transition">
                        <td className="px-4 py-3.5 font-mono font-bold text-teal-700">{p.maGiaoDich}</td>
                        <td className="px-4 py-3.5 font-mono text-slate-800 font-semibold">{p.hoaDon?.maHoaDon}</td>
                        <td className="px-4 py-3.5 font-bold text-slate-900">{p.hoaDon?.hocVien?.hoTen}</td>
                        <td className="px-4 py-3.5 text-slate-700">{p.hoaDon?.dangKyHoc?.lopHoc?.tenLopHoc}</td>
                        <td className="px-4 py-3.5 font-bold text-slate-900">
                          {Number(p.soTien).toLocaleString()} đ
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                            {p.phuongThuc === 'TIEN_MAT' ? '💵 Tiền mặt' : '💳 Chuyển khoản'}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-slate-500 text-[11px]">
                          {new Date(p.thoiGianThanhToan).toLocaleDateString('vi-VN')}
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            ✓ {p.trangThai === 'THANH_CONG' ? 'Thành công' : formatTrangThaiHoaDon(p.trangThai)}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {/* Pagination cho Phiếu Thu */}
              {totalPaymentsPages > 1 && (
                <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
                  <span>
                    Hiển thị {(pagePayments - 1) * limitPayments + 1} - {Math.min(pagePayments * limitPayments, myPayments.length)} / {myPayments.length} phiếu thu
                  </span>
                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() => setPagePayments((p) => Math.max(1, p - 1))}
                      disabled={pagePayments === 1}
                      className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-slate-900 disabled:opacity-30 transition cursor-pointer"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-2 font-bold text-slate-900">
                      {pagePayments} / {totalPaymentsPages}
                    </span>
                    <button
                      onClick={() => setPagePayments((p) => Math.min(totalPaymentsPages, p + 1))}
                      disabled={pagePayments >= totalPaymentsPages}
                      className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-slate-900 disabled:opacity-30 transition cursor-pointer"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Nội dung Tab 2: Hóa Đơn Chờ Thu Tiền */}
          {activeTab === 'pending_invoices' && (
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-600 uppercase text-[11px] font-bold tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Mã Hóa Đơn</th>
                    <th className="px-4 py-3">Học Viên</th>
                    <th className="px-4 py-3">Lớp Học</th>
                    <th className="px-4 py-3">Phải Trả</th>
                    <th className="px-4 py-3">Đã Đóng</th>
                    <th className="px-4 py-3">Còn Nợ</th>
                    <th className="px-4 py-3">Trạng Thái</th>
                    <th className="px-4 py-3 text-right">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pendingInvoices.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-8 text-center text-emerald-700 font-bold">
                        🎉 Hiện không có hóa đơn nào còn nợ!
                      </td>
                    </tr>
                  ) : (
                    displayedInvoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-teal-50/30 transition">
                        <td className="px-4 py-3.5 font-mono font-bold text-teal-700">{inv.maHoaDon}</td>
                        <td className="px-4 py-3.5 font-bold text-slate-900">{inv.hocVien?.hoTen}</td>
                        <td className="px-4 py-3.5 text-slate-700">{inv.dangKyHoc?.lopHoc?.tenLopHoc}</td>
                        <td className="px-4 py-3.5 font-bold text-slate-900">{Number(inv.soTienPhaiTra).toLocaleString()} đ</td>
                        <td className="px-4 py-3.5 text-emerald-700 font-bold">{Number(inv.soTienDaTra).toLocaleString()} đ</td>
                        <td className="px-4 py-3.5 font-bold text-rose-700">
                          {(Number(inv.soTienPhaiTra) - Number(inv.soTienDaTra)).toLocaleString()} đ
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            {formatTrangThaiHoaDon(inv.trangThai)}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <Link
                            href="/staff/collect-fee"
                            className="px-3 py-1 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-[11px] transition inline-flex items-center gap-1 shadow-sm"
                          >
                            <DollarSign className="w-3.5 h-3.5" /> Thu Tiền
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {/* Pagination cho Hóa Đơn Chờ Thu */}
              {totalInvoicesPages > 1 && (
                <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
                  <span>
                    Hiển thị {(pageInvoices - 1) * limitInvoices + 1} - {Math.min(pageInvoices * limitInvoices, pendingInvoices.length)} / {pendingInvoices.length} hóa đơn
                  </span>
                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() => setPageInvoices((p) => Math.max(1, p - 1))}
                      disabled={pageInvoices === 1}
                      className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-slate-900 disabled:opacity-30 transition cursor-pointer"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-2 font-bold text-slate-900">
                      {pageInvoices} / {totalInvoicesPages}
                    </span>
                    <button
                      onClick={() => setPageInvoices((p) => Math.min(totalInvoicesPages, p + 1))}
                      disabled={pageInvoices >= totalInvoicesPages}
                      className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-slate-900 disabled:opacity-30 transition cursor-pointer"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
