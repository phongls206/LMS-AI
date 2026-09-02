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
      setClasses(list);
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
      subtitle="Hệ thống tự động kiểm tra 4 điều kiện: Sĩ số < 25, Chưa đăng ký, Chuẩn CEFR và Trùng lịch học"
    >
      <div className="space-y-6">
        {/* User CEFR Info */}
        <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-800/40 flex justify-between items-center text-xs">
          <div className="flex items-center space-x-2 text-indigo-300">
            <span>Học viên:</span>
            <strong className="text-white">{user?.hoSoHocVien?.hoTen}</strong>
            <span>— Trình độ hiện tại:</span>
            <span className="font-bold text-emerald-400 font-mono">CEFR {user?.hoSoHocVien?.trinhDoCEFR || 'B1'}</span>
          </div>
          <span className="text-slate-400">Chỉ được đăng ký các lớp có CEFR ≤ trình độ của bạn</span>
        </div>

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

        {/* Classes Grid */}
        {loading ? (
          <div className="py-20 flex justify-center items-center">
            <div className="w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {classes.map((c) => {
              const isEnrolled = c.dangKyHoc?.some((dk: any) => dk.hocVienId === user?.hoSoHocVien?.id);
              const isFull = c.siSoHienTai >= c.siSoToiDa;

              return (
                <div key={c.id} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-mono text-xs font-bold text-indigo-400 px-2.5 py-1 rounded bg-indigo-500/10">
                        {c.maLopHoc}
                      </span>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold">
                        Yêu cầu: CEFR {c.khoaHoc?.trinhDoYeuCau}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white mb-1">{c.tenLopHoc}</h3>
                    <p className="text-xs text-slate-400 mb-4">{c.khoaHoc?.tenKhoaHoc}</p>

                    <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2 text-xs text-slate-300 mb-4">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Học phí:</span>
                        <span className="font-bold text-emerald-400">
                          {Number(c.khoaHoc?.hocPhi).toLocaleString()} đ
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-slate-500">Sĩ số chỗ trống:</span>
                        <span className={`font-semibold ${isFull ? 'text-rose-400' : 'text-slate-200'}`}>
                          {c.siSoHienTai} / {c.siSoToiDa} ({c.siSoToiDa - c.siSoHienTai} chỗ trống)
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-slate-500">Lịch học:</span>
                        <span>{c.lichHoc?.map((l: any) => `Thứ ${l.thuTrongTuan}`).join(', ')}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleEnroll(c.id)}
                    disabled={isFull || isEnrolled || enrollingId === c.id}
                    className={`w-full py-2.5 rounded-xl font-semibold text-xs flex items-center justify-center space-x-1.5 transition ${
                      isEnrolled
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        : isFull
                        ? 'bg-rose-950/50 text-rose-400 border border-rose-800/50 cursor-not-allowed'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30'
                    }`}
                  >
                    <span>
                      {isEnrolled
                        ? 'Đã Đăng Ký Lớp Này'
                        : isFull
                        ? 'Lớp Đã Đầy Sĩ Số'
                        : enrollingId === c.id
                        ? 'Đang Đăng Ký...'
                        : 'Xác Nhận Đăng Ký Lớp'}
                    </span>
                    {!isEnrolled && !isFull && <ArrowRight className="w-3.5 h-3.5" />}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
