'use client';

import React, { useEffect, useState } from 'react';
import { AppLayout } from '../../../components/AppLayout';
import { classesService, attendancesService } from '../../../services/api';
import { TrangThaiDiemDanh } from '../../../types';
import { CheckCircle, Save, Calendar, BookOpen } from 'lucide-react';

export default function TeacherAttendancePage() {
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
  const [classDetail, setClassDetail] = useState<any>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<number | null>(null);
  const [attendanceRecords, setAttendanceRecords] = useState<Record<number, TrangThaiDiemDanh>>({});
  const [notes, setNotes] = useState<Record<number, string>>({});
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
      setSessions([]);
      setSelectedSessionId(null);
      return;
    }

    const fetchClassDetailAndSessions = async () => {
      try {
        const [detail, classSessions] = await Promise.all([
          classesService.getById(selectedClassId),
          attendancesService.getClassSessions(selectedClassId),
        ]);
        setClassDetail(detail);
        setSessions(classSessions || []);

        if (classSessions && classSessions.length > 0) {
          setSelectedSessionId(classSessions[0].id);
        } else {
          setSelectedSessionId(null);
        }

        // Pre-fill default attendance state as CO_MAT for enrolled students
        const initialStatus: Record<number, TrangThaiDiemDanh> = {};
        const initialNotes: Record<number, string> = {};
        detail.dangKyHoc?.forEach((dk: any) => {
          initialStatus[dk.hocVien.id] = 'CO_MAT';
          initialNotes[dk.hocVien.id] = '';
        });
        setAttendanceRecords(initialStatus);
        setNotes(initialNotes);
      } catch (err) {
        console.error(err);
      }
    };
    fetchClassDetailAndSessions();
  }, [selectedClassId]);

  // When selectedSessionId changes, if the session has existing attendance records, load them
  useEffect(() => {
    if (!selectedSessionId) return;

    const fetchSessionDetail = async () => {
      try {
        const sessionData = await attendancesService.getSessionAttendance(selectedSessionId);
        if (sessionData?.diemDanh && sessionData.diemDanh.length > 0) {
          const statusMap: Record<number, TrangThaiDiemDanh> = {};
          const noteMap: Record<number, string> = {};
          sessionData.diemDanh.forEach((d: any) => {
            statusMap[d.hocVien.id] = d.trangThai;
            noteMap[d.hocVien.id] = d.ghiChu || '';
          });
          setAttendanceRecords((prev) => ({ ...prev, ...statusMap }));
          setNotes((prev) => ({ ...prev, ...noteMap }));
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchSessionDetail();
  }, [selectedSessionId]);

  const handleStatusChange = (studentId: number, status: TrangThaiDiemDanh) => {
    setAttendanceRecords((prev) => ({ ...prev, [studentId]: status }));
  };

  const handleSaveAttendance = async () => {
    if (!selectedSessionId) {
      alert('Vui lòng chọn một buổi học để điểm danh.');
      return;
    }

    setSaving(true);
    try {
      const payload = Object.entries(attendanceRecords).map(([studentId, status]) => ({
        hocVienId: +studentId,
        trangThai: status,
        ghiChu: notes[+studentId] || undefined,
      }));

      await attendancesService.submitAttendance(selectedSessionId, payload);
      setMessage('Ghi nhận và lưu điểm danh thành công!');
      setTimeout(() => setMessage(null), 3500);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Có lỗi xảy ra khi lưu điểm danh.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppLayout
      allowedRoles={['GIAO_VIEN', 'QUAN_LY']}
      title="Điểm Danh Chuyên Cần Buổi Học"
      subtitle="Chỉ hiển thị các lớp học bạn được phân công. Ghi nhận 4 trạng thái: Có Mặt, Vắng, Đi Muộn, Có Phép"
    >
      <div className="space-y-6">
        {/* Class selector & Session selector */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-900 p-4 rounded-2xl border border-slate-800">
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="flex items-center space-x-2">
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
                <span className="text-xs text-amber-400 italic">Chưa được phân công lớp nào</span>
              )}
            </div>

            {sessions.length > 0 && (
              <div className="flex items-center space-x-2">
                <label className="text-xs font-semibold text-slate-400 whitespace-nowrap">Buổi Học:</label>
                <select
                  value={selectedSessionId || ''}
                  onChange={(e) => setSelectedSessionId(+e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-semibold"
                >
                  {sessions.map((s) => (
                    <option key={s.id} value={s.id}>
                      Buổi {s.soThuTu} — {s.chuDe ? s.chuDe.substring(0, 30) + '...' : new Date(s.ngayHoc).toLocaleDateString('vi-VN')}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <button
            onClick={handleSaveAttendance}
            disabled={saving || !selectedSessionId || !classDetail?.dangKyHoc?.length}
            className="w-full md:w-auto flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/30 transition disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Đang Lưu...' : 'Lưu Bảng Điểm Danh'}</span>
          </button>
        </div>

        {message && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>{message}</span>
          </div>
        )}

        {/* Student Attendance Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950/40">
            <h3 className="font-bold text-white text-sm">
              Danh Sách Học Viên Lớp ({classDetail?.dangKyHoc?.length || 0} Học Viên Ghi Danh)
            </h3>
            {selectedSessionId && sessions.length > 0 && (
              <span className="text-xs text-indigo-400 font-medium flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>
                  {sessions.find((s) => s.id === selectedSessionId)?.chuDe || 'Điểm danh buổi học'}
                </span>
              </span>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 uppercase text-[11px] font-semibold tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-5 py-3.5">Mã HV</th>
                  <th className="px-5 py-3.5">Họ Và Tên</th>
                  <th className="px-5 py-3.5">Trình Độ</th>
                  <th className="px-5 py-3.5 text-center">Trạng Thái Điểm Danh (4 Trạng Thái)</th>
                  <th className="px-5 py-3.5">Ghi Chú</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {classDetail?.dangKyHoc?.length > 0 ? (
                  classDetail.dangKyHoc.map((dk: any) => {
                    const student = dk.hocVien;
                    const currentStatus = attendanceRecords[student.id] || 'CO_MAT';
                    return (
                      <tr key={student.id} className="hover:bg-slate-800/40 transition">
                        <td className="px-5 py-4 font-mono font-bold text-indigo-400">{student.maHocVien}</td>
                        <td className="px-5 py-4 font-semibold text-white">{student.hoTen}</td>
                        <td className="px-5 py-4">
                          <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 font-mono text-[11px]">
                            {student.trinhDoCEFR}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex justify-center items-center space-x-1 sm:space-x-2">
                            <button
                              type="button"
                              onClick={() => handleStatusChange(student.id, 'CO_MAT')}
                              className={`px-3 py-1.5 rounded-lg font-semibold text-[11px] transition ${
                                currentStatus === 'CO_MAT'
                                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                              }`}
                            >
                              ✅ Có Mặt
                            </button>
                            <button
                              type="button"
                              onClick={() => handleStatusChange(student.id, 'DI_MUON')}
                              className={`px-3 py-1.5 rounded-lg font-semibold text-[11px] transition ${
                                currentStatus === 'DI_MUON'
                                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                              }`}
                            >
                              ⏱️ Đi Muộn
                            </button>
                            <button
                              type="button"
                              onClick={() => handleStatusChange(student.id, 'CO_PHEP')}
                              className={`px-3 py-1.5 rounded-lg font-semibold text-[11px] transition ${
                                currentStatus === 'CO_PHEP'
                                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                              }`}
                            >
                              📝 Có Phép
                            </button>
                            <button
                              type="button"
                              onClick={() => handleStatusChange(student.id, 'VANG')}
                              className={`px-3 py-1.5 rounded-lg font-semibold text-[11px] transition ${
                                currentStatus === 'VANG'
                                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                              }`}
                            >
                              ❌ Vắng
                            </button>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <input
                            type="text"
                            placeholder="Ghi chú thêm..."
                            value={notes[student.id] || ''}
                            onChange={(e) => setNotes({ ...notes, [student.id]: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                          />
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-500 text-xs">
                      {classes.length === 0 ? (
                        <div className="flex flex-col items-center space-y-2">
                          <BookOpen className="w-8 h-8 text-slate-600" />
                          <span>Bạn chưa được phân công phụ trách lớp học nào.</span>
                        </div>
                      ) : (
                        'Lớp học này hiện chưa có học viên nào ghi danh.'
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
