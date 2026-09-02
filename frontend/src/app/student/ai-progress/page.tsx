'use client';

import React, { useEffect, useState } from 'react';
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
          setClasses(teacherSchedule);
          if (teacherSchedule.length > 0) {
            const firstClassId = Number(teacherSchedule[0].id || teacherSchedule[0].lopHocId);
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
      } catch (err) {
        console.error('Lỗi khởi tạo dữ liệu tóm tắt:', err);
      }
    };
    initData();
  }, []);

  // Khi giáo viên/quản lý đổi lớp, load danh sách học viên trong lớp đó từ cả 2 nguồn (Đăng ký học & Bảng điểm)
  const loadStudentsForClass = async (classId: number) => {
    try {
      // 1. Lấy thông tin lớp học (đã include dangKyHoc -> hocVien)
      const classInfo = await classesService.getById(classId);
      const enrolledStudents = (classInfo?.dangKyHoc || [])
        .filter((d: any) => d.hocVien)
        .map((d: any) => d.hocVien);

      // 2. Lấy thêm từ bảng điểm nếu có
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

      const mergedStudents = Array.from(studentMap.values());
      setStudentsInClass(mergedStudents);

      if (mergedStudents.length > 0) {
        setSelectedStudentId(Number(mergedStudents[0].id));
      } else {
        setSelectedStudentId(null);
      }
    } catch (err) {
      console.error('Lỗi tải danh sách học viên của lớp:', err);
      setStudentsInClass([]);
      setSelectedStudentId(null);
    }
  };

  const handleClassChange = (classId: number) => {
    setSelectedClassId(classId);
    setSummary(null);
    setErrorMsg(null);
    if (role !== 'HOC_VIEN') {
      loadStudentsForClass(classId);
    }
  };

  const handleGenerateSummary = async () => {
    if (!selectedClassId || !selectedStudentId) {
      alert('Vui lòng chọn đầy đủ lớp học và học viên cần tóm tắt.');
      return;
    }

    setLoading(true);
    setSummary(null);
    setErrorMsg(null);

    try {
      const res = await aiService.summarizeProgress(Number(selectedStudentId), Number(selectedClassId));
      setSummary(res);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Có lỗi xảy ra khi yêu cầu AI tóm tắt tiến độ.');
    } finally {
      setLoading(false);
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
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
            {/* Dropdown Lớp Học */}
            <div className="flex flex-col space-y-1">
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center space-x-1">
                <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
                <span>{role === 'HOC_VIEN' ? 'Lớp Đang Theo Học:' : 'Chọn Lớp Học:'}</span>
              </label>
              <select
                value={selectedClassId || ''}
                onChange={(e) => handleClassChange(Number(e.target.value))}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-semibold min-w-[220px]"
              >
                {classes.map((c: any) => {
                  const classObj = c.lopHoc || c;
                  const cId = c.lopHocId || c.id;
                  return (
                    <option key={cId} value={cId}>
                      [{classObj.maLopHoc}] {classObj.tenLopHoc}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Dropdown Học Viên (Dành cho Giáo viên & Quản lý) */}
            {role !== 'HOC_VIEN' && (
              <div className="flex flex-col space-y-1">
                <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center space-x-1">
                  <User className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Chọn Học Viên:</span>
                </label>
                <select
                  value={selectedStudentId || ''}
                  onChange={(e) => {
                    setSelectedStudentId(Number(e.target.value));
                    setSummary(null);
                  }}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-semibold min-w-[220px]"
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
            onClick={handleGenerateSummary}
            disabled={loading || !selectedClassId || !selectedStudentId}
            className="w-full md:w-auto flex items-center justify-center space-x-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:opacity-90 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition disabled:opacity-40 shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            <span>{loading ? 'AI Đang Phân Tích & Đối Soát...' : 'Tạo Báo Cáo Tóm Tắt AI'}</span>
          </button>
        </div>

        {/* Thông báo lỗi nếu có */}
        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Loading Spinner */}
        {loading && (
          <div className="py-24 flex flex-col items-center justify-center space-y-4 bg-slate-900/60 rounded-2xl border border-slate-800/80">
            <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
            <div className="text-center space-y-1">
              <p className="text-sm text-indigo-300 font-bold animate-pulse">
                Gemini AI đang tổng hợp lịch sử điểm danh và điểm thi...
              </p>
              <p className="text-xs text-slate-400">
                Kiểm tra tính toàn vẹn (Zero-Trust Validation) để đảm bảo không bịa đặt dữ kiện
              </p>
            </div>
          </div>
        )}

        {/* Hiển Thị Kết Quả Tóm Tắt */}
        {summary && summary.data && (
          <div className="space-y-6 animate-fadeIn">
            {/* 1. Header Báo Cáo */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white flex items-center justify-center font-black text-xl shadow-lg shadow-indigo-500/20">
                  {summary.data.hocVien?.hoTen?.split(' ').slice(-1)[0][0] || 'HV'}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-white text-lg">{summary.data.hocVien?.hoTen}</h3>
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-800 text-indigo-300 border border-slate-700">
                      {summary.data.hocVien?.maHocVien}
                    </span>
                    <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      CEFR {summary.data.hocVien?.trinhDoCEFR}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Lớp: <strong className="text-slate-200">[{summary.data.lopHoc?.maLopHoc}] {summary.data.lopHoc?.tenLopHoc}</strong> — Khóa: <span className="text-indigo-400">{summary.data.lopHoc?.tenKhoaHoc}</span>
                  </p>
                </div>
              </div>

              {/* Badge Mode */}
              <div className="flex items-center space-x-2">
                {summary.mode === 'AI_GEMINI' ? (
                  <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    <span>✨ Phân Tích Gemini AI (Zero-Trust Verified)</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                    <span>📋 Tóm Tắt Quy Tắc (Rule-Based Fallback)</span>
                  </span>
                )}
              </div>
            </div>

            {/* 2. PHẦN 1: BẢNG DỮ LIỆU GỐC (GROUND TRUTH - TỪ DATABASE) */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center space-x-2 text-white font-bold text-sm">
                  <FileText className="w-4 h-4 text-indigo-400" />
                  <span>DỮ LIỆU GỐC TỪ HỆ THỐNG (GROUND TRUTH RAW METRICS)</span>
                </div>
                <span className="text-[11px] text-slate-400 italic">
                  Dữ liệu điểm danh & điểm thi thực tế được lấy trực tiếp từ CSDL
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {/* Chuyên Cần */}
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="text-[11px] font-semibold text-slate-400 block mb-1">Tỷ Lệ Chuyên Cần</span>
                  <span className="text-base font-bold text-emerald-400 block font-mono">
                    {summary.data.duLieuGoc?.tyLeChuyenCan}
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">
                    {summary.data.duLieuGoc?.coMat}/{summary.data.duLieuGoc?.tongBuoiHoc} buổi (Vắng: {summary.data.duLieuGoc?.vang})
                  </span>
                </div>

                {/* Điểm Chuyên Cần 20% */}
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="text-[11px] font-semibold text-slate-400 block mb-1">Điểm CC (20%)</span>
                  <span className="text-base font-bold text-white block font-mono">
                    {summary.data.duLieuGoc?.diemChuyenCan != null ? (
                      summary.data.duLieuGoc?.diemChuyenCan
                    ) : (
                      <span className="text-slate-500 text-xs font-normal">Chưa chốt</span>
                    )}
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">Hệ số 0.2</span>
                </div>

                {/* Điểm Giữa Kỳ 30% */}
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="text-[11px] font-semibold text-slate-400 block mb-1">Điểm Giữa Kỳ (30%)</span>
                  <span className="text-base font-bold text-white block font-mono">
                    {summary.data.duLieuGoc?.diemGiuaKy != null ? (
                      summary.data.duLieuGoc?.diemGiuaKy
                    ) : (
                      <span className="text-amber-400 text-xs font-normal">⏳ Chưa thi</span>
                    )}
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">Hệ số 0.3</span>
                </div>

                {/* Điểm Cuối Kỳ 50% */}
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="text-[11px] font-semibold text-slate-400 block mb-1">Điểm Cuối Kỳ (50%)</span>
                  <span className="text-base font-bold text-white block font-mono">
                    {summary.data.duLieuGoc?.diemCuoiKy != null ? (
                      summary.data.duLieuGoc?.diemCuoiKy
                    ) : (
                      <span className="text-amber-400 text-xs font-normal">⏳ Chờ thi</span>
                    )}
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">Hệ số 0.5</span>
                </div>

                {/* Điểm Tổng Kết */}
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="text-[11px] font-semibold text-slate-400 block mb-1">Điểm Tổng Kết</span>
                  <span className="text-base font-bold text-cyan-400 block font-mono">
                    {summary.data.duLieuGoc?.diemTongKet != null ? (
                      summary.data.duLieuGoc?.diemTongKet
                    ) : (
                      <span className="text-slate-400 text-xs font-normal">Đang tích lũy</span>
                    )}
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">Thang 100</span>
                </div>

                {/* Xếp Loại */}
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="text-[11px] font-semibold text-slate-400 block mb-1">Xếp Loại</span>
                  <div>
                    {summary.data.duLieuGoc?.xepLoai === 'DAT' ? (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold">
                        ĐẠT
                      </span>
                    ) : summary.data.duLieuGoc?.xepLoai === 'KHONG_DAT' ? (
                      <span className="px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[11px] font-bold">
                        KHÔNG ĐẠT
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-[11px] font-bold">
                        ĐANG THEO HỌC
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Banner Giai đoạn học tập */}
              {summary.data.duLieuGoc?.giaiDoanText && (
                <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-xs flex items-center justify-between">
                  <span className="text-indigo-300 font-semibold flex items-center space-x-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Tiến độ khóa học: {summary.data.duLieuGoc.giaiDoanText}</span>
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {summary.data.duLieuGoc.giaiDoan === 'GIUA_KHOA_HOC'
                      ? '🎯 Bài thi cuối khóa chiếm 50% tổng điểm'
                      : ''}
                  </span>
                </div>
              )}

              {summary.data.duLieuGoc?.nhanXetGiaoVien && (
                <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/80 text-xs text-slate-300">
                  💬 <strong className="text-slate-200">Ghi chú từ giáo viên:</strong> {summary.data.duLieuGoc.nhanXetGiaoVien}
                </div>
              )}
            </div>

            {/* 3. PHẦN 2: BÁO CÁO PHÂN TÍCH TIẾN ĐỘ THÔNG MINH CỦA AI */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
              <div className="flex items-center space-x-2 text-indigo-400 font-bold text-sm pb-3 border-b border-slate-800">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>KẾT QUẢ TỔNG HỢP & PHÂN TÍCH TIẾN ĐỘ THÔNG MINH CỦA AI</span>
              </div>

              {/* Tóm tắt chung */}
              {summary.data.aiPhanTich?.tomTatChung && (
                <div className="p-4 rounded-xl bg-slate-950/80 border border-indigo-500/20 text-xs text-slate-200 leading-relaxed">
                  📝 <strong className="text-indigo-300">Tóm tắt chung:</strong> {summary.data.aiPhanTich.tomTatChung}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 1. Điểm mạnh */}
                <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-3">
                  <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>1. Điểm Mạnh Nổi Bật</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-line">
                    {summary.data.aiPhanTich?.diemManh || 'Duy trì tốt kỷ luật học tập.'}
                  </p>
                </div>

                {/* 2. Điểm cần khắc phục */}
                <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-3">
                  <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                    <AlertTriangle className="w-4 h-4" />
                    <span>2. Điểm Cần Khắc Phục</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-line">
                    {summary.data.aiPhanTich?.canKhacPhuc || 'Cần nỗ lực hơn trong các bài kiểm tra định kỳ.'}
                  </p>
                </div>

                {/* 3. Lời khuyên ôn tập */}
                <div className="p-5 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 space-y-3">
                  <div className="flex items-center space-x-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
                    <Lightbulb className="w-4 h-4" />
                    <span>3. Lời Khuyên Ôn Tập Kỳ Tới</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-line">
                    {summary.data.aiPhanTich?.loiKhuyen || 'Tập trung củng cố kiến thức ngữ pháp và từ vựng.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
