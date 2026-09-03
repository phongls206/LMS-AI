// Centralized Vietnamese Formatters for LMS-AI
// Bảng ánh xạ toàn bộ mã trạng thái (Enums) sang tiếng Việt chuẩn, có dấu và thân thiện với UI

export const STATUS_MAP: Record<string, string> = {
  // 1. TrangThaiDangKy (Đăng ký học)
  CHO_THANH_TOAN: 'Chờ Thanh Toán',
  CHO_XAC_NHAN: 'Chờ Xác Nhận',
  DA_XAC_NHAN: 'Đã Xác Nhận',
  DA_HUY: 'Đã Hủy',
  HOAN_THANH: 'Hoàn Thành',

  // 2. TrangThaiLopHoc (Lớp học)
  SAP_MO: 'Sắp Mở',
  DANG_MO_DANG_KY: 'Đang Mở Tuyển Sinh',
  DANG_HOC: 'Đang Học',
  DA_KET_THUC: 'Đã Kết Thúc',

  // 3. TrangThaiHocVien (Học viên)
  DA_TOT_NGHIEP: 'Đã Tốt Nghiệp',
  BAO_LUU: 'Bảo Lưu',
  NGHI_HOC: 'Nghỉ Học',
  THOI_HOC: 'Nghỉ Học',

  // 4. TrangThaiGiaoVien (Giáo viên)
  DANG_LAM_VIEC: 'Đang Làm Việc',
  TAM_NGHI: 'Tạm Nghỉ',
  DA_NGHI_VIEC: 'Đã Nghỉ Việc',

  // 5. TrangThaiHoaDon (Hóa đơn / Học phí)
  CHUA_THANH_TOAN: 'Chưa Thanh Toán',
  CHUA_DONG: 'Chưa Đóng',
  THANH_TOAN_MOT_PHAN: 'Thanh Toán Một Phần',
  DONG_MOT_PHAN: 'Đóng Một Phần',
  CON_NO: 'Còn Nợ',
  DA_THANH_TOAN: 'Đã Thanh Toán',
  DA_HOAN_THANH: 'Đã Thanh Toán Đủ',
  DA_DONG: 'Đã Đóng',
  QUA_HAN: 'Quá Hạn',

  // 6. TrangThaiDiemDanh (Điểm danh)
  CO_MAT: 'Có Mặt',
  VANG: 'Vắng Mặt',
  VANG_KHONG_PHEP: 'Vắng Không Phép',
  VANG_CO_PHEP: 'Vắng Có Phép',
  CO_PHEP: 'Có Phép',
  DI_MUON: 'Đi Muộn',

  // 7. TrangThaiHoanThanh (Kết quả học tập)
  DAT: 'Đạt Chuẩn',
  KHONG_DAT: 'Chưa Đạt',
  CHUA_XEP_LOAI: 'Chưa Xếp Loại',

  // 8. PhuongThucThanhToan
  TIEN_MAT: 'Tiền Mặt',
  CHUYEN_KHOAN: 'Chuyển Khoản',

  // 9. TrangThaiThanhToan
  THANH_CONG: 'Thành Công',
  THAT_BAI: 'Thất Bại',
  HOAN_TRA: 'Hoàn Trả',

  // 10. VaiTro & Phân công
  QUAN_LY: 'Quản Trị Viên',
  GIAO_VIEN: 'Giáo Viên',
  HOC_VIEN: 'Học Viên',
  TU_VAN_VIEN: 'Tư Vấn Viên',
  CHINH: 'Giảng Viên Chính',
  TRO_GIANG: 'Trợ Giảng',
  DANG_PHU_TRACH: 'Đang Phụ Trách',

  // 11. TrangThaiBuoiHoc
  CHUA_DIEN_RA: 'Chưa Diễn Ra',
  DANG_DIEN_RA: 'Đang Diễn Ra',
};

/**
 * Định dạng mọi mã trạng thái (Enums) sang tiếng Việt có dấu
 */
export const formatStatus = (status?: string): string => {
  if (!status) return '';
  const upper = status.toUpperCase();
  if (STATUS_MAP[upper]) return STATUS_MAP[upper];
  
  // Tự động chuyển đổi snake_case sang Title Case nếu không có trong từ điển
  return status
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
};

export const formatTrangThaiDangKy = (status?: string): string => {
  if (!status) return 'Đã Xác Nhận';
  return formatStatus(status);
};

export const formatTrangThaiHocVien = (status?: string): string => {
  if (!status) return 'Đang Học';
  return formatStatus(status);
};

export const formatTrangThaiGiaoVien = (status?: string): string => {
  if (!status) return 'Đang Làm Việc';
  return formatStatus(status);
};

export const formatTrangThaiLopHoc = (status?: string): string => {
  if (!status) return 'Đang Diễn Ra';
  return formatStatus(status);
};

export const formatTrangThaiHoaDon = (status?: string): string => {
  if (!status) return 'Chờ Thu';
  return formatStatus(status);
};

export const formatTrangThaiDiemDanh = (status?: string): string => {
  if (!status) return 'Chưa Điểm Danh';
  return formatStatus(status);
};
