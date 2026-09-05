'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '../../services/api';
import { Footer } from '../../components/Footer';
import { EtcLogo } from '../../components/EtcLogo';
import { Sparkles, Lock, User, AlertCircle, AlertTriangle, ArrowRight, Sun, Moon, Mail, Copy, Check, X, ExternalLink } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [wasKicked, setWasKicked] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [showForgotModal, setShowForgotModal] = useState(false);

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
          className="p-2 sm:p-2.5 rounded-xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-slate-200/90 dark:border-slate-700/80 hover:border-teal-400 dark:hover:border-teal-500 shadow-md text-slate-700 dark:text-slate-200 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer flex items-center space-x-2 text-xs font-bold group"
          title={isDark ? 'Chuyển sang Giao diện Sáng (Light Mode)' : 'Chuyển sang Giao diện Tối (Dark Mode)'}
        >
          {isDark ? (
            <>
              <Sun className="w-4 h-4 text-amber-400 group-hover:rotate-90 transition-transform duration-300" />
              <span className="hidden sm:inline">Chế độ Sáng</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-slate-600 group-hover:text-teal-600 group-hover:-rotate-12 transition-all duration-300" />
              <span className="hidden sm:inline">Chế độ Tối</span>
            </>
          )}
        </button>
      </div>

      {/* Background ambient lighting & subtle micro-dot matrix */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
        {/* Subtle dot matrix grid pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40 dark:opacity-25"></div>

        {/* Animated ambient orbs */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-teal-500/15 dark:bg-teal-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '7s' }}></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-cyan-500/15 dark:bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '9s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] bg-blue-500/5 dark:bg-blue-600/5 rounded-full blur-[110px]"></div>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center px-4 py-6 sm:py-8 z-10 min-h-0 w-full">
        {/* Card wrapper with interactive ambient border glow */}
        <div className="relative group/card w-full max-w-md">
          <div className="absolute -inset-1 rounded-2xl sm:rounded-[28px] bg-gradient-to-r from-teal-500/20 via-cyan-500/20 to-blue-500/20 blur-xl opacity-40 group-hover/card:opacity-90 group-hover/card:blur-2xl transition-all duration-500 pointer-events-none"></div>

          <div className="relative w-full bg-white/95 dark:bg-[#141c2e]/95 backdrop-blur-xl border border-slate-200/90 dark:border-[#1e2d45] hover:border-teal-500/40 dark:hover:border-teal-500/40 rounded-2xl sm:rounded-3xl shadow-2xl dark:shadow-black/80 p-6 sm:p-10 transition-all duration-300">
            {/* Brand */}
            <div className="text-center mb-7 sm:mb-8 group/brand cursor-default">
              <div className="flex justify-center mb-3 animate-brand-reveal group-hover/brand:scale-105 transition-transform duration-300">
                <EtcLogo size="lg" />
              </div>
              <p className="text-sm text-teal-600 dark:text-teal-400 font-bold flex items-center justify-center space-x-2 mt-2 animate-subtitle-reveal select-none">
                <Sparkles
                  className="w-4 h-4 text-teal-500 hover:animate-spin group-hover/brand:animate-spin hover:scale-125 shrink-0 origin-center transition-all duration-300 cursor-pointer"
                  style={{ animationDuration: '2s' }}
                />
                <span className="tracking-wide group-hover/brand:text-teal-500 transition-colors">
                  Hệ Thống LMS Tích Hợp AI
                </span>
              </p>
            </div>

            {wasKicked && (
              <div className="mb-4 p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs flex items-start space-x-2.5 shadow-sm">
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
                <div>
                  <p className="font-bold text-amber-900 dark:text-amber-200">Phiên Đăng Nhập Đã Bị Ngắt!</p>
                  <p className="text-[11px] text-amber-800/90 dark:text-amber-300/80 mt-0.5 leading-relaxed">
                    Tài khoản của bạn vừa được đăng nhập từ một thiết bị hoặc trình duyệt khác. Để bảo mật thông tin, hệ thống tự động đăng xuất phiên làm việc này.
                  </p>
                </div>
              </div>
            )}

            {error && (
              <div className="mb-4 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs flex items-center space-x-2 shadow-sm">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="group/input">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 group-focus-within/input:text-teal-600 dark:group-focus-within/input:text-teal-400 transition-colors">
                  Tên đăng nhập
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 dark:text-slate-500 group-focus-within/input:text-teal-500 dark:group-focus-within/input:text-teal-400 group-hover/input:text-slate-600 dark:group-hover/input:text-slate-300 absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-200" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="w-full bg-slate-50/70 dark:bg-[#0f172a] border border-slate-200 dark:border-[#1e2d45] hover:border-slate-300 dark:hover:border-slate-700 focus:border-teal-500 dark:focus:border-teal-400 rounded-xl px-4 py-2.5 pl-10 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-4 focus:ring-teal-500/15 transition-all duration-200"
                    placeholder="Nhập tên đăng nhập của bạn..."
                  />
                </div>
              </div>

              <div className="group/input">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 group-focus-within/input:text-teal-600 dark:group-focus-within/input:text-teal-400 transition-colors">
                  Mật khẩu
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 dark:text-slate-500 group-focus-within/input:text-teal-500 dark:group-focus-within/input:text-teal-400 group-hover/input:text-slate-600 dark:group-hover/input:text-slate-300 absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-200" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-slate-50/70 dark:bg-[#0f172a] border border-slate-200 dark:border-[#1e2d45] hover:border-slate-300 dark:hover:border-slate-700 focus:border-teal-500 dark:focus:border-teal-400 rounded-xl px-4 py-2.5 pl-10 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-4 focus:ring-teal-500/15 transition-all duration-200"
                    placeholder="Mật khẩu của bạn"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 relative overflow-hidden bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 hover:from-teal-500 hover:via-cyan-500 hover:to-blue-500 active:scale-[0.98] text-white font-bold py-3 rounded-xl shadow-lg shadow-teal-600/25 hover:shadow-teal-500/35 hover:shadow-xl transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer text-sm group/btn"
              >
                {/* Light sweep shimmer effect */}
                <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"></div>

                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Đăng Nhập Vào Hệ Thống</span>
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1.5 transition-transform duration-200" />
                  </>
                )}
              </button>

              {/* Support note */}
              <div className="pt-2 text-center">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    className="font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-500 dark:hover:text-teal-300 underline decoration-teal-500/30 hover:decoration-teal-500 underline-offset-4 transition-all cursor-pointer"
                  >
                    Quên mật khẩu?
                  </button>{' '}
                  <span>Vui lòng liên hệ Quản trị viên để được hỗ trợ</span>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Modal Chọn Kênh Hỗ Trợ Quên Mật Khẩu (Zalo hoặc Email) */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm bg-white dark:bg-[#141c2e] border border-slate-200 dark:border-[#1e2d45] rounded-2xl sm:rounded-3xl shadow-2xl p-5 sm:p-6 relative">
            {/* Nút đóng */}
            <button
              type="button"
              onClick={() => setShowForgotModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header modal */}
            <div className="text-center mb-5">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Hỗ Trợ Quên Mật Khẩu
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Chọn phương thức liên hệ Quản trị viên để được cấp lại:
              </p>
            </div>

            {/* 2 lựa chọn Zalo hoặc Email */}
            <div className="space-y-3">
              {/* Lựa chọn 1: Zalo */}
              <a
                href="https://zalo.me/0787304341"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setShowForgotModal(false)}
                className="flex items-center p-3.5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/40 hover:bg-blue-100/80 dark:hover:bg-blue-900/50 border border-blue-200 dark:border-blue-800/80 hover:border-blue-300 dark:hover:border-blue-700 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center shrink-0 shadow-sm text-xs tracking-tight group-hover:scale-105 group-hover:rotate-3 transition-transform duration-200">
                  Zalo
                </div>
                <div className="ml-3 flex-1 min-w-0">
                  <div className="text-xs font-bold text-blue-950 dark:text-blue-200 flex items-center justify-between">
                    <span>Nhắn tin qua Zalo</span>
                    <ExternalLink className="w-3.5 h-3.5 text-blue-500 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <p className="text-[11px] text-blue-700 dark:text-blue-300 font-mono mt-0.5 truncate">
                    0787 304 341
                  </p>
                </div>
              </a>

              {/* Lựa chọn 2: Email */}
              <a
                href="mailto:lehongphong2108@outlook.com?subject=Yêu cầu cấp lại mật khẩu ETC LMS"
                onClick={() => setShowForgotModal(false)}
                className="flex items-center p-3.5 rounded-2xl bg-teal-50/60 dark:bg-teal-950/40 hover:bg-teal-100/80 dark:hover:bg-teal-900/50 border border-teal-200 dark:border-teal-800/80 hover:border-teal-300 dark:hover:border-teal-700 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 group-hover:-rotate-3 transition-transform duration-200">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="ml-3 flex-1 min-w-0">
                  <div className="text-xs font-bold text-teal-950 dark:text-teal-200 flex items-center justify-between">
                    <span>Gửi thư qua Email</span>
                    <ExternalLink className="w-3.5 h-3.5 text-teal-500 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <p className="text-[11px] text-teal-700 dark:text-teal-300 font-mono mt-0.5 truncate">
                    lehongphong2108@outlook.com
                  </p>
                </div>
              </a>
            </div>

            <p className="text-[10px] text-center text-slate-400 dark:text-slate-500 mt-4">
              Quản trị viên sẽ tiếp nhận và cấp lại mật khẩu trong thời gian sớm nhất.
            </p>
          </div>
        </div>
      )}

      <Footer compact={true} />
    </div>
  );
}
