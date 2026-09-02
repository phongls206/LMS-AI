'use client';

import React, { useEffect, useState } from 'react';
import { AppLayout } from '../../../components/AppLayout';
import { statisticsService } from '../../../services/api';
import { BarChart3, TrendingUp, Award, DollarSign, Users, GraduationCap } from 'lucide-react';

export default function AdminReportsPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await statisticsService.getDashboard();
        setStats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <AppLayout
      allowedRoles={['QUAN_LY']}
      title="Báo Cáo Thống Kê & Phân Tích Đào Tạo"
      subtitle="Báo cáo doanh thu tài chính, tỷ lệ hoàn thành khóa học và đánh giá hiệu quả tuyển sinh"
    >
      {loading ? (
        <div className="py-20 flex justify-center items-center">
          <div className="w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Summary Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="flex items-center space-x-3 text-indigo-400 mb-2">
                <Users className="w-5 h-5" />
                <h4 className="font-bold text-white text-sm">Quy Mô Học Viên</h4>
              </div>
              <p className="text-3xl font-black text-white">{stats?.tongQuan?.tongHocVien || 0}</p>
              <p className="text-xs text-slate-400 mt-1">Học viên ghi danh trên toàn hệ thống</p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="flex items-center space-x-3 text-emerald-400 mb-2">
                <DollarSign className="w-5 h-5" />
                <h4 className="font-bold text-white text-sm">Doanh Thu Thu Được</h4>
              </div>
              <p className="text-3xl font-black text-emerald-400">
                {(stats?.tongQuan?.tongDoanhThu || 0).toLocaleString()} đ
              </p>
              <p className="text-xs text-slate-400 mt-1">Đã quyết toán qua cổng thu ngân</p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="flex items-center space-x-3 text-amber-400 mb-2">
                <Award className="w-5 h-5" />
                <h4 className="font-bold text-white text-sm">Hiệu Suất Đạt Chuẩn</h4>
              </div>
              <p className="text-3xl font-black text-amber-400">
                {stats?.tyLeHoanThanh?.tyLeDatPhanTram || 0}%
              </p>
              <p className="text-xs text-slate-400 mt-1">Tỷ lệ học viên đạt điểm tổng kết ≥ 50 & CC ≥ 80%</p>
            </div>
          </div>

          {/* Detailed breakdown */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
            <h3 className="text-base font-bold text-white mb-4">Chi Tiết Tỷ Lệ Hoàn Thành & Tốt Nghiệp Khóa Học</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <p className="text-xs font-semibold text-emerald-400 uppercase">Học Viên ĐẠT Chuẩn</p>
                <p className="text-2xl font-bold text-white mt-1">{stats?.tyLeHoanThanh?.dat || 0}</p>
                <p className="text-[11px] text-emerald-300 mt-1">Đủ điều kiện cấp chứng chỉ</p>
              </div>

              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20">
                <p className="text-xs font-semibold text-rose-400 uppercase">Học Viên KHÔNG ĐẠT</p>
                <p className="text-2xl font-bold text-white mt-1">{stats?.tyLeHoanThanh?.khongDat || 0}</p>
                <p className="text-[11px] text-rose-300 mt-1">Cần học lại hoặc thi lại cuối kỳ</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-800 border border-slate-700/60">
                <p className="text-xs font-semibold text-slate-300 uppercase">Đang Theo Học / Chưa Xếp Loại</p>
                <p className="text-2xl font-bold text-white mt-1">{stats?.tyLeHoanThanh?.chuaXepLoai || 0}</p>
                <p className="text-[11px] text-slate-400 mt-1">Đang hoàn thành số tiết quy định</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
