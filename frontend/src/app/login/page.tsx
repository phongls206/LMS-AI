'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '../../services/api';
import { Footer } from '../../components/Footer';
import { Sparkles, Lock, User, AlertCircle, AlertTriangle, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('admin01');
  const [password, setPassword] = useState('123456');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [wasKicked, setWasKicked] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('kicked') === '1') {
        setWasKicked(true);
      }
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await authService.login(username, password);
      const role = res.user.vaiTro;

      switch (role) {
        case 'QUAN_LY': router.push('/admin/dashboard'); break;
        case 'GIAO_VIEN': router.push('/teacher/dashboard'); break;
        case 'HOC_VIEN': router.push('/student/dashboard'); break;
        case 'TU_VAN_VIEN': router.push('/staff/dashboard'); break;
        default: router.push('/admin/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Đăng nhập không thành công. Vui lòng kiểm tra lại tài khoản.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between relative font-sans">
      {/* Background ambient lighting - strictly contained so it cannot create vertical scroll overflow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center px-4 py-8 sm:py-12 z-10">
        <div className="w-full max-w-md bg-white border border-slate-200/90 rounded-2xl shadow-xl p-8">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-tr from-teal-600 via-cyan-600 to-blue-500 flex items-center justify-center font-black text-white text-2xl shadow-md shadow-teal-500/25">
            E
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">ETC ENGLISH CENTER</h1>
          <p className="text-xs text-teal-600 mt-1 font-semibold flex items-center justify-center space-x-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Hệ Thống LMS Tích Hợp GenAI</span>
          </p>
        </div>

        {wasKicked && (
          <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start space-x-3 shadow-sm">
            <AlertTriangle className="w-5 h-5 shrink-0 text-amber-600 mt-0.5" />
            <div>
              <p className="font-bold text-amber-900">Phiên Đăng Nhập Đã Bị Ngắt!</p>
              <p className="text-[11px] text-amber-800/90 mt-0.5 leading-relaxed">
                Tài khoản của bạn vừa được đăng nhập từ một thiết bị hoặc trình duyệt khác. Để bảo mật thông tin, hệ thống tự động đăng xuất phiên làm việc này.
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center space-x-2 shadow-sm">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Tên đăng nhập
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-2.5 pl-10 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition"
                placeholder="VD: admin01, teacher01..."
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Mật khẩu
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-2.5 pl-10 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition"
                placeholder="Mật khẩu của bạn"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 hover:opacity-95 text-white font-bold py-3 rounded-xl shadow-lg shadow-teal-600/25 transition duration-150 flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <span>Đăng Nhập Vào Hệ Thống</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Support note */}
          <div className="pt-2 text-center">
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Quên mật khẩu? Vui lòng liên hệ Quản trị viên qua{' '}
              <a
                href="mailto:lehongphong2108@outlook.com"
                className="text-teal-600 hover:text-teal-700 font-semibold underline underline-offset-2 transition"
              >
                lehongphong2108@outlook.com
              </a>
            </p>
          </div>
        </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}
