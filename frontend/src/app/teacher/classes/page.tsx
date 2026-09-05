'use client';

import React, { useEffect, useState } from 'react';
import { AppLayout } from '../../../components/AppLayout';
import { classesService } from '../../../services/api';
import {
  GraduationCap, Users, Calendar, Clock, MapPin, AlertCircle,
  CheckCircle, ChevronDown, ChevronUp, BookOpen, Lock
} from 'lucide-react';
import Link from 'next/link';
import { formatTrangThaiLopHoc } from '../../../utils/formatters';

export default function TeacherClassesPage() {
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedClassId, setExpandedClassId] = useState<number | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const list = await classesService.getTeacherSchedule();
        setClasses(list || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const formatTime = (timeStr?: string) => {
    if (!timeStr) return '';
    if (timeStr.includes('T')) {
      return new Date(timeStr).toISOString().substring(11, 16);
    }
    return timeStr.substring(0, 5);
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('vi-VN');
  };

  return (
    <AppLayout
      allowedRoles={['GIAO_VIEN']}
      title="Danh Sách Lớp Học Phụ Trách & TKB"
      subtitle="Theo dõi tiến độ, khung giờ dạy hàng tuần, sĩ số học viên và lịch trình chi tiết từng buổi học"
    >
      <div className="space-y-6">
        {loading ? (
          <div className="py-20 flex justify-center items-center">
            <div className="w-8 h-8 border-4 border-teal-500/20 border-t-teal-600 rounded-full animate-spin"></div>
          </div>
        ) : classes.length > 0 ? (
          <div className="space-y-6">
            {classes.map((item) => {
              const lop = item.lopHoc;
              const isRecruiting = lop?.trangThai === 'DANG_MO_DANG_KY' || lop?.trangThai === 'SAP_MO';
              const isOngoing = lop?.trangThai === 'DANG_HOC';
              const isExpanded = expandedClassId === Number(lop?.id);
              const sessions = lop?.buoiHoc || [];

              return (
                <div
                  key={item.id}
                  className="rounded-2xl bg-white border border-slate-200/90 shadow-sm overflow-hidden hover:border-teal-400 transition"
                >
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex flex-wrap justify-between items-start gap-3 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-teal-700 px-2.5 py-1 rounded-lg bg-teal-50 border border-teal-200">
                          {lop?.maLopHoc}
                        </span>
                        <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-slate-100 text-slate-700 border border-slate-200">
                          CEFR {lop?.khoaHoc?.trinhDoYeuCau || 'Chuẩn'}
                        </span>
                        {isRecruiting ? (
                          <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                            Đang Mở Tuyển Sinh
                          </span>
                        ) : isOngoing ? (
                          <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            Đang Học
                          </span>
                        ) : (
                          <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-slate-100 text-slate-600 border border-slate-200">
                            {formatTrangThaiLopHoc(lop?.trangThai)}
                          </span>
                        )}
                      </div>

                      <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200">
                        Giáo Viên Phụ Trách
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 mb-1">{lop?.tenLopHoc}</h3>
                    <p className="text-xs text-slate-500 mb-4">{lop?.khoaHoc?.tenKhoaHoc}</p>

                    {/* Banner nếu lớp đang tuyển sinh */}
                    {isRecruiting && (
                      <div className="mb-4 p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-800 flex items-start gap-2.5">
                        <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                        <div>
                          <strong className="block font-bold">Lớp học đang mở tuyển sinh (Chưa vào học chính thức):</strong>
                          <span>
                            Sĩ số hiện tại: <strong>{lop?.siSoHienTai || 0} / {lop?.siSoToiDa || 25} học viên</strong>.
                            Để tránh làm sai lệch dữ liệu, tính năng <strong>Điểm Danh</strong> và <strong>Bảng Điểm</strong> chỉ được kích hoạt khi lớp hoàn tất tuyển sinh và chuyển sang trạng thái <strong>"Đang Học"</strong>.
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Thông tin sĩ số & Thời gian */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 mb-4">
                      <div>
                        <span className="text-slate-500 block mb-0.5">Sĩ số học viên:</span>
                        <span className="font-bold text-slate-900 text-sm">
                          {lop?.siSoHienTai || 0} / {lop?.siSoToiDa || 25} HV
                        </span>
                        <span className="text-[11px] text-slate-500 block">
                          {isRecruiting ? '(Đang tiếp nhận ghi danh)' : '(Đã chốt sĩ số ổn định)'}
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-500 block mb-0.5">Thời gian khóa học:</span>
                        <span className="font-bold text-slate-900">
                          {lop?.ngayBatDau ? formatDate(lop.ngayBatDau) : 'Chưa có'} →{' '}
                          {lop?.ngayKetThuc ? formatDate(lop.ngayKetThuc) : 'Chưa có'}
                        </span>
                        <span className="text-[11px] text-slate-500 block">
                          Kế hoạch {sessions.length} buổi học
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-500 block mb-0.5">Tình trạng buổi học:</span>
                        <span className="font-bold text-slate-900">
                          {sessions.filter((s: any) => s.trangThai === 'DA_KET_THUC').length} / {sessions.length} Buổi đã học
                        </span>
                        <span className="text-[11px] text-teal-700 block">
                          {isRecruiting ? 'Chưa bắt đầu giảng dạy' : 'Đang trong tiến trình học'}
                        </span>
                      </div>
                    </div>

                    {/* Khung giờ dạy cố định trong tuần */}
                    <div className="mb-4">
                      <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-teal-600" />
                        <span>Khung Giờ Lên Lớp Hàng Tuần</span>
                      </h4>
                      {lop?.lichHoc && lop.lichHoc.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                          {lop.lichHoc.map((l: any) => (
                            <div
                              key={l.id}
                              className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between"
                            >
                              <div>
                                <span className="font-bold text-teal-900 block text-xs">
                                  Thứ {l.thuTrongTuan === 8 ? 'Chủ Nhật' : l.thuTrongTuan}
                                </span>
                                <span className="font-mono text-slate-600 text-[11px] font-medium">
                                  {formatTime(l.gioBatDau)} - {formatTime(l.gioKetThuc)}
                                </span>
                              </div>
                              <span className="flex items-center px-2 py-1 rounded-lg bg-white border border-slate-200 font-mono text-[11px] text-slate-700 font-bold">
                                <MapPin className="w-3 h-3 mr-1 text-slate-400" /> {l.phongHoc}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400 italic">Chưa xếp lịch học hàng tuần.</p>
                      )}
                    </div>

                    {/* Actions bar */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setExpandedClassId(isExpanded ? null : Number(lop?.id))}
                        className="px-3.5 py-2 rounded-xl bg-teal-50 hover:bg-teal-100/80 text-teal-800 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <Calendar className="w-3.5 h-3.5 text-teal-600" />
                        <span>
                          {isExpanded
                            ? 'Thu Gọn Lịch Trình Buổi Học'
                            : `Xem Lịch Trình Chi Tiết Các Buổi Học (${sessions.length} Buổi)`}
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </button>

                      <div className="flex items-center gap-2.5">
                        {isRecruiting ? (
                          <>
                            <button
                              disabled
                              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-400 text-xs font-bold border border-slate-200 cursor-not-allowed flex items-center gap-1.5"
                              title="Lớp đang mở tuyển sinh, chưa bắt đầu học. Không thể điểm danh!"
                            >
                              <Lock className="w-3.5 h-3.5" />
                              <span>Điểm Danh (Chưa Khai Giảng)</span>
                            </button>
                            <button
                              disabled
                              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-400 text-xs font-bold border border-slate-200 cursor-not-allowed flex items-center gap-1.5"
                              title="Lớp đang mở tuyển sinh, chưa có kết quả để nhập bảng điểm!"
                            >
                              <Lock className="w-3.5 h-3.5" />
                              <span>Bảng Điểm (Chưa Khai Giảng)</span>
                            </button>
                          </>
                        ) : (
                          <>
                            <Link
                              href={`/teacher/attendance?classId=${lop?.id}`}
                              className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition shadow-sm"
                            >
                              Điểm Danh Buổi Học
                            </Link>
                            <Link
                              href={`/teacher/grades?classId=${lop?.id}`}
                              className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition border border-slate-200"
                            >
                              Nhập & Xem Bảng Điểm
                            </Link>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expandable Session Timeline Table */}
                  {isExpanded && (
                    <div className="bg-slate-50/70 border-t border-slate-200 p-5 space-y-3 animate-fadeIn">
                      <div className="flex justify-between items-center">
                        <h5 className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-teal-600" />
                          <span>Lịch Trình Chi Tiết Từng Buổi Học ({sessions.length} Buổi)</span>
                        </h5>
                        <span className="text-[11px] text-slate-500">
                          {isRecruiting ? 'Lớp chưa khai giảng' : 'Lớp đang học'}
                        </span>
                      </div>

                      {sessions.length > 0 ? (
                        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                          <div className="max-h-72 overflow-auto">
                            <table className="w-full text-left text-xs border-collapse">
                              <thead className="bg-slate-50 text-slate-600 font-bold sticky top-0 border-b border-slate-200 z-10">
                                <tr>
                                  <th className="py-2 px-3 w-16 text-center">Buổi</th>
                                  <th className="py-2 px-3 w-28">Ngày Học</th>
                                  <th className="py-2 px-3 w-28">Khung Giờ</th>
                                  <th className="py-2 px-3">Chủ Đề Buổi Học</th>
                                  <th className="py-2 px-3 w-28 text-center">Trạng Thái</th>
                                  <th className="py-2 px-3 w-28 text-center">Điểm Danh</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                {sessions.map((s: any) => {
                                  const isDone = s.trangThai === 'DA_KET_THUC';
                                  const attCount = s._count?.diemDanh || 0;

                                  return (
                                    <tr key={s.id} className="hover:bg-slate-50/80 transition">
                                      <td className="py-2.5 px-3 text-center font-bold text-slate-900">
                                        <span className="w-5 h-5 rounded-full bg-teal-50 text-teal-700 border border-teal-200 inline-flex items-center justify-center font-mono text-[10px]">
                                          {s.soThuTu}
                                        </span>
                                      </td>
                                      <td className="py-2.5 px-3 font-medium text-slate-800">
                                        {formatDate(s.ngayHoc)}
                                      </td>
                                      <td className="py-2.5 px-3 font-mono text-slate-600 text-[11px]">
                                        {formatTime(s.gioBatDau)} - {formatTime(s.gioKetThuc)}
                                      </td>
                                      <td className="py-2.5 px-3 font-medium text-slate-800">
                                        {s.chuDe || `Buổi ${s.soThuTu}`}
                                      </td>
                                      <td className="py-2.5 px-3 text-center">
                                        <span
                                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                            isDone
                                              ? 'bg-slate-100 text-slate-600'
                                              : s.trangThai === 'DANG_DIEN_RA'
                                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                              : 'bg-teal-50 text-teal-700 border border-teal-200'
                                          }`}
                                        >
                                          {isDone ? 'Đã học' : s.trangThai === 'DANG_DIEN_RA' ? 'Đang học' : 'Chưa học'}
                                        </span>
                                      </td>
                                      <td className="py-2.5 px-3 text-center font-mono text-[11px] text-slate-600">
                                        {isDone ? (
                                          <span className="text-emerald-700 font-bold">
                                            Đã ghi nhận ({attCount} HV)
                                          </span>
                                        ) : isRecruiting ? (
                                          <span className="text-slate-400">Chưa khai giảng</span>
                                        ) : (
                                          <span className="text-slate-400">Chưa điểm danh</span>
                                        )}
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      ) : (
                        <div className="p-4 rounded-xl bg-white border border-slate-200 text-center text-xs text-slate-500">
                          Chưa có danh sách buổi học nào cho lớp này.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 rounded-2xl bg-white border border-slate-200 text-center space-y-2">
            <Calendar className="w-8 h-8 text-slate-400 mx-auto" />
            <h4 className="font-bold text-slate-800 text-sm">Bạn chưa có lớp học nào được phân công</h4>
            <p className="text-xs text-slate-500">
              Liên hệ quản trị viên trung tâm để được phân công lớp phụ trách.
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
