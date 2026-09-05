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
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import { useTableSort, SortIndicator } from '../../../utils/useTableSort';

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

  const {
    sortKey,
    sortOrder,
    toggleSort,
    sortedData: sortedFilteredTeachers,
  } = useTableSort(filteredTeachers, null, null, {
    maGiaoVien: (t: any) => t.maGiaoVien,
    hoTen: (t: any) => t.hoTen,
    classes: (t: any) => (t.phanCong || []).length,
    email: (t: any) => t.nguoiDung?.email || '',
    trangThai: (t: any) => t.trangThai || 'DANG_LAM_VIEC',
  });

  const totalTeachers = sortedFilteredTeachers.length;
  const totalPages = Math.max(1, Math.ceil(totalTeachers / limit));
  const displayedTeachers = sortedFilteredTeachers.slice((page - 1) * limit, page * limit);

  // Duplicate check states cho modal thêm giáo viên
  const [createDuplicateErrors, setCreateDuplicateErrors] = useState<Record<string, string>>({});
  const [fetchingNextCode, setFetchingNextCode] = useState(false);

  const handleOpenCreateModal = async () => {
    setShowCreateModal(true);
    setCreateDuplicateErrors({});
    try {
      setFetchingNextCode(true);
      const res = await usersService.getNextTeacherCode();
      setCreateFormData((prev) => ({
        ...prev,
        maGiaoVien: res.nextMaGiaoVien || '',
        tenDangNhap: res.suggestedUsername || '',
      }));
    } catch (err) {
      console.error('Không thể lấy mã giáo viên đề xuất:', err);
    } finally {
      setFetchingNextCode(false);
    }
  };

  // Debounced duplicate check khi nhập form giáo viên
  useEffect(() => {
    if (!showCreateModal) return;
    const timer = setTimeout(async () => {
      if (!createFormData.tenDangNhap && !createFormData.email && !createFormData.maGiaoVien && !createFormData.soDienThoai) {
        setCreateDuplicateErrors({});
        return;
      }

      try {
        const res = await usersService.checkTeacherDuplicate({
          tenDangNhap: createFormData.tenDangNhap || undefined,
          email: createFormData.email || undefined,
          maGiaoVien: createFormData.maGiaoVien || undefined,
          soDienThoai: createFormData.soDienThoai || undefined,
        });
        setCreateDuplicateErrors(res.errors || {});
      } catch (err) {
        console.error('Lỗi kiểm tra trùng lặp GV:', err);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [showCreateModal, createFormData.tenDangNhap, createFormData.email, createFormData.maGiaoVien, createFormData.soDienThoai]);

  const handleCreateTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.keys(createDuplicateErrors).length > 0) {
      alert('Vui lòng sửa các thông tin đang bị trùng lặp trước khi lưu!');
      return;
    }

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
      setCreateDuplicateErrors({});
      fetchTeachers();
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Có lỗi xảy ra khi tạo giáo viên.');
    }
  };

  const openEditModal = (t: any, defaultPassword?: string) => {
    setEditingTeacher(t);
    setEditFormData({
      hoTen: t.hoTen || '',
      chuyenMon: t.chuyenMon || '',
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
            <UserCheck className="w-3.5 h-3.5 shrink-0" />
            <span>Đang Làm Việc</span>
          </span>
        );
      case 'TAM_NGHI':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-[11px] font-bold whitespace-nowrap">
            <Clock className="w-3.5 h-3.5 shrink-0" />
            <span>Tạm Nghỉ</span>
          </span>
        );
      case 'DA_NGHI_VIEC':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-[11px] font-bold whitespace-nowrap">
            <UserX className="w-3.5 h-3.5 shrink-0" />
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
            onClick={handleOpenCreateModal}
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
              <table className="w-full text-left text-xs text-slate-700 table-fixed min-w-[800px] lg:min-w-0">
                <thead className="bg-slate-50 text-slate-600 uppercase text-[11px] font-bold tracking-wider border-b border-slate-200">
                  <tr>
                    <th
                      onClick={() => toggleSort('maGiaoVien')}
                      className="w-[80px] px-3 py-3 whitespace-nowrap cursor-pointer select-none hover:bg-slate-100 hover:text-teal-700 transition group"
                      title="Nhấn để sắp xếp theo Mã giáo viên"
                    >
                      <div className="flex items-center space-x-1">
                        <span>MÃ GV</span>
                        <SortIndicator sortKey="maGiaoVien" activeKey={sortKey} sortOrder={sortOrder} />
                      </div>
                    </th>
                    <th
                      onClick={() => toggleSort('hoTen')}
                      className="w-[26%] px-3 py-3 cursor-pointer select-none hover:bg-slate-100 hover:text-teal-700 transition group"
                      title="Nhấn để sắp xếp theo Họ và tên"
                    >
                      <div className="flex items-center space-x-1">
                        <span>HỌ VÀ TÊN</span>
                        <SortIndicator sortKey="hoTen" activeKey={sortKey} sortOrder={sortOrder} />
                      </div>
                    </th>
                    <th
                      onClick={() => toggleSort('classes')}
                      className="w-[26%] px-3 py-3 cursor-pointer select-none hover:bg-slate-100 hover:text-teal-700 transition group"
                      title="Nhấn để sắp xếp theo Số lớp phụ trách"
                    >
                      <div className="flex items-center space-x-1">
                        <span>LỚP ĐANG PHỤ TRÁCH</span>
                        <SortIndicator sortKey="classes" activeKey={sortKey} sortOrder={sortOrder} />
                      </div>
                    </th>
                    <th
                      onClick={() => toggleSort('email')}
                      className="w-[22%] px-3 py-3 cursor-pointer select-none hover:bg-slate-100 hover:text-teal-700 transition group"
                      title="Nhấn để sắp xếp theo Email"
                    >
                      <div className="flex items-center space-x-1">
                        <span>EMAIL & SĐT</span>
                        <SortIndicator sortKey="email" activeKey={sortKey} sortOrder={sortOrder} />
                      </div>
                    </th>
                    <th
                      onClick={() => toggleSort('trangThai')}
                      className="w-[145px] px-2 py-3 whitespace-nowrap text-center cursor-pointer select-none hover:bg-slate-100 hover:text-teal-700 transition group"
                      title="Nhấn để sắp xếp theo Trạng thái công tác"
                    >
                      <div className="flex items-center justify-center space-x-1">
                        <span>TRẠNG THÁI</span>
                        <SortIndicator sortKey="trangThai" activeKey={sortKey} sortOrder={sortOrder} />
                      </div>
                    </th>
                    <th className="w-[120px] px-3 py-3 whitespace-nowrap text-right">THAO TÁC</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {displayedTeachers.map((t: any) => {
                    const classes = t.phanCong || [];

                    return (
                      <tr key={t.id} className="hover:bg-teal-50/30 transition">
                        <td className="px-3.5 py-3 whitespace-nowrap align-middle">
                          <span className="font-mono font-bold text-teal-700 text-xs block">{t.maGiaoVien}</span>
                          <span className="font-mono text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 inline-block mt-0.5">
                            {t.nguoiDung?.tenDangNhap || t.maGiaoVien.toLowerCase()}
                          </span>
                        </td>

                        <td className="px-3.5 py-3 align-middle min-w-0">
                          <div className="flex items-center space-x-2.5 min-w-0">
                            <div className="w-7 h-7 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center font-bold text-teal-700 text-xs shrink-0">
                              {t.hoTen?.split(' ').slice(-1)[0][0] || 'G'}
                            </div>
                            <div className="min-w-0 flex-1">
                              <button
                                onClick={() => setDetailTeacher(t)}
                                className="font-bold text-slate-900 hover:text-teal-600 text-left transition block truncate w-full cursor-pointer"
                                title={`Bấm để xem hồ sơ: ${t.hoTen}`}
                              >
                                {t.hoTen}
                              </button>
                              <p className="text-[11px] text-teal-700 truncate font-medium mt-0.5" title={t.chuyenMon}>
                                {t.chuyenMon || 'Giảng viên'}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-3.5 py-3 align-middle min-w-0">
                          {classes.length > 0 ? (
                            <div className="space-y-1">
                              {classes.slice(0, 2).map((pc: any) => (
                                <div key={pc.id || pc.lopHoc?.id} className="flex items-center space-x-1.5 min-w-0">
                                  <span className="font-mono font-bold text-teal-700 text-[10px] bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200 shrink-0">
                                    {pc.lopHoc?.maLopHoc}
                                  </span>
                                  <span className="text-slate-800 text-xs font-semibold truncate block" title={pc.lopHoc?.tenLopHoc}>
                                    {pc.lopHoc?.tenLopHoc}
                                  </span>
                                </div>
                              ))}
                              {classes.length > 2 && (
                                <button
                                  onClick={() => setDetailTeacher(t)}
                                  className="text-[10px] font-bold text-teal-700 hover:underline bg-teal-50/60 px-1.5 py-0.5 rounded border border-teal-200 inline-block cursor-pointer"
                                >
                                  +{classes.length - 2} lớp khác (xem tất cả)
                                </button>
                              )}
                            </div>
                          ) : (
                            <span className="inline-block text-slate-400 italic text-[11px] bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                              Chưa phân công
                            </span>
                          )}
                        </td>

                        <td className="px-3.5 py-3 align-middle min-w-0">
                          <p className="text-slate-800 font-medium truncate block text-xs" title={t.nguoiDung?.email}>
                            {t.nguoiDung?.email || 'Chưa có email'}
                          </p>
                          <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                            {t.nguoiDung?.soDienThoai || 'Chưa cập nhật'}
                          </p>
                        </td>

                        <td className="px-2 py-3 align-middle whitespace-nowrap text-center">
                          {getStatusBadge(t.trangThai || 'DANG_LAM_VIEC')}
                        </td>

                        <td className="px-3 py-3 align-middle text-right whitespace-nowrap">
                          <div className="flex items-center justify-end space-x-1.5">
                            <button
                              onClick={() => setDetailTeacher(t)}
                              title="Xem hồ sơ chi tiết & bằng cấp"
                              className="p-1.5 rounded-lg bg-teal-50 hover:bg-teal-600 text-teal-700 hover:text-white border border-teal-200 hover:border-teal-600 transition cursor-pointer shrink-0"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => openEditModal(t, '123456')}
                              title="Reset mật khẩu về 123456"
                              className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-600 text-amber-700 hover:text-white border border-amber-200 hover:border-amber-600 transition cursor-pointer shrink-0"
                            >
                              <KeyRound className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => openEditModal(t)}
                              title="Sửa thông tin & Trạng thái"
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition cursor-pointer shrink-0"
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
            <div className="px-4 sm:px-5 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-slate-600">
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
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((p) => {
                      if (totalPages <= 5) return true;
                      if (p === 1 || p === totalPages) return true;
                      return Math.abs(p - page) <= 1;
                    })
                    .map((p, idx, arr) => (
                      <React.Fragment key={p}>
                        {idx > 0 && arr[idx - 1] !== p - 1 && (
                          <span className="px-1 text-slate-400 text-[11px]">...</span>
                        )}
                        <button
                          key={p}
                          onClick={() => setPage(p)}
                          className={`min-w-[28px] h-7 px-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                            page === p
                              ? 'bg-teal-600 text-white shadow-sm'
                              : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
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

              {/* Grid Thông Tin Chuyên Môn & Liên Hệ */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                {/* Thông tin chuyên môn & Học vị */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                  <span className="text-[11px] font-bold text-teal-700 uppercase tracking-wider flex items-center space-x-1.5">
                    <Award className="w-4 h-4 text-teal-600" />
                    <span>Hồ Sơ Chuyên Môn & Học Vị</span>
                  </span>

                  <div className="space-y-2.5 text-slate-600">
                    <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                      <span className="text-slate-500">Mã giảng viên:</span>
                      <strong className="font-mono font-bold text-teal-700">{detailTeacher.maGiaoVien}</strong>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                      <span className="text-slate-500">Chuyên môn:</span>
                      <strong className="font-bold text-slate-800">{detailTeacher.chuyenMon || 'Tiếng Anh Tổng Quát'}</strong>
                    </div>
                    <div className="flex justify-between items-start py-1">
                      <span className="text-slate-500 shrink-0 mr-2">Bằng cấp:</span>
                      <span className="font-semibold text-slate-800 text-right">
                        {detailTeacher.bangCap || 'Cử nhân Sư phạm Tiếng Anh'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Thông tin liên hệ & Trạng thái */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                  <span className="text-[11px] font-bold text-teal-700 uppercase tracking-wider flex items-center space-x-1.5">
                    <Mail className="w-4 h-4 text-teal-600" />
                    <span>Thông Tin Liên Hệ & Trạng Thái</span>
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
                      <span className="text-slate-500">Trạng thái:</span>
                      {getStatusBadge(detailTeacher.trangThai || 'DANG_LAM_VIEC')}
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
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50 animate-fadeIn">
            <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg p-4 sm:p-6 shadow-2xl space-y-4 text-slate-800 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900">Thêm Giáo Viên / Giảng Viên Mới</h3>
                <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-700 p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateTeacher} className="space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-slate-700 font-bold">Mã Giáo Viên (Tự cấp)</label>
                      <button
                        type="button"
                        onClick={handleOpenCreateModal}
                        disabled={fetchingNextCode}
                        className="text-[10px] text-teal-600 hover:text-teal-700 flex items-center space-x-1 cursor-pointer"
                        title="Cấp mã mới"
                      >
                        <RefreshCw className={`w-3 h-3 ${fetchingNextCode ? 'animate-spin' : ''}`} />
                        <span>Cấp mới</span>
                      </button>
                    </div>
                    <input
                      type="text"
                      required
                      value={createFormData.maGiaoVien}
                      onChange={(e) => setCreateFormData({ ...createFormData, maGiaoVien: e.target.value.toUpperCase() })}
                      className={`w-full bg-slate-50 border rounded-xl px-3 py-2 text-slate-900 focus:outline-none font-mono ${
                        createDuplicateErrors.maGiaoVien
                          ? 'border-rose-400 bg-rose-50/40 focus:border-rose-500'
                          : 'border-slate-200 focus:border-teal-500'
                      }`}
                      placeholder="VD: GV011"
                    />
                    {createDuplicateErrors.maGiaoVien && (
                      <p className="text-[10px] text-rose-600 mt-1 flex items-center space-x-1">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span>{createDuplicateErrors.maGiaoVien}</span>
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Họ Và Tên</label>
                    <input
                      type="text"
                      required
                      value={createFormData.hoTen}
                      onChange={(e) => setCreateFormData({ ...createFormData, hoTen: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-teal-500"
                      placeholder="VD: Cô Nguyễn Thị Lan"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Tên Đăng Nhập</label>
                    <input
                      type="text"
                      required
                      value={createFormData.tenDangNhap}
                      onChange={(e) => setCreateFormData({ ...createFormData, tenDangNhap: e.target.value.toLowerCase() })}
                      className={`w-full bg-slate-50 border rounded-xl px-3 py-2 text-slate-900 focus:outline-none ${
                        createDuplicateErrors.tenDangNhap
                          ? 'border-rose-400 bg-rose-50/40 focus:border-rose-500'
                          : 'border-slate-200 focus:border-teal-500'
                      }`}
                      placeholder="VD: teacher11"
                    />
                    {createDuplicateErrors.tenDangNhap && (
                      <p className="text-[10px] text-rose-600 mt-1 flex items-center space-x-1">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span>{createDuplicateErrors.tenDangNhap}</span>
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Mật Khẩu Khởi Tạo</label>
                    <input
                      type="password"
                      required
                      value={createFormData.matKhau}
                      onChange={(e) => setCreateFormData({ ...createFormData, matKhau: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-teal-500"
                      placeholder="Mặc định: 123456"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Email (Duy nhất)</label>
                    <input
                      type="email"
                      required
                      value={createFormData.email}
                      onChange={(e) => setCreateFormData({ ...createFormData, email: e.target.value })}
                      className={`w-full bg-slate-50 border rounded-xl px-3 py-2 text-slate-900 focus:outline-none ${
                        createDuplicateErrors.email
                          ? 'border-rose-400 bg-rose-50/40 focus:border-rose-500'
                          : 'border-slate-200 focus:border-teal-500'
                      }`}
                      placeholder="VD: teacher11@etc-english.vn"
                    />
                    {createDuplicateErrors.email && (
                      <p className="text-[10px] text-rose-600 mt-1 flex items-center space-x-1">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span>{createDuplicateErrors.email}</span>
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Số Điện Thoại</label>
                    <input
                      type="text"
                      value={createFormData.soDienThoai}
                      onChange={(e) => setCreateFormData({ ...createFormData, soDienThoai: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-teal-500"
                      placeholder="VD: 0902222011"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition cursor-pointer"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={Object.keys(createDuplicateErrors).length > 0}
                    className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold transition shadow-sm cursor-pointer disabled:opacity-50"
                  >
                    {Object.keys(createDuplicateErrors).length > 0 ? 'Dữ liệu bị trùng lặp' : 'Lưu Giáo Viên'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Sửa Giáo Viên & Đổi Trạng Thái */}
        {editingTeacher && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50 animate-fadeIn">
            <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg p-4 sm:p-6 shadow-2xl space-y-4 text-slate-800 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900">
                  Cập Nhật Giáo Viên: <span className="text-teal-700 font-mono">{editingTeacher.maGiaoVien}</span>
                </h3>
                <button onClick={() => setEditingTeacher(null)} className="text-slate-400 hover:text-slate-700 p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUpdateTeacher} className="space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
