'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { authService } from '../services/api';
import { VaiTro } from '../types';
import {
  Menu,
  PanelLeft,
  X,
  User,
  ShieldCheck,
  Mail,
  Phone,
  GraduationCap,
  Award,
  KeyRound,
  Sun,
  Moon,
} from 'lucide-react';
import Link from 'next/link';

interface AppLayoutProps {
  children: React.ReactNode;
  allowedRoles?: VaiTro[];
  title?: string;
  subtitle?: string;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  allowedRoles,
  title,
  subtitle,
}) => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // Đọc theme từ localStorage khi khởi tạo
  useEffect(() => {
    const savedTheme = localStorage.getItem('etc_theme');
    if (savedTheme === 'dark') {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
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

  // Đọc trạng thái thu nhỏ sidebar từ LocalStorage khi khởi tạo
  useEffect(() => {
    const saved = localStorage.getItem('etc_sidebar_collapsed');
    if (saved !== null) {
      setIsCollapsed(saved === 'true');
    }
  }, []);

  const handleToggleSidebar = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('etc_sidebar_collapsed', String(next));
      return next;
    });
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('etc_access_token');
        if (!token) {
          router.replace('/login');
          return;
        }

        const userData = await authService.getMe();
        setUser(userData);

        if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(userData.vaiTro)) {
          switch (userData.vaiTro) {
            case 'QUAN_LY': router.replace('/admin/dashboard'); break;
            case 'GIAO_VIEN': router.replace('/teacher/dashboard'); break;
            case 'HOC_VIEN': router.replace('/student/dashboard'); break;
            case 'TU_VAN_VIEN': router.replace('/staff/dashboard'); break;
            default: router.replace('/login');
          }
        }
      } catch (err) {
        router.replace('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Heartbeat định kỳ (15s) và kiểm tra khi chuyển lại tab để kịp thời phát hiện Single Session Kickout
    const heartbeatInterval = setInterval(() => {
      authService.getMe().catch(() => {});
    }, 15000);

    const handleVisibility = () => {
      if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
        authService.getMe().catch(() => {});
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      clearInterval(heartbeatInterval);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [router, allowedRoles]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-teal-500/20 border-t-teal-600 rounded-full animate-spin"></div>
        <p className="text-xs text-slate-500 font-semibold tracking-wider uppercase animate-pulse">
          Đang khởi tạo hệ thống...
        </p>
      </div>
    );
  }

  if (!user) return null;

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'QUAN_LY':
        return <span className="px-2.5 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 font-bold text-xs">Quản Trị Viên (Admin)</span>;
      case 'GIAO_VIEN':
        return <span className="px-2.5 py-0.5 rounded-full bg-teal-50 border border-teal-200 text-teal-700 font-bold text-xs">Giảng Viên</span>;
      case 'HOC_VIEN':
        return <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-xs">Học Viên</span>;
      case 'TU_VAN_VIEN':
        return <span className="px-2.5 py-0.5 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-700 font-bold text-xs">Tư Vấn Viên</span>;
      default:
        return null;
    }
  };

  const displayName = user.hoSoHocVien?.hoTen || user.hoSoGiaoVien?.hoTen || user.tenDangNhap;

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 antialiased font-sans relative">
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden animate-fadeIn"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar with Mobile Drawer, Desktop Collapse & Bottom Logout */}
      <Sidebar
        role={user.vaiTro}
        userName={displayName}
        isCollapsed={isCollapsed}
        onToggleCollapse={handleToggleSidebar}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto w-full min-h-screen">
        {/* Top Header Navbar */}
        <header className="h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-3 sm:px-6 flex items-center justify-between sticky top-0 z-30 shrink-0">
          {/* Left: Sidebar Toggle + Title */}
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
            {/* Mobile Toggle Button */}
            <button
              onClick={() => setMobileOpen(true)}
              className="p-2 -ml-1 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors shrink-0 md:hidden focus:outline-none"
              title="Mở menu"
              aria-label="Open Mobile Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Desktop Toggle Button */}
            <button
              onClick={handleToggleSidebar}
              className="p-2 -ml-1 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors shrink-0 hidden md:block focus:outline-none focus:ring-2 focus:ring-teal-500/30"
              title={isCollapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'}
              aria-label="Toggle Sidebar"
            >
              <PanelLeft className="w-5 h-5" />
            </button>

            <div className="min-w-0">
              {title && (
                <h2 className="text-sm sm:text-base md:text-lg font-bold text-slate-900 leading-tight truncate">
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className="text-[10px] sm:text-xs text-slate-500 truncate hidden sm:block">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Right: Theme Toggle + User Profile Avatar */}
          <div className="flex items-center space-x-2 shrink-0">
            {/* Dark / Light Mode Toggle Button */}
            <button
              onClick={handleToggleTheme}
              className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition cursor-pointer text-slate-700 flex items-center justify-center focus:outline-none shadow-sm"
              title={isDark ? 'Chuyển sang Giao diện Sáng (Light Mode)' : 'Chuyển sang Giao diện Tối (Dark Mode)'}
              aria-label="Chuyển đổi giao diện Sáng / Tối"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-500 hover:rotate-45 transition-transform" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600 hover:text-teal-600 transition-colors" />
              )}
            </button>

            {/* User Profile Avatar */}
            <button
              onClick={() => setShowProfileModal(true)}
              className="flex items-center space-x-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-slate-50 hover:bg-teal-50 border border-slate-200/80 hover:border-teal-300 transition cursor-pointer text-left focus:outline-none"
              title="Xem thông tin tài khoản"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-teal-600 to-cyan-500 flex items-center justify-center font-bold text-xs text-white uppercase shadow-sm shrink-0">
                {user.tenDangNhap?.slice(0, 2) || 'AD'}
              </div>
              <div className="hidden lg:block text-left max-w-[150px]">
                <p className="text-xs font-bold text-slate-800 truncate">{displayName}</p>
                <p className="text-[10px] text-teal-600 font-medium truncate">{user.tenDangNhap}</p>
              </div>
            </button>
          </div>
        </header>

        {/* Main Content Area - Light theme container */}
        <main className="flex-1 p-3 sm:p-5 md:p-6 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50 animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md p-5 sm:p-6 shadow-2xl space-y-4 sm:space-y-5 max-h-[90vh] overflow-y-auto text-slate-800">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <User className="w-4 h-4 text-teal-600" />
                <span>Hồ Sơ & Thông Tin Tài Khoản</span>
              </h3>
              <button
                onClick={() => setShowProfileModal(false)}
                className="text-slate-400 hover:text-slate-700 transition p-1 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center space-x-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-600 to-cyan-500 flex items-center justify-center font-black text-xl text-white uppercase shadow-md shadow-teal-500/20 shrink-0">
                {user.tenDangNhap?.slice(0, 2) || 'AD'}
              </div>
              <div className="space-y-1 overflow-hidden">
                <h4 className="font-bold text-slate-900 text-base truncate">{displayName}</h4>
                <div>{getRoleBadge(user.vaiTro)}</div>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200/60">
                <span className="text-slate-500 flex items-center space-x-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                  <span>Tên Đăng Nhập:</span>
                </span>
                <span className="font-mono font-bold text-slate-800">{user.tenDangNhap}</span>
              </div>

              <div className="flex justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200/60">
                <span className="text-slate-500 flex items-center space-x-1.5">
                  <Mail className="w-3.5 h-3.5 text-teal-600" />
                  <span>Email:</span>
                </span>
                <span className="font-semibold text-slate-800 truncate max-w-[200px]">{user.email || 'Chưa cập nhật'}</span>
              </div>

              <div className="flex justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200/60">
                <span className="text-slate-500 flex items-center space-x-1.5">
                  <Phone className="w-3.5 h-3.5 text-teal-600" />
                  <span>Số Điện Thoại:</span>
                </span>
                <span className="font-mono font-semibold text-slate-800">{user.soDienThoai || 'Chưa cập nhật'}</span>
              </div>

              {/* Thông tin mở rộng theo vai trò */}
              {user.hoSoHocVien && (
                <>
                  <div className="flex justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200/60">
                    <span className="text-slate-500 flex items-center space-x-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-teal-600" />
                      <span>Mã Học Viên:</span>
                    </span>
                    <span className="font-mono font-bold text-teal-700">{user.hoSoHocVien.maHocVien}</span>
                  </div>
                  <div className="flex justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200/60">
                    <span className="text-slate-500 flex items-center space-x-1.5">
                      <Award className="w-3.5 h-3.5 text-teal-600" />
                      <span>Trình Độ CEFR:</span>
                    </span>
                    <span className="px-2 py-0.5 rounded bg-teal-100 text-teal-800 font-bold text-[11px]">
                      {user.hoSoHocVien.trinhDoCEFR}
                    </span>
                  </div>
                </>
              )}

              {user.hoSoGiaoVien && (
                <>
                  <div className="flex justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200/60">
                    <span className="text-slate-500 flex items-center space-x-1.5">
                      <Award className="w-3.5 h-3.5 text-teal-600" />
                      <span>Mã Giáo Viên:</span>
                    </span>
                    <span className="font-mono font-bold text-teal-700">{user.hoSoGiaoVien.maGiaoVien}</span>
                  </div>
                  <div className="flex justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200/60">
                    <span className="text-slate-500">Chuyên Môn:</span>
                    <span className="font-semibold text-slate-800">{user.hoSoGiaoVien.chuyenMon}</span>
                  </div>
                </>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex space-x-3">
              <Link
                href="/change-password"
                onClick={() => setShowProfileModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center justify-center space-x-1.5 transition border border-slate-200"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Đổi Mật Khẩu</span>
              </Link>
              <button
                onClick={() => setShowProfileModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs transition shadow-sm"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
