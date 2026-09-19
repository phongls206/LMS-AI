'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { AppLayout } from '../../../components/AppLayout';
import { gradesService } from '../../../services/api';
import {
  Calendar, Clock, MapPin, ChevronDown, ChevronUp, AlertCircle,
  CheckCircle2, XCircle, Info, BookOpen, Award, ChevronRight,
  CalendarCheck, RefreshCw, Search, Filter, Globe, Sparkles,
  Receipt, TrendingUp, Check, ExternalLink, ArrowRight, User
} from 'lucide-react';
import { formatTrangThaiDangKy, formatTrangThaiLopHoc } from '../../../utils/formatters';

// Nhận diện đường link học online
const isOnlineLink = (str?: string) => {
  if (!str) return false;
  const s = str.toLowerCase();
  return (
    s.startsWith('http://') ||
    s.startsWith('https://') ||
    s.includes('zoom.us') ||
    s.includes('meet.google.com') ||
    s.includes('teams.microsoft.com') ||
    s.includes('meet.') ||
    s.endsWith('.com') ||
    s.endsWith('.vn')
  );
};

interface StudentWeeklySession {
  id: number;
  classId: number;
  maLopHoc: string;
  tenLopHoc: string;
  thuTrongTuan: number;
  gioBatDau: string;
  gioKetThuc: string;
  timeStr: string;
  phongHoc: string;
  isOnline: boolean;
  trangThaiLop: string;
  courseName: string;
  cefr: string;
  teacherName: string;
  enrollmentStatus: string;
}

