'use client';

import React, { useEffect, useState } from 'react';
import { AppLayout } from '../../../components/AppLayout';
import { classesService, attendancesService } from '../../../services/api';
import { TrangThaiDiemDanh } from '../../../types';
import {
  CheckCircle,
  Save,
  Calendar,
  BookOpen,
  Users,
  Clock,
  FileText,
  XCircle,
  BarChart3,
  ListCheck,
  Search,
  Eye,
  CheckCheck,
  Percent,
  X,
  AlertTriangle,
} from 'lucide-react';

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
  const [searchStudent, setSearchStudent] = useState('');

  // Tab chuyển đổi chế độ xem
  const [activeTab, setActiveTab] = useState<'take_attendance' | 'matrix_view'>('take_attendance');

  // Dữ liệu ma trận điểm danh toàn khóa
  const [matrixData, setMatrixData] = useState<any>(null);
  const [loadingMatrix, setLoadingMatrix] = useState(false);

  // Modal xem chi tiết điểm danh 1 học viên
  const [viewStudentModal, setViewStudentModal] = useState<any>(null);

  // 1. Lấy danh sách lớp phụ trách (hoặc tất cả lớp nếu là Admin)
  useEffect(() => {
    const fetchAssignedClasses = async () => {
      try {
        let assignedClasses: any[] = [];
        try {
          const schedule = await classesService.getTeacherSchedule();
          assignedClasses = (schedule || [])
            .map((item: any) => item.lopHoc)
            .filter(Boolean);
        } catch {
          const all = await classesService.getAll();
          assignedClasses = all || [];
        }

        if (assignedClasses.length === 0) {
          const all = await classesService.getAll();
          assignedClasses = all || [];
        }

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

  // 2. Lấy thông tin lớp và danh sách buổi học
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

        // Khởi tạo mặc định CO_MAT
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

    // Đồng thời tải ma trận điểm danh của lớp
    fetchMatrix(selectedClassId);
  }, [selectedClassId]);

  // Tải ma trận điểm danh toàn khóa
  const fetchMatrix = async (classId: number) => {
    setLoadingMatrix(true);
    try {
      const data = await attendancesService.getClassAttendanceMatrix(classId);
      setMatrixData(data);
    } catch (err) {
      console.error('Lỗi tải ma trận điểm danh:', err);
    } finally {
      setLoadingMatrix(false);
    }
  };

  // 3. Khi đổi buổi học, nạp bản ghi điểm danh đã có (nếu có)
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

  const handleMarkAllPresent = () => {
    if (!classDetail?.dangKyHoc) return;
    const updated: Record<number, TrangThaiDiemDanh> = {};
    classDetail.dangKyHoc.forEach((dk: any) => {
      updated[dk.hocVien.id] = 'CO_MAT';
    });
    setAttendanceRecords(updated);
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

      // Cập nhật lại ma trận điểm danh
      if (selectedClassId) {
        fetchMatrix(selectedClassId);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Có lỗi xảy ra khi lưu điểm danh.');
    } finally {
      setSaving(false);
    }
  };

  // Thống kê nhanh buổi học đang chọn
  const totalStudents = classDetail?.dangKyHoc?.length || 0;
  const countPresent = Object.values(attendanceRecords).filter((s) => s === 'CO_MAT').length;
  const countLate = Object.values(attendanceRecords).filter((s) => s === 'DI_MUON').length;
  const countExcused = Object.values(attendanceRecords).filter((s) => s === 'CO_PHEP').length;
  const countAbsent = Object.values(attendanceRecords).filter((s) => s === 'VANG').length;
  const presentRate = totalStudents > 0 ? Math.round(((countPresent + countLate * 0.5) / totalStudents) * 100) : 100;

  // Lọc học viên theo tìm kiếm
  const filteredEnrollments = (classDetail?.dangKyHoc || []).filter((dk: any) => {
    const q = searchStudent.toLowerCase();
    return (
      dk.hocVien.hoTen.toLowerCase().includes(q) ||
      dk.hocVien.maHocVien.toLowerCase().includes(q)
    );
  });

  // Tính toán tỷ lệ chuyên cần cho từng học viên trong Ma trận
  const calculateStudentAttendanceRate = (studentId: number) => {
    if (!matrixData?.buoiHoc) return { totalSessions: 0, attended: 0, late: 0, excused: 0, absent: 0, rate: 100 };
    
    let attended = 0;
    let late = 0;
    let excused = 0;
    let absent = 0;
    let pastSessions = 0;

    matrixData.buoiHoc.forEach((b: any) => {
      const rec = b.diemDanh?.find((d: any) => Number(d.hocVienId) === Number(studentId));
      if (rec) {
        pastSessions++;
        if (rec.trangThai === 'CO_MAT') attended++;
        else if (rec.trangThai === 'DI_MUON') late++;
        else if (rec.trangThai === 'CO_PHEP') excused++;
        else if (rec.trangThai === 'VANG') absent++;
      }
    });

    const rate = pastSessions > 0 ? Math.round(((attended + late * 0.5 + excused * 0.5) / pastSessions) * 100) : 100;
    return { totalSessions: pastSessions, attended, late, excused, absent, rate };
  };

  return (
    <AppLayout
      allowedRoles={['GIAO_VIEN', 'QUAN_LY']}
      title="Điểm Danh Chuyên Cần & Theo Dõi Tiến Độ Lớp Học"
      subtitle="Ghi nhận 4 trạng thái điểm danh: Có Mặt, Đi Muộn, Có Phép, Vắng. Xem ma trận trực quan toàn khóa học."
    >
      <div className="space-y-6">
        {/* Top bar: Chọn lớp, chọn buổi & các thao tác */}
        <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4 bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center space-x-2">
              <label className="text-xs font-semibold text-slate-400 whitespace-nowrap">Lớp Học:</label>
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
                <span className="text-xs text-amber-400 italic">Chưa có lớp nào</span>
              )}
            </div>

            {activeTab === 'take_attendance' && sessions.length > 0 && (
              <div className="flex items-center space-x-2">
                <label className="text-xs font-semibold text-slate-400 whitespace-nowrap">Buổi Điểm Danh:</label>
                <select
                  value={selectedSessionId || ''}
                  onChange={(e) => setSelectedSessionId(+e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-semibold max-w-[260px] truncate"
                >
                  {sessions.map((s) => (
                    <option key={s.id} value={s.id}>
                      Buổi {s.soThuTu} — {s.chuDe ? s.chuDe.substring(0, 25) + '...' : new Date(s.ngayHoc).toLocaleDateString('vi-VN')} ({s.trangThai === 'DA_KET_THUC' ? 'Đã điểm danh' : 'Chưa điểm danh'})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2.5">
            {activeTab === 'take_attendance' && (
              <>
                <button
                  type="button"
                  onClick={handleMarkAllPresent}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition flex items-center space-x-1.5 border border-slate-700/60"
                  title="Điểm danh tất cả học viên Có Mặt"
                >
                  <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Tất Cả Có Mặt</span>
                </button>

                <button
                  onClick={handleSaveAttendance}
                  disabled={saving || !selectedSessionId || !classDetail?.dangKyHoc?.length}
                  className="flex items-center space-x-2 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Đang Lưu...' : 'Lưu Điểm Danh'}</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Thông báo thành công */}
        {message && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center space-x-2 animate-fadeIn">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>{message}</span>
          </div>
        )}

        {/* Thẻ thống kê KPI trực quan */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 flex items-center space-x-3 shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] text-slate-400 font-medium">Sĩ Số</p>
              <p className="text-base font-bold text-white font-mono">{totalStudents} HV</p>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 flex items-center space-x-3 shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <CheckCircle className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] text-slate-400 font-medium">Có Mặt</p>
              <p className="text-base font-bold text-emerald-400 font-mono">{countPresent}</p>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 flex items-center space-x-3 shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] text-slate-400 font-medium">Đi Muộn</p>
              <p className="text-base font-bold text-amber-400 font-mono">{countLate}</p>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 flex items-center space-x-3 shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] text-slate-400 font-medium">Có Phép</p>
              <p className="text-base font-bold text-blue-400 font-mono">{countExcused}</p>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 flex items-center space-x-3 shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
              <XCircle className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] text-slate-400 font-medium">Vắng Mặt</p>
              <p className="text-base font-bold text-rose-400 font-mono">{countAbsent}</p>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 flex items-center space-x-3 shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
              <Percent className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] text-slate-400 font-medium">Chuyên Cần</p>
              <p className="text-base font-bold text-purple-300 font-mono">{presentRate}%</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation: Điểm danh buổi học vs Ma trận toàn khóa */}
        <div className="flex border-b border-slate-800 space-x-4">
          <button
            onClick={() => setActiveTab('take_attendance')}
            className={`pb-3 text-xs font-bold flex items-center space-x-2 transition border-b-2 ${
              activeTab === 'take_attendance'
                ? 'text-indigo-400 border-indigo-500'
                : 'text-slate-400 border-transparent hover:text-white'
            }`}
          >
            <ListCheck className="w-4 h-4" />
            <span>1. Bảng Điểm Danh Buổi Học</span>
          </button>

          <button
            onClick={() => setActiveTab('matrix_view')}
            className={`pb-3 text-xs font-bold flex items-center space-x-2 transition border-b-2 ${
              activeTab === 'matrix_view'
                ? 'text-indigo-400 border-indigo-500'
                : 'text-slate-400 border-transparent hover:text-white'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>2. Ma Trận & Thống Kê Toàn Khóa</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-indigo-500/20 text-indigo-300 font-mono">
              Trực quan
            </span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: NHẬP ĐIỂM DANH BUỔI HỌC */}
        {/* ========================================================================= */}
        {activeTab === 'take_attendance' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm space-y-0">
            <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-3 bg-slate-950/40">
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-white text-xs uppercase tracking-wider">
                  Danh Sách Điểm Danh ({filteredEnrollments.length} Học Viên)
                </h3>
              </div>

              <div className="flex items-center space-x-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchStudent}
                    onChange={(e) => setSearchStudent(e.target.value)}
                    placeholder="Tìm tên hoặc mã học viên..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 pl-8 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 text-slate-400 uppercase text-[11px] font-semibold tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="px-5 py-3.5">Mã HV</th>
                    <th className="px-5 py-3.5">Họ Và Tên</th>
                    <th className="px-5 py-3.5">Trình Độ</th>
                    <th className="px-5 py-3.5 text-center">Trạng Thái Điểm Danh (4 Trạng Thái)</th>
                    <th className="px-5 py-3.5">Ghi Chú Buổi Học</th>
                    <th className="px-4 py-3.5 text-right">Chi Tiết</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {filteredEnrollments.length > 0 ? (
                    filteredEnrollments.map((dk: any) => {
                      const student = dk.hocVien;
                      const currentStatus = attendanceRecords[student.id] || 'CO_MAT';
                      return (
                        <tr key={student.id} className="hover:bg-slate-800/40 transition">
                          <td className="px-5 py-3.5 font-mono font-bold text-indigo-400">{student.maHocVien}</td>
                          <td className="px-5 py-3.5 font-semibold text-white">
                            <button
                              onClick={() => setViewStudentModal(student)}
                              className="hover:text-indigo-300 hover:underline transition text-left"
                            >
                              {student.hoTen}
                            </button>
                          </td>
                          <td className="px-5 py-3.5">
                            <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 font-mono text-[11px]">
                              {student.trinhDoCEFR}
                            </span>
                          </td>
                          <td className="px-5 py-3.5">
                            <div className="flex justify-center items-center space-x-1 sm:space-x-1.5">
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
                          <td className="px-5 py-3.5">
                            <input
                              type="text"
                              placeholder="Ghi chú (vắng lý do, đi muộn...)"
                              value={notes[student.id] || ''}
                              onChange={(e) => setNotes({ ...notes, [student.id]: e.target.value })}
                              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                            />
                          </td>
                          <td className="px-4 py-3.5 text-right">
                            <button
                              onClick={() => setViewStudentModal(student)}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-indigo-600 text-slate-400 hover:text-white transition"
                              title="Xem chi tiết lịch sử điểm danh của học viên này"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-500 text-xs">
                        Không tìm thấy học viên phù hợp.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: MA TRẬN & THỐNG KÊ ĐIỂM DANH TOÀN KHÓA */}
        {/* ========================================================================= */}
        {activeTab === 'matrix_view' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm space-y-4 p-5">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                  <BarChart3 className="w-4 h-4 text-indigo-400" />
                  <span>Ma Trận Chuyên Cần & Tiến Độ Lớp Học</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Bấm vào tên học viên để xem chi tiết lịch sử các buổi học.
                </p>
              </div>

              {/* Chú giải trạng thái */}
              <div className="flex flex-wrap items-center gap-2 text-[11px]">
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                  ✅ Có mặt
                </span>
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
                  ⏱️ Đi muộn
                </span>
                <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-semibold border border-blue-500/30">
                  📝 Có phép
                </span>
                <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-semibold border border-rose-500/30">
                  ❌ Vắng
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-medium">
                  ⚪ Chưa học
                </span>
              </div>
            </div>

            {loadingMatrix ? (
              <div className="py-16 flex justify-center items-center">
                <div className="w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300 border-collapse">
                  <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-semibold tracking-wider">
                    <tr>
                      <th className="px-4 py-3 sticky left-0 bg-slate-950 z-10 border-b border-slate-800">
                        Học Viên
                      </th>
                      {(matrixData?.buoiHoc || []).map((b: any) => (
                        <th
                          key={b.id}
                          className="px-2.5 py-3 text-center border-b border-slate-800 whitespace-nowrap min-w-[50px]"
                          title={`Buổi ${b.soThuTu}: ${b.chuDe || ''}`}
                        >
                          B{b.soThuTu}
                        </th>
                      ))}
                      <th className="px-3 py-3 text-center border-b border-slate-800 whitespace-nowrap">
                        Có Mặt
                      </th>
                      <th className="px-3 py-3 text-center border-b border-slate-800 whitespace-nowrap">
                        Vắng
                      </th>
                      <th className="px-4 py-3 text-center border-b border-slate-800 whitespace-nowrap">
                        Tỷ Lệ %
                      </th>
                      <th className="px-3 py-3 text-center border-b border-slate-800 whitespace-nowrap">
                        Đánh Giá
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {(matrixData?.dangKyHoc || []).map((dk: any) => {
                      const st = dk.hocVien;
                      const stats = calculateStudentAttendanceRate(st.id);
                      return (
                        <tr key={st.id} className="hover:bg-slate-800/40 transition">
                          <td className="px-4 py-2.5 sticky left-0 bg-slate-900/90 backdrop-blur-sm z-10 font-semibold text-white whitespace-nowrap">
                            <button
                              onClick={() => setViewStudentModal(st)}
                              className="text-left hover:text-indigo-400 hover:underline flex items-center space-x-1.5"
                            >
                              <span className="font-mono text-xs text-indigo-400 font-bold">{st.maHocVien}</span>
                              <span className="text-xs">{st.hoTen}</span>
                            </button>
                          </td>

                          {(matrixData?.buoiHoc || []).map((b: any) => {
                            const rec = b.diemDanh?.find((d: any) => Number(d.hocVienId) === Number(st.id));
                            let badge = <span className="text-slate-600 font-mono text-[10px]">-</span>;
                            if (rec) {
                              if (rec.trangThai === 'CO_MAT') {
                                badge = (
                                  <span className="w-6 h-6 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px] mx-auto border border-emerald-500/30">
                                    CM
                                  </span>
                                );
                              } else if (rec.trangThai === 'DI_MUON') {
                                badge = (
                                  <span className="w-6 h-6 rounded-md bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-[10px] mx-auto border border-amber-500/30">
                                    DM
                                  </span>
                                );
                              } else if (rec.trangThai === 'CO_PHEP') {
                                badge = (
                                  <span className="w-6 h-6 rounded-md bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-[10px] mx-auto border border-blue-500/30">
                                    CP
                                  </span>
                                );
                              } else if (rec.trangThai === 'VANG') {
                                badge = (
                                  <span className="w-6 h-6 rounded-md bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-[10px] mx-auto border border-rose-500/30">
                                    V
                                  </span>
                                );
                              }
                            }
                            return (
                              <td key={b.id} className="px-2 py-2 text-center">
                                {badge}
                              </td>
                            );
                          })}

                          <td className="px-3 py-2 text-center font-mono font-semibold text-emerald-400">
                            {stats.attended}
                          </td>
                          <td className="px-3 py-2 text-center font-mono font-semibold text-rose-400">
                            {stats.absent}
                          </td>
                          <td className="px-4 py-2 text-center">
                            <span
                              className={`font-mono font-bold text-xs ${
                                stats.rate >= 80 ? 'text-emerald-400' : 'text-rose-400'
                              }`}
                            >
                              {stats.rate}%
                            </span>
                          </td>
                          <td className="px-3 py-2 text-center">
                            {stats.rate >= 80 ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                ĐẠT
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center space-x-1">
                                <AlertTriangle className="w-3 h-3 mr-0.5 inline" />
                                <span>NGUY CƠ</span>
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL CHI TIẾT ĐIỂM DANH HỌC VIÊN */}
        {/* ========================================================================= */}
        {viewStudentModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-base">
                    {viewStudentModal.hoTen?.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center space-x-2">
                      <span>{viewStudentModal.hoTen}</span>
                      <span className="font-mono text-xs px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        {viewStudentModal.maHocVien}
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400">
                      Trình độ CEFR: <strong className="text-indigo-300">{viewStudentModal.trinhDoCEFR}</strong>
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setViewStudentModal(null)}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Attendance Breakdown Stats */}
              {(() => {
                const stats = calculateStudentAttendanceRate(viewStudentModal.id);
                return (
                  <div className="grid grid-cols-4 gap-2.5">
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                      <p className="text-[11px] text-slate-400">Có mặt</p>
                      <p className="text-base font-bold font-mono text-emerald-400">{stats.attended}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                      <p className="text-[11px] text-slate-400">Đi muộn</p>
                      <p className="text-base font-bold font-mono text-amber-400">{stats.late}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                      <p className="text-[11px] text-slate-400">Có phép</p>
                      <p className="text-base font-bold font-mono text-blue-400">{stats.excused}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                      <p className="text-[11px] text-slate-400">Tỷ lệ Chuyên cần</p>
                      <p
                        className={`text-base font-bold font-mono ${
                          stats.rate >= 80 ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {stats.rate}%
                      </p>
                    </div>
                  </div>
                );
              })()}

              {/* Chi tiết từng buổi học */}
              <div>
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5">
                  Lịch Sử Điểm Danh Các Buổi Học
                </h4>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {(matrixData?.buoiHoc || []).map((b: any) => {
                    const rec = b.diemDanh?.find((d: any) => Number(d.hocVienId) === Number(viewStudentModal.id));
                    return (
                      <div
                        key={b.id}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs"
                      >
                        <div className="space-y-0.5">
                          <p className="font-semibold text-white">
                            Buổi {b.soThuTu} — {b.chuDe || 'Điểm danh chuyên cần'}
                          </p>
                          <p className="text-[11px] text-slate-500 font-mono">
                            {new Date(b.ngayHoc).toLocaleDateString('vi-VN')}
                          </p>
                        </div>

                        <div className="flex items-center space-x-3">
                          {rec?.ghiChu && (
                            <span className="text-[11px] text-slate-400 italic bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                              💬 {rec.ghiChu}
                            </span>
                          )}
                          {rec ? (
                            <span
                              className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                                rec.trangThai === 'CO_MAT'
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                  : rec.trangThai === 'DI_MUON'
                                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                  : rec.trangThai === 'CO_PHEP'
                                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                  : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                              }`}
                            >
                              {rec.trangThai === 'CO_MAT'
                                ? '✅ Có Mặt'
                                : rec.trangThai === 'DI_MUON'
                                ? '⏱️ Đi Muộn'
                                : rec.trangThai === 'CO_PHEP'
                                ? '📝 Có Phép'
                                : '❌ Vắng'}
                            </span>
                          ) : (
                            <span className="text-slate-500 text-xs italic">Chưa điểm danh</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setViewStudentModal(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
