'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '../../services/api';
import { Footer } from '../../components/Footer';
import { EtcLogo } from '../../components/EtcLogo';
import { Sparkles, Lock, User, AlertCircle, AlertTriangle, ArrowRight, Sun, Moon } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [wasKicked, setWasKicked] = useState(false);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem('etc_theme');
    if (savedTheme === 'light') {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    } else {
      setIsDark(true);
      document.documentElement.classList.add('dark');
      if (!savedTheme) {
        localStorage.setItem('etc_theme', 'dark');
      }
    }
  }, []);

  const handleToggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('etc_theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('etc_theme', 'light');
      }
      return next;
    });
  };

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
    <div className="min-h-screen lg:h-screen flex flex-col justify-between relative font-sans transition-colors bg-slate-50 dark:bg-[#0a0e1a] overflow-x-hidden overflow-y-auto lg:overflow-hidden">
      {/* Dark / Light Mode Switcher */}
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20">
        <button
          type="button"
          onClick={handleToggleTheme}
          className="p-2 sm:p-2.5 rounded-xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-slate-200/90 dark:border-slate-700/80 shadow-md text-slate-700 dark:text-slate-200 hover:scale-105 transition cursor-pointer flex items-center space-x-2 text-xs font-bold"
          title={isDark ? 'Chuyển sang Giao diện Sáng (Light Mode)' : 'Chuyển sang Giao diện Tối (Dark Mode)'}
        >
          {isDark ? (
            <>
              <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform" />
              <span className="hidden sm:inline">Chế độ Sáng</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-slate-600 hover:text-teal-600 transition-colors" />
              <span className="hidden sm:inline">Chế độ Tối</span>
            </>
          )}
        </button>
      </div>

      {/* Background ambient lighting */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-teal-500/10 dark:bg-teal-500/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-cyan-500/10 dark:bg-cyan-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center px-4 py-3 sm:py-4 z-10 min-h-0 w-full">
        <div className="w-full max-w-sm sm:max-w-md bg-white dark:bg-[#141c2e] border border-slate-200/90 dark:border-[#1e2d45] rounded-2xl shadow-xl dark:shadow-2xl dark:shadow-black/60 p-5 sm:p-7 transition-colors">
          {/* Brand */}
          <div className="text-center mb-4 sm:mb-5">
            <div className="flex justify-center mb-1.5">
              <EtcLogo size="md" />
            </div>
            <p className="text-xs text-teal-600 font-semibold flex items-center justify-center space-x-1.5 mt-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Hệ Thống LMS Tích Hợp AI</span>
            </p>
          </div>

          {wasKicked && (
            <div className="mb-3 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start space-x-2.5 shadow-sm">
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
              <div>
                <p className="font-bold text-amber-900">Phiên Đăng Nhập Đã Bị Ngắt!</p>
                <p className="text-[11px] text-amber-800/90 mt-0.5 leading-relaxed">
                  Tài khoản của bạn vừa được đăng nhập từ một thiết bị hoặc trình duyệt khác. Để bảo mật thông tin, hệ thống tự động đăng xuất phiên làm việc này.
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center space-x-2 shadow-sm">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Tên đăng nhập
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full bg-slate-50/50 dark:bg-[#0f172a] border border-slate-200 dark:border-[#1e2d45] rounded-xl px-4 py-2 pl-10 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-teal-500 dark:focus:border-teal-400 focus:ring-1 focus:ring-teal-500 transition"
                  placeholder="Nhập tên đăng nhập của bạn..."
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Mật khẩu
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-slate-50/50 dark:bg-[#0f172a] border border-slate-200 dark:border-[#1e2d45] rounded-xl px-4 py-2 pl-10 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-teal-500 dark:focus:border-teal-400 focus:ring-1 focus:ring-teal-500 transition"
                  placeholder="Mật khẩu của bạn"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-1.5 bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 hover:opacity-95 text-white font-bold py-2.5 rounded-xl shadow-lg shadow-teal-600/25 transition duration-150 flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
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
            <div className="pt-1 text-center">
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Quên mật khẩu? Vui lòng liên hệ với Quản trị viên
              </p>
            </div>
          </form>
        </div>
      </div>

      <Footer compact={true} />
    </div>
  );
}
