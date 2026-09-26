'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { AppLayout } from '../../../components/AppLayout';
import { classesService, attendancesService } from '../../../services/api';
import {
  GraduationCap, Users, Calendar, Clock, MapPin, AlertCircle,
  CheckCircle, ChevronDown, ChevronUp, BookOpen, Lock, ChevronRight,
  RefreshCw, Search, Filter, Globe, CalendarCheck, Sparkles, ArrowRight,
  Sun, Check, Eye, Edit3, X, ChevronsUpDown
} from 'lucide-react';
import Link from 'next/link';
import { formatTrangThaiLopHoc } from '../../../utils/formatters';
import { ClassStudentsModal } from '../../../components/ClassStudentsModal';

// Online link detector
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
    s.endsWith('.vn') ||
    s.includes('alo.com')
  );
};

interface FlatSession {
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
  trangThai: string;
  courseName: string;
  cefr: string;
  siSoHienTai: number;
  siSoToiDa: number;
}

export default function TeacherClassesPage() {
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedClassId, setExpandedClassId] = useState<number | null>(null);
  const [selectedClassForStudents, setSelectedClassForStudents] = useState<{
    id: number;
    name?: string;
    code?: string;
  } | null>(null);

  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'DANG_HOC' | 'DANG_MO_DANG_KY'>('ALL');
  const [selectedDayFilter, setSelectedDayFilter] = useState<number | 'ALL'>('ALL');
  const [highlightedClassId, setHighlightedClassId] = useState<number | null>(null);

  // Quản lý trạng thái ẩn/hiện chi tiết của từng thẻ lớp học ở cột bên phải (mặc định thu gọn để tránh lặp lịch học)
  const [openedClassIds, setOpenedClassIds] = useState<Record<number, boolean>>({});

  // Tab switch for mobile view: 'timetable' | 'classes'
  const [mobileTab, setMobileTab] = useState<'timetable' | 'classes'>('timetable');



  const fetchClasses = async (isManual = false) => {
    try {
      if (isManual) setRefreshing(true);
      else setLoading(true);

      const list = await classesService.getTeacherSchedule();
      setClasses(list || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

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

  // Tính toán các ngày trong tuần hiện tại (Thứ 2 -> Chủ Nhật kèm ngày/tháng thực tế)
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

  // Trích xuất toàn bộ ca dạy trong tuần từ các lớp phụ trách
  const allWeeklySessions = useMemo(() => {
    const sessions: FlatSession[] = [];
    for (const item of classes) {
      const lop = item.lopHoc;
      if (!lop || !lop.lichHoc) continue;

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
          trangThai: lop.trangThai,
          courseName: lop.khoaHoc?.tenKhoaHoc || '',
          cefr: lop.khoaHoc?.trinhDoYeuCau || '',
          siSoHienTai: lop.siSoHienTai || 0,
          siSoToiDa: lop.siSoToiDa || 25,
        });
      }
    }

    return sessions.sort((a, b) => {
      if (a.thuTrongTuan !== b.thuTrongTuan) return a.thuTrongTuan - b.thuTrongTuan;
      return a.gioBatDau.localeCompare(b.gioBatDau);
    });
  }, [classes]);

  // Ca dạy hôm nay
  const todaySessions = useMemo(() => {
    return allWeeklySessions.filter((s) => s.thuTrongTuan === todayThu);
  }, [allWeeklySessions, todayThu]);

  // Ca dạy theo bộ lọc ngày được chọn (hoặc tất cả)
  const filteredSessionsByDay = useMemo(() => {
    if (selectedDayFilter === 'ALL') return allWeeklySessions;
    return allWeeklySessions.filter((s) => s.thuTrongTuan === selectedDayFilter);
  }, [allWeeklySessions, selectedDayFilter]);

  // Lọc danh sách lớp học ở cột bên phải
  const filteredClasses = useMemo(() => {
    return classes.filter((item) => {
      const lop = item.lopHoc;
      if (!lop) return false;

      const q = search.toLowerCase().trim();
      const matchSearch =
        !q ||
        lop.maLopHoc?.toLowerCase().includes(q) ||
        lop.tenLopHoc?.toLowerCase().includes(q) ||
        lop.khoaHoc?.tenKhoaHoc?.toLowerCase().includes(q);

      const matchStatus =
        statusFilter === 'ALL' ||
        (statusFilter === 'DANG_HOC' && lop.trangThai === 'DANG_HOC') ||
        (statusFilter === 'DANG_MO_DANG_KY' && (lop.trangThai === 'DANG_MO_DANG_KY' || lop.trangThai === 'SAP_MO'));

      // Nếu đang chọn lọc theo 1 ngày cụ thể trên TKB, ưu tiên lớp có lịch ngày đó
      const matchDay =
        selectedDayFilter === 'ALL' ||
        lop.lichHoc?.some((lh: any) => Number(lh.thuTrongTuan) === selectedDayFilter);

      return matchSearch && matchStatus && matchDay;
    });
  }, [classes, search, statusFilter, selectedDayFilter]);

  // Toggle ẩn / hiện chi tiết của 1 thẻ lớp học
  const toggleClassCard = (classId: number) => {
    setOpenedClassIds((prev) => ({
      ...prev,
      [classId]: !prev[classId],
    }));
  };

  // Kiểm tra xem tất cả các thẻ lớp học đang lọc đã mở chưa
  const isAllCardsOpened = useMemo(() => {
    if (filteredClasses.length === 0) return false;
    return filteredClasses.every((item) => openedClassIds[Number(item.lopHoc?.id)]);
  }, [filteredClasses, openedClassIds]);

  // Mở rộng tất cả hoặc thu gọn tất cả thẻ lớp học
  const toggleAllCards = () => {
    if (isAllCardsOpened) {
      setOpenedClassIds({});
    } else {
      const all: Record<number, boolean> = {};
      filteredClasses.forEach((item) => {
        if (item.lopHoc?.id) all[Number(item.lopHoc.id)] = true;
      });
      setOpenedClassIds(all);
    }
  };

  // Chọn lớp từ TKB: cuộn sang lớp bên phải, tự động mở rộng chi tiết lớp và chuyển tab trên mobile
  const handleSelectClass = (classId: number) => {
    setHighlightedClassId(classId);
    setOpenedClassIds((prev) => ({ ...prev, [classId]: true }));
    setExpandedClassId(classId);
    setMobileTab('classes');
    const el = document.getElementById(`class-card-${classId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    setTimeout(() => {
      setHighlightedClassId((prev) => (prev === classId ? null : prev));
    }, 3500);
  };

  // Đọc tham số classId từ URL khi chuyển trang từ Dashboard sang
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const classIdParam = params.get('classId');
      if (classIdParam && classes.length > 0) {
        const cId = Number(classIdParam);
        setHighlightedClassId(cId);
        setOpenedClassIds((prev) => ({ ...prev, [cId]: true }));
        setExpandedClassId(cId);
        setMobileTab('classes');
        setTimeout(() => {
          const el = document.getElementById(`class-card-${cId}`);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
      }
    }
  }, [classes]);

  return (
    <AppLayout
      allowedRoles={['GIAO_VIEN']}
      title="Thời Khóa Biểu & Lớp Phụ Trách"
      subtitle="Theo dõi lịch dạy thực tế hôm nay, thời khóa biểu tuần và quản lý tiến độ các lớp học"
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
                  Lịch Giảng Dạy & Lớp Học
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                  {classes.length} Lớp
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
                Tuần này có <strong className="font-bold text-teal-600 dark:text-teal-400">{allWeeklySessions.length}</strong> ca dạy
              </span>
            </div>

            <button
              onClick={() => fetchClasses(true)}
              disabled={refreshing}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-teal-50 dark:bg-[#162032] dark:hover:bg-teal-950/40 text-slate-700 dark:text-slate-200 hover:text-teal-700 dark:hover:text-teal-300 border border-slate-200 dark:border-[#22324e] hover:border-teal-300 dark:hover:border-teal-700 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-2xs disabled:opacity-50"
              title="Làm mới lịch dạy và tiến độ lớp"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-teal-600 dark:text-teal-400' : ''}`} />
              <span>{refreshing ? 'Đang tải...' : 'Làm mới'}</span>
            </button>
          </div>
        </div>

        {/* Mobile Tab Switcher (Chỉ hiển thị trên điện thoại / tablet nhỏ) */}
        <div className="lg:hidden flex rounded-xl bg-slate-100 dark:bg-[#111928] p-1 border border-slate-200 dark:border-[#1e2d45]">
          <button
            type="button"
            onClick={() => setMobileTab('timetable')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer ${mobileTab === 'timetable'
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
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer ${mobileTab === 'classes'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Lớp Phụ Trách ({classes.length})</span>
          </button>
        </div>

        {loading ? (
          <div className="py-24 flex justify-center items-center">
            <div className="w-9 h-9 border-4 border-teal-500/20 border-t-teal-600 rounded-full animate-spin"></div>
          </div>
        ) : classes.length === 0 ? (
          <div className="p-12 rounded-2xl bg-white dark:bg-[#111928] border border-slate-200 dark:border-[#1e2d45] text-center space-y-2">
            <Calendar className="w-10 h-10 text-slate-400 mx-auto" />
            <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">Bạn chưa có lớp học nào được phân công</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Vui lòng liên hệ quản trị viên trung tâm để được phân công lớp phụ trách và xếp thời khóa biểu.
            </p>
          </div>
        ) : (
          /* BỐ CỤC 2 CỘT (SPLIT-VIEW): BÊN TRÁI LÀ TKB / LỊCH DẠY, BÊN PHẢI LÀ LỚP HỌC */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* ============================================================ */}
            {/* CỘT TRÁI (COL 5): THỜI KHÓA BIỂU & LỊCH DẠY HÔM NAY           */}
            {/* ============================================================ */}
            <div
              className={`space-y-4 lg:col-span-5 xl:col-span-5 ${mobileTab === 'timetable' ? 'block' : 'hidden lg:block'
                }`}
            >
              {/* HERO CARD: LỊCH DẠY HÔM NAY (ĐÁP ỨNG TRỰC DIỆN NHU CẦU NGƯỜI DÙNG) */}
              <div className="rounded-2xl p-4 sm:p-5 bg-gradient-to-br from-teal-600 to-teal-800 text-white shadow-lg shadow-teal-700/20 space-y-3 relative overflow-hidden">
                <div className="absolute right-0 top-0 -mt-3 -mr-3 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none"></div>

                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-teal-100 bg-teal-900/50 px-2.5 py-1 rounded-full border border-teal-400/30">
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
                      ? `Hôm nay bạn có ${todaySessions.length} ca dạy lên lớp`
                      : 'Hôm nay bạn không có lịch dạy'}
                  </h3>
                  <p className="text-xs text-teal-100/90 mt-0.5">
                    {todaySessions.length > 0
                      ? 'Vui lòng kiểm tra phòng học và bấm "Điểm Danh" sau khi bắt đầu ca học'
                      : 'Tận hưởng ngày nghỉ hoặc chuẩn bị giáo án cho các buổi học tiếp theo.'}
                  </p>
                </div>

                {/* Danh sách ca dạy hôm nay (nếu có) */}
                {todaySessions.length > 0 ? (
                  <div className="space-y-2 pt-1 relative z-10">
                    {todaySessions.map((sess) => {
                      const isOngoing = sess.trangThai === 'DANG_HOC';
                      return (
                        <div
                          key={sess.id}
                          className="p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 transition flex items-center justify-between gap-3 text-xs"
                        >
                          <div className="min-w-0 pr-1">
                            <div className="flex items-center gap-2 font-mono font-bold text-white text-sm">
                              <span>🕒 {sess.timeStr}</span>
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/20 text-white font-mono">
                                {sess.maLopHoc}
                              </span>
                            </div>
                            <div className="font-semibold text-teal-100 truncate mt-0.5">
                              {sess.tenLopHoc}
                            </div>
                            <div className="flex items-center gap-2 text-[11px] text-teal-200 mt-1">
                              <span className="flex items-center gap-1">
                                {sess.isOnline ? <Globe className="w-3 h-3" /> : <MapPin className="w-3 h-3" />}
                                <span className="truncate">{sess.phongHoc}</span>
                              </span>
                              <span>•</span>
                              <span>{sess.siSoHienTai}/{sess.siSoToiDa} HV</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            {isOngoing && (
                              <Link
                                href={`/teacher/attendance?classId=${sess.classId}`}
                                className="px-3 py-1.5 rounded-lg bg-white text-teal-800 font-bold text-[11px] hover:bg-teal-50 transition text-center shadow-xs cursor-pointer inline-block"
                              >
                                Điểm Danh
                              </Link>
                            )}
                            <button
                              type="button"
                              onClick={() => handleSelectClass(sess.classId)}
                              className="px-2.5 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white font-bold text-[11px] transition text-center cursor-pointer flex items-center gap-1"
                              title="Xem chi tiết và quản lý lớp học này"
                            >
                              <span>Quản lý</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="pt-2 border-t border-teal-700/50 flex items-center justify-between text-xs text-teal-100/90 relative z-10">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>Ca dạy tiếp theo:</span>
                    </span>
                    {allWeeklySessions.length > 0 ? (
                      <span className="font-bold text-white">
                        {allWeeklySessions[0].thuTrongTuan === 8
                          ? 'Chủ Nhật'
                          : `Thứ ${allWeeklySessions[0].thuTrongTuan}`}{' '}
                        ({allWeeklySessions[0].timeStr})
                      </span>
                    ) : (
                      <span>Chưa có lịch</span>
                    )}
                  </div>
                )}
              </div>

              {/* THANH CHỌN THỨ TRONG TUẦN KÈM NGÀY/THÁNG THỰC TẾ (WEEK STRIP) */}
              <div className="bg-white dark:bg-[#111928] p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 dark:border-[#1e2d45] shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                    <span>Lọc Theo Ngày Trong Tuần</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedDayFilter('ALL')}
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-md transition cursor-pointer ${selectedDayFilter === 'ALL'
                        ? 'bg-teal-600 text-white'
                        : 'text-slate-500 hover:text-teal-600 dark:hover:text-teal-400'
                      }`}
                  >
                    Xem tất cả ({allWeeklySessions.length})
                  </button>
                </div>

                {/* 7 ngày trong tuần */}
                <div className="grid grid-cols-7 gap-1.5">
                  {weekDays.map((d) => {
                    const isSelected = selectedDayFilter === d.thu;
                    const sessionCount = allWeeklySessions.filter((s) => s.thuTrongTuan === d.thu).length;
                    const hasClass = sessionCount > 0;

                    return (
                      <button
                        key={d.thu}
                        type="button"
                        onClick={() => setSelectedDayFilter(isSelected ? 'ALL' : d.thu)}
                        className={`p-1.5 rounded-xl border text-center transition flex flex-col items-center justify-center cursor-pointer relative ${isSelected
                            ? 'bg-teal-600 text-white border-teal-600 shadow-md shadow-teal-600/20'
                            : d.isToday
                              ? 'bg-teal-50 dark:bg-teal-950/40 text-teal-900 dark:text-teal-200 border-teal-300 dark:border-teal-700'
                              : 'bg-slate-50 dark:bg-[#162032] hover:bg-slate-100 dark:hover:bg-[#1d293d] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-[#22324e]'
                          }`}
                      >
                        {d.isToday && (
                          <span className={`text-[9px] font-extrabold uppercase px-1 rounded-sm leading-tight mb-0.5 ${isSelected ? 'bg-white text-teal-800' : 'bg-teal-600 text-white'
                            }`}>
                            Nay
                          </span>
                        )}
                        <span className="text-xs font-bold">{d.shortLabel}</span>
                        <span className={`text-[10px] font-mono mt-0.5 ${isSelected ? 'text-teal-100' : 'text-slate-400'
                          }`}>
                          {d.dateFormatted}
                        </span>

                        {/* Chấm tròn biểu thị có ca học */}
                        {hasClass && (
                          <span
                            className={`w-1.5 h-1.5 rounded-full mt-1 ${isSelected
                                ? 'bg-white'
                                : d.isToday
                                  ? 'bg-teal-600'
                                  : 'bg-teal-500'
                              }`}
                            title={`${sessionCount} ca dạy`}
                          ></span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* BẢNG THỜI KHÓA BIỂU CHI TIẾT THEO NGÀY ĐÃ CHỌN */}
              <div className="bg-white dark:bg-[#111928] p-4 rounded-2xl border border-slate-200/90 dark:border-[#1e2d45] shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                    <span>
                      {selectedDayFilter === 'ALL'
                        ? 'Thời Khóa Biểu Cả Tuần'
                        : `Lịch Dạy ${selectedDayFilter === 8 ? 'Chủ Nhật' : `Thứ ${selectedDayFilter}`} (${weekDays.find((d) => d.thu === selectedDayFilter)?.dateFormatted})`}
                    </span>
                  </h4>
                  <span className="text-[11px] text-slate-400 font-mono font-medium">
                    {filteredSessionsByDay.length} ca dạy
                  </span>
                </div>

                {filteredSessionsByDay.length === 0 ? (
                  <div className="py-8 text-center space-y-1">
                    <p className="text-xs text-slate-400 italic">
                      {selectedDayFilter === 'ALL'
                        ? 'Chưa có lớp nào được xếp thời khóa biểu.'
                        : 'Không có ca dạy nào trong ngày này.'}
                    </p>
                    {selectedDayFilter !== 'ALL' && (
                      <button
                        type="button"
                        onClick={() => setSelectedDayFilter('ALL')}
                        className="text-[11px] text-teal-600 dark:text-teal-400 font-bold hover:underline cursor-pointer"
                      >
                        Bấm để xem lịch các ngày khác
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
                    {filteredSessionsByDay.map((sess) => {
                      const dayObj = weekDays.find((d) => d.thu === sess.thuTrongTuan);
                      const isToday = sess.thuTrongTuan === todayThu;
                      const isOngoing = sess.trangThai === 'DANG_HOC';

                      return (
                        <div
                          key={sess.id}
                          onClick={() => handleSelectClass(sess.classId)}
                          className={`p-3 rounded-xl border transition-all cursor-pointer group shadow-2xs ${
                            highlightedClassId === sess.classId
                              ? 'bg-teal-50/80 dark:bg-teal-950/40 border-teal-500 ring-2 ring-teal-500/30 shadow-md'
                              : isToday
                              ? 'bg-teal-50/40 dark:bg-teal-950/20 border-teal-300 dark:border-teal-800 hover:border-teal-400'
                              : 'bg-slate-50 dark:bg-[#141d2e] border-slate-200 dark:border-[#22324e] hover:border-teal-400 dark:hover:border-teal-500 hover:shadow-xs'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-1.5">
                              <span
                                className={`px-2 py-0.5 rounded-md font-bold font-mono text-[11px] border ${isToday
                                    ? 'bg-teal-600 text-white border-teal-600'
                                    : 'bg-white dark:bg-[#101725] text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800'
                                  }`}
                              >
                                {dayObj?.label || `Thứ ${sess.thuTrongTuan}`} ({dayObj?.dateFormatted})
                              </span>
                              {isToday && (
                                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                                  ● Hôm nay
                                </span>
                              )}
                            </div>

                            <span className="font-mono font-bold text-xs text-slate-800 dark:text-slate-200">
                              🕒 {sess.timeStr}
                            </span>
                          </div>

                          <div className="flex items-center justify-between gap-2">
                            <div className="min-w-0">
                              <div className="font-bold text-slate-900 dark:text-white text-xs truncate group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                                [{sess.maLopHoc}] {sess.tenLopHoc}
                              </div>
                              <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5 flex items-center gap-1" title={sess.phongHoc}>
                                {sess.isOnline ? (
                                  <Globe className="w-3 h-3 text-blue-500 shrink-0" />
                                ) : (
                                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                                )}
                                <span className="truncate">{sess.phongHoc}</span>
                                <span>• Sĩ số: {sess.siSoHienTai}/{sess.siSoToiDa} HV</span>
                              </div>
                            </div>

                            <span className="text-[11px] text-teal-600 dark:text-teal-400 group-hover:translate-x-0.5 transition-transform shrink-0 flex items-center gap-0.5 font-bold">
                              <span>Quản lý</span>
                              <ArrowRight className="w-3 h-3" />
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* ============================================================ */}
            {/* CỘT PHẢI (COL 7): DANH SÁCH LỚP HỌC ĐANG PHỤ TRÁCH            */}
            {/* ============================================================ */}
            <div
              className={`space-y-4 lg:col-span-7 xl:col-span-7 ${mobileTab === 'classes' ? 'block' : 'hidden lg:block'
                }`}
            >
              {/* Thanh lọc & tìm kiếm lớp học */}
              <div className="bg-white dark:bg-[#111928] p-3 sm:p-3.5 rounded-2xl border border-slate-200/90 dark:border-[#1e2d45] shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Tìm theo mã lớp, tên lớp, khóa học..."
                    className="w-full bg-slate-50 dark:bg-[#162032] border border-slate-200 dark:border-[#22324e] rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-teal-500 font-medium"
                  />
                  {search && (
                    <button
                      type="button"
                      onClick={() => setSearch('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs p-1"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
                  <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">Trạng thái:</span>
                  {(['ALL', 'DANG_HOC', 'DANG_MO_DANG_KY'] as const).map((st) => {
                    const label =
                      st === 'ALL'
                        ? 'Tất cả'
                        : st === 'DANG_HOC'
                          ? 'Đang Học'
                          : 'Đang Tuyển Sinh';
                    const isSelected = statusFilter === st;

                    return (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setStatusFilter(st)}
                        className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer ${isSelected
                            ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                            : 'bg-slate-50 dark:bg-[#162032] hover:bg-slate-100 dark:hover:bg-[#1e2d45] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-[#22324e]'
                          }`}
                      >
                        {label}
                      </button>
                    );
                  })}

                  {filteredClasses.length > 0 && (
                    <button
                      type="button"
                      onClick={toggleAllCards}
                      className="px-2.5 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer bg-slate-50 hover:bg-slate-100 dark:bg-[#162032] dark:hover:bg-[#1e2d45] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-[#22324e] inline-flex items-center gap-1.5 shrink-0"
                      title={isAllCardsOpened ? 'Thu gọn tất cả lớp học' : 'Hiển thị chi tiết tất cả lớp học'}
                    >
                      <ChevronsUpDown className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                      <span className="hidden sm:inline">{isAllCardsOpened ? 'Thu Gọn Tất Cả' : 'Mở Rộng Tất Cả'}</span>
                      <span className="sm:hidden">{isAllCardsOpened ? 'Thu Gọn' : 'Mở Rộng'}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Thông báo nếu đang lọc theo ngày */}
              {selectedDayFilter !== 'ALL' && (
                <div className="p-2.5 rounded-xl bg-teal-50/70 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800 text-xs text-teal-800 dark:text-teal-300 flex items-center justify-between">
                  <span>
                    Đang lọc hiển thị các lớp có lịch học vào{' '}
                    <strong>
                      {selectedDayFilter === 8 ? 'Chủ Nhật' : `Thứ ${selectedDayFilter}`} (
                      {weekDays.find((d) => d.thu === selectedDayFilter)?.dateFormatted})
                    </strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedDayFilter('ALL')}
                    className="font-bold underline hover:text-teal-900 cursor-pointer ml-2"
                  >
                    Bỏ lọc ngày
                  </button>
                </div>
              )}

              {/* Danh sách các thẻ lớp học (Class Cards) */}
              {filteredClasses.length === 0 ? (
                <div className="p-10 rounded-2xl bg-white dark:bg-[#111928] border border-slate-200 dark:border-[#1e2d45] text-center space-y-2">
                  <p className="text-xs text-slate-400 italic">
                    Không tìm thấy lớp học nào phù hợp với bộ lọc.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearch('');
                      setStatusFilter('ALL');
                      setSelectedDayFilter('ALL');
                    }}
                    className="text-xs text-teal-600 dark:text-teal-400 font-bold hover:underline cursor-pointer"
                  >
                    Xóa toàn bộ bộ lọc
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredClasses.map((item) => {
                    const lop = item.lopHoc;
                    const classIdNum = Number(lop?.id);
                    const isCardOpen = !!openedClassIds[classIdNum];
                    const isRecruiting = lop?.trangThai === 'DANG_MO_DANG_KY' || lop?.trangThai === 'SAP_MO';
                    const isOngoing = lop?.trangThai === 'DANG_HOC';
                    const isExpanded = expandedClassId === classIdNum;
                    const isHighlighted = highlightedClassId === classIdNum;
                    const sessions = lop?.buoiHoc || [];

                    return (
                      <div
                        id={`class-card-${lop?.id}`}
                        key={item.id}
                        className={`rounded-2xl bg-white dark:bg-[#111928] border transition-all duration-300 shadow-xs overflow-hidden ${isHighlighted
                            ? 'border-teal-500 ring-2 ring-teal-500/20 shadow-lg shadow-teal-500/10'
                            : 'border-slate-200/90 dark:border-[#1e2d45] hover:border-teal-400 dark:hover:border-teal-500'
                          }`}
                      >
                        {/* Header của thẻ lớp học (Luôn hiển thị — Bấm vào để ẩn/hiện chi tiết) */}
                        <div
                          onClick={() => toggleClassCard(classIdNum)}
                          className="p-4 sm:p-5 cursor-pointer hover:bg-slate-50/70 dark:hover:bg-[#162032]/40 transition-colors select-none"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="space-y-1.5 min-w-0 flex-1">
                              {/* Top Row: Mã lớp, CEFR, Trạng thái & Role badge */}
                              <div className="flex flex-wrap items-center gap-1.5">
                                <span className="font-mono text-xs font-bold text-teal-700 dark:text-teal-400 px-2.5 py-0.5 rounded-lg bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800">
                                  {lop?.maLopHoc}
                                </span>
                                <span className="text-[11px] px-2 py-0.5 rounded-full font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
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

                                <span className="text-[11px] font-bold text-teal-800 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded-lg border border-teal-200 dark:border-teal-800">
                                  Giáo Viên Phụ Trách
                                </span>
                              </div>

                              {/* Tên lớp & Khóa học */}
                              <div>
                                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                                  {lop?.tenLopHoc}
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                  {lop?.khoaHoc?.tenKhoaHoc}
                                </p>
                              </div>

                              {/* Tóm tắt nhanh khi đang thu gọn: tránh lặp lại lịch học với TKB bên trái */}
                              {!isCardOpen && (
                                <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-500 dark:text-slate-400">
                                  <span>
                                    Sĩ số: <strong className="text-slate-700 dark:text-slate-300">{lop?.siSoHienTai || 0}/{lop?.siSoToiDa || 25} HV</strong>
                                  </span>
                                  <span>•</span>
                                  <span className="flex items-center gap-1 text-teal-600 dark:text-teal-400 font-medium">
                                    <Clock className="w-3.5 h-3.5" />
                                    {lop?.lichHoc?.length || 0} ca dạy/tuần
                                  </span>
                                  <span>•</span>
                                  <span>{sessions.length} buổi học</span>
                                </div>
                              )}
                            </div>

                            {/* Nút Toggle ẩn/hiện chi tiết */}
                            <div className="shrink-0 flex items-center self-start sm:self-center">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleClassCard(classIdNum);
                                }}
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border shadow-2xs ${
                                  isCardOpen
                                    ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800'
                                    : 'bg-slate-100 hover:bg-teal-50 dark:bg-[#162032] dark:hover:bg-teal-950/40 text-slate-700 dark:text-slate-300 hover:text-teal-700 dark:hover:text-teal-300 border-slate-200 dark:border-[#22324e] hover:border-teal-300'
                                }`}
                              >
                                <span>{isCardOpen ? 'Thu Gọn' : 'Xem Chi Tiết'}</span>
                                {isCardOpen ? (
                                  <ChevronUp className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                                ) : (
                                  <ChevronDown className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Thân thẻ lớp học: Chỉ hiển thị khi bấm mở rộng (Tránh lặp lại 2 lịch học cạnh nhau) */}
                        {isCardOpen && (
                          <div className="p-4 sm:p-5 pt-0 space-y-3.5 border-t border-slate-100 dark:border-[#1e2d45] mt-0 animate-fadeIn">
                            {/* Cảnh báo nếu lớp đang tuyển sinh */}
                            {isRecruiting && (
                              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2 mt-3">
                                <AlertCircle className="w-3.5 h-3.5 shrink-0 text-amber-600 mt-0.5" />
                                <div className="leading-relaxed text-[11px]">
                                  <strong>Lớp đang tuyển sinh:</strong> Sĩ số hiện tại: {lop?.siSoHienTai || 0}/{lop?.siSoToiDa || 25} HV.
                                  Tính năng Điểm danh & Bảng điểm sẽ kích hoạt khi lớp chuyển sang <strong>"Đang Học"</strong>.
                                </div>
                              </div>
                            )}

                            {/* Metric stats grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-[#162032] border border-slate-200/80 dark:border-[#22324e] text-xs pt-3 border-t border-slate-100 dark:border-[#1e2d45]">
                              <div
                                onClick={() =>
                                  setSelectedClassForStudents({
                                    id: Number(lop?.id),
                                    name: lop?.tenLopHoc,
                                    code: lop?.maLopHoc,
                                  })
                                }
                                className="p-2 rounded-lg bg-white dark:bg-[#101725] border border-slate-200 dark:border-[#1e2d45] hover:border-teal-400 transition cursor-pointer group shadow-2xs"
                                title="Bấm để xem danh sách học viên"
                              >
                                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                                  <span>Sĩ số:</span>
                                  <span className="font-bold text-teal-600 dark:text-teal-400 flex items-center gap-0.5">
                                    Xem DS <ChevronRight className="w-3 h-3" />
                                  </span>
                                </div>
                                <div className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">
                                  {lop?.siSoHienTai || 0} / {lop?.siSoToiDa || 25} HV
                                </div>
                              </div>

                              <div className="p-2 rounded-lg bg-white dark:bg-[#101725] border border-slate-200 dark:border-[#1e2d45]">
                                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Thời gian học:</span>
                                <div className="font-bold text-slate-900 dark:text-white text-xs mt-0.5">
                                  {lop?.ngayBatDau ? formatDate(lop.ngayBatDau) : '—'} → {lop?.ngayKetThuc ? formatDate(lop.ngayKetThuc) : '—'}
                                </div>
                              </div>

                              <div className="p-2 rounded-lg bg-white dark:bg-[#101725] border border-slate-200 dark:border-[#1e2d45]">
                                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Tiến độ buổi học:</span>
                                <div className="font-bold text-slate-900 dark:text-white text-xs mt-0.5">
                                  {sessions.filter((s: any) => s.trangThai === 'DA_KET_THUC').length} / {sessions.length} Buổi
                                </div>
                              </div>
                            </div>

                            {/* Khung giờ cố định của lớp này */}
                            <div>
                              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1.5">
                                Khung Giờ Lên Lớp Hàng Tuần
                              </span>
                              {lop?.lichHoc && lop.lichHoc.length > 0 ? (
                                <div className="flex flex-wrap gap-1.5">
                                  {lop.lichHoc.map((lh: any) => (
                                    <div
                                      key={lh.id}
                                      className="px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-[#162032] border border-slate-200 dark:border-[#22324e] text-xs flex items-center gap-1.5"
                                    >
                                      <span className="font-bold text-teal-700 dark:text-teal-400 font-mono">
                                        {lh.thuTrongTuan === 8 ? 'Chủ Nhật' : `Thứ ${lh.thuTrongTuan}`}
                                      </span>
                                      <span className="font-mono text-slate-600 dark:text-slate-300 text-[11px]">
                                        {formatTime(lh.gioBatDau)} - {formatTime(lh.gioKetThuc)}
                                      </span>
                                      <span className="text-slate-400 dark:text-slate-500 text-[10px]">
                                        ({lh.phongHoc})
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-xs text-slate-400 italic">Chưa xếp lịch học hàng tuần.</p>
                              )}
                            </div>

                            {/* Action Buttons Bar */}
                            <div className="flex flex-wrap items-center justify-between gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                              <button
                                type="button"
                                onClick={() => setExpandedClassId(isExpanded ? null : Number(lop?.id))}
                                className="px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100/80 dark:bg-teal-950/50 dark:hover:bg-teal-900/60 text-teal-800 dark:text-teal-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                              >
                                <Calendar className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                                <span>
                                  {isExpanded
                                    ? 'Thu gọn lịch trình'
                                    : `Lịch Trình Chi Tiết (${sessions.length} Buổi)`}
                                </span>
                                {isExpanded ? (
                                  <ChevronUp className="w-3.5 h-3.5" />
                                ) : (
                                  <ChevronDown className="w-3.5 h-3.5" />
                                )}
                              </button>

                              <div className="flex items-center gap-2">
                                {isRecruiting ? (
                                  <>
                                    <button
                                      disabled
                                      className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 text-xs font-bold border border-slate-200 dark:border-slate-700 cursor-not-allowed flex items-center gap-1"
                                      title="Lớp đang mở tuyển sinh, chưa bắt đầu học."
                                    >
                                      <Lock className="w-3 h-3" />
                                      <span>Điểm Danh</span>
                                    </button>
                                    <button
                                      disabled
                                      className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 text-xs font-bold border border-slate-200 dark:border-slate-700 cursor-not-allowed flex items-center gap-1"
                                      title="Lớp đang mở tuyển sinh, chưa có điểm số."
                                    >
                                      <Lock className="w-3 h-3" />
                                      <span>Bảng Điểm</span>
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    <Link
                                      href={`/teacher/attendance?classId=${lop?.id}`}
                                      className="px-4 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition shadow-xs cursor-pointer flex items-center gap-1.5"
                                    >
                                      <span>Điểm Danh</span>
                                    </Link>
                                    <Link
                                      href={`/teacher/grades?classId=${lop?.id}`}
                                      className="px-4 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition border border-slate-200 dark:border-slate-700 cursor-pointer"
                                    >
                                      Bảng Điểm
                                    </Link>
                                  </>
                                )}
                              </div>
                            </div>

                            {/* Expandable Session Timeline Table */}
                            {isExpanded && (
                              <div className="bg-slate-50/80 dark:bg-[#141c2e]/90 border-t border-slate-200 dark:border-[#1e2d45] p-4 sm:p-5 space-y-3 animate-fadeIn mt-2 -mx-4 -mb-4 sm:-mx-5 sm:-mb-5">
                                <div className="flex justify-between items-center">
                                  <h5 className="font-bold text-xs text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                                    <BookOpen className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                                    <span>Lịch Trình Chi Tiết Từng Buổi Học ({sessions.length} Buổi)</span>
                                  </h5>
                                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                                    {isRecruiting ? 'Lớp chưa khai giảng' : 'Lớp đang học'}
                                  </span>
                                </div>

                                {sessions.length > 0 ? (
                                  <div className="border border-slate-200 dark:border-[#22324e] rounded-xl overflow-hidden bg-white dark:bg-[#101725]">
                                    <div className="max-h-64 overflow-auto">
                                      <table className="w-full text-left text-xs border-collapse">
                                        <thead className="bg-slate-50 dark:bg-[#162032] text-slate-600 dark:text-slate-300 font-bold sticky top-0 border-b border-slate-200 dark:border-[#22324e] z-10">
                                          <tr>
                                            <th className="py-2 px-3 w-14 text-center">Buổi</th>
                                            <th className="py-2 px-3 w-28">Ngày Học</th>
                                            <th className="py-2 px-3 w-28">Khung Giờ</th>
                                            <th className="py-2 px-3">Chủ Đề Buổi Học</th>
                                            <th className="py-2 px-3 w-24 text-center">Trạng Thái</th>
                                            <th className="py-2 px-3 w-28 text-center">Điểm Danh</th>
                                          </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 dark:divide-[#1e2d45]">
                                          {sessions.map((s: any) => {
                                            const isDone = s.trangThai === 'DA_KET_THUC';
                                            const attCount = s._count?.diemDanh || 0;

                                            return (
                                              <tr key={s.id} className="hover:bg-slate-50/80 dark:hover:bg-teal-950/20 transition">
                                                <td className="py-2 px-3 text-center font-bold">
                                                  <span className="w-5 h-5 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 inline-flex items-center justify-center font-mono text-[10px]">
                                                    {s.soThuTu}
                                                  </span>
                                                </td>
                                                <td className="py-2 px-3 font-medium text-slate-800 dark:text-slate-200">
                                                  {formatDate(s.ngayHoc)}
                                                </td>
                                                <td className="py-2 px-3 font-mono text-slate-600 dark:text-slate-400 text-[11px]">
                                                  {formatTime(s.gioBatDau)} - {formatTime(s.gioKetThuc)}
                                                </td>
                                                <td className="py-2 px-3 font-medium text-slate-800 dark:text-slate-200">
                                                  {(s.chuDe || `Bài học số ${s.soThuTu}`).replace(/^Buổi\s+\d+\s*:\s*/i, '')}
                                                </td>
                                                <td className="py-2 px-3 text-center">
                                                  <span
                                                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${isDone
                                                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                                                        : s.trangThai === 'DANG_DIEN_RA'
                                                          ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                                                          : 'bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800'
                                                      }`}
                                                  >
                                                    {isDone ? 'Đã học' : s.trangThai === 'DANG_DIEN_RA' ? 'Đang học' : 'Chưa học'}
                                                  </span>
                                                </td>
                                                <td className="py-2 px-3 text-center font-mono text-[11px]">
                                                  {isDone ? (
                                                    <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                                                      Đã ghi ({attCount} HV)
                                                    </span>
                                                  ) : isRecruiting ? (
                                                    <span className="text-slate-400">Chưa khai giảng</span>
                                                  ) : (
                                                    <span className="text-slate-400">Chưa điểm danh</span>
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
                                  <div className="p-4 rounded-xl bg-white dark:bg-[#101725] border border-slate-200 dark:border-[#22324e] text-center text-xs text-slate-400">
                                    Chưa có danh sách buổi học nào cho lớp này.
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal xem danh sách học viên của lớp */}
      {selectedClassForStudents && (
        <ClassStudentsModal
          classId={selectedClassForStudents.id}
          initialClassName={selectedClassForStudents.name}
          initialClassCode={selectedClassForStudents.code}
          onClose={() => setSelectedClassForStudents(null)}
        />
      )}

    </AppLayout>
  );
}
