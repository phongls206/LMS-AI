'use client';

import React, { useEffect, useState, useMemo, useRef } from 'react';
import { AppLayout } from '../../../components/AppLayout';
import { enrollmentsService, authService } from '../../../services/api';
import { HoaDon } from '../../../types';
import {
  Receipt,
  DollarSign,
  CheckCircle2,
  Search,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Loader2,
  RotateCcw,
  AlertCircle,
  CreditCard,
  Clock,
  Check,
  AlertTriangle,
} from 'lucide-react';

export default function StudentFeesPage() {
  const [invoices, setInvoices] = useState<HoaDon[]>([]);
  const [studentId, setStudentId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // Search, Filter & Pagination states
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'CHUA_THANH_TOAN' | 'THANH_TOAN_MOT_PHAN' | 'DA_HOAN_THANH' | 'DA_HUY'>('ALL');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(4);
  const [searchingBE, setSearchingBE] = useState(false);
  const searchDebounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const fetchInvoices = async () => {
    try {
      const me = await authService.getMe();
      if (me?.hoSoHocVien?.id) {
        const id = Number(me.hoSoHocVien.id);
        setStudentId(id);
        const list = await enrollmentsService.getInvoices(undefined, id);
        setInvoices(list || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  // Lọc chuẩn FE & BE: Debounce 300ms gọi API BE khi tìm kiếm hoặc lọc trạng thái
  useEffect(() => {
    if (!studentId) return;
    setPage(1);
    if (searchDebounceTimerRef.current) clearTimeout(searchDebounceTimerRef.current);
    searchDebounceTimerRef.current = setTimeout(async () => {
      try {
        setSearchingBE(true);
        const list = await enrollmentsService.getInvoices(
          statusFilter !== 'ALL' ? statusFilter : undefined,
          studentId,
          search.trim() || undefined,
        );
        if (Array.isArray(list)) {
          setInvoices((prev) => {
            const map = new Map<number, HoaDon>();
            prev.forEach((inv) => map.set(Number(inv.id), inv));
            list.forEach((inv: HoaDon) => map.set(Number(inv.id), inv));
            return Array.from(map.values());
          });
        }
      } catch (e) {
        console.error(e);
      } finally {
        setSearchingBE(false);
      }
    }, 300);
  }, [search, statusFilter, studentId]);

  // Thống kê tài chính tổng quan
  const stats = useMemo(() => {
    let totalPayable = 0;
    let totalPaid = 0;
    let totalDebt = 0;
    invoices.forEach((inv) => {
      if (inv.trangThai !== 'DA_HUY') {
        const payable = Number(inv.soTienPhaiTra || 0);
        const paid = Number(inv.soTienDaTra || 0);
        totalPayable += payable;
        totalPaid += paid;
        totalDebt += Math.max(0, payable - paid);
      }
    });
    return { totalPayable, totalPaid, totalDebt };
  }, [invoices]);

  // Lọc danh sách hóa đơn tức thời tại FE (0ms)
  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      if (statusFilter !== 'ALL' && inv.trangThai !== statusFilter) {
        return false;
      }
      const q = search.toLowerCase().trim();
      if (q) {
        const matchCode = inv.maHoaDon?.toLowerCase().includes(q);
        const matchClass = inv.dangKyHoc?.lopHoc?.tenLopHoc?.toLowerCase().includes(q);
        const matchClassCode = inv.dangKyHoc?.lopHoc?.maLopHoc?.toLowerCase().includes(q);
        if (!matchCode && !matchClass && !matchClassCode) return false;
      }
      return true;
    });
  }, [invoices, search, statusFilter]);

  // Phân trang
  const totalItems = filteredInvoices.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / (limit === 9999 ? totalItems || 1 : limit)));
  const displayedInvoices = useMemo(() => {
    if (limit >= 9999) return filteredInvoices;
    return filteredInvoices.slice((page - 1) * limit, page * limit);
  }, [filteredInvoices, page, limit]);

  const startIndex = totalItems === 0 ? 0 : (page - 1) * limit + 1;
  const endIndex = limit >= 9999 ? totalItems : Math.min(page * limit, totalItems);

  return (
    <AppLayout
      allowedRoles={['HOC_VIEN']}
      title="Học Phí & Hóa Đơn Cá Nhân"
      subtitle="Theo dõi chi tiết công nợ học phí và lịch sử phiếu thu thanh toán"
    >
      <div className="space-y-6">
        {/* Financial Summary Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#111928] border border-slate-200/90 dark:border-[#1e2d45] shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Tổng Học Phí Phải Đóng</span>
              <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800/80 flex items-center justify-center text-teal-600 dark:text-teal-400">
                <Receipt className="w-4 h-4" />
              </div>
            </div>
            <p className="text-xl font-bold font-mono text-slate-900 dark:text-white">
              {stats.totalPayable.toLocaleString('vi-VN')} đ
            </p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
              Tính trên {invoices.filter((i) => i.trangThai !== 'DA_HUY').length} hóa đơn hợp lệ
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#111928] border border-slate-200/90 dark:border-[#1e2d45] shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Đã Hoàn Thành Thanh Toán</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <p className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
              {stats.totalPaid.toLocaleString('vi-VN')} đ
            </p>
            <p className="text-[11px] text-emerald-600/80 dark:text-emerald-400/80 mt-1">
              Đã ghi nhận qua hệ thống thu ngân
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#111928] border border-slate-200/90 dark:border-[#1e2d45] shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Còn Nợ Học Phí Hiện Tại</span>
              <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800/80 flex items-center justify-center text-rose-600 dark:text-rose-400">
                <CreditCard className="w-4 h-4" />
              </div>
            </div>
            <p className={`text-xl font-bold font-mono ${stats.totalDebt > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-800 dark:text-slate-200'}`}>
              {stats.totalDebt.toLocaleString('vi-VN')} đ
            </p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
              {stats.totalDebt > 0 ? 'Vui lòng hoàn thành trước hạn nộp' : 'Không có công nợ tồn đọng'}
            </p>
          </div>
        </div>

        {/* Toolbar: Search & Filter */}
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 bg-white dark:bg-[#111928] p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 dark:border-[#1e2d45] shadow-xs">
          <div className="relative flex-1 sm:max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo mã hóa đơn, tên lớp học..."
              className="w-full h-10 bg-slate-50 dark:bg-[#162032] border border-slate-200 dark:border-[#22324e] rounded-xl px-3.5 pl-9 pr-8 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-teal-500 transition-colors"
            />
            {searchingBE && (
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-teal-600" />
              </div>
            )}
            {search && !searchingBE && (
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  setPage(1);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 cursor-pointer"
                title="Xóa tìm kiếm"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as any);
                setPage(1);
              }}
              className="h-10 w-full sm:w-auto bg-slate-50 dark:bg-[#162032] border border-slate-200 dark:border-[#22324e] rounded-xl px-3 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-teal-500 font-medium cursor-pointer transition-colors"
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="CHUA_THANH_TOAN">Chưa thanh toán</option>
              <option value="THANH_TOAN_MOT_PHAN">Thanh toán một phần</option>
              <option value="DA_HOAN_THANH">Đã thanh toán đủ</option>
              <option value="DA_HUY">Lớp đã hủy</option>
            </select>
          </div>
        </div>

        {/* Invoices List */}
        {loading ? (
          <div className="py-20 flex justify-center items-center">
            <div className="w-8 h-8 border-4 border-teal-500/20 border-t-teal-600 rounded-full animate-spin"></div>
          </div>
        ) : filteredInvoices.length === 0 ? (
          <div className="py-16 text-center bg-white dark:bg-[#111928] rounded-2xl border border-slate-200/90 dark:border-[#1e2d45] p-8 shadow-sm space-y-3">
            <Receipt className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
            <h4 className="text-base font-bold text-slate-800 dark:text-slate-100">
              {search || statusFilter !== 'ALL' ? 'Không Tìm Thấy Hóa Đơn Phù Hợp' : 'Bạn Chưa Có Hóa Đơn Nào'}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              {search || statusFilter !== 'ALL'
                ? 'Không có hóa đơn nào khớp với từ khóa tìm kiếm hoặc bộ lọc trạng thái hiện tại.'
                : 'Khi bạn đăng ký tham gia các khóa học, hóa đơn học phí sẽ tự động hiển thị tại đây.'}
            </p>
            {(search || statusFilter !== 'ALL') && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setSearch('');
                    setStatusFilter('ALL');
                    setPage(1);
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 text-xs font-bold hover:bg-teal-100 dark:hover:bg-teal-900 transition cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Đặt lại bộ lọc</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {displayedInvoices.map((inv) => {
              const isCancelled = inv.trangThai === 'DA_HUY';
              const remaining = isCancelled ? 0 : Math.max(0, Number(inv.soTienPhaiTra) - Number(inv.soTienDaTra));
              const isFull = !isCancelled && (inv.trangThai === 'DA_HOAN_THANH' || remaining <= 0);
              const isPartial = !isCancelled && !isFull && (inv.trangThai === 'THANH_TOAN_MOT_PHAN' || Number(inv.soTienDaTra) > 0);

              return (
                <div
                  key={inv.id}
                  className={`p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#111928] border shadow-sm space-y-4 transition-all duration-200 hover:shadow-md ${
                    isCancelled
                      ? 'border-slate-300 dark:border-slate-800 opacity-90'
                      : 'border-slate-200/90 dark:border-[#1e2d45]'
                  }`}
                >
                  <div className="flex justify-between items-center flex-wrap gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 px-2.5 py-1 rounded-lg">
                        {inv.maHoaDon}
                      </span>
                      {(inv.ngayLap || inv.dangKyHoc?.ngayDangKy) && (
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">
                          Ngày lập: {new Date(inv.ngayLap || inv.dangKyHoc?.ngayDangKy!).toLocaleDateString('vi-VN')}
                        </span>
                      )}
                      {inv.hanThanhToan && (
                        <span className="text-[11px] text-slate-400 dark:text-slate-500">
                          (Hạn nộp: {new Date(inv.hanThanhToan).toLocaleDateString('vi-VN')})
                        </span>
                      )}
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1 ${
                        isCancelled
                          ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800'
                          : isFull
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                          : isPartial
                          ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                          : 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800'
                      }`}
                    >
                      {isCancelled ? (
                        <span>✕ Lớp Đã Hủy (Bảo Lưu Lịch Sử)</span>
                      ) : isFull ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          <span>Đã Thanh Toán Đủ</span>
                        </>
                      ) : isPartial ? (
                        <span>⚠️ Thanh Toán Một Phần</span>
                      ) : (
                        <span>⏳ Chưa Thanh Toán</span>
                      )}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <span>Lớp: {inv.dangKyHoc?.lopHoc?.tenLopHoc || 'Khóa học tiếng Anh'}</span>
                    {inv.dangKyHoc?.lopHoc?.maLopHoc && (
                      <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-[#162032] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#22324e]">
                        {inv.dangKyHoc.lopHoc.maLopHoc}
                      </span>
                    )}
                    {isCancelled && (
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300">
                        Đã Hủy
                      </span>
                    )}
                  </h4>

                  <div className="grid grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-[#162032] border border-slate-200 dark:border-[#22324e] text-xs text-center">
                    <div>
                      <p className="text-slate-500 dark:text-slate-400 font-medium">Học Phí Phải Đóng</p>
                      <p className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-1 font-mono">
                        {Number(inv.soTienPhaiTra).toLocaleString('vi-VN')} đ
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500 dark:text-slate-400 font-medium">Số Tiền Đã Đóng</p>
                      <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400 mt-1 font-mono">
                        {Number(inv.soTienDaTra).toLocaleString('vi-VN')} đ
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500 dark:text-slate-400 font-medium">{isCancelled ? 'Trạng Thái' : 'Còn Nợ'}</p>
                      <p
                        className={`text-sm font-bold mt-1 font-mono ${
                          isCancelled
                            ? 'text-slate-500'
                            : remaining > 0
                            ? 'text-rose-600 dark:text-rose-400'
                            : 'text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        {isCancelled ? 'Đã hủy' : `${remaining.toLocaleString('vi-VN')} đ`}
                      </p>
                    </div>
                  </div>

                  {/* Thông báo bảo lưu lịch sử giao dịch khi đã hủy */}
                  {isCancelled ? (
                    <div className="p-3 rounded-xl bg-slate-100 dark:bg-[#162032] border border-slate-200 dark:border-[#22324e] text-slate-700 dark:text-slate-300 text-xs">
                      {Number(inv.soTienDaTra) > 0 ? (
                        <span>
                          ℹ️ Đăng ký lớp này đã hủy. Khoản tiền <strong>{Number(inv.soTienDaTra).toLocaleString('vi-VN')} đ</strong> bạn đã thanh toán vẫn được lưu giữ trọn vẹn trong lịch sử giao dịch bên dưới để đối soát, bảo lưu hoặc hoàn phí theo quy định trung tâm.
                        </span>
                      ) : (
                        <span>ℹ️ Đăng ký lớp này đã được hủy trước khi thanh toán. Hóa đơn không còn phát sinh công nợ.</span>
                      )}
                    </div>
                  ) : remaining > 0 ? (
                    <div className="p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/40 text-amber-900 dark:text-amber-300 text-xs flex items-center justify-between flex-wrap gap-2">
                      <span>
                        Vui lòng chuyển khoản hoặc nộp trực tiếp tại Quầy lễ tân trung tâm để thanh toán nốt số dư{' '}
                        <strong>{remaining.toLocaleString('vi-VN')} đ</strong>.
                      </span>
                      <span className="font-mono text-[11px] font-bold bg-amber-100 dark:bg-amber-900/60 px-2 py-0.5 rounded text-amber-900 dark:text-amber-200">
                        Cú pháp: {inv.maHoaDon}
                      </span>
                    </div>
                  ) : null}

                  {/* Lịch sử các phiếu thu thực tế phát sinh (ThanhToan) */}
                  {inv.thanhToan && inv.thanhToan.length > 0 && (
                    <div className="pt-2 border-t border-slate-100 dark:border-[#1e2d45] space-y-1.5">
                      <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Lịch Sử Giao Dịch Phiếu Thu ({inv.thanhToan.length} lần nộp)
                      </p>
                      <div className="space-y-1">
                        {inv.thanhToan.map((pt: any, idx: number) => (
                          <div
                            key={pt.id || idx}
                            className="flex items-center justify-between text-xs py-1.5 px-3 rounded-lg bg-slate-50/80 dark:bg-[#162032]/60 border border-slate-100 dark:border-[#22324e]/50"
                          >
                            <div className="flex items-center space-x-2">
                              <span className="font-mono font-bold text-teal-700 dark:text-teal-300">
                                {pt.maGiaoDich || `PT-${pt.id}`}
                              </span>
                              <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                                ({pt.phuongThuc === 'CHUYEN_KHOAN' ? 'Chuyển khoản' : 'Tiền mặt'})
                              </span>
                              <span className="text-slate-400 dark:text-slate-500 text-[11px]">
                                {pt.thoiGianThanhToan ? new Date(pt.thoiGianThanhToan).toLocaleDateString('vi-VN') : ''}
                              </span>
                            </div>
                            <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">
                              +{Number(pt.soTien).toLocaleString('vi-VN')} đ
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Phân Trang Cho Hóa Đơn */}
        {!loading && totalItems > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 p-4 rounded-2xl bg-white dark:bg-[#111928] border border-slate-200/90 dark:border-[#1e2d45] shadow-sm text-xs mt-6">
            {/* Mobile Info View */}
            <div className="flex sm:hidden items-center justify-between w-full text-slate-600 dark:text-slate-400 gap-2">
              <span className="truncate">
                Hiển thị <strong>{startIndex}</strong>-<strong>{endIndex}</strong> / <strong>{totalItems}</strong>
              </span>
              <div className="flex items-center space-x-1.5 shrink-0">
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">Số lượng:</span>
                <select
                  value={limit}
                  onChange={(e) => {
                    setLimit(Number(e.target.value));
                    setPage(1);
                  }}
                  className="bg-slate-50 dark:bg-[#162032] border border-slate-200 dark:border-[#22324e] rounded-lg px-2 py-1 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-teal-500 cursor-pointer"
                >
                  <option value={4}>4 / trang</option>
                  <option value={8}>8 / trang</option>
                  <option value={12}>12 / trang</option>
                  <option value={9999}>Tất cả</option>
                </select>
              </div>
            </div>

            {/* Desktop Info View - 100% Nguyên bản */}
            <div className="hidden sm:flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-start">
              <span className="text-slate-600 dark:text-slate-400">
                Hiển thị <strong>{startIndex}</strong> - <strong>{endIndex}</strong> trong tổng số{' '}
                <strong>{totalItems}</strong> hóa đơn
              </span>
              <div className="flex items-center space-x-1.5">
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">Số lượng:</span>
                <select
                  value={limit}
                  onChange={(e) => {
                    setLimit(Number(e.target.value));
                    setPage(1);
                  }}
                  className="bg-slate-50 dark:bg-[#162032] border border-slate-200 dark:border-[#22324e] rounded-lg px-2 py-1 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-teal-500 cursor-pointer"
                >
                  <option value={4}>4 / trang</option>
                  <option value={8}>8 / trang</option>
                  <option value={12}>12 / trang</option>
                  <option value={9999}>Tất cả</option>
                </select>
              </div>
            </div>

            {/* Mobile Pagination Navigation */}
            {totalPages > 1 && (
              <div className="flex sm:hidden items-center justify-center space-x-1.5 w-full pt-1">
                <button
                  type="button"
                  onClick={() => setPage(1)}
                  disabled={page === 1}
                  title="Trang đầu"
                  className="p-2 rounded-lg bg-slate-50 dark:bg-[#162032] border border-slate-200 dark:border-[#22324e] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                >
                  <ChevronsLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  title="Trang trước"
                  className="p-2 rounded-lg bg-slate-50 dark:bg-[#162032] border border-slate-200 dark:border-[#22324e] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <span className="px-3 py-1.5 font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-[#22324e] rounded-lg text-xs min-w-[70px] text-center">
                  {page} / {totalPages}
                </span>

                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  title="Trang sau"
                  className="p-2 rounded-lg bg-slate-50 dark:bg-[#162032] border border-slate-200 dark:border-[#22324e] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setPage(totalPages)}
                  disabled={page >= totalPages}
                  title="Trang cuối"
                  className="p-2 rounded-lg bg-slate-50 dark:bg-[#162032] border border-slate-200 dark:border-[#22324e] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                >
                  <ChevronsRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Desktop Pagination Navigation - 100% Nguyên bản */}
            {totalPages > 1 && (
              <div className="hidden sm:flex items-center space-x-1.5 overflow-x-auto max-w-full py-1">
                <button
                  type="button"
                  onClick={() => setPage(1)}
                  disabled={page === 1}
                  title="Trang đầu"
                  className="p-1.5 rounded-lg bg-slate-50 dark:bg-[#162032] border border-slate-200 dark:border-[#22324e] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                >
                  <ChevronsLeft className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  title="Trang trước"
                  className="p-1.5 rounded-lg bg-slate-50 dark:bg-[#162032] border border-slate-200 dark:border-[#22324e] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
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
                          type="button"
                          onClick={() => setPage(p)}
                          className={`min-w-[28px] h-7 px-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                            page === p
                              ? 'bg-teal-600 text-white shadow-sm'
                              : 'bg-slate-50 dark:bg-[#162032] border border-slate-200 dark:border-[#22324e] text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                        >
                          {p}
                        </button>
                      </React.Fragment>
                    ))}
                </div>

                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  title="Trang sau"
                  className="p-1.5 rounded-lg bg-slate-50 dark:bg-[#162032] border border-slate-200 dark:border-[#22324e] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setPage(totalPages)}
                  disabled={page >= totalPages}
                  title="Trang cuối"
                  className="p-1.5 rounded-lg bg-slate-50 dark:bg-[#162032] border border-slate-200 dark:border-[#22324e] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                >
                  <ChevronsRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}

