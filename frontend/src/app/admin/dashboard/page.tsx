'use client';

import React, { useEffect, useState } from 'react';
import { AppLayout } from '../../../components/AppLayout';
import { statisticsService } from '../../../services/api';
import Link from 'next/link';
import {
  Users,
  GraduationCap,
  BookOpen,
  DollarSign,
  TrendingUp,
  Award,
  Sparkles,
  ArrowUpRight,
  ChevronRight,
  RefreshCw,
  Clock,
  CheckCircle2,
  XCircle,
  Info,
  Search,
  X,
} from 'lucide-react';
import { ClassStudentsModal } from '../../../components/ClassStudentsModal';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [selectedClassForStudents, setSelectedClassForStudents] = useState<{
    id: number;
    name?: string;
    code?: string;
  } | null>(null);

  // Modal danh sách học viên theo kết quả đánh giá (Đạt / Không đạt / Chưa xếp loại)
  const [evalModalType, setEvalModalType] = useState<'DAT' | 'KHONG_DAT' | 'CHUA_XEP_LOAI' | null>(null);
  const [evalSearchQuery, setEvalSearchQuery] = useState('');

  const getInitials = (name?: string) => {
    if (!name) return 'HV';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const formatTime = (d: Date | null) => {
    if (!d) return '--:--:--';
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  const formatDate = (d: Date | null) => {
    if (!d) return '';
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const fetchStats = async (isManual = false) => {
    try {
      if (isManual) setRefreshing(true);
      else setLoading(true);

      const data = await statisticsService.getDashboard();
      setStats(data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Lỗi tải thống kê:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // Đóng modal khi nhấn ESC & khóa cuộn body khi modal đánh giá mở
  useEffect(() => {
    if (!evalModalType) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setEvalModalType(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [evalModalType]);

  // Lọc danh sách học viên theo kết quả đánh giá (Đạt / Không đạt / Chưa xếp loại)
  const filteredEvalList = React.useMemo(() => {
    if (!stats?.chiTietKetQua || !evalModalType) return [];
    return stats.chiTietKetQua.filter((item: any) => {
      if (item.trangThaiHoanThanh !== evalModalType) return false;
      if (!evalSearchQuery.trim()) return true;
      const q = evalSearchQuery.toLowerCase();
      const studentName = item.hocVien?.hoTen?.toLowerCase() || '';
      const studentCode = item.hocVien?.maHocVien?.toLowerCase() || '';
      const className = item.lopHoc?.tenLopHoc?.toLowerCase() || '';
      const classCode = item.lopHoc?.maLopHoc?.toLowerCase() || '';
      return (
        studentName.includes(q) ||
        studentCode.includes(q) ||
        className.includes(q) ||
        classCode.includes(q)
      );
    });
  }, [stats?.chiTietKetQua, evalModalType, evalSearchQuery]);

  return (
    <AppLayout
      allowedRoles={['QUAN_LY']}
      title="Bảng Điều Khiển Quản Trị"
      subtitle="Tổng quan hoạt động đào tạo, tài chính và phân tích hệ thống"
    >
      {loading ? (
        <div className="py-20 flex justify-center items-center">
          <div className="w-8 h-8 border-4 border-teal-500/20 border-t-teal-600 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Header Bar with Live Pulse & Last Sync Time */}
          <div className="flex justify-between items-center bg-white dark:bg-[#111928] p-3 sm:p-3.5 rounded-2xl border border-slate-200/90 dark:border-[#1e2d45] shadow-xs">
            <div className="flex items-center gap-3">
              {/* Chấm xanh nhấp nháy Live Indicator */}
              <div className="relative flex items-center justify-center w-3 h-3 shrink-0 ml-0.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </div>
              <div className="flex flex-col">
                {/* Dòng 1: Dữ liệu thời gian thực */}
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-100">
                  <span>Dữ liệu thời gian thực</span>
                  <span className="text-[9px] font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 px-1.5 py-0.2 rounded-md">
                    LIVE
                  </span>
                </div>
                {/* Dòng 2: Đồng bộ lần cuối */}
                <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                  <span>Đồng bộ lần cuối:</span>
                  <span className="font-mono font-bold text-slate-700 dark:text-slate-200">
                    {formatTime(lastUpdated)}
                  </span>
                  {lastUpdated && (
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 hidden sm:inline">
                      ({formatDate(lastUpdated)})
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={() => fetchStats(true)}
              disabled={refreshing}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-teal-50 dark:bg-[#162032] dark:hover:bg-teal-950/40 text-slate-700 dark:text-slate-200 hover:text-teal-700 dark:hover:text-teal-300 border border-slate-200 dark:border-[#22324e] hover:border-teal-300 dark:hover:border-teal-700 text-xs font-bold flex items-center space-x-1.5 transition cursor-pointer shadow-2xs disabled:opacity-50"
              title="Cập nhật lại số liệu thống kê mới nhất (không cần tải lại trang)"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-teal-600 dark:text-teal-400' : ''}`} />
              <span>{refreshing ? 'Đang tải...' : 'Làm mới số liệu'}</span>
            </button>
          </div>

          {/* Key Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. Tổng Học Viên -> /admin/students */}
            <Link
              href="/admin/students"
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-teal-500 hover:shadow-lg hover:shadow-teal-500/10 hover:-translate-y-0.5 transition-all duration-200 group cursor-pointer relative overflow-hidden block"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-1">
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider group-hover:text-teal-600 transition-colors">
                      Tổng Học Viên
                    </p>
                    <ArrowUpRight className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 group-hover:text-teal-600 transition-all -translate-x-1 group-hover:translate-x-0" />
                  </div>
                  <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">
                    {stats?.tongQuan?.tongHocVien || 0}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 group-hover:scale-110 group-hover:bg-teal-600 group-hover:text-white transition-all duration-200">
                  <Users className="w-6 h-6" />
                </div>
              </div>
              <div className="mt-3 flex items-center text-xs text-teal-700 dark:text-teal-400 font-semibold">
                <TrendingUp className="w-3.5 h-3.5 mr-1 text-emerald-500" />
                <span>Đang theo học tại trung tâm</span>
              </div>
            </Link>

            {/* 2. Lớp Đang Mở -> /admin/classes */}
            <Link
              href="/admin/classes"
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-teal-500 hover:shadow-lg hover:shadow-teal-500/10 hover:-translate-y-0.5 transition-all duration-200 group cursor-pointer relative overflow-hidden block"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-1">
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider group-hover:text-teal-600 transition-colors">
                      Lớp Đang Mở
                    </p>
                    <ArrowUpRight className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 group-hover:text-teal-600 transition-all -translate-x-1 group-hover:translate-x-0" />
                  </div>
                  <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">
                    {stats?.tongQuan?.lopDangMo || 0}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 group-hover:scale-110 group-hover:bg-sky-600 group-hover:text-white transition-all duration-200">
                  <GraduationCap className="w-6 h-6" />
                </div>
              </div>
              <div className="mt-3 flex items-center text-xs text-sky-700 dark:text-sky-400 font-semibold">
                <span>{stats?.tongQuan?.tongKhoaHoc || 0} chương trình đào tạo</span>
              </div>
            </Link>

            {/* 3. Giáo Viên -> /admin/teachers */}
            <Link
              href="/admin/teachers"
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-teal-500 hover:shadow-lg hover:shadow-teal-500/10 hover:-translate-y-0.5 transition-all duration-200 group cursor-pointer relative overflow-hidden block"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-1">
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider group-hover:text-teal-600 transition-colors">
                      Đội Ngũ Giáo Viên
                    </p>
                    <ArrowUpRight className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 group-hover:text-teal-600 transition-all -translate-x-1 group-hover:translate-x-0" />
                  </div>
                  <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">
                    {stats?.tongQuan?.tongGiaoVien || 0}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 group-hover:scale-110 group-hover:bg-amber-600 group-hover:text-white transition-all duration-200">
                  <BookOpen className="w-6 h-6" />
                </div>
              </div>
              <div className="mt-3 flex items-center text-xs text-amber-700 dark:text-amber-400 font-semibold">
                <span>Trình độ đạt chuẩn quốc tế</span>
              </div>
            </Link>

            {/* 4. Doanh Thu -> /admin/fees */}
            <Link
              href="/admin/fees"
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-teal-500 hover:shadow-lg hover:shadow-teal-500/10 hover:-translate-y-0.5 transition-all duration-200 group cursor-pointer relative overflow-hidden block"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-1">
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider group-hover:text-emerald-600 transition-colors">
                      Tổng Doanh Thu
                    </p>
                    <ArrowUpRight className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 group-hover:text-emerald-600 transition-all -translate-x-1 group-hover:translate-x-0" />
                  </div>
                  <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                    {(stats?.tongQuan?.tongDoanhThu || 0).toLocaleString()} đ
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-200">
                  <DollarSign className="w-6 h-6" />
                </div>
              </div>
              <div className="mt-3 flex items-center text-xs text-emerald-700 dark:text-emerald-400 font-semibold">
                <span>Thanh toán thực tế đã thu</span>
              </div>
            </Link>
          </div>

          {/* Sĩ số các lớp & Tỷ lệ đạt (Cân bằng chiều cao 2 bên bằng items-stretch) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            {/* Cột trái (2/3): Sĩ số lớp học */}
            <div className="lg:col-span-2 p-4 sm:p-6 rounded-2xl bg-white dark:bg-[#141c2e] border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col h-full">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2 shrink-0">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">Tình Trạng Sĩ Số Các Lớp Đang Mở</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Nhấn vào lớp học bất kỳ để xem danh sách học viên chi tiết ({stats?.siSoCacLop?.length || 0} lớp)</p>
                </div>
                <span className="self-start sm:self-auto text-xs font-semibold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 px-2.5 py-1 rounded-lg border border-teal-200 dark:border-teal-800 flex items-center gap-1.5 shadow-xs">
                  <Users className="w-3.5 h-3.5" />
                  <span>Click xem DS học viên</span>
                </span>
              </div>

              <div className="space-y-3 max-h-[440px] overflow-y-auto pr-1.5 custom-scrollbar flex-1">
                {stats?.siSoCacLop?.length > 0 ? (
                  stats.siSoCacLop.map((c: any) => {
                    const percent = Math.min(100, Math.round((c.siSoHienTai / c.siSoToiDa) * 100));
                    return (
                      <div
                        key={c.id}
                        onClick={() =>
                          setSelectedClassForStudents({
                            id: Number(c.id),
                            name: c.tenLopHoc,
                            code: c.maLopHoc,
                          })
                        }
                        className="p-3.5 sm:p-4 rounded-xl bg-slate-50 dark:bg-[#111827] border border-slate-200/80 dark:border-[#1e2d45] hover:border-teal-500 dark:hover:border-teal-500/70 hover:bg-white dark:hover:bg-[#152033] hover:shadow-md hover:shadow-teal-500/10 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group"
                        title={`Bấm để xem danh sách học viên của lớp ${c.tenLopHoc}`}
                      >
                        <div className="flex justify-between items-center mb-2 gap-2">
                          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1">
                            <span className="text-[11px] sm:text-xs font-bold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 px-1.5 sm:px-2 py-0.5 rounded group-hover:bg-teal-600 group-hover:text-white transition-colors shrink-0">
                              {c.maLopHoc}
                            </span>
                            <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors truncate">
                              {c.tenLopHoc}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
                            <span className="text-[11px] sm:text-xs font-bold text-slate-600 dark:text-slate-300">
                              {c.siSoHienTai} / {c.siSoToiDa} HV
                            </span>
                            <span className="text-[11px] sm:text-xs font-bold text-teal-600 dark:text-teal-400 opacity-90 sm:opacity-80 group-hover:opacity-100 flex items-center gap-0.5 bg-teal-50 dark:bg-teal-950/60 px-1.5 sm:px-2 py-0.5 rounded border border-teal-200/70 dark:border-teal-800 group-hover:border-teal-500 transition-all shadow-xs">
                              <span className="hidden sm:inline">Xem DS</span>
                              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                            </span>
                          </div>
                        </div>
                        <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${percent >= 90
                              ? 'bg-rose-500'
                              : percent >= 60
                                ? 'bg-amber-500'
                                : 'bg-teal-600'
                              }`}
                            style={{ width: `${percent}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-slate-500 dark:text-slate-400 py-6 text-center">Chưa có dữ liệu lớp học.</p>
                )}
              </div>
            </div>

            {/* Cột phải (1/3): Tỷ lệ hoàn thành & Danh sách tương tác */}
            <div className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-[#141c2e] border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col justify-between h-full hover:border-teal-500/40 hover:shadow-lg transition-all duration-200">
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <Award className="w-5 h-5 text-amber-500 shrink-0" />
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">Tỷ Lệ Đạt Đầu Ra</h3>
                </div>

                <div className="py-4 text-center">
                  <div className="inline-flex items-center justify-center w-28 h-28 rounded-full bg-teal-50 dark:bg-teal-950/60 border-4 border-teal-600 dark:border-teal-500 text-3xl font-black text-teal-700 dark:text-teal-300 mb-2 shadow-sm hover:scale-105 transition-transform cursor-default">
                    {stats?.tyLeHoanThanh?.tyLeDatPhanTram ?? 0}%
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 font-bold">
                    Đạt {stats?.tyLeHoanThanh?.dat ?? 0}/{(stats?.tyLeHoanThanh?.dat ?? 0) + (stats?.tyLeHoanThanh?.khongDat ?? 0)} học viên đã đánh giá
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    (Chiếm {stats?.tongQuan?.tongHocVien ? (((stats?.tyLeHoanThanh?.dat ?? 0) / stats.tongQuan.tongHocVien) * 100).toFixed(1) : 0}% trên tổng {stats?.tongQuan?.tongHocVien || 0} học viên toàn trung tâm)
                  </p>
                </div>

                {/* 3 Nút tương tác xem danh sách học viên theo kết quả */}
                <div className="space-y-2 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setEvalModalType('DAT');
                      setEvalSearchQuery('');
                    }}
                    className="w-full flex justify-between items-center p-2.5 rounded-xl bg-teal-50/70 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border border-teal-200/80 dark:border-teal-800/80 hover:bg-teal-100/80 dark:hover:bg-teal-900/60 hover:shadow-xs transition-all cursor-pointer group text-left"
                    title="Bấm để xem danh sách học viên ĐẠT yêu cầu"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                      <span className="font-semibold text-slate-800 dark:text-slate-200">ĐẠT yêu cầu:</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-teal-700 dark:text-teal-300">{stats?.tyLeHoanThanh?.dat ?? 0} học viên</span>

                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setEvalModalType('KHONG_DAT');
                      setEvalSearchQuery('');
                    }}
                    className="w-full flex justify-between items-center p-2.5 rounded-xl bg-rose-50/70 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200/80 dark:border-rose-800/80 hover:bg-rose-100/80 dark:hover:bg-rose-900/60 hover:shadow-xs transition-all cursor-pointer group text-left"
                    title="Bấm để xem danh sách học viên KHÔNG ĐẠT yêu cầu"
                  >
                    <div className="flex items-center gap-2">
                      <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                      <span className="font-semibold text-slate-800 dark:text-slate-200">KHÔNG ĐẠT:</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-rose-700 dark:text-rose-300">{stats?.tyLeHoanThanh?.khongDat ?? 0} học viên</span>

                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setEvalModalType('CHUA_XEP_LOAI');
                      setEvalSearchQuery('');
                    }}
                    className="w-full flex justify-between items-center p-2.5 rounded-xl bg-slate-100/70 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-200/70 dark:hover:bg-slate-700/60 hover:shadow-xs transition-all cursor-pointer group text-left"
                    title="Bấm để xem danh sách học viên Đang học hoặc Chưa xếp loại"
                  >
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0" />
                      <span className="font-semibold text-slate-800 dark:text-slate-200">Đang học / Chưa xếp loại:</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-800 dark:text-slate-200">{stats?.tyLeHoanThanh?.chuaXepLoai ?? 0} học viên</span>

                    </div>
                  </button>
                </div>
              </div>

              {/* Đoạn text nổi bật làm rõ chuẩn đầu ra & cân bằng chiều cao 2 card */}
              <div className="mt-4 p-3.5 rounded-xl bg-gradient-to-r from-teal-500/10 via-cyan-500/10 to-transparent border border-teal-500/20 text-slate-700 dark:text-slate-300 flex items-start space-x-3">
                <div className="p-1.5 rounded-lg bg-teal-500/15 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5">
                  <Award className="w-4 h-4" />
                </div>
                <div className="text-[11px] leading-relaxed">
                  <span className="font-bold text-teal-700 dark:text-teal-300 block mb-0.5">
                    Chuẩn Đánh Giá Đầu Ra ETC:
                  </span>
                  Học viên được công nhận hoàn thành khi đạt đồng thời{' '}
                  <strong className="text-slate-900 dark:text-slate-100 font-semibold">Điểm Tổng Kết ≥ 50</strong>{' '}
                  và <strong className="text-slate-900 dark:text-slate-100 font-semibold">Chuyên Cần ≥ 80%</strong>.
                  Bấm vào từng mục ở trên để mở xem chi tiết danh sách học viên tương ứng.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal xem danh sách học viên theo lớp */}
      {selectedClassForStudents && (
        <ClassStudentsModal
          classId={selectedClassForStudents.id}
          initialClassName={selectedClassForStudents.name}
          initialClassCode={selectedClassForStudents.code}
          onClose={() => setSelectedClassForStudents(null)}
        />
      )}

      {/* Modal xem danh sách học viên theo kết quả đánh giá (Đạt / Không đạt / Chưa xếp loại) */}
      {evalModalType && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4"
          onClick={() => setEvalModalType(null)}
        >
          <div
            className="bg-white dark:bg-[#111928] w-full max-w-5xl max-h-[90vh] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-start gap-4">
              <div className="flex items-start gap-3">
                <div
                  className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${evalModalType === 'DAT'
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                    : evalModalType === 'KHONG_DAT'
                      ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                      : 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20'
                    }`}
                >
                  {evalModalType === 'DAT' ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : evalModalType === 'KHONG_DAT' ? (
                    <XCircle className="w-5 h-5" />
                  ) : (
                    <Clock className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-slate-900 dark:text-white text-base sm:text-lg">
                      {evalModalType === 'DAT'
                        ? 'Danh Sách Học Viên ĐẠT Yêu Cầu Đầu Ra'
                        : evalModalType === 'KHONG_DAT'
                          ? 'Danh Sách Học Viên KHÔNG ĐẠT Yêu Cầu Đầu Ra'
                          : 'Danh Sách Học Viên Đang Học / Chưa Xếp Loại'}
                    </h3>
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${evalModalType === 'DAT'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                        : evalModalType === 'KHONG_DAT'
                          ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800'
                          : 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
                        }`}
                    >
                      {filteredEvalList.length} học viên
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {evalModalType === 'DAT'
                      ? 'Học viên hoàn thành môn học với Điểm Tổng Kết ≥ 50 và Chuyên Cần ≥ 80%'
                      : evalModalType === 'KHONG_DAT'
                        ? 'Học viên có Điểm Tổng Kết < 50 hoặc Chuyên Cần < 80% (cần thi lại / học lại)'
                        : 'Học viên đang trong tiến trình học hoặc chưa có đủ dữ liệu điểm tổng kết'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEvalModalType(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Đóng modal (ESC)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Search Bar */}
            <div className="p-3 sm:p-4 bg-slate-50/70 dark:bg-[#152033] border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={evalSearchQuery}
                  onChange={(e) => setEvalSearchQuery(e.target.value)}
                  placeholder="Tìm theo tên học viên, mã HV, lớp học..."
                  className="w-full pl-9 pr-8 py-1.5 text-xs rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-teal-500 transition-all"
                />
                {evalSearchQuery && (
                  <button
                    type="button"
                    onClick={() => setEvalSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 self-end sm:self-auto">
                Hiển thị <span className="font-bold text-slate-800 dark:text-slate-200">{filteredEvalList.length}</span> kết quả
              </div>
            </div>

            {/* Modal Table Content */}
            <div className="overflow-y-auto max-h-[60vh] p-3 sm:p-4 custom-scrollbar">
              {filteredEvalList.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-sm">
                  Không tìm thấy học viên nào phù hợp với từ khóa tìm kiếm.
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                  <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                    <thead className="bg-slate-50 dark:bg-[#162032] text-slate-600 dark:text-slate-400 uppercase text-[11px] font-bold tracking-wider border-b border-slate-200 dark:border-slate-800">
                      <tr>
                        <th className="px-3.5 py-3 text-center w-12">STT</th>
                        <th className="px-3.5 py-3 whitespace-nowrap">Học Viên</th>
                        <th className="px-3.5 py-3 whitespace-nowrap">Lớp Học</th>
                        <th className="px-3.5 py-3 whitespace-nowrap text-center">Chuyên Cần</th>
                        <th className="px-3.5 py-3 whitespace-nowrap text-center">Giữa Kỳ</th>
                        <th className="px-3.5 py-3 whitespace-nowrap text-center">Cuối Kỳ</th>
                        <th className="px-3.5 py-3 whitespace-nowrap text-center">Tổng Kết</th>
                        <th className="px-3.5 py-3 whitespace-nowrap text-center">Trạng Thái</th>
                        <th className="px-3.5 py-3 min-w-[180px]">Nhận Xét</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {filteredEvalList.map((item: any, idx: number) => {
                        const isPass = item.trangThaiHoanThanh === 'DAT';
                        const isFail = item.trangThaiHoanThanh === 'KHONG_DAT';
                        const cc = item.diemChuyenCan !== null && item.diemChuyenCan !== undefined ? Number(item.diemChuyenCan) : null;
                        return (
                          <tr
                            key={item.id || idx}
                            className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                          >
                            <td className="px-3.5 py-3 text-center font-mono text-slate-400">
                              {idx + 1}
                            </td>
                            <td className="px-3.5 py-3 whitespace-nowrap">
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 font-bold flex items-center justify-center text-xs shrink-0">
                                  {getInitials(item.hocVien?.hoTen)}
                                </div>
                                <div>
                                  <div className="font-bold text-slate-900 dark:text-slate-100">
                                    {item.hocVien?.hoTen || 'Chưa cập nhật'}
                                  </div>
                                  <div className="text-[11px] font-mono text-teal-600 dark:text-teal-400">
                                    {item.hocVien?.maHocVien}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-3.5 py-3 whitespace-nowrap">
                              <div className="font-semibold text-slate-800 dark:text-slate-200">
                                {item.lopHoc?.tenLopHoc || '—'}
                              </div>
                              <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                                {item.lopHoc?.maLopHoc}
                              </div>
                            </td>
                            <td className="px-3.5 py-3 text-center font-mono font-semibold whitespace-nowrap">
                              {cc !== null ? (
                                <span
                                  className={`px-1.5 py-0.5 rounded text-xs ${cc < 80
                                    ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-bold border border-rose-200 dark:border-rose-800'
                                    : 'text-slate-800 dark:text-slate-200 font-medium'
                                    }`}
                                >
                                  {cc}%
                                </span>
                              ) : (
                                <span className="text-slate-400">—</span>
                              )}
                            </td>
                            <td className="px-3.5 py-3 text-center font-mono text-slate-700 dark:text-slate-300 whitespace-nowrap">
                              {item.diemGiuaKy !== null && item.diemGiuaKy !== undefined ? item.diemGiuaKy : '—'}
                            </td>
                            <td className="px-3.5 py-3 text-center font-mono text-slate-700 dark:text-slate-300 whitespace-nowrap">
                              {item.diemCuoiKy !== null && item.diemCuoiKy !== undefined ? item.diemCuoiKy : '—'}
                            </td>
                            <td className="px-3.5 py-3 text-center font-mono font-black text-sm whitespace-nowrap">
                              <span
                                className={
                                  isPass
                                    ? 'text-emerald-600 dark:text-emerald-400'
                                    : isFail
                                      ? 'text-rose-600 dark:text-rose-400'
                                      : 'text-slate-600 dark:text-slate-400'
                                }
                              >
                                {item.diemTongKet !== null && item.diemTongKet !== undefined ? item.diemTongKet : '—'}
                              </span>
                            </td>
                            <td className="px-3.5 py-3 text-center whitespace-nowrap">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${isPass
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                                  : isFail
                                    ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800'
                                    : 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
                                  }`}
                              >
                                {isPass ? 'ĐẠT YÊU CẦU' : isFail ? 'KHÔNG ĐẠT' : 'ĐANG HỌC'}
                              </span>
                            </td>
                            <td className="px-3.5 py-3 text-slate-600 dark:text-slate-400 text-xs italic">
                              {item.nhanXet || 'Chưa có ghi chú đặc biệt'}
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
            <div className="p-3.5 sm:p-4 bg-slate-50/70 dark:bg-[#152033] border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Tổng cộng:{' '}
                <span className="font-bold text-slate-900 dark:text-slate-100">
                  {filteredEvalList.length}
                </span>{' '}
                học viên trong danh mục này
              </div>
              <button
                type="button"
                onClick={() => setEvalModalType(null)}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
