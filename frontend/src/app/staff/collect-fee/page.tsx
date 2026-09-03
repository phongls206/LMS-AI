'use client';

import React, { useEffect, useState } from 'react';
import { AppLayout } from '../../../components/AppLayout';
import { usersService, classesService, enrollmentsService } from '../../../services/api';
import { HocVien, LopHoc, HoaDon } from '../../../types';
import { Receipt, DollarSign, CheckCircle, AlertCircle, Plus, CreditCard, UserCheck, Calendar, Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Download } from 'lucide-react';
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
      // Lọc các lớp có thể ghi danh: Chỉ lớp đang mở tuyển sinh hoặc sắp mở (loại bỏ hoàn toàn lớp ĐÃ HỦY, ĐÃ KẾT THÚC, ĐANG HỌC)
      const enrollableClasses = (classList || []).filter(
        (c: LopHoc) => c.trangThai === 'DANG_MO_DANG_KY' || c.trangThai === 'SAP_MO'
      );
      setClasses(enrollableClasses);
      if (stuRes.data.length > 0) setSelectedStudentId(stuRes.data[0].id);
      if (enrollableClasses.length > 0) setSelectedClassId(enrollableClasses[0].id);
      else setSelectedClassId(0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ─── Xuất CSV Hóa Đơn Học Phí ────────────────────────────────────────────────
  const exportInvoicesCSV = () => {
    const headers = [
      'Mã Hóa Đơn', 'Mã Học Viên', 'Họ Tên Học Viên',
      'Mã Lớp', 'Tên Lớp Học',
      'Học Phí Phải Trả (VNĐ)', 'Đã Thanh Toán (VNĐ)', 'Còn Nợ (VNĐ)',
      'Tỷ Lệ Đã Thanh Toán (%)', 'Trạng Thái Hóa Đơn', 'Ngày Lập',
    ];
    const rows = invoices.map((inv) => {
      const phaiTra = Number(inv.soTienPhaiTra ?? 0);
      const daTra = Number(inv.soTienDaTra ?? 0);
      const conNo = Math.max(0, phaiTra - daTra);
      const tiLe = phaiTra > 0 ? Math.round((daTra / phaiTra) * 100) : 0;
      const ngayLap = inv.ngayLap
        ? new Date(inv.ngayLap).toLocaleDateString('vi-VN')
        : (inv.createdAt ? new Date(inv.createdAt).toLocaleDateString('vi-VN') : '');
      return [
        inv.maHoaDon ?? '',
        inv.hocVien?.maHocVien ?? '',
        `"${(inv.hocVien?.hoTen ?? '').replace(/"/g, '""')}"`,
        inv.dangKyHoc?.lopHoc?.maLopHoc ?? '',
        `"${(inv.dangKyHoc?.lopHoc?.tenLopHoc ?? '').replace(/"/g, '""')}"`,
        phaiTra,
        daTra,
        conNo,
        tiLe,
        `"${formatTrangThaiHoaDon(inv.trangThai)}"`,
        ngayLap,
      ];
    });
    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Hoa_Don_Hoc_Phi_ETC_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

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
    setPaymentMethod('TIEN_MAT');
    setNote('');
  };

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoice) return;

    try {
      await enrollmentsService.createPayment(selectedInvoice.id, {
        soTien: paymentAmount,
        phuongThuc: paymentMethod,
        ghiChu: note,
      });

      setSelectedInvoice(null);
      setMessage({
        type: 'success',
        text: `Thu thành công ${paymentAmount.toLocaleString()} đ cho hóa đơn ${selectedInvoice.maHoaDon}! Đã cập nhật công nợ.`,
      });
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Có lỗi xảy ra khi thu tiền.');
    }
  };

  return (
    <AppLayout
      allowedRoles={['TU_VAN_VIEN', 'QUAN_LY']}
      title="Ghi Danh Lớp Học & Quầy Thu Học Phí"
      subtitle="Quy trình chuẩn: Chọn học viên -> Ghi danh lớp học -> Tạo hóa đơn -> Thu học phí (tiền mặt / chuyển khoản)"
    >
      <div className="space-y-8">
        {message && (
          <div
            className={`p-4 rounded-xl text-xs flex items-center space-x-2 shadow-sm ${
              message.type === 'success'
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold'
                : 'bg-rose-50 border border-rose-200 text-rose-800 font-bold'
            }`}
          >
            {message.type === 'success' ? <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" /> : <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />}
            <span>{message.text}</span>
          </div>
        )}

        {/* 1. Form Ghi danh lớp học */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
            <UserCheck className="w-5 h-5 text-teal-600" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              1. Ghi Danh Học Viên Vào Lớp Học
            </h3>
          </div>

          <form onSubmit={handleEnrollAndInvoice} className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1.5 uppercase tracking-wider">
                Chọn Học Viên
              </label>
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(+e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-bold focus:outline-none focus:border-teal-500 cursor-pointer"
              >
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    [{s.maHocVien}] {s.hoTen} — CEFR {s.trinhDoCEFR}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1.5 uppercase tracking-wider">
                Chọn Lớp Học Cần Ghi Danh
              </label>
              <select
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(+e.target.value)}
                disabled={classes.length === 0}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-bold focus:outline-none focus:border-teal-500 cursor-pointer disabled:opacity-60"
              >
                {classes.length === 0 ? (
                  <option value={0}>Không có lớp nào đang mở tuyển sinh</option>
                ) : (
                  classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      [{c.maLopHoc}] {c.tenLopHoc} — {formatTrangThaiLopHoc(c.trangThai)} ({c.siSoHienTai}/{c.siSoToiDa} HV)
                    </option>
                  ))
                )}
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                disabled={submitting || classes.length === 0 || !selectedClassId}
                className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-md shadow-teal-600/20 transition flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
              >
                <Receipt className="w-4 h-4" />
                <span>{submitting ? 'Đang Ghi Danh...' : 'Ghi Danh & Tạo Hóa Đơn'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* 2. Quầy thu tiền & Danh sách Hóa đơn */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <CreditCard className="w-5 h-5 text-teal-600 shrink-0" />
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                2. Quầy Thu Học Phí & Lập Phiếu Thu
              </h3>
            </div>
            
            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-60">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchInvoice}
                  onChange={(e) => setSearchInvoice(e.target.value)}
                  placeholder="Tìm mã HĐ, học viên, lớp..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 pl-9 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-500"
                />
              </div>
              <span className="text-xs text-slate-500 font-bold whitespace-nowrap">
                {totalInvoices} hóa đơn
              </span>
              <button
                onClick={exportInvoicesCSV}
                className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center space-x-1.5 border border-emerald-200 transition cursor-pointer shadow-sm whitespace-nowrap"
                title="Xuất danh sách hóa đơn ra file CSV"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Xuất CSV</span>
              </button>
            </div>
          </div>

          {loading ? (
            <div className="py-12 flex justify-center items-center">
              <div className="w-8 h-8 border-4 border-teal-500/20 border-t-teal-600 rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-600 uppercase text-[11px] font-bold tracking-wider border-b border-slate-200">
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
                <tbody className="divide-y divide-slate-100">
                  {displayedInvoices.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-8 text-center text-slate-400 italic">
                        Không tìm thấy hóa đơn nào phù hợp.
                      </td>
                    </tr>
                  ) : (
                    displayedInvoices.map((inv) => {
                      const remaining = Number(inv.soTienPhaiTra) - Number(inv.soTienDaTra);
                      return (
                        <tr key={inv.id} className="hover:bg-teal-50/30 transition">
                          <td className="px-4 py-3 font-mono font-bold text-teal-700">{inv.maHoaDon}</td>
                          <td className="px-4 py-3">
                            <p className="font-bold text-slate-900">{inv.hocVien?.hoTen}</p>
                            <p className="text-[11px] font-mono text-slate-400">{inv.hocVien?.maHocVien}</p>
                          </td>
                          <td className="px-4 py-3 text-slate-700">
                            {inv.dangKyHoc?.lopHoc?.tenLopHoc || 'N/A'}
                          </td>
                          <td className="px-4 py-3 font-mono font-bold text-slate-900">
                            {Number(inv.soTienPhaiTra).toLocaleString()} đ
                          </td>
                          <td className="px-4 py-3 font-mono font-bold text-emerald-700">
                            {Number(inv.soTienDaTra).toLocaleString()} đ
                          </td>
                          <td className="px-4 py-3 font-mono font-bold text-rose-700">
                            {remaining.toLocaleString()} đ
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-center">
                            <span
                              className={`inline-block whitespace-nowrap px-3 py-1 rounded-full text-[11px] font-bold border ${
                                inv.trangThai === 'DA_HOAN_THANH'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : inv.trangThai === 'THANH_TOAN_MOT_PHAN'
                                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                                  : 'bg-rose-50 text-rose-700 border-rose-200'
                              }`}
                            >
                              {formatTrangThaiHoaDon(inv.trangThai)}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            {remaining > 0 ? (
                              <button
                                onClick={() => handleOpenPayment(inv)}
                                className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold transition text-xs flex items-center space-x-1 ml-auto shadow-sm cursor-pointer"
                              >
                                <DollarSign className="w-3.5 h-3.5" />
                                <span>Thu Tiền</span>
                              </button>
                            ) : (
                              <span className="text-emerald-700 font-bold text-xs flex items-center justify-end">
                                <CheckCircle className="w-3.5 h-3.5 mr-1 text-emerald-600" />
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
                <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
                  <span>
                    Hiển thị {(page - 1) * limit + 1} - {Math.min(page * limit, totalInvoices)} / {totalInvoices} hóa đơn
                  </span>
                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-slate-900 disabled:opacity-30 transition cursor-pointer"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-2 font-bold text-slate-900">
                      {page} / {totalPages}
                    </span>
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page >= totalPages}
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

        {/* Modal Thu Tiền Tại Quầy */}
        {selectedInvoice && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4 text-slate-800">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                  <Receipt className="w-4 h-4 text-teal-600" />
                  <span>Phiếu Thu Học Phí Tại Quầy</span>
                </h3>
                <span className="font-mono text-xs text-teal-700 font-bold bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                  {selectedInvoice.maHoaDon}
                </span>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-xs">
                <p className="text-slate-600">
                  Học viên: <strong className="text-slate-900">{selectedInvoice.hocVien?.hoTen}</strong>
                </p>
                <p className="text-slate-600">
                  Lớp học: <strong className="text-teal-700">{selectedInvoice.dangKyHoc?.lopHoc?.tenLopHoc}</strong>
                </p>
                <div className="flex justify-between pt-2 border-t border-slate-200 font-semibold">
                  <span className="text-slate-600">Còn phải thu:</span>
                  <span className="text-rose-600 font-mono font-bold">
                    {(Number(selectedInvoice.soTienPhaiTra) - Number(selectedInvoice.soTienDaTra)).toLocaleString()} đ
                  </span>
                </div>
              </div>

              <form onSubmit={handleSubmitPayment} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Số Tiền Thu (VNĐ)</label>
                  <input
                    type="number"
                    required
                    min={1000}
                    max={Number(selectedInvoice.soTienPhaiTra) - Number(selectedInvoice.soTienDaTra)}
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(+e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono text-base font-black focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Phương Thức Thanh Toán</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-teal-500 font-bold cursor-pointer"
                  >
                    <option value="TIEN_MAT">💵 Tiền Mặt Tại Quầy</option>
                    <option value="CHUYEN_KHOAN">💳 Chuyển Khoản Ngân Hàng / Quét QR</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Ghi Chú Giao Dịch</label>
                  <input
                    type="text"
                    placeholder="VD: Đóng đợt 1 / Thu tiền mặt tại bàn tiếp nhận..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setSelectedInvoice(null)}
                    className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition cursor-pointer"
                  >
                    Hủy
                  </button>
                  <button type="submit" className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold shadow-md shadow-teal-600/20 cursor-pointer transition">
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
