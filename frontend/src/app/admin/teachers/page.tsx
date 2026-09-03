'use client';

import React, { useEffect, useState } from 'react';
import { AppLayout } from '../../../components/AppLayout';
import { usersService } from '../../../services/api';
import { GiaoVien } from '../../../types';
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
  Award,
  GraduationCap,
  BookOpen,
  Mail,
  Phone,
  UserCheck,
  Clock,
  UserX,
  User,
} from 'lucide-react';

export default function AdminTeachersPage() {
  const [teachers, setTeachers] = useState<GiaoVien[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  // Pagination
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<any | null>(null);
  const [detailTeacher, setDetailTeacher] = useState<any | null>(null);
  const [deletingTeacher, setDeletingTeacher] = useState<any | null>(null);

  const [createFormData, setCreateFormData] = useState({
    tenDangNhap: '',
    matKhau: '123456',
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
      setLoading(true);
      const list = await usersService.getTeachers();
      setTeachers(list || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  // Filtered & Paginated list
  const filteredTeachers = teachers.filter((t: any) => {
    const q = search.toLowerCase();
    const matchQuery =
      t.hoTen.toLowerCase().includes(q) ||
      t.maGiaoVien.toLowerCase().includes(q) ||
      (t.chuyenMon && t.chuyenMon.toLowerCase().includes(q)) ||
      (t.nguoiDung?.email && t.nguoiDung.email.toLowerCase().includes(q)) ||
      (t.nguoiDung?.tenDangNhap && t.nguoiDung.tenDangNhap.toLowerCase().includes(q));

    const matchStatus = !statusFilter || (t.trangThai || 'DANG_LAM_VIEC') === statusFilter;

    return matchQuery && matchStatus;
  });

  const totalTeachers = filteredTeachers.length;
  const totalPages = Math.max(1, Math.ceil(totalTeachers / limit));
  const displayedTeachers = filteredTeachers.slice((page - 1) * limit, page * limit);

  const handleCreateTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await usersService.createTeacher(createFormData);
      setMessage('Thêm giáo viên mới thành công!');
      setShowCreateModal(false);
      setCreateFormData({
        tenDangNhap: '',
        matKhau: '123456',
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
      alert(err.response?.data?.message || 'Có lỗi xảy ra khi tạo giáo viên.');
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
      setMessage(
        editFormData.matKhauMoi
          ? `Cập nhật thông tin và ĐÃ RESET MẬT KHẨU về "${editFormData.matKhauMoi}" thành công!`
          : 'Cập nhật thông tin và trạng thái giáo viên thành công!'
      );
      setEditingTeacher(null);
      fetchTeachers();
      setTimeout(() => setMessage(null), 4000);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật giáo viên.');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'DANG_LAM_VIEC':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold whitespace-nowrap">
            <UserCheck className="w-3 h-3" />
            <span>Đang Làm Việc</span>
          </span>
        );
      case 'TAM_NGHI':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-[11px] font-bold whitespace-nowrap">
            <Clock className="w-3 h-3" />
            <span>Tạm Nghỉ</span>
          </span>
        );
      case 'DA_NGHI_VIEC':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-[11px] font-bold whitespace-nowrap">
            <UserX className="w-3 h-3" />
            <span>Đã Nghỉ Việc</span>
          </span>
        );
      default:
        return (
          <span className="inline-block px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px] font-bold whitespace-nowrap">
            {status}
          </span>
        );
    }
  };

  return (
    <AppLayout
      allowedRoles={['QUAN_LY']}
      title="Đội Ngũ Giáo Viên & Giảng Viên"
      subtitle="Quản lý chi tiết hồ sơ giáo viên, chuyên môn giảng dạy, lớp phụ trách và điều chỉnh trạng thái công tác"
    >
      <div className="space-y-6">
        {/* Filters and Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm">
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm họ tên, mã GV, chuyên môn..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 pl-9 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-500"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-teal-500"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="DANG_LAM_VIEC">Đang làm việc</option>
              <option value="TAM_NGHI">Tạm nghỉ</option>
              <option value="DA_NGHI_VIEC">Đã nghỉ việc</option>
            </select>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 hover:opacity-95 text-white text-xs font-bold shadow-md shadow-teal-600/20 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Giáo Viên Mới</span>
          </button>
        </div>

        {message && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2 shadow-sm">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        {/* Table */}
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
                    <th className="px-5 py-3.5 whitespace-nowrap">Mã GV</th>
                    <th className="px-5 py-3.5 whitespace-nowrap">Họ Và Tên</th>
                    <th className="px-5 py-3.5 min-w-[200px]">Lớp Đang Phụ Trách</th>
                    <th className="px-5 py-3.5 whitespace-nowrap">Email & SĐT</th>
                    <th className="px-5 py-3.5 whitespace-nowrap text-center">Trạng Thái</th>
                    <th className="px-5 py-3.5 whitespace-nowrap text-right">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {displayedTeachers.map((t: any) => {
                    const classes = t.phanCong || [];

                    return (
                      <tr key={t.id} className="hover:bg-teal-50/30 transition">
                        <td className="px-5 py-4 whitespace-nowrap">
                          <span className="font-mono font-bold text-teal-700 block">{t.maGiaoVien}</span>
                          <span className="font-mono text-[11px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 inline-block mt-0.5">
                            {t.nguoiDung?.tenDangNhap || t.maGiaoVien.toLowerCase()}
                          </span>
                        </td>

                        <td className="px-5 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center font-bold text-teal-700 text-xs shrink-0">
                              {t.hoTen?.split(' ').slice(-1)[0][0] || 'G'}
                            </div>
                            <div>
                              <button
                                onClick={() => setDetailTeacher(t)}
                                className="font-bold text-slate-900 hover:text-teal-600 text-left transition block whitespace-nowrap cursor-pointer"
                                title="Bấm để xem hồ sơ chuyên môn & chứng chỉ"
                              >
                                <span>{t.hoTen}</span>
                              </button>
                              <span className="text-[11px] text-slate-500 block mt-0.5">
                                Giảng viên
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4 min-w-[200px]">
                          {classes.length > 0 ? (
                            <div className="space-y-1">
                              {classes.map((pc: any) => (
                                <div key={pc.id || pc.lopHoc?.id} className="flex flex-col">
                                  <span className="font-mono font-bold text-teal-700 text-xs block whitespace-nowrap">
                                    [{pc.lopHoc?.maLopHoc}]
                                  </span>
                                  <span className="text-slate-800 text-xs font-semibold block" title={pc.lopHoc?.tenLopHoc}>
                                    {pc.lopHoc?.tenLopHoc}
                                  </span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="inline-block whitespace-nowrap text-slate-400 italic text-[11px] bg-slate-50 px-2.5 py-1 rounded border border-slate-200">
                              Chưa phân công
                            </span>
                          )}
                        </td>

                        <td className="px-5 py-4 whitespace-nowrap">
                          <p className="text-slate-800 font-medium">{t.nguoiDung?.email}</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">{t.nguoiDung?.soDienThoai || 'Chưa cập nhật'}</p>
                        </td>

                        <td className="px-5 py-4 whitespace-nowrap text-center">
                          {getStatusBadge(t.trangThai || 'DANG_LAM_VIEC')}
                        </td>

                        <td className="px-5 py-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end space-x-1.5">
                            <button
                              onClick={() => setDetailTeacher(t)}
                              title="Xem hồ sơ chi tiết & bằng cấp"
                              className="p-1.5 rounded-lg bg-teal-50 hover:bg-teal-600 text-teal-700 hover:text-white border border-teal-200 hover:border-teal-600 transition cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => openEditModal(t, '123456')}
                              title="Reset mật khẩu về 123456"
                              className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-600 text-amber-700 hover:text-white border border-amber-200 hover:border-amber-600 transition cursor-pointer"
                            >
                              <KeyRound className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => openEditModal(t)}
                              title="Sửa thông tin & Trạng thái"
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
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
            <div className="px-5 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-600">
                <span>Hiển thị</span>
                <span className="font-bold text-slate-900">
                  {totalTeachers > 0 ? (page - 1) * limit + 1 : 0} - {Math.min(page * limit, totalTeachers)}
                </span>
                <span>trên tổng số</span>
                <span className="font-bold text-teal-700">{totalTeachers}</span>
                <span>giáo viên</span>

                <span className="text-slate-300">|</span>

                <div className="flex items-center gap-1.5">
                  <span className="text-slate-600">Số dòng:</span>
                  <select
                    value={limit}
                    onChange={(e) => {
                      setLimit(Number(e.target.value));
                      setPage(1);
                    }}
                    className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-800 focus:outline-none focus:border-teal-500 cursor-pointer"
                  >
                    <option value={10}>10 / trang</option>
                    <option value={20}>20 / trang</option>
                    <option value={50}>50 / trang</option>
                  </select>
                </div>
              </div>

              {totalPages > 1 && (
                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={() => setPage(1)}
                    disabled={page === 1}
                    title="Trang đầu"
                    className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                  >
                    <ChevronsLeft className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    title="Trang trước"
                    className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <div className="flex items-center space-x-1 px-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`min-w-[28px] h-7 px-2 rounded-lg text-xs font-bold transition cursor-pointer ${page === p
                          ? 'bg-teal-600 text-white shadow-sm'
                          : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                          }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                    title="Trang kế tiếp"
                    className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setPage(totalPages)}
                    disabled={page >= totalPages}
                    title="Trang cuối"
                    className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                  >
                    <ChevronsRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modal Hồ Sơ Chi Tiết Giáo Viên */}
        {detailTeacher && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto animate-fadeIn">
            <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-2xl p-6 shadow-2xl space-y-5 my-8 text-slate-800">
              {/* Header */}
              <div className="flex justify-between items-start pb-4 border-b border-slate-100">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-600 to-cyan-500 flex items-center justify-center text-white text-xl font-black shadow-md shadow-teal-500/20">
                    {detailTeacher.hoTen?.charAt(0) || 'G'}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-bold text-slate-900">{detailTeacher.hoTen}</h3>
                      {getStatusBadge(detailTeacher.trangThai || 'DANG_LAM_VIEC')}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Mã GV: <span className="font-mono font-bold text-teal-700">{detailTeacher.maGiaoVien}</span> • Tài khoản:{' '}
                      <span className="font-mono text-slate-700 font-semibold">@{detailTeacher.nguoiDung?.tenDangNhap}</span>
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setDetailTeacher(null)}
                  className="p-1.5 rounded-xl bg-slate-100 text-slate-400 hover:text-slate-700 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Grid Thông Tin Chuyên Môn, Bằng Cấp & Liên Hệ */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                {/* Chuyên môn & Chứng chỉ */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                  <span className="text-[11px] font-bold text-teal-700 uppercase tracking-wider flex items-center space-x-1.5">
                    <Award className="w-4 h-4 text-teal-600" />
                    <span>Hồ Sơ Năng Lực & Bằng Cấp</span>
                  </span>

                  <div className="space-y-2">
                    <div>
                      <span className="text-slate-500 text-[11px] block">Chuyên môn giảng dạy:</span>
                      <span className="inline-block mt-1 px-2.5 py-1 rounded-md bg-teal-50 border border-teal-200 text-teal-800 font-bold text-xs">
                        {detailTeacher.chuyenMon}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-500 text-[11px] block">Bằng cấp & Chứng chỉ quốc tế:</span>
                      <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 mt-1 font-semibold leading-relaxed shadow-sm">
                        🎓 {detailTeacher.bangCap || 'Cử nhân Sư phạm Tiếng Anh'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Thông tin liên hệ & Vị trí */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                  <span className="text-[11px] font-bold text-teal-700 uppercase tracking-wider flex items-center space-x-1.5">
                    <Mail className="w-4 h-4 text-teal-600" />
                    <span>Thông Tin Liên Hệ & Phân Quyền</span>
                  </span>

                  <div className="space-y-2.5 text-slate-600">
                    <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                      <span className="text-slate-500">Email công vụ:</span>
                      <span className="font-bold text-slate-800">{detailTeacher.nguoiDung?.email || 'Chưa cập nhật'}</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                      <span className="text-slate-500">Số điện thoại:</span>
                      <span className="font-bold text-slate-800">{detailTeacher.nguoiDung?.soDienThoai || 'Chưa cập nhật'}</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-slate-500">Vị trí công tác:</span>
                      <span className="text-teal-700 font-bold">Giảng viên</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Danh Sách Lớp Đang Giảng Dạy */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center space-x-2">
                    <BookOpen className="w-4 h-4 text-teal-600" />
                    <span>Lớp Học Đang Phụ Trách Giảng Dạy</span>
                  </h4>
                  <span className="text-[11px] text-slate-500 font-semibold">
                    {detailTeacher.phanCong?.length || 0} Lớp đang phụ trách
                  </span>
                </div>

                {detailTeacher.phanCong && detailTeacher.phanCong.length > 0 ? (
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {detailTeacher.phanCong.map((pc: any) => (
                      <div
                        key={pc.id || pc.lopHoc?.id}
                        className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex justify-between items-center text-xs hover:border-teal-300 transition"
                      >
                        <div className="flex items-center space-x-2">
                          <span className="font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                            [{pc.lopHoc?.maLopHoc}]
                          </span>
                          <span className="font-bold text-slate-900">{pc.lopHoc?.tenLopHoc}</span>
                        </div>
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200">
                          Đang Phụ Trách
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center text-slate-400 text-xs italic">
                    Giảng viên hiện đang ở trạng thái sẵn sàng (chưa phân công lớp nào).
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex justify-end pt-3 border-t border-slate-100">
                <button
                  onClick={() => setDetailTeacher(null)}
                  className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
                >
                  Đóng Hồ Sơ
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Thêm Giáo Viên */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
            <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4 text-slate-800">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900">Thêm Giáo Viên / Giảng Viên Mới</h3>
                <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-700 p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateTeacher} className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Mã Giáo Viên (VD: GV004)</label>
                    <input
                      type="text"
                      required
                      value={createFormData.maGiaoVien}
                      onChange={(e) => setCreateFormData({ ...createFormData, maGiaoVien: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Họ Và Tên</label>
                    <input
                      type="text"
                      required
                      value={createFormData.hoTen}
                      onChange={(e) => setCreateFormData({ ...createFormData, hoTen: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-teal-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Tên Đăng Nhập</label>
                    <input
                      type="text"
                      required
                      value={createFormData.tenDangNhap}
                      onChange={(e) => setCreateFormData({ ...createFormData, tenDangNhap: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Mật Khẩu Khởi Tạo</label>
                    <input
                      type="password"
                      required
                      value={createFormData.matKhau}
                      onChange={(e) => setCreateFormData({ ...createFormData, matKhau: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-teal-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Email</label>
                    <input
                      type="email"
                      required
                      value={createFormData.email}
                      onChange={(e) => setCreateFormData({ ...createFormData, email: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Số Điện Thoại</label>
                    <input
                      type="text"
                      value={createFormData.soDienThoai}
                      onChange={(e) => setCreateFormData({ ...createFormData, soDienThoai: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-teal-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Chuyên Môn Giảng Dạy</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: IELTS Academic, TOEIC 4 Kỹ Năng, Giao Tiếp..."
                    value={createFormData.chuyenMon}
                    onChange={(e) => setCreateFormData({ ...createFormData, chuyenMon: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Bằng Cấp / Chứng Chỉ</label>
                  <input
                    type="text"
                    placeholder="VD: Thạc sĩ Ngôn ngữ Anh, IELTS 8.5, Chứng chỉ CELTA..."
                    value={createFormData.bangCap}
                    onChange={(e) => setCreateFormData({ ...createFormData, bangCap: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition cursor-pointer"
                  >
                    Hủy
                  </button>
                  <button type="submit" className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold transition shadow-sm cursor-pointer">
                    Lưu Giáo Viên
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Sửa Giáo Viên & Đổi Trạng Thái */}
        {editingTeacher && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
            <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4 text-slate-800">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900">
                  Cập Nhật Giáo Viên: <span className="text-teal-700 font-mono">{editingTeacher.maGiaoVien}</span>
                </h3>
                <button onClick={() => setEditingTeacher(null)} className="text-slate-400 hover:text-slate-700 p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUpdateTeacher} className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Họ Và Tên</label>
                    <input
                      type="text"
                      required
                      value={editFormData.hoTen}
                      onChange={(e) => setEditFormData({ ...editFormData, hoTen: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Số Điện Thoại</label>
                    <input
                      type="text"
                      value={editFormData.soDienThoai}
                      onChange={(e) => setEditFormData({ ...editFormData, soDienThoai: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-teal-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Chuyên Môn</label>
                  <input
                    type="text"
                    required
                    value={editFormData.chuyenMon}
                    onChange={(e) => setEditFormData({ ...editFormData, chuyenMon: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Bằng Cấp</label>
                  <input
                    type="text"
                    value={editFormData.bangCap}
                    onChange={(e) => setEditFormData({ ...editFormData, bangCap: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div className="p-3.5 rounded-xl bg-teal-50/60 border border-teal-200 space-y-1.5">
                  <label className="block text-teal-800 font-bold uppercase tracking-wider text-[11px]">
                    Trạng Thái Công Tác (Quy Chế Nghiệp Vụ)
                  </label>
                  <select
                    value={editFormData.trangThai}
                    onChange={(e) => setEditFormData({ ...editFormData, trangThai: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 font-bold focus:outline-none focus:border-teal-500"
                  >
                    <option value="DANG_LAM_VIEC">🟢 Đang Làm Việc (Có thể phân công dạy)</option>
                    <option value="TAM_NGHI">🟡 Tạm Nghỉ (Nghỉ phép / dưỡng bệnh)</option>
                    <option value="DA_NGHI_VIEC">🔴 Đã Nghỉ Việc (Khóa phân công & bảo lưu lịch sử)</option>
                  </select>
                  <p className="text-[11px] text-slate-500 italic">
                    * Khi chọn "Đã nghỉ việc", hệ thống sẽ giữ nguyên lịch sử điểm danh các lớp cũ và chặn phân công lớp mới.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200 space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="block text-amber-800 font-bold text-[11px] uppercase tracking-wider flex items-center space-x-1">
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>Khôi Phục / Đặt Lại Mật Khẩu (Admin)</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setEditFormData({ ...editFormData, matKhauMoi: '123456' })}
                      className="px-2 py-0.5 rounded bg-amber-600 hover:bg-amber-700 text-white text-[10px] font-bold transition cursor-pointer"
                    >
                      ⚡ Reset về 123456
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Để trống nếu không muốn đổi mật khẩu..."
                    value={editFormData.matKhauMoi}
                    onChange={(e) => setEditFormData({ ...editFormData, matKhauMoi: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono focus:outline-none focus:border-teal-500 text-xs"
                  />
                  <p className="text-[10px] text-slate-500">
                    * Mật khẩu mới sẽ được mã hóa an toàn với Argon2 khi bạn bấm "Lưu Thay Đổi".
                  </p>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setEditingTeacher(null)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition cursor-pointer"
                  >
                    Hủy
                  </button>
                  <button type="submit" className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold transition shadow-sm cursor-pointer">
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
