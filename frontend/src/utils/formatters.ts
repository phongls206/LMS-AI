// Centralized Vietnamese Formatters for LMS-AI

export const formatTrangThaiHocVien = (status?: string): string => {
  if (!status) return 'Đang Học';
  switch (status.toUpperCase()) {
    case 'DANG_HOC':
      return 'Đang Học';
    case 'DA_TOT_NGHIEP':
      return 'Đã Tốt Nghiệp';
    case 'BAO_LUU':
      return 'Bảo Lưu';
    case 'NGHI_HOC':
    case 'THOI_HOC':
      return 'Nghỉ Học';
    default:
      return status;
  }
};

export const formatTrangThaiGiaoVien = (status?: string): string => {
  if (!status) return 'Đang Làm Việc';
  switch (status.toUpperCase()) {
    case 'DANG_LAM_VIEC':
      return 'Đang Làm Việc';
    case 'TAM_NGHI':
      return 'Tạm Nghỉ';
    case 'DA_NGHI_VIEC':
      return 'Đã Nghỉ Việc';
    default:
      return status;
  }
};

export const formatTrangThaiLopHoc = (status?: string): string => {
  if (!status) return 'Đang Diễn Ra';
  switch (status.toUpperCase()) {
    case 'SAP_MO':
      return 'Sắp Mở';
    case 'DANG_MO_DANG_KY':
      return 'Đang Mở Tuyển Sinh';
    case 'DANG_HOC':
      return 'Đang Học';
    case 'DA_KET_THUC':
      return 'Đã Kết Thúc';
    case 'DA_HUY':
      return 'Đã Hủy';
    default:
      return status;
  }
};

export const formatTrangThaiHoaDon = (status?: string): string => {
  if (!status) return 'Chờ Thu';
  switch (status.toUpperCase()) {
    case 'DA_HOAN_THANH':
    case 'DA_THANH_TOAN':
    case 'DA_DONG':
      return 'Đã Thu Đủ';
    case 'THANH_TOAN_MOT_PHAN':
    case 'CON_NO':
      return 'Còn Nợ';
    case 'CHUA_THANH_TOAN':
    case 'CHUA_DONG':
      return 'Chưa Thu';
    default:
      return status;
  }
};

export const formatTrangThaiDiemDanh = (status?: string): string => {
  if (!status) return 'Chưa Điểm Danh';
  switch (status.toUpperCase()) {
    case 'CO_MAT':
      return 'Có Mặt';
    case 'VANG_CO_PHEP':
      return 'Vắng Có Phép';
    case 'VANG_KHONG_PHEP':
      return 'Vắng Không Phép';
    case 'DI_MUON':
      return 'Đi Muộn';
    default:
      return status;
  }
};
