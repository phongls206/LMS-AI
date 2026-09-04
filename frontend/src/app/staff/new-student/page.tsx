'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { AppLayout } from '../../../components/AppLayout';
import { usersService } from '../../../services/api';
import { TrinhDoCEFR } from '../../../types';
import { UserPlus, CheckCircle, ArrowRight, RefreshCw, AlertTriangle, AlertCircle, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function StaffNewStudentPage() {
  const [formData, setFormData] = useState({
    tenDangNhap: '',
    matKhau: '123456',
    email: '',
    soDienThoai: '',
    maHocVien: '',
    hoTen: '',
    ngaySinh: '',
    gioiTinh: 'Nam',
    diaChi: '',
    trinhDoCEFR: 'B1' as TrinhDoCEFR,
    nguonDanhGia: 'Placement Test tại Quầy',
  });
  const [loading, setLoading] = useState(false);
  const [fetchingCode, setFetchingCode] = useState(false);
  const [createdStudent, setCreatedStudent] = useState<any>(null);

  // Duplicate check states
  const [duplicateErrors, setDuplicateErrors] = useState<Record<string, string>>({});
  const [existingStudent, setExistingStudent] = useState<any>(null);
  const [checkingDuplicate, setCheckingDuplicate] = useState(false);

  // Tải mã học viên và tên đăng nhập đề xuất duy nhất tiếp theo
  const fetchNextCode = useCallback(async () => {
    try {
      setFetchingCode(true);
      const res = await usersService.getNextStudentCode();
      setFormData((prev) => ({
        ...prev,
        maHocVien: res.nextMaHocVien || '',
        tenDangNhap: res.suggestedUsername || '',
      }));
      setDuplicateErrors((prev) => {
        const next = { ...prev };
        delete next.maHocVien;
        delete next.tenDangNhap;
        return next;
      });
    } catch (err) {
      console.error('Không thể lấy mã đề xuất:', err);
    } finally {
      setFetchingCode(false);
    }
  }, []);

  useEffect(() => {
    fetchNextCode();
  }, [fetchNextCode]);

  // Debounced duplicate check khi người dùng nhập dữ liệu
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!formData.tenDangNhap && !formData.email && !formData.maHocVien && !formData.soDienThoai) {
        setDuplicateErrors({});
        setExistingStudent(null);
        return;
      }

      try {
        setCheckingDuplicate(true);
        const res = await usersService.checkStudentDuplicate({
          tenDangNhap: formData.tenDangNhap || undefined,
          email: formData.email || undefined,
          maHocVien: formData.maHocVien || undefined,
          soDienThoai: formData.soDienThoai || undefined,
        });

        setDuplicateErrors(res.errors || {});
        setExistingStudent(res.existingStudent || null);
      } catch (err) {
        console.error('Lỗi kiểm tra trùng lặp:', err);
      } finally {
        setCheckingDuplicate(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [formData.tenDangNhap, formData.email, formData.maHocVien, formData.soDienThoai]);

  const hasDuplicate = Object.keys(duplicateErrors).length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (hasDuplicate) {
      alert('Vui lòng điều chỉnh các trường thông tin đang bị trùng lặp trước khi tiếp nhận!');
      return;
    }

    setLoading(true);
    try {
      const res = await usersService.createStudent(formData);
      setCreatedStudent(res);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Có lỗi xảy ra khi tạo học viên.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout
      allowedRoles={['TU_VAN_VIEN', 'QUAN_LY']}
      title="Tiếp Nhận Học Viên & Đánh Giá CEFR Đầu Vào"
      subtitle="Tự động cấp mã duy nhất, kiểm tra chống trùng lặp tài khoản và lưu hồ sơ trình độ"
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {createdStudent ? (
          <div className="p-8 rounded-2xl bg-white border border-slate-200/90 shadow-sm text-center space-y-4 animate-fadeIn">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Tiếp Nhận Học Viên Thành Công!</h3>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1.5 text-left max-w-md mx-auto">
              <div className="flex justify-between border-b border-slate-200 pb-1">
                <span className="text-slate-500">Họ và tên:</span>
                <strong className="text-slate-900 font-bold">{createdStudent.hoTen}</strong>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1">
                <span className="text-slate-500">Mã học viên:</span>
                <strong className="text-teal-700 font-mono font-bold">{createdStudent.maHocVien}</strong>
              </div>

              {createdStudent.ngaySinh && (
                <div className="flex justify-between border-b border-slate-200 pb-1">
                  <span className="text-slate-500">Ngày sinh:</span>
                  <strong className="text-slate-900 font-bold">{new Date(createdStudent.ngaySinh).toLocaleDateString('vi-VN')}</strong>
                </div>
              )}
              {createdStudent.diaChi && (
                <div className="flex justify-between border-b border-slate-200 pb-1">
                  <span className="text-slate-500">Địa chỉ:</span>
                  <strong className="text-slate-900 font-bold">{createdStudent.diaChi}</strong>
                </div>
              )}
              <div className="flex justify-between border-b border-slate-200 pb-1">
                <span className="text-slate-500">Trình độ đầu vào:</span>
                <strong className="text-emerald-700 font-mono font-bold">CEFR {createdStudent.trinhDoCEFR}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Nguồn đánh giá:</span>
                <span className="text-slate-700">{createdStudent.nguonDanhGia || 'Tại quầy'}</span>
              </div>
            </div>

            <div className="flex justify-center space-x-3 pt-4">
              <button
                onClick={() => {
                  setCreatedStudent(null);
                  setFormData({
                    tenDangNhap: '',
                    matKhau: '123456',
                    email: '',
                    soDienThoai: '',
                    maHocVien: '',
                    hoTen: '',
                    ngaySinh: '',
                    gioiTinh: 'Nam',
                    diaChi: '',
                    trinhDoCEFR: 'B1',
                    nguonDanhGia: 'Placement Test tại Quầy',
                  });
                  fetchNextCode();
                }}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer flex items-center space-x-1.5"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Tiếp Nhận Học Viên Khác</span>
              </button>
              <Link
                href="/staff/collect-fee"
                className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center space-x-1 shadow-sm transition"
              >
                <span>Đi Đến Ghi Danh & Thu Học Phí</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="p-8 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-5">
            {/* Banner cảnh báo nếu phát hiện học viên đã có tài khoản */}
            {existingStudent && (
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start space-x-3 animate-fadeIn">
                <AlertTriangle className="w-5 h-5 shrink-0 text-amber-600 mt-0.5" />
                <div className="space-y-1.5 flex-1">
                  <p className="font-bold text-amber-900">
                    Cảnh Báo: Học viên này dường như đã có hồ sơ trong hệ thống!
                  </p>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    Đã tìm thấy tài khoản: <strong>{existingStudent.hoTen}</strong> (Mã:{' '}
                    <span className="font-mono font-bold text-teal-700">{existingStudent.maHocVien}</span>, Username:{' '}
                    <span className="font-mono">{existingStudent.tenDangNhap}</span>, Email: {existingStudent.email}).
                  </p>
                  <div className="pt-1">
                    <Link
                      href={`/staff/collect-fee`}
                      className="inline-flex items-center space-x-1 font-bold text-teal-700 hover:text-teal-800 underline text-[11px]"
                    >
                      <span>Mở Ghi Danh & Thu Học Phí cho học viên này thay vì tạo mới</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-slate-700 font-bold">Mã Học Viên (Tự động cấp)</label>
                    <button
                      type="button"
                      onClick={fetchNextCode}
                      disabled={fetchingCode}
                      className="text-[11px] text-teal-600 hover:text-teal-700 flex items-center space-x-1 cursor-pointer font-medium"
                      title="Lấy mã khả dụng tiếp theo"
                    >
                      <RefreshCw className={`w-3 h-3 ${fetchingCode ? 'animate-spin' : ''}`} />
                      <span>Cấp mã mới</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.maHocVien}
                    onChange={(e) => setFormData({ ...formData, maHocVien: e.target.value.toUpperCase() })}
                    className={`w-full bg-slate-50 border rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none font-mono ${
                      duplicateErrors.maHocVien
                        ? 'border-rose-400 bg-rose-50/40 focus:border-rose-500'
                        : 'border-slate-200 focus:border-teal-500'
                    }`}
                    placeholder="VD: HV055"
                  />
                  {duplicateErrors.maHocVien ? (
                    <p className="text-[11px] text-rose-600 mt-1 flex items-center space-x-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{duplicateErrors.maHocVien}</span>
                    </p>
                  ) : formData.maHocVien ? (
                    <p className="text-[10px] text-emerald-600 mt-1 font-medium">✓ Mã khả dụng</p>
                  ) : null}
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Họ Và Tên Học Viên</label>
                  <input
                    type="text"
                    required
                    value={formData.hoTen}
                    onChange={(e) => setFormData({ ...formData, hoTen: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-teal-500"
                    placeholder="VD: Nguyễn Văn An"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-slate-700 font-bold">Tên Đăng Nhập</label>
                    <span className="text-[10px] text-slate-400 font-normal">Hệ thống đề xuất duy nhất</span>
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.tenDangNhap}
                    onChange={(e) => setFormData({ ...formData, tenDangNhap: e.target.value.toLowerCase() })}
                    className={`w-full bg-slate-50 border rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none ${
                      duplicateErrors.tenDangNhap
                        ? 'border-rose-400 bg-rose-50/40 focus:border-rose-500'
                        : 'border-slate-200 focus:border-teal-500'
                    }`}
                    placeholder="VD: student55"
                  />
                  {duplicateErrors.tenDangNhap ? (
                    <p className="text-[11px] text-rose-600 mt-1 flex items-center space-x-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{duplicateErrors.tenDangNhap}</span>
                    </p>
                  ) : formData.tenDangNhap ? (
                    <p className="text-[10px] text-emerald-600 mt-1 font-medium">✓ Tên đăng nhập khả dụng</p>
                  ) : null}
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Mật Khẩu Khởi Tạo</label>
                  <input
                    type="password"
                    required
                    value={formData.matKhau}
                    onChange={(e) => setFormData({ ...formData, matKhau: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-teal-500"
                    placeholder="Mặc định: 123456"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Email Học Viên (Duy nhất)</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full bg-slate-50 border rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none ${
                      duplicateErrors.email
                        ? 'border-rose-400 bg-rose-50/40 focus:border-rose-500'
                        : 'border-slate-200 focus:border-teal-500'
                    }`}
                    placeholder="VD: nguyenvanan@gmail.com"
                  />
                  {duplicateErrors.email && (
                    <p className="text-[11px] text-rose-600 mt-1 flex items-center space-x-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{duplicateErrors.email}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Số Điện Thoại</label>
                  <input
                    type="text"
                    value={formData.soDienThoai}
                    onChange={(e) => setFormData({ ...formData, soDienThoai: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-teal-500"
                    placeholder="VD: 0901234567"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Ngày Sinh</label>
                  <input
                    type="date"
                    required
                    value={formData.ngaySinh}
                    onChange={(e) => setFormData({ ...formData, ngaySinh: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Giới Tính</label>
                  <select
                    value={formData.gioiTinh}
                    onChange={(e) => setFormData({ ...formData, gioiTinh: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-teal-500 cursor-pointer"
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Địa Chỉ Thường Trú</label>
                <input
                  type="text"
                  required
                  placeholder="VD: Tổ 1, P. Phan Đình Phùng, Thái Nguyên"
                  value={formData.diaChi}
                  onChange={(e) => setFormData({ ...formData, diaChi: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Trình Độ CEFR Xếp Lớp</label>
                  <select
                    value={formData.trinhDoCEFR}
                    onChange={(e) => setFormData({ ...formData, trinhDoCEFR: e.target.value as TrinhDoCEFR })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-bold focus:outline-none focus:border-teal-500 cursor-pointer"
                  >
                    <option value="A1">A1 - Sơ Cấp</option>
                    <option value="A2">A2 - Tiền Trung Cấp</option>
                    <option value="B1">B1 - Trung Cấp</option>
                    <option value="B2">B2 - Trung Cao Cấp</option>
                    <option value="C1">C1 - Cao Cấp</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Nguồn Đánh Giá Trình Độ</label>
                  <input
                    type="text"
                    value={formData.nguonDanhGia}
                    onChange={(e) => setFormData({ ...formData, nguonDanhGia: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || hasDuplicate || checkingDuplicate}
                className="w-full py-3 mt-4 bg-gradient-to-r from-teal-600 to-cyan-600 hover:opacity-95 text-white font-bold rounded-xl shadow-md shadow-teal-600/20 transition disabled:opacity-50 cursor-pointer flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <span>Đang Tiếp Nhận...</span>
                ) : hasDuplicate ? (
                  <span>Dữ Liệu Đang Bị Trùng Lặp — Vui Lòng Kiểm Tra Lại</span>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Xác Nhận Tiếp Nhận Học Viên</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

