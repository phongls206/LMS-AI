'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { AppLayout } from '../../../components/AppLayout';
import { aiService, authService, gradesService, classesService } from '../../../services/api';
import {
  Sparkles,
  Award,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  FileText,
  User,
  GraduationCap,
  Calendar,
  Layers,
  Clock,
  ShieldCheck,
  PlusCircle,
  BrainCircuit,
  Target,
  RotateCcw,
  Printer,
  ArrowRight,
  Bot,
} from 'lucide-react';

export default function StudentAiProgressPage() {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string>('HOC_VIEN');
  const [loading, setLoading] = useState(false);
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
  const [studentsInClass, setStudentsInClass] = useState<any[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [summary, setSummary] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  // Bộ đếm ngược chống spam AI
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  // Khởi tạo lấy thông tin User & danh sách Lớp học theo phân quyền
  useEffect(() => {
    const initData = async () => {
      try {
        const me = await authService.getMe();
        setUser(me);
        setRole(me.vaiTro);

        if (me.vaiTro === 'HOC_VIEN') {
          const schedule = await gradesService.getStudentSchedule();
          setClasses(schedule);
          if (schedule.length > 0) {
            const firstClassId = schedule[0].lopHocId || schedule[0].lopHoc?.id;
            setSelectedClassId(Number(firstClassId));
            const sId = me.hoSoHocVien?.id || schedule[0].hocVienId || schedule[0].hocVien?.id;
            if (sId) setSelectedStudentId(Number(sId));
          }
        } else if (me.vaiTro === 'GIAO_VIEN') {
          const teacherSchedule = await classesService.getTeacherSchedule();
          setClasses(teacherSchedule || []);
          if (teacherSchedule && teacherSchedule.length > 0) {
            const firstClassId = Number(teacherSchedule[0].lopHocId || teacherSchedule[0].lopHoc?.id || teacherSchedule[0].id);
            setSelectedClassId(firstClassId);
            loadStudentsForClass(firstClassId);
          }
        } else {
          // QUAN_LY
          const all = await classesService.getAll();
          const list = all.data || all;
          setClasses(list);
          if (list.length > 0) {
            const firstClassId = Number(list[0].id);
            setSelectedClassId(firstClassId);
            loadStudentsForClass(firstClassId);
          }
        }

        // Khôi phục phiên tóm tắt đã lưu nếu có
        try {
          const saved = sessionStorage.getItem('etc_ai_progress_session');
          if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed.summary) {
              setSummary(parsed.summary);
              if (parsed.selectedClassId) setSelectedClassId(parsed.selectedClassId);
              if (parsed.selectedStudentId) setSelectedStudentId(parsed.selectedStudentId);
            }
          }
        } catch (e) { }
      } catch (err) {
        console.error('Lỗi khởi tạo dữ liệu tóm tắt:', err);
      }
    };
    initData();
  }, []);

  // Khi giáo viên/quản lý đổi lớp, load danh sách học viên trong lớp đó từ cả 2 nguồn (Đăng ký học & Bảng điểm)
  const loadStudentsForClass = async (classId: number) => {
    try {
      const classInfo = await classesService.getById(classId);
      const enrolledStudents = (classInfo?.dangKyHoc || [])
        .filter((d: any) => d.hocVien)
        .map((d: any) => d.hocVien);

      let gradeStudents: any[] = [];
      try {
        const gradeRecords = await gradesService.getClassGrades(classId);
        const gradeList = Array.isArray(gradeRecords) ? gradeRecords : (gradeRecords?.ketQua || []);
        gradeStudents = gradeList.filter((g: any) => g.hocVien).map((g: any) => g.hocVien);
      } catch (e) {
        // ignore
      }

      // Gộp và loại trùng lặp học viên theo id
      const studentMap = new Map<number, any>();
      enrolledStudents.forEach((s: any) => studentMap.set(Number(s.id), s));
      gradeStudents.forEach((s: any) => studentMap.set(Number(s.id), s));
      const combined = Array.from(studentMap.values());

      setStudentsInClass(combined);
      if (combined.length > 0) {
        const firstStudentId = Number(combined[0].id);
        setSelectedStudentId(firstStudentId);
      } else {
        setSelectedStudentId(null);
      }
    } catch (err) {
      console.error('Lỗi tải học viên của lớp:', err);
      setStudentsInClass([]);
      setSelectedStudentId(null);
    }
  };

  const handleClassChange = (classId: number) => {
    setSelectedClassId(classId);
    setSummary(null);
    if (role !== 'HOC_VIEN') {
      loadStudentsForClass(classId);
    }
  };

  const handleGenerateSummary = async (forceRefresh = false) => {
    if (!selectedClassId || !selectedStudentId) {
      setErrorMsg('Vui lòng chọn đầy đủ Lớp học và Học viên.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    if (forceRefresh) setSummary(null);
    sessionStorage.removeItem('etc_ai_progress_session');

    try {
      const res = await aiService.summarizeProgress(selectedStudentId, selectedClassId, forceRefresh);
      setSummary(res);
      try {
        sessionStorage.setItem(
          'etc_ai_progress_session',
          JSON.stringify({
            summary: res,
            selectedClassId,
            selectedStudentId,
          }),
        );
      } catch (e) { }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Không thể tạo báo cáo tóm tắt tiến độ.');
    } finally {
      setLoading(false);
      setCooldown(5); // 5s cooldown chống spam
    }
  };

  return (
    <AppLayout
      allowedRoles={['HOC_VIEN', 'GIAO_VIEN', 'QUAN_LY']}
      title="Báo Cáo Tóm Tắt Tiến Độ Học Tập AI"
      subtitle="Hệ thống tổng hợp kết quả học tập từ dữ liệu gốc, phân tích điểm mạnh/yếu qua AI và đưa ra lời khuyên cá nhân hóa"
    >
      <div className="space-y-6 max-w-6xl mx-auto">
        {/* Bộ lọc chọn Lớp và Học viên */}
        <div className="bg-white dark:bg-[#111827] p-4 sm:p-5 rounded-2xl border border-slate-200/90 dark:border-[#1e2d45] shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 print:hidden">
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 w-full md:w-auto">
            {/* Dropdown Lớp Học */}
            <div className="flex flex-col space-y-1 w-full sm:w-auto">
              <label className="text-[11px] font-bold text-teal-800 dark:text-teal-400 uppercase tracking-wider flex items-center space-x-1">
                <GraduationCap className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                <span>{role === 'HOC_VIEN' ? 'Lớp Đang Theo Học:' : 'Chọn Lớp Học:'}</span>
              </label>
              <select
                value={selectedClassId || ''}
                onChange={(e) => handleClassChange(Number(e.target.value))}
                className="bg-slate-50 dark:bg-[#162032] border border-slate-200 dark:border-[#22324e] rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-teal-500 font-bold w-full sm:w-auto sm:min-w-[220px] cursor-pointer"
              >
                {classes.length === 0 ? (
                  <option value="">
                    {role === 'GIAO_VIEN' ? '(Chưa được phân công giảng dạy)' : '(Chưa có lớp học nào)'}
                  </option>
                ) : (
                  classes.map((c: any) => {
                    const classObj = c.lopHoc || c;
                    const cId = c.lopHocId || c.lopHoc?.id || c.id;
                    return (
                      <option key={cId} value={cId}>
                        [{classObj.maLopHoc}] {classObj.tenLopHoc}
                      </option>
                    );
                  })
                )}
              </select>
            </div>

            {/* Dropdown Học Viên (Dành cho Giáo viên & Quản lý) */}
            {role !== 'HOC_VIEN' && (
              <div className="flex flex-col space-y-1 w-full sm:w-auto">
                <label className="text-[11px] font-bold text-teal-800 dark:text-teal-400 uppercase tracking-wider flex items-center space-x-1">
                  <User className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                  <span>Chọn Học Viên:</span>
                </label>
                <select
                  value={selectedStudentId || ''}
                  onChange={(e) => {
                    setSelectedStudentId(Number(e.target.value));
                    setSummary(null);
                  }}
                  className="bg-slate-50 dark:bg-[#162032] border border-slate-200 dark:border-[#22324e] rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-teal-500 font-bold w-full sm:w-auto sm:min-w-[220px] cursor-pointer"
                >
                  {studentsInClass.length === 0 ? (
                    <option value="">(Lớp chưa có danh sách học viên)</option>
                  ) : (
                    studentsInClass.map((st: any) => {
                      const studentId = st.id || st.hocVienId || st.hocVien?.id;
                      const maHV = st.maHocVien || st.hocVien?.maHocVien || 'HV';
                      const hoTen = st.hoTen || st.hocVien?.hoTen || 'Học viên';
                      const cefr = st.trinhDoCEFR || st.hocVien?.trinhDoCEFR;
                      return (
                        <option key={studentId} value={studentId}>
                          [{maHV}] {hoTen} {cefr ? `(CEFR ${cefr})` : ''}
                        </option>
                      );
                    })
                  )}
                </select>
              </div>
            )}
          </div>

          {/* Nút Kích Hoạt Tóm Tắt AI */}
          <button
            onClick={() => handleGenerateSummary(false)}
            disabled={loading || cooldown > 0 || !selectedClassId || !selectedStudentId}
            className="w-full md:w-auto min-h-[42px] flex items-center justify-center space-x-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 hover:opacity-95 text-white text-xs font-bold shadow-md shadow-teal-600/20 transition disabled:opacity-40 shrink-0 cursor-pointer disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                <span>AI Đang Phân Tích & Đối Soát...</span>
              </>
            ) : cooldown > 0 ? (
              <span className="flex items-center space-x-1 text-amber-100 font-bold">
                <Clock className="w-3.5 h-3.5 text-amber-200 animate-spin" />
                <span>Chờ {cooldown}s</span>
              </span>
            ) : (
              <>
                <TrendingUp className="w-4 h-4" />
                <span>Tạo Báo Cáo Tóm Tắt AI</span>
              </>
            )}
          </button>
        </div>

        {/* Thông báo lỗi nếu có */}
        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center space-x-2 shadow-sm">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Loading Spinner */}
        {loading && (
          <div className="py-24 flex flex-col items-center justify-center space-y-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="w-12 h-12 border-4 border-teal-500/20 border-t-teal-600 rounded-full animate-spin"></div>
            <div className="text-center space-y-1">
              <p className="text-sm text-teal-700 font-bold animate-pulse">
                Hệ thống AI đang tổng hợp lịch sử điểm danh và điểm thi...
              </p>
              <p className="text-xs text-slate-500">
                Kiểm tra tính toàn vẹn (Zero-Trust Validation) để đảm bảo không bịa đặt dữ kiện
              </p>
            </div>
          </div>
        )}

        {/* Trạng thái ban đầu khi chưa bấm Tóm tắt (Empty State / Onboarding Hero) */}
        {!loading && !summary && (
          <div className="p-6 md:p-8 rounded-2xl bg-white border border-slate-200/90 shadow-sm text-center relative overflow-hidden animate-fadeIn print:hidden">
            {/* Background decorative glow */}
            <div className="absolute -top-24 -right-24 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-3xl mx-auto space-y-4">
              {/* Icon badge */}
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-teal-600 to-cyan-500 text-white shadow-md shadow-teal-600/20">
                <TrendingUp className="w-6 h-6" />
              </div>

              <div className="space-y-1">
                <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-[11px] font-bold">
                  <TrendingUp className="w-3.5 h-3.5 text-teal-600" />
                  <span>Trợ Lý Sư Phạm AI • Đánh Giá Khách Quan</span>
                </div>
                <h3 className="text-lg md:text-xl font-black text-slate-900 tracking-tight">
                  Khám Phá Tiến Độ & Lộ Trình Học Tập Cá Nhân Hóa
                </h3>
                <p className="text-xs text-slate-600 max-w-lg mx-auto leading-relaxed">
                  Nhấn nút <strong>&ldquo;Tạo Báo Cáo Tóm Tắt AI&rdquo;</strong> ở góc trên bên phải để hệ thống tổng hợp lịch sử chuyên cần, bảng điểm và sinh nhận xét sư phạm chuẩn Zero-Trust.
                </p>
              </div>

              {/* 3 Trụ cột phân tích tinh gọn */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-left">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1.5 hover:border-teal-400 transition">
                  <div className="w-7 h-7 rounded-lg bg-teal-100/80 flex items-center justify-center text-teal-700 font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs">Dữ Liệu Gốc (Ground Truth)</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Đối soát chính xác tỷ lệ chuyên cần (%) và điểm 3 cột: Chuyên cần (20%), Giữa kỳ (30%), Cuối kỳ (50%).
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1.5 hover:border-teal-400 transition">
                  <div className="w-7 h-7 rounded-lg bg-cyan-100/80 flex items-center justify-center text-cyan-700 font-bold">
                    <BrainCircuit className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs">Phân Tích Đa Chiều</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    AI nhận diện điểm mạnh, kỹ năng cần khắc phục theo đúng từng giai đoạn học tập thực tế.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1.5 hover:border-teal-400 transition">
                  <div className="w-7 h-7 rounded-lg bg-blue-100/80 flex items-center justify-center text-blue-700 font-bold">
                    <Target className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs">Lời Khuyên Ôn Tập</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Chiến lược chuẩn bị trọng tâm cho bài thi cuối khóa và lộ trình phát triển chuẩn CEFR.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-center space-x-1.5 text-[11px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                <span>Cơ chế Zero-Trust: Tuyệt đối không suy diễn dữ kiện ngoài cơ sở dữ liệu</span>
              </div>
            </div>
          </div>
        )}

        {/* Hiển Thị Kết Quả Tóm Tắt (Gọn gàng, Vừa vặn tầm mắt, Chuẩn in ấn A4) */}
        {summary && summary.data && (
          <div id="etc-printable-progress" className="space-y-3.5 animate-fadeIn">
            {/* Header Tiêu Đề Khi In Ấn (Chỉ hiển thị khi bấm In/Lưu PDF) */}
            <div className="hidden print:block pb-3 mb-3 border-b-2 border-slate-900">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-base font-black text-slate-900 uppercase tracking-wide">
                    TRUNG TÂM ANH NGỮ QUỐC TẾ ETC ENGLISH
                  </h1>
                  <p className="text-[11px] text-slate-600">Hệ Thống Quản Lý Đào Tạo & Khảo Thí Chuẩn CEFR</p>
                </div>
                <div className="text-right text-[11px] text-slate-600">
                  <p className="font-bold text-slate-900 uppercase">PHIẾU ĐÁNH GIÁ TIẾN ĐỘ & SƯ PHẠM AI</p>
                  <p>Thời điểm in: {new Date().toLocaleDateString('vi-VN')} {new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
            </div>

            {/* 1. Header Tinh Gọn 1 Dòng */}
            <div className="p-3 sm:p-3.5 rounded-xl bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-[#1e2d45] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-600 to-cyan-500 text-white flex items-center justify-center font-black text-sm shadow-sm shadow-teal-500/20 shrink-0">
                  {summary.data.hocVien?.hoTen?.split(' ').slice(-1)[0][0] || 'HV'}
                </div>
                <div>
                  <div className="flex items-center flex-wrap gap-1.5 sm:gap-2">
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">{summary.data.hocVien?.hoTen}</h3>
                    <span className="font-mono text-[11px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-semibold">
                      {summary.data.hocVien?.maHocVien}
                    </span>
                    <span className="font-mono font-bold text-[11px] px-1.5 py-0.2 rounded bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                      CEFR {summary.data.hocVien?.trinhDoCEFR}
                    </span>
                    {summary.data.duLieuGoc?.xepLoai === 'DAT' && (
                      <span className="inline-flex items-center space-x-1 px-2 py-0.2 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[10px] font-bold">
                        <Sparkles className="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-400" />
                        <span>Đủ ĐK Chuyển Cấp</span>
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 flex items-center flex-wrap gap-x-2">
                    <span>
                      Lớp: <strong className="text-slate-800 dark:text-slate-200">[{summary.data.lopHoc?.maLopHoc}] {summary.data.lopHoc?.tenLopHoc}</strong>
                      {summary.data.lopHoc?.tenKhoaHoc && (
                        <> — Khóa: <span className="text-teal-700 dark:text-teal-400 font-semibold">{summary.data.lopHoc?.tenKhoaHoc}</span></>
                      )}
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium flex items-center space-x-1">
                      <Clock className="w-2.5 h-2.5 inline" />
                      <span>{new Date().toLocaleDateString('vi-VN')}</span>
                    </span>
                  </p>
                </div>
              </div>

              {/* Mode Badge & Action Toolbar */}
              <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto justify-start sm:justify-end shrink-0 pt-1 sm:pt-0 print:hidden">
                {summary.mode === 'AI_GEMINI' || summary.mode === 'AI_GEMINI_CACHED' || summary.mode === 'GEMINI_AI' ? (
                  <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-300 text-xs font-bold">
                    <TrendingUp className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                    <span>Phân Tích AI {summary.mode === 'AI_GEMINI_CACHED' ? '(Tức Thì • Smart Cache)' : '(Zero-Trust Verified)'}</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs font-bold">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    <span>Phân Tích Sư Phạm (Hệ Thống Quy Tắc)</span>
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => handleGenerateSummary(true)}
                  disabled={loading || cooldown > 0}
                  className="px-2.5 py-1 min-h-[34px] sm:min-h-0 rounded-lg bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/60 dark:hover:bg-teal-900/60 text-teal-800 dark:text-teal-300 text-[11px] font-bold flex items-center space-x-1 border border-teal-200 dark:border-teal-800 transition cursor-pointer disabled:opacity-50"
                  title="Yêu cầu AI phân tích lại lượt mới chuyên sâu"
                >
                  <RotateCcw className="w-3 h-3 text-teal-600 dark:text-teal-400" />
                  <span>Phân Tích Lại</span>
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-2.5 py-1 min-h-[34px] sm:min-h-0 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-[11px] font-bold flex items-center space-x-1 border border-slate-200 dark:border-slate-700 transition cursor-pointer"
                  title="In phiếu báo cáo tiến độ hoặc lưu thành file PDF"
                >
                  <Printer className="w-3 h-3 text-slate-600 dark:text-slate-400" />
                  <span>In / Lưu PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sessionStorage.removeItem('etc_ai_progress_session');
                    setSummary(null);
                  }}
                  className="px-2.5 py-1 min-h-[34px] sm:min-h-0 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-[11px] font-bold flex items-center space-x-1 border border-slate-200 dark:border-slate-700 transition cursor-pointer"
                  title="Xóa tóm tắt hiện tại để chọn lớp khác"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                  <span>Tạo Phiên Mới</span>
                </button>
              </div>
            </div>

            {/* 2. Dữ Liệu Gốc CSDL (Thanh Strip 6 Cột Gọn Gàng) */}
            <div className="p-3.5 rounded-xl bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-[#1e2d45] shadow-sm space-y-2">
              <div className="flex items-center justify-between text-xs pb-1 border-b border-slate-100 dark:border-[#1e2d45]">
                <div className="flex items-center space-x-1.5 font-bold text-slate-800 dark:text-slate-200 text-[11px]">
                  <FileText className="w-3.5 h-3.5 text-teal-600" />
                  <span className="uppercase tracking-wider">Dữ Liệu Gốc:</span>
                  <span className="text-teal-700 dark:text-teal-300 font-semibold">
                    {summary.data.duLieuGoc?.giaiDoanText || 'Đang trong quá trình học'}
                  </span>
                </div>
                {summary.data.duLieuGoc?.nhanXetGiaoVien && (
                  <span className="text-[11px] text-slate-500 italic truncate max-w-sm hidden sm:inline">
                    💬 GV: &ldquo;{summary.data.duLieuGoc.nhanXetGiaoVien}&rdquo;
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                {/* Chuyên Cần */}
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#1a2540] border border-slate-200/80 dark:border-[#1e2d45]">
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block">Tỷ Lệ Chuyên Cần</span>
                  <div className="flex items-baseline space-x-1 mt-0.5">
                    <span className="text-sm font-black text-emerald-700 dark:text-emerald-400 font-mono">
                      {summary.data.duLieuGoc?.tyLeChuyenCan}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      ({summary.data.duLieuGoc?.coMat}/{summary.data.duLieuGoc?.tongBuoiHoc}b)
                    </span>
                  </div>
                </div>

                {/* Điểm Chuyên Cần 20% */}
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#1a2540] border border-slate-200/80 dark:border-[#1e2d45]">
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block">Điểm CC (20%)</span>
                  <span className="text-sm font-black text-slate-900 dark:text-white block font-mono mt-0.5">
                    {summary.data.duLieuGoc?.diemChuyenCan != null ? summary.data.duLieuGoc.diemChuyenCan : '—'}
                  </span>
                </div>

                {/* Điểm Giữa Kỳ 30% */}
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#1a2540] border border-slate-200/80 dark:border-[#1e2d45]">
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block">Giữa Kỳ (30%)</span>
                  <span className="text-sm font-black text-slate-900 dark:text-white block font-mono mt-0.5">
                    {summary.data.duLieuGoc?.diemGiuaKy != null ? (
                      summary.data.duLieuGoc.diemGiuaKy
                    ) : (
                      <span className="text-amber-600 text-xs font-normal">Chưa thi</span>
                    )}
                  </span>
                </div>

                {/* Điểm Cuối Kỳ 50% */}
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#1a2540] border border-slate-200/80 dark:border-[#1e2d45]">
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block">Cuối Kỳ (50%)</span>
                  <span className="text-sm font-black text-slate-900 dark:text-white block font-mono mt-0.5">
                    {summary.data.duLieuGoc?.diemCuoiKy != null ? (
                      summary.data.duLieuGoc.diemCuoiKy
                    ) : (
                      <span className="text-amber-600 text-xs font-normal">Chờ thi</span>
                    )}
                  </span>
                </div>

                {/* Điểm Tổng Kết */}
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#1a2540] border border-slate-200/80 dark:border-[#1e2d45]">
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block">Tổng Kết</span>
                  <span className="text-sm font-black text-teal-700 dark:text-teal-300 block font-mono mt-0.5">
                    {summary.data.duLieuGoc?.diemTongKet != null ? (
                      summary.data.duLieuGoc.diemTongKet
                    ) : (
                      <span className="text-slate-400 text-xs font-normal">Đang tích lũy</span>
                    )}
                  </span>
                </div>

                {/* Xếp Loại */}
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#1a2540] border border-slate-200/80 dark:border-[#1e2d45] flex flex-col justify-between">
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block">Xếp Loại</span>
                  <div className="mt-0.5">
                    {summary.data.duLieuGoc?.xepLoai === 'DAT' ? (
                      <span className="px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 text-emerald-700 text-[10px] font-bold">
                        ĐẠT
                      </span>
                    ) : summary.data.duLieuGoc?.xepLoai === 'KHONG_DAT' ? (
                      <span className="px-1.5 py-0.5 rounded bg-rose-50 dark:bg-rose-950/60 border border-rose-200 text-rose-700 text-[10px] font-bold">
                        KHÔNG ĐẠT
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.5 rounded bg-teal-50 dark:bg-teal-950/60 border border-teal-200 text-teal-700 text-[10px] font-bold">
                        ĐANG HỌC
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Báo Cáo Phân Tích AI (Thiết kế Card 3 Cột Ngang Tinh Gọn) */}
            <div className="p-3.5 rounded-xl bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-[#1e2d45] shadow-sm space-y-2.5">
              {/* Tóm tắt chung 1 dòng highlight */}
              {summary.data.aiPhanTich?.tomTatChung && (
                <div className="p-2.5 px-3 rounded-lg bg-teal-50/70 dark:bg-[#151f33] border border-teal-200/80 dark:border-teal-700/50 text-xs text-slate-800 dark:text-slate-100 flex items-start space-x-2">
                  <TrendingUp className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                  <div className="leading-relaxed">
                    <strong className="text-teal-900 dark:text-teal-300 font-bold">Đánh giá chung: </strong>
                    <span className="font-medium">{summary.data.aiPhanTich.tomTatChung}</span>
                  </div>
                </div>
              )}

              {/* 3 Cột Điểm Mạnh - Cần Khắc Phục - Lời Khuyên (Hiển thị chuyên sâu, chi tiết) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* 1. Điểm mạnh */}
                <div className="p-3.5 rounded-xl bg-emerald-50/60 dark:bg-[#13222e] border border-emerald-200/90 dark:border-emerald-700/50 space-y-1.5 shadow-2xs">
                  <div className="flex items-center space-x-1.5 text-emerald-800 dark:text-emerald-400 font-bold text-[11px] uppercase tracking-wider">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>1. Điểm Mạnh Nổi Bật</span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-normal whitespace-pre-line">
                    {summary.data.aiPhanTich?.diemManh || 'Học viên duy trì tốt tinh thần và nỗ lực trong các buổi học.'}
                  </p>
                </div>

                {/* 2. Điểm cần khắc phục */}
                <div className="p-3.5 rounded-xl bg-amber-50/60 dark:bg-[#251f22] border border-amber-200/90 dark:border-amber-700/50 space-y-1.5 shadow-2xs">
                  <div className="flex items-center space-x-1.5 text-amber-800 dark:text-amber-400 font-bold text-[11px] uppercase tracking-wider">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                    <span>2. Hạn Chế Cần Khắc Phục</span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-normal whitespace-pre-line">
                    {summary.data.aiPhanTich?.canKhacPhuc || 'Cần chú ý cải thiện điểm số và đảm bảo tỷ lệ chuyên cần tối thiểu.'}
                  </p>
                </div>

                {/* 3. Lời khuyên ôn tập */}
                <div className="p-3.5 rounded-xl bg-cyan-50/60 dark:bg-[#142338] border border-cyan-200/90 dark:border-cyan-700/50 space-y-1.5 shadow-2xs">
                  <div className="flex items-center space-x-1.5 text-cyan-800 dark:text-cyan-400 font-bold text-[11px] uppercase tracking-wider">
                    <Lightbulb className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 shrink-0" />
                    <span>3. Kế Hoạch & Lời Khuyên Ôn Tập</span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-normal whitespace-pre-line">
                    {summary.data.aiPhanTich?.loiKhuyen || 'Tập trung củng cố kiến thức ngữ pháp cốt lõi và từ vựng theo khung CEFR.'}
                  </p>
                </div>
              </div>
            </div>

            {/* 4. Thanh Hành Động Nhanh (Quick Action CTAs) - Chỉ hiển thị cho tài khoản Học viên */}
            {role === 'HOC_VIEN' && (
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-teal-50/80 via-cyan-50/60 to-slate-50 dark:from-[#13222e] dark:via-[#142338] dark:to-[#111827] border border-teal-200/80 dark:border-teal-800/60 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3 print:hidden">
                <div className="flex items-center space-x-2 text-slate-700 dark:text-slate-200">
                  <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-100">
                      Hành Động Khuyến Nghị Tiếp Theo
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Tận dụng ngay các định hướng từ AI để củng cố kỹ năng và tiến bộ vượt bậc
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full sm:w-auto justify-end shrink-0">
                  <Link
                    href="/student/ai-practice"
                    className="flex-1 sm:flex-none justify-center px-3.5 py-2 min-h-[40px] rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center space-x-1.5 shadow-sm shadow-teal-600/20 transition cursor-pointer"
                    title="Chuyển sang làm bài tập trắc nghiệm AI để củng cố kiến thức"
                  >
                    <BrainCircuit className="w-3.5 h-3.5" />
                    <span>Luyện Đề AI Ngay</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                  <Link
                    href="/student/ai-consult"
                    className="flex-1 sm:flex-none justify-center px-3.5 py-2 min-h-[40px] rounded-lg bg-white dark:bg-[#1a2540] hover:bg-slate-50 dark:hover:bg-[#223052] text-teal-800 dark:text-teal-300 text-xs font-bold flex items-center space-x-1.5 border border-teal-300 dark:border-teal-700 shadow-2xs transition cursor-pointer"
                    title="Nhận tư vấn lớp học tiếp theo phù hợp với trình độ CEFR"
                  >
                    <Bot className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                    <span>
                      {summary.data.duLieuGoc?.xepLoai === 'DAT' ? 'Tư Vấn Lớp Kế Tiếp' : 'Tư Vấn Lộ Trình Ôn'}
                    </span>
                    <ArrowRight className="w-3 h-3 text-teal-600 dark:text-teal-400" />
                  </Link>
                </div>
              </div>
            )}

            {/* Khối Chữ Ký Xác Nhận Chính Thức (Chỉ xuất hiện khi In Ấn / Xuất PDF) */}
            <div className="hidden print:grid grid-cols-2 gap-8 pt-8 mt-6 border-t border-slate-300 text-center text-xs text-slate-800 break-inside-avoid">
              <div>
                <p className="font-bold uppercase">Học Viên Xác Nhận</p>
                <p className="italic text-[10px] text-slate-500 mt-0.5">(Ký và ghi rõ họ tên)</p>
                <div className="h-16"></div>
                <p className="font-semibold text-slate-900">{summary.data.hocVien?.hoTen}</p>
              </div>
              <div>
                <p className="font-bold uppercase">Giáo Viên Phụ Trách / TT Ngoại Ngữ ETC</p>
                <p className="italic text-[10px] text-slate-500 mt-0.5">(Xác nhận chuyên môn & kết quả)</p>
                <div className="h-16"></div>
                <p className="font-semibold text-slate-900">Ban Đào Tạo ETC English</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
