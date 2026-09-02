'use client';

import React, { useEffect, useState } from 'react';
import { AppLayout } from '../../../components/AppLayout';
import { usersService } from '../../../services/api';
import { HocVien, TrinhDoCEFR } from '../../../types';
import {
  Plus,
  Search,
  CheckCircle,
  Edit3,
  Trash2,
  X,
  AlertTriangle,
  KeyRound,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Eye,
  BookOpen,
  CreditCard,
  GraduationCap,
  Calendar,
  Phone,
  Mail,
  MapPin,
  DollarSign,
  UserCheck,
} from 'lucide-react';

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<HocVien[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [cefrFilter, setCefrFilter] = useState<string>('');
  const [message, setMessage] = useState<string | null>(null);

  // Pagination state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<any | null>(null);
  const [deletingStudent, setDeletingStudent] = useState<any | null>(null);
  const [detailStudent, setDetailStudent] = useState<any | null>(null);

  const [createFormData, setCreateFormData] = useState({
    tenDangNhap: '',
    matKhau: '123456',
    email: '',
    soDienThoai: '',
    maHocVien: '',
    hoTen: '',
    diaChi: '',
    trinhDoCEFR: 'B1' as TrinhDoCEFR,
    nguonDanhGia: 'Placement Test',
  });

  const [editFormData, setEditFormData] = useState({
    hoTen: '',
    soDienThoai: '',
    diaChi: '',
    trinhDoCEFR: 'B1' as TrinhDoCEFR,
    nguonDanhGia: '',
    trangThai: 'DANG_HOC',
    matKhauMoi: '',
  });

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await usersService.getStudents(page, limit, search || undefined, cefrFilter || undefined);
      setStudents(res.data || []);
      if (res.meta) {
        setTotal(res.meta.total || 0);
        setTotalPages(res.meta.totalPages || 1);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [page, limit, search, cefrFilter]);

  // Reset to page 1 when search or filter changes
  useEffect(() => {
    setPage(1);
  }, [search, cefrFilter]);

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await usersService.createStudent(createFormData);
      setMessage('Tiếp nhận & tạo hồ sơ học viên thành công!');
      setShowCreateModal(false);
      setCreateFormData({
        tenDangNhap: '',
        matKhau: '123456',
        email: '',
        soDienThoai: '',
        maHocVien: '',
        hoTen: '',
        diaChi: '',
        trinhDoCEFR: 'B1',
        nguonDanhGia: 'Placement Test',
      });
      fetchStudents();
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Có lỗi xảy ra khi tạo học viên.');
    }
  };

  const openEditModal = (s: HocVien, autoResetPass = false) => {
    setEditingStudent(s);
    setEditFormData({
      hoTen: s.hoTen,
      soDienThoai: s.nguoiDung?.soDienThoai || '',
      diaChi: (s as any).diaChi || '',
      trinhDoCEFR: s.trinhDoCEFR,
      nguonDanhGia: s.nguonDanhGia || '',
      trangThai: s.trangThai || 'DANG_HOC',
      matKhauMoi: autoResetPass ? '123456' : '',
    });
  };

  const handleUpdateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    try {
      const payload: any = { ...editFormData };
      if (!payload.matKhauMoi) delete payload.matKhauMoi;

      await usersService.updateStudent(Number(editingStudent.id), payload);
      setMessage(
        editFormData.matKhauMoi
          ? `Cập nhật hồ sơ và ĐÃ RESET MẬT KHẨU về "${editFormData.matKhauMoi}" thành công!`
          : 'Cập nhật thông tin học viên thành công!'
      );
      setEditingStudent(null);
      fetchStudents();
      setTimeout(() => setMessage(null), 4000);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật học viên.');
    }
  };

  const handleDeleteStudent = async () => {
    if (!deletingStudent) return;
    try {
      await usersService.deleteStudent(Number(deletingStudent.id));
      setMessage(`Đã xóa học viên ${deletingStudent.hoTen} thành công!`);
      setDeletingStudent(null);
      fetchStudents();
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Có lỗi xảy ra khi xóa học viên.');
    }
  };

  return (
    <AppLayout
      allowedRoles={['QUAN_LY', 'TU_VAN_VIEN']}
      title="Hồ Sơ & Quản Lý Học Viên"
      subtitle="Quản lý chi tiết học viên, khóa học tham gia, phân loại CEFR và công nợ học phí"
    >
      <div className="space-y-6">
        {/* Filters and Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm họ tên, mã học viên..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 pl-9 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <select
              value={cefrFilter}
              onChange={(e) => setCefrFilter(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="">Tất cả CEFR</option>
              <option value="A1">CEFR A1</option>
              <option value="A2">CEFR A2</option>
              <option value="B1">CEFR B1</option>
              <option value="B2">CEFR B2</option>
              <option value="C1">CEFR C1</option>
              <option value="C2">CEFR C2</option>
            </select>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Tiếp Nhận Học Viên Mới</span>
          </button>
        </div>

        {message && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        {/* Table */}
        {loading ? (
          <div className="py-20 flex justify-center items-center">
            <div className="w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 text-slate-400 uppercase text-[11px] font-semibold tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="px-5 py-3.5 whitespace-nowrap">Mã HV</th>
                    <th className="px-5 py-3.5 whitespace-nowrap">Họ Và Tên</th>
                    <th className="px-5 py-3.5 whitespace-nowrap text-center">Trình Độ</th>
                    <th className="px-5 py-3.5 min-w-[220px]">Lớp & Khóa Đang Học</th>
                    <th className="px-5 py-3.5 whitespace-nowrap">Email & SĐT</th>
                    <th className="px-5 py-3.5 whitespace-nowrap text-center">Học Phí</th>
                    <th className="px-5 py-3.5 whitespace-nowrap text-center">Trạng Thái</th>
                    <th className="px-5 py-3.5 whitespace-nowrap text-right">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {students.map((s: any) => {
                    const enrollments = s.dangKyHoc || [];
                    const invoices = s.hoaDon || [];
                    const totalFee = invoices.reduce((sum: number, inv: any) => sum + Number(inv.soTienPhaiTra || 0), 0);
                    const paidFee = invoices.reduce((sum: number, inv: any) => sum + Number(inv.soTienDaTra || 0), 0);
                    const isFullyPaid = invoices.length > 0 && paidFee >= totalFee;

                    return (
                      <tr key={s.id} className="hover:bg-slate-800/40 transition">
                        <td className="px-5 py-4 whitespace-nowrap">
                          <span className="font-mono font-bold text-indigo-400 block">{s.maHocVien}</span>
                          <span className="font-mono text-[11px] text-slate-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800/80 inline-block mt-0.5">
                            {s.nguoiDung?.tenDangNhap || s.maHocVien.toLowerCase()}
                          </span>
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          <button
                            onClick={() => setDetailStudent(s)}
                            className="font-semibold text-white hover:text-indigo-400 text-left transition block whitespace-nowrap"
                            title="Bấm để xem hồ sơ chi tiết"
                          >
                            <span>{s.hoTen}</span>
                          </button>
                          <span className="text-[11px] text-slate-400 block mt-0.5">
                            {s.gioiTinh === 'NAM' || s.gioiTinh === 'Nam' ? 'Nam' : 'Nữ'}
                          </span>
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap text-center">
                          <span className="inline-block whitespace-nowrap px-2.5 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-semibold font-mono text-xs">
                            {s.trinhDoCEFR}
                          </span>
                        </td>
                        <td className="px-5 py-4 min-w-[220px]">
                          {enrollments.length > 0 ? (
                            <div className="space-y-1.5">
                              {enrollments.map((dk: any) => (
                                <div key={dk.id || dk.lopHoc?.id} className="flex flex-col">
                                  <span className="font-semibold text-emerald-400 font-mono text-xs block whitespace-nowrap">
                                    [{dk.lopHoc?.maLopHoc}]
                                  </span>
                                  <span className="text-slate-200 text-xs font-medium block">
                                    {dk.lopHoc?.tenLopHoc}
                                  </span>
                                  {dk.lopHoc?.khoaHoc && (
                                    <span className="text-[11px] text-slate-400 block mt-0.5">
                                      Khóa: {dk.lopHoc?.khoaHoc?.tenKhoaHoc}
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="inline-block whitespace-nowrap text-slate-500 italic text-[11px] bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
                              Chưa xếp lớp
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          <p className="text-slate-300 font-medium">{s.nguoiDung?.email}</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">{s.nguoiDung?.soDienThoai || 'Chưa cập nhật'}</p>
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap text-center">
                          {invoices.length > 0 ? (
                            <span
                              className={`inline-block whitespace-nowrap px-3 py-1 rounded-full text-[11px] font-semibold border ${
                                isFullyPaid
                                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                  : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                              }`}
                            >
                              {isFullyPaid ? 'Đã Hoàn Tất' : 'Chờ Thu'}
                            </span>
                          ) : (
                            <span className="text-slate-500 text-xs">-</span>
                          )}
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap text-center">
                          <span
                            className={`inline-block whitespace-nowrap px-3 py-1 rounded-full text-[11px] font-semibold ${
                              s.trangThai === 'DANG_HOC'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : s.trangThai === 'DA_TOT_NGHIEP'
                                ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            }`}
                          >
                            {s.trangThai}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end space-x-1.5">
                            <button
                              onClick={() => setDetailStudent(s)}
                              title="Xem hồ sơ chi tiết"
                              className="p-1.5 rounded-lg bg-indigo-950/40 hover:bg-indigo-900/60 text-indigo-300 border border-indigo-500/30 transition"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => openEditModal(s, true)}
                              title="Reset mật khẩu về 123456"
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-amber-950/50 text-amber-400 hover:text-amber-300 transition"
                            >
                              <KeyRound className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => openEditModal(s, false)}
                              title="Sửa thông tin"
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setDeletingStudent(s)}
                              title="Xóa học viên"
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/50 text-rose-400 hover:text-rose-300 transition"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="px-5 py-4 bg-slate-950/60 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-400">
                <span>Hiển thị</span>
                <span className="font-semibold text-white">
                  {total > 0 ? (page - 1) * limit + 1 : 0} - {Math.min(page * limit, total)}
                </span>
                <span>trên tổng số</span>
                <span className="font-bold text-indigo-400">{total}</span>
                <span>học viên</span>

                <span className="text-slate-600">|</span>

                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400">Số dòng:</span>
                  <select
                    value={limit}
                    onChange={(e) => {
                      setLimit(Number(e.target.value));
                      setPage(1);
                    }}
                    className="bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    <option value={10}>10 / trang</option>
                    <option value={15}>15 / trang</option>
                    <option value={25}>25 / trang</option>
                    <option value={50}>50 / trang</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center space-x-1.5">
                <button
                  onClick={() => setPage(1)}
                  disabled={page === 1}
                  title="Trang đầu"
                  className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  <ChevronsLeft className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  title="Trang trước"
                  className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="flex items-center space-x-1 px-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((p) => {
                      if (totalPages <= 5) return true;
                      if (p === 1 || p === totalPages) return true;
                      return Math.abs(p - page) <= 1;
                    })
                    .map((p, idx, arr) => (
                      <React.Fragment key={p}>
                        {idx > 0 && arr[idx - 1] !== p - 1 && (
                          <span className="px-1 text-slate-600 text-[11px]">...</span>
                        )}
                        <button
                          onClick={() => setPage(p)}
                          className={`min-w-[28px] h-7 px-2 rounded-lg text-xs font-semibold transition ${
                            page === p
                              ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30'
                              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                          }`}
                        >
                          {p}
                        </button>
                      </React.Fragment>
                    ))}
                </div>

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  title="Trang kế tiếp"
                  className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setPage(totalPages)}
                  disabled={page >= totalPages}
                  title="Trang cuối"
                  className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  <ChevronsRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Thêm Học Viên */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <h3 className="text-base font-bold text-white">Tiếp Nhận & Tạo Hồ Sơ Học Viên Mới</h3>
                <button onClick={() => setShowCreateModal(false)} className="text-slate-500 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateStudent} className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Mã Học Viên (VD: HV007)</label>
                    <input
                      type="text"
                      required
                      value={createFormData.maHocVien}
                      onChange={(e) => setCreateFormData({ ...createFormData, maHocVien: e.target.value })}
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

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Trình Độ CEFR</label>
                    <select
                      value={createFormData.trinhDoCEFR}
                      onChange={(e) => setCreateFormData({ ...createFormData, trinhDoCEFR: e.target.value as TrinhDoCEFR })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="A1">A1 - Sơ Cấp</option>
                      <option value="A2">A2 - Tiền Trung Cấp</option>
                      <option value="B1">B1 - Trung Cấp</option>
                      <option value="B2">B2 - Trung Cao Cấp</option>
                      <option value="C1">C1 - Cao Cấp</option>
                      <option value="C2">C2 - Thành Thạo</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Nguồn Đánh Giá</label>
                    <input
                      type="text"
                      value={createFormData.nguonDanhGia}
                      onChange={(e) => setCreateFormData({ ...createFormData, nguonDanhGia: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
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
                    Lưu Học Viên
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Sửa Học Viên & Reset Mật Khẩu */}
        {editingStudent && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <h3 className="text-base font-bold text-white">
                  Cập Nhật Hồ Sơ: <span className="text-indigo-400 font-mono">{editingStudent.maHocVien}</span>
                </h3>
                <button onClick={() => setEditingStudent(null)} className="text-slate-500 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUpdateStudent} className="space-y-3 text-xs">
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

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Số Điện Thoại</label>
                    <input
                      type="text"
                      value={editFormData.soDienThoai}
                      onChange={(e) => setEditFormData({ ...editFormData, soDienThoai: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Trình Độ CEFR</label>
                    <select
                      value={editFormData.trinhDoCEFR}
                      onChange={(e) => setEditFormData({ ...editFormData, trinhDoCEFR: e.target.value as TrinhDoCEFR })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="A1">A1 - Sơ Cấp</option>
                      <option value="A2">A2 - Tiền Trung Cấp</option>
                      <option value="B1">B1 - Trung Cấp</option>
                      <option value="B2">B2 - Trung Cao Cấp</option>
                      <option value="C1">C1 - Cao Cấp</option>
                      <option value="C2">C2 - Thành Thạo</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Nguồn Đánh Giá</label>
                    <input
                      type="text"
                      value={editFormData.nguonDanhGia}
                      onChange={(e) => setEditFormData({ ...editFormData, nguonDanhGia: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Trạng Thái</label>
                    <select
                      value={editFormData.trangThai}
                      onChange={(e) => setEditFormData({ ...editFormData, trangThai: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="DANG_HOC">DANG_HOC (Đang học)</option>
                      <option value="DA_TOT_NGHIEP">DA_TOT_NGHIEP (Đã tốt nghiệp)</option>
                      <option value="BAO_LUU">BAO_LUU (Bảo lưu)</option>
                      <option value="NGHI_HOC">NGHI_HOC (Nghỉ học)</option>
                    </select>
                  </div>
                </div>

                {/* Phần Reset Mật Khẩu */}
                <div className="p-3.5 rounded-xl bg-slate-950 border border-indigo-500/30 space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="block text-indigo-300 font-semibold uppercase tracking-wider text-[11px] flex items-center space-x-1.5">
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>Khôi Phục / Đặt Lại Mật Khẩu</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setEditFormData({ ...editFormData, matKhauMoi: '123456' })}
                      className="px-2 py-0.5 rounded-md bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/40 text-[10px] font-semibold transition"
                    >
                      ⚡ Reset về 123456
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Để trống nếu không đổi, hoặc nhập mật khẩu mới..."
                    value={editFormData.matKhauMoi}
                    onChange={(e) => setEditFormData({ ...editFormData, matKhauMoi: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
                  />
                  <p className="text-[10px] text-slate-400 italic">
                    * Sử dụng khi học viên quên mật khẩu và yêu cầu trung tâm cấp lại.
                  </p>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setEditingStudent(null)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                  >
                    Hủy
                  </button>
                  <button type="submit" className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold">
                    Cập Nhật & Lưu
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Xác Nhận Xóa */}
        {deletingStudent && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 border border-rose-500/30 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
              <div className="flex items-center space-x-3 text-rose-400">
                <AlertTriangle className="w-6 h-6 shrink-0" />
                <h3 className="text-base font-bold text-white">Xác Nhận Xóa Học Viên</h3>
              </div>
              <p className="text-xs text-slate-300">
                Bạn có chắc chắn muốn xóa hồ sơ học viên{' '}
                <strong className="text-white">{deletingStudent.hoTen}</strong> (Mã: {deletingStudent.maHocVien})? Thao tác này sẽ xóa toàn bộ dữ liệu tài khoản liên quan.
              </p>
              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-800">
                <button
                  onClick={() => setDeletingStudent(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Hủy
                </button>
                <button
                  onClick={handleDeleteStudent}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-lg shadow-rose-600/30"
                >
                  Đồng Ý Xóa
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Hồ Sơ Chi Tiết Học Viên */}
        {detailStudent && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl p-6 shadow-2xl space-y-5 my-8">
              {/* Header */}
              <div className="flex justify-between items-start pb-4 border-b border-slate-800">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl font-black shadow-lg shadow-indigo-500/20">
                    {detailStudent.hoTen?.charAt(0) || 'H'}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-bold text-white">{detailStudent.hoTen}</h3>
                      <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 font-mono text-xs font-bold">
                        CEFR {detailStudent.trinhDoCEFR}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Mã HV: <span className="font-mono font-bold text-indigo-400">{detailStudent.maHocVien}</span> • Username:{' '}
                      <span className="font-mono text-slate-300">{detailStudent.nguoiDung?.tenDangNhap}</span>
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setDetailStudent(null)}
                  className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Grid Thông Tin Cá Nhân & Liên Hệ */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Thông Tin Nhân Khẩu</span>
                  </span>
                  <div className="space-y-1.5 text-slate-300">
                    <p className="flex justify-between">
                      <span className="text-slate-500">Giới tính:</span>
                      <span className="font-medium text-white">{detailStudent.gioiTinh || 'Nam'}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-slate-500">Ngày sinh:</span>
                      <span className="font-medium text-white">
                        {detailStudent.ngaySinh
                          ? new Date(detailStudent.ngaySinh).toLocaleDateString('vi-VN')
                          : 'Chưa cập nhật'}
                      </span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-slate-500">Nguồn đánh giá:</span>
                      <span className="font-medium text-white">{detailStudent.nguonDanhGia || 'Placement Test'}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-slate-500">Trạng thái:</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {detailStudent.trangThai || 'DANG_HOC'}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                    <Mail className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Liên Hệ & Địa Chỉ</span>
                  </span>
                  <div className="space-y-1.5 text-slate-300">
                    <p className="flex justify-between">
                      <span className="text-slate-500">Email:</span>
                      <span className="font-medium text-white">{detailStudent.nguoiDung?.email || 'Chưa có'}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-slate-500">Số điện thoại:</span>
                      <span className="font-medium text-white">{detailStudent.nguoiDung?.soDienThoai || 'Chưa có'}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-slate-500">Địa chỉ:</span>
                      <span className="font-medium text-white truncate max-w-[150px]">{detailStudent.diaChi || 'Hà Nội'}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-slate-500">Tài khoản:</span>
                      <span className="text-emerald-400 font-semibold">Đang hoạt động</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Danh Sách Lớp & Khóa Học Đang Theo Học */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-2">
                    <BookOpen className="w-4 h-4 text-emerald-400" />
                    <span>Khóa Học & Lớp Học Tham Gia</span>
                  </h4>
                  <span className="text-[11px] text-slate-500">
                    {detailStudent.dangKyHoc?.length || 0} Lớp đã đăng ký
                  </span>
                </div>

                {detailStudent.dangKyHoc && detailStudent.dangKyHoc.length > 0 ? (
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {detailStudent.dangKyHoc.map((dk: any) => (
                      <div
                        key={dk.id || dk.lopHoc?.id}
                        className="p-3 rounded-2xl bg-slate-950 border border-slate-800/90 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center space-x-2">
                            <span className="font-mono font-bold text-emerald-400">[{dk.lopHoc?.maLopHoc}]</span>
                            <span className="font-semibold text-white">{dk.lopHoc?.tenLopHoc}</span>
                          </div>
                          {dk.lopHoc?.khoaHoc && (
                            <p className="text-[11px] text-slate-400">
                              Khóa: <span className="text-indigo-300">{dk.lopHoc?.khoaHoc?.tenKhoaHoc}</span> (Mã:{' '}
                              {dk.lopHoc?.khoaHoc?.maKhoaHoc})
                            </p>
                          )}
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {dk.trangThai || 'Đã Xác Nhận'}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center text-slate-500 text-xs italic">
                    Học viên chưa được xếp vào lớp học nào.
                  </div>
                )}
              </div>

              {/* Tình Trạng Học Phí & Hóa Đơn */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-2">
                    <CreditCard className="w-4 h-4 text-indigo-400" />
                    <span>Tình Trạng Học Phí & Hóa Đơn</span>
                  </h4>
                </div>

                {detailStudent.hoaDon && detailStudent.hoaDon.length > 0 ? (
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                    {detailStudent.hoaDon.map((inv: any) => {
                      const phaiTra = Number(inv.soTienPhaiTra || 0);
                      const daTra = Number(inv.soTienDaTra || 0);
                      const conNo = Math.max(0, phaiTra - daTra);
                      const isDone = daTra >= phaiTra;

                      return (
                        <div
                          key={inv.id}
                          className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex justify-between items-center text-xs"
                        >
                          <div>
                            <span className="font-mono font-bold text-indigo-400">{inv.maHoaDon}</span>
                            <div className="flex space-x-3 text-[11px] text-slate-400 mt-0.5">
                              <span>
                                Phải nộp:{' '}
                                <strong className="text-white">{phaiTra.toLocaleString('vi-VN')} đ</strong>
                              </span>
                              <span>
                                Đã nộp:{' '}
                                <strong className="text-emerald-400">{daTra.toLocaleString('vi-VN')} đ</strong>
                              </span>
                              {conNo > 0 && (
                                <span>
                                  Còn nợ:{' '}
                                  <strong className="text-rose-400">{conNo.toLocaleString('vi-VN')} đ</strong>
                                </span>
                              )}
                            </div>
                          </div>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                              isDone
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                            }`}
                          >
                            {isDone ? 'Đã Thanh Toán' : 'Chưa Hoàn Tất'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center text-slate-500 text-xs italic">
                    Chưa có dữ liệu hóa đơn học phí.
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex justify-end pt-3 border-t border-slate-800">
                <button
                  onClick={() => setDetailStudent(null)}
                  className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition"
                >
                  Đóng Hồ Sơ
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

