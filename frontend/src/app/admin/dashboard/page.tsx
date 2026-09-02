'use client';

import React, { useEffect, useState } from 'react';
import { AppLayout } from '../../../components/AppLayout';
import { statisticsService } from '../../../services/api';
import {
  Users,
  GraduationCap,
  BookOpen,
  DollarSign,
  TrendingUp,
  Award,
  Sparkles,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await statisticsService.getDashboard();
        setStats(data);
      } catch (err) {
        console.error('Lỗi tải thống kê:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <AppLayout
      allowedRoles={['QUAN_LY']}
      title="Bảng Điều Khiển Quản Trị (Admin Dashboard)"
      subtitle="Tổng quan hoạt động đào tạo, tài chính và phân tích hệ thống"
    >
      {loading ? (
        <div className="py-20 flex justify-center items-center">
          <div className="w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tổng Học Viên</p>
                  <p className="text-2xl font-bold text-white mt-1">{stats?.tongQuan?.tongHocVien || 0}</p>
                </div>
                <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400">
                  <Users className="w-6 h-6" />
                </div>
              </div>
              <div className="mt-3 flex items-center text-xs text-emerald-400">
                <TrendingUp className="w-3.5 h-3.5 mr-1" />
                <span>Đang theo học tại trung tâm</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Lớp Đang Mở</p>
                  <p className="text-2xl font-bold text-white mt-1">{stats?.tongQuan?.lopDangMo || 0}</p>
                </div>
                <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400">
                  <GraduationCap className="w-6 h-6" />
                </div>
              </div>
              <div className="mt-3 flex items-center text-xs text-blue-400">
                <span>{stats?.tongQuan?.tongKhoaHoc || 0} chương trình đào tạo</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Đội Ngũ Giáo Viên</p>
                  <p className="text-2xl font-bold text-white mt-1">{stats?.tongQuan?.tongGiaoVien || 0}</p>
                </div>
                <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400">
                  <BookOpen className="w-6 h-6" />
                </div>
              </div>
              <div className="mt-3 flex items-center text-xs text-amber-400">
                <span>Trình độ đạt chuẩn quốc tế</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tổng Doanh Thu</p>
                  <p className="text-2xl font-bold text-emerald-400 mt-1">
                    {(stats?.tongQuan?.tongDoanhThu || 0).toLocaleString()} đ
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <DollarSign className="w-6 h-6" />
                </div>
              </div>
              <div className="mt-3 flex items-center text-xs text-emerald-400">
                <span>Thanh toán thực tế đã thu</span>
              </div>
            </div>
          </div>

          {/* Sĩ số các lớp & Tỷ lệ đạt */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sĩ số lớp học */}
            <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-white text-base">Tình Trạng Sĩ Số Các Lớp Đang Mở (Tối đa 25/lớp)</h3>
                <span className="text-xs text-slate-400 font-medium">Quy chuẩn Business Rule 25 học viên</span>
              </div>

              <div className="space-y-4">
                {stats?.siSoCacLop?.length > 0 ? (
                  stats.siSoCacLop.map((c: any) => {
                    const percent = Math.min(100, Math.round((c.siSoHienTai / c.siSoToiDa) * 100));
                    return (
                      <div key={c.id} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
                        <div className="flex justify-between items-center mb-2">
                          <div>
                            <span className="text-xs font-bold text-indigo-400 mr-2">[{c.maLopHoc}]</span>
                            <span className="text-sm font-semibold text-white">{c.tenLopHoc}</span>
                          </div>
                          <span className="text-xs font-bold text-slate-300">
                            {c.siSoHienTai} / {c.siSoToiDa} HV ({percent}%)
                          </span>
                        </div>
                        <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              percent >= 90
                                ? 'bg-rose-500'
                                : percent >= 60
                                ? 'bg-amber-500'
                                : 'bg-indigo-500'
                            }`}
                            style={{ width: `${percent}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-slate-500 py-6 text-center">Chưa có dữ liệu lớp học.</p>
                )}
              </div>
            </div>

            {/* Tỷ lệ hoàn thành */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <Award className="w-5 h-5 text-amber-400" />
                  <h3 className="font-bold text-white text-base">Tỷ Lệ Đạt Đầu Ra (≥ 50đ & ≥ 80% CC)</h3>
                </div>

                <div className="py-6 text-center">
                  <div className="inline-flex items-center justify-center w-28 h-28 rounded-full bg-indigo-500/10 border-4 border-indigo-500 text-3xl font-black text-white mb-2">
                    {stats?.tyLeHoanThanh?.tyLeDatPhanTram || 0}%
                  </div>
                  <p className="text-xs text-slate-400">Tỷ lệ học viên đạt yêu cầu hoàn thành khóa</p>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between p-2 rounded-lg bg-emerald-500/10 text-emerald-300">
                    <span>ĐẠT yêu cầu:</span>
                    <span className="font-bold">{stats?.tyLeHoanThanh?.dat || 0} học viên</span>
                  </div>
                  <div className="flex justify-between p-2 rounded-lg bg-rose-500/10 text-rose-300">
                    <span>KHÔNG ĐẠT:</span>
                    <span className="font-bold">{stats?.tyLeHoanThanh?.khongDat || 0} học viên</span>
                  </div>
                  <div className="flex justify-between p-2 rounded-lg bg-slate-800 text-slate-400">
                    <span>Đang học / Chưa xếp loại:</span>
                    <span className="font-bold">{stats?.tyLeHoanThanh?.chuaXepLoai || 0} học viên</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 rounded-xl bg-indigo-950/40 border border-indigo-800/40 text-[11px] text-indigo-300 flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>AI Module sẵn sàng hỗ trợ tư vấn và tóm tắt tiến độ tự động</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
