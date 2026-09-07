'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { AppLayout } from '../../../components/AppLayout';
import { classesService, enrollmentsService, authService, gradesService } from '../../../services/api';
import { LopHoc } from '../../../types';
import {
  formatTrangThaiDangKy,
  formatTrangThaiHoaDon,
  formatTrangThaiLopHoc,
} from '../../../utils/formatters';
import {
  BookOpen,
  CheckCircle,
  AlertCircle,
  Clock,
  Users,
  ArrowRight,
  Sparkles,
  Check,
  AlertTriangle,
  Search,
  Filter,
  CheckCircle2,
  Calendar,
  Layers,
  GraduationCap,
  Bot,
  X,
  CreditCard,
  MapPin,
  UserCheck,
} from 'lucide-react';

const CEFR_RANKS: Record<string, number> = {
  A1: 1,
  A2: 2,
  B1: 3,
  B2: 4,
  C1: 5,
  C2: 6,
};

const formatDate = (d?: string | Date) => {
  if (!d) return 'Chưa xác định';
  return new Date(d).toLocaleDateString('vi-VN');
};

export default function StudentEnrollPage() {
  const [classes, setClasses] = useState<LopHoc[]>([]);
  const [user, setUser] = useState<any>(null);
  const [myEnrollments, setMyEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrollingId, setEnrollingId] = useState<number | null>(null);
  const [cancellingId, setCancellingId] = useState<number | null>(null);
  const [confirmEnrollClass, setConfirmEnrollClass] = useState<LopHoc | null>(null);
  const [confirmCancelClass, setConfirmCancelClass] = useState<any | null>(null);
  const [cancelModalError, setCancelModalError] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [activeTab, setActiveTab] = useState<'all' | 'enrolled'>('all');
  const [search, setSearch] = useState('');
  const [selectedCefr, setSelectedCefr] = useState<string>('');

  const fetchData = async () => {
    try {
      const [list, me, studentEnrollments] = await Promise.all([
        classesService.getAll(undefined, 'DANG_MO_DANG_KY'),
        authService.getMe(),
        gradesService.getStudentSchedule().catch(() => []),
      ]);
      const openClasses = (list || []).filter(
        (c: LopHoc) =>
          c.trangThai === 'DANG_MO_DANG_KY' &&
          c.khoaHoc?.trangThai !== 'NGUNG_HOAT_DONG'
      );
      setClasses(openClasses);
      setUser(me);
      setMyEnrollments(studentEnrollments || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEnroll = async (classId: number) => {
    if (!user?.hoSoHocVien?.id) {
      alert('Không tìm thấy thông tin hồ sơ học viên của bạn.');
      return;
    }

    setEnrollingId(classId);
    setMessage(null);

    try {
      await enrollmentsService.enroll(user.hoSoHocVien.id, classId);
      setMessage({
        type: 'success',
        text: 'Đăng ký lớp học thành công! Hệ thống đã tự động lập Hóa đơn học phí.',
      });
      setConfirmEnrollClass(null);
      await fetchData();
    } catch (err: any) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Đăng ký không thành công.',
      });
    } finally {
      setEnrollingId(null);
    }
  };

  const handleCancelEnroll = async (classId: number) => {
    if (!user?.hoSoHocVien?.id) {
      setCancelModalError('Không tìm thấy thông tin hồ sơ học viên của bạn.');
      return;
    }

    setCancellingId(classId);
    setCancelModalError(null);

    try {
      await enrollmentsService.cancelEnrollment(user.hoSoHocVien.id, classId);
      setMessage({
        type: 'success',
        text: 'Hủy đăng ký lớp học thành công! Chỗ ngồi đã được giải phóng và cập nhật trạng thái hủy.',
      });
      setConfirmCancelClass(null);
      await fetchData();
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message ||
        'Hủy đăng ký không thành công. Vui lòng thử lại sau.';
      setCancelModalError(errorMsg);
      setMessage({
        type: 'error',
        text: errorMsg,
      });
    } finally {
      setCancellingId(null);
    }
  };

  // Danh sách các lớp học viên đang tham gia (loại bỏ trạng thái đã hủy DA_HUY)
  // Đồng bộ hoàn toàn với Dashboard "Lớp Học Đang Tham Gia"
  const activeEnrollments = useMemo(() => {
    return (myEnrollments || []).filter((e: any) => e.trangThai !== 'DA_HUY');
  }, [myEnrollments]);

  const enrolledCount = activeEnrollments.length;

  const myEnrolledClassIds = useMemo(() => {
    return new Set(activeEnrollments.map((e: any) => Number(e.lopHocId || e.lopHoc?.id)));
  }, [activeEnrollments]);

  // Lịch học hiện tại của học viên để đối soát xung đột lịch
  const myActiveSchedules = useMemo(() => {
    const schedules: any[] = [];
    activeEnrollments.forEach((e: any) => {
      if (e.lopHoc?.lichHoc && ['DANG_MO_DANG_KY', 'DANG_HOC'].includes(e.lopHoc?.trangThai)) {
        schedules.push(...e.lopHoc.lichHoc);
      }
    });
    return schedules;
  }, [activeEnrollments]);

  const checkScheduleConflict = (classSchedules: any[]) => {
    if (!classSchedules || !myActiveSchedules.length) return null;
    for (const newSch of classSchedules) {
      const conflict = myActiveSchedules.find((activeSch: any) => {
        if (Number(activeSch.thuTrongTuan) !== Number(newSch.thuTrongTuan)) return false;
        const actStart = activeSch.gioBatDau;
        const actEnd = activeSch.gioKetThuc;
        const newStart = newSch.gioBatDau;
        const newEnd = newSch.gioKetThuc;
        if (actStart && actEnd && newStart && newEnd) {
          return actStart < newEnd && actEnd > newStart;
        }
        return true;
      });
      if (conflict) {
        return `Trùng Lịch Thứ ${newSch.thuTrongTuan}`;
      }
    }
    return null;
  };

  const studentCefr = user?.hoSoHocVien?.trinhDoCEFR || 'B1';
  const studentRank = CEFR_RANKS[studentCefr] || 1;

  // Đánh giá trạng thái từng lớp học đối với học viên hiện tại (cho tab Lớp mở tuyển sinh)
  const getClassStatus = (c: LopHoc) => {
    const enrollment = activeEnrollments.find(
      (e: any) => Number(e.lopHocId || e.lopHoc?.id) === Number(c.id)
    );
    const isEnrolled = !!enrollment;
    const paidAmount = Number(enrollment?.hoaDon?.soTienDaTra || 0);
    const isPaid =
      paidAmount > 0 ||
      enrollment?.hoaDon?.trangThai === 'DA_HOAN_THANH' ||
      enrollment?.trangThai === 'DA_XAC_NHAN';

    const isFull = c.siSoHienTai >= c.siSoToiDa;
    const isCourseSuspended = c.khoaHoc?.trangThai === 'NGUNG_HOAT_DONG';
    const courseCefr = c.khoaHoc?.trinhDoYeuCau || 'A1';
    const courseRank = CEFR_RANKS[courseCefr] || 1;
    const isCefrIneligible = studentRank < courseRank;
    const conflictMsg = checkScheduleConflict(c.lichHoc || []);

    let canEnroll = true;
    let statusText = 'Xác Nhận Đăng Ký Lớp';
    let reason = '';

    if (isCourseSuspended) {
      canEnroll = false;
      statusText = 'Chương Trình Ngừng Hoạt Động';
      reason = 'Khóa học này hiện đang ngừng hoạt động';
    } else if (isEnrolled) {
      canEnroll = false;
      statusText = isPaid ? 'Đã Ghi Danh (Đã Đóng Phí)' : 'Đã Ghi Danh (Chờ Nộp Phí)';
      reason = 'Bạn đã đăng ký lớp học này';
    } else if (isCefrIneligible) {
      canEnroll = false;
      statusText = `Yêu Cầu CEFR ${courseCefr} (Bạn đang là ${studentCefr})`;
      reason = `Trình độ CEFR ${studentCefr} chưa đạt yêu cầu đầu vào ${courseCefr}`;
    } else if (conflictMsg) {
      canEnroll = false;
      statusText = conflictMsg;
      reason = 'Lịch học bị trùng với lớp khác bạn đang theo học';
    } else if (isFull) {
      canEnroll = false;
      statusText = 'Lớp Đã Đầy Sĩ Số';
      reason = 'Lớp đã đủ sĩ số tối đa';
    }

    return {
      isEnrolled,
      isPaid,
      enrollment,
      paidAmount,
      isFull,
      isCourseSuspended,
      isCefrIneligible,
      conflictMsg,
      canEnroll,
      statusText,
      reason,
      courseCefr,
      courseRank,
    };
  };

  // Danh sách hiển thị cho Tab 'all' (Tất cả lớp mở tuyển sinh)
  const displayedOpenClasses = useMemo(() => {
    return classes.filter((c) => {
      const q = search.toLowerCase().trim();
      if (q) {
        const matchCode = c.maLopHoc?.toLowerCase().includes(q);
        const matchName = c.tenLopHoc?.toLowerCase().includes(q);
        const matchCourse = c.khoaHoc?.tenKhoaHoc?.toLowerCase().includes(q);
        if (!matchCode && !matchName && !matchCourse) return false;
      }
      if (selectedCefr && c.khoaHoc?.trinhDoYeuCau !== selectedCefr) {
        return false;
      }
      return true;
    });
  }, [classes, search, selectedCefr]);

  // Danh sách hiển thị cho Tab 'enrolled' (Lớp đã đăng ký / đang tham gia)
  const displayedEnrolledClasses = useMemo(() => {
    return activeEnrollments.filter((e: any) => {
      const c = e.lopHoc;
      if (!c) return false;
      const q = search.toLowerCase().trim();
      if (q) {
        const matchCode = c.maLopHoc?.toLowerCase().includes(q);
        const matchName = c.tenLopHoc?.toLowerCase().includes(q);
        const matchCourse = c.khoaHoc?.tenKhoaHoc?.toLowerCase().includes(q);
        if (!matchCode && !matchName && !matchCourse) return false;
      }
      if (selectedCefr && c.khoaHoc?.trinhDoYeuCau !== selectedCefr) {
        return false;
      }
      return true;
    });
  }, [activeEnrollments, search, selectedCefr]);

  return (
    <AppLayout
      allowedRoles={['HOC_VIEN', 'TU_VAN_VIEN']}
      title="Đăng Ký & Quản Lý Lớp Học"
      subtitle="Hệ thống tự động đối soát 4 tiêu chí: Chuẩn CEFR, Sĩ số chỗ trống, Chưa đăng ký và Trùng lịch học"
    >
      <div className="space-y-6">
        {/* User CEFR Profile Banner */}
        <div className="p-3.5 sm:p-5 rounded-2xl bg-white dark:bg-[#111928] border border-slate-200/90 dark:border-[#1e2d45] shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-3 sm:gap-4">
          <div className="flex items-start sm:items-center space-x-3 w-full md:w-auto">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/50 flex items-center justify-center text-teal-700 dark:text-teal-400 font-black text-sm shadow-xs shrink-0 mt-0.5 sm:mt-0">
              {studentCefr}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <span className="text-xs text-slate-500 dark:text-slate-400">Học viên:</span>
                <strong className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                  {user?.hoSoHocVien?.hoTen || user?.hoTen || 'Học viên'}
                </strong>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 font-bold border border-teal-200 dark:border-teal-800 shrink-0">
                  {user?.hoSoHocVien?.maHocVien || 'HV'}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                Trình độ CEFR xác thực:{' '}
                <strong className="text-teal-700 dark:text-teal-400 font-bold font-mono">
                  {studentCefr}
                </strong>{' '}
                — Đủ điều kiện đăng ký các lớp có chuẩn đầu vào{' '}
                <strong className="text-teal-700 dark:text-teal-400 font-mono">≤ {studentCefr}</strong>
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto justify-start md:justify-end">
            <div className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#162032] border border-slate-200 dark:border-[#22324e] text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center justify-center sm:justify-start gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-teal-600 shrink-0" />
              <span>
                <strong>{classes.length}</strong> lớp mở tuyển sinh
              </span>
            </div>
            {enrolledCount > 0 && (
              <div className="px-3 py-1.5 rounded-xl bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/40 text-blue-800 dark:text-blue-300 text-xs font-semibold flex items-center justify-center sm:justify-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>
                  Đang tham gia <strong>{enrolledCount}</strong> lớp
                </span>
              </div>
            )}
            <Link
              href="/student/ai-consult"
              className="px-3.5 py-1.5 min-h-[38px] sm:min-h-0 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 hover:opacity-95 text-white text-xs font-bold flex items-center justify-center space-x-1.5 shadow-sm shadow-teal-600/20 transition cursor-pointer shrink-0"
              title="Nhận tư vấn lộ trình và gợi ý lớp học thông minh từ AI"
            >
              <Bot className="w-3.5 h-3.5 shrink-0" />
              <span>AI Tư Vấn Lớp Học</span>
            </Link>
          </div>
        </div>

        {/* Toolbar: Tabs & Search Filter */}
        <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-3 sm:gap-4 bg-white dark:bg-[#111928] p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 dark:border-[#1e2d45] shadow-sm">
          {/* Tab Navigation */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 lg:pb-0 -mx-1 px-1 sm:mx-0 sm:px-0 flex-nowrap sm:flex-wrap border-b lg:border-b-0 border-slate-100 dark:border-[#1e2d45] scrollbar-none">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`px-3 sm:px-3.5 py-2 min-h-[38px] rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
                activeTab === 'all'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-[#162032] text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Tất Cả Lớp Mở Tuyển Sinh</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  activeTab === 'all'
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-200 dark:bg-[#22324e] text-slate-700 dark:text-slate-300'
                }`}
              >
                {classes.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('enrolled')}
              className={`px-3 sm:px-3.5 py-2 min-h-[38px] rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
                activeTab === 'enrolled'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-[#162032] text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Lớp Đã Đăng Ký (Đang Tham Gia)</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  activeTab === 'enrolled'
                    ? 'bg-white/20 text-white'
                    : 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300'
                }`}
              >
                {enrolledCount}
              </span>
            </button>
          </div>

          {/* Search & CEFR Filter */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2.5 w-full lg:w-auto">
            <div className="relative flex-1 sm:w-60">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm mã lớp, tên lớp..."
                className="w-full h-10 bg-slate-50 dark:bg-[#162032] border border-slate-200 dark:border-[#22324e] rounded-xl px-3.5 pl-9 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-teal-500 transition-colors"
              />
            </div>

            <select
              value={selectedCefr}
              onChange={(e) => setSelectedCefr(e.target.value)}
              className="h-10 w-full sm:w-auto bg-slate-50 dark:bg-[#162032] border border-slate-200 dark:border-[#22324e] rounded-xl px-3 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-teal-500 font-medium cursor-pointer transition-colors"
            >
              <option value="">Tất cả CEFR</option>
              <option value="A1">CEFR A1</option>
              <option value="A2">CEFR A2</option>
              <option value="B1">CEFR B1</option>
              <option value="B2">CEFR B2</option>
              <option value="C1">CEFR C1</option>
              <option value="C2">CEFR C2</option>
            </select>
          </div>
        </div>

        {message && (
          <div
            className={`p-4 rounded-xl text-xs flex items-center space-x-2 shadow-sm animate-fadeIn ${
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

        {/* Classes Grid */}
        {loading ? (
          <div className="py-20 flex justify-center items-center">
            <div className="w-8 h-8 border-4 border-teal-500/20 border-t-teal-600 rounded-full animate-spin"></div>
          </div>
        ) : activeTab === 'all' ? (
          /* TAB 1: TẤT CẢ LỚP MỞ TUYỂN SINH */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {displayedOpenClasses.length === 0 ? (
              <div className="col-span-full py-16 text-center bg-white dark:bg-[#111928] rounded-2xl border border-slate-200/90 dark:border-[#1e2d45] p-8 shadow-sm space-y-2">
                <BookOpen className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                <h4 className="text-base font-bold text-slate-800 dark:text-slate-100">
                  Không Tìm Thấy Lớp Học Phù Hợp
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                  Vui lòng thay đổi từ khóa tìm kiếm, bộ lọc CEFR hoặc quay lại sau.
                </p>
              </div>
            ) : (
              displayedOpenClasses.map((c) => {
                const st = getClassStatus(c);

                return (
                  <div
                    key={c.id}
                    className={`p-4 sm:p-6 rounded-2xl bg-white dark:bg-[#111928] border shadow-sm flex flex-col justify-between transition-all ${
                      st.isEnrolled
                        ? 'border-blue-300 dark:border-blue-800/60 bg-blue-50/20 dark:bg-blue-950/10'
                        : st.isCefrIneligible
                        ? 'border-slate-200 dark:border-[#1e2d45] opacity-85 hover:opacity-100'
                        : 'border-slate-200/90 dark:border-[#1e2d45] hover:border-teal-400 dark:hover:border-teal-500 hover:shadow-md'
                    }`}
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex justify-between items-start mb-3 gap-2 flex-wrap sm:flex-nowrap">
                        <span className="font-mono text-xs font-bold text-teal-700 dark:text-teal-300 px-2.5 py-1 rounded-lg bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 shrink-0">
                          {c.maLopHoc}
                        </span>

                        {st.isEnrolled ? (
                          <span
                            className={`text-xs px-2.5 py-0.5 rounded-lg font-bold border flex items-center gap-1 shrink-0 ${
                              st.isPaid
                                ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                                : 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                            }`}
                          >
                            <Check className="w-3 h-3" />
                            <span>{st.isPaid ? 'Đã Ghi Danh & Đóng Học Phí' : 'Đã Ghi Danh (Chờ Đóng Phí)'}</span>
                          </span>
                        ) : st.isCefrIneligible ? (
                          <span className="text-xs px-2.5 py-0.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 font-bold border border-amber-200 dark:border-amber-800/60 flex items-center gap-1 shrink-0">
                            <AlertTriangle className="w-3 h-3 text-amber-500 shrink-0" />
                            <span>Yêu cầu: CEFR {st.courseCefr}</span>
                          </span>
                        ) : (
                          <span className="text-xs px-2.5 py-0.5 rounded-lg bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 font-bold border border-teal-200 dark:border-teal-800 flex items-center gap-1 shrink-0">
                            <Check className="w-3 h-3 text-teal-600" />
                            <span>Yêu cầu: CEFR {st.courseCefr} (Đạt)</span>
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1 leading-snug">
                        {c.tenLopHoc}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                        {c.khoaHoc?.tenKhoaHoc}
                      </p>

                      {/* Class Details Card */}
                      <div className="p-3 sm:p-3.5 rounded-xl bg-slate-50 dark:bg-[#162032] border border-slate-200/80 dark:border-[#22324e] space-y-2 text-xs text-slate-700 dark:text-slate-300 mb-4">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500 dark:text-slate-400">Học phí niêm yết:</span>
                          <span className="font-bold text-emerald-700 dark:text-emerald-400 font-mono">
                            {Number(c.khoaHoc?.hocPhi).toLocaleString('vi-VN')} đ
                          </span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-slate-500 dark:text-slate-400">Sĩ số chỗ trống:</span>
                          <span
                            className={`font-semibold ${
                              st.isFull ? 'text-rose-600 dark:text-rose-400' : 'text-slate-800 dark:text-slate-200'
                            }`}
                          >
                            {c.siSoHienTai} / {c.siSoToiDa}{' '}
                            <span className="text-slate-500 dark:text-slate-400 font-normal">
                              ({Math.max(0, c.siSoToiDa - c.siSoHienTai)} chỗ trống)
                            </span>
                          </span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-slate-500 dark:text-slate-400">Lịch học:</span>
                          <span className="font-medium text-slate-800 dark:text-slate-200 text-right">
                            {c.lichHoc && c.lichHoc.length > 0
                              ? c.lichHoc.map((l: any) => `Thứ ${l.thuTrongTuan}`).join(', ')
                              : 'Chưa xếp lịch'}
                          </span>
                        </div>
                      </div>

                      {/* Lý do không đạt điều kiện (nếu có) */}
                      {st.reason && !st.isEnrolled && (
                        <div className="mb-3 text-[11px] text-amber-700 dark:text-amber-400 flex items-center gap-1.5 bg-amber-50/60 dark:bg-amber-950/20 px-2.5 py-1 rounded-lg border border-amber-200/60 dark:border-amber-800/30">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0 text-amber-600" />
                          <span>{st.reason}</span>
                        </div>
                      )}
                    </div>

                    {/* Action Button Area */}
                    {st.isEnrolled ? (
                      st.isPaid ? (
                        /* ĐÃ ĐÓNG TIỀN: BẢO VỆ CHẶT CHẼ, KHÔNG HIỂN THỊ NÚT HỦY ĐĂNG KÝ */
                        <div className="space-y-1.5 w-full mt-auto">
                          <div className="min-h-[42px] py-2 px-3.5 rounded-xl bg-emerald-50/90 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 font-bold text-xs flex items-center justify-between">
                            <span className="flex items-center gap-1.5">
                              <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                              <span>Đã Ghi Danh & Hoàn Thành Học Phí</span>
                            </span>
                            <span className="text-[11px] px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 font-semibold font-mono">
                              {st.enrollment?.hoaDon?.maHoaDon || 'HĐ-OK'}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 italic px-1">
                            * Học phí đã thanh toán. Vui lòng liên hệ Phòng Giáo vụ / Kế toán nếu cần bảo lưu hoặc chuyển lớp.
                          </p>
                        </div>
                      ) : (
                        /* CHƯA ĐÓNG TIỀN: CHO PHÉP HỦY HOẶC NỘP HỌC PHÍ */
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full mt-auto">
                          <Link
                            href="/student/fees"
                            className="flex-1 min-h-[42px] py-2 px-3 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 hover:opacity-95 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition cursor-pointer"
                          >
                            <CreditCard className="w-3.5 h-3.5 shrink-0" />
                            <span>Nộp Học Phí</span>
                          </Link>
                          <button
                            type="button"
                            onClick={() => {
                              setCancelModalError(null);
                              setConfirmCancelClass(c);
                            }}
                            disabled={cancellingId === c.id}
                            className="min-h-[42px] py-2 px-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/30 dark:hover:bg-rose-950/50 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800/60 hover:border-rose-300 shadow-xs shrink-0"
                            title="Hủy đăng ký lớp học này khi chưa đóng học phí"
                          >
                            <X className="w-3.5 h-3.5 shrink-0" />
                            <span>Hủy Đăng Ký</span>
                          </button>
                        </div>
                      )
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          if (st.canEnroll) {
                            setConfirmEnrollClass(c);
                          }
                        }}
                        disabled={!st.canEnroll || enrollingId === c.id}
                        className={`w-full min-h-[44px] py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center space-x-1.5 transition cursor-pointer text-center leading-tight mt-auto ${
                          st.isCourseSuspended
                            ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 cursor-not-allowed'
                            : st.isCefrIneligible
                            ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 cursor-not-allowed'
                            : st.conflictMsg
                            ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 cursor-not-allowed'
                            : st.isFull
                            ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 cursor-not-allowed'
                            : 'bg-gradient-to-r from-teal-600 to-cyan-600 hover:opacity-95 text-white shadow-md shadow-teal-600/20'
                        }`}
                      >
                        {st.isCefrIneligible ? (
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        ) : st.conflictMsg ? (
                          <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        ) : null}

                        <span>
                          {enrollingId === c.id ? 'Đang Xử Lý Đăng Ký...' : st.statusText}
                        </span>

                        {st.canEnroll && enrollingId !== c.id && (
                          <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                        )}
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>
        ) : (
          /* TAB 2: LỚP ĐÃ ĐĂNG KÝ / ĐANG THAM GIA (ĐỒNG BỘ NGUỒN SỰ THẬT TỪ HỒ SƠ ĐĂNG KÝ HỌC CỦA HỌC VIÊN) */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {displayedEnrolledClasses.length === 0 ? (
              <div className="col-span-full py-16 text-center bg-white dark:bg-[#111928] rounded-2xl border border-slate-200/90 dark:border-[#1e2d45] p-8 shadow-sm space-y-2">
                <CheckCircle className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                <h4 className="text-base font-bold text-slate-800 dark:text-slate-100">
                  {search || selectedCefr
                    ? 'Không Tìm Thấy Lớp Đăng Ký Khớp Với Bộ Lọc'
                    : 'Bạn Chưa Đăng Ký Lớp Học Nào'}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                  Hãy chuyển sang tab "Tất Cả Lớp Mở Tuyển Sinh" để khám phá và đăng ký các khóa học chuẩn CEFR phù hợp.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('all');
                      setSearch('');
                      setSelectedCefr('');
                    }}
                    className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition cursor-pointer"
                  >
                    Xem Các Lớp Tuyển Sinh
                  </button>
                </div>
              </div>
            ) : (
              displayedEnrolledClasses.map((enr: any) => {
                const c = enr.lopHoc;
                const paidAmount = Number(enr.hoaDon?.soTienDaTra || 0);
                const tuitionFee = Number(enr.hoaDon?.soTienPhaiTra || c.khoaHoc?.hocPhi || 0);
                const remainingFee = Math.max(0, tuitionFee - paidAmount);
                const isPaid =
                  paidAmount > 0 ||
                  enr.hoaDon?.trangThai === 'DA_HOAN_THANH' ||
                  enr.trangThai === 'DA_XAC_NHAN';

                return (
                  <div
                    key={enr.id}
                    className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-[#111928] border border-blue-200/80 dark:border-blue-900/40 shadow-sm flex flex-col justify-between hover:shadow-md transition-all"
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex justify-between items-start mb-3 gap-2 flex-wrap sm:flex-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-xs font-bold text-teal-700 dark:text-teal-300 px-2.5 py-1 rounded-lg bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 shrink-0">
                            {c.maLopHoc}
                          </span>
                          <span
                            className={`text-[11px] px-2.5 py-0.5 rounded-lg font-bold border ${
                              c.trangThai === 'DANG_HOC'
                                ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800'
                                : c.trangThai === 'DANG_MO_DANG_KY'
                                ? 'bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800'
                                : 'bg-slate-100 dark:bg-[#162032] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-[#22324e]'
                            }`}
                          >
                            {formatTrangThaiLopHoc(c.trangThai)}
                          </span>
                        </div>

                        <span
                          className={`text-xs px-2.5 py-0.5 rounded-lg font-bold border flex items-center gap-1 shrink-0 ${
                            isPaid
                              ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                              : 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                          }`}
                        >
                          <Check className="w-3 h-3" />
                          <span>{formatTrangThaiDangKy(enr.trangThai)}</span>
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1 leading-snug">
                        {c.tenLopHoc}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                        {c.khoaHoc?.tenKhoaHoc}
                      </p>

                      {/* Class Details Card */}
                      <div className="p-3 sm:p-3.5 rounded-xl bg-slate-50 dark:bg-[#162032] border border-slate-200/80 dark:border-[#22324e] space-y-2 text-xs text-slate-700 dark:text-slate-300 mb-4">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500 dark:text-slate-400">Giảng viên:</span>
                          <span className="font-semibold text-slate-900 dark:text-slate-100">
                            {c.phanCong?.[0]?.giaoVien?.hoTen || 'Chưa phân công'}
                          </span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-slate-500 dark:text-slate-400">Phòng học:</span>
                          <span className="font-medium text-slate-800 dark:text-slate-200">
                            {c.phongHoc || 'Chưa xếp phòng'}
                          </span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-slate-500 dark:text-slate-400">Lịch học:</span>
                          <span className="font-medium text-slate-800 dark:text-slate-200 text-right">
                            {c.lichHoc && c.lichHoc.length > 0
                              ? c.lichHoc.map((l: any) => `Thứ ${l.thuTrongTuan} (${l.gioBatDau || ''} - ${l.gioKetThuc || ''})`).join(', ')
                              : 'Chưa xếp lịch'}
                          </span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-slate-500 dark:text-slate-400">Thời gian học:</span>
                          <span className="font-medium text-slate-800 dark:text-slate-200">
                            {formatDate(c.ngayBatDau)} — {formatDate(c.ngayKetThuc)}
                          </span>
                        </div>
                      </div>

                      {/* Financial Info Card */}
                      <div className="p-3 sm:p-3.5 rounded-xl bg-blue-50/40 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-800/40 space-y-1.5 text-xs text-slate-700 dark:text-slate-300 mb-4">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500 dark:text-slate-400">Hóa đơn:</span>
                          <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                            {enr.hoaDon?.maHoaDon || 'Chưa lập'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500 dark:text-slate-400">Học phí:</span>
                          <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">
                            {tuitionFee.toLocaleString('vi-VN')} đ
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500 dark:text-slate-400">Đã thanh toán:</span>
                          <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                            {paidAmount.toLocaleString('vi-VN')} đ
                          </span>
                        </div>
                        {remainingFee > 0 && (
                          <div className="flex justify-between items-center text-rose-600 dark:text-rose-400 font-semibold pt-1 border-t border-blue-200/40 dark:border-blue-800/30">
                            <span>Còn nợ học phí:</span>
                            <span className="font-mono font-bold">
                              {remainingFee.toLocaleString('vi-VN')} đ
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between items-center pt-1">
                          <span className="text-slate-500 dark:text-slate-400">Trạng thái hóa đơn:</span>
                          <span className="font-semibold text-slate-900 dark:text-slate-100">
                            {formatTrangThaiHoaDon(enr.hoaDon?.trangThai)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Area for Enrolled Class */}
                    {isPaid ? (
                      /* ĐÃ ĐÓNG TIỀN: BẢO VỆ CHẶT CHẼ, KHÔNG HIỂN THỊ NÚT HỦY ĐĂNG KÝ */
                      <div className="space-y-1.5 w-full mt-auto">
                        <div className="min-h-[42px] py-2 px-3.5 rounded-xl bg-emerald-50/90 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 font-bold text-xs flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                            <span>Đã Đóng Học Phí — Chỗ Ngồi Đã Được Xác Nhận</span>
                          </span>
                          <span className="text-[11px] px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 font-semibold font-mono">
                            {enr.hoaDon?.maHoaDon}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 italic px-1">
                          * Để bảo toàn dữ liệu sổ sách tài chính, học viên không thể tự hủy đăng ký sau khi đã hoàn tất học phí. Vui lòng liên hệ trực tiếp Phòng Giáo vụ / Kế toán nếu bạn có nhu cầu bảo lưu hoặc đổi lớp.
                        </p>
                      </div>
                    ) : (
                      /* CHƯA ĐÓNG TIỀN: CHO PHÉP HỦY HOẶC NỘP TIỀN */
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full mt-auto">
                        <Link
                          href="/student/fees"
                          className="flex-1 min-h-[42px] py-2 px-3.5 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 hover:opacity-95 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm shadow-teal-600/20 transition cursor-pointer"
                        >
                          <CreditCard className="w-3.5 h-3.5 shrink-0" />
                          <span>Nộp Học Phí Ngay ({tuitionFee.toLocaleString('vi-VN')} đ)</span>
                        </Link>
                        <button
                          type="button"
                          onClick={() => {
                            setCancelModalError(null);
                            setConfirmCancelClass({
                              id: Number(c.id),
                              maLopHoc: c.maLopHoc,
                              tenLopHoc: c.tenLopHoc,
                              khoaHoc: c.khoaHoc,
                            });
                          }}
                          disabled={cancellingId === Number(c.id)}
                          className="min-h-[42px] py-2 px-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/30 dark:hover:bg-rose-950/50 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800/60 hover:border-rose-300 shadow-xs shrink-0"
                          title="Hủy đăng ký lớp học này khi chưa nộp học phí"
                        >
                          <X className="w-3.5 h-3.5 shrink-0" />
                          <span>Hủy Đăng Ký</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Modal Xác Nhận Đăng Ký Lớp Học */}
        {confirmEnrollClass && (
          <div
            className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
            onClick={() => setConfirmEnrollClass(null)}
          >
            <div
              className="bg-white dark:bg-[#111928] rounded-2xl border border-slate-200 dark:border-[#1e2d45] shadow-2xl max-w-lg w-full p-5 sm:p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#1e2d45]">
                <div className="flex items-center space-x-2.5">
                  <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/50 flex items-center justify-center text-teal-600 dark:text-teal-400">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
                      Xác Nhận Đăng Ký Lớp Học
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Kiểm tra thông tin chi tiết trước khi hoàn tất ghi danh
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setConfirmEnrollClass(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#162032] transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Class Info in Modal */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50 dark:bg-[#162032] border border-slate-200/80 dark:border-[#22324e] space-y-2.5 text-xs">
                <div className="flex justify-between items-start gap-2">
                  <span className="text-slate-500 dark:text-slate-400 shrink-0">Lớp học:</span>
                  <div className="text-right">
                    <span className="font-mono font-bold text-teal-700 dark:text-teal-400 mr-1.5">
                      [{confirmEnrollClass.maLopHoc}]
                    </span>
                    <strong className="text-slate-900 dark:text-slate-100 font-bold">
                      {confirmEnrollClass.tenLopHoc}
                    </strong>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400">Khóa học:</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    {confirmEnrollClass.khoaHoc?.tenKhoaHoc}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400">Học phí:</span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-400 text-sm font-mono">
                    {Number(confirmEnrollClass.khoaHoc?.hocPhi).toLocaleString('vi-VN')} đ
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400">Lịch học:</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    {confirmEnrollClass.lichHoc && confirmEnrollClass.lichHoc.length > 0
                      ? confirmEnrollClass.lichHoc.map((l: any) => `Thứ ${l.thuTrongTuan} (${l.gioBatDau || ''} - ${l.gioKetThuc || ''})`).join(', ')
                      : 'Chưa xếp lịch cụ thể'}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400">Sĩ số chỗ trống:</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    {confirmEnrollClass.siSoHienTai} / {confirmEnrollClass.siSoToiDa}{' '}
                    (còn {Math.max(0, confirmEnrollClass.siSoToiDa - confirmEnrollClass.siSoHienTai)} chỗ)
                  </span>
                </div>
              </div>

              {/* Note / Terms */}
              <div className="p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/70 dark:border-blue-800/40 text-blue-900 dark:text-blue-300 text-[11px] leading-relaxed flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div>
                  <strong>Lưu ý:</strong> Sau khi đăng ký, hệ thống sẽ tự động cấp chỗ và xuất hóa đơn học phí tương ứng. Nếu lỡ bấm nhầm hoặc thay đổi kế hoạch, bạn có thể tự <strong>Hủy đăng ký</strong> ngay tại giao diện này (áp dụng trước khi nộp học phí).
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setConfirmEnrollClass(null)}
                  disabled={enrollingId !== null}
                  className="w-full sm:w-auto px-4 py-2.5 min-h-[42px] rounded-xl border border-slate-200 dark:border-[#22324e] bg-slate-100 hover:bg-slate-200 dark:bg-[#162032] dark:hover:bg-[#1e2d45] text-slate-700 dark:text-slate-300 text-xs font-bold transition cursor-pointer"
                >
                  Hủy Bỏ (Không Đăng Ký)
                </button>
                <button
                  type="button"
                  onClick={() => handleEnroll(confirmEnrollClass.id)}
                  disabled={enrollingId === confirmEnrollClass.id}
                  className="w-full sm:w-auto px-5 py-2.5 min-h-[42px] rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 hover:opacity-95 text-white text-xs font-bold transition shadow-sm flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  {enrollingId === confirmEnrollClass.id ? (
                    <span className="flex items-center gap-1.5">
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Đang Ghi Danh...</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5">
                      <Check className="w-4 h-4" />
                      <span>Xác Nhận Đăng Ký Lớp</span>
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Xác Nhận Hủy Đăng Ký Lớp Học */}
        {confirmCancelClass && (
          <div
            className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
            onClick={() => {
              setCancelModalError(null);
              setConfirmCancelClass(null);
            }}
          >
            <div
              className="bg-white dark:bg-[#111928] rounded-2xl border border-slate-200 dark:border-[#1e2d45] shadow-2xl max-w-lg w-full p-5 sm:p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#1e2d45]">
                <div className="flex items-center space-x-2.5">
                  <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/50 flex items-center justify-center text-rose-600 dark:text-rose-400">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
                      Xác Nhận Hủy Đăng Ký Lớp Học
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Thu hồi đăng ký lớp học chưa hoàn tất thanh toán học phí
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setCancelModalError(null);
                    setConfirmCancelClass(null);
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#162032] transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Class Info in Modal */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50 dark:bg-[#162032] border border-slate-200/80 dark:border-[#22324e] space-y-2 text-xs">
                <div className="flex justify-between items-start gap-2">
                  <span className="text-slate-500 dark:text-slate-400 shrink-0">Lớp muốn hủy:</span>
                  <div className="text-right">
                    <span className="font-mono font-bold text-rose-600 dark:text-rose-400 mr-1.5">
                      [{confirmCancelClass.maLopHoc}]
                    </span>
                    <strong className="text-slate-900 dark:text-slate-100 font-bold">
                      {confirmCancelClass.tenLopHoc}
                    </strong>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400">Khóa học:</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    {confirmCancelClass.khoaHoc?.tenKhoaHoc}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400">Học phí:</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300 font-mono">
                    {Number(confirmCancelClass.khoaHoc?.hocPhi).toLocaleString('vi-VN')} đ
                  </span>
                </div>
              </div>

              {/* Notice */}
              <div className="p-3 rounded-xl bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-300 text-[11px] leading-relaxed flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
                <div>
                  <strong>Quy trình hủy đăng ký:</strong> Lớp học này chưa phát sinh thanh toán học phí. Khi bạn xác nhận hủy, hệ thống sẽ cập nhật trạng thái đăng ký và hóa đơn tương ứng sang <strong>Đã Hủy</strong>, đồng thời <strong>giải phóng 01 vị trí chỗ ngồi</strong> cho học viên khác. Lịch sử hóa đơn đã hủy vẫn được bảo lưu an toàn trong hệ thống để đối soát sổ sách.
                </div>
              </div>

              {/* In-Modal Error Display */}
              {cancelModalError && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-xs flex items-center space-x-2 animate-fadeIn">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{cancelModalError}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setCancelModalError(null);
                    setConfirmCancelClass(null);
                  }}
                  disabled={cancellingId !== null}
                  className="w-full sm:w-auto px-4 py-2.5 min-h-[42px] rounded-xl border border-slate-200 dark:border-[#22324e] bg-slate-100 hover:bg-slate-200 dark:bg-[#162032] dark:hover:bg-[#1e2d45] text-slate-700 dark:text-slate-300 text-xs font-bold transition cursor-pointer"
                >
                  Giữ Lại Lớp (Không Hủy)
                </button>
                <button
                  type="button"
                  onClick={() => handleCancelEnroll(confirmCancelClass.id)}
                  disabled={cancellingId === confirmCancelClass.id}
                  className="w-full sm:w-auto px-5 py-2.5 min-h-[42px] rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition shadow-sm flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  {cancellingId === confirmCancelClass.id ? (
                    <span className="flex items-center gap-1.5">
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Đang Hủy Đăng Ký...</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5">
                      <X className="w-4 h-4" />
                      <span>Xác Nhận Hủy Đăng Ký</span>
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
