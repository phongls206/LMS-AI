'use client';

import React, { useEffect, useState } from 'react';
import { AppLayout } from '../../../components/AppLayout';
import { classesService, gradesService, authStorage } from '../../../services/api';
import { Save, CheckCircle, Sparkles, BookOpen, AlertCircle, FileSpreadsheet, Download, Award, Lock, X, ShieldAlert } from 'lucide-react';
import { exportClassGradeBookExcel } from '../../../utils/excel-exporter';
import { useTableSort, SortIndicator } from '../../../utils/useTableSort';

export default function TeacherGradesPage() {
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
  const [classDetail, setClassDetail] = useState<any>(null);
  const [gradesMap, setGradesMap] = useState<
    Record<number, { cc: number | ''; gk: number | ''; ck: number | ''; nhanXet: string }>
  >({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    try {
      const user = authStorage.getUser();
      if (user) setCurrentUser(user);
    } catch {}
  }, []);

  const isManager = currentUser?.vaiTro === 'QUAN_LY';
  const isClassFinished = classDetail?.trangThai === 'DA_KET_THUC';
  const isClassRecruiting = classDetail?.trangThai === 'DANG_MO_DANG_KY' || classDetail?.trangThai === 'SAP_MO';
  const isLockedForTeacher = isClassFinished && !isManager;
  const isReadOnly = isManager || isLockedForTeacher;

  // 1. Lấy danh sách lớp phụ trách (Chỉ Quản lý mới xem tất cả lớp, Giáo viên chỉ xem lớp mình được phân công)
  useEffect(() => {
    const fetchAssignedClasses = async () => {
      try {
        let isMgr = false;
        try {
          const user = authStorage.getUser();
          if (user && user.vaiTro === 'QUAN_LY') isMgr = true;
        } catch {}

        let assignedClasses: any[] = [];
        if (isMgr) {
          const all = await classesService.getAll();
          assignedClasses = all || [];
        } else {
          // Giáo viên: CHỈ lấy các lớp được phân công giảng dạy thực tế
          const schedule = await classesService.getTeacherSchedule();
          assignedClasses = (schedule || [])
            .map((item: any) => item.lopHoc)
            .filter(Boolean);
        }

        const validClasses = (assignedClasses || []).filter((c: any) => c.trangThai !== 'DA_HUY');
        setClasses(validClasses);

        // Đọc query param ?classId=... từ URL nếu có
        const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
        const queryClassId = urlParams ? urlParams.get('classId') : null;
        if (queryClassId && validClasses.some((c: any) => c.id === +queryClassId)) {
          setSelectedClassId(+queryClassId);
        } else if (validClasses.length > 0) {
          setSelectedClassId(validClasses[0].id);
        } else {
          setSelectedClassId(null);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAssignedClasses();
  }, []);

  useEffect(() => {
    if (!selectedClassId) {
      setClassDetail(null);
      setGradesMap({});
      return;
    }

    const fetchGrades = async () => {
      try {
        const [detail, existingGrades] = await Promise.all([
          classesService.getById(selectedClassId),
          gradesService.getClassGrades(selectedClassId),
        ]);
        setClassDetail(detail);

        const initial: Record<number, { cc: number | ''; gk: number | ''; ck: number | ''; nhanXet: string }> = {};
        detail.dangKyHoc?.forEach((dk: any) => {
          const g = (existingGrades || []).find((item: any) => Number(item.hocVienId) === Number(dk.hocVien.id));
          initial[dk.hocVien.id] = {
            cc: g?.diemChuyenCan !== null && g?.diemChuyenCan !== undefined ? Number(g.diemChuyenCan) : '',
            gk: g?.diemGiuaKy !== null && g?.diemGiuaKy !== undefined ? Number(g.diemGiuaKy) : '',
            ck: g?.diemCuoiKy !== null && g?.diemCuoiKy !== undefined ? Number(g.diemCuoiKy) : '',
            nhanXet: g?.nhanXet || '',
          };
        });
        setGradesMap(initial);
      } catch (err) {
        console.error(err);
      }
    };
    fetchGrades();
  }, [selectedClassId]);

  const handleGradeChange = (
    studentId: number,
    field: 'cc' | 'gk' | 'ck' | 'nhanXet',
    value: any,
  ) => {
    if (isReadOnly) return;
    setGradesMap((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: value,
      },
    }));
  };

  const calculateFinal = (cc: number | '', gk: number | '', ck: number | '') => {
    if (cc === '' || gk === '' || ck === '' || cc === undefined || gk === undefined || ck === undefined) {
      return null;
    }
    const numCc = Number(cc);
    const numGk = Number(gk);
    const numCk = Number(ck);
    if (isNaN(numCc) || isNaN(numGk) || isNaN(numCk)) return null;
    return (numCc * 0.2 + numGk * 0.3 + numCk * 0.5).toFixed(2);
  };

  const isPass = (cc: number | '', final: number) => {
    if (cc === '' || cc === undefined || isNaN(Number(cc))) return false;
    return final >= 50.0 && Number(cc) >= 80.0;
  };

  const handleSaveGrades = async () => {
    if (!selectedClassId) return;
    if (isManager) {
      setErrorMessage('Quản trị viên chỉ có quyền theo dõi bảng điểm. Việc nhập và lưu điểm thuộc thẩm quyền của Giáo viên phụ trách.');
      setTimeout(() => setErrorMessage(null), 4000);
      return;
    }
    if (isClassRecruiting) {
      setErrorMessage('Lớp học đang mở tuyển sinh, chưa vào học chính thức. Không thể nhập bảng điểm!');
      setTimeout(() => setErrorMessage(null), 4000);
      return;
    }
    if (isLockedForTeacher) {
      setErrorMessage('Lớp học đã kết thúc. Bảng điểm đã đóng sổ và không thể chỉnh sửa.');
      setTimeout(() => setErrorMessage(null), 4000);
      return;
    }
    setSaving(true);
    try {
      const payload = Object.entries(gradesMap).map(([studentId, val]) => ({
        hocVienId: +studentId,
        diemChuyenCan: val.cc !== '' && val.cc !== undefined && val.cc !== null && !isNaN(+val.cc) ? +val.cc : null,
        diemGiuaKy: val.gk !== '' && val.gk !== undefined && val.gk !== null && !isNaN(+val.gk) ? +val.gk : null,
        diemCuoiKy: val.ck !== '' && val.ck !== undefined && val.ck !== null && !isNaN(+val.ck) ? +val.ck : null,
        nhanXet: val.nhanXet || '',
      }));

      await gradesService.submitGrades(selectedClassId, payload);
      setMessage('Lưu bảng điểm & tự động tính điểm tổng kết 20/30/50 thành công!');
      setTimeout(() => setMessage(null), 3500);
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Có lỗi xảy ra khi lưu bảng điểm.');
      setTimeout(() => setErrorMessage(null), 4500);
    } finally {
      setSaving(false);
    }
  };

  const enrollments = classDetail?.dangKyHoc || [];
  const {
    sortKey,
    sortOrder,
    toggleSort,
    sortedData: sortedEnrollments,
  } = useTableSort(enrollments, {
    valueExtractors: {
      maHocVien: (dk: any) => dk.hocVien?.maHocVien || '',
      hoTen: (dk: any) => dk.hocVien?.hoTen || '',
      cc: (dk: any) => (gradesMap[dk.hocVien?.id]?.cc !== '' ? Number(gradesMap[dk.hocVien?.id]?.cc) : -1),
      gk: (dk: any) => (gradesMap[dk.hocVien?.id]?.gk !== '' ? Number(gradesMap[dk.hocVien?.id]?.gk) : -1),
      ck: (dk: any) => (gradesMap[dk.hocVien?.id]?.ck !== '' ? Number(gradesMap[dk.hocVien?.id]?.ck) : -1),
      final: (dk: any) => {
        const g = gradesMap[dk.hocVien?.id];
        if (!g) return -1;
        const f = calculateFinal(g.cc, g.gk, g.ck);
        return f ? Number(f) : -1;
      },
      xepLoai: (dk: any) => {
        const g = gradesMap[dk.hocVien?.id];
        if (!g) return -1;
        const f = calculateFinal(g.cc, g.gk, g.ck);
        if (f === null) return -1;
        return isPass(g.cc, Number(f)) ? 1 : 0;
      },
    },
  });

  return (
    <AppLayout
      allowedRoles={['GIAO_VIEN', 'QUAN_LY']}
      title={isManager ? "Theo Dõi Bảng Điểm Toàn Trung Tâm" : "Bảng Điểm & Đánh Giá Kết Quả Học Tập"}
      subtitle={
        isManager
          ? "Tra cứu và theo dõi bảng điểm tất cả các lớp học. Việc nhập và tính điểm thuộc về giáo viên phụ trách lớp."
          : "Chỉ hiển thị các lớp học bạn được phân công phụ trách. Công thức: 20% Chuyên Cần + 30% Giữa Kỳ + 50% Cuối Kỳ"
      }
    >
      <div className="space-y-5">
        {/* Banner chế độ giám sát dành riêng cho Admin */}
        {isManager && (
          <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-[#162032] border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 flex items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2.5">
              <ShieldAlert className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
              <span>
                <strong>Chế độ giám sát của Quản trị viên:</strong> Bạn đang theo dõi bảng điểm theo quyền quản lý trung tâm. Việc nhập điểm là nghiệp vụ của Giáo viên phụ trách.
              </span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 shrink-0">
              Chỉ Xem (Read-only)
            </span>
          </div>
        )}

        {/* Thông báo lỗi & thành công */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs font-bold flex items-center justify-between gap-2 shadow-xs animate-fadeIn">
            <span className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </span>
            <button type="button" onClick={() => setErrorMessage(null)} className="text-rose-600 hover:text-rose-800 dark:text-rose-400 cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        {message && (
          <div className="p-3.5 rounded-xl bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-200 text-xs font-bold flex items-center justify-between gap-2 shadow-xs animate-fadeIn">
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
              <span>{message}</span>
            </span>
            <button type="button" onClick={() => setMessage(null)} className="text-teal-600 hover:text-teal-800 dark:text-teal-400 cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {loading ? (
          <div className="py-20 flex justify-center items-center">
            <div className="w-8 h-8 border-4 border-teal-500/20 border-t-teal-600 rounded-full animate-spin"></div>
          </div>
        ) : classes.length === 0 ? (
          <div className="p-8 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl text-center space-y-3">
            <AlertCircle className="w-10 h-10 text-amber-600 dark:text-amber-400 mx-auto" />
            <h3 className="text-base font-bold text-amber-900 dark:text-amber-200">Chưa được phân công phụ trách lớp học nào</h3>
            <p className="text-xs text-amber-700 dark:text-amber-300 max-w-md mx-auto">
              Bạn chỉ có thể xem và nhập bảng điểm cho các lớp học được Ban Quản Lý phân công giảng dạy. Vui lòng liên hệ quản trị viên nếu có thắc mắc.
            </p>
          </div>
        ) : (
          <>
            <div className="bg-white dark:bg-[#111928] border border-slate-200/90 dark:border-[#1e2d45] p-4 sm:p-5 rounded-2xl shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex items-center space-x-3 w-full sm:w-auto">
                  <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 flex items-center justify-center text-teal-700 dark:text-teal-300 shrink-0">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                        {isManager ? 'Chọn Lớp Học' : 'Lớp Phụ Trách'}
                      </label>
                      {isClassFinished ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
                          <Lock className="w-3 h-3 text-slate-500" />
                          Đã Kết Thúc (Khóa Điểm)
                        </span>
                      ) : isClassRecruiting ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                          Đang Tuyển Sinh
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                          Đang Học
                        </span>
                      )}
                    </div>
                    <select
                      value={selectedClassId || ''}
                      onChange={(e) => setSelectedClassId(+e.target.value)}
                      className="mt-0.5 bg-slate-50 dark:bg-[#162032] border border-slate-200 dark:border-[#22324e] rounded-lg px-3 py-1.5 text-xs font-bold text-teal-900 dark:text-teal-400 focus:outline-none focus:border-teal-500"
                    >
                      {classes.map((c) => (
                        <option key={c.id} value={c.id}>
                          [{c.maLopHoc}] {c.tenLopHoc} {c.trangThai === 'DA_KET_THUC' ? '• (Đã kết thúc)' : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 self-end sm:self-auto">
                  <button
                    type="button"
                    onClick={() =>
                      exportClassGradeBookExcel({
                        classDetail,
                        gradesMap,
                        calculateFinal,
                        isPass,
                      })
                    }
                    disabled={!selectedClassId || !classDetail?.dangKyHoc?.length}
                    className="px-3.5 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 text-xs font-bold transition flex items-center space-x-1.5 shadow-xs cursor-pointer disabled:opacity-50"
                    title="Xuất bảng điểm chi tiết ra file Excel .xlsx"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Xuất Bảng Điểm Excel</span>
                  </button>

                  {isManager ? (
                    <div
                      className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 flex items-center space-x-1.5 select-none"
                      title="Quản trị viên chỉ có quyền theo dõi bảng điểm. Việc nhập và lưu điểm thuộc thẩm quyền của Giáo viên phụ trách."
                    >
                      <ShieldAlert className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                      <span>Chế Độ Quản Trị (Chỉ Xem)</span>
                    </div>
                  ) : isLockedForTeacher ? (
                    <div
                      className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 flex items-center space-x-1.5 cursor-not-allowed select-none"
                      title="Lớp học đã bế giảng. Bảng điểm đã đóng sổ và không thể chỉnh sửa."
                    >
                      <Lock className="w-4 h-4 text-slate-500 shrink-0" />
                      <span>Bảng Điểm Đã Khóa</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSaveGrades}
                      disabled={saving || !selectedClassId || isClassRecruiting}
                      className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-xs hover:shadow transition flex items-center space-x-1.5 disabled:opacity-50 cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>{saving ? 'Đang lưu...' : 'Lưu Bảng Điểm'}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {isClassFinished && (
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 text-xs text-amber-900 dark:text-amber-200 flex items-start space-x-3 animate-fadeIn">
                <Lock className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-bold text-amber-950 dark:text-amber-100 flex items-center gap-2">
                    <span>Lớp Học Đã Kết Thúc — Bảng Điểm Đã Đóng Sổ</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-200/60 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200">
                      Chỉ Xem (Read-only)
                    </span>
                  </div>
                  <p className="text-amber-800 dark:text-amber-300 leading-relaxed text-[11px]">
                    {isManager
                      ? "Lớp học đã bế giảng và bảng điểm đã được lưu trữ vào hồ sơ trung tâm. Nếu có đơn phúc khảo hoặc cần cập nhật lại điểm, Quản trị viên chỉ cần vào màn hình 'Quản Lý Lớp Học' chuyển trạng thái lớp sang 'Đang Học' để cấp quyền cho giáo viên phụ trách nhập lại điểm."
                      : "Toàn bộ điểm chuyên cần, giữa kỳ và cuối kỳ đã được chốt và lưu trữ vào hồ sơ trung tâm. Giáo viên không thể tự ý sửa đổi. Mọi yêu cầu phúc khảo hoặc điều chỉnh điểm cần có đơn gửi tới Phòng Đào tạo (Admin) để mở lại trạng thái lớp học."}
                  </p>
                </div>
              </div>
            )}

            {isClassRecruiting && (
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-bold text-amber-950 dark:text-amber-100">
                    Lớp học đang trong giai đoạn Mở Tuyển Sinh (Chưa Khai Giảng Chính Thức)
                  </div>
                  <p className="text-amber-800 dark:text-amber-300 leading-relaxed text-[11px]">
                    Lớp <strong className="font-mono">[{classDetail?.maLopHoc}] {classDetail?.tenLopHoc}</strong> hiện đang tiếp nhận học viên. Bảng điểm sẽ được kích hoạt khi lớp hoàn tất tuyển sinh.
                  </p>
                </div>
              </div>
            )}

            <div className="p-3.5 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-xs text-teal-800 dark:text-teal-300 flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
              <span>
                <strong>Quy chuẩn ĐẠT:</strong> Điểm Tổng Kết ≥ 50.00 điểm <strong>VÀ</strong> Chuyên Cần ≥ 80.00 điểm.
              </span>
            </div>

            <div className="bg-white dark:bg-[#111928] border border-slate-200/90 dark:border-[#1e2d45] rounded-2xl overflow-hidden shadow-xs">
              <div className="w-full overflow-x-auto scrollbar-thin">
                <table className="min-w-[780px] w-full text-left text-xs text-slate-700 dark:text-slate-200">
                  <thead className="bg-slate-50 dark:bg-[#162032] text-slate-600 dark:text-slate-300 uppercase text-[11px] font-bold tracking-wider border-b border-slate-200 dark:border-[#1e2d45]">
                    <tr>
                      <th onClick={() => toggleSort('maHocVien')} className="px-5 py-3.5 cursor-pointer select-none hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                        <div className="flex items-center space-x-1"><span>Mã HV</span><SortIndicator sortKey="maHocVien" activeKey={sortKey} sortOrder={sortOrder} /></div>
                      </th>
                      <th onClick={() => toggleSort('hoTen')} className="px-5 py-3.5 cursor-pointer select-none hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                        <div className="flex items-center space-x-1"><span>Họ Và Tên</span><SortIndicator sortKey="hoTen" activeKey={sortKey} sortOrder={sortOrder} /></div>
                      </th>
                      <th onClick={() => toggleSort('cc')} className="px-5 py-3.5 text-center cursor-pointer select-none hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                        <div className="flex items-center justify-center space-x-1"><span>Chuyên Cần (20%)</span><SortIndicator sortKey="cc" activeKey={sortKey} sortOrder={sortOrder} /></div>
                      </th>
                      <th onClick={() => toggleSort('gk')} className="px-5 py-3.5 text-center cursor-pointer select-none hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                        <div className="flex items-center justify-center space-x-1"><span>Giữa Kỳ (30%)</span><SortIndicator sortKey="gk" activeKey={sortKey} sortOrder={sortOrder} /></div>
                      </th>
                      <th onClick={() => toggleSort('ck')} className="px-5 py-3.5 text-center cursor-pointer select-none hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                        <div className="flex items-center justify-center space-x-1"><span>Cuối Kỳ (50%)</span><SortIndicator sortKey="ck" activeKey={sortKey} sortOrder={sortOrder} /></div>
                      </th>
                      <th onClick={() => toggleSort('final')} className="px-5 py-3.5 text-center cursor-pointer select-none hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                        <div className="flex items-center justify-center space-x-1"><span>Tổng Kết</span><SortIndicator sortKey="final" activeKey={sortKey} sortOrder={sortOrder} /></div>
                      </th>
                      <th onClick={() => toggleSort('xepLoai')} className="px-5 py-3.5 text-center cursor-pointer select-none hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                        <div className="flex items-center justify-center space-x-1"><span>Xếp Loại</span><SortIndicator sortKey="xepLoai" activeKey={sortKey} sortOrder={sortOrder} /></div>
                      </th>
                      <th className="px-5 py-3.5">Nhận Xét</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-[#1e2d45]">
                    {sortedEnrollments.length > 0 ? (
                      sortedEnrollments.map((dk: any) => {
                        const student = dk.hocVien;
                        const grade = gradesMap[student.id] || { cc: '', gk: '', ck: '', nhanXet: '' };
                        const final = calculateFinal(grade.cc, grade.gk, grade.ck);
                        const passed = final !== null ? isPass(grade.cc, Number(final)) : false;

                        return (
                          <tr key={student.id} className="hover:bg-teal-50/30 dark:hover:bg-teal-950/20 transition">
                            <td className="px-5 py-4 font-mono font-bold text-teal-700 dark:text-teal-400">{student.maHocVien}</td>
                            <td className="px-5 py-4 font-bold text-slate-900 dark:text-slate-100">{student.hoTen}</td>
                            <td className="px-5 py-4 text-center">
                              <input
                                type="number"
                                min={0}
                                max={100}
                                disabled={isClassRecruiting || isReadOnly}
                                value={grade.cc}
                                onChange={(e) => handleGradeChange(student.id, 'cc', e.target.value === '' ? '' : +e.target.value)}
                                className={`w-16 rounded-lg px-2 py-1 text-center font-bold transition ${
                                  isReadOnly
                                    ? 'bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 cursor-not-allowed'
                                    : 'bg-slate-50 dark:bg-[#162032] border border-slate-200 dark:border-[#22324e] text-slate-900 dark:text-slate-100 focus:outline-none focus:border-teal-500'
                                }`}
                                placeholder="—"
                              />
                            </td>
                            <td className="px-5 py-4 text-center">
                              <input
                                type="number"
                                min={0}
                                max={100}
                                disabled={isClassRecruiting || isReadOnly}
                                value={grade.gk}
                                onChange={(e) => handleGradeChange(student.id, 'gk', e.target.value === '' ? '' : +e.target.value)}
                                className={`w-16 rounded-lg px-2 py-1 text-center font-bold transition ${
                                  isReadOnly
                                    ? 'bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 cursor-not-allowed'
                                    : 'bg-slate-50 dark:bg-[#162032] border border-slate-200 dark:border-[#22324e] text-slate-900 dark:text-slate-100 focus:outline-none focus:border-teal-500'
                                }`}
                                placeholder="—"
                              />
                            </td>
                            <td className="px-5 py-4 text-center">
                              <input
                                type="number"
                                min={0}
                                max={100}
                                disabled={isClassRecruiting || isReadOnly}
                                value={grade.ck}
                                onChange={(e) => handleGradeChange(student.id, 'ck', e.target.value === '' ? '' : +e.target.value)}
                                className={`w-16 rounded-lg px-2 py-1 text-center font-bold transition ${
                                  isReadOnly
                                    ? 'bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 cursor-not-allowed'
                                    : 'bg-slate-50 dark:bg-[#162032] border border-slate-200 dark:border-[#22324e] text-slate-900 dark:text-slate-100 focus:outline-none focus:border-teal-500'
                                }`}
                                placeholder="—"
                              />
                            </td>
                            <td className="px-5 py-4 text-center">
                              <span className="text-sm font-black text-teal-700 dark:text-teal-400 font-mono">
                                {final ?? '—'}
                              </span>
                            </td>
                            <td className="px-5 py-4 text-center">
                              {final === null ? (
                                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                                  Chưa đủ điểm
                                </span>
                              ) : (
                                <span
                                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                                    passed
                                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                                      : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800'
                                  }`}
                                >
                                  {passed ? 'ĐẠT' : 'KHÔNG ĐẠT'}
                                </span>
                              )}
                            </td>
                            <td className="px-5 py-4">
                              <input
                                type="text"
                                disabled={isClassRecruiting || isReadOnly}
                                placeholder={isReadOnly ? 'Chưa có nhận xét' : 'Nhận xét tiến bộ...'}
                                value={grade.nhanXet}
                                onChange={(e) => handleGradeChange(student.id, 'nhanXet', e.target.value)}
                                className={`w-full rounded-lg px-2.5 py-1 text-xs transition ${
                                  isReadOnly
                                    ? 'bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 cursor-not-allowed'
                                    : 'bg-slate-50 dark:bg-[#162032] border border-slate-200 dark:border-[#22324e] text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-teal-500'
                                }`}
                              />
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={8} className="py-12 text-center text-slate-400 text-xs">
                          {classes.length === 0 ? (
                            <div className="flex flex-col items-center space-y-2">
                              <BookOpen className="w-8 h-8 text-slate-300" />
                              <span>Bạn chưa được phân công phụ trách lớp học nào.</span>
                            </div>
                          ) : (
                            'Lớp học này hiện chưa có học viên ghi danh.'
                          )}
                        </td>
                      </tr>
                    )}
              </tbody>
            </table>
          </div>
        </div>
        </>
      )}
      </div>
    </AppLayout>
  );
}
