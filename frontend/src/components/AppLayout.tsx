'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { authService } from '../services/api';
import { VaiTro } from '../types';
import {
  KeyRound,
  User,
  Mail,
  Phone,
  ShieldCheck,
  LogOut,
  X,
  GraduationCap,
  Award,
  PanelLeft,
} from 'lucide-react';

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
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Khôi phục trạng thái thu gọn sidebar từ localStorage
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
  }, [router, allowedRoles]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-300">
        <div className="w-12 h-12 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin mb-4"></div>
        <p className="text-sm font-medium animate-pulse">Đang tải dữ liệu phiên làm việc...</p>
      </div>
    );
  }

  if (!user) return null;

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'QUAN_LY':
        return <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 font-bold text-xs">Quản Trị Viên (Admin)</span>;
      case 'GIAO_VIEN':
        return <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 font-bold text-xs">Giảng Viên</span>;
      case 'HOC_VIEN':
        return <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-xs">Học Viên</span>;
      case 'TU_VAN_VIEN':
        return <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-bold text-xs">Tư Vấn Viên</span>;
      default:
        return null;
    }
  };

  const displayName = user.hoSoHocVien?.hoTen || user.hoSoGiaoVien?.hoTen || user.tenDangNhap;

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 antialiased font-sans">
      {/* Sidebar with collapse support */}
      <Sidebar
        role={user.vaiTro}
        userName={displayName}
        isCollapsed={isCollapsed}
        onToggleCollapse={handleToggleSidebar}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header Navbar */}
        <header className="h-16 bg-slate-900/80 backdrop-blur-md border-b border-slate-800/80 px-4 md:px-6 flex items-center justify-between sticky top-0 z-20">
          {/* Left: Sidebar Toggle + Title */}
          <div className="flex items-center space-x-3 min-w-0">
            <button
              onClick={handleToggleSidebar}
              className="p-2 -ml-1 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              title={isCollapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'}
              aria-label="Toggle Sidebar"
            >
              <PanelLeft className="w-5 h-5" />
            </button>

            <div className="min-w-0">
              {title && (
                <h2 className="text-base md:text-lg font-bold text-white leading-tight truncate">
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className="text-[11px] md:text-xs text-slate-400 truncate hidden sm:block">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Right: User Profile & Quick Logout on Navbar */}
          <div className="flex items-center space-x-2 md:space-x-3 shrink-0">
            {/* Click avatar/name to open Profile Modal */}
            <button
              onClick={() => setShowProfileModal(true)}
              className="flex items-center space-x-2.5 p-1.5 md:px-3 md:py-1.5 rounded-xl hover:bg-slate-800/80 border border-transparent hover:border-slate-700/60 transition cursor-pointer text-left focus:outline-none"
              title="Xem thông tin tài khoản"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center font-bold text-xs text-white uppercase shadow-md shadow-indigo-600/30 shrink-0">
                {user.tenDangNhap?.slice(0, 2) || 'AD'}
              </div>
              <div className="hidden lg:block text-left max-w-[140px]">
                <p className="text-xs font-semibold text-slate-200 truncate">{displayName}</p>
                <p className="text-[10px] text-slate-400 truncate">{user.tenDangNhap}</p>
              </div>
            </button>

            {/* Role Chip (Desktop) */}
            <div className="hidden md:block">
              {getRoleBadge(user.vaiTro)}
            </div>

            {/* Vertical Divider */}
            <div className="h-6 w-px bg-slate-800/90 mx-1"></div>

            {/* Nút Đăng Xuất Tinh Gọn Trên Navbar */}
            <button
              onClick={() => authService.logout()}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white border border-rose-500/20 hover:border-rose-500 text-xs font-semibold transition-all duration-200 shadow-sm cursor-pointer group"
              title="Đăng xuất khỏi hệ thống"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-400 group-hover:text-white transition-colors" />
              <span className="hidden sm:inline">Đăng Xuất</span>
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-5">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <User className="w-4 h-4 text-indigo-400" />
                <span>Hồ Sơ & Thông Tin Tài Khoản</span>
              </h3>
              <button
                onClick={() => setShowProfileModal(false)}
                className="text-slate-500 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center space-x-4 p-4 rounded-xl bg-slate-950 border border-slate-800/80">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center font-black text-xl text-white uppercase shadow-lg shadow-indigo-500/30">
                {user.tenDangNhap?.slice(0, 2) || 'AD'}
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-white text-base">{displayName}</h4>
                <div>{getRoleBadge(user.vaiTro)}</div>
              </div>
            </div>

            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/50">
                <span className="text-slate-400 flex items-center space-x-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Tên Đăng Nhập:</span>
                </span>
                <span className="font-mono font-bold text-white">{user.tenDangNhap}</span>
              </div>

              <div className="flex justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/50">
                <span className="text-slate-400 flex items-center space-x-1.5">
                  <Mail className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Email:</span>
                </span>
                <span className="font-semibold text-slate-200">{user.email || 'Chưa cập nhật'}</span>
              </div>

              <div className="flex justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/50">
                <span className="text-slate-400 flex items-center space-x-1.5">
                  <Phone className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Số Điện Thoại:</span>
                </span>
                <span className="font-mono font-semibold text-slate-200">{user.soDienThoai || 'Chưa cập nhật'}</span>
              </div>

              {/* Thông tin mở rộng theo vai trò */}
              {user.hoSoHocVien && (
                <>
                  <div className="flex justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/50">
                    <span className="text-slate-400 flex items-center space-x-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Mã Học Viên:</span>
                    </span>
                    <span className="font-mono font-bold text-emerald-400">{user.hoSoHocVien.maHocVien}</span>
                  </div>
                  <div className="flex justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/50">
                    <span className="text-slate-400 flex items-center space-x-1.5">
                      <Award className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Trình Độ CEFR:</span>
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[11px]">
                      {user.hoSoHocVien.trinhDoCEFR}
                    </span>
                  </div>
                </>
              )}

              {user.hoSoGiaoVien && (
                <>
                  <div className="flex justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/50">
                    <span className="text-slate-400 flex items-center space-x-1.5">
                      <Award className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Mã Giáo Viên:</span>
                    </span>
                    <span className="font-mono font-bold text-indigo-400">{user.hoSoGiaoVien.maGiaoVien}</span>
                  </div>
                  <div className="flex justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/50">
                    <span className="text-slate-400">Chuyên Môn:</span>
                    <span className="font-semibold text-slate-200">{user.hoSoGiaoVien.chuyenMon}</span>
                  </div>
                </>
              )}
            </div>

            <div className="pt-3 border-t border-slate-800 flex space-x-3">
              <Link
                href="/change-password"
                onClick={() => setShowProfileModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 font-semibold text-xs flex items-center justify-center space-x-1.5 transition border border-slate-700"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Đổi Mật Khẩu</span>
              </Link>
              <button
                onClick={() => authService.logout()}
                className="flex-1 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white font-semibold text-xs flex items-center justify-center space-x-1.5 transition border border-rose-500/30"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Đăng Xuất</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
