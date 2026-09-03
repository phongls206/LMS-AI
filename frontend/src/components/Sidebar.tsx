'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  Users,
  UserCheck,
  Receipt,
  BarChart3,
  Calendar,
  Sparkles,
  ClipboardList,
  Award,
  UserPlus,
  X,
  LogOut,
} from 'lucide-react';
import { VaiTro } from '../types';
import { authService } from '../services/api';

interface SidebarProps {
  role?: VaiTro;
  userName?: string;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  role = 'QUAN_LY',
  userName = 'Người dùng',
  isCollapsed = false,
  onToggleCollapse,
  mobileOpen = false,
  onCloseMobile,
}) => {
  const pathname = usePathname();

  // Menu tương ứng cho 4 nhóm vai trò RBAC
  const getNavItems = () => {
    switch (role) {
      case 'QUAN_LY':
        return [
          { label: 'Tổng Quan (Dashboard)', href: '/admin/dashboard', icon: LayoutDashboard },
          { label: 'Quản Lý Khóa Học', href: '/admin/courses', icon: BookOpen },
          { label: 'Quản Lý Lớp & Lịch', href: '/admin/classes', icon: GraduationCap },
          { label: 'Hồ Sơ Học Viên', href: '/admin/students', icon: Users },
          { label: 'Hồ Sơ Giáo Viên', href: '/admin/teachers', icon: UserCheck },
          { label: 'Quản Lý Học Phí', href: '/admin/fees', icon: Receipt },
          { label: 'Báo Cáo Thống Kê', href: '/admin/reports', icon: BarChart3 },
          { label: 'AI Tóm Tắt Tiến Độ', href: '/student/ai-progress', icon: Sparkles },
        ];
      case 'GIAO_VIEN':
        return [
          { label: 'Bàn Làm Việc', href: '/teacher/dashboard', icon: LayoutDashboard },
          { label: 'Lớp Phụ Trách & TKB', href: '/teacher/classes', icon: Calendar },
          { label: 'Điểm Danh Buổi Học', href: '/teacher/attendance', icon: ClipboardList },
          { label: 'Nhập Điểm & Kết Quả', href: '/teacher/grades', icon: Award },
          { label: 'Sinh Bài Tập AI', href: '/teacher/ai-exercises', icon: Sparkles },
          { label: 'AI Tóm Tắt Tiến Độ', href: '/student/ai-progress', icon: Sparkles },
        ];
      case 'HOC_VIEN':
        return [
          { label: 'Góc Học Tập', href: '/student/dashboard', icon: LayoutDashboard },
          { label: 'Đăng Ký Khóa Học', href: '/student/enroll', icon: BookOpen },
          { label: 'Thời Khóa Biểu', href: '/student/schedule', icon: Calendar },
          { label: 'Bảng Điểm & Kết Quả', href: '/student/grades', icon: Award },
          { label: 'Học Phí & Hóa Đơn', href: '/student/fees', icon: Receipt },
          { label: 'AI Tư Vấn Lớp Học', href: '/student/ai-consult', icon: Sparkles },
          { label: 'AI Luyện Trắc Nghiệm', href: '/student/ai-practice', icon: Sparkles },
          { label: 'AI Tóm Tắt Tiến Độ', href: '/student/ai-progress', icon: Sparkles },
        ];
      case 'TU_VAN_VIEN':
        return [
          { label: 'Bàn Tiếp Nhận', href: '/staff/dashboard', icon: LayoutDashboard },
          { label: 'Tiếp Nhận Học Viên Mới', href: '/staff/new-student', icon: UserPlus },
          { label: 'Ghi Danh & Thu Học Phí', href: '/staff/collect-fee', icon: Receipt },
          { label: 'AI Hỗ Trợ Tư Vấn', href: '/student/ai-consult', icon: Sparkles },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  const getRoleLabel = () => {
    switch (role) {
      case 'QUAN_LY': return 'Quản Trị Viên';
      case 'GIAO_VIEN': return 'Giáo Viên';
      case 'HOC_VIEN': return 'Học Viên';
      case 'TU_VAN_VIEN': return 'Tư Vấn Viên';
    }
  };

  const showFull = !isCollapsed || mobileOpen;

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-50 md:sticky md:top-0 md:h-screen
        bg-white text-slate-700 h-screen flex flex-col border-r border-slate-200/90 shrink-0
        transition-all duration-300 ease-in-out shadow-xl md:shadow-none
        ${mobileOpen ? 'translate-x-0 w-72' : '-translate-x-full md:translate-x-0'}
        ${isCollapsed ? 'md:w-20' : 'md:w-64'}
      `}
    >
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center space-x-3 overflow-hidden">
          <div
            className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 via-cyan-600 to-blue-500 flex items-center justify-center font-black text-white text-xl shadow-md shadow-teal-500/20 shrink-0 cursor-pointer hover:scale-105 transition-transform"
            onClick={onToggleCollapse}
            title={isCollapsed ? 'Nhấp để mở rộng menu' : 'ETC ENGLISH'}
          >
            E
          </div>
          {showFull && (
            <div className="overflow-hidden">
              <h1 className="font-bold text-slate-900 text-base tracking-tight leading-tight truncate">
                ETC ENGLISH
              </h1>
              <p className="text-xs text-teal-600 font-semibold truncate">LMS + Smart AI</p>
            </div>
          )}
        </div>

        {/* Mobile Close Button */}
        <button
          onClick={onCloseMobile}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition md:hidden"
          title="Đóng menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Role Badge - Ẩn hoàn toàn khi thu nhỏ Sidebar */}
      {showFull && (
        <div
          className="py-2.5 px-4 bg-teal-50/70 border-b border-teal-100/80 flex items-center justify-between"
          title={`Vai trò: ${getRoleLabel()}`}
        >
          <div>
            <p className="text-[10px] text-teal-800 uppercase tracking-wider font-bold">Vai trò hệ thống</p>
            <p className="text-xs font-bold text-teal-700 truncate">{getRoleLabel()}</p>
          </div>
          <span
            className="w-2 h-2 rounded-full bg-teal-500 animate-pulse shrink-0"
            title={`Đang hoạt động: ${getRoleLabel()}`}
          ></span>
        </div>
      )}

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto overflow-x-hidden">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onCloseMobile}
              title={!showFull ? item.label : undefined}
              className={`flex items-center rounded-xl text-xs font-semibold transition-all duration-200 group relative ${!showFull ? 'justify-center px-0 py-2.5' : 'space-x-3 px-3 py-2.5'
                } ${isActive
                  ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-md shadow-teal-600/20'
                  : 'text-slate-600 hover:bg-teal-50/80 hover:text-teal-700'
                }`}
            >
              <Icon
                className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-teal-600'
                  }`}
              />
              {showFull && <span className="truncate">{item.label}</span>}

              {/* Floating Tooltip when Collapsed on Desktop */}
              {!showFull && (
                <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-900 text-white text-xs font-medium rounded-lg shadow-xl border border-slate-800 whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
                  {item.label}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Pinned Bottom Footer: Logout Only */}
      <div className="border-t border-slate-200/90 p-3 bg-slate-50/80 shrink-0 mt-auto">
        <button
          onClick={() => authService.logout()}
          className={`w-full flex items-center justify-center rounded-xl text-xs font-bold text-rose-600 bg-white hover:bg-rose-600 hover:text-white border border-rose-200 hover:border-rose-600 transition-all duration-200 cursor-pointer shadow-sm group ${!showFull ? 'p-2.5' : 'space-x-2 py-2.5 px-3'
            }`}
          title="Đăng xuất khỏi hệ thống"
        >
          <LogOut className="w-4 h-4 text-rose-500 group-hover:text-white transition-colors shrink-0" />
          {showFull && <span>Đăng Xuất</span>}
        </button>
      </div>
    </aside>
  );
};
