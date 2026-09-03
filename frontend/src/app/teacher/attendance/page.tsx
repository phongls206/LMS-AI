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
          // Mặc định chọn buổi gần nhất chưa học hoặc buổi đầu tiên
          const pending = classSessions.find((s: any) => s.trangThai === 'CHUA_HOC');
          setSelectedSessionId(pending ? pending.id : classSessions[0].id);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchClassDetailAndSessions();
  }, [selectedClassId]);

  // 3. Tải danh sách điểm danh khi chọn buổi học
  useEffect(() => {
    if (!selectedSessionId || !classDetail) return;

    const fetchSessionAttendance = async () => {
      try {
        const session = sessions.find((s) => s.id === selectedSessionId);
        const records: Record<number, TrangThaiDiemDanh> = {};
        const noteRecords: Record<number, string> = {};

        // Khởi tạo mặc định: CO_MAT cho tất cả học viên trong lớp
        classDetail.dangKyHoc?.forEach((dk: any) => {
          records[dk.hocVien.id] = 'CO_MAT';
        });

        // Điền dữ liệu thực tế nếu buổi học đã được điểm danh trước đó
        if (session && session.diemDanh && session.diemDanh.length > 0) {
          session.diemDanh.forEach((d: any) => {
            records[d.hocVienId] = d.trangThai;
            if (d.ghiChu) noteRecords[d.hocVienId] = d.ghiChu;
          });
        }

        setAttendanceRecords(records);
        setNotes(noteRecords);
      } catch (err) {
        console.error(err);
      }
    };

    fetchSessionAttendance();
  }, [selectedSessionId, classDetail, sessions]);

  // 4. Tải dữ liệu Ma trận điểm danh khi chuyển sang tab matrix_view
  useEffect(() => {
    if (activeTab !== 'matrix_view' || !selectedClassId) return;

    const fetchMatrix = async () => {
      try {
        setLoadingMatrix(true);
        const data = await attendancesService.getClassAttendanceMatrix(selectedClassId);
        setMatrixData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingMatrix(false);
      }
    };

    fetchMatrix();
  }, [activeTab, selectedClassId]);

  // Đổi trạng thái điểm danh cho 1 học viên
  const handleStatusChange = (studentId: number, status: TrangThaiDiemDanh) => {
    setAttendanceRecords((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  // Đánh dấu tất cả là "CO_MAT"
  const handleMarkAllPresent = () => {
    const updated: Record<number, TrangThaiDiemDanh> = {};
    classDetail?.dangKyHoc?.forEach((dk: any) => {
      updated[dk.hocVien.id] = 'CO_MAT';
    });
    setAttendanceRecords(updated);
  };

  // Lưu điểm danh buổi học
  const handleSaveAttendance = async () => {
    if (!selectedSessionId || !classDetail) return;
    setSaving(true);
    setMessage(null);

    const danhSach = Object.entries(attendanceRecords).map(([studentId, trangThai]) => ({
      hocVienId: +studentId,
      trangThai,
      ghiChu: notes[+studentId] || undefined,
    }));

    try {
      await attendancesService.submitAttendance(selectedSessionId, danhSach);
      setMessage('Lưu kết quả điểm danh thành công!');

      // Cập nhật lại danh sách sessions cục bộ
      const classSessions = await attendancesService.getClassSessions(selectedClassId!);
      setSessions(classSessions);

      // Nếu đang mở ma trận thì cập nhật luôn
      if (activeTab === 'matrix_view') {
        const data = await attendancesService.getClassAttendanceMatrix(selectedClassId!);
        setMatrixData(data);
      }

      setTimeout(() => setMessage(null), 3000);
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
        <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center space-x-2">
              <label className="text-xs font-bold text-slate-700 whitespace-nowrap">Lớp Học:</label>
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
                <span className="text-xs text-amber-600 font-medium italic">Chưa có lớp nào</span>
              )}
            </div>

            {activeTab === 'take_attendance' && sessions.length > 0 && (
              <div className="flex items-center space-x-2">
                <label className="text-xs font-bold text-slate-700 whitespace-nowrap">Buổi Điểm Danh:</label>
                <select
                  value={selectedSessionId || ''}
                  onChange={(e) => setSelectedSessionId(+e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-teal-500 font-bold max-w-[260px] truncate cursor-pointer"
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
                  className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center space-x-1.5 border border-slate-200 cursor-pointer"
                  title="Điểm danh tất cả học viên Có Mặt"
                >
                  <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Tất Cả Có Mặt</span>
                </button>

                <button
                  onClick={handleSaveAttendance}
                  disabled={saving || !selectedSessionId || !classDetail?.dangKyHoc?.length}
                  className="flex items-center space-x-2 px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-md shadow-teal-600/20 transition disabled:opacity-50 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Đang Lưu...' : 'Lưu Điểm Danh'}</span>
                </button>
              </>
            )}
          </div>
        </div>

        {message && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2 animate-fadeIn shadow-sm">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        {/* Thẻ thống kê KPI trực quan */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 flex items-center space-x-3 shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 shrink-0">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] text-slate-500 font-bold">Sĩ Số</p>
              <p className="text-base font-black text-slate-900 font-mono">{totalStudents} HV</p>
            </div>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 flex items-center space-x-3 shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
              <CheckCircle className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] text-slate-500 font-bold">Có Mặt</p>
              <p className="text-base font-black text-emerald-700 font-mono">{countPresent}</p>
            </div>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 flex items-center space-x-3 shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] text-slate-500 font-bold">Đi Muộn</p>
              <p className="text-base font-black text-amber-700 font-mono">{countLate}</p>
            </div>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 flex items-center space-x-3 shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] text-slate-500 font-bold">Có Phép</p>
              <p className="text-base font-black text-blue-700 font-mono">{countExcused}</p>
            </div>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 flex items-center space-x-3 shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-700 shrink-0">
              <XCircle className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] text-slate-500 font-bold">Vắng Mặt</p>
              <p className="text-base font-black text-rose-700 font-mono">{countAbsent}</p>
            </div>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 flex items-center space-x-3 shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 shrink-0">
              <Percent className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] text-slate-500 font-bold">Chuyên Cần</p>
              <p className="text-base font-black text-teal-700 font-mono">{presentRate}%</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation: Điểm danh buổi học vs Ma trận toàn khóa */}
        <div className="flex border-b border-slate-200 space-x-4">
          <button
            onClick={() => setActiveTab('take_attendance')}
            className={`pb-3 text-xs font-bold flex items-center space-x-2 transition border-b-2 cursor-pointer ${
              activeTab === 'take_attendance'
                ? 'text-teal-700 border-teal-600'
                : 'text-slate-500 border-transparent hover:text-slate-900'
            }`}
          >
            <ListCheck className="w-4 h-4" />
            <span>1. Bảng Điểm Danh Buổi Học</span>
          </button>

          <button
            onClick={() => setActiveTab('matrix_view')}
            className={`pb-3 text-xs font-bold flex items-center space-x-2 transition border-b-2 cursor-pointer ${
              activeTab === 'matrix_view'
                ? 'text-teal-700 border-teal-600'
                : 'text-slate-500 border-transparent hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>2. Ma Trận & Thống Kê Toàn Khóa</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-teal-50 border border-teal-200 text-teal-700 font-mono font-bold">
              Trực quan
            </span>
          </button>
        </div>

        {/* TAB 1: NHẬP ĐIỂM DANH BUỔI HỌC */}
        {activeTab === 'take_attendance' && (
          <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-sm space-y-0">
            <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-3 bg-slate-50">
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                  Danh Sách Điểm Danh ({filteredEnrollments.length} Học Viên)
                </h3>
              </div>

              <div className="flex items-center space-x-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchStudent}
                    onChange={(e) => setSearchStudent(e.target.value)}
                    placeholder="Tìm tên hoặc mã học viên..."
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 pl-8 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-600 uppercase text-[11px] font-bold tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-3.5">Mã HV</th>
                    <th className="px-5 py-3.5">Họ Và Tên</th>
                    <th className="px-5 py-3.5">Trình Độ</th>
                    <th className="px-5 py-3.5 text-center">Trạng Thái Điểm Danh (4 Trạng Thái)</th>
                    <th className="px-5 py-3.5">Ghi Chú Buổi Học</th>
                    <th className="px-4 py-3.5 text-right">Chi Tiết</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredEnrollments.length > 0 ? (
                    filteredEnrollments.map((dk: any) => {
                      const student = dk.hocVien;
                      const currentStatus = attendanceRecords[student.id] || 'CO_MAT';
                      return (
                        <tr key={student.id} className="hover:bg-teal-50/30 transition">
                          <td className="px-5 py-3.5 font-mono font-bold text-teal-700">{student.maHocVien}</td>
                          <td className="px-5 py-3.5 font-bold text-slate-900">
                            <button
                              onClick={() => setViewStudentModal(student)}
                              className="hover:text-teal-600 hover:underline transition text-left cursor-pointer"
                            >
                              {student.hoTen}
                            </button>
                          </td>
                          <td className="px-5 py-3.5">
                            <span className="px-2 py-0.5 rounded bg-teal-50 text-teal-700 font-mono text-[11px] font-bold border border-teal-200">
                              {student.trinhDoCEFR}
                            </span>
                          </td>
                          <td className="px-5 py-3.5">
                            <div className="flex justify-center items-center space-x-1 sm:space-x-1.5">
                              <button
                                type="button"
                                onClick={() => handleStatusChange(student.id, 'CO_MAT')}
                                className={`px-3 py-1.5 rounded-lg font-bold text-[11px] transition cursor-pointer ${
                                  currentStatus === 'CO_MAT'
                                    ? 'bg-emerald-600 text-white shadow-sm'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                              >
                                ✅ Có Mặt
                              </button>
                              <button
                                type="button"
                                onClick={() => handleStatusChange(student.id, 'DI_MUON')}
                                className={`px-3 py-1.5 rounded-lg font-bold text-[11px] transition cursor-pointer ${
                                  currentStatus === 'DI_MUON'
                                    ? 'bg-amber-600 text-white shadow-sm'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                              >
                                ⏱️ Đi Muộn
                              </button>
                              <button
                                type="button"
                                onClick={() => handleStatusChange(student.id, 'CO_PHEP')}
                                className={`px-3 py-1.5 rounded-lg font-bold text-[11px] transition cursor-pointer ${
                                  currentStatus === 'CO_PHEP'
                                    ? 'bg-blue-600 text-white shadow-sm'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                              >
                                📝 Có Phép
                              </button>
                              <button
                                type="button"
                                onClick={() => handleStatusChange(student.id, 'VANG')}
                                className={`px-3 py-1.5 rounded-lg font-bold text-[11px] transition cursor-pointer ${
                                  currentStatus === 'VANG'
                                    ? 'bg-rose-600 text-white shadow-sm'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
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
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-500"
                            />
                          </td>
                          <td className="px-4 py-3.5 text-right">
                            <button
                              onClick={() => setViewStudentModal(student)}
                              className="p-1.5 rounded-lg bg-teal-50 hover:bg-teal-600 text-teal-700 hover:text-white transition cursor-pointer border border-teal-200 hover:border-teal-600"
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
                      <td colSpan={6} className="py-12 text-center text-slate-400 text-xs italic">
                        Không tìm thấy học viên phù hợp.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: MA TRẬN & THỐNG KÊ ĐIỂM DANH TOÀN KHÓA */}
        {activeTab === 'matrix_view' && (
          <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-sm space-y-4 p-5">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                  <BarChart3 className="w-4 h-4 text-teal-600" />
                  <span>Ma Trận Chuyên Cần & Tiến Độ Lớp Học</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Bấm vào tên học viên để xem chi tiết lịch sử các buổi học.
                </p>
              </div>

              {/* Chú giải trạng thái */}
              <div className="flex flex-wrap items-center gap-2 text-[11px]">
                <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                  ✅ Có mặt
                </span>
                <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 font-bold border border-amber-200">
                  ⏱️ Đi muộn
                </span>
                <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold border border-blue-200">
                  📝 Có phép
                </span>
                <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 font-bold border border-rose-200">
                  ❌ Vắng
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                  ⚪ Chưa học
                </span>
              </div>
            </div>

            {loadingMatrix ? (
              <div className="py-16 flex justify-center items-center">
                <div className="w-8 h-8 border-4 border-teal-500/20 border-t-teal-600 rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700 border-collapse">
                  <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-bold tracking-wider">
                    <tr>
                      <th className="px-4 py-3 sticky left-0 bg-slate-50 z-10 border-b border-slate-200">
                        Học Viên
                      </th>
                      {(matrixData?.buoiHoc || []).map((b: any) => (
                        <th
                          key={b.id}
                          className="px-2.5 py-3 text-center border-b border-slate-200 whitespace-nowrap min-w-[50px]"
                          title={`Buổi ${b.soThuTu}: ${b.chuDe || ''}`}
                        >
                          B{b.soThuTu}
                        </th>
                      ))}
                      <th className="px-3 py-3 text-center border-b border-slate-200 whitespace-nowrap">
                        Có Mặt
                      </th>
                      <th className="px-3 py-3 text-center border-b border-slate-200 whitespace-nowrap">
                        Vắng
                      </th>
                      <th className="px-4 py-3 text-center border-b border-slate-200 whitespace-nowrap">
                        Tỷ Lệ %
                      </th>
                      <th className="px-3 py-3 text-center border-b border-slate-200 whitespace-nowrap">
                        Đánh Giá
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(matrixData?.dangKyHoc || []).map((dk: any) => {
                      const st = dk.hocVien;
                      const stats = calculateStudentAttendanceRate(st.id);
                      return (
                        <tr key={st.id} className="hover:bg-teal-50/30 transition">
                          <td className="px-4 py-2.5 sticky left-0 bg-white/95 backdrop-blur-sm z-10 font-bold text-slate-900 whitespace-nowrap border-r border-slate-100">
                            <button
                              onClick={() => setViewStudentModal(st)}
                              className="text-left hover:text-teal-600 hover:underline flex items-center space-x-1.5 cursor-pointer"
                            >
                              <span className="font-mono text-xs text-teal-700 font-bold">{st.maHocVien}</span>
                              <span className="text-xs">{st.hoTen}</span>
                            </button>
                          </td>

                          {(matrixData?.buoiHoc || []).map((b: any) => {
                            const rec = b.diemDanh?.find((d: any) => Number(d.hocVienId) === Number(st.id));
                            let badge = <span className="text-slate-300 font-mono text-[10px]">-</span>;
                            if (rec) {
                              if (rec.trangThai === 'CO_MAT') {
                                badge = (
                                  <span className="w-6 h-6 rounded-md bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-[10px] mx-auto border border-emerald-200">
                                    CM
                                  </span>
                                );
                              } else if (rec.trangThai === 'DI_MUON') {
                                badge = (
                                  <span className="w-6 h-6 rounded-md bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-[10px] mx-auto border border-amber-200">
                                    DM
                                  </span>
                                );
                              } else if (rec.trangThai === 'CO_PHEP') {
                                badge = (
                                  <span className="w-6 h-6 rounded-md bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-[10px] mx-auto border border-blue-200">
                                    CP
                                  </span>
                                );
                              } else if (rec.trangThai === 'VANG') {
                                badge = (
                                  <span className="w-6 h-6 rounded-md bg-rose-50 text-rose-700 flex items-center justify-center font-bold text-[10px] mx-auto border border-rose-200">
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

                          <td className="px-3 py-2 text-center font-mono font-bold text-emerald-700">
                            {stats.attended}
                          </td>
                          <td className="px-3 py-2 text-center font-mono font-bold text-rose-700">
                            {stats.absent}
                          </td>
                          <td className="px-4 py-2 text-center">
                            <span
                              className={`font-mono font-bold text-xs ${
                                stats.rate >= 80 ? 'text-emerald-700' : 'text-rose-700'
                              }`}
                            >
                              {stats.rate}%
                            </span>
                          </td>
                          <td className="px-3 py-2 text-center">
                            {stats.rate >= 80 ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                ĐẠT
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 flex items-center justify-center space-x-1">
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

        {/* MODAL CHI TIẾT ĐIỂM DANH HỌC VIÊN */}
        {viewStudentModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
            <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto text-slate-800">
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center font-bold text-base">
                    {viewStudentModal.hoTen?.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                      <span>{viewStudentModal.hoTen}</span>
                      <span className="font-mono text-xs px-2 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200 font-bold">
                        {viewStudentModal.maHocVien}
                      </span>
                    </h3>
                    <p className="text-xs text-slate-500">
                      Trình độ CEFR: <strong className="text-teal-700">{viewStudentModal.trinhDoCEFR}</strong>
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setViewStudentModal(null)}
                  className="p-1.5 rounded-lg bg-slate-100 text-slate-400 hover:text-slate-700 transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Attendance Breakdown Stats */}
              {(() => {
                const stats = calculateStudentAttendanceRate(viewStudentModal.id);
                return (
                  <div className="grid grid-cols-4 gap-2.5">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                      <p className="text-[11px] text-slate-500 font-bold">Có mặt</p>
                      <p className="text-base font-bold font-mono text-emerald-700">{stats.attended}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                      <p className="text-[11px] text-slate-500 font-bold">Đi muộn</p>
                      <p className="text-base font-bold font-mono text-amber-700">{stats.late}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                      <p className="text-[11px] text-slate-500 font-bold">Có phép</p>
                      <p className="text-base font-bold font-mono text-blue-700">{stats.excused}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                      <p className="text-[11px] text-slate-500 font-bold">Tỷ lệ Chuyên cần</p>
                      <p
                        className={`text-base font-bold font-mono ${
                          stats.rate >= 80 ? 'text-emerald-700' : 'text-rose-700'
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
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                  Lịch Sử Điểm Danh Các Buổi Học
                </h4>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {(matrixData?.buoiHoc || []).map((b: any) => {
                    const rec = b.diemDanh?.find((d: any) => Number(d.hocVienId) === Number(viewStudentModal.id));
                    return (
                      <div
                        key={b.id}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                      >
                        <div className="space-y-0.5">
                          <p className="font-bold text-slate-900">
                            Buổi {b.soThuTu} — {b.chuDe || 'Điểm danh chuyên cần'}
                          </p>
                          <p className="text-[11px] text-slate-500 font-mono">
                            {new Date(b.ngayHoc).toLocaleDateString('vi-VN')}
                          </p>
                        </div>

                        <div className="flex items-center space-x-3">
                          {rec?.ghiChu && (
                            <span className="text-[11px] text-slate-600 italic bg-white px-2 py-0.5 rounded border border-slate-200">
                              💬 {rec.ghiChu}
                            </span>
                          )}
                          {rec ? (
                            <span
                              className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${
                                rec.trangThai === 'CO_MAT'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : rec.trangThai === 'DI_MUON'
                                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                                  : rec.trangThai === 'CO_PHEP'
                                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                                  : 'bg-rose-50 text-rose-700 border-rose-200'
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
                            <span className="text-slate-400 text-xs italic">Chưa điểm danh</span>
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
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
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
