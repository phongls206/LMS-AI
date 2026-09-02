'use client';

import React, { useEffect, useState } from 'react';
import { AppLayout } from '../../../components/AppLayout';
import { usersService, classesService, enrollmentsService } from '../../../services/api';
import { HocVien, LopHoc } from '../../../types';
import { Receipt, DollarSign, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';

export default function StaffCollectFeePage() {
  const [students, setStudents] = useState<HocVien[]>([]);
  const [classes, setClasses] = useState<LopHoc[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<number>(1);
  const [selectedClassId, setSelectedClassId] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchData = async () => {
    try {
      const [stuRes, classList] = await Promise.all([
        usersService.getStudents(1, 100),
        classesService.getAll(undefined, 'DANG_MO_DANG_KY'),
      ]);
      setStudents(stuRes.data);
      setClasses(classList);
      if (stuRes.data.length > 0) setSelectedStudentId(stuRes.data[0].id);
      if (classList.length > 0) setSelectedClassId(classList[0].id);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEnrollAndInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      const res = await enrollmentsService.enroll(selectedStudentId, selectedClassId);
      setMessage({
        type: 'success',
        text: `Ghi danh thành công! Đã tự động tạo hóa đơn ${res.invoice?.maHoaDon} với số tiền ${Number(res.invoice?.soTienPhaiTra).toLocaleString()} đ.`,
      });
    } catch (err: any) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Lỗi ghi danh lớp học.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppLayout
      allowedRoles={['TU_VAN_VIEN', 'QUAN_LY']}
      title="Ghi Danh & Lập Phiếu Thu Tại Quầy"
      subtitle="Thực hiện ghi danh học viên vào lớp học và khởi tạo hồ sơ công nợ học phí"
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {message && (
          <div
            className={`p-4 rounded-xl text-xs flex items-center space-x-2 ${
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
          <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm">
            <form onSubmit={handleEnrollAndInvoice} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5 uppercase tracking-wider">
                  Chọn Học Viên
                </label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(+e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white font-semibold focus:outline-none focus:border-indigo-500"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      [{s.maHocVien}] {s.hoTen} — CEFR {s.trinhDoCEFR}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1.5 uppercase tracking-wider">
                  Chọn Lớp Học Cần Ghi Danh
                </label>
                <select
                  value={selectedClassId}
                  onChange={(e) => setSelectedClassId(+e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white font-semibold focus:outline-none focus:border-indigo-500"
                >
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      [{c.maLopHoc}] {c.tenLopHoc} — Yêu cầu CEFR {c.khoaHoc?.trinhDoYeuCau} ({c.siSoHienTai}/{c.siSoToiDa} HV)
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-400 space-y-1">
                <p>⚠️ <strong>Lưu ý:</strong> Hệ thống tự động kiểm tra 4 điều kiện:</p>
                <ul className="list-disc pl-4 space-y-0.5">
                  <li>Sĩ số lớp phải chưa đầy (tối đa 25 học viên).</li>
                  <li>Học viên chưa từng ghi danh vào lớp này.</li>
                  <li>Trình độ CEFR học viên ≥ Yêu cầu đầu vào của khóa học.</li>
                  <li>Lịch học không bị trùng với các lớp khác học viên đang theo học.</li>
                </ul>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 mt-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/30 transition flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <Receipt className="w-4 h-4" />
                <span>{submitting ? 'Đang Xử Lý Ghi Danh...' : 'Xác Nhận Ghi Danh & Tạo Hóa Đơn'}</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
