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
        // Chỉ lấy các lớp được phân công cho giáo viên hiện tại
        const schedule = await classesService.getTeacherSchedule();
        const assignedClasses = (schedule || [])
          .map((item: any) => item.lopHoc)
          .filter(Boolean);

        setClasses(assignedClasses);
        if (assignedClasses.length > 0) {
          setSelectedClassId(assignedClasses[0].id);
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
          const g = existingGrades.find((item: any) => item.hocVienId === dk.hocVien.id);
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
        diemChuyenCan: +val.cc,
        diemGiuaKy: +val.gk,
        diemCuoiKy: +val.ck,
        nhanXet: val.nhanXet,
      }));

      await gradesService.submitGrades(selectedClassId, payload);
      setMessage('Lưu bảng điểm & tự động tính điểm tổng kết 20/30/50 thành công!');
      setTimeout(() => setMessage(null), 3500);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Có lỗi xảy ra.');
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
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-900 p-4 rounded-2xl border border-slate-800">
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <label className="text-xs font-semibold text-slate-400 whitespace-nowrap">Lớp Phụ Trách:</label>
            {classes.length > 0 ? (
              <select
                value={selectedClassId || ''}
                onChange={(e) => setSelectedClassId(+e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-semibold"
              >
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    [{c.maLopHoc}] {c.tenLopHoc} ({c.siSoHienTai || 0} HV)
                  </option>
                ))}
              </select>
            ) : (
              <span className="text-xs text-amber-400 italic">Chưa có lớp nào được phân công</span>
            )}
          </div>

          <button
            onClick={handleSaveGrades}
            disabled={saving || !selectedClassId || !classDetail?.dangKyHoc?.length}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Đang Lưu...' : 'Lưu & Tính Điểm Tổng Kết'}</span>
          </button>
        </div>

        {/* Business Rule Alert */}
        <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-800/40 text-xs text-indigo-300 flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
          <span>
            <strong>Quy chuẩn ĐẠT:</strong> Điểm Tổng Kết ≥ 50.00 điểm <strong>VÀ</strong> Chuyên Cần ≥ 80.00 điểm.
          </span>
        </div>

        {message && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>{message}</span>
          </div>
        )}

        {/* Grades Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 uppercase text-[11px] font-semibold tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-5 py-3.5">Mã HV</th>
                  <th className="px-5 py-3.5">Họ Và Tên</th>
                  <th className="px-5 py-3.5 text-center">Chuyên Cần (20%)</th>
                  <th className="px-5 py-3.5 text-center">Giữa Kỳ (30%)</th>
                  <th className="px-5 py-3.5 text-center">Cuối Kỳ (50%)</th>
                  <th className="px-5 py-3.5 text-center font-bold text-white">Tổng Kết</th>
                  <th className="px-5 py-3.5 text-center">Xếp Loại</th>
                  <th className="px-5 py-3.5">Nhận Xét</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {classDetail?.dangKyHoc?.length > 0 ? (
                  classDetail.dangKyHoc.map((dk: any) => {
                    const student = dk.hocVien;
                    const grade = gradesMap[student.id] || { cc: 0, gk: 0, ck: 0, nhanXet: '' };
                    const final = calculateFinal(grade.cc, grade.gk, grade.ck);
                    const passed = final !== null ? isPass(grade.cc, Number(final)) : false;

                    return (
                      <tr key={student.id} className="hover:bg-slate-800/40 transition">
                        <td className="px-5 py-4 font-mono font-bold text-indigo-400">{student.maHocVien}</td>
                        <td className="px-5 py-4 font-semibold text-white">{student.hoTen}</td>
                        <td className="px-5 py-4 text-center">
                          <input
                            type="number"
                            min={0}
                            max={100}
                            value={grade.cc}
                            onChange={(e) => handleGradeChange(student.id, 'cc', +e.target.value)}
                            className="w-16 bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-center font-bold text-white focus:outline-none focus:border-indigo-500"
                          />
                        </td>
                        <td className="px-5 py-4 text-center">
                          <input
                            type="number"
                            min={0}
                            max={100}
                            value={grade.gk}
                            onChange={(e) => handleGradeChange(student.id, 'gk', +e.target.value)}
                            className="w-16 bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-center font-bold text-white focus:outline-none focus:border-indigo-500"
                          />
                        </td>
                        <td className="px-5 py-4 text-center">
                          <input
                            type="number"
                            min={0}
                            max={100}
                            value={grade.ck}
                            onChange={(e) => handleGradeChange(student.id, 'ck', +e.target.value)}
                            className="w-16 bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-center font-bold text-white focus:outline-none focus:border-indigo-500"
                          />
                        </td>
                        <td className="px-5 py-4 text-center">
                          <span className="text-sm font-black text-indigo-300 font-mono">
                            {final ?? '—'}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-center">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                              passed
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
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
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                          />
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-500 text-xs">
                      {classes.length === 0 ? (
                        <div className="flex flex-col items-center space-y-2">
                          <BookOpen className="w-8 h-8 text-slate-600" />
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
