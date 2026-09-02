'use client';

import React, { useEffect, useState } from 'react';
import { AppLayout } from '../../../components/AppLayout';
import { coursesService } from '../../../services/api';
import { KhoaHoc, TrinhDoCEFR } from '../../../types';
import { BookOpen, Plus, Clock, DollarSign, Award, CheckCircle } from 'lucide-react';

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<KhoaHoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    maKhoaHoc: '',
    tenKhoaHoc: '',
    trinhDoYeuCau: 'B1' as TrinhDoCEFR,
    thoiLuongGio: 60,
    hocPhi: 3500000,
    moTa: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const fetchCourses = async () => {
    try {
      const data = await coursesService.getAll();
      setCourses(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await coursesService.create(formData);
      setMessage('Tạo mới khóa học thành công!');
      setShowModal(false);
      setFormData({
        maKhoaHoc: '',
        tenKhoaHoc: '',
        trinhDoYeuCau: 'B1',
        thoiLuongGio: 60,
        hocPhi: 3500000,
        moTa: '',
      });
      fetchCourses();
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Có lỗi xảy ra.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppLayout
      allowedRoles={['QUAN_LY']}
      title="Quản Lý Danh Mục Khóa Học"
      subtitle="Danh sách các chương trình đào tạo chuẩn khung CEFR và học phí"
    >
      <div className="space-y-6">
        {/* Actions Bar */}
        <div className="flex justify-between items-center">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Tổng số {courses.length} chương trình đào tạo
            </span>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/30 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Mở Khóa Học Mới</span>
          </button>
        </div>

        {message && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>{message}</span>
          </div>
        )}

        {/* Courses Grid */}
        {loading ? (
          <div className="py-20 flex justify-center items-center">
            <div className="w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course.id}
                className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-400 text-xs font-bold font-mono">
                      {course.maKhoaHoc}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold">
                      CEFR {course.trinhDoYeuCau}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 leading-snug">{course.tenKhoaHoc}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2 mb-4">
                    {course.moTa || 'Chương trình đào tạo tiếng Anh chuẩn quốc tế.'}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800/80 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="flex items-center text-slate-400">
                      <Clock className="w-3.5 h-3.5 mr-1.5 text-slate-500" /> Thời lượng:
                    </span>
                    <span className="font-semibold">{course.thoiLuongGio} giờ học</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-300">
                    <span className="flex items-center text-slate-400">
                      <DollarSign className="w-3.5 h-3.5 mr-1.5 text-slate-500" /> Học phí niêm yết:
                    </span>
                    <span className="font-bold text-emerald-400 text-sm">
                      {Number(course.hocPhi).toLocaleString()} đ
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-400 text-[11px] pt-1">
                    <span>Lớp học liên kết:</span>
                    <span className="font-semibold text-slate-200">{course._count?.lopHoc || 0} lớp</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal Tạo Khóa Học Mới */}
        {showModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl">
              <h3 className="text-lg font-bold text-white mb-4">Mở Chương Trình Khóa Học Mới</h3>

              <form onSubmit={handleCreateCourse} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Mã Khóa Học (VD: KH-IELTS-70)</label>
                  <input
                    type="text"
                    required
                    value={formData.maKhoaHoc}
                    onChange={(e) => setFormData({ ...formData, maKhoaHoc: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                    placeholder="KH-..."
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Tên Khóa Học</label>
                  <input
                    type="text"
                    required
                    value={formData.tenKhoaHoc}
                    onChange={(e) => setFormData({ ...formData, tenKhoaHoc: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                    placeholder="VD: IELTS Master 7.0+"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Chuẩn CEFR Yêu Cầu</label>
                    <select
                      value={formData.trinhDoYeuCau}
                      onChange={(e) => setFormData({ ...formData, trinhDoYeuCau: e.target.value as TrinhDoCEFR })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="A1">A1 - Sơ Cấp</option>
                      <option value="A2">A2 - Tiền Trung Cấp</option>
                      <option value="B1">B1 - Trung Cấp</option>
                      <option value="B2">B2 - Trung Cao Cấp</option>
                      <option value="C1">C1 - Cao Cấp</option>
                      <option value="C2">C2 - Thành Thạo</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Thời Lượng (Giờ)</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={formData.thoiLuongGio}
                      onChange={(e) => setFormData({ ...formData, thoiLuongGio: +e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Học Phí Niêm Yết (VNĐ)</label>
                  <input
                    type="number"
                    required
                    min={0}
                    step={100000}
                    value={formData.hocPhi}
                    onChange={(e) => setFormData({ ...formData, hocPhi: +e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Mô Tả Khóa Học</label>
                  <textarea
                    rows={3}
                    value={formData.moTa}
                    onChange={(e) => setFormData({ ...formData, moTa: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                    placeholder="Mục tiêu và quyền lợi học viên..."
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition"
                  >
                    Hủy Bỏ
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition disabled:opacity-50"
                  >
                    {submitting ? 'Đang Lưu...' : 'Xác Nhận Tạo Khóa Học'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
