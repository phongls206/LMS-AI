'use client';

import React, { useEffect, useState } from 'react';
import { AppLayout } from '../../../components/AppLayout';
import { classesService, gradesService, authStorage } from '../../../services/api';
import { Save, CheckCircle, Sparkles, BookOpen, AlertCircle, FileSpreadsheet, Download, Award } from 'lucide-react';
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

  // 1. Lấy danh sách lớp phụ trách (Chỉ Quản lý mới xem tất cả lớp, Giáo viên chỉ xem lớp mình được phân công)
  useEffect(() => {
    const fetchAssignedClasses = async () => {
      try {
        let isManager = false;
        try {
          const user = authStorage.getUser();
          if (user && user.vaiTro === 'QUAN_LY') isManager = true;
        } catch {}

        let assignedClasses: any[] = [];
        if (isManager) {
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
        if (validClasses.length > 0) {
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

  const isClassRecruiting = classDetail?.trangThai === 'DANG_MO_DANG_KY' || classDetail?.trangThai === 'SAP_MO';

  const handleSaveGrades = async () => {
    if (!selectedClassId) return;
    if (isClassRecruiting) {
      alert('Lớp học đang mở tuyển sinh, chưa vào học chính thức. Không thể nhập bảng điểm!');
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
      alert(err.response?.data?.message || 'Có lỗi xảy ra khi lưu bảng điểm.');
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
      title="Bảng Điểm & Đánh Giá Kết Quả Học Tập"
      subtitle="Chỉ hiển thị các lớp học bạn được phân công phụ trách. Công thức: 20% Chuyên Cần + 30% Giữa Kỳ + 50% Cuối Kỳ"
    >
      <div className="space-y-6">
        {loading ? (
          <div className="py-20 flex justify-center items-center">
            <div className="w-8 h-8 border-4 border-teal-500/20 border-t-teal-600 rounded-full animate-spin"></div>
          </div>
        ) : classes.length === 0 ? (
          <div className="p-8 bg-amber-50 border border-amber-200 rounded-2xl text-center space-y-3">
            <AlertCircle className="w-10 h-10 text-amber-600 mx-auto" />
            <h3 className="text-base font-bold text-amber-900">Chưa được phân công phụ trách lớp học nào</h3>
            <p className="text-xs text-amber-700 max-w-md mx-auto">
              Bạn chỉ có thể xem và nhập bảng điểm cho các lớp học được Ban Quản Lý phân công giảng dạy. Vui lòng liên hệ quản trị viên nếu có thắc mắc.
            </p>
          </div>
        ) : (
          <>
            <div className="bg-white dark:bg-[#111928] border border-slate-200/90 dark:border-[#1e2d45] p-4 sm:p-5 rounded-2xl shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex items-center space-x-3 w-full sm:w-auto">
                  <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 shrink-0">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Lớp Phụ Trách</label>
                    <select
                      value={selectedClassId || ''}
                      onChange={(e) => setSelectedClassId(+e.target.value)}
                      className="mt-0.5 bg-slate-50 dark:bg-[#162032] border border-slate-200 dark:border-[#22324e] rounded-lg px-3 py-1.5 text-xs font-bold text-teal-900 dark:text-teal-400 focus:outline-none focus:border-teal-500"
                    >
                      {classes.map((c) => (
                        <option key={c.id} value={c.id}>
                          [{c.maLopHoc}] {c.tenLopHoc}
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
                    className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold transition flex items-center space-x-1.5 shadow-xs cursor-pointer disabled:opacity-50"
                    title="Xuất bảng điểm chi tiết ra file Excel .xlsx"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                    <span>Xuất Bảng Điểm Excel</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveGrades}
                    disabled={saving || !selectedClassId || isClassRecruiting}
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-sm hover:shadow transition flex items-center space-x-1.5 disabled:opacity-50 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>{saving ? 'Đang lưu...' : 'Lưu Bảng Điểm'}</span>
                  </button>
                </div>
              </div>
            </div>

            {isClassRecruiting && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-bold text-amber-950">
                    Lớp học đang trong giai đoạn Mở Tuyển Sinh (Chưa Khai Giảng Chính Thức)
                  </div>
                  <p className="text-amber-800 leading-relaxed">
                    Lớp <strong className="font-mono">[{classDetail?.maLopHoc}] {classDetail?.tenLopHoc}</strong> hiện đang tiếp nhận học viên. Bảng điểm sẽ được kích hoạt khi lớp hoàn tất tuyển sinh.
                  </p>
                </div>
              </div>
            )}

            <div className="p-3.5 rounded-xl bg-teal-50 border border-teal-200 text-xs text-teal-800 flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-teal-600 shrink-0" />
              <span>
                <strong>Quy chuẩn ĐẠT:</strong> Điểm Tổng Kết ≥ 50.00 điểm <strong>VÀ</strong> Chuyên Cần ≥ 80.00 điểm.
              </span>
            </div>

            {message && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2 shadow-sm">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>{message}</span>
              </div>
            )}

            <div className="bg-white dark:bg-[#111928] border border-slate-200/90 dark:border-[#1e2d45] rounded-2xl overflow-hidden shadow-sm">
              <div className="w-full overflow-x-auto scrollbar-thin">
                <table className="min-w-[780px] w-full text-left text-xs text-slate-700 dark:text-slate-200">
                  <thead className="bg-slate-50 text-slate-600 uppercase text-[11px] font-bold tracking-wider border-b border-slate-200">
                    <tr>
                      <th onClick={() => toggleSort('maHocVien')} className="px-5 py-3.5 cursor-pointer select-none hover:bg-slate-100 transition">
                        <div className="flex items-center space-x-1"><span>Mã HV</span><SortIndicator sortKey="maHocVien" activeKey={sortKey} sortOrder={sortOrder} /></div>
                      </th>
                      <th onClick={() => toggleSort('hoTen')} className="px-5 py-3.5 cursor-pointer select-none hover:bg-slate-100 transition">
                        <div className="flex items-center space-x-1"><span>Họ Và Tên</span><SortIndicator sortKey="hoTen" activeKey={sortKey} sortOrder={sortOrder} /></div>
                      </th>
                      <th onClick={() => toggleSort('cc')} className="px-5 py-3.5 text-center cursor-pointer select-none hover:bg-slate-100 transition">
                        <div className="flex items-center justify-center space-x-1"><span>Chuyên Cần (20%)</span><SortIndicator sortKey="cc" activeKey={sortKey} sortOrder={sortOrder} /></div>
                      </th>
                      <th onClick={() => toggleSort('gk')} className="px-5 py-3.5 text-center cursor-pointer select-none hover:bg-slate-100 transition">
                        <div className="flex items-center justify-center space-x-1"><span>Giữa Kỳ (30%)</span><SortIndicator sortKey="gk" activeKey={sortKey} sortOrder={sortOrder} /></div>
                      </th>
                      <th onClick={() => toggleSort('ck')} className="px-5 py-3.5 text-center cursor-pointer select-none hover:bg-slate-100 transition">
                        <div className="flex items-center justify-center space-x-1"><span>Cuối Kỳ (50%)</span><SortIndicator sortKey="ck" activeKey={sortKey} sortOrder={sortOrder} /></div>
                      </th>
                      <th onClick={() => toggleSort('final')} className="px-5 py-3.5 text-center cursor-pointer select-none hover:bg-slate-100 transition">
                        <div className="flex items-center justify-center space-x-1"><span>Tổng Kết</span><SortIndicator sortKey="final" activeKey={sortKey} sortOrder={sortOrder} /></div>
                      </th>
                      <th onClick={() => toggleSort('xepLoai')} className="px-5 py-3.5 text-center cursor-pointer select-none hover:bg-slate-100 transition">
                        <div className="flex items-center justify-center space-x-1"><span>Xếp Loại</span><SortIndicator sortKey="xepLoai" activeKey={sortKey} sortOrder={sortOrder} /></div>
                      </th>
                      <th className="px-5 py-3.5">Nhận Xét</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {sortedEnrollments.length > 0 ? (
                      sortedEnrollments.map((dk: any) => {
                        const student = dk.hocVien;
                        const grade = gradesMap[student.id] || { cc: '', gk: '', ck: '', nhanXet: '' };
                        const final = calculateFinal(grade.cc, grade.gk, grade.ck);
                        const passed = final !== null ? isPass(grade.cc, Number(final)) : false;

                        return (
                          <tr key={student.id} className="hover:bg-teal-50/30 transition">
                            <td className="px-5 py-4 font-mono font-bold text-teal-700">{student.maHocVien}</td>
                            <td className="px-5 py-4 font-bold text-slate-900">{student.hoTen}</td>
                            <td className="px-5 py-4 text-center">
                              <input
                                type="number"
                                min={0}
                                max={100}
                                value={grade.cc}
                                onChange={(e) => handleGradeChange(student.id, 'cc', e.target.value === '' ? '' : +e.target.value)}
                                className="w-16 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-center font-bold text-slate-900 focus:outline-none focus:border-teal-500"
                                placeholder="—"
                              />
                            </td>
                            <td className="px-5 py-4 text-center">
                              <input
                                type="number"
                                min={0}
                                max={100}
                                value={grade.gk}
                                onChange={(e) => handleGradeChange(student.id, 'gk', e.target.value === '' ? '' : +e.target.value)}
                                className="w-16 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-center font-bold text-slate-900 focus:outline-none focus:border-teal-500"
                                placeholder="—"
                              />
                            </td>
                            <td className="px-5 py-4 text-center">
                              <input
                                type="number"
                                min={0}
                                max={100}
                                value={grade.ck}
                                onChange={(e) => handleGradeChange(student.id, 'ck', e.target.value === '' ? '' : +e.target.value)}
                                className="w-16 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-center font-bold text-slate-900 focus:outline-none focus:border-teal-500"
                                placeholder="—"
                              />
                            </td>
                            <td className="px-5 py-4 text-center">
                              <span className="text-sm font-black text-teal-700 font-mono">
                                {final ?? '—'}
                              </span>
                            </td>
                            <td className="px-5 py-4 text-center">
                              {final === null ? (
                                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-500 border border-slate-200">
                                  Chưa đủ điểm
                                </span>
                              ) : (
                                <span
                                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                                    passed
                                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                      : 'bg-rose-50 text-rose-700 border-rose-200'
                                  }`}
                                >
                                  {passed ? 'ĐẠT' : 'KHÔNG ĐẠT'}
                                </span>
                              )}
                            </td>
                            <td className="px-5 py-4">
                              <input
                                type="text"
                                placeholder="Nhận xét tiến bộ..."
                                value={grade.nhanXet}
                                onChange={(e) => handleGradeChange(student.id, 'nhanXet', e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-500"
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
