'use client';

import React, { useEffect, useState } from 'react';
import { AppLayout } from '../../../components/AppLayout';
import { classesService, enrollmentsService, authService } from '../../../services/api';
import { LopHoc } from '../../../types';
import { BookOpen, CheckCircle, AlertCircle, Clock, Users, ArrowRight } from 'lucide-react';

export default function StudentEnrollPage() {
  const [classes, setClasses] = useState<LopHoc[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [enrollingId, setEnrollingId] = useState<number | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchData = async () => {
    try {
      const [list, me] = await Promise.all([
        classesService.getAll(undefined, 'DANG_MO_DANG_KY'),
        authService.getMe(),
      ]);
      const openClasses = (list || []).filter(
        (c: LopHoc) =>
          c.trangThai === 'DANG_MO_DANG_KY' &&
          c.khoaHoc?.trangThai !== 'NGUNG_HOAT_DONG'
      );
      setClasses(openClasses);
      setUser(me);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEnroll = async (classId: number) => {
    if (!user?.hoSoHocVien?.id) {
      alert('Không tìm thấy thông tin hồ sơ học viên của bạn.');
      return;
    }

    setEnrollingId(classId);
    setMessage(null);

    try {
      await enrollmentsService.enroll(user.hoSoHocVien.id, classId);
      setMessage({
        type: 'success',
        text: 'Đăng ký lớp học thành công! Hệ thống đã tự động tạo Hóa đơn học phí.',
      });
      fetchData();
    } catch (err: any) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Đăng ký không thành công.',
      });
    } finally {
      setEnrollingId(null);
    }
  };

  return (
    <AppLayout
      allowedRoles={['HOC_VIEN', 'TU_VAN_VIEN']}
      title="Đăng Ký Lớp Học Mới"
      subtitle="Hệ thống tự động kiểm tra 4 điều kiện: Sĩ số chỗ trống, Chưa đăng ký, Chuẩn CEFR và Trùng lịch học"
    >
      <div className="space-y-6">
        {/* User CEFR Info */}
        <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 flex justify-between items-center text-xs">
          <div className="flex items-center space-x-2 text-teal-900">
            <span>Học viên:</span>
            <strong className="text-slate-900">{user?.hoSoHocVien?.hoTen}</strong>
            <span>— Trình độ hiện tại:</span>
            <span className="font-bold text-teal-700 font-mono">CEFR {user?.hoSoHocVien?.trinhDoCEFR || 'B1'}</span>
          </div>
          <span className="text-slate-500 font-medium">Chỉ được đăng ký các lớp có CEFR ≤ trình độ của bạn</span>
        </div>

        {message && (
          <div
            className={`p-4 rounded-xl text-xs flex items-center space-x-2 shadow-sm ${
              message.type === 'success'
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                : 'bg-rose-50 border border-rose-200 text-rose-800'
            }`}
          >
            {message.type === 'success' ? <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" /> : <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />}
            <span>{message.text}</span>
          </div>
        )}

        {/* Classes Grid */}
        {loading ? (
          <div className="py-20 flex justify-center items-center">
            <div className="w-8 h-8 border-4 border-teal-500/20 border-t-teal-600 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {classes.length === 0 ? (
              <div className="col-span-full py-16 text-center bg-white rounded-2xl border border-slate-200/90 p-8 shadow-sm">
                <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h4 className="text-base font-bold text-slate-800 mb-1">Hiện Không Có Lớp Học Mở Tuyển Sinh</h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Các lớp học đã kết thúc, đã hủy hoặc đang trong giai đoạn chuẩn bị sẽ không hiển thị tại đây. Vui lòng quay lại sau hoặc liên hệ bộ phận Tư Vấn Viên để được hỗ trợ mở lớp.
                </p>
              </div>
            ) : (
              classes.map((c) => {
              const isEnrolled = c.dangKyHoc?.some((dk: any) => dk.hocVienId === user?.hoSoHocVien?.id);
              const isFull = c.siSoHienTai >= c.siSoToiDa;
              const isCourseSuspended = c.khoaHoc?.trangThai === 'NGUNG_HOAT_DONG';

              return (
                <div key={c.id} className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between hover:border-teal-300 hover:shadow-md transition">
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-mono text-xs font-bold text-teal-700 px-2.5 py-1 rounded bg-teal-50 border border-teal-200">
                        {c.maLopHoc}
                      </span>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 font-bold border border-teal-200">
                        Yêu cầu: CEFR {c.khoaHoc?.trinhDoYeuCau}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 mb-1">{c.tenLopHoc}</h3>
                    <p className="text-xs text-slate-500 mb-4">{c.khoaHoc?.tenKhoaHoc}</p>

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs text-slate-700 mb-4">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Học phí:</span>
                        <span className="font-bold text-emerald-700">
                          {Number(c.khoaHoc?.hocPhi).toLocaleString()} đ
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-slate-500">Sĩ số chỗ trống:</span>
                        <span className={`font-semibold ${isFull ? 'text-rose-600' : 'text-slate-800'}`}>
                          {c.siSoHienTai} / {c.siSoToiDa} ({c.siSoToiDa - c.siSoHienTai} chỗ trống)
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-slate-500">Lịch học:</span>
                        <span className="font-medium">{c.lichHoc?.map((l: any) => `Thứ ${l.thuTrongTuan}`).join(', ')}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleEnroll(c.id)}
                    disabled={isFull || isEnrolled || isCourseSuspended || enrollingId === c.id}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center space-x-1.5 transition cursor-pointer ${
                      isCourseSuspended
                        ? 'bg-rose-50 text-rose-600 border border-rose-200 cursor-not-allowed'
                        : isEnrolled
                        ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                        : isFull
                        ? 'bg-rose-50 text-rose-600 border border-rose-200 cursor-not-allowed'
                        : 'bg-gradient-to-r from-teal-600 to-cyan-600 hover:opacity-95 text-white shadow-md shadow-teal-600/20'
                    }`}
                  >
                    <span>
                      {isCourseSuspended
                        ? 'Khóa Học Tạm Ngừng Tuyển Sinh'
                        : isEnrolled
                        ? 'Đã Đăng Ký Lớp Này'
                        : isFull
                        ? 'Lớp Đã Đầy Sĩ Số'
                        : enrollingId === c.id
                        ? 'Đang Đăng Ký...'
                        : 'Xác Nhận Đăng Ký Lớp'}
                    </span>
                    {!isEnrolled && !isFull && !isCourseSuspended && <ArrowRight className="w-3.5 h-3.5" />}
                  </button>
                </div>
              );
            })
          )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
