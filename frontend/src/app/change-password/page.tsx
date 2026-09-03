'use client';

import React, { useState } from 'react';
import { AppLayout } from '../../components/AppLayout';
import { authService } from '../../services/api';
import { Lock, CheckCircle, AlertCircle } from 'lucide-react';

export default function ChangePasswordPage() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Mật khẩu xác nhận không khớp.' });
      return;
    }
    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Mật khẩu mới phải có tối thiểu 6 ký tự.' });
      return;
    }

    setLoading(true);
    setMessage(null);
    try {
      await authService.changePassword(oldPassword, newPassword);
      setMessage({ type: 'success', text: 'Đổi mật khẩu thành công! Hãy sử dụng mật khẩu mới cho lần đăng nhập tiếp theo.' });
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Đổi mật khẩu thất bại. Vui lòng kiểm tra lại mật khẩu cũ.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout
      title="Đổi Mật Khẩu Cá Nhân"
      subtitle="Cập nhật mật khẩu bảo mật cho tài khoản của bạn"
    >
      <div className="max-w-md mx-auto space-y-6">
        {message && (
          <div
            className={`p-4 rounded-xl text-xs flex items-center space-x-2 shadow-sm ${
              message.type === 'success'
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold'
                : 'bg-rose-50 border border-rose-200 text-rose-800 font-bold'
            }`}
          >
            {message.type === 'success' ? <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" /> : <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />}
            <span>{message.text}</span>
          </div>
        )}

        <div className="p-8 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
          <form onSubmit={handleChangePassword} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1.5 uppercase tracking-wider">
                Mật Khẩu Hiện Tại
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 pl-10 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-500"
                  placeholder="Nhập mật khẩu cũ"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1.5 uppercase tracking-wider">
                Mật Khẩu Mới
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 pl-10 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-500"
                  placeholder="Tối thiểu 6 ký tự"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1.5 uppercase tracking-wider">
                Xác Nhận Mật Khẩu Mới
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 pl-10 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-500"
                  placeholder="Nhập lại mật khẩu mới"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-2 bg-gradient-to-r from-teal-600 to-cyan-600 hover:opacity-95 text-white font-bold rounded-xl shadow-md shadow-teal-600/20 transition disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Đang Xử Lý...' : 'Cập Nhật Mật Khẩu'}
            </button>
          </form>
        </div>

        <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 text-center text-xs text-slate-600 space-y-1">
          <p>
            🔒 <strong className="text-slate-800">Quên mật khẩu cũ?</strong> Vui lòng liên hệ Quản trị viên hệ thống qua{' '}
            <a
              href="mailto:lehongphong2108@outlook.com"
              className="text-teal-700 hover:text-teal-800 font-bold underline underline-offset-2 transition"
            >
              lehongphong2108@outlook.com
            </a>{' '}
            để được hỗ trợ đặt lại mật khẩu.
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
