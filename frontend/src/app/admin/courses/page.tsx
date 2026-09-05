'use client';

import React, { useEffect, useState } from 'react';
import { AppLayout } from '../../../components/AppLayout';
import { coursesService } from '../../../services/api';
import { KhoaHoc, TrinhDoCEFR } from '../../../types';
import { 
  BookOpen, Plus, Clock, DollarSign, Award, CheckCircle, 
  Eye, Edit, Users, School, AlertCircle, X, ChevronRight, Check
} from 'lucide-react';
import Link from 'next/link';
import { ClassStudentsModal } from '../../../components/ClassStudentsModal';

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<KhoaHoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClassForStudents, setSelectedClassForStudents] = useState<{
    id: number;
    name?: string;
    code?: string;
  } | null>(null);
  
  // Modal Tạo Mới
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

  // Modal Xem Chi Tiết
  const [selectedCourseDetail, setSelectedCourseDetail] = useState<any | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Modal Chỉnh Sửa
  const [editingCourse, setEditingCourse] = useState<any | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    tenKhoaHoc: '',
    trinhDoYeuCau: 'B1' as TrinhDoCEFR,
    thoiLuongGio: 60,
    hocPhi: 3500000,
    moTa: '',
    trangThai: 'DANG_MO',
  });
  const [savingEdit, setSavingEdit] = useState(false);

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

  const handleOpenDetail = async (courseId: number) => {
    setShowDetailModal(true);
    setLoadingDetail(true);
    try {
      const detail = await coursesService.getById(courseId);
      setSelectedCourseDetail(detail);
    } catch (err) {
      console.error(err);
      alert('Không thể tải thông tin chi tiết khóa học.');
      setShowDetailModal(false);
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleOpenEdit = (course: any) => {
    setEditingCourse(course);
    setEditFormData({
      tenKhoaHoc: course.tenKhoaHoc || '',
      trinhDoYeuCau: (course.trinhDoYeuCau || 'B1') as TrinhDoCEFR,
      thoiLuongGio: course.thoiLuongGio || 60,
      hocPhi: Number(course.hocPhi) || 3500000,
      moTa: course.moTa || '',
      trangThai: course.trangThai || 'HOAT_DONG',
    });
    setShowEditModal(true);
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await coursesService.create(formData);
      setMessage('Tạo mới chương trình khóa học thành công!');
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
      setTimeout(() => setMessage(null), 3500);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Có lỗi xảy ra khi tạo khóa học.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveEditCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse) return;
    setSavingEdit(true);
    try {
      await coursesService.update(editingCourse.id, editFormData);
      setMessage(`Cập nhật khóa học [${editingCourse.maKhoaHoc}] thành công!`);
      setShowEditModal(false);
      setEditingCourse(null);
      fetchCourses();
      // Nếu đang mở xem chi tiết, cập nhật lại luôn
      if (selectedCourseDetail && Number(selectedCourseDetail.id) === Number(editingCourse.id)) {
        handleOpenDetail(editingCourse.id);
      }
      setTimeout(() => setMessage(null), 3500);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật khóa học.');
    } finally {
      setSavingEdit(false);
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === 'HOAT_DONG' || status === 'DANG_MO') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
          Đang Mở Tuyển Sinh
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 shadow-sm">
        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-1.5"></span>
        Tạm Ngừng Tuyển Sinh
      </span>
    );
  };

  const getClassStatusBadge = (status: string) => {
    switch (status) {
      case 'DANG_HOC':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">Đang học</span>;
      case 'DANG_MO_DANG_KY':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">Đang tuyển</span>;
      case 'SAP_MO':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">Sắp mở</span>;
      case 'DA_KET_THUC':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">Đã kết thúc</span>;
      default:
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">{status}</span>;
    }
  };

  return (
    <AppLayout
      allowedRoles={['QUAN_LY']}
      title="Quản Lý Danh Mục Khóa Học"
      subtitle="Quản lý chương trình đào tạo chuẩn CEFR, học phí, số lớp học và cấu hình giáo trình"
    >
      <div className="space-y-6">
        {/* Top Actions Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm">
          <div>
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-teal-600" />
              Tổng số {courses.length} chương trình đào tạo
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Bấm vào từng khóa học để xem các lớp học liên kết hoặc chỉnh sửa</p>
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
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-sm flex items-center space-x-2 shadow-sm animate-fadeIn">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
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
                className="group rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-teal-500/70 hover:shadow-lg hover:shadow-teal-500/5 transition-all duration-200 flex flex-col justify-between overflow-hidden"
              >
                <div className="p-6">
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-1 rounded-md bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 text-xs font-bold font-mono border border-teal-200 dark:border-teal-800">
                      {course.maKhoaHoc}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800">
                        CEFR {course.trinhDoYeuCau}
                      </span>
                      {getStatusBadge((course as any).trangThai || 'DANG_MO')}
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2 leading-snug group-hover:text-teal-600 transition-colors">
                    {course.tenKhoaHoc}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4">
                    {course.moTa || 'Chương trình đào tạo tiếng Anh chuẩn quốc tế theo khung tham chiếu châu Âu CEFR.'}
                  </p>

                  {/* Course Details Info */}
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-2.5 text-xs">
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                      <span className="flex items-center text-slate-500 dark:text-slate-400">
                        <Clock className="w-3.5 h-3.5 mr-1.5 text-teal-500" /> Thời lượng:
                      </span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{course.thoiLuongGio} giờ học</span>
                    </div>

                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                      <span className="flex items-center text-slate-500 dark:text-slate-400">
                        <DollarSign className="w-3.5 h-3.5 mr-1.5 text-teal-500" /> Học phí niêm yết:
                      </span>
                      <span className="font-black text-teal-600 dark:text-teal-400 text-sm">
                        {Number(course.hocPhi).toLocaleString()} đ
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-[11px] pt-1 border-t border-dashed border-slate-100 dark:border-slate-800">
                      <span className="flex items-center">
                        <School className="w-3.5 h-3.5 mr-1 text-slate-400" /> Lớp học liên kết:
                      </span>
                      <span className="font-bold text-slate-700 dark:text-slate-200">
                        {course._count?.lopHoc || 0} lớp học
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons (Clickable & Fully Functional) */}
                <div className="p-3 bg-slate-50/80 dark:bg-slate-900/80 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleOpenDetail(Number(course.id))}
                    className="flex-1 flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl bg-white dark:bg-slate-800 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-300 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition shadow-xs cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Xem Chi Tiết</span>
                  </button>
                  <button
                    onClick={() => handleOpenEdit(course)}
                    className="flex-1 flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl bg-teal-50 dark:bg-teal-950/40 hover:bg-teal-600 hover:text-white border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 text-xs font-bold transition cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Chỉnh Sửa</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* MODAL 1: XEM CHI TIẾT KHÓA HỌC & CÁC LỚP HỌC LIÊN KẾT */}
        {showDetailModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50 animate-fadeIn">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl text-slate-800 dark:text-slate-100 p-4 sm:p-6 space-y-5">
              {loadingDetail ? (
                <div className="py-20 flex flex-col justify-center items-center space-y-3">
                  <div className="w-8 h-8 border-4 border-teal-500/20 border-t-teal-600 rounded-full animate-spin"></div>
                  <p className="text-xs text-slate-500">Đang tải thông tin khóa học & danh sách lớp...</p>
                </div>
              ) : selectedCourseDetail ? (
                <>
                  {/* Modal Header */}
                  <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="px-2.5 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 text-xs font-bold font-mono border border-teal-200 dark:border-teal-800">
                          {selectedCourseDetail.maKhoaHoc}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800">
                          CEFR {selectedCourseDetail.trinhDoYeuCau}
                        </span>
                        {getStatusBadge(selectedCourseDetail.trangThai || 'HOAT_DONG')}
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                        {selectedCourseDetail.tenKhoaHoc}
                      </h3>
                    </div>
                    <button
                      onClick={() => setShowDetailModal(false)}
                      className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {selectedCourseDetail.trangThai === 'NGUNG_HOAT_DONG' && (
                    <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-800 dark:text-rose-300 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                      <span>
                        Khóa học này đang <strong>Tạm Ngừng Tuyển Sinh</strong>. Mọi lớp học trực thuộc đều đang bị khóa ghi danh học viên mới trên toàn hệ thống.
                      </span>
                    </div>
                  )}

                  {/* Course Summary Metrics */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                      <span className="text-[11px] text-slate-500 block">Thời Lượng</span>
                      <span className="text-base font-bold text-slate-900 dark:text-white">{selectedCourseDetail.thoiLuongGio} Giờ</span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-teal-50/60 dark:bg-teal-950/30 border border-teal-200/80 dark:border-teal-800/80">
                      <span className="text-[11px] text-teal-700 dark:text-teal-400 block">Học Phí Niêm Yết</span>
                      <span className="text-base font-black text-teal-700 dark:text-teal-300">
                        {Number(selectedCourseDetail.hocPhi).toLocaleString()} đ
                      </span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                      <span className="text-[11px] text-slate-500 block">Tổng Lớp Đang Mở</span>
                      <span className="text-base font-bold text-slate-900 dark:text-white">
                        {selectedCourseDetail.lopHoc?.length || 0} lớp
                      </span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                      <span className="text-[11px] text-slate-500 block">Tổng Học Viên</span>
                      <span className="text-base font-bold text-slate-900 dark:text-white">
                        {(selectedCourseDetail.lopHoc || []).reduce((acc: number, cur: any) => acc + (cur.siSoHienTai || 0), 0)} HV
                      </span>
                    </div>
                  </div>

                  {/* Course Description */}
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs leading-relaxed">
                    <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Mục tiêu & Đặc tả khóa học:</span>
                    <p className="text-slate-600 dark:text-slate-400">
                      {selectedCourseDetail.moTa || 'Chương trình đào tạo được xây dựng theo chuẩn quốc tế nhằm nâng cao toàn diện 4 kỹ năng Nghe - Nói - Đọc - Viết.'}
                    </p>
                  </div>

                  {/* Linked Classes Table */}
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                        <School className="w-3.5 h-3.5 text-teal-600" />
                        Danh sách các lớp học thuộc khóa này ({selectedCourseDetail.lopHoc?.length || 0})
                      </h4>
                      <Link
                        href="/admin/classes"
                        className="text-xs font-bold text-teal-600 hover:text-teal-700 hover:underline flex items-center gap-1"
                      >
                        Mở Quản lý Lớp học <ChevronRight className="w-3 h-3" />
                      </Link>
                    </div>

                    {selectedCourseDetail.lopHoc && selectedCourseDetail.lopHoc.length > 0 ? (
                      <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 font-bold border-b border-slate-200 dark:border-slate-700">
                            <tr>
                              <th className="py-2.5 px-3">Mã Lớp</th>
                              <th className="py-2.5 px-3">Tên Lớp Học</th>
                              <th className="py-2.5 px-3">Sĩ Số</th>
                              <th className="py-2.5 px-3">Trạng Thái</th>
                              <th className="py-2.5 px-3 text-right">Chi Tiết</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {selectedCourseDetail.lopHoc.map((lop: any) => (
                              <tr key={lop.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                                <td className="py-2.5 px-3 font-mono font-bold text-slate-900 dark:text-white">
                                  {lop.maLopHoc}
                                </td>
                                <td className="py-2.5 px-3 font-medium text-slate-800 dark:text-slate-200">
                                  {lop.tenLopHoc}
                                </td>
                                <td className="py-2.5 px-3">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setSelectedClassForStudents({
                                        id: Number(lop.id),
                                        name: lop.tenLopHoc,
                                        code: lop.maLopHoc,
                                      })
                                    }
                                    className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-teal-950/50 text-slate-700 dark:text-slate-300 hover:text-teal-700 dark:hover:text-teal-300 border border-slate-200 dark:border-slate-700 hover:border-teal-400 transition cursor-pointer font-bold text-xs"
                                    title="Bấm để xem danh sách học viên của lớp này"
                                  >
                                    <Users className="w-3 h-3 text-teal-600 dark:text-teal-400" />
                                    <span>
                                      {lop.siSoHienTai || 0} / {lop.siSoToiDa} HV
                                    </span>
                                  </button>
                                </td>
                                <td className="py-2.5 px-3">
                                  {getClassStatusBadge(lop.trangThai)}
                                </td>
                                <td className="py-2.5 px-3 text-right">
                                  <Link
                                    href="/admin/classes"
                                    className="px-2.5 py-1 rounded-lg bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 font-bold hover:bg-teal-600 hover:text-white transition inline-block text-[11px]"
                                  >
                                    Quản lý
                                  </Link>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="p-6 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400">
                        Chưa có lớp học nào được mở cho khóa này.
                      </div>
                    )}
                  </div>

                  {/* Modal Footer Actions */}
                  <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => {
                        setShowDetailModal(false);
                        handleOpenEdit(selectedCourseDetail);
                      }}
                      className="px-4 py-2 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 font-bold hover:bg-teal-600 hover:text-white transition text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Chỉnh Sửa Khóa Học Này</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowDetailModal(false)}
                      className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition text-xs cursor-pointer"
                    >
                      Đóng
                    </button>
                  </div>
                </>
              ) : null}
            </div>
          </div>
        )}

        {/* MODAL 2: CHỈNH SỬA THÔNG TIN KHÓA HỌC */}
        {showEditModal && editingCourse && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50 animate-fadeIn">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg p-4 sm:p-6 shadow-2xl text-slate-800 dark:text-slate-100 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Edit className="w-4 h-4 text-teal-600" />
                    Chỉnh Sửa Khóa Học [{editingCourse.maKhoaHoc}]
                  </h3>
                  <p className="text-xs text-slate-500">Cập nhật tên, thời lượng, học phí và chuẩn CEFR</p>
                </div>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveEditCourse} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Tên Khóa Học</label>
                  <input
                    type="text"
                    required
                    value={editFormData.tenKhoaHoc}
                    onChange={(e) => setEditFormData({ ...editFormData, tenKhoaHoc: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Chuẩn CEFR</label>
                    <select
                      value={editFormData.trinhDoYeuCau}
                      onChange={(e) => setEditFormData({ ...editFormData, trinhDoYeuCau: e.target.value as TrinhDoCEFR })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
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
                    <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Thời Lượng (Giờ)</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={editFormData.thoiLuongGio}
                      onChange={(e) => setEditFormData({ ...editFormData, thoiLuongGio: +e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Học Phí Niêm Yết (VNĐ)</label>
                    <input
                      type="number"
                      required
                      min={0}
                      step={50000}
                      value={editFormData.hocPhi}
                      onChange={(e) => setEditFormData({ ...editFormData, hocPhi: +e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Trạng Thái Hoạt Động</label>
                    <select
                      value={editFormData.trangThai === 'DANG_MO' ? 'HOAT_DONG' : (editFormData.trangThai || 'HOAT_DONG')}
                      onChange={(e) => setEditFormData({ ...editFormData, trangThai: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-teal-500 font-bold cursor-pointer"
                    >
                      <option value="HOAT_DONG">🟢 Đang Mở Tuyển Sinh</option>
                      <option value="NGUNG_HOAT_DONG">🔴 Tạm Ngừng Tuyển Sinh</option>
                    </select>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      {editFormData.trangThai === 'NGUNG_HOAT_DONG'
                        ? '⚠️ Khi tạm ngừng, học viên và tư vấn viên sẽ bị khóa không thể ghi danh vào bất kỳ lớp nào của khóa này.'
                        : '✓ Khóa học mở tuyển sinh bình thường cho các lớp trực thuộc.'}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Mô Tả & Mục Tiêu Khóa Học</label>
                  <textarea
                    rows={3}
                    value={editFormData.moTa}
                    onChange={(e) => setEditFormData({ ...editFormData, moTa: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
                    placeholder="Mục tiêu và quyền lợi học viên..."
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold transition cursor-pointer"
                  >
                    Hủy Bỏ
                  </button>
                  <button
                    type="submit"
                    disabled={savingEdit}
                    className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold transition disabled:opacity-50 cursor-pointer shadow-sm flex items-center gap-1.5"
                  >
                    {savingEdit ? (
                      <span>Đang Lưu...</span>
                    ) : (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Lưu Thay Đổi</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 3: TẠO KHÓA HỌC MỚI */}
        {showModal && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50 animate-fadeIn">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg p-4 sm:p-6 shadow-2xl text-slate-800 dark:text-slate-100 max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
                Mở Chương Trình Khóa Học Mới
              </h3>

              <form onSubmit={handleCreateCourse} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Mã Khóa Học (VD: KH-IELTS-70)</label>
                  <input
                    type="text"
                    required
                    value={formData.maKhoaHoc}
                    onChange={(e) => setFormData({ ...formData, maKhoaHoc: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
                    placeholder="KH-..."
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Tên Khóa Học</label>
                  <input
                    type="text"
                    required
                    value={formData.tenKhoaHoc}
                    onChange={(e) => setFormData({ ...formData, tenKhoaHoc: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
                    placeholder="VD: IELTS Master 7.0+"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Chuẩn CEFR Yêu Cầu</label>
                    <select
                      value={formData.trinhDoYeuCau}
                      onChange={(e) => setFormData({ ...formData, trinhDoYeuCau: e.target.value as TrinhDoCEFR })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
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
                    <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Thời Lượng (Giờ)</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={formData.thoiLuongGio}
                      onChange={(e) => setFormData({ ...formData, thoiLuongGio: +e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Học Phí Niêm Yết (VNĐ)</label>
                  <input
                    type="number"
                    required
                    min={0}
                    step={100000}
                    value={formData.hocPhi}
                    onChange={(e) => setFormData({ ...formData, hocPhi: +e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Mô Tả Khóa Học</label>
                  <textarea
                    rows={3}
                    value={formData.moTa}
                    onChange={(e) => setFormData({ ...formData, moTa: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
                    placeholder="Mục tiêu và quyền lợi học viên..."
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold transition cursor-pointer"
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

      {/* Modal xem danh sách học viên */}
      {selectedClassForStudents && (
        <ClassStudentsModal
          classId={selectedClassForStudents.id}
          initialClassName={selectedClassForStudents.name}
          initialClassCode={selectedClassForStudents.code}
          onClose={() => setSelectedClassForStudents(null)}
        />
      )}
    </AppLayout>
  );
}
