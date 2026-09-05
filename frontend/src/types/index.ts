export type VaiTro = 'QUAN_LY' | 'GIAO_VIEN' | 'HOC_VIEN' | 'TU_VAN_VIEN';
export type TrinhDoCEFR = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
export type TrangThaiLopHoc = 'SAP_MO' | 'DANG_MO_DANG_KY' | 'DANG_HOC' | 'DA_KET_THUC' | 'DA_HUY';
export type TrangThaiHoaDon = 'CHUA_THANH_TOAN' | 'THANH_TOAN_MOT_PHAN' | 'DA_HOAN_THANH' | 'QUA_HAN';
export type TrangThaiDiemDanh = 'CO_MAT' | 'VANG' | 'DI_MUON' | 'CO_PHEP';
export type TrangThaiHoanThanh = 'DAT' | 'KHONG_DAT' | 'CHUA_XEP_LOAI';

export interface UserSession {
  id: number;
  tenDangNhap: string;
  email: string;
  soDienThoai?: string;
  vaiTro: VaiTro;
  accessToken: string;
  hoTen?: string;
  maTuVanVien?: string;
  hoSoHocVien?: {
    id: number;
    maHocVien: string;
    hoTen: string;
    trinhDoCEFR: TrinhDoCEFR;
    ngaySinh?: string;
    gioiTinh?: string;
    diaChi?: string;
  };
  hoSoGiaoVien?: {
    id: number;
    maGiaoVien: string;
    hoTen: string;
    chuyenMon: string;
    bangCap?: string;
  };
}

export interface KhoaHoc {
  id: number;
  maKhoaHoc: string;
  tenKhoaHoc: string;
  ngonNgu: string;
  trinhDoYeuCau: TrinhDoCEFR;
  thoiLuongGio: number;
  hocPhi: string | number;
  moTa?: string;
  trangThai: string;
  _count?: { lopHoc: number };
}

export interface LichHoc {
  id: number;
  lopHocId: number;
  thuTrongTuan: number;
  gioBatDau: string;
  gioKetThuc: string;
  phongHoc: string;
}

export interface BuoiHoc {
  id: number;
  lopHocId: number;
  soThuTu: number;
  ngayHoc: string;
  gioBatDau: string;
  gioKetThuc: string;
  phongHoc?: string;
  chuDe?: string;
  trangThai: 'CHUA_DIEN_RA' | 'DANG_DIEN_RA' | 'DA_KET_THUC' | 'DA_HUY';
}

export interface LopHoc {
  id: number;
  khoaHocId: number;
  maLopHoc: string;
  tenLopHoc: string;
  siSoToiDa: number;
  siSoHienTai: number;
  ngayBatDau: string;
  ngayKetThuc: string;
  phongHoc?: string;
  linkOnline?: string;
  trangThai: TrangThaiLopHoc;
  khoaHoc?: KhoaHoc;
  lichHoc?: LichHoc[];
  phanCong?: any[];
  dangKyHoc?: any[];
  buoiHoc?: BuoiHoc[];
  _count?: {
    buoiHoc?: number;
    dangKyHoc?: number;
    lopHoc?: number;
  };
}

export interface HocVien {
  id: number;
  nguoiDungId?: number;
  maHocVien: string;
  hoTen: string;
  ngaySinh?: string;
  gioiTinh?: string;
  diaChi?: string;
  trinhDoCEFR: TrinhDoCEFR;
  nguonDanhGia?: string;
  lichRanhJson?: any;
  trangThai: string;
  nguoiDung?: {
    id?: number;
    tenDangNhap?: string;
    email: string;
    soDienThoai?: string;
    hoTen?: string;
    dangHoatDong?: boolean;
  };
}

export interface GiaoVien {
  id: number;
  maGiaoVien: string;
  hoTen: string;
  chuyenMon: string;
  bangCap?: string;
  trangThai: string;
  nguoiDung?: {
    id?: number;
    tenDangNhap?: string;
    email: string;
    soDienThoai?: string;
    hoTen?: string;
    dangHoatDong?: boolean;
  };
}

export interface HoaDon {
  id: number;
  maHoaDon: string;
  hocVienId?: number;
  dangKyHocId?: number;
  soTienPhaiTra: string | number;
  soTienDaTra: string | number;
  hanThanhToan: string;
  ngayLap?: string;
  createdAt?: string;
  trangThai: TrangThaiHoaDon;
  hocVien?: { id?: number; maHocVien: string; hoTen: string };
  dangKyHoc?: {
    id?: number;
    lopHocId?: number;
    hocVienId?: number;
    lopHoc?: { id?: number; maLopHoc: string; tenLopHoc: string };
  };
  thanhToan?: any[];
}

export interface ThanhToan {
  id: number;
  maGiaoDich?: string;
  hoaDonId?: number | string;
  soTien: string | number;
  phuongThuc: 'TIEN_MAT' | 'CHUYEN_KHOAN';
  trangThai?: string;
  ghiChu?: string;
  thoiGianThanhToan?: string;
  createdAt?: string;
  nguoiThu?: { id: number; tenDangNhap: string; email?: string };
  hoaDon?: {
    maHoaDon?: string;
    hocVien?: { maHocVien: string; hoTen: string };
    dangKyHoc?: {
      lopHoc?: { maLopHoc: string; tenLopHoc: string };
    };
  };
}
