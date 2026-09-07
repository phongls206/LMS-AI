'use client';

import React, { useEffect, useState } from 'react';
import { AppLayout } from '../../../components/AppLayout';
import { enrollmentsService, usersService, classesService } from '../../../services/api';
import { HoaDon, HocVien, LopHoc } from '../../../types';
import {
  Receipt,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Plus,
  CreditCard,
  UserCheck,
  Download,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Eye,
  Printer,
  X,
  XCircle,
  AlertTriangle,
  RefreshCw,
  ArrowLeft,
  History,
} from 'lucide-react';
import { formatTrangThaiHoaDon, formatTrangThaiLopHoc, docSoThanhChu, formatReceiptDate } from '../../../utils/formatters';
import { useTableSort, SortIndicator } from '../../../utils/useTableSort';

export default function AdminFeesPage() {
  const [invoices, setInvoices] = useState<HoaDon[]>([]);
  const [students, setStudents] = useState<HocVien[]>([]);
  const [classes, setClasses] = useState<LopHoc[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<number>(1);
  const [selectedClassId, setSelectedClassId] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [submittingEnroll, setSubmittingEnroll] = useState(false);
  const [submittingPayment, setSubmittingPayment] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<HoaDon | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<'TIEN_MAT' | 'CHUYEN_KHOAN'>('TIEN_MAT');
  const [note, setNote] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Phân trang & Tìm kiếm hóa đơn
  const [searchInvoice, setSearchInvoice] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(8);

  const [refreshing, setRefreshing] = useState(false);

  // Modal Phiếu Thu Riêng Cho Đơn
  const [receiptData, setReceiptData] = useState<{
    invoice: HoaDon;
    selectedPayment?: any | null;
    paymentAmount: number;
    paymentMethod: 'TIEN_MAT' | 'CHUYEN_KHOAN';
    note: string;
    date: Date;
    soPhieu: string;
  } | null>(null);

  const fetchData = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    try {
      const [invList, stuRes, classList] = await Promise.all([
        enrollmentsService.getInvoices(),
        usersService.getStudents(1, 100),
        classesService.getAll(),
      ]);
      setInvoices(invList);
      setStudents(stuRes.data);
      // Lọc các lớp có thể ghi danh: Chỉ lớp đang mở tuyển sinh hoặc sắp mở và Khóa học đang hoạt động
      const enrollableClasses = (classList || []).filter(
        (c: LopHoc) =>
          (c.trangThai === 'DANG_MO_DANG_KY' || c.trangThai === 'SAP_MO') &&
          c.khoaHoc?.trangThai !== 'NGUNG_HOAT_DONG',
      );
      setClasses(enrollableClasses);
      if (stuRes.data.length > 0 && !selectedStudentId) setSelectedStudentId(stuRes.data[0].id);
      if (enrollableClasses.length > 0 && !selectedClassId) setSelectedClassId(enrollableClasses[0].id);
      else if (!selectedClassId) setSelectedClassId(0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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

  const {
    sortKey,
    sortOrder,
    toggleSort,
    sortedData: sortedInvoices,
  } = useTableSort(filteredInvoices, {
    valueExtractors: {
      maHoaDon: (inv) => inv.maHoaDon,
      hocVien: (inv) => inv.hocVien?.hoTen || '',
      lopHoc: (inv) => inv.dangKyHoc?.lopHoc?.tenLopHoc || '',
      soTienPhaiTra: (inv) => Number(inv.soTienPhaiTra || 0),
      soTienDaTra: (inv) => Number(inv.soTienDaTra || 0),
      conNo: (inv) => Number(inv.soTienPhaiTra || 0) - Number(inv.soTienDaTra || 0),
      trangThai: (inv) => inv.trangThai,
    },
  });

  const totalInvoices = filteredInvoices.length;
  const totalPages = Math.max(1, Math.ceil(totalInvoices / limit));
  const displayedInvoices = sortedInvoices.slice((page - 1) * limit, page * limit);

  useEffect(() => {
    setPage(1);
  }, [searchInvoice]);

  // ─── Xuất CSV Hóa Đơn Học Phí ────────────────────────────────────────────────
  const exportInvoicesCSV = () => {
    const headers = [
      'Mã Hóa Đơn',
      'Mã Học Viên',
      'Họ Tên Học Viên',
      'Mã Lớp',
      'Tên Lớp Học',
      'Học Phí Phải Trả (VNĐ)',
      'Đã Thanh Toán (VNĐ)',
      'Còn Nợ (VNĐ)',
      'Tỷ Lệ Đã Thanh Toán (%)',
      'Trạng Thái Hóa Đơn',
      'Ngày Lập',
    ];
    const rows = filteredInvoices.map((inv) => {
      const phaiTra = Number(inv.soTienPhaiTra ?? 0);
      const daTra = Number(inv.soTienDaTra ?? 0);
      const conNo = Math.max(0, phaiTra - daTra);
      const tiLe = phaiTra > 0 ? Math.round((daTra / phaiTra) * 100) : 0;
      const ngayLap = inv.ngayLap
        ? new Date(inv.ngayLap).toLocaleDateString('vi-VN')
        : inv.createdAt
        ? new Date(inv.createdAt).toLocaleDateString('vi-VN')
        : '';
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
    setSubmittingEnroll(true);
    setMessage(null);

    try {
      const res = await enrollmentsService.enroll(selectedStudentId, selectedClassId);
      setMessage({
        type: 'success',
        text: `Ghi danh thành công! Đã tạo hóa đơn ${res.invoice?.maHoaDon} với số tiền ${Number(
          res.invoice?.soTienPhaiTra,
        ).toLocaleString()} đ. Bạn có thể thu học phí ngay.`,
      });
      await fetchData();
      if (res.invoice) {
        handleOpenPayment(res.invoice);
      }
    } catch (err: any) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Lỗi ghi danh lớp học.',
      });
    } finally {
      setSubmittingEnroll(false);
    }
  };

  const handleOpenPayment = (inv: HoaDon) => {
    if (inv.trangThai === 'DA_HUY' || inv.dangKyHoc?.trangThai === 'DA_HUY') {
      alert('Không thể thu tiền cho hóa đơn hoặc đơn đăng ký đã bị hủy!');
      return;
    }
    setSelectedInvoice(inv);
    const remaining = Number(inv.soTienPhaiTra) - Number(inv.soTienDaTra);
    setPaymentAmount(remaining);
    setPaymentMethod('TIEN_MAT');
    setNote('');
  };

  const handleOpenReceipt = (inv: HoaDon, payment?: any | null) => {
    const isCancelled = inv.trangThai === 'DA_HUY' || inv.dangKyHoc?.trangThai === 'DA_HUY';
    const paid = Number(inv.soTienDaTra || 0);
    const targetPayment = payment || null;

    setReceiptData({
      invoice: inv,
      selectedPayment: targetPayment,
      paymentAmount: targetPayment ? Number(targetPayment.soTien) : paid,
      paymentMethod: targetPayment ? targetPayment.phuongThuc : 'TIEN_MAT',
      note: targetPayment
        ? targetPayment.ghiChu || 'Thanh toán học phí khóa học'
        : isCancelled
        ? 'Hóa đơn đã hủy bỏ theo đơn đăng ký học viên'
        : paid === 0
        ? 'Học phí chưa thanh toán'
        : 'Thanh toán học phí khóa học',
      date: targetPayment?.thoiGianThanhToan
        ? new Date(targetPayment.thoiGianThanhToan)
        : inv.ngayLap
        ? new Date(inv.ngayLap)
        : new Date(),
      soPhieu: targetPayment?.maGiaoDich || (isCancelled ? `HD-HUY-${inv.maHoaDon}` : `HD-${inv.maHoaDon}`),
    });
  };

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoice || submittingPayment) return;
    setSubmittingPayment(true);

    try {
      const paymentRes = await enrollmentsService.createPayment(selectedInvoice.id, {
        soTien: paymentAmount,
        phuongThuc: paymentMethod,
        ghiChu: note,
      });

      const soPhieu = paymentRes?.payment?.maGiaoDich || paymentRes?.maGiaoDich || `PT-${selectedInvoice.maHoaDon}`;
      const newPayment = paymentRes?.payment || {
        id: Date.now(),
        maGiaoDich: soPhieu,
        soTien: paymentAmount,
        phuongThuc: paymentMethod,
        ghiChu: note || 'Thu học phí tại quầy tiếp nhận',
        thoiGianThanhToan: new Date().toISOString(),
      };

      setReceiptData({
        invoice: {
          ...selectedInvoice,
          soTienDaTra: Number(selectedInvoice.soTienDaTra) + paymentAmount,
          thanhToan: [...(selectedInvoice.thanhToan || []), newPayment],
        },
        selectedPayment: newPayment,
        paymentAmount,
        paymentMethod,
        note: note || 'Thu học phí tại quầy tiếp nhận',
        date: new Date(),
        soPhieu,
      });

      setMessage({
        type: 'success',
        text: `Thu thành công ${paymentAmount.toLocaleString()} đ cho hóa đơn ${selectedInvoice.maHoaDon}! Đã xuất phiếu thu số ${soPhieu}.`,
      });
      setSelectedInvoice(null);
      setNote('');
      fetchData();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Lỗi ghi nhận thanh toán.' });
    } finally {
      setSubmittingPayment(false);
    }
  };

  return (
    <AppLayout
      allowedRoles={['QUAN_LY', 'TU_VAN_VIEN']}
      title="Quản Lý Học Phí & Thu Ngân"
      subtitle="Ghi danh học viên, theo dõi công nợ học phí, lập phiếu thu thanh toán nhiều đợt và tự động cập nhật trạng thái"
    >
      <div className="space-y-8">
        {message && (
          <div
            className={`p-3.5 rounded-xl text-xs flex items-center space-x-2 shadow-sm ${
              message.type === 'success'
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                : 'bg-rose-50 border border-rose-200 text-rose-800'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            )}
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
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-semibold focus:outline-none focus:border-teal-500"
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
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-semibold focus:outline-none focus:border-teal-500 disabled:opacity-60 cursor-pointer"
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
                disabled={submittingEnroll || classes.length === 0 || !selectedClassId}
                className="w-full py-2.5 bg-gradient-to-r from-teal-600 to-cyan-600 hover:opacity-95 text-white font-bold rounded-xl shadow-md shadow-teal-600/20 transition flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
              >
                <Receipt className="w-4 h-4" />
                <span>{submittingEnroll ? 'Đang Ghi Danh...' : 'Ghi Danh & Tạo Hóa Đơn'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* 2. Quầy thu tiền & Danh sách Hóa đơn có Tìm kiếm & Phân trang */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <CreditCard className="w-5 h-5 text-teal-600 shrink-0" />
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                2. Quầy Thu Học Phí & Lập Phiếu Thu
              </h3>
            </div>

            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
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
                onClick={() => fetchData(true)}
                disabled={refreshing}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#162032] hover:bg-teal-50 dark:hover:bg-teal-950/40 text-slate-700 dark:text-slate-200 hover:text-teal-700 dark:hover:text-teal-300 text-xs font-bold flex items-center space-x-1.5 border border-slate-200 dark:border-[#22324e] hover:border-teal-300 dark:hover:border-teal-700 transition cursor-pointer shadow-sm whitespace-nowrap disabled:opacity-50"
                title="Cập nhật nhanh dữ liệu mới nhất (không cần tải lại trang)"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-teal-600 dark:text-teal-400' : ''}`} />
                <span>{refreshing ? 'Đang tải...' : 'Làm mới'}</span>
              </button>
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
            <div className="py-20 flex justify-center items-center">
              <div className="w-8 h-8 border-4 border-teal-500/20 border-t-teal-600 rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-600 uppercase text-[11px] font-bold tracking-wider border-b border-slate-200">
                  <tr>
                    <th
                      onClick={() => toggleSort('maHoaDon')}
                      className="px-4 py-3 whitespace-nowrap cursor-pointer select-none hover:bg-slate-100 hover:text-teal-700 transition group"
                      title="Nhấn để sắp xếp theo Mã Hóa Đơn"
                    >
                      <div className="flex items-center space-x-1">
                        <span>Mã Hóa Đơn</span>
                        <SortIndicator sortKey="maHoaDon" activeKey={sortKey} sortOrder={sortOrder} />
                      </div>
                    </th>
                    <th
                      onClick={() => toggleSort('hocVien')}
                      className="px-4 py-3 whitespace-nowrap min-w-[150px] cursor-pointer select-none hover:bg-slate-100 hover:text-teal-700 transition group"
                      title="Nhấn để sắp xếp theo Học Viên"
                    >
                      <div className="flex items-center space-x-1">
                        <span>Học Viên</span>
                        <SortIndicator sortKey="hocVien" activeKey={sortKey} sortOrder={sortOrder} />
                      </div>
                    </th>
                    <th
                      onClick={() => toggleSort('lopHoc')}
                      className="px-4 py-3 min-w-[200px] cursor-pointer select-none hover:bg-slate-100 hover:text-teal-700 transition group"
                      title="Nhấn để sắp xếp theo Lớp Học"
                    >
                      <div className="flex items-center space-x-1">
                        <span>Lớp Học</span>
                        <SortIndicator sortKey="lopHoc" activeKey={sortKey} sortOrder={sortOrder} />
                      </div>
                    </th>
                    <th
                      onClick={() => toggleSort('soTienPhaiTra')}
                      className="px-4 py-3 whitespace-nowrap cursor-pointer select-none hover:bg-slate-100 hover:text-teal-700 transition group"
                      title="Nhấn để sắp xếp theo Phải Trả"
                    >
                      <div className="flex items-center space-x-1">
                        <span>Phải Trả</span>
                        <SortIndicator sortKey="soTienPhaiTra" activeKey={sortKey} sortOrder={sortOrder} />
                      </div>
                    </th>
                    <th
                      onClick={() => toggleSort('soTienDaTra')}
                      className="px-4 py-3 whitespace-nowrap cursor-pointer select-none hover:bg-slate-100 hover:text-teal-700 transition group"
                      title="Nhấn để sắp xếp theo Đã Thu"
                    >
                      <div className="flex items-center space-x-1">
                        <span>Đã Thu</span>
                        <SortIndicator sortKey="soTienDaTra" activeKey={sortKey} sortOrder={sortOrder} />
                      </div>
                    </th>
                    <th
                      onClick={() => toggleSort('conNo')}
                      className="px-4 py-3 whitespace-nowrap cursor-pointer select-none hover:bg-slate-100 hover:text-teal-700 transition group"
                      title="Nhấn để sắp xếp theo Còn Nợ"
                    >
                      <div className="flex items-center space-x-1">
                        <span>Còn Nợ</span>
                        <SortIndicator sortKey="conNo" activeKey={sortKey} sortOrder={sortOrder} />
                      </div>
                    </th>
                    <th
                      onClick={() => toggleSort('trangThai')}
                      className="px-4 py-3 whitespace-nowrap text-center min-w-[140px] cursor-pointer select-none hover:bg-slate-100 hover:text-teal-700 transition group"
                      title="Nhấn để sắp xếp theo Trạng Thái"
                    >
                      <div className="flex items-center justify-center space-x-1">
                        <span>Trạng Thái</span>
                        <SortIndicator sortKey="trangThai" activeKey={sortKey} sortOrder={sortOrder} />
                      </div>
                    </th>
                    <th className="px-4 py-3 whitespace-nowrap text-right min-w-[120px]">Thao Tác</th>
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
                      const isCancelled = inv.trangThai === 'DA_HUY' || inv.dangKyHoc?.trangThai === 'DA_HUY';
                      const remaining = isCancelled ? 0 : Math.max(0, Number(inv.soTienPhaiTra) - Number(inv.soTienDaTra));
                      return (
                        <tr key={inv.id} className="hover:bg-teal-50/30 transition">
                          <td className="px-4 py-3 font-mono font-bold text-teal-700 whitespace-nowrap">
                            <button
                              onClick={() => handleOpenReceipt(inv)}
                              className="font-mono font-bold text-teal-700 hover:underline cursor-pointer text-left"
                              title="Bấm để xem chi tiết hóa đơn & phiếu thu"
                            >
                              {inv.maHoaDon}
                            </button>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <p className="font-bold text-slate-900">{inv.hocVien?.hoTen}</p>
                            <p className="text-[11px] font-mono text-slate-500">{inv.hocVien?.maHocVien}</p>
                          </td>
                          <td className="px-4 py-3 text-slate-700 font-medium">
                            {inv.dangKyHoc?.lopHoc?.tenLopHoc || 'N/A'}
                          </td>
                          <td className="px-4 py-3 font-mono font-bold text-slate-900 whitespace-nowrap">
                            {Number(inv.soTienPhaiTra).toLocaleString()} đ
                          </td>
                          <td className="px-4 py-3 font-mono font-bold text-emerald-700 whitespace-nowrap">
                            {Number(inv.soTienDaTra).toLocaleString()} đ
                          </td>
                          <td className="px-4 py-3 font-mono font-bold whitespace-nowrap">
                            {isCancelled ? (
                              <span className="text-slate-400 italic text-[11px]">Đã hủy nợ</span>
                            ) : (
                              <span className="text-rose-700">{remaining.toLocaleString()} đ</span>
                            )}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-center">
                            <span
                              className={`inline-block whitespace-nowrap px-3 py-1 rounded-full text-[11px] font-bold border ${
                                isCancelled
                                  ? 'bg-slate-100 text-slate-600 border-slate-300'
                                  : inv.trangThai === 'DA_HOAN_THANH'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : inv.trangThai === 'THANH_TOAN_MOT_PHAN'
                                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                                  : 'bg-rose-50 text-rose-700 border-rose-200'
                              }`}
                            >
                              {isCancelled ? 'Đã Hủy Đăng Ký' : formatTrangThaiHoaDon(inv.trangThai)}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right whitespace-nowrap space-x-1.5 min-w-[120px]">
                            {/* Nút Xem Chi Tiết Hóa Đơn (Logo mắt nhỏ tinh gọn, không chữ) */}
                            <button
                              onClick={() => handleOpenReceipt(inv)}
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-teal-50 text-slate-600 hover:text-teal-600 border border-slate-200 transition cursor-pointer shadow-sm inline-flex items-center justify-center"
                              title="Xem chi tiết hóa đơn & in phiếu thu"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            {isCancelled ? (
                              <span className="text-slate-400 font-medium text-[11px] italic inline-flex items-center justify-end whitespace-nowrap px-1">
                                Khóa thu tiền
                              </span>
                            ) : remaining > 0 ? (
                              <button
                                onClick={() => handleOpenPayment(inv)}
                                className="px-2.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold transition text-xs inline-flex items-center space-x-1 shadow-sm cursor-pointer whitespace-nowrap"
                              >
                                <DollarSign className="w-3.5 h-3.5" />
                                <span>Thu Tiền</span>
                              </button>
                            ) : (
                              <span className="text-emerald-700 font-bold text-xs inline-flex items-center justify-end whitespace-nowrap">
                                <CheckCircle className="w-3.5 h-3.5 mr-1" />
                                Hoàn Tất
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
              {totalInvoices > 0 && (
                <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 bg-slate-50 border-t border-slate-200 gap-3 text-xs">
                  <div className="text-slate-500 font-medium">
                    Hiển thị <span className="font-bold text-slate-800">{(page - 1) * limit + 1}</span> đến{' '}
                    <span className="font-bold text-slate-800">
                      {Math.min(page * limit, totalInvoices)}
                    </span>{' '}
                    trong tổng số <span className="font-bold text-teal-700">{totalInvoices}</span> hóa đơn
                  </div>

                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() => setPage(1)}
                      disabled={page === 1}
                      className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-200 text-slate-600 disabled:opacity-30 disabled:hover:bg-transparent transition cursor-pointer"
                      title="Trang đầu"
                    >
                      <ChevronsLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-200 text-slate-600 disabled:opacity-30 disabled:hover:bg-transparent transition cursor-pointer"
                      title="Trang trước"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    <span className="px-3 py-1 font-bold text-slate-700 bg-white border border-slate-200 rounded-lg">
                      {page} / {totalPages}
                    </span>

                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-200 text-slate-600 disabled:opacity-30 disabled:hover:bg-transparent transition cursor-pointer"
                      title="Trang sau"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setPage(totalPages)}
                      disabled={page === totalPages}
                      className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-200 text-slate-600 disabled:opacity-30 disabled:hover:bg-transparent transition cursor-pointer"
                      title="Trang cuối"
                    >
                      <ChevronsRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Thu Tiền Tại Quầy */}
        {selectedInvoice && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
            <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4 text-slate-800">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                  <Receipt className="w-4 h-4 text-teal-600" />
                  <span>Phiếu Thu Học Phí Tại Quầy</span>
                </h3>
                <span className="font-mono text-xs text-teal-700 font-bold">
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
                <div className="flex justify-between pt-2 border-t border-slate-200 font-bold">
                  <span className="text-slate-600">Còn phải thu:</span>
                  <span className="text-rose-700 font-mono font-black">
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
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono text-base font-bold focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Phương Thức Thanh Toán</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-teal-500 font-bold"
                  >
                    <option value="TIEN_MAT">💵 Tiền Mặt Tại Quầy</option>
                    <option value="CHUYEN_KHOAN">💳 Chuyển Khoản Ngân Hàng / Quét QR</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Ghi Chú Giao Dịch</label>
                  <input
                    type="text"
                    placeholder="VD: Thu tiền mặt / Đặt cọc..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setSelectedInvoice(null)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition cursor-pointer"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={submittingPayment}
                    className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold shadow-sm transition cursor-pointer disabled:opacity-50"
                  >
                    {submittingPayment ? 'Đang Ghi Nhận Thu Tiền...' : 'Xác Nhận & Xuất Phiếu Thu'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Chi Tiết Hóa Đơn / Phiếu Thu Học Phí Riêng Cho Đơn */}
        {receiptData && (() => {
          const isCancelled = receiptData.invoice.trangThai === 'DA_HUY' || receiptData.invoice.dangKyHoc?.trangThai === 'DA_HUY';
          const totalFee = Number(receiptData.invoice.soTienPhaiTra || 0);
          const totalPaid = Number(receiptData.invoice.soTienDaTra || 0);
          const remaining = Math.max(0, totalFee - totalPaid);
          const isUnpaid = !isCancelled && totalPaid === 0 && (!receiptData.selectedPayment || Number(receiptData.selectedPayment.soTien || 0) === 0);

          // Danh sách các lần nộp tiền (payments list)
          const paymentsList: any[] = (receiptData.invoice.thanhToan && receiptData.invoice.thanhToan.length > 0)
            ? receiptData.invoice.thanhToan
            : totalPaid > 0
            ? [{
                id: receiptData.invoice.id,
                maGiaoDich: `PT-${receiptData.invoice.maHoaDon}`,
                soTien: totalPaid,
                phuongThuc: receiptData.paymentMethod || 'TIEN_MAT',
                ghiChu: receiptData.note || 'Thanh toán học phí khóa học',
                thoiGianThanhToan: receiptData.date || receiptData.invoice.ngayLap || receiptData.invoice.createdAt,
                nguoiThu: null,
              }]
            : [];

          const viewingSingleReceipt = !!receiptData.selectedPayment;

          return (
            <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50 overflow-y-auto animate-fadeIn">
              <div className="bg-white dark:bg-[#141c2e] border border-slate-200 dark:border-[#1e2d45] rounded-2xl w-full max-w-2xl shadow-2xl p-4 sm:p-5 space-y-3 text-slate-800 dark:text-slate-100 my-auto max-h-[96vh] overflow-y-auto">
                {/* Header Modal Bar (ẩn khi in - Không để nút in trùng lặp ở đây) */}
                <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-800 print:hidden">
                  <div className="flex items-center space-x-2 font-bold text-xs sm:text-sm">
                    {isCancelled ? (
                      <span className="text-rose-600 dark:text-rose-400 flex items-center space-x-1.5">
                        <XCircle className="w-4 h-4" />
                        <span>CHI TIẾT HÓA ĐƠN ĐÃ HỦY (KHÔNG PHÁT SINH THU TIỀN)</span>
                      </span>
                    ) : isUnpaid ? (
                      <span className="text-amber-600 dark:text-amber-400 flex items-center space-x-1.5">
                        <Receipt className="w-4 h-4" />
                        <span>HÓA ĐƠN HỌC PHÍ (CHỜ THANH TOÁN)</span>
                      </span>
                    ) : viewingSingleReceipt ? (
                      <span className="text-teal-600 dark:text-teal-400 flex items-center space-x-1.5">
                        <Receipt className="w-4 h-4" />
                        <span>PHIẾU THU HỌC PHÍ — SỐ: {receiptData.soPhieu}</span>
                      </span>
                    ) : (
                      <span className="text-teal-600 dark:text-teal-400 flex items-center space-x-1.5">
                        <History className="w-4 h-4" />
                        <span>BẢNG KÊ HÓA ĐƠN & LỊCH SỬ NỘP TIỀN</span>
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setReceiptData(null)}
                      className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
                      title="Đóng cửa sổ"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Thanh điều hướng quay lại bảng kê tổng hợp nếu đang xem phiếu thu đơn lẻ */}
                {viewingSingleReceipt && !isCancelled && (
                  <div className="print:hidden">
                    <button
                      onClick={() => setReceiptData((prev) => (prev ? { ...prev, selectedPayment: null } : null))}
                      className="w-full py-1.5 px-3 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 hover:bg-teal-100 dark:hover:bg-teal-900/60 font-bold text-xs flex items-center justify-center space-x-1.5 border border-teal-200 dark:border-teal-800 transition cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Quay lại Bảng Kê Hóa Đơn & Lịch Sử Nộp Tiền</span>
                    </button>
                  </div>
                )}

                {/* PHẦN NỘI DUNG PHIẾU THU / HÓA ĐƠN (Printable Container) */}
                <div id="etc-printable-receipt" className="space-y-3 p-4 sm:p-5 rounded-xl bg-slate-50/70 dark:bg-[#0f172a] border border-slate-200/90 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-sans print:border-none print:p-0 print:bg-white print:text-black">
                  {/* Header trung tâm */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-2.5 border-b-2 border-slate-300 dark:border-slate-700 gap-2">
                    <div>
                      <h2 className="text-sm sm:text-base font-black text-teal-700 dark:text-teal-400 uppercase tracking-wide">
                        TRUNG TÂM NGOẠI NGỮ QUỐC TẾ ETC
                      </h2>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        📍 Tổ 1, P. Phan Đình Phùng, Thái Nguyên • ☎️ Hotline: 0787304341
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        ✉️ Email: lehongphong2108@outlook.com • 🌐 Website: https://etcedu.vercel.app
                      </p>
                    </div>
                    <div className="text-left sm:text-right text-xs shrink-0">
                      <p className="font-bold text-slate-700 dark:text-slate-300">
                        Mẫu số: <span className="font-mono">01-TT/ETC</span>
                      </p>
                      <p className="font-mono text-teal-700 dark:text-teal-400 font-bold mt-0.5">
                        Số: {viewingSingleReceipt ? receiptData.soPhieu : `HD-${receiptData.invoice.maHoaDon}`}
                      </p>
                    </div>
                  </div>

                  {/* Tiêu đề phiếu */}
                  <div className="text-center space-y-1">
                    {isCancelled ? (
                      <div>
                        <span className="inline-block px-3 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-400 font-bold text-xs uppercase tracking-wider mb-1">
                          ✕ ĐƠN ĐĂNG KÝ ĐÃ BỊ HỦY BỎ
                        </span>
                        <h1 className="text-lg sm:text-xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-wider">
                          CHI TIẾT HÓA ĐƠN (ĐÃ HỦY)
                        </h1>
                      </div>
                    ) : isUnpaid ? (
                      <div>
                        <span className="inline-block px-3 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300 font-bold text-xs uppercase tracking-wider mb-1">
                          ⏳ CHỜ NỘP HỌC PHÍ
                        </span>
                        <h1 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white uppercase tracking-wider">
                          THÔNG BÁO NỘP HỌC PHÍ
                        </h1>
                      </div>
                    ) : viewingSingleReceipt ? (
                      <div>
                        <h1 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white uppercase tracking-wider">
                          PHIẾU THU HỌC PHÍ
                        </h1>
                        <p className="text-[11px] font-medium text-teal-600 dark:text-teal-400">
                          (Số phiếu: {receiptData.soPhieu})
                        </p>
                      </div>
                    ) : (
                      <div>
                        <h1 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white uppercase tracking-wider">
                          BẢNG KÊ HÓA ĐƠN & TIẾN ĐỘ NỘP TIỀN
                        </h1>
                        <p className="text-[11px] font-medium text-teal-600 dark:text-teal-400">
                          (Hóa đơn mã: {receiptData.invoice.maHoaDon})
                        </p>
                      </div>
                    )}
                    <p className="text-[11px] italic text-slate-500 dark:text-slate-400">
                      {formatReceiptDate(receiptData.date)}
                    </p>
                  </div>

                  {/* Thông tin học viên & lớp */}
                  <div className="space-y-1.5 text-xs text-slate-800 dark:text-slate-200">
                    <div className="flex flex-col sm:flex-row sm:justify-between py-0.5 border-b border-dashed border-slate-200 dark:border-slate-800">
                      <span className="text-slate-500 dark:text-slate-400">Họ và tên học viên:</span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {receiptData.invoice.hocVien?.hoTen || 'Học viên'} (Mã HV: {receiptData.invoice.hocVien?.maHocVien})
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:justify-between py-0.5 border-b border-dashed border-slate-200 dark:border-slate-800">
                      <span className="text-slate-500 dark:text-slate-400">Lớp học đăng ký:</span>
                      <span className="font-bold text-teal-700 dark:text-teal-400">
                        {receiptData.invoice.dangKyHoc?.lopHoc?.tenLopHoc} ({receiptData.invoice.dangKyHoc?.lopHoc?.maLopHoc})
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:justify-between py-0.5 border-b border-dashed border-slate-200 dark:border-slate-800">
                      <span className="text-slate-500 dark:text-slate-400">Trạng thái đăng ký:</span>
                      <span className={`font-bold ${isCancelled ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-white'}`}>
                        {isCancelled ? 'Đã Hủy Đăng Ký (Không còn hiệu lực)' : 'Đang Tham Gia Lớp Học'}
                      </span>
                    </div>

                    {/* TH1: Hóa đơn đã hủy */}
                    {isCancelled && (
                      <div className="mt-2 space-y-2">
                        <div className="p-3 rounded-xl bg-white dark:bg-[#141c2e] border border-slate-200 dark:border-slate-700 space-y-1.5">
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-500 dark:text-slate-400">Học phí niêm yết ban đầu:</span>
                            <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                              {totalFee.toLocaleString()} đ
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 pt-1 border-t border-slate-100 dark:border-slate-800">
                            <span>SỐ TIỀN THỰC TẾ ĐÃ THU:</span>
                            <span className="font-mono text-sm sm:text-base font-bold text-emerald-600 dark:text-emerald-400">
                              0 đ (Chưa thu tiền)
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-[11px] pt-1 border-t border-slate-100 dark:border-slate-800">
                            <span className="text-slate-500 dark:text-slate-400">Nghĩa vụ công nợ hiện tại:</span>
                            <span className="font-bold font-mono text-slate-400 dark:text-slate-500">
                              0 đ (ĐÃ HỦY NỢ HOÀN TOÀN)
                            </span>
                          </div>
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-xs">
                          ℹ️ <strong>Lưu ý nghiệp vụ:</strong> Đăng ký lớp học này đã bị hủy trước khi nộp học phí. Hóa đơn không còn giá trị thu tiền, không phát sinh phiếu thu và toàn bộ công nợ đã được hủy bỏ.
                        </div>
                      </div>
                    )}

                    {/* TH2: Hóa đơn chưa nộp tiền */}
                    {isUnpaid && (
                      <div className="mt-2 space-y-2">
                        <div className="p-3 rounded-xl bg-white dark:bg-[#141c2e] border border-slate-200 dark:border-slate-700 space-y-1.5">
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-500 dark:text-slate-400">Tổng học phí khóa học:</span>
                            <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                              {totalFee.toLocaleString()} đ
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-rose-600 dark:text-rose-400 pt-1 border-t border-slate-100 dark:border-slate-800">
                            <span>SỐ TIỀN CẦN NỘP:</span>
                            <span className="font-mono text-sm sm:text-base font-black">
                              {totalFee.toLocaleString()} đ
                            </span>
                          </div>
                          <p className="text-[11px] italic text-slate-600 dark:text-slate-400 pt-0.5">
                            (Viết bằng chữ: <strong className="text-slate-800 dark:text-slate-200">{docSoThanhChu(totalFee)}</strong>)
                          </p>
                          <div className="flex justify-between items-center text-[11px] pt-1 border-t border-slate-100 dark:border-slate-800">
                            <span className="text-slate-500 dark:text-slate-400">Tình trạng thanh toán:</span>
                            <span className="font-bold font-mono text-rose-600 dark:text-rose-400">
                              CHƯA THANH TOÁN (CÒN NỢ: {totalFee.toLocaleString()} đ)
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* TH3: Xem một Phiếu Thu Cụ Thể (Khi thu tiền xong hoặc chọn 1 đợt) */}
                    {!isCancelled && !isUnpaid && viewingSingleReceipt && (
                      <div className="mt-2 space-y-2">
                        <div className="flex flex-col sm:flex-row sm:justify-between py-0.5 border-b border-dashed border-slate-200 dark:border-slate-800">
                          <span className="text-slate-500 dark:text-slate-400">Phương thức thanh toán:</span>
                          <span className="font-bold text-slate-800 dark:text-slate-200">
                            {receiptData.paymentMethod === 'CHUYEN_KHOAN' ? 'Chuyển Khoản Ngân Hàng' : 'Tiền Mặt'}
                          </span>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:justify-between py-0.5 border-b border-dashed border-slate-200 dark:border-slate-800">
                          <span className="text-slate-500 dark:text-slate-400">Nội dung / Ghi chú:</span>
                          <span className="font-bold text-teal-700 dark:text-teal-400">
                            {receiptData.note || 'Thanh toán học phí khóa học'}
                          </span>
                        </div>

                        <div className="p-3 rounded-xl bg-white dark:bg-[#141c2e] border border-slate-200 dark:border-slate-700 space-y-1.5">
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-500 dark:text-slate-400">Tổng học phí khóa học:</span>
                            <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                              {totalFee.toLocaleString()} đ
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-teal-700 dark:text-teal-400 pt-1 border-t border-slate-100 dark:border-slate-800">
                            <span>SỐ TIỀN THỰC THU:</span>
                            <span className="font-mono text-sm sm:text-base font-black">
                              {Number(receiptData.paymentAmount).toLocaleString()} đ
                            </span>
                          </div>
                          <p className="text-[11px] italic text-slate-600 dark:text-slate-400 pt-0.5">
                            (Viết bằng chữ: <strong className="text-slate-800 dark:text-slate-200">{docSoThanhChu(receiptData.paymentAmount)}</strong>)
                          </p>
                          <div className="flex justify-between items-center text-[11px] pt-1 border-t border-slate-100 dark:border-slate-800">
                            <span className="text-slate-500 dark:text-slate-400">Tình trạng công nợ sau thanh toán:</span>
                            <span className={`font-bold font-mono ${remaining === 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                              {remaining === 0
                                ? 'ĐÃ THANH TOÁN ĐỦ (0 đ)'
                                : `CÒN NỢ: ${remaining.toLocaleString()} đ`}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* TH4: Xem Bảng Kê Tổng Hợp Hóa Đơn & Lịch Sử Từng Lần Nộp Kèm Ghi Chú */}
                    {!isCancelled && !isUnpaid && !viewingSingleReceipt && (
                      <div className="mt-2 space-y-3">
                        {/* Hộp tóm tắt tổng quan hóa đơn */}
                        <div className="p-3 rounded-xl bg-white dark:bg-[#141c2e] border border-slate-200 dark:border-slate-700 space-y-1.5">
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-500 dark:text-slate-400">Tổng học phí khóa học:</span>
                            <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                              {totalFee.toLocaleString()} đ
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 pt-1 border-t border-slate-100 dark:border-slate-800">
                            <span>TỔNG TIỀN ĐÃ NỘP:</span>
                            <span className="font-mono text-sm sm:text-base font-black">
                              {totalPaid.toLocaleString()} đ
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-[11px] pt-1 border-t border-slate-100 dark:border-slate-800">
                            <span className="text-slate-500 dark:text-slate-400">Công nợ hiện tại:</span>
                            <span className={`font-bold font-mono ${remaining === 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                              {remaining === 0
                                ? 'ĐÃ THANH TOÁN TOÀN BỘ (0 đ)'
                                : `CÒN NỢ: ${remaining.toLocaleString()} đ`}
                            </span>
                          </div>
                        </div>

                        {/* Lịch Sử Chi Tiết Từng Lần Nộp Tiền & Ghi Chú */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between pb-1 border-b border-slate-200 dark:border-slate-800">
                            <div className="flex items-center space-x-1.5 font-bold text-xs uppercase text-teal-800 dark:text-teal-300">
                              <History className="w-3.5 h-3.5 text-teal-600" />
                              <span>Lịch Sử Các Lần Nộp Tiền</span>
                            </div>
                            <span className="text-[10px] text-slate-400 print:hidden">
                              Click để xem/in phiếu thu riêng
                            </span>
                          </div>

                          {paymentsList.length === 0 ? (
                            <p className="text-xs italic text-slate-400 py-2 text-center">Chưa phát sinh lần nộp tiền nào.</p>
                          ) : (
                            <div className="space-y-2">
                              {paymentsList.map((pm, idx) => (
                                <div
                                  key={pm.id || idx}
                                  className="p-2.5 rounded-xl bg-white dark:bg-[#141c2e] border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-1.5"
                                >
                                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-1">
                                    <div className="flex items-center space-x-2">
                                      <Receipt className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
                                      <span className="font-mono font-bold text-xs text-slate-700 dark:text-slate-300">
                                        {pm.maGiaoDich || `PT-${idx + 1}`}
                                      </span>
                                      <span className="text-[11px] text-slate-400">
                                        • {pm.thoiGianThanhToan ? new Date(pm.thoiGianThanhToan).toLocaleString('vi-VN') : 'Mới nộp'}
                                      </span>
                                    </div>
                                    <div className="flex items-center justify-between sm:justify-end space-x-2">
                                      <span className="font-mono font-black text-xs text-emerald-600 dark:text-emerald-400">
                                        +{Number(pm.soTien).toLocaleString()} đ
                                      </span>
                                      {/* Nút Xem Phiếu Thu (Ẩn khi in) */}
                                      <button
                                        type="button"
                                        onClick={() =>
                                          setReceiptData({
                                            ...receiptData,
                                            selectedPayment: pm,
                                            paymentAmount: Number(pm.soTien),
                                            paymentMethod: pm.phuongThuc || 'TIEN_MAT',
                                            note: pm.ghiChu || 'Thanh toán học phí',
                                            soPhieu: pm.maGiaoDich || `PT-${pm.id}`,
                                            date: pm.thoiGianThanhToan ? new Date(pm.thoiGianThanhToan) : new Date(),
                                          })
                                        }
                                        className="px-2 py-1 rounded-lg bg-teal-50 dark:bg-teal-950/50 hover:bg-teal-100 dark:hover:bg-teal-900 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 text-[10px] font-bold transition cursor-pointer flex items-center space-x-1 print:hidden"
                                        title="Xem và in phiếu thu này"
                                      >
                                        <Eye className="w-3 h-3" />
                                        <span>Xem Phiếu Thu</span>
                                      </button>
                                    </div>
                                  </div>

                                  {/* Ghi chú từng lần nộp */}
                                  <div className="text-[11px] bg-slate-50 dark:bg-slate-900/50 p-1.5 rounded-lg border border-slate-100 dark:border-slate-800/60 flex flex-wrap items-center justify-between gap-1">
                                    <div>
                                      <span className="text-slate-500 dark:text-slate-400 font-medium">Ghi chú: </span>
                                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                                        {pm.ghiChu || 'Không có ghi chú thêm'}
                                      </span>
                                    </div>
                                    <div className="text-[10px] text-slate-400">
                                      Hình thức: <strong className="text-slate-600 dark:text-slate-300">{pm.phuongThuc === 'CHUYEN_KHOAN' ? 'Chuyển khoản' : 'Tiền mặt'}</strong>
                                      {pm.nguoiThu?.hoTen && (
                                        <span className="ml-2">• Thủ quỹ: <strong className="text-slate-600 dark:text-slate-300">{pm.nguoiThu.hoTen}</strong></span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Ký tên */}
                  <div className="grid grid-cols-2 gap-3 pt-2.5 text-center text-xs">
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-200 uppercase">Học Viên / Người Nộp</p>
                      <p className="text-[10px] text-slate-400 italic">(Ký và ghi rõ họ tên)</p>
                      <div className="h-9 flex items-end justify-center font-semibold text-slate-700 dark:text-slate-300">
                        {receiptData.invoice.hocVien?.hoTen}
                      </div>
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-200 uppercase">Người Lập Phiếu / Thủ Quỹ</p>
                      <p className="text-[10px] text-slate-400 italic">(Ký và ghi rõ họ tên)</p>
                      <div className="h-9 flex items-end justify-center font-semibold text-teal-700 dark:text-teal-400">
                        {receiptData.selectedPayment?.nguoiThu?.hoTen || 'Bộ phận Tài vụ ETC'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer modal buttons (ẩn khi in) - NÚT IN DUY NHẤT ĐƯỢC ĐẶT Ở ĐÂY */}
                <div className="flex justify-between items-center pt-1 print:hidden text-[11px]">
                  <span className="text-slate-400 text-[10px] sm:text-[11px]">
                    Dữ liệu hóa đơn được lưu trữ bảo mật trên hệ thống LMS ETC
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setReceiptData(null)}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold transition cursor-pointer"
                    >
                      Đóng
                    </button>
                    {!isCancelled && (
                      <button
                        onClick={() => window.print()}
                        className="px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center space-x-1.5 shadow-sm transition cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>
                          {isUnpaid
                            ? 'In Báo Học Phí'
                            : viewingSingleReceipt
                            ? 'In Phiếu Thu'
                            : 'In Bảng Kê Hóa Đơn'}
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    </AppLayout>
  );
}
