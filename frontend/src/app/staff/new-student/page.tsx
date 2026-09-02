'use client';

import React, { useState } from 'react';
import { AppLayout } from '../../../components/AppLayout';
import { usersService } from '../../../services/api';
import { TrinhDoCEFR } from '../../../types';
import { UserPlus, CheckCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function StaffNewStudentPage() {
  const [formData, setFormData] = useState({
    tenDangNhap: '',
    matKhau: 'Student@123',
    email: '',
    soDienThoai: '',
    maHocVien: '',
    hoTen: '',
    trinhDoCEFR: 'B1' as TrinhDoCEFR,
    nguonDanhGia: 'Placement Test tại Quầy',
  });
  const [loading, setLoading] = useState(false);
  const [createdStudent, setCreatedStudent] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await usersService.createStudent(formData);
      setCreatedStudent(res);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Có lỗi xảy ra.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout
      allowedRoles={['TU_VAN_VIEN', 'QUAN_LY']}
      title="Tiếp Nhận Học Viên & Đánh Giá CEFR Đầu Vào"
      subtitle="Tạo tài khoản học viên và lưu hồ sơ trình độ vào hệ thống"
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {createdStudent ? (
          <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white">Tiếp Nhận Học Viên Thành Công!</h3>
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 space-y-1">
              <p>Họ tên: <strong className="text-white">{createdStudent.hoTen}</strong></p>
              <p>Mã học viên: <strong className="text-indigo-400 font-mono">{createdStudent.maHocVien}</strong></p>
              <p>Trình độ: <strong className="text-emerald-400 font-mono">CEFR {createdStudent.trinhDoCEFR}</strong></p>
            </div>

            <div className="flex justify-center space-x-3 pt-4">
              <button
                onClick={() => {
                  setCreatedStudent(null);
                  setFormData({
                    tenDangNhap: '',
                    matKhau: 'Student@123',
                    email: '',
                    soDienThoai: '',
                    maHocVien: '',
                    hoTen: '',
                    trinhDoCEFR: 'B1',
                    nguonDanhGia: 'Placement Test tại Quầy',
                  });
                }}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Tiếp Nhận Học Viên Khác
              </button>
              <Link
                href="/staff/collect-fee"
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center space-x-1"
              >
                <span>Đi Đến Ghi Danh & Thu Học Phí</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Mã Học Viên (VD: HV004)</label>
                  <input
                    type="text"
                    required
                    value={formData.maHocVien}
                    onChange={(e) => setFormData({ ...formData, maHocVien: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Họ Và Tên Học Viên</label>
                  <input
                    type="text"
                    required
                    value={formData.hoTen}
                    onChange={(e) => setFormData({ ...formData, hoTen: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Tên Đăng Nhập</label>
                  <input
                    type="text"
                    required
                    value={formData.tenDangNhap}
                    onChange={(e) => setFormData({ ...formData, tenDangNhap: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Mật Khẩu Ban Đầu</label>
                  <input
                    type="password"
                    required
                    value={formData.matKhau}
                    onChange={(e) => setFormData({ ...formData, matKhau: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Số Điện Thoại</label>
                  <input
                    type="text"
                    value={formData.soDienThoai}
                    onChange={(e) => setFormData({ ...formData, soDienThoai: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Trình Độ CEFR Xếp Lớp</label>
                  <select
                    value={formData.trinhDoCEFR}
                    onChange={(e) => setFormData({ ...formData, trinhDoCEFR: e.target.value as TrinhDoCEFR })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-bold focus:outline-none focus:border-indigo-500"
                  >
                    <option value="A1">A1 - Sơ Cấp</option>
                    <option value="A2">A2 - Tiền Trung Cấp</option>
                    <option value="B1">B1 - Trung Cấp</option>
                    <option value="B2">B2 - Trung Cao Cấp</option>
                    <option value="C1">C1 - Cao Cấp</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Nguồn Đánh Giá Trình Độ</label>
                  <input
                    type="text"
                    value={formData.nguonDanhGia}
                    onChange={(e) => setFormData({ ...formData, nguonDanhGia: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 mt-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/30 transition disabled:opacity-50"
              >
                {loading ? 'Đang Lưu...' : 'Xác Nhận Tiếp Nhận Học Viên'}
              </button>
            </form>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
