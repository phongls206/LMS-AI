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

/**
 * Đọc số tiền Việt Nam Đồng thành chữ chuẩn xác
 */
export function docSoThanhChu(num: number): string {
  if (num === 0) return 'Không đồng';
  const chuSo = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];
  const tien = ['', 'nghìn', 'triệu', 'tỷ', 'nghìn tỷ', 'triệu tỷ'];

  function readGroup(group: number, full: boolean) {
    const tr = Math.floor(group / 100);
    const ch = Math.floor((group % 100) / 10);
    const dv = group % 10;
    let res = '';
    if (full || tr > 0) {
      res += chuSo[tr] + ' trăm ';
      if (ch === 0 && dv > 0) res += 'lẻ ';
    }
    if (ch > 1) {
      res += chuSo[ch] + ' mươi ';
      if (dv === 1) res += 'mốt ';
    } else if (ch === 1) {
      res += 'mười ';
      if (dv === 1) res += 'một ';
    }
    if (ch !== 1 && dv === 5 && (tr > 0 || ch > 0)) {
      res += 'lăm ';
    } else if (dv > 0 && !(ch > 1 && dv === 1) && !(ch === 1 && dv === 1)) {
      res += chuSo[dv] + ' ';
    }
    return res.trim();
  }

  let s = '';
  let n = Math.floor(num);
  let groupIdx = 0;
  while (n > 0) {
    const g = n % 1000;
    if (g > 0) {
      const gStr = readGroup(g, n >= 1000 && g < 100);
      s = gStr + ' ' + tien[groupIdx] + ' ' + s;
    }
    groupIdx++;
    n = Math.floor(n / 1000);
  }
  s = s.trim().replace(/\s+/g, ' ');
  if (!s) return 'Không đồng';
  return s.charAt(0).toUpperCase() + s.slice(1) + ' đồng chẵn.';
}

export function formatReceiptDate(d: Date | string): string {
  const date = new Date(d);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const mins = date.getMinutes().toString().padStart(2, '0');
  return `Ngày ${day} tháng ${month} năm ${year} (lúc ${hours}:${mins})`;
}