export default function StudentSchedulePage() {
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedClassId, setExpandedClassId] = useState<number | null>(null);
  const [highlightedClassId, setHighlightedClassId] = useState<number | null>(null);

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'DANG_HOC' | 'DANG_MO_DANG_KY'>('ALL');
  const [selectedDayFilter, setSelectedDayFilter] = useState<number | 'ALL'>('ALL');

  // Mobile tab switcher: 'timetable' | 'classes'
  const [mobileTab, setMobileTab] = useState<'timetable' | 'classes'>('timetable');

  const fetchSchedule = async (isManual = false) => {
    try {
      if (isManual) setRefreshing(true);
      else setLoading(true);

      const list = await gradesService.getStudentSchedule();
      setEnrollments(list || []);
    } catch (err) {
      console.error('Lỗi khi tải lịch học của học viên:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, []);

  // Tự động cuộn và mở chi tiết buổi học khi có anchor #class-{id}
  useEffect(() => {
    if (!loading && enrollments.length > 0) {
      const hash = typeof window !== 'undefined' ? window.location.hash : '';
      if (hash && hash.startsWith('#class-')) {
        const classId = parseInt(hash.replace('#class-', ''), 10);
        if (!isNaN(classId)) {
          setExpandedClassId(classId);
          setMobileTab('classes');
          setTimeout(() => {
            const el = document.getElementById(`class-card-${classId}`);
            if (el) {
              el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              el.classList.add('ring-2', 'ring-teal-500', 'shadow-lg');
              setTimeout(() => {
                el.classList.remove('ring-2', 'ring-teal-500', 'shadow-lg');
              }, 2500);
            }
          }, 250);
        }
      }
    }
  }, [loading, enrollments]);

  const formatTime = (timeStr?: string) => {
    if (!timeStr) return '';
    if (timeStr.includes('T')) {
      return new Date(timeStr).toISOString().substring(11, 16);
    }
    return timeStr.substring(0, 5);
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('vi-VN');
  };

  // Tính toán 7 ngày trong tuần hiện tại (Thứ 2 -> Chủ Nhật kèm ngày tháng thực tế)
  const weekDays = useMemo(() => {
    const now = new Date();
    const currentDayOfWeek = now.getDay(); // 0 is Sun, 1 is Mon, ... 6 is Sat
    const diffToMon = (currentDayOfWeek === 0 ? -6 : 1) - currentDayOfWeek;
    const monday = new Date(now);
    monday.setDate(now.getDate() + diffToMon);

    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const thuVal = i + 2; // 0->2 (T2) ... 5->7 (T7), 6->8 (CN)
      const isToday =
        d.getDate() === now.getDate() &&
        d.getMonth() === now.getMonth() &&
        d.getFullYear() === now.getFullYear();

      days.push({
        thu: thuVal,
        date: d,
        dateFormatted: `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}`,
        isToday,
        shortLabel: thuVal === 8 ? 'CN' : `T${thuVal}`,
        label: thuVal === 8 ? 'Chủ Nhật' : `Thứ ${thuVal}`,
      });
    }
    return days;
  }, []);

  // Thứ trong tuần của hôm nay (2 = Thứ 2, ..., 8 = Chủ Nhật)
  const todayThu = useMemo(() => {
    const day = new Date().getDay();
    return day === 0 ? 8 : day + 1;
  }, []);

  // Ngày tháng năm hôm nay hiển thị trang trọng
  const todayFormattedDate = useMemo(() => {
    const now = new Date();
    const dayNames = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
    const dayName = dayNames[now.getDay()];
    const dateStr = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;
    return `${dayName}, ngày ${dateStr}`;
  }, []);

  // Trích xuất toàn bộ các ca học trong tuần từ các lớp học viên đã ghi danh
  const allWeeklySessions = useMemo(() => {
    const sessions: StudentWeeklySession[] = [];
    for (const enr of enrollments) {
      const lop = enr.lopHoc;
      if (!lop || !lop.lichHoc) continue;

      const teacherName = lop.phanCong?.[0]?.giaoVien?.hoTen || 'Chưa cập nhật GV';

      for (const lh of lop.lichHoc) {
        const start = formatTime(lh.gioBatDau);
        const end = formatTime(lh.gioKetThuc);
        sessions.push({
          id: Number(lh.id),
          classId: Number(lop.id),
          maLopHoc: lop.maLopHoc,
          tenLopHoc: lop.tenLopHoc,
          thuTrongTuan: Number(lh.thuTrongTuan),
          gioBatDau: start,
          gioKetThuc: end,
          timeStr: `${start} - ${end}`,
          phongHoc: lh.phongHoc || lop.phongHoc || 'Chưa xếp phòng',
          isOnline: isOnlineLink(lh.phongHoc || lop.phongHoc),
          trangThaiLop: lop.trangThai,
          courseName: lop.khoaHoc?.tenKhoaHoc || '',
          cefr: lop.khoaHoc?.trinhDoYeuCau || '',
          teacherName,
          enrollmentStatus: enr.trangThai,
        });
      }
    }

    return sessions.sort((a, b) => {
      if (a.thuTrongTuan !== b.thuTrongTuan) return a.thuTrongTuan - b.thuTrongTuan;
      return a.gioBatDau.localeCompare(b.gioBatDau);
    });
  }, [enrollments]);

  // Các ca học của hôm nay
  const todaySessions = useMemo(() => {
    return allWeeklySessions.filter((s) => s.thuTrongTuan === todayThu);
  }, [allWeeklySessions, todayThu]);

  // Ca học theo bộ lọc ngày được chọn (hoặc tất cả)
  const filteredSessionsByDay = useMemo(() => {
    if (selectedDayFilter === 'ALL') return allWeeklySessions;
    return allWeeklySessions.filter((s) => s.thuTrongTuan === selectedDayFilter);
  }, [allWeeklySessions, selectedDayFilter]);

  // Lọc danh sách lớp học ở cột bên phải
  const filteredEnrollments = useMemo(() => {
    return enrollments.filter((enr) => {
      const lop = enr.lopHoc;
      if (!lop) return false;

      const q = search.toLowerCase().trim();
      const matchSearch =
        !q ||
        lop.maLopHoc?.toLowerCase().includes(q) ||
        lop.tenLopHoc?.toLowerCase().includes(q) ||
        lop.khoaHoc?.tenKhoaHoc?.toLowerCase().includes(q) ||
        lop.phanCong?.[0]?.giaoVien?.hoTen?.toLowerCase().includes(q);

      const matchStatus =
        statusFilter === 'ALL' ||
        (statusFilter === 'DANG_HOC' && lop.trangThai === 'DANG_HOC') ||
        (statusFilter === 'DANG_MO_DANG_KY' && (lop.trangThai === 'DANG_MO_DANG_KY' || lop.trangThai === 'SAP_MO'));

      // Nếu đang chọn lọc theo 1 ngày cụ thể trên TKB, ưu tiên hiển thị lớp có lịch ngày đó
      const matchDay =
        selectedDayFilter === 'ALL' ||
        lop.lichHoc?.some((lh: any) => Number(lh.thuTrongTuan) === selectedDayFilter);

      return matchSearch && matchStatus && matchDay;
    });
  }, [enrollments, search, statusFilter, selectedDayFilter]);

  // Cuộn mượt tới thẻ lớp học khi bấm vào ca học trên TKB
  const handleScrollToClass = (classId: number) => {
    setHighlightedClassId(classId);
    setMobileTab('classes'); // Switch tab on mobile
    const el = document.getElementById(`class-card-${classId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    setTimeout(() => {
      setHighlightedClassId((prev) => (prev === classId ? null : prev));
    }, 3000);
  };

  return (
    <AppLayout
      allowedRoles={['HOC_VIEN']}
      title="Thời Khóa Biểu & Lịch Học Cá Nhân"
      subtitle="Theo dõi khung giờ học hàng tuần, ca học hôm nay, phòng học và tiến độ chi tiết từng buổi học"
    >
      <div className="space-y-5">
        {/* Header Summary & Fast Controls */}
        <div className="bg-white dark:bg-[#111928] p-4 sm:p-5 rounded-2xl border border-slate-200/90 dark:border-[#1e2d45] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800/80 flex items-center justify-center text-teal-600 dark:text-teal-400 shrink-0 shadow-2xs">
              <CalendarCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  Thời Khóa Biểu Học Viên
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                  {enrollments.length} Lớp Đã Tham Gia
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1.5">
                <span>Hôm nay:</span>
                <strong className="text-slate-800 dark:text-slate-200 font-semibold">
                  {todayFormattedDate}
                </strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-[#162032] border border-slate-200 dark:border-[#1e2d45] text-xs">
              <Clock className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span className="text-slate-600 dark:text-slate-300">
                Tuần này bạn có <strong className="font-bold text-teal-600 dark:text-teal-400">{allWeeklySessions.length}</strong> ca học
              </span>
            </div>

            <button
              onClick={() => fetchSchedule(true)}
              disabled={refreshing}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-teal-50 dark:bg-[#162032] dark:hover:bg-teal-950/40 text-slate-700 dark:text-slate-200 hover:text-teal-700 dark:hover:text-teal-300 border border-slate-200 dark:border-[#22324e] hover:border-teal-300 dark:hover:border-teal-700 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-2xs disabled:opacity-50"
              title="Làm mới thời khóa biểu"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-teal-600 dark:text-teal-400' : ''}`} />
              <span>{refreshing ? 'Đang tải...' : 'Làm mới'}</span>
            </button>
          </div>
        </div>

        {/* Mobile Tab Switcher (Chỉ hiển thị trên mobile/tablet nhỏ) */}
        <div className="lg:hidden flex rounded-xl bg-slate-100 dark:bg-[#111928] p-1 border border-slate-200 dark:border-[#1e2d45]">
          <button
            type="button"
            onClick={() => setMobileTab('timetable')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer ${
              mobileTab === 'timetable'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Thời Khóa Biểu ({allWeeklySessions.length} ca)</span>
          </button>
          <button
            type="button"
            onClick={() => setMobileTab('classes')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer ${
              mobileTab === 'classes'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Lớp Học Của Tôi ({enrollments.length})</span>
          </button>
        </div>

        {loading ? (
          <div className="py-24 flex justify-center items-center">
            <div className="w-9 h-9 border-4 border-teal-500/20 border-t-teal-600 rounded-full animate-spin"></div>
          </div>
        ) : enrollments.length === 0 ? (
          <div className="p-12 rounded-3xl bg-white dark:bg-[#111928] border border-slate-200 dark:border-[#1e2d45] text-center space-y-4 max-w-lg mx-auto my-8 shadow-sm">
            <div className="w-16 h-16 rounded-3xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 flex items-center justify-center text-teal-600 dark:text-teal-400 mx-auto">
              <Calendar className="w-8 h-8" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-base">Bạn chưa đăng ký lớp học nào</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                Hãy khám phá các khóa học chuẩn CEFR tại ETC English Center để ghi danh và nhận thời khóa biểu học tập cá nhân.
              </p>
            </div>
            <Link
              href="/student/enroll"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition shadow-md shadow-teal-600/20 cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>Khám Phá & Đăng Ký Khóa Học</span>
            </Link>
          </div>
        ) : (
          /* ============================================================ */
          /* BỐ CỤC 2 CỘT (SPLIT-VIEW): TRÁI LÀ TKB TUẦN, PHẢI LÀ LỚP HỌC   */
          /* ============================================================ */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* ============================================================ */}
            {/* CỘT TRÁI (COL 5): THỜI KHÓA BIỂU TUẦN & LỊCH HỌC HÔM NAY       */}
            {/* ============================================================ */}
            <div
              className={`space-y-4 lg:col-span-5 xl:col-span-5 ${
                mobileTab === 'timetable' ? 'block' : 'hidden lg:block'
              }`}
            >
              {/* HERO CARD: LỊCH HỌC HÔM NAY */}
              <div className="rounded-2xl p-4 sm:p-5 bg-gradient-to-br from-teal-600 to-teal-800 text-white shadow-lg shadow-teal-700/20 space-y-3 relative overflow-hidden">
                <div className="absolute right-0 top-0 -mt-3 -mr-3 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none"></div>

                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                    <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-teal-100 bg-teal-900/40 px-2 py-0.5 rounded-full border border-teal-400/30">
                      HÔM NAY • {todayFormattedDate.split(',')[0].toUpperCase()}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-teal-100">
                    {weekDays.find((d) => d.isToday)?.dateFormatted}
                  </span>
                </div>

                <div className="relative z-10">
                  <h3 className="text-base sm:text-lg font-bold">
                    {todaySessions.length > 0
                      ? `Hôm nay bạn có ${todaySessions.length} ca học`
                      : 'Hôm nay không có ca học'}
                  </h3>
                  <p className="text-xs text-teal-100/90 mt-0.5">
                    {todaySessions.length > 0
                      ? 'Chuẩn bị giáo trình và kiểm tra phòng học bên dưới'
                      : 'Bạn có thể tự ôn tập hoặc làm bài tập trắc nghiệm với AI'}
                  </p>
                </div>

                {todaySessions.length > 0 ? (
                  <div className="space-y-2 relative z-10 pt-1">
                    {todaySessions.map((session) => (
                      <div
                        key={`today-${session.id}`}
                        onClick={() => handleScrollToClass(session.classId)}
                        className="p-3 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 transition cursor-pointer flex items-center justify-between gap-3 group"
                      >
                        <div className="min-w-0 space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-white text-teal-900">
                              {session.timeStr}
                            </span>
                            <span className="font-mono text-[11px] font-bold text-teal-100">
                              [{session.maLopHoc}]
                            </span>
                          </div>
                          <h4 className="font-bold text-sm text-white truncate">{session.tenLopHoc}</h4>
                          <div className="flex items-center gap-3 text-xs text-teal-100/90">
                            <span className="flex items-center gap-1 truncate">
                              <User className="w-3 h-3 text-teal-200" />
                              <span className="truncate">{session.teacherName}</span>
                            </span>
                            <span className="flex items-center gap-1 font-mono text-[11px]">
                              {session.isOnline ? (
                                <span className="inline-flex items-center gap-1 text-cyan-200">
                                  <Globe className="w-3 h-3" /> Online
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1">
                                  <MapPin className="w-3 h-3" /> {session.phongHoc}
                                </span>
                              )}
                            </span>
                          </div>
                        </div>

                        <ChevronRight className="w-4 h-4 text-white/70 group-hover:translate-x-1 transition-transform shrink-0" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="pt-2 flex items-center gap-2">
                    <Link
                      href="/student/ai-practice"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-teal-800 hover:bg-teal-50 text-xs font-bold transition shadow-xs cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>Luyện Trắc Nghiệm AI</span>
                    </Link>
                    <Link
                      href="/student/ai-progress"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-900/50 hover:bg-teal-900/80 text-teal-100 text-xs font-semibold transition border border-white/20 cursor-pointer"
                    >
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>Xem Tiến Độ Học</span>
                    </Link>
                  </div>
                )}
              </div>

              {/* CARD: LỊCH HỌC TRONG TUẦN (WEEKLY TIMETABLE) */}
              <div className="bg-white dark:bg-[#111928] rounded-2xl border border-slate-200/90 dark:border-[#1e2d45] shadow-xs overflow-hidden">
                <div className="p-4 border-b border-slate-100 dark:border-[#1e2d45] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                    <h3 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
                      Thời Khóa Biểu Hàng Tuần
                    </h3>
                  </div>

                  {selectedDayFilter !== 'ALL' && (
                    <button
                      onClick={() => setSelectedDayFilter('ALL')}
                      className="text-[11px] font-bold text-teal-600 dark:text-teal-400 hover:underline cursor-pointer"
                    >
                      Xem cả tuần
                    </button>
                  )}
                </div>

                {/* 7-Day Week Selector (T2 -> CN) */}
                <div className="p-3 bg-slate-50/70 dark:bg-[#162032]/60 border-b border-slate-100 dark:border-[#1e2d45]">
                  <div className="grid grid-cols-7 gap-1.5">
                    {weekDays.map((d) => {
                      const count = allWeeklySessions.filter((s) => s.thuTrongTuan === d.thu).length;
                      const isSelected = selectedDayFilter === d.thu;

                      return (
                        <button
                          key={d.thu}
                          type="button"
                          onClick={() => setSelectedDayFilter(isSelected ? 'ALL' : d.thu)}
                          className={`p-2 rounded-xl text-center transition flex flex-col items-center cursor-pointer relative ${
                            isSelected
                              ? 'bg-teal-600 text-white shadow-xs'
                              : d.isToday
                              ? 'bg-teal-50 dark:bg-teal-950/60 border border-teal-300 dark:border-teal-700 text-teal-900 dark:text-teal-200'
                              : 'bg-white dark:bg-[#111928] hover:bg-slate-100 dark:hover:bg-[#1e2d45] border border-slate-200 dark:border-[#1e2d45] text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {d.isToday && (
                            <span
                              className={`absolute -top-1 right-1 w-2 h-2 rounded-full ${
                                isSelected ? 'bg-amber-300' : 'bg-teal-500'
                              }`}
                              title="Hôm nay"
                            />
                          )}
                          <span className="text-[11px] font-bold block">{d.shortLabel}</span>
                          <span className={`text-[10px] font-mono block ${isSelected ? 'text-teal-100' : 'text-slate-400'}`}>
                            {d.dateFormatted.split('/')[0]}
                          </span>
                          {count > 0 && (
                            <span
                              className={`mt-1 text-[9px] font-bold px-1 rounded-full ${
                                isSelected
                                  ? 'bg-teal-700 text-white'
                                  : 'bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-300'
                              }`}
                            >
                              {count}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Danh sách các ca học theo bộ lọc */}
                <div className="p-3.5 space-y-2 max-h-[480px] overflow-y-auto">
                  {filteredSessionsByDay.length > 0 ? (
                    filteredSessionsByDay.map((session) => {
                      const isSessionToday = session.thuTrongTuan === todayThu;

                      return (
                        <div
                          key={`session-${session.id}`}
                          onClick={() => handleScrollToClass(session.classId)}
                          className={`p-3 rounded-xl border transition cursor-pointer hover:border-teal-400 dark:hover:border-teal-600 group ${
                            isSessionToday
                              ? 'bg-teal-50/50 dark:bg-teal-950/20 border-teal-200 dark:border-teal-900/60'
                              : 'bg-white dark:bg-[#162032] border-slate-200 dark:border-[#1e2d45]'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300">
                                Thứ {session.thuTrongTuan === 8 ? 'Chủ Nhật' : session.thuTrongTuan}
                              </span>
                              <span className="font-mono text-xs font-semibold text-slate-800 dark:text-slate-200">
                                {session.timeStr}
                              </span>
                            </div>

                            {session.isOnline ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-200 dark:border-cyan-800">
                                <Globe className="w-3 h-3" /> Online
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                                <MapPin className="w-3 h-3 text-slate-400" /> {session.phongHoc}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center justify-between gap-2">
                            <div className="min-w-0">
                              <p className="font-bold text-xs text-slate-900 dark:text-white truncate group-hover:text-teal-600 dark:group-hover:text-teal-400 transition">
                                <span className="font-mono text-teal-700 dark:text-teal-400 mr-1">
                                  [{session.maLopHoc}]
                                </span>
                                {session.tenLopHoc}
                              </p>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                                GV: <strong className="text-slate-700 dark:text-slate-300">{session.teacherName}</strong>
                              </p>
                            </div>

                            <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-teal-600 dark:group-hover:text-teal-400 group-hover:translate-x-0.5 transition shrink-0" />
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-8 text-center space-y-1.5">
                      <Clock className="w-6 h-6 text-slate-300 dark:text-slate-600 mx-auto" />
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Không có ca học nào vào{' '}
                        {selectedDayFilter === 8 ? 'Chủ Nhật' : `Thứ ${selectedDayFilter}`}
                      </p>
                      <button
                        onClick={() => setSelectedDayFilter('ALL')}
                        className="text-[11px] text-teal-600 dark:text-teal-400 font-bold hover:underline cursor-pointer"
                      >
                        Xem tất cả các ngày trong tuần
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ============================================================ */}
            {/* CỘT PHẢI (COL 7): DANH SÁCH LỚP HỌC & TIẾN ĐỘ CHI TIẾT        */}
            {/* ============================================================ */}
            <div
              className={`space-y-4 lg:col-span-7 xl:col-span-7 ${
                mobileTab === 'classes' ? 'block' : 'hidden lg:block'
              }`}
            >
              {/* Toolbar Tìm Kiếm & Lọc */}
              <div className="bg-white dark:bg-[#111928] p-3.5 rounded-2xl border border-slate-200/90 dark:border-[#1e2d45] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Tìm theo tên lớp, mã lớp, giáo viên..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-[#162032] border border-slate-200 dark:border-[#1e2d45] text-xs text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
                  <button
                    type="button"
                    onClick={() => setStatusFilter('ALL')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                      statusFilter === 'ALL'
                        ? 'bg-teal-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-[#162032] text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    Tất cả ({enrollments.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatusFilter('DANG_HOC')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                      statusFilter === 'DANG_HOC'
                        ? 'bg-teal-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-[#162032] text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    Đang Học
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatusFilter('DANG_MO_DANG_KY')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                      statusFilter === 'DANG_MO_DANG_KY'
                        ? 'bg-teal-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-[#162032] text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    Tuyển Sinh
                  </button>
                </div>
              </div>

              {/* Danh sách thẻ lớp học */}
              <div className="space-y-4">
                {filteredEnrollments.length > 0 ? (
                  filteredEnrollments.map((enr) => {
                    const lop = enr.lopHoc;
                    const isExpanded = expandedClassId === Number(lop?.id);
                    const isHighlighted = highlightedClassId === Number(lop?.id);
                    const isRecruiting = lop?.trangThai === 'DANG_MO_DANG_KY' || lop?.trangThai === 'SAP_MO';
                    const isOngoing = lop?.trangThai === 'DANG_HOC';
                    const sessions = lop?.buoiHoc || [];
                    const teacher = lop?.phanCong?.[0]?.giaoVien;

                    return (
                      <div
                        key={enr.id}
                        id={`class-card-${lop?.id}`}
                        className={`rounded-2xl bg-white dark:bg-[#111928] border transition-all duration-300 shadow-xs overflow-hidden scroll-mt-20 ${
                          isHighlighted
                            ? 'border-teal-500 ring-2 ring-teal-500/40 shadow-lg'
                            : 'border-slate-200/90 dark:border-[#1e2d45] hover:border-teal-300 dark:hover:border-teal-700'
                        }`}
                      >
                        {/* Header của thẻ lớp học */}
                        <div className="p-4 sm:p-5 space-y-3.5">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-mono text-xs font-bold text-teal-700 dark:text-teal-300 px-2.5 py-1 rounded-lg bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800">
                                {lop?.maLopHoc}
                              </span>
                              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-slate-100 dark:bg-[#162032] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#1e2d45]">
                                CEFR {lop?.khoaHoc?.trinhDoYeuCau || 'Chuẩn'}
                              </span>

                              {isRecruiting ? (
                                <span className="text-[11px] px-2.5 py-0.5 rounded-full font-bold bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 flex items-center gap-1.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                                  Đang Tuyển Sinh
                                </span>
                              ) : isOngoing ? (
                                <span className="text-[11px] px-2.5 py-0.5 rounded-full font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                  Đang Học
                                </span>
                              ) : (
                                <span className="text-[11px] px-2.5 py-0.5 rounded-full font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                                  {formatTrangThaiLopHoc(lop?.trangThai)}
                                </span>
                              )}
                            </div>

                            <span
                              className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold border ${
                                enr.trangThai === 'DA_XAC_NHAN' || enr.trangThai === 'HOAN_THANH'
                                  ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                                  : 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                              }`}
                            >
                              Hồ sơ: {formatTrangThaiDangKy(enr.trangThai)}
                            </span>
                          </div>

                          <div>
                            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                              {lop?.tenLopHoc}
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                              {lop?.khoaHoc?.tenKhoaHoc}
                            </p>
                          </div>

                          {/* Banner tuyển sinh (nếu lớp đang tuyển sinh) */}
                          {isRecruiting && (
                            <div className="p-3 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/80 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2.5">
                              <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
                              <span>
                                Lớp học đang trong giai đoạn tiếp nhận học viên (Sĩ số hiện tại:{' '}
                                <strong>{lop?.siSoHienTai || 0} / {lop?.siSoToiDa || 25} HV</strong>).
                                Buổi học đầu tiên sẽ chính thức diễn ra ngay khi lớp chuyển sang trạng thái "Đang Học".
                              </span>
                            </div>
                          )}

                          {/* 2-Column Info: Giáo Viên & Thời Gian Khóa Học */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-3 border-t border-slate-100 dark:border-[#1e2d45] text-xs">
                            <div className="space-y-0.5">
                              <span className="text-slate-500 dark:text-slate-400 text-[11px] block">Giáo viên phụ trách:</span>
                              <p className="font-bold text-slate-900 dark:text-white text-sm">
                                {teacher?.hoTen || 'Đang cập nhật phân công'}
                              </p>
                              {teacher?.chuyenMon && (
                                <span className="text-[11px] text-teal-700 dark:text-teal-400 block font-medium">
                                  Chuyên môn: {teacher.chuyenMon}
                                </span>
                              )}
                            </div>

                            <div className="space-y-0.5">
                              <span className="text-slate-500 dark:text-slate-400 text-[11px] block">Thời gian toàn khóa:</span>
                              <p className="font-bold text-slate-900 dark:text-white">
                                {lop?.ngayBatDau ? formatDate(lop.ngayBatDau) : '—'} →{' '}
                                {lop?.ngayKetThuc ? formatDate(lop.ngayKetThuc) : '—'}
                              </p>
                              <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                                Tổng số {sessions.length} buổi học theo chương trình
                              </span>
                            </div>
                          </div>

                          {/* Khung giờ học cố định hàng tuần */}
                          <div className="space-y-1.5 pt-2">
                            <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block flex items-center gap-1">
                              <Clock className="w-3 h-3 text-teal-600 dark:text-teal-400" />
                              <span>Lịch Học Cố Định Hàng Tuần</span>
                            </span>

                            {lop?.lichHoc && lop.lichHoc.length > 0 ? (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {[...(lop.lichHoc || [])]
                                  .sort((a: any, b: any) => {
                                    const dayA = Number(a.thuTrongTuan);
                                    const dayB = Number(b.thuTrongTuan);
                                    if (dayA !== dayB) return dayA - dayB;
                                    return (a.gioBatDau || '').localeCompare(b.gioBatDau || '');
                                  })
                                  .map((lh: any) => (
                                    <div
                                      key={lh.id}
                                      className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#162032] border border-slate-200/80 dark:border-[#1e2d45] flex items-center justify-between"
                                    >
                                      <div>
                                        <span className="font-bold text-teal-800 dark:text-teal-300 text-xs block">
                                          Thứ {lh.thuTrongTuan === 8 ? 'Chủ Nhật' : lh.thuTrongTuan}
                                        </span>
                                        <span className="font-mono text-slate-600 dark:text-slate-400 text-[11px]">
                                          {formatTime(lh.gioBatDau)} - {formatTime(lh.gioKetThuc)}
                                        </span>
                                      </div>

                                      {isOnlineLink(lh.phongHoc) ? (
                                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-cyan-50 dark:bg-cyan-950/50 border border-cyan-200 dark:border-cyan-800 text-[11px] font-bold text-cyan-700 dark:text-cyan-300">
                                          <Globe className="w-3 h-3" /> Online
                                        </span>
                                      ) : (
                                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white dark:bg-[#111928] border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-700 dark:text-slate-300">
                                          <MapPin className="w-3 h-3 text-slate-400" /> {lh.phongHoc || 'P.201'}
                                        </span>
                                      )}
                                    </div>
                                  ))}
                              </div>
                            ) : (
                              <p className="text-xs text-slate-400 italic">Chưa có lịch học cố định.</p>
                            )}
                          </div>

                          {/* ACTION BUTTONS (ĐÚNG PHÂN HỆ VÀ QUYỀN HỌC VIÊN - KHÔNG CÓ ACTION CỦA GIÁO VIÊN) */}
                          <div className="pt-3 border-t border-slate-100 dark:border-[#1e2d45] flex flex-wrap items-center justify-between gap-2.5">
                            <button
                              type="button"
                              onClick={() => setExpandedClassId(isExpanded ? null : Number(lop?.id))}
                              className="px-3.5 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100/80 dark:bg-teal-950/50 dark:hover:bg-teal-900/60 text-teal-800 dark:text-teal-300 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                            >
                              <Calendar className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                              <span>
                                {isExpanded
                                  ? 'Thu Gọn Lịch Trình'
                                  : `Xem Lịch Trình Buổi Học (${sessions.length} Buổi)`}
                              </span>
                              {isExpanded ? (
                                <ChevronUp className="w-3.5 h-3.5" />
                              ) : (
                                <ChevronDown className="w-3.5 h-3.5" />
                              )}
                            </button>

                            <div className="flex items-center gap-2 flex-wrap">
                              <Link
                                href={`/student/grades#class-${lop?.id}`}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-teal-50 dark:bg-[#162032] dark:hover:bg-teal-950/40 text-slate-700 dark:text-slate-200 hover:text-teal-700 dark:hover:text-teal-300 border border-slate-200 dark:border-[#22324e] text-xs font-bold transition cursor-pointer"
                                title="Xem bảng điểm và điểm kiểm tra của lớp này"
                              >
                                <Award className="w-3.5 h-3.5 text-amber-500" />
                                <span>Xem Bảng Điểm</span>
                              </Link>

                              <Link
                                href="/student/fees"
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-teal-50 dark:bg-[#162032] dark:hover:bg-teal-950/40 text-slate-700 dark:text-slate-200 hover:text-teal-700 dark:hover:text-teal-300 border border-slate-200 dark:border-[#22324e] text-xs font-bold transition cursor-pointer"
                                title="Kiểm tra học phí và hóa đơn"
                              >
                                <Receipt className="w-3.5 h-3.5 text-cyan-500" />
                                <span>Học Phí</span>
                              </Link>

                              <Link
                                href="/student/ai-progress"
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-teal-50 dark:bg-[#162032] dark:hover:bg-teal-950/40 text-slate-700 dark:text-slate-200 hover:text-teal-700 dark:hover:text-teal-300 border border-slate-200 dark:border-[#22324e] text-xs font-bold transition cursor-pointer"
                                title="Nhận tóm tắt và khuyến nghị học tập từ AI"
                              >
                                <TrendingUp className="w-3.5 h-3.5 text-purple-500" />
                                <span>AI Tiến Độ</span>
                              </Link>
                            </div>
                          </div>
                        </div>

                        {/* ACCORDION: BẢNG TIẾN TRÌNH TỪNG BUỔI HỌC VÀ CHUYÊN CẦN CÁ NHÂN */}
                        {isExpanded && (
                          <div className="bg-slate-50/80 dark:bg-[#0f172a] border-t border-slate-200 dark:border-[#1e2d45] p-4 sm:p-5 space-y-3 animate-fadeIn">
                            <div className="flex justify-between items-center">
                              <h5 className="font-bold text-xs text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                                <BookOpen className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                                <span>Tiến Độ Từng Buổi & Kết Quả Chuyên Cần Cá Nhân ({sessions.length} Buổi)</span>
                              </h5>
                              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                                {isRecruiting ? 'Lớp đang mở tuyển sinh' : 'Cập nhật tự động sau mỗi buổi học'}
                              </span>
                            </div>

                            {sessions.length > 0 ? (
                              <div className="border border-slate-200 dark:border-[#1e2d45] rounded-xl overflow-hidden bg-white dark:bg-[#111928]">
                                <div className="max-h-72 overflow-auto">
                                  <table className="w-full text-left text-xs border-collapse">
                                    <thead className="bg-slate-50 dark:bg-[#162032] text-slate-600 dark:text-slate-400 font-bold sticky top-0 border-b border-slate-200 dark:border-[#1e2d45] z-10">
                                      <tr>
                                        <th className="py-2.5 px-3 w-14 text-center">Buổi</th>
                                        <th className="py-2.5 px-3 w-28">Ngày Học</th>
                                        <th className="py-2.5 px-3 w-28">Khung Giờ</th>
                                        <th className="py-2.5 px-3">Chủ Đề Buổi Học</th>
                                        <th className="py-2.5 px-3 w-24 text-center">Tiến Độ</th>
                                        <th className="py-2.5 px-3 w-28 text-center">Chuyên Cần</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-[#1e2d45]">
                                      {sessions.map((s: any) => {
                                        const attRecord = s.diemDanh?.[0];
                                        const isDone = s.trangThai === 'DA_KET_THUC';

                                        return (
                                          <tr
                                            key={s.id}
                                            className="hover:bg-slate-50/80 dark:hover:bg-[#162032]/60 transition"
                                          >
                                            <td className="py-2.5 px-3 text-center font-bold text-slate-900 dark:text-white">
                                              <span className="w-5 h-5 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 inline-flex items-center justify-center font-mono text-[10px]">
                                                {s.soThuTu}
                                              </span>
                                            </td>
                                            <td className="py-2.5 px-3 font-medium text-slate-800 dark:text-slate-200">
                                              {formatDate(s.ngayHoc)}
                                            </td>
                                            <td className="py-2.5 px-3 font-mono text-slate-600 dark:text-slate-400 text-[11px]">
                                              {formatTime(s.gioBatDau)} - {formatTime(s.gioKetThuc)}
                                            </td>
                                            <td className="py-2.5 px-3 font-medium text-slate-800 dark:text-slate-200">
                                              {s.chuDe || `Buổi ${s.soThuTu}`}
                                            </td>
                                            <td className="py-2.5 px-3 text-center">
                                              <span
                                                className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                                  isDone
                                                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                                                    : s.trangThai === 'DANG_DIEN_RA'
                                                    ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                                                    : 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800'
                                                }`}
                                              >
                                                {isDone ? 'Đã học' : s.trangThai === 'DANG_DIEN_RA' ? 'Đang học' : 'Chưa học'}
                                              </span>
                                            </td>
                                            <td className="py-2.5 px-3 text-center">
                                              {attRecord ? (
                                                attRecord.trangThai === 'CO_MAT' ? (
                                                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                                                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Có mặt
                                                  </span>
                                                ) : attRecord.trangThai === 'VANG' ? (
                                                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/50 px-2 py-0.5 rounded-md border border-rose-200 dark:border-rose-800">
                                                    <XCircle className="w-3 h-3 text-rose-600" /> Vắng
                                                  </span>
                                                ) : attRecord.trangThai === 'DI_MUON' ? (
                                                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-800">
                                                    <Clock className="w-3 h-3 text-amber-600" /> Đi muộn
                                                  </span>
                                                ) : (
                                                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 rounded-md border border-blue-200 dark:border-blue-800">
                                                    <Info className="w-3 h-3 text-blue-600" /> Có phép
                                                  </span>
                                                )
                                              ) : isDone ? (
                                                <span className="text-slate-400 text-[11px]">—</span>
                                              ) : (
                                                <span className="text-slate-400 dark:text-slate-500 text-[11px]">
                                                  Chưa điểm danh
                                                </span>
                                              )}
                                            </td>
                                          </tr>
                                        );
                                      })}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            ) : (
                              <div className="p-4 rounded-xl bg-white dark:bg-[#111928] border border-slate-200 dark:border-[#1e2d45] text-center text-xs text-slate-500 dark:text-slate-400">
                                Chưa có danh sách buổi học nào được tạo cho lớp này.
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="p-12 rounded-2xl bg-white dark:bg-[#111928] border border-slate-200 dark:border-[#1e2d45] text-center space-y-2">
                    <Search className="w-8 h-8 text-slate-400 mx-auto" />
                    <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                      Không tìm thấy lớp học phù hợp
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Thử thay đổi từ khóa tìm kiếm hoặc chọn bộ lọc trạng thái khác.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
