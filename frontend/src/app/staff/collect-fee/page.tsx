'use client';

import React, { useEffect, useState } from 'react';
import { AppLayout } from '../../../components/AppLayout';
import { usersService, classesService, enrollmentsService } from '../../../services/api';
import { HocVien, LopHoc, HoaDon } from '../../../types';
import { Receipt, DollarSign, CheckCircle, AlertCircle, Plus, CreditCard, UserCheck, Calendar, Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { formatTrangThaiHoaDon, formatTrangThaiLopHoc } from '../../../utils/formatters';

export default function StaffCollectFeePage() {
  const [students, setStudents] = useState<HocVien[]>([]);
  const [classes, setClasses] = useState<LopHoc[]>([]);
  const [invoices, setInvoices] = useState<HoaDon[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<number>(1);
  const [selectedClassId, setSelectedClassId] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Search & Pagination cho Invoices
  const [searchInvoice, setSearchInvoice] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(8);

  // Modal Thu Tiền
  const [selectedInvoice, setSelectedInvoice] = useState<HoaDon | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<'TIEN_MAT' | 'CHUYEN_KHOAN'>('TIEN_MAT');
  const [note, setNote] = useState('');

  // Lọc và phân trang hóa đơn
  const filteredInvoices = invoices.filter((inv) => {
    const q = searchInvoice.toLowerCase();
    return (
      inv.maHoaDon.toLowerCase().includes(q) ||
      (inv.hocVien?.hoTen && inv.hocVien.hoTen.toLowerCase().includes(q)) ||
      (inv.hocVien?.maHocVien && inv.hocVien.maHocVien.toLowerCase().includes(q)) ||
      (inv.dangKyHoc?.lopHoc?.tenLopHoc && inv.dangKyHoc.lopHoc.tenLopHoc.toLowerCase().includes(q))
    );
  });

  const totalInvoices = filteredInvoices.length;
  const totalPages = Math.max(1, Math.ceil(totalInvoices / limit));
  const displayedInvoices = filteredInvoices.slice((page - 1) * limit, page * limit);

  useEffect(() => {
    setPage(1);
  }, [searchInvoice]);

  const fetchData = async () => {
    try {
      const [stuRes, classList, invoiceList] = await Promise.all([
        usersService.getStudents(1, 100),
        classesService.getAll(), // Lấy tất cả lớp học trên hệ thống
        enrollmentsService.getInvoices(),
      ]);
      setStudents(stuRes.data);
      // Lọc các lớp còn hoạt động (không bao gồm lớp đã hủy/đã kết thúc)
      const activeClasses = (classList || []).filter(
        (c: LopHoc) => c.trangThai !== 'DA_HUY' && c.trangThai !== 'DA_KET_THUC'
      );
      setClasses(activeClasses.length > 0 ? activeClasses : classList);
      if (stuRes.data.length > 0) setSelectedStudentId(stuRes.data[0].id);
      if (classList.length > 0) setSelectedClassId(classList[0].id);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEnrollAndInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      const res = await enrollmentsService.enroll(selectedStudentId, selectedClassId);
      setMessage({
        type: 'success',
        text: `Ghi danh thành công! Đã tạo hóa đơn ${res.invoice?.maHoaDon} với số tiền ${Number(res.invoice?.soTienPhaiTra).toLocaleString()} đ. Bạn có thể thu tiền ngay ở bảng phía dưới.`,
      });
      fetchData();
    } catch (err: any) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Lỗi ghi danh lớp học.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenPayment = (inv: HoaDon) => {
    setSelectedInvoice(inv);
    const remaining = Number(inv.soTienPhaiTra) - Number(inv.soTienDaTra);
    setPaymentAmount(remaining);
  };

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoice) return;
    try {
      await enrollmentsService.createPayment(selectedInvoice.id, {
        soTien: +paymentAmount,
        phuongThuc: paymentMethod,
        ghiChu: note,
      });
      setMessage({
        type: 'success',
        text: `Đã xác nhận thu ${Number(paymentAmount).toLocaleString()} đ cho học viên thành công! Hồ sơ học viên đã được kích hoạt.`,
      });
      setSelectedInvoice(null);
      setNote('');
      fetchData();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Lỗi ghi nhận thanh toán.' });
    }
  };

  return (
    <AppLayout
      allowedRoles={['TU_VAN_VIEN', 'QUAN_LY']}
      title="Ghi Danh & Thu Học Phí Tại Quầy"
      subtitle="Thực hiện ghi danh lớp học, lập phiếu thu thanh toán tiền mặt/chuyển khoản và xác nhận kích hoạt học viên"
    >
      <div className="space-y-8">
        {message && (
          <div
            className={`p-4 rounded-xl text-xs flex items-center space-x-2 ${
              message.type === 'success'
                ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
                : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
            }`}
          >
            {message.type === 'success' ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{message.text}</span>
          </div>
        )}

        {/* 1. Form Ghi danh lớp học */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-800">
            <UserCheck className="w-5 h-5 text-indigo-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              1. Ghi Danh Học Viên Vào Lớp Học
            </h3>
          </div>

          <form onSubmit={handleEnrollAndInvoice} className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5 uppercase tracking-wider">
                Chọn Học Viên
              </label>
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(+e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-semibold focus:outline-none focus:border-indigo-500"
              >
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    [{s.maHocVien}] {s.hoTen} — CEFR {s.trinhDoCEFR}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1.5 uppercase tracking-wider">
                Chọn Lớp Học Cần Ghi Danh
              </label>
              <select
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(+e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-semibold focus:outline-none focus:border-indigo-500"
              >
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    [{c.maLopHoc}] {c.tenLopHoc} — {formatTrangThaiLopHoc(c.trangThai)} ({c.siSoHienTai}/{c.siSoToiDa} HV)
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <Receipt className="w-4 h-4" />
                <span>{submitting ? 'Đang Ghi Danh...' : 'Ghi Danh & Tạo Hóa Đơn'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* 2. Quầy thu tiền & Danh sách Hóa đơn */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <CreditCard className="w-5 h-5 text-emerald-400 shrink-0" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                2. Quầy Thu Học Phí & Lập Phiếu Thu
              </h3>
            </div>
            
            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-60">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchInvoice}
                  onChange={(e) => setSearchInvoice(e.target.value)}
                  placeholder="Tìm mã HĐ, học viên, lớp..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 pl-9 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <span className="text-xs text-slate-400 font-semibold whitespace-nowrap">
                {totalInvoices} hóa đơn
              </span>
            </div>
          </div>

          {loading ? (
            <div className="py-12 flex justify-center items-center">
              <div className="w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 text-slate-400 uppercase text-[11px] font-semibold tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="px-4 py-3">Mã Hóa Đơn</th>
                    <th className="px-4 py-3">Học Viên</th>
                    <th className="px-4 py-3">Lớp Học</th>
                    <th className="px-4 py-3">Phải Trả</th>
                    <th className="px-4 py-3">Đã Thu</th>
                    <th className="px-4 py-3">Còn Nợ</th>
                    <th className="px-4 py-3">Trạng Thái</th>
                    <th className="px-4 py-3 text-right">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {displayedInvoices.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-8 text-center text-slate-400">
                        Không tìm thấy hóa đơn nào phù hợp.
                      </td>
                    </tr>
                  ) : (
                    displayedInvoices.map((inv) => {
                      const remaining = Number(inv.soTienPhaiTra) - Number(inv.soTienDaTra);
                      return (
                        <tr key={inv.id} className="hover:bg-slate-800/40 transition">
                          <td className="px-4 py-3 font-mono font-bold text-indigo-400">{inv.maHoaDon}</td>
                          <td className="px-4 py-3">
                            <p className="font-semibold text-white">{inv.hocVien?.hoTen}</p>
                            <p className="text-[11px] font-mono text-slate-500">{inv.hocVien?.maHocVien}</p>
                          </td>
                          <td className="px-4 py-3 text-slate-300">
                            {inv.dangKyHoc?.lopHoc?.tenLopHoc || 'N/A'}
                          </td>
                          <td className="px-4 py-3 font-mono font-semibold text-white">
                            {Number(inv.soTienPhaiTra).toLocaleString()} đ
                          </td>
                          <td className="px-4 py-3 font-mono font-semibold text-emerald-400">
                            {Number(inv.soTienDaTra).toLocaleString()} đ
                          </td>
                          <td className="px-4 py-3 font-mono font-bold text-rose-400">
                            {remaining.toLocaleString()} đ
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                                inv.trangThai === 'DA_HOAN_THANH'
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                  : inv.trangThai === 'THANH_TOAN_MOT_PHAN'
                                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                              }`}
                            >
                              {formatTrangThaiHoaDon(inv.trangThai)}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            {remaining > 0 ? (
                              <button
                                onClick={() => handleOpenPayment(inv)}
                                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition text-xs flex items-center space-x-1 ml-auto shadow-sm"
                              >
                                <DollarSign className="w-3.5 h-3.5" />
                                <span>Thu Tiền</span>
                              </button>
                            ) : (
                              <span className="text-emerald-400 font-semibold text-xs flex items-center justify-end">
                                <CheckCircle className="w-3.5 h-3.5 mr-1" />
                                Đã Hoàn Tất
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="px-4 py-3 bg-slate-950/60 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span>
                    Hiển thị {(page - 1) * limit + 1} - {Math.min(page * limit, totalInvoices)} / {totalInvoices} hóa đơn
                  </span>
                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30 transition"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-2 font-semibold text-white">
                      {page} / {totalPages}
                    </span>
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page >= totalPages}
                      className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30 transition"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Thu Tiền Tại Quầy */}
        {selectedInvoice && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                  <Receipt className="w-4 h-4 text-emerald-400" />
                  <span>Phiếu Thu Học Phí Tại Quầy</span>
                </h3>
                <span className="font-mono text-xs text-indigo-400 font-bold">
                  {selectedInvoice.maHoaDon}
                </span>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl space-y-1 text-xs">
                <p className="text-slate-400">
                  Học viên: <strong className="text-white">{selectedInvoice.hocVien?.hoTen}</strong>
                </p>
                <p className="text-slate-400">
                  Lớp học: <strong className="text-indigo-300">{selectedInvoice.dangKyHoc?.lopHoc?.tenLopHoc}</strong>
                </p>
                <div className="flex justify-between pt-2 border-t border-slate-800/80 font-semibold">
                  <span className="text-slate-400">Còn phải thu:</span>
                  <span className="text-rose-400 font-mono font-bold">
                    {(Number(selectedInvoice.soTienPhaiTra) - Number(selectedInvoice.soTienDaTra)).toLocaleString()} đ
                  </span>
                </div>
              </div>

              <form onSubmit={handleSubmitPayment} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Số Tiền Thu (VNĐ)</label>
                  <input
                    type="number"
                    required
                    min={1000}
                    max={Number(selectedInvoice.soTienPhaiTra) - Number(selectedInvoice.soTienDaTra)}
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(+e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-base font-bold focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Phương Thức Thanh Toán</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500 font-semibold"
                  >
                    <option value="TIEN_MAT">💵 Tiền Mặt Tại Quầy</option>
                    <option value="CHUYEN_KHOAN">💳 Chuyển Khoản Ngân Hàng / Quét QR</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Ghi Chú Giao Dịch</label>
                  <input
                    type="text"
                    placeholder="VD: Đóng đợt 1 / Thu tiền mặt tại bàn tiếp nhận..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setSelectedInvoice(null)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                  >
                    Hủy
                  </button>
                  <button type="submit" className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-600/30">
                    Xác Nhận & Xuất Phiếu Thu
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
