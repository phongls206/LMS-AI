'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { authService } from '../services/api';
import { VaiTro } from '../types';
import { Bell, Sparkles } from 'lucide-react';

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
          // Redirect to their default role dashboard
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

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 antialiased font-sans">
      <Sidebar role={user.vaiTro} userName={user.hoSoHocVien?.hoTen || user.hoSoGiaoVien?.hoTen || user.tenDangNhap} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-slate-900/80 backdrop-blur-md border-b border-slate-800/80 px-6 flex items-center justify-between sticky top-0 z-10">
          <div>
            {title && <h2 className="text-lg font-bold text-white leading-tight">{title}</h2>}
            {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Gemini AI Ready</span>
            </div>

            <button className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition">
              <Bell className="w-4 h-4" />
            </button>

            <div className="flex items-center space-x-3 pl-2 border-l border-slate-800">
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-xs text-white uppercase">
                {user.tenDangNhap?.slice(0, 2) || 'AD'}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-semibold text-slate-200 truncate">{user.tenDangNhap}</p>
                <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-6 overflow-y-auto max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
