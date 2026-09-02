'use client';

import React, { useEffect, useState } from 'react';
import { AppLayout } from '../../../components/AppLayout';
import { usersService } from '../../../services/api';
import { GiaoVien } from '../../../types';
import { Plus, Award, Mail, Phone, Edit3, X, CheckCircle, UserCheck, Clock, UserX, KeyRound } from 'lucide-react';

export default function AdminTeachersPage() {
  const [teachers, setTeachers] = useState<GiaoVien[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<any | null>(null);

  const [createFormData, setCreateFormData] = useState({
    tenDangNhap: '',
    matKhau: 'Teacher@123',
    email: '',
    soDienThoai: '',
    maGiaoVien: '',
    hoTen: '',
    chuyenMon: '',
    bangCap: '',
  });

  const [editFormData, setEditFormData] = useState({
    hoTen: '',
    chuyenMon: '',
    bangCap: '',
    soDienThoai: '',
    trangThai: 'DANG_LAM_VIEC',
    matKhauMoi: '',
  });

  const fetchTeachers = async () => {
    try {
      const list = await usersService.getTeachers();
      setTeachers(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleCreateTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await usersService.createTeacher(createFormData);
      setMessage('Thêm mới giáo viên thành công!');
      setShowCreateModal(false);
      setCreateFormData({
        tenDangNhap: '',
        matKhau: 'Teacher@123',
        email: '',
        soDienThoai: '',
        maGiaoVien: '',
        hoTen: '',
        chuyenMon: '',
        bangCap: '',
      });
      fetchTeachers();
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Có lỗi xảy ra khi thêm giáo viên.');
    }
  };

  const openEditModal = (t: GiaoVien, defaultPassword?: string) => {
    setEditingTeacher(t);
    setEditFormData({
      hoTen: t.hoTen,
      chuyenMon: t.chuyenMon,
      bangCap: t.bangCap || '',
      soDienThoai: t.nguoiDung?.soDienThoai || '',
      trangThai: (t as any).trangThai || 'DANG_LAM_VIEC',
      matKhauMoi: defaultPassword || '',
    });
  };

  const handleUpdateTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTeacher) return;
    try {
      await usersService.updateTeacher(Number(editingTeacher.id), editFormData);
      setMessage('Cập nhật thông tin và trạng thái giáo viên thành công!');
      setEditingTeacher(null);
      fetchTeachers();
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật giáo viên.');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'DANG_LAM_VIEC':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-semibold">
            <UserCheck className="w-3 h-3" />
            <span>Đang Làm Việc</span>
          </span>
        );
      case 'TAM_NGHI':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[11px] font-semibold">
            <Clock className="w-3 h-3" />
            <span>Tạm Nghỉ</span>
          </span>
        );
      case 'DA_NGHI_VIEC':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[11px] font-semibold">
            <UserX className="w-3 h-3" />
            <span>Đã Nghỉ Việc</span>
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[11px] font-semibold">
            {status}
          </span>
        );
    }
  };

  return (
    <AppLayout
      allowedRoles={['QUAN_LY']}
      title="Đội Ngũ Giáo Viên & Giảng Viên"
      subtitle="Quản lý hồ sơ giảng viên, phân công chuyên môn, trình độ bằng cấp và điều chỉnh trạng thái công tác"
    >
      <div className="space-y-6">
        {/* Header toolbar */}
        <div className="flex justify-between items-center">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            {teachers.length} giáo viên trong hệ thống
          </span>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Giáo Viên Mới</span>
          </button>
        </div>

        {message && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>{message}</span>
          </div>
        )}

        {loading ? (
          <div className="py-20 flex justify-center items-center">
            <div className="w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teachers.map((t: any) => (
              <div
                key={t.id}
                className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm flex flex-col justify-between hover:border-slate-700 transition"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center font-bold text-indigo-400 text-lg">
                      {t.hoTen.split(' ').slice(-1)[0][0]}
                    </div>
                    <div className="flex flex-col items-end space-y-1.5">
                      <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 font-mono text-xs font-bold">
                        {t.maGiaoVien}
                      </span>
                      {getStatusBadge(t.trangThai || 'DANG_LAM_VIEC')}
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-white mb-1">{t.hoTen}</h3>
                  <div className="flex items-center text-xs text-indigo-400 font-medium mb-3">
                    <Award className="w-3.5 h-3.5 mr-1.5 shrink-0" />
                    <span>Chuyên môn: {t.chuyenMon}</span>
                  </div>

                  <p className="text-xs text-slate-400 mb-4 bg-slate-950/60 p-3 rounded-xl border border-slate-800/60 leading-relaxed">
                    🎓 <span className="text-slate-300 font-semibold">Bằng cấp:</span>{' '}
                    {t.bangCap || 'Cử nhân Sư phạm Tiếng Anh'}
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="pt-3 border-t border-slate-800/80 space-y-1.5 text-xs text-slate-400">
                    <div className="flex items-center">
                      <Mail className="w-3.5 h-3.5 mr-2 text-slate-500 shrink-0" />
                      <span className="truncate">{t.nguoiDung?.email}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-3.5 h-3.5 mr-2 text-slate-500 shrink-0" />
                      <span>{t.nguoiDung?.soDienThoai || 'Chưa cập nhật SĐT'}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 border-t border-slate-800/60 flex items-center space-x-2">
                    <button
                      onClick={() => openEditModal(t)}
                      className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-400 hover:text-indigo-300 text-xs font-semibold flex items-center justify-center space-x-1.5 border border-indigo-500/20 transition"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Sửa & Trạng Thái</span>
                    </button>
                    <button
                      onClick={() => openEditModal(t, 'Teacher@123')}
                      title="Khôi phục / Reset mật khẩu về Teacher@123"
                      className="p-2 rounded-xl bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-white border border-amber-500/30 transition"
                    >
                      <KeyRound className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal Thêm Giáo Viên */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <h3 className="text-base font-bold text-white">Thêm Giáo Viên / Giảng Viên Mới</h3>
                <button onClick={() => setShowCreateModal(false)} className="text-slate-500 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateTeacher} className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Mã Giáo Viên (VD: GV004)</label>
                    <input
                      type="text"
                      required
                      value={createFormData.maGiaoVien}
                      onChange={(e) => setCreateFormData({ ...createFormData, maGiaoVien: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Họ Và Tên</label>
                    <input
                      type="text"
                      required
                      value={createFormData.hoTen}
                      onChange={(e) => setCreateFormData({ ...createFormData, hoTen: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Tên Đăng Nhập</label>
                    <input
                      type="text"
                      required
                      value={createFormData.tenDangNhap}
                      onChange={(e) => setCreateFormData({ ...createFormData, tenDangNhap: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Mật Khẩu Khởi Tạo</label>
                    <input
                      type="password"
                      required
                      value={createFormData.matKhau}
                      onChange={(e) => setCreateFormData({ ...createFormData, matKhau: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Email</label>
                    <input
                      type="email"
                      required
                      value={createFormData.email}
                      onChange={(e) => setCreateFormData({ ...createFormData, email: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Số Điện Thoại</label>
                    <input
                      type="text"
                      value={createFormData.soDienThoai}
                      onChange={(e) => setCreateFormData({ ...createFormData, soDienThoai: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Chuyên Môn Giảng Dạy</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: IELTS Academic, TOEIC 4 Kỹ Năng, Giao Tiếp..."
                    value={createFormData.chuyenMon}
                    onChange={(e) => setCreateFormData({ ...createFormData, chuyenMon: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Bằng Cấp / Chứng Chỉ</label>
                  <input
                    type="text"
                    placeholder="VD: Thạc sĩ Ngôn ngữ Anh, IELTS 8.5, Chứng chỉ CELTA..."
                    value={createFormData.bangCap}
                    onChange={(e) => setCreateFormData({ ...createFormData, bangCap: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                  >
                    Hủy
                  </button>
                  <button type="submit" className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold">
                    Lưu Giáo Viên
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Sửa Giáo Viên & Đổi Trạng Thái */}
        {editingTeacher && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <h3 className="text-base font-bold text-white">
                  Cập Nhật Giáo Viên: <span className="text-indigo-400 font-mono">{editingTeacher.maGiaoVien}</span>
                </h3>
                <button onClick={() => setEditingTeacher(null)} className="text-slate-500 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUpdateTeacher} className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Họ Và Tên</label>
                    <input
                      type="text"
                      required
                      value={editFormData.hoTen}
                      onChange={(e) => setEditFormData({ ...editFormData, hoTen: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Số Điện Thoại</label>
                    <input
                      type="text"
                      value={editFormData.soDienThoai}
                      onChange={(e) => setEditFormData({ ...editFormData, soDienThoai: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Chuyên Môn</label>
                  <input
                    type="text"
                    required
                    value={editFormData.chuyenMon}
                    onChange={(e) => setEditFormData({ ...editFormData, chuyenMon: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Bằng Cấp</label>
                  <input
                    type="text"
                    value={editFormData.bangCap}
                    onChange={(e) => setEditFormData({ ...editFormData, bangCap: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-indigo-500/30 space-y-1.5">
                  <label className="block text-indigo-300 font-semibold uppercase tracking-wider text-[11px]">
                    Trạng Thái Công Tác (Quy Chế Nghiệp Vụ)
                  </label>
                  <select
                    value={editFormData.trangThai}
                    onChange={(e) => setEditFormData({ ...editFormData, trangThai: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-bold focus:outline-none focus:border-indigo-500"
                  >
                    <option value="DANG_LAM_VIEC">🟢 DANG_LAM_VIEC — Đang làm việc (Có thể phân công dạy)</option>
                    <option value="TAM_NGHI">🟡 TAM_NGHI — Tạm nghỉ (Nghỉ phép / dưỡng bệnh)</option>
                    <option value="DA_NGHI_VIEC">🔴 DA_NGHI_VIEC — Đã nghỉ việc (Khóa phân công & bảo lưu lịch sử)</option>
                  </select>
                  <p className="text-[11px] text-slate-400 italic">
                    * Khi chọn "Đã nghỉ việc", hệ thống sẽ giữ nguyên lịch sử điểm danh các lớp cũ và chặn phân công lớp mới.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-amber-500/30 space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="block text-amber-300 font-semibold text-[11px] uppercase tracking-wider flex items-center space-x-1">
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>Khôi Phục / Đặt Lại Mật Khẩu (Admin)</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setEditFormData({ ...editFormData, matKhauMoi: 'Teacher@123' })}
                      className="px-2 py-0.5 rounded bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-white text-[10px] font-bold transition"
                    >
                      ⚡ Reset về Teacher@123
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Để trống nếu không muốn đổi mật khẩu..."
                    value={editFormData.matKhauMoi}
                    onChange={(e) => setEditFormData({ ...editFormData, matKhauMoi: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-500 text-xs"
                  />
                  <p className="text-[10px] text-slate-500">
                    * Mật khẩu mới sẽ được mã hóa an toàn với Argon2 khi bạn bấm "Lưu Thay Đổi".
                  </p>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setEditingTeacher(null)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                  >
                    Hủy
                  </button>
                  <button type="submit" className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold">
                    Lưu Thay Đổi
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
