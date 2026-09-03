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
        <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Tổng số {courses.length} chương trình đào tạo
            </span>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 hover:opacity-95 text-white text-xs font-bold shadow-md shadow-teal-600/20 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Mở Khóa Học Mới</span>
          </button>
        </div>

        {message && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center space-x-2 shadow-sm">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>{message}</span>
          </div>
        )}

        {/* Courses Grid */}
        {loading ? (
          <div className="py-20 flex justify-center items-center">
            <div className="w-8 h-8 border-4 border-teal-500/20 border-t-teal-600 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course.id}
                className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:border-teal-400 hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-1 rounded-md bg-teal-50 text-teal-700 text-xs font-bold font-mono border border-teal-200">
                      {course.maKhoaHoc}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                      CEFR {course.trinhDoYeuCau}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-2 leading-snug">{course.tenKhoaHoc}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mb-4">
                    {course.moTa || 'Chương trình đào tạo tiếng Anh chuẩn quốc tế.'}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center text-slate-500">
                      <Clock className="w-3.5 h-3.5 mr-1.5 text-slate-400" /> Thời lượng:
                    </span>
                    <span className="font-bold text-slate-800">{course.thoiLuongGio} giờ học</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center text-slate-500">
                      <DollarSign className="w-3.5 h-3.5 mr-1.5 text-slate-400" /> Học phí niêm yết:
                    </span>
                    <span className="font-black text-teal-700 text-sm">
                      {Number(course.hocPhi).toLocaleString()} đ
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-500 text-[11px] pt-1">
                    <span>Lớp học liên kết:</span>
                    <span className="font-bold text-slate-700">{course._count?.lopHoc || 0} lớp</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal Tạo Khóa Học Mới */}
        {showModal && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
            <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg p-6 shadow-2xl text-slate-800">
              <h3 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">Mở Chương Trình Khóa Học Mới</h3>

              <form onSubmit={handleCreateCourse} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Mã Khóa Học (VD: KH-IELTS-70)</label>
                  <input
                    type="text"
                    required
                    value={formData.maKhoaHoc}
                    onChange={(e) => setFormData({ ...formData, maKhoaHoc: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                    placeholder="KH-..."
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Tên Khóa Học</label>
                  <input
                    type="text"
                    required
                    value={formData.tenKhoaHoc}
                    onChange={(e) => setFormData({ ...formData, tenKhoaHoc: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                    placeholder="VD: IELTS Master 7.0+"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Chuẩn CEFR Yêu Cầu</label>
                    <select
                      value={formData.trinhDoYeuCau}
                      onChange={(e) => setFormData({ ...formData, trinhDoYeuCau: e.target.value as TrinhDoCEFR })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
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
                    <label className="block text-slate-700 font-bold mb-1">Thời Lượng (Giờ)</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={formData.thoiLuongGio}
                      onChange={(e) => setFormData({ ...formData, thoiLuongGio: +e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Học Phí Niêm Yết (VNĐ)</label>
                  <input
                    type="number"
                    required
                    min={0}
                    step={100000}
                    value={formData.hocPhi}
                    onChange={(e) => setFormData({ ...formData, hocPhi: +e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Mô Tả Khóa Học</label>
                  <textarea
                    rows={3}
                    value={formData.moTa}
                    onChange={(e) => setFormData({ ...formData, moTa: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                    placeholder="Mục tiêu và quyền lợi học viên..."
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition cursor-pointer"
                  >
                    Hủy Bỏ
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold transition disabled:opacity-50 cursor-pointer shadow-sm"
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
