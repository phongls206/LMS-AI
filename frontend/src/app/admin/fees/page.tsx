'use client';

import React, { useEffect, useState } from 'react';
import { AppLayout } from '../../../components/AppLayout';
import { enrollmentsService } from '../../../services/api';
import { HoaDon } from '../../../types';
import { Receipt, DollarSign, CheckCircle, AlertCircle, Plus } from 'lucide-react';

export default function AdminFeesPage() {
  const [invoices, setInvoices] = useState<HoaDon[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState<HoaDon | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<'TIEN_MAT' | 'CHUYEN_KHOAN'>('TIEN_MAT');
  const [note, setNote] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchInvoices = async () => {
    try {
      const list = await enrollmentsService.getInvoices();
      setInvoices(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleOpenPayment = (inv: HoaDon) => {
    setSelectedInvoice(inv);
    const remaining = Number(inv.soTienPhaiTra) - Number(inv.soTienDaTra);
    setPaymentAmount(remaining);
  };

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoice) return;
    try {
      await enrollmentsService.createPayment(selectedInvoice.id, {
        soTien: +paymentAmount,
        phuongThuc: paymentMethod,
        ghiChu: note,
      });
      setMessage({ type: 'success', text: 'Ghi nhận phiếu thu học phí thành công!' });
      setSelectedInvoice(null);
      fetchInvoices();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Lỗi ghi nhận thanh toán.' });
    }
  };

  return (
    <AppLayout
      allowedRoles={['QUAN_LY', 'TU_VAN_VIEN']}
      title="Quản Lý Học Phí & Thu Ngân"
      subtitle="Theo dõi công nợ học phí, lập phiếu thu thanh toán nhiều đợt và tự động cập nhật trạng thái"
    >
      <div className="space-y-6">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          {invoices.length} hóa đơn học phí
        </span>

        {message && (
          <div
            className={`p-3.5 rounded-xl text-xs flex items-center space-x-2 ${
              message.type === 'success'
                ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
                : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
            }`}
          >
            {message.type === 'success' ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{message.text}</span>
          </div>
        )}

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
                    <th className="px-5 py-3.5">Mã Hóa Đơn</th>
                    <th className="px-5 py-3.5">Học Viên</th>
                    <th className="px-5 py-3.5">Lớp Học</th>
                    <th className="px-5 py-3.5">Phải Trả</th>
                    <th className="px-5 py-3.5">Đã Thu</th>
                    <th className="px-5 py-3.5">Còn Nợ</th>
                    <th className="px-5 py-3.5">Trạng Thái</th>
                    <th className="px-5 py-3.5 text-right">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {invoices.map((inv) => {
                    const remaining = Number(inv.soTienPhaiTra) - Number(inv.soTienDaTra);
                    return (
                      <tr key={inv.id} className="hover:bg-slate-800/40 transition">
                        <td className="px-5 py-4 font-mono font-bold text-indigo-400">{inv.maHoaDon}</td>
                        <td className="px-5 py-4">
                          <p className="font-semibold text-white">{inv.hocVien?.hoTen}</p>
                          <p className="text-[11px] text-slate-400 font-mono">[{inv.hocVien?.maHocVien}]</p>
                        </td>
                        <td className="px-5 py-4 text-slate-300">
                          {inv.dangKyHoc?.lopHoc?.tenLopHoc || '—'}
                        </td>
                        <td className="px-5 py-4 font-bold text-white">
                          {Number(inv.soTienPhaiTra).toLocaleString()} đ
                        </td>
                        <td className="px-5 py-4 font-bold text-emerald-400">
                          {Number(inv.soTienDaTra).toLocaleString()} đ
                        </td>
                        <td className="px-5 py-4 font-bold text-rose-400">
                          {remaining.toLocaleString()} đ
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                              inv.trangThai === 'DA_HOAN_THANH'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : inv.trangThai === 'THANH_TOAN_MOT_PHAN'
                                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            }`}
                          >
                            {inv.trangThai === 'DA_HOAN_THANH'
                              ? 'Đã Hoàn Thành'
                              : inv.trangThai === 'THANH_TOAN_MOT_PHAN'
                              ? 'Thu Một Phần'
                              : 'Chưa Thanh Toán'}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          {remaining > 0 ? (
                            <button
                              onClick={() => handleOpenPayment(inv)}
                              className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition text-xs flex items-center space-x-1 ml-auto"
                            >
                              <DollarSign className="w-3.5 h-3.5" />
                              <span>Thu Tiền</span>
                            </button>
                          ) : (
                            <span className="text-slate-500 text-xs italic">Đã thu đủ</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal Lập Phiếu Thu */}
        {selectedInvoice && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
              <h3 className="text-lg font-bold text-white mb-2">Lập Phiếu Thu Học Phí</h3>
              <p className="text-xs text-slate-400 mb-4">
                Học viên: <span className="font-semibold text-indigo-400">{selectedInvoice.hocVien?.hoTen}</span> — Hóa đơn:{' '}
                <span className="font-mono text-slate-200">{selectedInvoice.maHoaDon}</span>
              </p>

              <form onSubmit={handleSubmitPayment} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Số Tiền Thu (VNĐ)</label>
                  <input
                    type="number"
                    required
                    min={1000}
                    max={Number(selectedInvoice.soTienPhaiTra) - Number(selectedInvoice.soTienDaTra)}
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(+e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold text-sm focus:outline-none focus:border-indigo-500"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Còn nợ tối đa:{' '}
                    {(Number(selectedInvoice.soTienPhaiTra) - Number(selectedInvoice.soTienDaTra)).toLocaleString()} đ
                  </p>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Phương Thức Thanh Toán</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="TIEN_MAT">Tiền Mặt</option>
                    <option value="CHUYEN_KHOAN">Chuyển Khoản Ngân Hàng</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Ghi Chú Phiếu Thu</label>
                  <input
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    placeholder="VD: Đóng học phí đợt 1..."
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setSelectedInvoice(null)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                  >
                    Hủy
                  </button>
                  <button type="submit" className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-semibold">
                    Xác Nhận Thu Tiền
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
