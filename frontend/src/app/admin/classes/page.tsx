'use client';

import React, { useEffect, useState } from 'react';
import { AppLayout } from '../../../components/AppLayout';
import { classesService, coursesService, usersService } from '../../../services/api';
import { LopHoc, KhoaHoc, GiaoVien } from '../../../types';
import { GraduationCap, Plus, Calendar, UserCheck, AlertCircle, CheckCircle } from 'lucide-react';

export default function AdminClassesPage() {
  const [classes, setClasses] = useState<LopHoc[]>([]);
  const [courses, setCourses] = useState<KhoaHoc[]>([]);
  const [teachers, setTeachers] = useState<GiaoVien[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [showCreateClass, setShowCreateClass] = useState(false);
  const [showAddSchedule, setShowAddSchedule] = useState<number | null>(null);
  const [showAssignTeacher, setShowAssignTeacher] = useState<number | null>(null);

  // Form states
  const [classForm, setClassForm] = useState({
    khoaHocId: 1,
    maLopHoc: '',
    tenLopHoc: '',
    siSoToiDa: 25,
    ngayBatDau: '',
    ngayKetThuc: '',
    phongHoc: 'Phòng A101',
  });

  const [scheduleForm, setScheduleForm] = useState({
    thuTrongTuan: 2,
    gioBatDau: '18:00',
    gioKetThuc: '20:30',
    phongHoc: 'Phòng A101',
  });

  const [assignForm, setAssignForm] = useState({
    giaoVienId: 1,
  });

  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchData = async () => {
    try {
      const [classList, courseList, teacherList] = await Promise.all([
        classesService.getAll(),
        coursesService.getAll(),
        usersService.getTeachers(),
      ]);
      setClasses(classList);
      setCourses(courseList);
      setTeachers(teacherList);
      if (courseList.length > 0) setClassForm((prev) => ({ ...prev, khoaHocId: courseList[0].id }));
      if (teacherList.length > 0) setAssignForm({ giaoVienId: teacherList[0].id });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await classesService.create(classForm);
      setMessage({ type: 'success', text: 'Mở lớp học mới thành công!' });
      setShowCreateClass(false);
      fetchData();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Lỗi mở lớp học.' });
    }
  };

  const handleAddSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showAddSchedule) return;
    try {
      await classesService.addSchedule(showAddSchedule, scheduleForm);
      setMessage({ type: 'success', text: 'Thêm lịch học thành công (Đã qua kiểm tra chống trùng phòng)!' });
      setShowAddSchedule(null);
      fetchData();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Lỗi thêm lịch học.' });
    }
  };

  const handleAssignTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showAssignTeacher) return;
    try {
      await classesService.assignTeacher(showAssignTeacher, assignForm);
      setMessage({ type: 'success', text: 'Phân công giáo viên thành công (Đã qua kiểm tra chống trùng giờ dạy)!' });
      setShowAssignTeacher(null);
      fetchData();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Lỗi phân công giáo viên.' });
    }
  };

  const handleStatusChange = async (classId: number, newStatus: string) => {
    try {
      await classesService.updateStatus(classId, newStatus);
      const statusLabels: Record<string, string> = {
        SAP_MO: 'Sắp Mở (Đang chuẩn bị xếp lịch & gán GV)',
        DANG_MO_DANG_KY: 'Đang Mở Tuyển Sinh (Học viên có thể đăng ký ngay)',
        DANG_HOC: 'Đang Học (Dành cho GV điểm danh/nhập điểm, ẩn khỏi cổng tuyển sinh)',
        DA_KET_THUC: 'Đã Kết Thúc (Khóa học hoàn tất, lưu trữ hồ sơ)',
        DA_HUY: 'Đã Hủy (Đã ẩn hoàn toàn khỏi cổng tuyển sinh và quầy ghi danh)',
      };
      setMessage({
        type: 'success',
        text: `Đã cập nhật trạng thái lớp: ${statusLabels[newStatus] || newStatus}!`,
      });
      fetchData();
      setTimeout(() => setMessage(null), 4000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Không thể cập nhật trạng thái lớp.' });
    }
  };

  return (
    <AppLayout
      allowedRoles={['QUAN_LY']}
      title="Quản Lý Lớp Học & Phân Công Lịch"
      subtitle="Thiết lập phòng học, xếp lịch hàng tuần và phân công giảng viên trực tiếp"
    >
      <div className="space-y-6">
        {/* Actions Bar */}
        <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Tổng số {classes.length} lớp học trên hệ thống
            </span>
          </div>
          <button
            onClick={() => setShowCreateClass(true)}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 hover:opacity-95 text-white text-xs font-bold shadow-md shadow-teal-600/20 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Mở Lớp Học Mới</span>
          </button>
        </div>

        {message && (
          <div
            className={`p-3.5 rounded-xl text-xs flex items-center space-x-2 shadow-sm ${
              message.type === 'success'
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                : 'bg-rose-50 border border-rose-200 text-rose-800'
            }`}
          >
            {message.type === 'success' ? <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" /> : <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />}
            <span>{message.text}</span>
          </div>
        )}

        {/* Classes Table */}
        {loading ? (
          <div className="py-20 flex justify-center items-center">
            <div className="w-8 h-8 border-4 border-teal-500/20 border-t-teal-600 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-600 uppercase text-[11px] font-bold tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-3.5">Mã Lớp</th>
                    <th className="px-5 py-3.5">Tên Lớp & Khóa Học</th>
                    <th className="px-5 py-3.5">Sĩ Số</th>
                    <th className="px-5 py-3.5">Thời Khóa Biểu</th>
                    <th className="px-5 py-3.5">Giáo Viên</th>
                    <th className="px-5 py-3.5">Trạng Thái (Đổi Nhanh)</th>
                    <th className="px-5 py-3.5 text-right">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {classes.map((c) => (
                    <tr key={c.id} className="hover:bg-teal-50/30 transition">
                      <td className="px-5 py-4 font-mono font-bold text-teal-700">{c.maLopHoc}</td>
                      <td className="px-5 py-4">
                        <p className="font-bold text-slate-900">{c.tenLopHoc}</p>
                        <p className="text-[11px] text-slate-500">{c.khoaHoc?.tenKhoaHoc}</p>
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-bold text-slate-900">{c.siSoHienTai}</span> / {c.siSoToiDa} HV
                      </td>
                      <td className="px-5 py-4">
                        {c.lichHoc && c.lichHoc.length > 0 ? (
                          <div className="space-y-1">
                            {c.lichHoc.map((l: any) => (
                              <span
                                key={l.id}
                                className="inline-block mr-1 px-2 py-0.5 rounded bg-slate-100 text-[11px] text-slate-700 font-mono font-semibold border border-slate-200"
                              >
                                T{l.thuTrongTuan} ({l.phongHoc})
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-amber-700 text-[11px] font-semibold">Chưa xếp lịch</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        {c.phanCong && c.phanCong.length > 0 ? (
                          <span className="text-teal-700 font-bold">{c.phanCong[0].giaoVien?.hoTen}</span>
                        ) : (
                          <span className="text-slate-400 italic">Chưa phân công</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <select
                          value={c.trangThai}
                          onChange={(e) => handleStatusChange(Number(c.id), e.target.value)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold focus:outline-none border transition cursor-pointer ${
                            c.trangThai === 'DANG_MO_DANG_KY'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                              : c.trangThai === 'DANG_HOC'
                              ? 'bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100'
                              : c.trangThai === 'SAP_MO'
                              ? 'bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100'
                              : c.trangThai === 'DA_KET_THUC'
                              ? 'bg-slate-100 text-slate-600 border-slate-200'
                              : 'bg-rose-50 text-rose-700 border-rose-200'
                          }`}
                        >
                          <option value="SAP_MO" className="bg-white text-sky-700">🔵 Sắp Mở</option>
                          <option value="DANG_MO_DANG_KY" className="bg-white text-emerald-700">🟢 Đang Mở Tuyển Sinh</option>
                          <option value="DANG_HOC" className="bg-white text-teal-700">🟣 Đang Học</option>
                          <option value="DA_KET_THUC" className="bg-white text-slate-700">⚪ Đã Kết Thúc</option>
                          <option value="DA_HUY" className="bg-white text-rose-700">🔴 Đã Hủy</option>
                        </select>
                      </td>
                      <td className="px-5 py-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          {c.trangThai === 'DA_HUY' ? (
                            <span className="px-2.5 py-1 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 text-[11px] font-bold">
                              Lớp Đã Hủy
                            </span>
                          ) : c.trangThai === 'DA_KET_THUC' ? (
                            <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-500 text-[11px] font-bold">
                              Đã Kết Thúc
                            </span>
                          ) : (
                            <>
                              <button
                                onClick={() => setShowAddSchedule(c.id)}
                                className="inline-flex items-center px-2.5 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-600 text-teal-700 hover:text-white border border-teal-200 hover:border-teal-600 transition text-xs font-bold shadow-sm whitespace-nowrap cursor-pointer"
                              >
                                + Lịch Học
                              </button>
                              <button
                                onClick={() => setShowAssignTeacher(c.id)}
                                className="inline-flex items-center px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border border-emerald-200 hover:border-emerald-600 transition text-xs font-bold shadow-sm whitespace-nowrap cursor-pointer"
                              >
                                + Gán GV
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal Mở Lớp Mới */}
        {showCreateClass && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
            <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg p-6 shadow-2xl text-slate-800">
              <h3 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">Mở Lớp Học Mới</h3>
              <form onSubmit={handleCreateClass} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Thuộc Khóa Học</label>
                  <select
                    value={classForm.khoaHocId}
                    onChange={(e) => setClassForm({ ...classForm, khoaHocId: +e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-teal-500"
                  >
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        [{c.maKhoaHoc}] {c.tenKhoaHoc} (CEFR {c.trinhDoYeuCau})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Mã Lớp Học (VD: IELTS-B1-02)</label>
                    <input
                      type="text"
                      required
                      value={classForm.maLopHoc}
                      onChange={(e) => setClassForm({ ...classForm, maLopHoc: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Sĩ Số Tối Đa</label>
                    <input
                      type="number"
                      max={200}
                      min={1}
                      value={classForm.siSoToiDa}
                      onChange={(e) => setClassForm({ ...classForm, siSoToiDa: +e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-teal-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Tên Lớp Học</label>
                  <input
                    type="text"
                    required
                    value={classForm.tenLopHoc}
                    onChange={(e) => setClassForm({ ...classForm, tenLopHoc: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-teal-500"
                    placeholder="VD: IELTS B1 Tối 2-4-6"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Ngày Bắt Đầu</label>
                    <input
                      type="date"
                      required
                      value={classForm.ngayBatDau}
                      onChange={(e) => setClassForm({ ...classForm, ngayBatDau: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Ngày Kết Thúc</label>
                    <input
                      type="date"
                      required
                      value={classForm.ngayKetThuc}
                      onChange={(e) => setClassForm({ ...classForm, ngayKetThuc: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-teal-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowCreateClass(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition cursor-pointer"
                  >
                    Hủy
                  </button>
                  <button type="submit" className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold transition shadow-sm cursor-pointer">
                    Mở Lớp Ngay
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Thêm Lịch Học */}
        {showAddSchedule && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
            <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md p-6 shadow-2xl text-slate-800">
              <h3 className="text-lg font-bold text-slate-900 mb-2">Thêm Buổi Học Tuần</h3>
              <p className="text-xs text-amber-700 mb-4">⚠️ Hệ thống tự động chặn nếu phòng học bị trùng lịch.</p>

              <form onSubmit={handleAddSchedule} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Thứ Trong Tuần</label>
                  <select
                    value={scheduleForm.thuTrongTuan}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, thuTrongTuan: +e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-teal-500"
                  >
                    <option value={2}>Thứ Hai</option>
                    <option value={3}>Thứ Ba</option>
                    <option value={4}>Thứ Tư</option>
                    <option value={5}>Thứ Năm</option>
                    <option value={6}>Thứ Sáu</option>
                    <option value={7}>Thứ Bảy</option>
                    <option value={8}>Chủ Nhật</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Giờ Bắt Đầu</label>
                    <input
                      type="text"
                      required
                      value={scheduleForm.gioBatDau}
                      onChange={(e) => setScheduleForm({ ...scheduleForm, gioBatDau: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono"
                      placeholder="18:00"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Giờ Kết Thúc</label>
                    <input
                      type="text"
                      required
                      value={scheduleForm.gioKetThuc}
                      onChange={(e) => setScheduleForm({ ...scheduleForm, gioKetThuc: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono"
                      placeholder="20:30"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Phòng Học</label>
                  <input
                    type="text"
                    required
                    value={scheduleForm.phongHoc}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, phongHoc: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900"
                    placeholder="Phòng A101"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowAddSchedule(null)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition cursor-pointer"
                  >
                    Hủy
                  </button>
                  <button type="submit" className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold transition shadow-sm cursor-pointer">
                    Xác Nhận Xếp Lịch
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Phân Công Giáo Viên */}
        {showAssignTeacher && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
            <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4 text-slate-800">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900">Phân Công Giáo Viên Giảng Dạy</h3>
                <button onClick={() => setShowAssignTeacher(null)} className="text-slate-400 hover:text-slate-700 p-1">
                  ✕
                </button>
              </div>

              {(() => {
                const targetClass = classes.find((c) => c.id === showAssignTeacher);
                const currentTeacher = targetClass?.phanCong?.[0]?.giaoVien;

                return (
                  <form onSubmit={handleAssignTeacher} className="space-y-3.5 text-xs">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                      <p className="text-slate-500">
                        Lớp học:{' '}
                        <span className="font-bold text-slate-900 font-mono">
                          [{targetClass?.maLopHoc}] {targetClass?.tenLopHoc}
                        </span>
                      </p>
                      <p className="text-slate-500">
                        Giáo viên hiện tại:{' '}
                        {currentTeacher ? (
                          <span className="text-teal-700 font-bold">{currentTeacher.hoTen}</span>
                        ) : (
                          <span className="text-slate-400 italic">Chưa phân công</span>
                        )}
                      </p>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Chọn Giáo Viên Mới Phụ Trách</label>
                      <select
                        value={assignForm.giaoVienId}
                        onChange={(e) => setAssignForm({ giaoVienId: +e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 font-medium focus:outline-none focus:border-teal-500"
                      >
                        {teachers.map((t) => (
                          <option key={t.id} value={t.id}>
                            [{t.maGiaoVien}] {t.hoTen} — {t.chuyenMon} ({t.trangThai === 'DANG_LAM_VIEC' ? '🟢 Sẵn sàng' : '🟡 Tạm nghỉ'})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 space-y-1 text-[11px] leading-relaxed">
                      <p className="text-teal-900 font-bold">ℹ️ Quy chế phân công & bảo toàn dữ liệu:</p>
                      <p>• Hệ thống tự động kiểm tra chống trùng giờ dạy của giáo viên với các lớp khác.</p>
                      <p>• Toàn bộ lịch sử điểm danh, chuyên cần và bảng điểm do giáo viên cũ đã nhập trước đó vẫn được lưu trữ nguyên vẹn 100%.</p>
                    </div>

                    <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setShowAssignTeacher(null)}
                        className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition cursor-pointer"
                      >
                        Hủy
                      </button>
                      <button type="submit" className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold transition shadow-sm cursor-pointer">
                        Xác Nhận Phân Công
                      </button>
                    </div>
                  </form>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
