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
} from 'lucide-react';
import { formatTrangThaiHocVien, formatTrangThaiLopHoc } from '../../../utils/formatters';

type TabType = 'overview' | 'students_cefr' | 'classes_fill';

export default function AdminReportsPage() {
  const [stats, setStats] = useState<any>(null);
  const [classes, setClasses] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsData, classesData, studentsData, invoicesData, paymentsData] = await Promise.all([
          statisticsService.getDashboard().catch(() => null),
          classesService.getAll().catch(() => []),
          usersService.getStudents(1, 100).catch(() => ({ items: [] })),
          enrollmentsService.getInvoices().catch(() => []),
          enrollmentsService.getPayments().catch(() => []),
        ]);

        setStats(statsData);
        setClasses(Array.isArray(classesData) ? classesData : []);
        setStudents(studentsData?.items || []);
        setInvoices(Array.isArray(invoicesData) ? invoicesData : []);
        setPayments(Array.isArray(paymentsData) ? paymentsData : []);
      } catch (err) {
        console.error('Lỗi khi tải dữ liệu báo cáo:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Tính toán số liệu tài chính chuyên sâu
  const financeMetrics = useMemo(() => {
    const totalBilled = invoices.reduce((sum, inv) => sum + Number(inv.soTienPhaiTra || 0), 0);
    const totalCollected = invoices.reduce((sum, inv) => sum + Number(inv.soTienDaTra || 0), 0);
    const totalDebt = Math.max(0, totalBilled - totalCollected);
    const collectionRate = totalBilled > 0 ? ((totalCollected / totalBilled) * 100).toFixed(1) : '100';

    // Cơ cấu thanh toán
    const bankPayments = payments
      .filter((p) => p.phuongThuc === 'CHUYEN_KHOAN')
      .reduce((sum, p) => sum + Number(p.soTien || 0), 0);
    const cashPayments = payments
      .filter((p) => p.phuongThuc === 'TIEN_MAT')
      .reduce((sum, p) => sum + Number(p.soTien || 0), 0);
    const totalPaymentSum = bankPayments + cashPayments || 1;

    const bankPercent = Math.round((bankPayments / totalPaymentSum) * 100);
    const cashPercent = 100 - bankPercent;

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

  // Phân bổ trình độ học viên theo khung CEFR
  const cefrDistribution = useMemo(() => {
    const counts: Record<string, number> = { A1: 0, A2: 0, B1: 0, B2: 0, C1: 0, C2: 0 };
    students.forEach((s) => {
      const level = s.hoSoHocVien?.trinhDoCEFR || 'B1';
      if (counts[level] !== undefined) counts[level]++;
      else counts['B1']++;
    });

    const total = students.length || 1;
    return Object.entries(counts).map(([level, count]) => ({
      level,
      count,
      percent: Math.round((count / total) * 100),
    }));
  }, [students]);

  // Cơ cấu trạng thái học viên
  const studentStatusMetrics = useMemo(() => {
    const total = students.length || 1;
    const dangHoc = students.filter((s) => s.hoSoHocVien?.trangThaiHoc === 'DANG_HOC').length;
    const baoLuu = students.filter((s) => s.hoSoHocVien?.trangThaiHoc === 'BAO_LUU').length;
    const hoanThanh = students.filter((s) => s.hoSoHocVien?.trangThaiHoc === 'HOAN_THANH').length;
    const thoiHoc = students.filter((s) => s.hoSoHocVien?.trangThaiHoc === 'THOI_HOC').length;

    return [
      { label: 'Đang Theo Học', count: dangHoc, percent: Math.round((dangHoc / total) * 100), color: 'bg-teal-500', text: 'text-teal-700' },
      { label: 'Đã Hoàn Thành Khóa', count: hoanThanh, percent: Math.round((hoanThanh / total) * 100), color: 'bg-emerald-500', text: 'text-emerald-700' },
      { label: 'Đang Bảo Lưu', count: baoLuu, percent: Math.round((baoLuu / total) * 100), color: 'bg-amber-500', text: 'text-amber-700' },
      { label: 'Đã Thôi Học', count: thoiHoc, percent: Math.round((thoiHoc / total) * 100), color: 'bg-rose-500', text: 'text-rose-700' },
    ];
  }, [students]);

  // Xuất file CSV báo cáo lớp học
  const exportToCSV = () => {
    const headers = ['Mã Lớp', 'Tên Lớp Học', 'Khóa Học', 'Sĩ Số Thực Tế', 'Sĩ Số Tối Đa', 'Tỷ Lệ Lấp Đầy', 'Trạng Thái'];
    const rows = classes.map((c) => [
      c.maLopHoc,
      `"${c.tenLopHoc}"`,
      `"${c.khoaHoc?.tenKhoaHoc || ''}"`,
      c.siSoHienTai,
      c.siSoToiDa,
      `${Math.round((c.siSoHienTai / (c.siSoToiDa || 1)) * 100)}%`,
      formatTrangThaiLopHoc(c.trangThai),
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Bao_Cao_Thong_Ke_ETC_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
        <div className="space-y-6">
          {/* Header Action Bar & Navigation Tabs */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-sm">
            {/* Tabs */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-1 md:pb-0">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 whitespace-nowrap cursor-pointer ${
                  activeTab === 'overview'
                    ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-md shadow-teal-600/20'
                    : 'bg-slate-100 text-slate-700 hover:bg-teal-50 hover:text-teal-800'
                }`}
              >
                <DollarSign className="w-4 h-4" />
                <span>Tổng Quan & Tài Chính</span>
              </button>
              <button
                onClick={() => setActiveTab('students_cefr')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 whitespace-nowrap cursor-pointer ${
                  activeTab === 'students_cefr'
                    ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-md shadow-teal-600/20'
                    : 'bg-slate-100 text-slate-700 hover:bg-teal-50 hover:text-teal-800'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Học Viên & Chuẩn CEFR</span>
              </button>
              <button
                onClick={() => setActiveTab('classes_fill')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 whitespace-nowrap cursor-pointer ${
                  activeTab === 'classes_fill'
                    ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-md shadow-teal-600/20'
                    : 'bg-slate-100 text-slate-700 hover:bg-teal-50 hover:text-teal-800'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                <span>Hiệu Suất Lớp & Đạt Chuẩn</span>
              </button>
            </div>

            {/* Export Actions */}
            <div className="flex items-center space-x-2 self-end md:self-auto">
              <button
                onClick={exportToCSV}
                className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-teal-700 hover:text-teal-800 text-xs font-bold flex items-center space-x-1.5 border border-slate-200 transition shadow-sm cursor-pointer"
                title="Tải bảng tính CSV"
              >
                <Download className="w-4 h-4 text-teal-600" />
                <span>Xuất CSV</span>
              </button>
              <button
                onClick={() => window.print()}
                className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 text-xs font-bold flex items-center space-x-1.5 border border-slate-200 transition shadow-sm cursor-pointer"
                title="In hoặc lưu định dạng PDF"
              >
                <Printer className="w-4 h-4 text-slate-600" />
                <span>In Báo Cáo</span>
              </button>
            </div>
          </div>

          {/* TAB 1: TỔNG QUAN & TÀI CHÍNH */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* 4 Cards Chỉ Số Tài Chính */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Doanh Thu Đã Thu</p>
                      <p className="text-2xl font-black text-emerald-700 mt-1">
                        {financeMetrics.totalCollected.toLocaleString()} đ
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
                      <DollarSign className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-center text-xs text-emerald-700 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                    <span>Tỷ lệ thu hồi học phí: {financeMetrics.collectionRate}%</span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Công Nợ Còn Phải Thu</p>
                      <p className="text-2xl font-black text-amber-700 mt-1">
                        {financeMetrics.totalDebt.toLocaleString()} đ
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-amber-50 text-amber-600">
                      <Clock className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-center text-xs text-slate-500 font-medium">
                    <span>Học viên đang học chưa thanh toán đủ</span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Quy Mô Học Viên</p>
                      <p className="text-2xl font-black text-teal-700 mt-1">
                        {stats?.tongQuan?.tongHocVien || students.length || 0}
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-teal-50 text-teal-600">
                      <Users className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-center text-xs text-teal-700 font-semibold">
                    <span>Học viên ghi danh toàn hệ thống</span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Lớp Đang Hoạt Động</p>
                      <p className="text-2xl font-black text-sky-700 mt-1">
                        {classes.length || stats?.tongQuan?.lopDangMo || 0}
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-sky-50 text-sky-600">
                      <Building2 className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-center text-xs text-sky-700 font-semibold">
                    <span>Số lớp đang tuyển sinh & đang học</span>
                  </div>
                </div>
              </div>

              {/* Cơ Cấu Hình Thức Thanh Toán & Tiến Độ Tài Chính */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
                    <CreditCard className="w-4 h-4 text-teal-600" />
                    <span>Cơ Cấu Hình Thức Thu Phí</span>
                  </h3>
                  <div className="space-y-3 pt-2">
                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span className="text-teal-700 flex items-center gap-1.5">
                          <span>💳 Chuyển Khoản Ngân Hàng</span>
                        </span>
                        <span className="text-slate-800">
                          {financeMetrics.bankPayments.toLocaleString()} đ ({financeMetrics.bankPercent}%)
                        </span>
                      </div>
                      <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full transition-all duration-500"
                          style={{ width: `${financeMetrics.bankPercent}%` }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span className="text-amber-700 flex items-center gap-1.5">
                          <span>💵 Tiền Mặt Trực Tiếp</span>
                        </span>
                        <span className="text-slate-800">
                          {financeMetrics.cashPayments.toLocaleString()} đ ({financeMetrics.cashPercent}%)
                        </span>
                      </div>
                      <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500"
                          style={{ width: `${financeMetrics.cashPercent}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-500 italic pt-2">
                    * Thống kê tự động từ các phiếu thu thực tế đã quyết toán qua cổng kế toán của ETC English.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
                    <Award className="w-4 h-4 text-teal-600" />
                    <span>Hiệu Suất Tốt Nghiệp & Chuẩn Đầu Ra</span>
                  </h3>
                  <div className="grid grid-cols-3 gap-3 text-center pt-2">
                    <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
                      <p className="text-[10px] font-bold text-emerald-700 uppercase">ĐẠT CHUẨN</p>
                      <p className="text-xl font-black text-emerald-800 mt-0.5">{stats?.tyLeHoanThanh?.dat || 0}</p>
                      <p className="text-[10px] text-emerald-600 mt-0.5">Cấp chứng chỉ</p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200">
                      <p className="text-[10px] font-bold text-rose-700 uppercase">CHƯA ĐẠT</p>
                      <p className="text-xl font-black text-rose-800 mt-0.5">{stats?.tyLeHoanThanh?.khongDat || 0}</p>
                      <p className="text-[10px] text-rose-600 mt-0.5">Cần thi lại</p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                      <p className="text-[10px] font-bold text-slate-600 uppercase">ĐANG HỌC</p>
                      <p className="text-xl font-black text-slate-800 mt-0.5">{stats?.tyLeHoanThanh?.chuaXepLoai || 0}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">Chưa xếp loại</p>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex justify-between items-center">
                    <span className="font-medium">Tỷ lệ hoàn thành toàn khóa:</span>
                    <strong className="text-teal-700 text-sm font-black">{stats?.tyLeHoanThanh?.tyLeDatPhanTram || 0}%</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PHÂN TÍCH HỌC VIÊN & CHUẨN CEFR */}
          {activeTab === 'students_cefr' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Phân bổ CEFR */}
                <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
                      <Layers className="w-4 h-4 text-teal-600" />
                      <span>Phân Bổ Trình Độ Đầu Vào (Khung CEFR)</span>
                    </h3>
                    <span className="text-xs font-mono font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-md border border-teal-200">
                      {students.length} Học Viên
                    </span>
                  </div>

                  <div className="space-y-3.5 pt-2">
                    {cefrDistribution.map((item) => (
                      <div key={item.level} className="space-y-1">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="font-mono text-slate-700">CEFR {item.level}</span>
                          <span className="text-slate-500">
                            {item.count} học viên ({item.percent}%)
                          </span>
                        </div>
                        <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              ['A1', 'A2'].includes(item.level)
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
                </div>

                {/* Phân bổ trạng thái học tập */}
                <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
                    <PieChart className="w-4 h-4 text-teal-600" />
                    <span>Cơ Cấu Trạng Thái Học Tập Của Học Viên</span>
                  </h3>

                  <div className="space-y-3 pt-2">
                    {studentStatusMetrics.map((status) => (
                      <div key={status.label} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                        <div className="flex justify-between items-center text-xs font-bold">
                          <span className={status.text}>{status.label}</span>
                          <span className="text-slate-800 font-mono">
                            {status.count} HV ({status.percent}%)
                          </span>
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
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: HIỆU SUẤT LỚP HỌC & TỐT NGHIỆP */}
          {activeTab === 'classes_fill' && (
            <div className="space-y-6">
              {/* Bảng Chi Tiết Hiệu Suất Từng Lớp */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Hiệu Suất Tuyển Sinh & Tỷ Lệ Lấp Đầy Từng Lớp</h3>
                    <p className="text-xs text-slate-500">Theo dõi số lượng học viên ghi danh so với sĩ số quy định của từng lớp</p>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-200 self-start">
                    Tổng {classes.length} Lớp Học
                  </span>
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
                                    className={`h-full rounded-full transition-all duration-300 ${
                                      fillPercent >= 90
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
                                className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                                  c.trangThai === 'DANG_MO_DANG_KY'
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
        </div>
      )}
    </AppLayout>
  );
}
