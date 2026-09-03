'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('etc_access_token');
    const userStr = localStorage.getItem('etc_user_session');

    if (!token || !userStr) {
      router.replace('/login');
      return;
    }

    try {
      const user = JSON.parse(userStr);
      switch (user.vaiTro) {
        case 'QUAN_LY': router.replace('/admin/dashboard'); break;
        case 'GIAO_VIEN': router.replace('/teacher/dashboard'); break;
        case 'HOC_VIEN': router.replace('/student/dashboard'); break;
        case 'TU_VAN_VIEN': router.replace('/staff/dashboard'); break;
        default: router.replace('/login');
      }
    } catch {
      router.replace('/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-teal-500/20 border-t-teal-600 rounded-full animate-spin"></div>
    </div>
  );
}
