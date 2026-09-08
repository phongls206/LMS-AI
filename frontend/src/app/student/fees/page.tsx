'use client';

import React, { useEffect, useState } from 'react';
import { AppLayout } from '../../../components/AppLayout';
import { enrollmentsService, authService } from '../../../services/api';
import { HoaDon } from '../../../types';
import { Receipt, DollarSign, CheckCircle2 } from 'lucide-react';

export default function StudentFeesPage() {
  const [invoices, setInvoices] = useState<HoaDon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const me = await authService.getMe();
        if (me?.hoSoHocVien?.id) {
          const list = await enrollmentsService.getInvoices(undefined, me.hoSoHocVien.id);
          setInvoices(list);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <AppLayout
      allowedRoles={['HOC_VIEN']}
      title="Học Phí & Hóa Đơn Cá Nhân"
      subtitle="Theo dõi chi tiết công nợ học phí và lịch sử phiếu thu thanh toán"
    >
      <div className="space-y-6">
        {loading ? (
          <div className="py-20 flex justify-center items-center">
            <div className="w-8 h-8 border-4 border-teal-500/20 border-t-teal-600 rounded-full animate-spin"></div>
          </div>
        ) : invoices.length > 0 ? (
          <div className="space-y-4">
            {invoices.map((inv) => {
              const isCancelled = inv.trangThai === 'DA_HUY';
              const remaining = isCancelled ? 0 : Math.max(0, Number(inv.soTienPhaiTra) - Number(inv.soTienDaTra));
              const isFull = !isCancelled && (inv.trangThai === 'DA_HOAN_THANH' || remaining <= 0);
              const isPartial = !isCancelled && !isFull && (inv.trangThai === 'THANH_TOAN_MOT_PHAN' || Number(inv.soTienDaTra) > 0);

              return (
                <div
                  key={inv.id}
                  className={`p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#111928] border shadow-sm space-y-4 ${isCancelled
                      ? 'border-slate-300 dark:border-slate-800 opacity-95'
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
                      className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1 ${isCancelled
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
                      <p className={`text-sm font-bold mt-1 font-mono ${isCancelled ? 'text-slate-500' : remaining > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-800 dark:text-slate-200'}`}>
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
                      <span>Vui lòng chuyển khoản hoặc nộp trực tiếp tại Quầy lễ tân trung tâm để thanh toán nốt số dư <strong>{remaining.toLocaleString('vi-VN')} đ</strong>.</span>
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
        ) : (
          <p className="text-sm text-slate-500 text-center py-16">Bạn không có hóa đơn học phí nào.</p>
        )}
      </div>
    </AppLayout>
  );
}
