'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { AppLayout } from '../../../components/AppLayout';
import { statisticsService, classesService, usersService, enrollmentsService } from '../../../services/api';
import {
  BarChart3,
  TrendingUp,
  Award,
  DollarSign,
  Users,
  GraduationCap,
  Download,
  Printer,
  Calendar,
  Layers,
  PieChart,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  CreditCard,
  Building2,
  BookOpen,
  Search,
  X,
  Eye,
  Filter,
  Info,
  Check,
  ChevronRight,
  ExternalLink,
  RefreshCw,
} from 'lucide-react';
import Link from 'next/link';
import {
  formatTrangThaiHocVien,
  formatTrangThaiLopHoc,
  formatTrangThaiHoaDon,
  formatCSVDate,
  formatCSVDateTime,
} from '../../../utils/formatters';

type TabType = 'overview' | 'students_cefr' | 'classes_fill';

export default function AdminReportsPage() {
  const [stats, setStats] = useState<any>(null);
  const [classes, setClasses] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  // Drill-down Modal State
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    title: string;
    subtitle: string;
    badgeText: string;
    badgeColor: string;
    type: 'grades' | 'students';
    data: any[];
  }>({
    isOpen: false,
    title: '',
    subtitle: '',
    badgeText: '',
    badgeColor: 'emerald',
    type: 'grades',
    data: [],
  });

  const [modalSearch, setModalSearch] = useState('');
  const [modalClassFilter, setModalClassFilter] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async (isManual = false) => {
    try {
      if (isManual) setRefreshing(true);
      else setLoading(true);

      const [statsData, classesData, studentsData, invoicesData, paymentsData] = await Promise.all([
        statisticsService.getDashboard().catch(() => null),
        classesService.getAll().catch(() => []),
        usersService.getStudents(1, 200).catch(() => ({ data: [] })),
        enrollmentsService.getInvoices().catch(() => []),
        enrollmentsService.getPayments().catch(() => []),
      ]);

      setStats(statsData);
      setClasses(Array.isArray(classesData) ? classesData : []);
      const studentList = Array.isArray(studentsData)
        ? studentsData
        : studentsData?.data || studentsData?.items || [];
      setStudents(studentList);
      setInvoices(Array.isArray(invoicesData) ? invoicesData : []);
      setPayments(Array.isArray(paymentsData) ? paymentsData : []);
    } catch (err) {
      console.error('Lỗi khi tải dữ liệu báo cáo:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Tính toán số liệu tài chính chuyên sâu
  const financeMetrics = useMemo(() => {
    const totalBilled = invoices.reduce((sum, inv) => sum + Number(inv.soTienPhaiTra || 0), 0);
    const totalCollected = invoices.reduce((sum, inv) => sum + Number(inv.soTienDaTra || 0), 0);
    const totalDebt = Math.max(0, totalBilled - totalCollected);
    const collectionRate = totalBilled > 0 ? ((totalCollected / totalBilled) * 100).toFixed(1) : '0.0';

    // Cơ cấu thanh toán
    const bankPayments = payments
      .filter((p) => p.phuongThuc === 'CHUYEN_KHOAN')
      .reduce((sum, p) => sum + Number(p.soTien || 0), 0);
    const cashPayments = payments
      .filter((p) => p.phuongThuc === 'TIEN_MAT')
      .reduce((sum, p) => sum + Number(p.soTien || 0), 0);
    const totalPaymentSum = bankPayments + cashPayments;

    const bankPercent = totalPaymentSum > 0 ? Math.round((bankPayments / totalPaymentSum) * 100) : 0;
    const cashPercent = totalPaymentSum > 0 ? 100 - bankPercent : 0;

    return {
      totalBilled,
      totalCollected,
      totalDebt,
      collectionRate,
      bankPayments,
      cashPayments,
      bankPercent,
      cashPercent,
    };
  }, [invoices, payments]);

  // Phân bổ trình độ học viên theo khung CEFR (Phản ứng tức thì theo CSDL)
  const cefrDistribution = useMemo(() => {
    // 1. Ưu tiên số liệu trực tiếp từ Backend Stats (tính toán toàn diện từ CSDL)
    if (stats?.phanBoCEFR && Array.isArray(stats.phanBoCEFR) && stats.phanBoCEFR.length > 0) {
      return stats.phanBoCEFR;
    }

    // 2. Dự phòng tính toán trực tiếp từ mảng students
    const counts: Record<string, number> = { A1: 0, A2: 0, B1: 0, B2: 0, C1: 0, C2: 0 };
    students.forEach((s) => {
      const level = s.trinhDoCEFR || s.hoSoHocVien?.trinhDoCEFR || 'B1';
      if (counts[level] !== undefined) counts[level]++;
      else counts['B1']++;
    });

    const total = students.length || 1;
    return Object.entries(counts).map(([level, count]) => ({
      level,
      count,
      percent: Math.round((count / total) * 100),
    }));
  }, [stats, students]);

  // Cơ cấu trạng thái học viên (Phản ứng tức thì theo CSDL)
  const studentStatusMetrics = useMemo(() => {
    // 1. Ưu tiên số liệu trực tiếp từ Backend Stats
    if (stats?.coCauTrangThaiHocVien && Array.isArray(stats.coCauTrangThaiHocVien) && stats.coCauTrangThaiHocVien.length > 0) {
      return stats.coCauTrangThaiHocVien;
    }

    // 2. Dự phòng tính toán từ mảng students
    const total = students.length || 1;
    const dangHoc = students.filter((s) => (s.trangThai || s.trangThaiHoc) === 'DANG_HOC').length;
    const hoanThanh = students.filter((s) => ['DA_TOT_NGHIEP', 'HOAN_THANH'].includes(s.trangThai || s.trangThaiHoc)).length;
    const baoLuu = students.filter((s) => (s.trangThai || s.trangThaiHoc) === 'BAO_LUU').length;
    const thoiHoc = students.filter((s) => ['NGHI_HOC', 'THOI_HOC'].includes(s.trangThai || s.trangThaiHoc)).length;

    return [
      { label: 'Đang Theo Học', count: dangHoc, percent: Math.round((dangHoc / total) * 100), color: 'bg-teal-500', text: 'text-teal-700' },
      { label: 'Đã Hoàn Thành Khóa', count: hoanThanh, percent: Math.round((hoanThanh / total) * 100), color: 'bg-emerald-500', text: 'text-emerald-700' },
      { label: 'Đang Bảo Lưu', count: baoLuu, percent: Math.round((baoLuu / total) * 100), color: 'bg-amber-500', text: 'text-amber-700' },
      { label: 'Đã Thôi Học', count: thoiHoc, percent: Math.round((thoiHoc / total) * 100), color: 'bg-rose-500', text: 'text-rose-700' },
    ];
  }, [stats, students]);

  // ─── Modal Drill-Down Handlers ────────────────────────────────────────────────
  const openDrillDown = (
    title: string,
    subtitle: string,
    badgeText: string,
    badgeColor: string,
    type: 'grades' | 'students',
    data: any[]
  ) => {
    setModalSearch('');
    setModalClassFilter('');
    setModalState({
      isOpen: true,
      title,
      subtitle,
      badgeText,
      badgeColor,
      type,
      data: Array.isArray(data) ? data : [],
    });
  };

  const closeModal = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  };

  // Danh sách các lớp học có trong modal data để người dùng lọc
  const modalClassOptions = useMemo(() => {
    if (!modalState.isOpen) return [];
    const setCodes = new Set<string>();
    if (modalState.type === 'grades') {
      modalState.data.forEach((item: any) => {
        if (item.lopHoc?.maLopHoc) setCodes.add(item.lopHoc.maLopHoc);
      });
    } else {
      modalState.data.forEach((item: any) => {
        item.dangKyHoc?.forEach((dk: any) => {
          if (dk.lopHoc?.maLopHoc) setCodes.add(dk.lopHoc.maLopHoc);
        });
      });
    }
    return Array.from(setCodes).sort();
  }, [modalState]);

  // Dữ liệu lọc tìm kiếm trong modal
  const filteredModalData = useMemo(() => {
    if (!modalState.isOpen) return [];
    let list = modalState.data || [];
    const search = modalSearch.trim().toLowerCase();

    if (search) {
      if (modalState.type === 'grades') {
        list = list.filter((item: any) => {
          const name = (item.hocVien?.hoTen || '').toLowerCase();
          const code = (item.hocVien?.maHocVien || '').toLowerCase();
          const classCode = (item.lopHoc?.maLopHoc || '').toLowerCase();
          const className = (item.lopHoc?.tenLopHoc || '').toLowerCase();
          return name.includes(search) || code.includes(search) || classCode.includes(search) || className.includes(search);
        });
      } else {
        list = list.filter((item: any) => {
          const name = (item.hoTen || '').toLowerCase();
          const code = (item.maHocVien || '').toLowerCase();
          const email = (item.nguoiDung?.email || '').toLowerCase();
          const phone = (item.nguoiDung?.soDienThoai || '').toLowerCase();
          return name.includes(search) || code.includes(search) || email.includes(search) || phone.includes(search);
        });
      }
    }

    if (modalClassFilter) {
      if (modalState.type === 'grades') {
        list = list.filter((item: any) => item.lopHoc?.maLopHoc === modalClassFilter);
      } else {
        list = list.filter((item: any) =>
          item.dangKyHoc?.some((dk: any) => dk.lopHoc?.maLopHoc === modalClassFilter)
        );
      }
    }

    return list;
  }, [modalState, modalSearch, modalClassFilter]);

  // Xuất file CSV cho danh sách đang xem trong Modal
  const exportModalCSV = () => {
    if (modalState.type === 'grades') {
      const headers = [
        'STT', 'Mã Học Viên', 'Họ Tên Học Viên', 'Mã Lớp Học', 'Tên Lớp Học',
        'Trình Độ CEFR', 'Điểm Chuyên Cần', 'Điểm Giữa Kỳ', 'Điểm Cuối Kỳ',
        'Điểm Tổng Kết', 'Kết Quả Đánh Giá', 'Nhận Xét Giáo Viên'
      ];
      const rows = filteredModalData.map((item: any, idx: number) => [
        idx + 1,
        item.hocVien?.maHocVien ?? '',
        `"${(item.hocVien?.hoTen ?? '').replace(/"/g, '""')}"`,
        item.lopHoc?.maLopHoc ?? '',
        `"${(item.lopHoc?.tenLopHoc ?? '').replace(/"/g, '""')}"`,
        item.lopHoc?.khoaHoc?.trinhDoYeuCau ?? item.hocVien?.trinhDoCEFR ?? '',
        item.diemChuyenCan ?? '',
        item.diemGiuaKy ?? '',
        item.diemCuoiKy ?? '',
        item.diemTongKet ?? '',
        item.trangThaiHoanThanh === 'DAT' ? 'ĐẠT CHUẨN' : (item.trangThaiHoanThanh === 'KHONG_DAT' ? 'CHƯA ĐẠT' : 'ĐANG HỌC'),
        `"${(item.nhanXet ?? '').replace(/"/g, '""')}"`,
      ]);
      const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
      downloadCSV(csv, `${modalState.title.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`);
    } else {
      const headers = [
        'STT', 'Mã Học Viên', 'Họ Tên Học Viên', 'Trình Độ CEFR', 'Trạng Thái Học Tập',
        'Email', 'Số Điện Thoại', 'Số Lớp Đã Đăng Ký'
      ];
      const rows = filteredModalData.map((s: any, idx: number) => [
        idx + 1,
        s.maHocVien ?? '',
        `"${(s.hoTen ?? '').replace(/"/g, '""')}"`,
        s.trinhDoCEFR ?? '',
        `"${formatTrangThaiHocVien(s.trangThai)}"`,
        s.nguoiDung?.email ?? '',
        s.nguoiDung?.soDienThoai ?? '',
        s.dangKyHoc?.length ?? 0,
      ]);
      const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
      downloadCSV(csv, `${modalState.title.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`);
    }
  };

  // ─── Utility: tải file CSV ────────────────────────────────────────────────────
  const downloadCSV = (csvContent: string, filename: string) => {
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // ─── CSV 1: Báo cáo lớp học (Sĩ số & Lấp đầy) ──────────────────────────────
  const exportClassesCSV = () => {
    const headers = [
      'Mã Lớp', 'Tên Lớp Học', 'Khóa Học', 'Sĩ Số Thực Tế', 'Sĩ Số Tối Đa',
      'Tỷ Lệ Lấp Đầy (%)', 'Trạng Thái',
    ];
    const rows = classes.map((c) => [
      c.maLopHoc,
      `"${(c.tenLopHoc || '').replace(/"/g, '""')}"`,
      `"${(c.khoaHoc?.tenKhoaHoc || '').replace(/"/g, '""')}"`,
      c.siSoHienTai ?? 0,
      c.siSoToiDa ?? 0,
      Math.round(((c.siSoHienTai ?? 0) / Math.max(c.siSoToiDa ?? 1, 1)) * 100),
      `"${formatTrangThaiLopHoc(c.trangThai)}"`,
    ]);
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    downloadCSV(csv, `Bao_Cao_Lop_Hoc_ETC_${new Date().toISOString().slice(0, 10)}.csv`);
  };

  // ─── CSV 2: Báo cáo học phí & công nợ đầy đủ ────────────────────────────────
  const exportInvoicesCSV = () => {
    const headers = [
      'Mã Hóa Đơn', 'Mã Học Viên', 'Họ Tên Học Viên', 'Mã Lớp', 'Tên Lớp Học',
      'Học Phí Phải Trả (VNĐ)', 'Đã Thanh Toán (VNĐ)', 'Còn Nợ (VNĐ)',
      'Tỷ Lệ Đã Thanh Toán (%)', 'Trạng Thái Hóa Đơn', 'Ngày Lập Hóa Đơn',
    ];
    const rows = invoices.map((inv) => {
      const phaiTra = Number(inv.soTienPhaiTra ?? 0);
      const daTra = Number(inv.soTienDaTra ?? 0);
      const conNo = Math.max(0, phaiTra - daTra);
      const tiLe = phaiTra > 0 ? Math.round((daTra / phaiTra) * 100) : 0;
      const rawDate = inv.ngayLap || inv.dangKyHoc?.ngayDangKy || inv.createdAt;
      const ngayLap = formatCSVDate(rawDate);
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
        `"${ngayLap}"`,
      ];
    });
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    downloadCSV(csv, `Bao_Cao_Hoc_Phi_ETC_${new Date().toISOString().slice(0, 10)}.csv`);
  };

  // ─── CSV 3: Lịch sử phiếu thu (Thanh toán) ──────────────────────────────────
  const exportPaymentsCSV = () => {
    const headers = [
      'Mã Giao Dịch', 'Mã Hóa Đơn', 'Mã Học Viên', 'Họ Tên Học Viên',
      'Tên Lớp Học', 'Số Tiền Thu (VNĐ)', 'Phương Thức', 'Trạng Thái',
      'Người Thu', 'Ghi Chú', 'Thời Gian Thanh Toán',
    ];
    const rows = payments.map((p) => {
      const rawDate = p.thoiGianThanhToan || p.createdAt;
      const ngayThu = formatCSVDateTime(rawDate);
      const ptTT = p.phuongThuc === 'CHUYEN_KHOAN' ? 'Chuyển Khoản' : 'Tiền Mặt';
      const trangThai = p.trangThai === 'THANH_CONG' ? 'Thành Công' : (p.trangThai === 'THAT_BAI' ? 'Thất Bại' : p.trangThai ?? '');
      return [
        p.maGiaoDich ?? '',
        p.hoaDon?.maHoaDon ?? p.hoaDonId ?? '',
        p.hoaDon?.hocVien?.maHocVien ?? '',
        `"${(p.hoaDon?.hocVien?.hoTen ?? '').replace(/"/g, '""')}"`,
        `"${(p.hoaDon?.dangKyHoc?.lopHoc?.tenLopHoc ?? '').replace(/"/g, '""')}"`,
        Number(p.soTien ?? 0),
        ptTT,
        trangThai,
        p.nguoiThu?.tenDangNhap ?? '',
        `"${(p.ghiChu ?? '').replace(/"/g, '""')}"`,
        `"${ngayThu}"`,
      ];
    });
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    downloadCSV(csv, `Lich_Su_Phieu_Thu_ETC_${new Date().toISOString().slice(0, 10)}.csv`);
  };

  // ─── Export theo tab hiện tại ────────────────────────────────────────────────
  const exportToCSV = () => {
    if (activeTab === 'students_cefr' || activeTab === 'overview') {
      exportInvoicesCSV();
    } else {
      exportClassesCSV();
    }
  };

  return (
    <AppLayout
      allowedRoles={['QUAN_LY']}
      title="Báo Cáo Thống Kê & Phân Tích Đào Tạo"
      subtitle="Báo cáo tài chính doanh thu, hiệu suất lấp đầy lớp học và cơ cấu phân bố học viên"
    >
      {loading ? (
        <div className="py-24 flex flex-col justify-center items-center space-y-3">
          <div className="w-10 h-10 border-4 border-teal-500/20 border-t-teal-600 rounded-full animate-spin"></div>
          <p className="text-xs text-slate-500 font-semibold">Đang tổng hợp dữ liệu phân tích hệ thống...</p>
        </div>
      ) : (
        <div id="etc-printable-report" className="space-y-6">
          {/* Header A4 chính quy khi in ra giấy/PDF (ẩn trên màn hình, chỉ hiện khi in) */}
          <div className="hidden print:block border-b-2 border-slate-900 pb-4 mb-4 text-black font-sans">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-xl font-black tracking-wider text-black uppercase">
                  TRUNG TÂM NGOẠI NGỮ ETC — ETC ENGLISH CENTER
                </h1>
                <p className="text-xs text-slate-700 font-semibold mt-0.5">
                  Hệ Thống Báo Cáo Thống Kê & Phân Tích Dữ Liệu Đào Tạo Toàn Diện
                </p>
                <p className="text-xs font-bold text-teal-800 mt-1 uppercase">
                  PHÂN HỆ BÁO CÁO:{' '}
                  {activeTab === 'overview'
                    ? 'TỔNG QUAN TÀI CHÍNH, DOANH THU & SỔ THU CHI'
                    : activeTab === 'students_cefr'
                      ? 'CƠ CẤU HỌC VIÊN & CHUẨN ĐẦU RA CEFR'
                      : 'HIỆU SUẤT LỚP HỌC & TỶ LỆ HOÀN THÀNH'}
                </p>
              </div>
              <div className="text-right text-xs text-slate-700 space-y-0.5">
                <p>
                  <strong>Thời gian in:</strong> {new Date().toLocaleString('vi-VN')}
                </p>
                <p>
                  <strong>Người xuất báo cáo:</strong> Ban Quản Trị Hệ Thống
                </p>
                <p className="italic text-[11px] text-slate-500">Tài liệu lưu hành nội bộ ETC English</p>
              </div>
            </div>
          </div>

          {/* Header Action Bar: 3 Tabs Navigation & In Báo Cáo */}
          <div className="bg-white dark:bg-[#141c2e] p-3 sm:p-4 rounded-2xl border border-slate-200/90 dark:border-[#1e2d45] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 print:hidden">
            {/* Tabs Navigation */}
            <div className="flex items-center space-x-1.5 sm:space-x-2 overflow-x-auto no-scrollbar py-0.5 -mx-1 px-1 sm:mx-0 sm:px-0 overscroll-x-contain touch-pan-x">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-3.5 sm:px-4 py-2 min-h-[38px] sm:min-h-0 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 whitespace-nowrap cursor-pointer shrink-0 ${activeTab === 'overview'
                    ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-md shadow-teal-600/20'
                    : 'bg-slate-100 dark:bg-[#162032] text-slate-700 dark:text-slate-300 hover:bg-teal-50 hover:text-teal-800 dark:hover:bg-teal-950/40 dark:hover:text-teal-300 border border-transparent hover:border-teal-200 dark:hover:border-teal-800/40'
                  }`}
              >
                <DollarSign className="w-4 h-4 shrink-0" />
                <span>Tổng Quan & Tài Chính</span>
              </button>
              <button
                onClick={() => setActiveTab('students_cefr')}
                className={`px-3.5 sm:px-4 py-2 min-h-[38px] sm:min-h-0 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 whitespace-nowrap cursor-pointer shrink-0 ${activeTab === 'students_cefr'
                    ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-md shadow-teal-600/20'
                    : 'bg-slate-100 dark:bg-[#162032] text-slate-700 dark:text-slate-300 hover:bg-teal-50 hover:text-teal-800 dark:hover:bg-teal-950/40 dark:hover:text-teal-300 border border-transparent hover:border-teal-200 dark:hover:border-teal-800/40'
                  }`}
              >
                <Users className="w-4 h-4 shrink-0" />
                <span>Học Viên & Chuẩn CEFR</span>
              </button>
              <button
                onClick={() => setActiveTab('classes_fill')}
                className={`px-3.5 sm:px-4 py-2 min-h-[38px] sm:min-h-0 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 whitespace-nowrap cursor-pointer shrink-0 ${activeTab === 'classes_fill'
                    ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-md shadow-teal-600/20'
                    : 'bg-slate-100 dark:bg-[#162032] text-slate-700 dark:text-slate-300 hover:bg-teal-50 hover:text-teal-800 dark:hover:bg-teal-950/40 dark:hover:text-teal-300 border border-transparent hover:border-teal-200 dark:hover:border-teal-800/40'
                  }`}
              >
                <GraduationCap className="w-4 h-4 shrink-0" />
                <span>Hiệu Suất Lớp & Đạt Chuẩn</span>
              </button>
            </div>

            {/* Print Action Button */}
            <div className="flex items-center justify-end shrink-0 print:hidden">
              <button
                onClick={() => window.print()}
                className="w-full sm:w-auto px-4 py-2 min-h-[38px] sm:min-h-0 rounded-xl bg-white hover:bg-slate-50 dark:bg-[#162032] dark:hover:bg-slate-800 text-slate-700 hover:text-slate-900 dark:text-slate-200 text-xs font-bold flex items-center justify-center space-x-1.5 border border-slate-200 dark:border-[#22324e] transition shadow-xs cursor-pointer whitespace-nowrap"
                title="In hoặc lưu định dạng PDF toàn bộ báo cáo"
              >
                <Printer className="w-4 h-4 text-slate-600 dark:text-slate-400 shrink-0" />
                <span>In Báo Cáo</span>
              </button>
            </div>
          </div>

          {/* TAB 1: TỔNG QUAN & TÀI CHÍNH */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Toolbar Tài Chính: Làm mới & Xuất Báo Cáo */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#141c2e] p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 dark:border-[#1e2d45] shadow-xs">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                    <span>Tổng Quan Doanh Thu & Sổ Thu Chi</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Theo dõi số liệu thực thu, công nợ và lịch sử thanh toán toàn hệ thống
                  </p>
                </div>
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 print:hidden">
                  <button
                    onClick={() => fetchData(true)}
                    disabled={refreshing}
                    className="px-3 py-1.5 min-h-[38px] sm:min-h-0 rounded-xl bg-slate-100 hover:bg-teal-50 dark:bg-[#162032] dark:hover:bg-teal-950/40 text-slate-700 dark:text-slate-200 hover:text-teal-700 dark:hover:text-teal-300 text-xs font-bold flex items-center space-x-1.5 border border-slate-200 dark:border-[#22324e] hover:border-teal-300 dark:hover:border-teal-700 transition shadow-2xs cursor-pointer disabled:opacity-50 shrink-0 whitespace-nowrap"
                    title="Cập nhật lại số liệu thống kê & báo cáo mới nhất"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 shrink-0 ${refreshing ? 'animate-spin text-teal-600 dark:text-teal-400' : ''}`} />
                    <span>{refreshing ? 'Đang tải...' : 'Làm mới'}</span>
                  </button>
                  <button
                    onClick={exportInvoicesCSV}
                    className="px-3 py-1.5 min-h-[38px] sm:min-h-0 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/30 dark:hover:bg-emerald-900/40 text-emerald-700 hover:text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center space-x-1.5 border border-emerald-200 dark:border-emerald-800/50 transition shadow-2xs cursor-pointer shrink-0 whitespace-nowrap"
                    title="Xuất CSV báo cáo học phí & công nợ đầy đủ"
                  >
                    <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                    <span>CSV Học Phí</span>
                  </button>
                  <button
                    onClick={exportPaymentsCSV}
                    className="px-3 py-1.5 min-h-[38px] sm:min-h-0 rounded-xl bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/30 dark:hover:bg-teal-900/40 text-teal-700 hover:text-teal-800 dark:text-teal-300 text-xs font-bold flex items-center space-x-1.5 border border-teal-200 dark:border-teal-800/50 transition shadow-2xs cursor-pointer shrink-0 whitespace-nowrap"
                    title="Xuất CSV lịch sử phiếu thu thanh toán"
                  >
                    <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                    <span>CSV Phiếu Thu</span>
                  </button>
                </div>
              </div>
              {/* 4 Cards Chỉ Số Tài Chính & Vận Hành (Nhấp vào để nhảy sang trang quản lý tương ứng) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <Link
                  href="/admin/fees"
                  className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm relative overflow-hidden transition-all duration-200 hover:border-emerald-400 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer group block"
                  title="Nhấn để quản lý chi tiết sổ thu & học phí"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider group-hover:text-emerald-700 transition">
                          Doanh Thu Đã Thu
                        </p>
                        <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
                      </div>
                      <p className="text-2xl font-black text-emerald-700 mt-1">
                        {financeMetrics.totalCollected.toLocaleString()} đ
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100 transition">
                      <DollarSign className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-emerald-700 font-semibold">
                    <span className="flex items-center">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                      Thu hồi: {financeMetrics.collectionRate}%
                    </span>
                    <span className="text-[11px] text-emerald-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
                      Xem sổ thu <ChevronRight className="w-3 h-3 ml-0.5" />
                    </span>
                  </div>
                </Link>

                <Link
                  href="/admin/fees"
                  className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm relative overflow-hidden transition-all duration-200 hover:border-amber-400 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer group block"
                  title="Nhấn để theo dõi danh sách học viên còn nợ học phí"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider group-hover:text-amber-700 transition">
                          Công Nợ Còn Phải Thu
                        </p>
                        <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
                      </div>
                      <p className="text-2xl font-black text-amber-700 mt-1">
                        {financeMetrics.totalDebt.toLocaleString()} đ
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-amber-50 text-amber-600 group-hover:bg-amber-100 transition">
                      <Clock className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span>Học viên chưa đóng đủ</span>
                    <span className="text-[11px] text-amber-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
                      Theo dõi nợ <ChevronRight className="w-3 h-3 ml-0.5" />
                    </span>
                  </div>
                </Link>

                <Link
                  href="/admin/students"
                  className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm relative overflow-hidden transition-all duration-200 hover:border-teal-400 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer group block"
                  title="Nhấn để quản lý 81 hồ sơ học viên"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider group-hover:text-teal-700 transition">
                          Quy Mô Học Viên
                        </p>
                        <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
                      </div>
                      <p className="text-2xl font-black text-teal-700 mt-1">
                        {stats?.tongQuan?.tongHocVien || students.length || 0}
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-teal-50 text-teal-600 group-hover:bg-teal-100 transition">
                      <Users className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-teal-700 font-semibold">
                    <span>Học viên toàn hệ thống</span>
                    <span className="text-[11px] text-teal-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
                      Quản lý HV <ChevronRight className="w-3 h-3 ml-0.5" />
                    </span>
                  </div>
                </Link>

                <Link
                  href="/admin/classes"
                  className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm relative overflow-hidden transition-all duration-200 hover:border-sky-400 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer group block"
                  title="Nhấn để xem danh sách & thời khóa biểu 15 lớp học"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider group-hover:text-sky-700 transition">
                          Lớp Đang Hoạt Động
                        </p>
                        <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-sky-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
                      </div>
                      <p className="text-2xl font-black text-sky-700 mt-1">
                        {classes.length || stats?.tongQuan?.lopDangMo || 0}
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-sky-50 text-sky-600 group-hover:bg-sky-100 transition">
                      <Building2 className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-sky-700 font-semibold">
                    <span>Số lớp tuyển sinh & đang học</span>
                    <span className="text-[11px] text-sky-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
                      Xem lớp học <ChevronRight className="w-3 h-3 ml-0.5" />
                    </span>
                  </div>
                </Link>
              </div>

              {/* Cơ Cấu Hình Thức Thanh Toán & Tiến Độ Tài Chính */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-white dark:bg-[#111928] border border-slate-200/90 dark:border-[#1e2d45] shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center space-x-2">
                    <CreditCard className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                    <span>Cơ Cấu Hình Thức Thu Phí</span>
                  </h3>
                  <div className="space-y-3 pt-2">
                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span className="text-teal-700 dark:text-teal-400 flex items-center gap-1.5">
                          <span>💳 Chuyển Khoản Ngân Hàng</span>
                        </span>
                        <span className="text-slate-800 dark:text-slate-200">
                          {financeMetrics.bankPayments.toLocaleString()} đ ({financeMetrics.bankPercent}%)
                        </span>
                      </div>
                      <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full transition-all duration-500"
                          style={{ width: `${financeMetrics.bankPercent}%` }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span className="text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                          <span>💵 Tiền Mặt Trực Tiếp</span>
                        </span>
                        <span className="text-slate-800 dark:text-slate-200">
                          {financeMetrics.cashPayments.toLocaleString()} đ ({financeMetrics.cashPercent}%)
                        </span>
                      </div>
                      <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500"
                          style={{ width: `${financeMetrics.cashPercent}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 italic pt-2">
                    * Thống kê tự động từ các phiếu thu thực tế đã quyết toán qua cổng kế toán của ETC English.
                  </p>
                </div>

                {/* Khối Hiệu Suất Đào Tạo & Chuẩn Đầu Ra (Rõ Ràng, Mạch Lạc, Nhấp Vào Từng Ô Để Xem Danh Sách) */}
                <div className="p-6 rounded-2xl bg-white dark:bg-[#111928] border border-slate-200/90 dark:border-[#1e2d45] shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-[#1e2d45] pb-3">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center space-x-2">
                        <Award className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                        <span>Kết Quả Đào Tạo & Chuẩn Đầu Ra</span>
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Thống kê đánh giá điểm cuối khóa trên các lớp ({stats?.tyLeHoanThanh?.tongLuotDanhGia ?? 0} lượt)
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('students_cefr')}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-teal-50 dark:bg-teal-950/40 hover:bg-teal-100 dark:hover:bg-teal-900/50 text-teal-700 dark:text-teal-300 text-xs font-bold transition border border-teal-200 dark:border-teal-800/60 cursor-pointer self-start sm:self-auto"
                      title="Xem cơ cấu hồ sơ học viên tại Tab Học Viên & Chuẩn CEFR"
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>Xem Hồ Sơ Học Viên</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center pt-1">
                      {/* Đạt chuẩn */}
                      <div
                        onClick={() =>
                          openDrillDown(
                            'Danh Sách Học Viên Đạt Chuẩn Đầu Ra Môn Học',
                            'Tổng hợp các lượt học viên có Điểm Tổng Kết ≥ 50 và Chuyên Cần ≥ 80%',
                            `${stats?.tyLeHoanThanh?.dat ?? 0} Lượt Đạt`,
                            'emerald',
                            'grades',
                            (stats?.chiTietKetQua || []).filter((g: any) => g.trangThaiHoanThanh === 'DAT')
                          )
                        }
                        className="p-3 rounded-xl bg-emerald-500/10 dark:bg-emerald-950/40 hover:bg-emerald-500/15 dark:hover:bg-emerald-900/50 border border-emerald-500/25 dark:border-emerald-700/50 transition duration-200 cursor-pointer group hover:scale-[1.02] hover:shadow-md relative overflow-hidden"
                      >
                        <div className="flex items-center justify-between text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase">
                          <span>ĐẠT CHUẨN</span>
                          <Eye className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-emerald-700 dark:text-emerald-400" />
                        </div>
                        <p className="text-xl font-black text-emerald-800 dark:text-emerald-300 mt-1">{stats?.tyLeHoanThanh?.dat ?? 0}</p>
                        <p className="text-[10px] text-emerald-600 dark:text-emerald-400/80 mt-0.5">Cấp chứng nhận</p>
                      </div>

                      {/* Chưa đạt */}
                      <div
                        onClick={() =>
                          openDrillDown(
                            'Danh Sách Học Viên Chưa Đạt Chuẩn Môn Học',
                            'Học viên có Chuyên Cần < 80% hoặc Điểm Tổng Kết < 50 (cần thi lại / học lại)',
                            `${stats?.tyLeHoanThanh?.khongDat ?? 0} Lượt Chưa Đạt`,
                            'rose',
                            'grades',
                            (stats?.chiTietKetQua || []).filter((g: any) => g.trangThaiHoanThanh === 'KHONG_DAT')
                          )
                        }
                        className="p-3 rounded-xl bg-rose-500/10 dark:bg-rose-950/40 hover:bg-rose-500/15 dark:hover:bg-rose-900/50 border border-rose-500/25 dark:border-rose-700/50 transition duration-200 cursor-pointer group hover:scale-[1.02] hover:shadow-md relative overflow-hidden"
                      >
                        <div className="flex items-center justify-between text-[10px] font-bold text-rose-700 dark:text-rose-400 uppercase">
                          <span>CHƯA ĐẠT</span>
                          <Eye className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-rose-700 dark:text-rose-400" />
                        </div>
                        <p className="text-xl font-black text-rose-800 dark:text-rose-300 mt-1">{stats?.tyLeHoanThanh?.khongDat ?? 0}</p>
                        <p className="text-[10px] text-rose-600 dark:text-rose-400/80 mt-0.5">Cần thi lại</p>
                      </div>

                      {/* Đang học */}
                      <div
                        onClick={() =>
                          openDrillDown(
                            'Danh Sách Học Viên Đang Học / Chưa Thi Cuối Kỳ',
                            'Học viên đã hoàn thành điểm giữa kỳ, đang học nửa chặng đường và chờ thi cuối khóa',
                            `${stats?.tyLeHoanThanh?.chuaXepLoai ?? 0} Lượt Đang Học`,
                            'slate',
                            'grades',
                            (stats?.chiTietKetQua || []).filter((g: any) => g.trangThaiHoanThanh === 'CHUA_XEP_LOAI')
                          )
                        }
                        className="p-3 rounded-xl bg-slate-500/10 dark:bg-slate-800/60 hover:bg-slate-500/15 dark:hover:bg-slate-800/90 border border-slate-300 dark:border-slate-700/60 transition duration-200 cursor-pointer group hover:scale-[1.02] hover:shadow-md relative overflow-hidden"
                      >
                        <div className="flex items-center justify-between text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase">
                          <span>ĐANG HỌC</span>
                          <Eye className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-slate-700 dark:text-slate-300" />
                        </div>
                        <p className="text-xl font-black text-slate-800 dark:text-slate-100 mt-1">{stats?.tyLeHoanThanh?.chuaXepLoai ?? 0}</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Chưa xếp loại</p>
                      </div>

                      {/* Chưa phát sinh điểm */}
                      <div
                        onClick={() =>
                          openDrillDown(
                            'Danh Sách Học Viên Mới Ghi Danh (Chưa Phát Sinh Điểm)',
                            'Học viên mới đăng ký lớp học hoặc lớp chưa bước vào kỳ kiểm tra đánh giá',
                            `${stats?.tyLeHoanThanh?.chuaCoDiem ?? 0} Học Viên`,
                            'amber',
                            'students',
                            (stats?.chiTietHocVien || students).filter((s: any) => !s.ketQua || s.ketQua.length === 0)
                          )
                        }
                        className="p-3 rounded-xl bg-amber-500/10 dark:bg-amber-950/40 hover:bg-amber-500/15 dark:hover:bg-amber-900/50 border border-amber-500/25 dark:border-amber-700/50 transition duration-200 cursor-pointer group hover:scale-[1.02] hover:shadow-md relative overflow-hidden"
                      >
                        <div className="flex items-center justify-between text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase">
                          <span>MỚI GHI DANH</span>
                          <Eye className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-amber-700 dark:text-amber-400" />
                        </div>
                        <p className="text-xl font-black text-amber-800 dark:text-amber-300 mt-1">{stats?.tyLeHoanThanh?.chuaCoDiem ?? 0}</p>
                        <p className="text-[10px] text-amber-600 dark:text-amber-400/80 mt-0.5">Chưa có điểm</p>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-300 flex justify-between items-center">
                      <span className="font-medium">Tỷ lệ đạt chuẩn trên số lượt đã đánh giá:</span>
                      <strong className="text-teal-700 dark:text-teal-400 text-sm font-black">{stats?.tyLeHoanThanh?.tyLeDatPhanTram ?? 0}%</strong>
                    </div>
                    <p className="text-[11px] text-teal-700/90 dark:text-teal-300 bg-teal-50/60 dark:bg-teal-950/30 p-2 rounded-lg border border-teal-100 dark:border-teal-900/60 flex items-center gap-1.5 font-medium">
                      <Eye className="w-3.5 h-3.5 shrink-0 text-teal-600 dark:text-teal-400" />
                      <span>Mẹo: Nhấp vào từng ô chỉ số phía trên để xem bảng điểm, chi tiết từng thành phần và nhận xét của giáo viên.</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PHÂN TÍCH HỌC VIÊN & CHUẨN CEFR */}
          {activeTab === 'students_cefr' && (
            <div className="space-y-6">
              {/* Header Toolbar Tab 2: Làm mới & Xuất CSV Học Viên */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#141c2e] p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 dark:border-[#1e2d45] shadow-xs">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                    <Users className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                    <span>Cơ Cấu Học Viên & Khung Trình Độ CEFR</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Thống kê tỷ lệ phân bổ A1 đến C2 và tình trạng học tập thực tế
                  </p>
                </div>
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 print:hidden">
                  <button
                    onClick={() => fetchData(true)}
                    disabled={refreshing}
                    className="px-3 py-1.5 min-h-[38px] sm:min-h-0 rounded-xl bg-slate-100 hover:bg-teal-50 dark:bg-[#162032] dark:hover:bg-teal-950/40 text-slate-700 dark:text-slate-200 hover:text-teal-700 dark:hover:text-teal-300 text-xs font-bold flex items-center space-x-1.5 border border-slate-200 dark:border-[#22324e] hover:border-teal-300 dark:hover:border-teal-700 transition shadow-2xs cursor-pointer disabled:opacity-50 shrink-0 whitespace-nowrap"
                    title="Cập nhật lại số liệu thống kê & báo cáo mới nhất"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 shrink-0 ${refreshing ? 'animate-spin text-teal-600 dark:text-teal-400' : ''}`} />
                    <span>{refreshing ? 'Đang tải...' : 'Làm mới'}</span>
                  </button>
                  <button
                    onClick={exportInvoicesCSV}
                    className="px-3 py-1.5 min-h-[38px] sm:min-h-0 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/30 dark:hover:bg-emerald-900/40 text-emerald-700 hover:text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center space-x-1.5 border border-emerald-200 dark:border-emerald-800/50 transition shadow-2xs cursor-pointer shrink-0 whitespace-nowrap"
                    title="Xuất CSV báo cáo dữ liệu học viên & học phí"
                  >
                    <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                    <span>CSV Dữ Liệu Học Viên</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Phân bổ CEFR */}
                <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
                      <Layers className="w-4 h-4 text-teal-600" />
                      <span>Phân Bổ Trình Độ Đầu Vào (Khung CEFR)</span>
                    </h3>
                    <span className="text-xs font-mono font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-md border border-teal-200">
                      {stats?.tongQuan?.tongHocVien || students.length || 0} Học Viên
                    </span>
                  </div>

                  <div className="space-y-3 pt-2">
                    {cefrDistribution.map((item: any) => (
                      <div
                        key={item.level}
                        onClick={() =>
                          openDrillDown(
                            `Danh Sách Học Viên Trình Độ CEFR ${item.level}`,
                            `Tổng cộng ${item.count} học viên được xếp lớp ở trình độ chuẩn CEFR ${item.level}`,
                            `${item.count} Học Viên (${item.percent}%)`,
                            ['A1', 'A2'].includes(item.level) ? 'cyan' : ['B1', 'B2'].includes(item.level) ? 'teal' : 'blue',
                            'students',
                            (stats?.chiTietHocVien || students).filter(
                              (s: any) => (s.trinhDoCEFR || s.hoSoHocVien?.trinhDoCEFR) === item.level
                            )
                          )
                        }
                        className="p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-teal-200 transition duration-150 cursor-pointer group space-y-1.5"
                        title={`Nhấp để xem danh sách ${item.count} học viên trình độ CEFR ${item.level}`}
                      >
                        <div className="flex justify-between items-center text-xs font-bold">
                          <span className="font-mono text-slate-800 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                            <span>CEFR {item.level}</span>
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-slate-600">
                              {item.count} học viên ({item.percent}%)
                            </span>
                            <Eye className="w-3.5 h-3.5 text-teal-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </div>
                        <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${['A1', 'A2'].includes(item.level)
                                ? 'bg-cyan-500'
                                : ['B1', 'B2'].includes(item.level)
                                  ? 'bg-teal-600'
                                  : 'bg-blue-600'
                              }`}
                            style={{ width: `${item.percent}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-[11px] text-slate-500 italic pt-1">
                    * Nhấp vào từng mức trình độ CEFR để xem danh sách học viên tương ứng.
                  </p>
                </div>

                {/* Phân bổ trạng thái học tập */}
                <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
                    <PieChart className="w-4 h-4 text-teal-600" />
                    <span>Cơ Cấu Trạng Thái Học Tập Của Học Viên</span>
                  </h3>

                  <div className="space-y-3 pt-2">
                    {studentStatusMetrics.map((status: any) => (
                      <div
                        key={status.label}
                        onClick={() =>
                          openDrillDown(
                            `Danh Sách Học Viên: ${status.label}`,
                            `Chi tiết danh sách học viên đang ở trạng thái "${status.label}" trên toàn hệ thống`,
                            `${status.count} Học Viên (${status.percent}%)`,
                            status.key === 'DANG_HOC'
                              ? 'teal'
                              : status.key === 'DA_TOT_NGHIEP'
                                ? 'emerald'
                                : status.key === 'BAO_LUU'
                                  ? 'amber'
                                  : 'rose',
                            'students',
                            (stats?.chiTietHocVien || students).filter(
                              (s: any) => (s.trangThai || s.trangThaiHoc) === status.key
                            )
                          )
                        }
                        className="p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100/90 border border-slate-200/80 hover:border-teal-300 transition duration-150 cursor-pointer group space-y-2"
                        title={`Nhấp để xem danh sách ${status.count} học viên ở trạng thái ${status.label}`}
                      >
                        <div className="flex justify-between items-center text-xs font-bold">
                          <span className={`${status.text} flex items-center gap-1.5`}>
                            <span>{status.label}</span>
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-slate-800 font-mono">
                              {status.count} HV ({status.percent}%)
                            </span>
                            <Eye className="w-3.5 h-3.5 text-teal-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                          <div
                            className={`h-full ${status.color} rounded-full transition-all duration-500`}
                            style={{ width: `${status.percent}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-[11px] text-slate-500 italic pt-1">
                    * Nhấp vào từng trạng thái để mở danh sách chi tiết học viên.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: HIỆU SUẤT LỚP HỌC & TỐT NGHIỆP */}
          {activeTab === 'classes_fill' && (
            <div className="space-y-6">
              {/* Bảng Chi Tiết Hiệu Suất Từng Lớp */}
              <div className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-[#141c2e] border border-slate-200/90 dark:border-[#1e2d45] shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-[#1e2d45]">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">Hiệu Suất Tuyển Sinh & Tỷ Lệ Lấp Đầy Từng Lớp</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Theo dõi số lượng học viên ghi danh so với sĩ số quy định của từng lớp</p>
                  </div>
                  <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 print:hidden">
                    <span className="text-xs font-bold px-3 py-1.5 min-h-[38px] sm:min-h-0 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800/60 flex items-center shrink-0">
                      Tổng {classes.length} Lớp Học
                    </span>
                    <button
                      onClick={() => fetchData(true)}
                      disabled={refreshing}
                      className="px-3 py-1.5 min-h-[38px] sm:min-h-0 rounded-xl bg-slate-100 hover:bg-teal-50 dark:bg-[#162032] dark:hover:bg-teal-950/40 text-slate-700 dark:text-slate-200 hover:text-teal-700 dark:hover:text-teal-300 text-xs font-bold flex items-center space-x-1.5 border border-slate-200 dark:border-[#22324e] hover:border-teal-300 dark:hover:border-teal-700 transition shadow-2xs cursor-pointer disabled:opacity-50 shrink-0 whitespace-nowrap"
                      title="Cập nhật lại danh sách và sĩ số lớp học mới nhất"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 shrink-0 ${refreshing ? 'animate-spin text-teal-600 dark:text-teal-400' : ''}`} />
                      <span>{refreshing ? 'Đang tải...' : 'Làm mới'}</span>
                    </button>
                    <button
                      onClick={exportClassesCSV}
                      className="px-3 py-1.5 min-h-[38px] sm:min-h-0 rounded-xl bg-white hover:bg-slate-50 dark:bg-[#162032] dark:hover:bg-slate-800 text-slate-700 hover:text-slate-900 dark:text-slate-200 text-xs font-bold flex items-center space-x-1.5 border border-slate-200 dark:border-[#22324e] transition shadow-2xs cursor-pointer shrink-0 whitespace-nowrap"
                      title="Xuất CSV báo cáo sĩ số & lớp học"
                    >
                      <Download className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400 shrink-0" />
                      <span>CSV Lớp Học</span>
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-slate-50 text-slate-600 uppercase text-[11px] font-bold tracking-wider border-b border-slate-200">
                      <tr>
                        <th className="px-5 py-3.5 whitespace-nowrap">Mã Lớp</th>
                        <th className="px-5 py-3.5 whitespace-nowrap">Tên Lớp Học</th>
                        <th className="px-5 py-3.5 whitespace-nowrap">Khóa Học & Trình Độ</th>
                        <th className="px-5 py-3.5 whitespace-nowrap text-center">Sĩ Số Đăng Ký</th>
                        <th className="px-5 py-3.5 whitespace-nowrap min-w-[160px]">Tỷ Lệ Lấp Đầy</th>
                        <th className="px-5 py-3.5 whitespace-nowrap text-center">Trạng Thái</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {classes.map((c: any) => {
                        const maxCap = c.siSoToiDa || 25;
                        const fillPercent = Math.min(100, Math.round((c.siSoHienTai / maxCap) * 100));
                        return (
                          <tr key={c.id} className="hover:bg-teal-50/30 transition">
                            <td className="px-5 py-4 font-mono font-bold text-teal-700 whitespace-nowrap">
                              {c.maLopHoc}
                            </td>
                            <td className="px-5 py-4 font-bold text-slate-900 whitespace-nowrap">
                              {c.tenLopHoc}
                            </td>
                            <td className="px-5 py-4 whitespace-nowrap">
                              <span className="block font-semibold text-slate-800">{c.khoaHoc?.tenKhoaHoc}</span>
                              <span className="text-[10px] font-mono text-teal-800 bg-teal-50 border border-teal-200 px-1.5 py-0.5 rounded mt-0.5 inline-block font-bold">
                                CEFR {c.khoaHoc?.trinhDoYeuCau}
                              </span>
                            </td>
                            <td className="px-5 py-4 text-center whitespace-nowrap font-mono font-bold text-slate-900">
                              {c.siSoHienTai} / {maxCap} HV
                            </td>
                            <td className="px-5 py-4 whitespace-nowrap">
                              <div className="space-y-1">
                                <div className="flex justify-between text-[11px] font-bold">
                                  <span className={fillPercent >= 90 ? 'text-rose-600' : fillPercent >= 60 ? 'text-teal-700' : 'text-slate-600'}>
                                    {fillPercent}%
                                  </span>
                                  <span className="text-slate-500 text-[10px]">Còn {Math.max(0, maxCap - c.siSoHienTai)} chỗ</span>
                                </div>
                                <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                                  <div
                                    className={`h-full rounded-full transition-all duration-300 ${fillPercent >= 90
                                        ? 'bg-rose-500'
                                        : fillPercent >= 60
                                          ? 'bg-teal-600'
                                          : 'bg-cyan-500'
                                      }`}
                                    style={{ width: `${fillPercent}%` }}
                                  ></div>
                                </div>
                              </div>
                            </td>
                            <td className="px-5 py-4 text-center whitespace-nowrap">
                              <span
                                className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${c.trangThai === 'DANG_MO_DANG_KY'
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                    : c.trangThai === 'DANG_HOC'
                                      ? 'bg-sky-50 text-sky-700 border-sky-200'
                                      : 'bg-slate-100 text-slate-700 border-slate-200'
                                  }`}
                              >
                                {formatTrangThaiLopHoc(c.trangThai)}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          {/* ══════════════════════════════════════════════════════════════════════════════ */}
          {/* DRILL-DOWN INSPECTION MODAL ("Ấn vào xem được") */}
          {/* ══════════════════════════════════════════════════════════════════════════════ */}
          {modalState.isOpen && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200 print:hidden"
              onClick={closeModal}
            >
              <div
                className="bg-white dark:bg-[#111928] w-full max-w-5xl max-h-[90vh] rounded-2xl shadow-2xl border border-slate-200 dark:border-[#1e2d45] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="px-6 py-4 border-b border-slate-100 dark:border-[#1e2d45] flex items-center justify-between bg-gradient-to-r from-slate-50 to-white dark:from-[#162032] dark:to-[#111928]">
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 rounded-xl bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 border border-teal-200/80 dark:border-teal-800/60">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">{modalState.title}</h2>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-50 dark:bg-teal-950/50 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800/60 font-mono">
                          {modalState.badgeText}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{modalState.subtitle}</p>
                    </div>
                  </div>

                  <button
                    onClick={closeModal}
                    className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                    title="Đóng cửa sổ"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Search & Filter Toolbar */}
                <div className="px-6 py-3.5 bg-slate-50/70 dark:bg-[#162032]/60 border-b border-slate-200/80 dark:border-[#1e2d45] flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center space-x-2 w-full sm:w-auto flex-1">
                    <div className="relative flex-1 max-w-md">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Tìm kiếm theo Tên học viên, Mã HV, Lớp học..."
                        value={modalSearch}
                        onChange={(e) => setModalSearch(e.target.value)}
                        className="w-full pl-9 pr-3 py-1.5 text-xs bg-white dark:bg-[#162032] rounded-xl border border-slate-200 dark:border-[#22324e] text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition"
                      />
                      {modalSearch && (
                        <button
                          onClick={() => setModalSearch('')}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs"
                        >
                          ✕
                        </button>
                      )}
                    </div>

                    {modalClassOptions.length > 1 && (
                      <div className="relative">
                        <select
                          value={modalClassFilter}
                          onChange={(e) => setModalClassFilter(e.target.value)}
                          className="pl-3 pr-8 py-1.5 text-xs bg-white dark:bg-[#162032] rounded-xl border border-slate-200 dark:border-[#22324e] focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition font-medium text-slate-700 dark:text-slate-300 cursor-pointer"
                        >
                          <option value="">Tất cả các lớp ({modalClassOptions.length})</option>
                          {modalClassOptions.map((code) => (
                            <option key={code} value={code}>
                              Lớp {code}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 self-end sm:self-auto shrink-0">
                    <button
                      onClick={exportModalCSV}
                      className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#162032] hover:bg-teal-50 dark:hover:bg-teal-950/40 text-teal-800 dark:text-teal-300 hover:text-teal-900 dark:hover:text-teal-200 text-xs font-bold flex items-center space-x-1.5 border border-teal-200 dark:border-teal-800/60 transition shadow-2xs cursor-pointer"
                      title="Xuất file CSV danh sách đang lọc"
                    >
                      <Download className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                      <span>Xuất Danh Sách Này (CSV)</span>
                    </button>
                  </div>
                </div>

                {/* Table Content */}
                <div className="flex-1 overflow-y-auto p-6 min-h-[300px]">
                  {filteredModalData.length === 0 ? (
                    <div className="py-16 text-center text-slate-400 space-y-2">
                      <p className="text-sm font-semibold">Không tìm thấy học viên nào phù hợp với bộ lọc.</p>
                      <p className="text-xs text-slate-400">Vui lòng thử tìm kiếm với từ khóa khác.</p>
                    </div>
                  ) : modalState.type === 'grades' ? (
                    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-[#1e2d45]">
                      <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                        <thead className="bg-slate-50 dark:bg-[#162032] text-slate-600 dark:text-slate-400 uppercase text-[11px] font-bold tracking-wider border-b border-slate-200 dark:border-[#1e2d45]">
                          <tr>
                            <th className="px-4 py-3 text-center w-12">STT</th>
                            <th className="px-4 py-3 whitespace-nowrap">Mã HV</th>
                            <th className="px-4 py-3 whitespace-nowrap">Họ và Tên</th>
                            <th className="px-4 py-3 whitespace-nowrap">Lớp Học & Khóa Học</th>
                            <th className="px-4 py-3 whitespace-nowrap text-center">Chuyên Cần</th>
                            <th className="px-4 py-3 whitespace-nowrap text-center">Giữa Kỳ</th>
                            <th className="px-4 py-3 whitespace-nowrap text-center">Cuối Kỳ</th>
                            <th className="px-4 py-3 whitespace-nowrap text-center">Tổng Kết</th>
                            <th className="px-4 py-3 whitespace-nowrap text-center">Kết Quả</th>
                            <th className="px-4 py-3 min-w-[200px]">Nhận Xét Giáo Viên</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-[#1e2d45]">
                          {filteredModalData.map((item: any, idx: number) => {
                            const isPass = item.trangThaiHoanThanh === 'DAT';
                            const isFail = item.trangThaiHoanThanh === 'KHONG_DAT';
                            return (
                              <tr key={item.id || idx} className="hover:bg-teal-50/30 transition">
                                <td className="px-4 py-3 text-center font-mono text-slate-400">{idx + 1}</td>
                                <td className="px-4 py-3 font-mono font-bold text-teal-700 whitespace-nowrap">
                                  {item.hocVien?.maHocVien}
                                </td>
                                <td className="px-4 py-3 font-bold text-slate-900 whitespace-nowrap">
                                  {item.hocVien?.hoTen}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                  <div className="font-semibold text-slate-800">{item.lopHoc?.maLopHoc}</div>
                                  <div className="text-[11px] text-slate-500">{item.lopHoc?.tenLopHoc}</div>
                                </td>
                                <td className="px-4 py-3 text-center font-mono font-semibold">
                                  <span
                                    className={`px-1.5 py-0.5 rounded ${Number(item.diemChuyenCan || 0) < 80
                                        ? 'bg-rose-50 text-rose-700 font-bold border border-rose-200'
                                        : 'text-slate-800'
                                      }`}
                                  >
                                    {item.diemChuyenCan !== null && item.diemChuyenCan !== undefined
                                      ? `${item.diemChuyenCan}%`
                                      : '—'}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-center font-mono text-slate-700">
                                  {item.diemGiuaKy !== null && item.diemGiuaKy !== undefined ? item.diemGiuaKy : '—'}
                                </td>
                                <td className="px-4 py-3 text-center font-mono text-slate-700">
                                  {item.diemCuoiKy !== null && item.diemCuoiKy !== undefined ? item.diemCuoiKy : '—'}
                                </td>
                                <td className="px-4 py-3 text-center font-mono font-black text-sm">
                                  <span
                                    className={`${isPass
                                        ? 'text-emerald-700'
                                        : isFail
                                          ? 'text-rose-600'
                                          : 'text-slate-600'
                                      }`}
                                  >
                                    {item.diemTongKet !== null && item.diemTongKet !== undefined ? item.diemTongKet : '—'}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-center whitespace-nowrap">
                                  <span
                                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${isPass
                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                        : isFail
                                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                                          : 'bg-slate-100 text-slate-700 border-slate-200'
                                      }`}
                                  >
                                    {isPass ? 'ĐẠT CHUẨN' : isFail ? 'CHƯA ĐẠT' : 'ĐANG HỌC'}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-slate-600 text-xs italic">
                                  {item.nhanXet || 'Chưa có ghi chú đặc biệt'}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-[#1e2d45]">
                      <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                        <thead className="bg-slate-50 dark:bg-[#162032] text-slate-600 dark:text-slate-400 uppercase text-[11px] font-bold tracking-wider border-b border-slate-200 dark:border-[#1e2d45]">
                          <tr>
                            <th className="px-4 py-3 text-center w-12">STT</th>
                            <th className="px-4 py-3 whitespace-nowrap">Mã HV</th>
                            <th className="px-4 py-3 whitespace-nowrap">Họ và Tên</th>
                            <th className="px-4 py-3 whitespace-nowrap text-center">Trình Độ CEFR</th>
                            <th className="px-4 py-3 whitespace-nowrap text-center">Trạng Thái Học Tập</th>
                            <th className="px-4 py-3 whitespace-nowrap">Lớp Học Đã Đăng Ký</th>
                            <th className="px-4 py-3 whitespace-nowrap">Liên Hệ</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-[#1e2d45]">
                          {filteredModalData.map((s: any, idx: number) => {
                            const statusLabel = formatTrangThaiHocVien(s.trangThai);
                            const isStudying = s.trangThai === 'DANG_HOC';
                            const isGraduated = ['DA_TOT_NGHIEP', 'HOAN_THANH'].includes(s.trangThai);
                            const isSuspended = s.trangThai === 'BAO_LUU';

                            return (
                              <tr key={s.id || idx} className="hover:bg-teal-50/30 dark:hover:bg-teal-950/20 transition">
                                <td className="px-4 py-3 text-center font-mono text-slate-400">{idx + 1}</td>
                                <td className="px-4 py-3 font-mono font-bold text-teal-700 dark:text-teal-400 whitespace-nowrap">
                                  {s.maHocVien}
                                </td>
                                <td className="px-4 py-3 font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                                  {s.hoTen}
                                </td>
                                <td className="px-4 py-3 text-center whitespace-nowrap">
                                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-teal-50 dark:bg-teal-950/50 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800/60">
                                    CEFR {s.trinhDoCEFR || 'A1'}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-center whitespace-nowrap">
                                  <span
                                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${isStudying
                                        ? 'bg-teal-50 text-teal-700 border-teal-200'
                                        : isGraduated
                                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                          : isSuspended
                                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                                            : 'bg-rose-50 text-rose-700 border-rose-200'
                                      }`}
                                  >
                                    {statusLabel}
                                  </span>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                  {s.dangKyHoc && s.dangKyHoc.length > 0 ? (
                                    <div className="space-y-1">
                                      {s.dangKyHoc.map((dk: any) => (
                                        <span
                                          key={dk.id || dk.lopHoc?.maLopHoc}
                                          className="inline-block px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-slate-100 text-slate-700 mr-1 border border-slate-200"
                                        >
                                          {dk.lopHoc?.maLopHoc}
                                        </span>
                                      ))}
                                    </div>
                                  ) : (
                                    <span className="text-slate-400 italic text-[11px]">Chưa đăng ký lớp</span>
                                  )}
                                </td>
                                <td className="px-4 py-3 text-slate-600 whitespace-nowrap text-[11px]">
                                  <div>{s.nguoiDung?.email || '—'}</div>
                                  <div className="font-mono text-slate-500">{s.nguoiDung?.soDienThoai || '—'}</div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Modal Footer */}
                <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                  <span>
                    Hiển thị <strong>{filteredModalData.length}</strong> / {modalState.data.length} bản ghi
                  </span>
                  <button
                    onClick={closeModal}
                    className="px-4 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold transition cursor-pointer"
                  >
                    Đóng cửa sổ
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </AppLayout>
  );
}
