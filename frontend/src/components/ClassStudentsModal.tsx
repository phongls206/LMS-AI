'use client';

import React, { useEffect, useState, useMemo } from 'react';
import {
  X,
  Users,
  Search,
  Download,
  Phone,
  Mail,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  CreditCard,
  GraduationCap,
  Sparkles,
  Copy,
  Check,
  Filter,
  UserCheck,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { classesService } from '../services/api';
import { formatStatus } from '../utils/formatters';

interface ClassStudentsModalProps {
  classId: number | null;
  onClose: () => void;
  initialClassName?: string;
  initialClassCode?: string;
}

export const ClassStudentsModal: React.FC<ClassStudentsModalProps> = ({
  classId,
  onClose,
  initialClassName,
  initialClassCode,
}) => {
  const [classDetail, setClassDetail] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'CONFIRMED' | 'PENDING' | 'PAID'>('ALL');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Đóng modal khi nhấn ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Khóa cuộn trang khi modal mở
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Fetch chi tiết lớp học & danh sách học viên
  useEffect(() => {
    if (!classId) return;

    let isMounted = true;
    const fetchClassStudents = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await classesService.getById(classId);
        if (isMounted) {
          setClassDetail(data);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.response?.data?.message || 'Không thể tải danh sách học viên của lớp này.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchClassStudents();

    return () => {
      isMounted = false;
    };
  }, [classId]);

  const enrollments: any[] = useMemo(() => {
    return classDetail?.dangKyHoc || [];
  }, [classDetail]);

  // Bộ lọc danh sách học viên
  const filteredEnrollments = useMemo(() => {
    let result = enrollments;

    // Lọc theo trạng thái
    if (statusFilter === 'CONFIRMED') {
      result = result.filter((dk) => dk.trangThai === 'DA_XAC_NHAN');
    } else if (statusFilter === 'PENDING') {
      result = result.filter((dk) => dk.trangThai === 'CHO_THANH_TOAN');
    } else if (statusFilter === 'PAID') {
      result = result.filter((dk) => dk.hoaDon?.trangThai === 'DA_HOAN_THANH');
    }

    // Lọc theo từ khóa tìm kiếm
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((dk) => {
        const hv = dk.hocVien || {};
        const ma = (hv.maHocVien || '').toLowerCase();
        const ten = (hv.hoTen || '').toLowerCase();
        const email = (hv.nguoiDung?.email || '').toLowerCase();
        const sdt = (hv.nguoiDung?.soDienThoai || '').toLowerCase();
        const cefr = (hv.trinhDoCEFR || '').toLowerCase();
        return ma.includes(q) || ten.includes(q) || email.includes(q) || sdt.includes(q) || cefr.includes(q);
      });
    }

    return result;
  }, [enrollments, searchQuery, statusFilter]);

  // Thống kê nhanh
  const stats = useMemo(() => {
    const total = enrollments.length;
    const confirmed = enrollments.filter((dk) => dk.trangThai === 'DA_XAC_NHAN').length;
    const pending = enrollments.filter((dk) => dk.trangThai === 'CHO_THANH_TOAN').length;
    const paid = enrollments.filter((dk) => dk.hoaDon?.trangThai === 'DA_HOAN_THANH').length;
    const maxCapacity = classDetail?.siSoToiDa || 25;
    const current = classDetail?.siSoHienTai ?? total;
    const fillPercent = Math.min(100, Math.round((current / maxCapacity) * 100));

    return { total, confirmed, pending, paid, maxCapacity, current, fillPercent };
  }, [enrollments, classDetail]);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 1800);
  };

  const handleExportCSV = () => {
    if (!classDetail || enrollments.length === 0) return;

    const headers = [
      'STT',
      'Mã Học Viên',
      'Họ Và Tên',
      'Giới Tính',
      'Trình Độ CEFR',
      'Số Điện Thoại',
      'Email',
      'Ngày Đăng Ký',
      'Trạng Thái Ghi Danh',
      'Trạng Thái Học Phí',
      'Số Tiền Phải Nộp',
      'Số Tiền Đã Đóng',
    ];

    const rows = enrollments.map((dk, index) => {
      const hv = dk.hocVien || {};
      const hd = dk.hoaDon || {};
      return [
        index + 1,
        hv.maHocVien || '',
        `"${(hv.hoTen || '').replace(/"/g, '""')}"`,
        hv.gioiTinh || '',
        hv.trinhDoCEFR || '',
        hv.nguoiDung?.soDienThoai || '',
        hv.nguoiDung?.email || '',
        dk.ngayDangKy ? new Date(dk.ngayDangKy).toLocaleDateString('vi-VN') : '',
        formatStatus(dk.trangThai),
        formatStatus(hd.trangThai || 'CHUA_THANH_TOAN'),
        hd.soTienPhaiTra ? Number(hd.soTienPhaiTra) : '',
        hd.soTienDaTra ? Number(hd.soTienDaTra) : '',
      ];
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Danh_Sach_Hoc_Vien_${classDetail.maLopHoc || 'LOP'}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Helper avatar initials
  const getInitials = (name: string) => {
    if (!name) return 'HV';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // Màu sắc badge CEFR - Đồng bộ bo góc rounded-lg
  const getCefrBadge = (level: string) => {
    switch (level) {
      case 'A1':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800';
      case 'A2':
        return 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/40 dark:text-teal-400 dark:border-teal-800';
      case 'B1':
        return 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-400 dark:border-sky-800';
      case 'B2':
        return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800';
      case 'C1':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-800';
      case 'C2':
        return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-800';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
    }
  };

  if (!classId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-5 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal Box: Cố định 82vh để màn hình 100% zoom xem full toàn bộ, không bị tràn footer */}
      <div className="relative w-full max-w-5xl bg-white dark:bg-[#0f172a] rounded-2xl shadow-2xl border border-slate-200/90 dark:border-slate-800 overflow-hidden flex flex-col h-[82vh] max-h-[82vh] z-10 animate-in zoom-in-95 duration-200">
        {/* Header - Thu gọn chiều cao, bo góc rounded-lg đồng bộ */}
        <div className="px-5 py-3.5 sm:px-6 sm:py-4 border-b border-slate-200/80 dark:border-slate-800 bg-gradient-to-r from-slate-50 via-white to-teal-50/30 dark:from-slate-900/90 dark:via-slate-900/50 dark:to-teal-950/20 shrink-0">
          <div className="flex items-start justify-between gap-3 sm:gap-4">
            <div className="space-y-1 flex-1 min-w-0">
              {/* Nhãn đồng bộ: Tất cả dùng rounded-lg */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs font-bold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 px-2.5 py-0.5 rounded-lg shadow-2xs">
                  {classDetail?.maLopHoc || initialClassCode || 'Đang tải...'}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-lg font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  {classDetail?.khoaHoc?.tenKhoaHoc || 'Lớp Học'}
                </span>
                {classDetail?.phanCong?.[0]?.giaoVien && (
                  <span className="text-xs px-2.5 py-0.5 rounded-lg font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                    GV: {classDetail.phanCong[0].giaoVien.hoTen}
                  </span>
                )}
                {classDetail?.trangThai && (
                  <span className="text-xs px-2.5 py-0.5 rounded-lg font-bold bg-teal-50 dark:bg-teal-950/50 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                    {formatStatus(classDetail.trangThai)}
                  </span>
                )}
              </div>

              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white truncate">
                {classDetail?.tenLopHoc || initialClassName || 'Danh Sách Học Viên Lớp Học'}
              </h2>

              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <span>Quản lý danh sách học viên đăng ký, trạng thái điểm danh và thanh toán học phí</span>
              </p>
            </div>

            {/* Nút đóng */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer shrink-0"
              title="Đóng cửa sổ (ESC)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Metrics Bar - Tinh gọn, đồng bộ rounded-lg */}
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5">
            {/* Metric 1: Sĩ số lấp đầy */}
            <div className="p-2 sm:p-2.5 rounded-lg bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs">
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Sĩ Số Lớp
                </span>
                <Users className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              </div>
              <div className="flex items-baseline justify-between gap-1">
                <div>
                  <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white">{stats.current}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400"> / {stats.maxCapacity} HV</span>
                </div>
                <span className="text-xs font-bold text-teal-600 dark:text-teal-400">
                  {stats.fillPercent}%
                </span>
              </div>
              <div className="w-full h-1 rounded-full bg-slate-100 dark:bg-slate-700 mt-1 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    stats.fillPercent >= 90
                      ? 'bg-rose-500'
                      : stats.fillPercent >= 60
                        ? 'bg-amber-500'
                        : 'bg-teal-500'
                  }`}
                  style={{ width: `${stats.fillPercent}%` }}
                />
              </div>
            </div>

            {/* Metric 2: Đã xác nhận */}
            <div className="p-2 sm:p-2.5 rounded-lg bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs">
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Đã Xác Nhận
                </span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="flex items-baseline justify-between gap-1">
                <div>
                  <span className="text-base sm:text-lg font-black text-emerald-600 dark:text-emerald-400">
                    {stats.confirmed}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400"> học viên</span>
                </div>
                <span className="text-[10px] text-slate-400 hidden sm:inline">Xếp lớp</span>
              </div>
            </div>

            {/* Metric 3: Chờ xử lý */}
            <div className="p-2 sm:p-2.5 rounded-lg bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs">
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Chờ Thanh Toán
                </span>
                <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="flex items-baseline justify-between gap-1">
                <div>
                  <span className="text-base sm:text-lg font-black text-amber-600 dark:text-amber-400">
                    {stats.pending}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400"> học viên</span>
                </div>
                <span className="text-[10px] text-slate-400 hidden sm:inline">Chờ phí</span>
              </div>
            </div>

            {/* Metric 4: Đã nộp học phí */}
            <div className="p-2 sm:p-2.5 rounded-lg bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs">
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Học Phí Đã Thu
                </span>
                <CreditCard className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex items-baseline justify-between gap-1">
                <div>
                  <span className="text-base sm:text-lg font-black text-blue-600 dark:text-blue-400">
                    {stats.paid}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400"> hoàn tất</span>
                </div>
                <span className="text-[10px] text-slate-400 hidden sm:inline">Đã đóng</span>
              </div>
            </div>
          </div>
        </div>

        {/* Toolbar: Search, Filters & Export - Tinh gọn, đồng bộ rounded-lg */}
        <div className="px-5 py-2.5 sm:px-6 sm:py-3 border-b border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0f172a] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-3 shrink-0">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm theo mã học viên, họ tên, email, số điện thoại..."
              className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg pl-9 pr-4 py-1.5 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-teal-500 dark:focus:border-teal-400 focus:ring-2 focus:ring-teal-500/10 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter Tabs & Export */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 shrink-0">
            <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-semibold">
              <button
                type="button"
                onClick={() => setStatusFilter('ALL')}
                className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                  statusFilter === 'ALL'
                    ? 'bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-300 shadow-xs font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Tất cả ({enrollments.length})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('CONFIRMED')}
                className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                  statusFilter === 'CONFIRMED'
                    ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 shadow-xs font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Xác nhận ({stats.confirmed})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('PENDING')}
                className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                  statusFilter === 'PENDING'
                    ? 'bg-white dark:bg-slate-700 text-amber-700 dark:text-amber-300 shadow-xs font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Chờ nộp ({stats.pending})
              </button>
            </div>

            {/* Nút Xuất CSV */}
            <button
              type="button"
              onClick={handleExportCSV}
              disabled={enrollments.length === 0}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 active:scale-95 text-white font-bold text-xs shadow-xs disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shrink-0"
              title="Xuất bảng danh sách học viên định dạng CSV / Excel"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Xuất CSV</span>
            </button>
          </div>
        </div>

        {/* Content Body - Cuộn mượt với min-h-0 */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          {loading ? (
            <div className="py-16 flex flex-col items-center justify-center space-y-3">
              <div className="w-7 h-7 border-3 border-teal-500/20 border-t-teal-600 rounded-full animate-spin"></div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Đang tải danh sách học viên của lớp...
              </p>
            </div>
          ) : error ? (
            <div className="py-12 px-4 text-center">
              <div className="w-10 h-10 rounded-lg bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 mx-auto flex items-center justify-center mb-2">
                <AlertCircle className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Không thể tải dữ liệu</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-3">{error}</p>
              <button
                type="button"
                onClick={() => setClassDetail(null)}
                className="px-3.5 py-1.5 bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-200"
              >
                Thử lại
              </button>
            </div>
          ) : filteredEnrollments.length === 0 ? (
            <div className="py-12 px-4 text-center">
              <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center mb-2">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                {searchQuery ? 'Không tìm thấy học viên phù hợp' : 'Lớp học chưa có học viên ghi danh'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                {searchQuery
                  ? `Không có kết quả nào cho "${searchQuery}". Vui lòng thử tìm từ khóa khác.`
                  : 'Lớp học này hiện tại chưa có học viên đăng ký hoặc ghi danh vào hệ thống.'}
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table View (>= sm) - Toàn bộ nhãn đồng bộ rounded-lg */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-50/95 dark:bg-slate-900/95 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[11px] sticky top-0 backdrop-blur-sm border-b border-slate-200/80 dark:border-slate-800 z-10">
                    <tr>
                      <th className="px-4 py-3 w-12 text-center">STT</th>
                      <th className="px-4 py-3">Học Viên</th>
                      <th className="px-4 py-3">Mã Học Viên</th>
                      <th className="px-4 py-3">Trình Độ</th>
                      <th className="px-4 py-3">Thông Tin Liên Hệ</th>
                      <th className="px-4 py-3">Ngày Ghi Danh</th>
                      <th className="px-4 py-3">Học Phí</th>
                      <th className="px-4 py-3 text-right">Trạng Thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredEnrollments.map((dk, idx) => {
                      const hv = dk.hocVien || {};
                      const hd = dk.hoaDon || {};
                      const initials = getInitials(hv.hoTen);
                      const email = hv.nguoiDung?.email;
                      const phone = hv.nguoiDung?.soDienThoai;

                      return (
                        <tr
                          key={dk.id || idx}
                          className="hover:bg-teal-50/30 dark:hover:bg-slate-800/50 transition-colors group"
                        >
                          {/* STT */}
                          <td className="px-4 py-2.5 text-center font-mono text-slate-400 group-hover:text-teal-600 font-semibold text-xs">
                            {String(idx + 1).padStart(2, '0')}
                          </td>

                          {/* Học Viên */}
                          <td className="px-4 py-2.5">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-teal-500 to-cyan-500 text-white font-black text-xs flex items-center justify-center shadow-2xs shrink-0">
                                {initials}
                              </div>
                              <div className="min-w-0">
                                <p className="font-bold text-slate-900 dark:text-white truncate group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors text-xs sm:text-sm">
                                  {hv.hoTen || 'Học viên'}
                                </p>
                                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                                  {hv.gioiTinh && (
                                    <span className="px-1.5 py-0.2 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold text-slate-600 dark:text-slate-300">
                                      {hv.gioiTinh}
                                    </span>
                                  )}
                                  {hv.trangThai && (
                                    <span className="text-[10px] text-slate-400">
                                      • {formatStatus(hv.trangThai)}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Mã Học Viên - Đồng bộ rounded-lg */}
                          <td className="px-4 py-2.5">
                            <div className="inline-flex items-center gap-1">
                              <span className="font-mono text-xs font-bold text-teal-700 dark:text-teal-300 bg-teal-50/80 dark:bg-teal-950/40 border border-teal-200/80 dark:border-teal-800/80 px-2 py-0.5 rounded-lg">
                                {hv.maHocVien || 'N/A'}
                              </span>
                              {hv.maHocVien && (
                                <button
                                  type="button"
                                  onClick={() => handleCopyCode(hv.maHocVien)}
                                  className="p-1 rounded-md text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                  title="Sao chép mã học viên"
                                >
                                  {copiedCode === hv.maHocVien ? (
                                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                                  ) : (
                                    <Copy className="w-3.5 h-3.5" />
                                  )}
                                </button>
                              )}
                            </div>
                          </td>

                          {/* Trình độ CEFR - ĐỒNG BỘ ROUNDED-LG (không dùng rounded-full) */}
                          <td className="px-4 py-2.5">
                            <span
                              className={`inline-block px-2.5 py-0.5 rounded-lg text-xs font-bold font-mono border ${getCefrBadge(
                                hv.trinhDoCEFR,
                              )}`}
                            >
                              {hv.trinhDoCEFR || 'Chưa test'}
                            </span>
                          </td>

                          {/* Thông Tin Liên Hệ */}
                          <td className="px-4 py-2.5">
                            <div className="space-y-0.5 text-xs">
                              {phone ? (
                                <a
                                  href={`tel:${phone}`}
                                  className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors font-mono"
                                >
                                  <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                                  <span>{phone}</span>
                                </a>
                              ) : (
                                <span className="text-slate-400 text-[11px] italic">Chưa có SĐT</span>
                              )}
                              {email && (
                                <a
                                  href={`mailto:${email}`}
                                  className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors truncate max-w-[190px]"
                                  title={email}
                                >
                                  <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                                  <span className="truncate">{email}</span>
                                </a>
                              )}
                            </div>
                          </td>

                          {/* Ngày Ghi Danh */}
                          <td className="px-4 py-2.5">
                            <span className="text-xs text-slate-600 dark:text-slate-300 font-mono flex items-center gap-1.5">
                              <Calendar className="w-3 h-3 text-slate-400" />
                              {dk.ngayDangKy ? new Date(dk.ngayDangKy).toLocaleDateString('vi-VN') : '—'}
                            </span>
                          </td>

                          {/* Trạng Thái Học Phí - ĐỒNG BỘ ROUNDED-LG (không dùng rounded-full) */}
                          <td className="px-4 py-2.5">
                            {hd?.trangThai === 'DA_HOAN_THANH' ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Đã hoàn thành</span>
                              </span>
                            ) : hd?.trangThai === 'THANH_TOAN_MOT_PHAN' ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-400 border border-sky-200 dark:border-sky-800">
                                <Clock className="w-3 h-3" />
                                <span>Nộp một phần</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                                <AlertCircle className="w-3 h-3" />
                                <span>Chưa thanh toán</span>
                              </span>
                            )}
                          </td>

                          {/* Trạng Thái Đăng Ký - Đồng bộ rounded-lg */}
                          <td className="px-4 py-2.5 text-right">
                            {dk.trangThai === 'DA_XAC_NHAN' ? (
                              <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                                Đã Xác Nhận
                              </span>
                            ) : dk.trangThai === 'CHO_THANH_TOAN' ? (
                              <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                                Chờ Đóng Phí
                              </span>
                            ) : (
                              <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                {formatStatus(dk.trangThai)}
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card List View (< sm) - Toàn bộ nhãn đồng bộ rounded-lg */}
              <div className="block sm:hidden p-3 space-y-3">
                {filteredEnrollments.map((dk, idx) => {
                  const hv = dk.hocVien || {};
                  const hd = dk.hoaDon || {};
                  const initials = getInitials(hv.hoTen);
                  const email = hv.nguoiDung?.email;
                  const phone = hv.nguoiDung?.soDienThoai;

                  return (
                    <div
                      key={dk.id || idx}
                      className="p-3.5 rounded-xl bg-slate-50/90 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-2.5 shadow-2xs"
                    >
                      {/* Top: Avatar, Name, Code, STT */}
                      <div className="flex items-start justify-between gap-2.5">
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-teal-500 to-cyan-500 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-2xs">
                            {initials}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <p className="font-bold text-slate-900 dark:text-white text-sm truncate">
                                {hv.hoTen || 'Học viên'}
                              </p>
                              {hv.gioiTinh && (
                                <span className="px-1.5 py-0.2 rounded-md bg-slate-200 dark:bg-slate-700 text-[10px] font-semibold text-slate-700 dark:text-slate-300">
                                  {hv.gioiTinh}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="font-mono text-xs font-bold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 px-1.5 py-0.2 rounded-lg">
                                {hv.maHocVien || 'N/A'}
                              </span>
                              {hv.maHocVien && (
                                <button
                                  type="button"
                                  onClick={() => handleCopyCode(hv.maHocVien)}
                                  className="p-0.5 rounded-md text-slate-400 hover:text-teal-600"
                                  title="Sao chép mã"
                                >
                                  {copiedCode === hv.maHocVien ? (
                                    <Check className="w-3 h-3 text-emerald-500" />
                                  ) : (
                                    <Copy className="w-3 h-3" />
                                  )}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                        <span className="font-mono text-[11px] font-bold text-slate-500 bg-slate-200/80 dark:bg-slate-700 px-2 py-0.5 rounded-lg shrink-0">
                          #{String(idx + 1).padStart(2, '0')}
                        </span>
                      </div>

                      {/* Badges: CEFR, Tuition Status, Registration Status - Đồng bộ rounded-lg */}
                      <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-slate-200/60 dark:border-slate-700/60 text-xs">
                        <span
                          className={`px-2 py-0.5 rounded-lg text-[11px] font-bold font-mono border ${getCefrBadge(
                            hv.trinhDoCEFR,
                          )}`}
                        >
                          CEFR: {hv.trinhDoCEFR || 'Chưa test'}
                        </span>
                        {hd?.trangThai === 'DA_HOAN_THANH' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Học phí đủ</span>
                          </span>
                        ) : hd?.trangThai === 'THANH_TOAN_MOT_PHAN' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-bold bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-400 border border-sky-200 dark:border-sky-800">
                            <Clock className="w-3 h-3" />
                            <span>Nộp 1 phần</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                            <AlertCircle className="w-3 h-3" />
                            <span>Chưa nộp phí</span>
                          </span>
                        )}
                        <span
                          className={`px-2 py-0.5 rounded-lg text-[11px] font-bold ${
                            dk.trangThai === 'DA_XAC_NHAN'
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                              : 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                          }`}
                        >
                          {formatStatus(dk.trangThai)}
                        </span>
                      </div>

                      {/* Contact links */}
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        {phone ? (
                          <a
                            href={`tel:${phone}`}
                            className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-mono active:scale-95 transition"
                          >
                            <Phone className="w-3 h-3 text-teal-600" />
                            <span>{phone}</span>
                          </a>
                        ) : (
                          <div className="text-[11px] text-slate-400 italic py-1 text-center bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                            Chưa có SĐT
                          </div>
                        )}
                        {email ? (
                          <a
                            href={`mailto:${email}`}
                            className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs truncate active:scale-95 transition"
                            title={email}
                          >
                            <Mail className="w-3 h-3 text-teal-600 shrink-0" />
                            <span className="truncate">{email}</span>
                          </a>
                        ) : (
                          <div className="text-[11px] text-slate-400 italic py-1 text-center bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                            Chưa có Email
                          </div>
                        )}
                      </div>

                      {/* Date */}
                      <div className="flex justify-between items-center text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200/50 dark:border-slate-700/50">
                        <span className="flex items-center gap-1 font-mono">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          Đăng ký: {dk.ngayDangKy ? new Date(dk.ngayDangKy).toLocaleDateString('vi-VN') : '—'}
                        </span>
                        {hv.trangThai && (
                          <span className="text-[10px] text-slate-400">{formatStatus(hv.trangThai)}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Modal Footer - Cố định hiển thị đầy đủ trên màn hình 100% */}
        <div className="px-5 py-2.5 sm:px-6 sm:py-3 border-t border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
            <span>
              Hiển thị <strong>{filteredEnrollments.length}</strong> / {enrollments.length} học viên trong lớp
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer text-xs shadow-2xs"
            >
              Đóng (ESC)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
