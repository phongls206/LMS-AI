'use client';

import React, { useEffect, useState } from 'react';
import { AppLayout } from '../../../components/AppLayout';
import { gradesService } from '../../../services/api';
import {
  Calendar, Clock, MapPin, ChevronDown, ChevronUp, AlertCircle,
  CheckCircle2, XCircle, Info, BookOpen, Layers
} from 'lucide-react';
import { formatTrangThaiDangKy, formatTrangThaiLopHoc } from '../../../utils/formatters';

export default function StudentSchedulePage() {
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedClassId, setExpandedClassId] = useState<number | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const list = await gradesService.getStudentSchedule();
        setEnrollments(list || []);
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
      allowedRoles={['HOC_VIEN']}
      title="Thời Khóa Biểu & Lịch Học Cá Nhân"
      subtitle="Theo dõi khung giờ học hàng tuần, phòng học, giáo viên và lịch trình chi tiết từng buổi học"
    >
      <div className="space-y-6">
        {loading ? (
          <div className="py-20 flex justify-center items-center">
            <div className="w-8 h-8 border-4 border-teal-500/20 border-t-teal-600 rounded-full animate-spin"></div>
          </div>
        ) : enrollments.length > 0 ? (
          <div className="space-y-6">
            {enrollments.map((enr) => {
              const lop = enr.lopHoc;
              const isExpanded = expandedClassId === Number(lop?.id);
              const isRecruiting = lop?.trangThai === 'DANG_MO_DANG_KY' || lop?.trangThai === 'SAP_MO';
              const isOngoing = lop?.trangThai === 'DANG_HOC';
              const sessions = lop?.buoiHoc || [];

              return (
                <div
                  key={enr.id}
                  className="rounded-2xl bg-white border border-slate-200/90 shadow-sm overflow-hidden hover:border-teal-300 transition"
                >
                  {/* Card Header & Summary */}
                  <div className="p-6">
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
                            Đang Mở Tuyển Sinh (Chưa Khai Giảng)
                          </span>
                        ) : isOngoing ? (
                          <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            Đang Học (Đã Ổn Định Sĩ Số)
                          </span>
                        ) : (
                          <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-slate-100 text-slate-600 border border-slate-200">
                            {formatTrangThaiLopHoc(lop?.trangThai)}
                          </span>
                        )}
                      </div>

                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
                          enr.trangThai === 'DA_XAC_NHAN' || enr.trangThai === 'HOAN_THANH'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : enr.trangThai === 'CHO_THANH_TOAN' || enr.trangThai === 'CHO_XAC_NHAN'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                      >
                        Hồ sơ ghi danh: {formatTrangThaiDangKy(enr.trangThai)}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 mb-1">{lop?.tenLopHoc}</h3>
                    <p className="text-xs text-slate-500 mb-4">{lop?.khoaHoc?.tenKhoaHoc}</p>

                    {/* Banner nếu lớp đang tuyển sinh */}
                    {isRecruiting && (
                      <div className="mb-4 p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                        <span>
                          Lớp học đang trong giai đoạn tiếp nhận học viên (Sĩ số hiện tại:{' '}
                          <strong>{lop?.siSoHienTai || 0} / {lop?.siSoToiDa || 25} HV</strong>).
                          Lớp học và các buổi điểm danh sẽ chính thức bắt đầu ngay khi hoàn tất tuyển sinh và ổn định sĩ số.
                        </span>
                      </div>
                    )}

                    {/* Thông tin giảng viên & Sĩ số */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-700 border-t border-slate-100 pt-4 mb-4">
                      <div>
                        <span className="text-slate-500 block mb-0.5">Giáo viên phụ trách:</span>
                        <span className="font-bold text-slate-900 text-sm">
                          {lop?.phanCong?.[0]?.giaoVien?.hoTen || 'Đang cập nhật phân công'}
                        </span>
                        {lop?.phanCong?.[0]?.giaoVien?.chuyenMon && (
                          <span className="text-[11px] text-teal-700 block mt-0.5">
                            Chuyên môn: {lop.phanCong[0].giaoVien.chuyenMon}
                          </span>
                        )}
                      </div>

                      <div>
                        <span className="text-slate-500 block mb-0.5">Thời gian toàn khóa:</span>
                        <span className="font-bold text-slate-900">
                          {lop?.ngayBatDau ? formatDate(lop.ngayBatDau) : 'Chưa có'} →{' '}
                          {lop?.ngayKetThuc ? formatDate(lop.ngayKetThuc) : 'Chưa có'}
                        </span>
                        <span className="text-[11px] text-slate-500 block mt-0.5">
                          Tổng số {sessions.length} buổi học trong khóa
                        </span>
                      </div>
                    </div>

                    {/* Khung giờ học cố định hàng tuần */}
                    <div>
                      <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-teal-600" />
                        <span>Khung Giờ & Lịch Học Hàng Tuần</span>
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

                    {/* Toggle nút mở lịch trình buổi học */}
                    <div className="pt-4 mt-4 border-t border-slate-100 flex justify-between items-center">
                      <button
                        type="button"
                        onClick={() => setExpandedClassId(isExpanded ? null : Number(lop?.id))}
                        className="px-3.5 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100/80 text-teal-800 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
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

                      <span className="text-[11px] text-slate-400">
                        {isRecruiting ? 'Lớp chưa khai giảng' : 'Lớp đã vào học chính thức'}
                      </span>
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
                          {isRecruiting ? 'Lớp đang mở tuyển sinh' : 'Cập nhật theo kết quả điểm danh'}
                        </span>
                      </div>

                      {sessions.length > 0 ? (
                        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                          <div className="max-h-72 overflow-y-auto">
                            <table className="w-full text-left text-xs border-collapse">
                              <thead className="bg-slate-50 text-slate-600 font-bold sticky top-0 border-b border-slate-200 z-10">
                                <tr>
                                  <th className="py-2 px-3 w-16 text-center">Buổi</th>
                                  <th className="py-2 px-3 w-28">Ngày Học</th>
                                  <th className="py-2 px-3 w-28">Khung Giờ</th>
                                  <th className="py-2 px-3">Chủ Đề Buổi Học</th>
                                  <th className="py-2 px-3 w-28 text-center">Trạng Thái</th>
                                  <th className="py-2 px-3 w-28 text-center">Chuyên Cần</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                {sessions.map((s: any) => {
                                  const attRecord = s.diemDanh?.[0];
                                  const isDone = s.trangThai === 'DA_KET_THUC';

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
                                      <td className="py-2.5 px-3 text-center">
                                        {attRecord ? (
                                          attRecord.trangThai === 'CO_MAT' ? (
                                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                                              <CheckCircle2 className="w-3 h-3" /> Có mặt
                                            </span>
                                          ) : attRecord.trangThai === 'VANG' ? (
                                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                                              <XCircle className="w-3 h-3" /> Vắng
                                            </span>
                                          ) : attRecord.trangThai === 'DI_MUON' ? (
                                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                                              <Clock className="w-3 h-3" /> Đi muộn
                                            </span>
                                          ) : (
                                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                                              <Info className="w-3 h-3" /> Có phép
                                            </span>
                                          )
                                        ) : isDone ? (
                                          <span className="text-slate-400 text-[11px]">—</span>
                                        ) : (
                                          <span className="text-slate-400 text-[11px]">Chưa điểm danh</span>
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
                          Chưa có danh sách buổi học nào được tạo cho lớp này.
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
            <h4 className="font-bold text-slate-800 text-sm">Bạn chưa có lịch học nào trong học kỳ này</h4>
            <p className="text-xs text-slate-500">
              Hãy đăng ký khóa học mới tại trang Đăng Ký Khóa Học để được xếp lịch học.
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
