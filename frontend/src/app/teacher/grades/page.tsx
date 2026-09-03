'use client';

import React, { useEffect, useState } from 'react';
import { AppLayout } from '../../../components/AppLayout';
import { classesService, gradesService } from '../../../services/api';
import { Save, CheckCircle, Sparkles, BookOpen } from 'lucide-react';

export default function TeacherGradesPage() {
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
  const [classDetail, setClassDetail] = useState<any>(null);
  const [gradesMap, setGradesMap] = useState<
    Record<number, { cc: number; gk: number; ck: number; nhanXet: string }>
  >({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssignedClasses = async () => {
      try {
        let assignedClasses: any[] = [];
        try {
          // Lấy các lớp được phân công cho giáo viên hiện tại
          const schedule = await classesService.getTeacherSchedule();
          assignedClasses = (schedule || [])
            .map((item: any) => item.lopHoc)
            .filter(Boolean);
        } catch {
          // Nếu là Quản trị viên (Admin), lấy toàn bộ danh sách lớp
          const all = await classesService.getAll();
          assignedClasses = all || [];
        }

        if (assignedClasses.length === 0) {
          const all = await classesService.getAll();
          assignedClasses = all || [];
        }

        const validClasses = (assignedClasses || []).filter((c: any) => c.trangThai !== 'DA_HUY');
        setClasses(validClasses);
        if (validClasses.length > 0) {
          setSelectedClassId(validClasses[0].id);
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

        const initial: Record<number, { cc: number; gk: number; ck: number; nhanXet: string }> = {};
        detail.dangKyHoc?.forEach((dk: any) => {
          const g = (existingGrades || []).find((item: any) => Number(item.hocVienId) === Number(dk.hocVien.id));
          initial[dk.hocVien.id] = {
            cc: g?.diemChuyenCan !== null && g?.diemChuyenCan !== undefined ? Number(g.diemChuyenCan) : 90,
            gk: g?.diemGiuaKy !== null && g?.diemGiuaKy !== undefined ? Number(g.diemGiuaKy) : 75,
            ck: g?.diemCuoiKy !== null && g?.diemCuoiKy !== undefined ? Number(g.diemCuoiKy) : 80,
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

  const calculateFinal = (cc: number, gk: number, ck: number) => {
    if (isNaN(cc) || isNaN(gk) || isNaN(ck)) return null;
    return (cc * 0.2 + gk * 0.3 + ck * 0.5).toFixed(2);
  };

  const isPass = (cc: number, final: number) => {
    return final >= 50.0 && cc >= 80.0;
  };

  const handleSaveGrades = async () => {
    if (!selectedClassId) return;
    setSaving(true);
    try {
      const payload = Object.entries(gradesMap).map(([studentId, val]) => ({
        hocVienId: +studentId,
        diemChuyenCan: val.cc !== undefined && val.cc !== null && !isNaN(+val.cc) ? +val.cc : 0,
        diemGiuaKy: val.gk !== undefined && val.gk !== null && !isNaN(+val.gk) ? +val.gk : 0,
        diemCuoiKy: val.ck !== undefined && val.ck !== null && !isNaN(+val.ck) ? +val.ck : 0,
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

  return (
    <AppLayout
      allowedRoles={['GIAO_VIEN', 'QUAN_LY']}
      title="Bảng Điểm & Đánh Giá Kết Quả Học Tập"
      subtitle="Chỉ hiển thị các lớp học bạn được phân công phụ trách. Công thức: 20% Chuyên Cần + 30% Giữa Kỳ + 50% Cuối Kỳ"
    >
      <div className="space-y-6">
        {/* Top filter & Formula reminder */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm">
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <label className="text-xs font-bold text-slate-700 whitespace-nowrap">Lớp Phụ Trách:</label>
            {classes.length > 0 ? (
              <select
                value={selectedClassId || ''}
                onChange={(e) => setSelectedClassId(+e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-teal-500 font-bold cursor-pointer"
              >
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    [{c.maLopHoc}] {c.tenLopHoc} ({c.siSoHienTai || 0} HV)
                  </option>
                ))}
              </select>
            ) : (
              <span className="text-xs text-amber-600 font-medium italic">Chưa có lớp nào được phân công</span>
            )}
          </div>

          <button
            onClick={handleSaveGrades}
            disabled={saving || !selectedClassId || !classDetail?.dangKyHoc?.length}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-md shadow-teal-600/20 transition disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Đang Lưu...' : 'Lưu & Tính Điểm Tổng Kết'}</span>
          </button>
        </div>

        {/* Business Rule Alert */}
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

        {/* Grades Table */}
        <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-600 uppercase text-[11px] font-bold tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3.5">Mã HV</th>
                  <th className="px-5 py-3.5">Họ Và Tên</th>
                  <th className="px-5 py-3.5 text-center">Chuyên Cần (20%)</th>
                  <th className="px-5 py-3.5 text-center">Giữa Kỳ (30%)</th>
                  <th className="px-5 py-3.5 text-center">Cuối Kỳ (50%)</th>
                  <th className="px-5 py-3.5 text-center font-bold text-slate-900">Tổng Kết</th>
                  <th className="px-5 py-3.5 text-center">Xếp Loại</th>
                  <th className="px-5 py-3.5">Nhận Xét</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {classDetail?.dangKyHoc?.length > 0 ? (
                  classDetail.dangKyHoc.map((dk: any) => {
                    const student = dk.hocVien;
                    const grade = gradesMap[student.id] || { cc: 0, gk: 0, ck: 0, nhanXet: '' };
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
                            onChange={(e) => handleGradeChange(student.id, 'cc', +e.target.value)}
                            className="w-16 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-center font-bold text-slate-900 focus:outline-none focus:border-teal-500"
                          />
                        </td>
                        <td className="px-5 py-4 text-center">
                          <input
                            type="number"
                            min={0}
                            max={100}
                            value={grade.gk}
                            onChange={(e) => handleGradeChange(student.id, 'gk', +e.target.value)}
                            className="w-16 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-center font-bold text-slate-900 focus:outline-none focus:border-teal-500"
                          />
                        </td>
                        <td className="px-5 py-4 text-center">
                          <input
                            type="number"
                            min={0}
                            max={100}
                            value={grade.ck}
                            onChange={(e) => handleGradeChange(student.id, 'ck', +e.target.value)}
                            className="w-16 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-center font-bold text-slate-900 focus:outline-none focus:border-teal-500"
                          />
                        </td>
                        <td className="px-5 py-4 text-center">
                          <span className="text-sm font-black text-teal-700 font-mono">
                            {final ?? '—'}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-center">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                              passed
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-rose-50 text-rose-700 border-rose-200'
                            }`}
                          >
                            {passed ? 'ĐẠT' : 'KHÔNG ĐẠT'}
                          </span>
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
      </div>
    </AppLayout>
  );
}
