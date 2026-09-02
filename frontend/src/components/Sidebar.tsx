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
  LogOut,
  UserPlus,
} from 'lucide-react';
import { authService } from '../services/api';
import { VaiTro } from '../types';

interface SidebarProps {
  role?: VaiTro;
  userName?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ role = 'QUAN_LY', userName = 'Người dùng' }) => {
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

  return (
    <aside className="w-64 bg-slate-900 text-slate-200 min-h-screen flex flex-col border-r border-slate-800 shrink-0">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800 flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-400 flex items-center justify-center font-black text-white text-xl shadow-lg shadow-indigo-500/30">
          E
        </div>
        <div>
          <h1 className="font-bold text-white text-base tracking-wide leading-tight">ETC ENGLISH</h1>
          <p className="text-xs text-indigo-400 font-medium">LMS + GenAI Platform</p>
        </div>
      </div>

      {/* Role Badge */}
      <div className="px-5 py-3 bg-slate-950/40 border-b border-slate-800/60 flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Vai trò</p>
          <p className="text-sm font-medium text-emerald-400">{getRoleLabel()}</p>
        </div>
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-semibold'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/60">
        <div className="flex items-center justify-between mb-3">
          <div className="truncate">
            <p className="text-xs text-slate-400 font-medium truncate">Đăng nhập bởi</p>
            <p className="text-sm font-semibold text-slate-100 truncate">{userName}</p>
          </div>
        </div>
        <button
          onClick={() => authService.logout()}
          className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-xs font-semibold rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white border border-rose-500/20 transition-all duration-150"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Đăng Xuất</span>
        </button>
      </div>
    </aside>
  );
};
