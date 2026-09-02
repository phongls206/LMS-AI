import {
  PrismaClient,
  VaiTro,
  TrinhDoCEFR,
  TrangThaiHocVien,
  TrangThaiGiaoVien,
  TrangThaiKhoaHoc,
  TrangThaiLopHoc,
  VaiTroPhanCong,
  TrangThaiPhanCong,
  TrangThaiDangKy,
  TrangThaiHoaDon,
  PhuongThucThanhToan,
  TrangThaiThanhToan,
  TrangThaiBuoiHoc,
  TrangThaiDiemDanh,
  TrangThaiHoanThanh,
  LoaiChucNangAI,
  TrangThaiYeuCauAI,
} from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Bắt đầu nạp Siêu Dữ Liệu Mẫu (Rich Seed Data) cho ETC English Center...\n');

  // Mật khẩu mặc định cho toàn bộ tài khoản: 123456
  const defaultPassword = await argon2.hash('123456');

  // ============================================================================
  // 1. NGƯỜI DÙNG & HỒ SƠ (Quản lý, Giáo viên, Tư vấn viên, Học viên)
  // ============================================================================

  // 1.1 Quản lý (Admin)
  const adminUser = await prisma.nguoiDung.upsert({
    where: { tenDangNhap: 'admin01' },
    update: { matKhauMaHoa: defaultPassword },
    create: {
      tenDangNhap: 'admin01',
      matKhauMaHoa: defaultPassword,
      vaiTro: VaiTro.QUAN_LY,
      email: 'admin@etc-english.vn',
      soDienThoai: '0901111001',
    },
  });
  console.log(`✅ Admin: ${adminUser.tenDangNhap}`);

  // 1.2 Giáo viên (3 Giảng viên)
  const teacherUser1 = await prisma.nguoiDung.upsert({
    where: { tenDangNhap: 'teacher01' },
    update: { matKhauMaHoa: defaultPassword },
    create: {
      tenDangNhap: 'teacher01',
      matKhauMaHoa: defaultPassword,
      vaiTro: VaiTro.GIAO_VIEN,
      email: 'nguyen.thi.lan@etc-english.vn',
      soDienThoai: '0902222001',
    },
  });
  const gv1 = await prisma.hoSoGiaoVien.upsert({
    where: { maGiaoVien: 'GV001' },
    update: { nguoiDungId: teacherUser1.id },
    create: {
      nguoiDungId: teacherUser1.id,
      maGiaoVien: 'GV001',
      hoTen: 'Cô Nguyễn Thị Lan',
      chuyenMon: 'IELTS Academic, Ngữ Pháp Nâng Cao',
      bangCap: 'Thạc sĩ Ngôn ngữ Anh - ĐH Ngoại ngữ Hà Nội (IELTS 8.5)',
    },
  });

  const teacherUser2 = await prisma.nguoiDung.upsert({
    where: { tenDangNhap: 'teacher02' },
    update: { matKhauMaHoa: defaultPassword },
    create: {
      tenDangNhap: 'teacher02',
      matKhauMaHoa: defaultPassword,
      vaiTro: VaiTro.GIAO_VIEN,
      email: 'tran.van.minh@etc-english.vn',
      soDienThoai: '0902222002',
    },
  });
  const gv2 = await prisma.hoSoGiaoVien.upsert({
    where: { maGiaoVien: 'GV002' },
    update: { nguoiDungId: teacherUser2.id },
    create: {
      nguoiDungId: teacherUser2.id,
      maGiaoVien: 'GV002',
      hoTen: 'Thầy Trần Văn Minh',
      chuyenMon: 'TOEIC L&R, Tiếng Anh Giao Tiếp Thực Chiến',
      bangCap: 'Cử nhân Sư phạm Tiếng Anh - ĐH Sư phạm TP.HCM (TOEIC 985)',
    },
  });

  const teacherUser3 = await prisma.nguoiDung.upsert({
    where: { tenDangNhap: 'teacher03' },
    update: { matKhauMaHoa: defaultPassword },
    create: {
      tenDangNhap: 'teacher03',
      matKhauMaHoa: defaultPassword,
      vaiTro: VaiTro.GIAO_VIEN,
      email: 'vu.hoang.nam@etc-english.vn',
      soDienThoai: '0902222003',
    },
  });
  const gv3 = await prisma.hoSoGiaoVien.upsert({
    where: { maGiaoVien: 'GV003' },
    update: { nguoiDungId: teacherUser3.id },
    create: {
      nguoiDungId: teacherUser3.id,
      maGiaoVien: 'GV003',
      hoTen: 'Thầy Vũ Hoàng Nam',
      chuyenMon: 'Business English, Phản Xạ & Phát Âm IPA',
      bangCap: 'Chứng chỉ CELTA Cambridge, Tốt nghiệp ĐH Ngoại Thương',
    },
  });
  console.log('✅ Đã nạp 3 Giảng viên: GV001, GV002, GV003');

  // 1.3 Tư vấn viên (2 Nhân viên Tuyển sinh / Thu ngân)
  const staffUser1 = await prisma.nguoiDung.upsert({
    where: { tenDangNhap: 'staff01' },
    update: { matKhauMaHoa: defaultPassword },
    create: {
      tenDangNhap: 'staff01',
      matKhauMaHoa: defaultPassword,
      vaiTro: VaiTro.TU_VAN_VIEN,
      email: 'nguyen.thao@etc-english.vn',
      soDienThoai: '0903333001',
    },
  });

  const staffUser2 = await prisma.nguoiDung.upsert({
    where: { tenDangNhap: 'staff02' },
    update: { matKhauMaHoa: defaultPassword },
    create: {
      tenDangNhap: 'staff02',
      matKhauMaHoa: defaultPassword,
      vaiTro: VaiTro.TU_VAN_VIEN,
      email: 'hoang.ngan@etc-english.vn',
      soDienThoai: '0903333002',
    },
  });
  console.log('✅ Đã nạp 2 Tư vấn viên: staff01, staff02');

  // 1.4 Học viên (6 Học viên với nhiều trình độ & lịch rảnh khác nhau)
  const studentData = [
    {
      user: 'student01',
      ma: 'HV001',
      ten: 'Lê Thị Hoa',
      cefr: TrinhDoCEFR.B1,
      dob: '2002-05-15',
      gender: 'Nữ',
      phone: '0904444001',
      email: 'le.thi.hoa@gmail.com',
      source: 'Placement Test 15/08/2024 (Đạt 58/100)',
      schedule: { thu: [2, 4, 6], gio: '17:30-21:00' },
    },
    {
      user: 'student02',
      ma: 'HV002',
      ten: 'Phạm Văn Hùng',
      cefr: TrinhDoCEFR.A2,
      dob: '2001-11-20',
      gender: 'Nam',
      phone: '0904444002',
      email: 'pham.van.hung@gmail.com',
      source: 'Placement Test 01/09/2024 (Đạt 42/100)',
      schedule: { thu: [3, 5, 7], gio: '19:00-21:00' },
    },
    {
      user: 'student03',
      ma: 'HV003',
      ten: 'Nguyễn Hoàng Long',
      cefr: TrinhDoCEFR.B2,
      dob: '2000-03-10',
      gender: 'Nam',
      phone: '0904444003',
      email: 'hoanglong.nguyen@gmail.com',
      source: 'IELTS 6.0 IDP Certificate',
      schedule: { thu: [2, 4, 6], gio: '18:00-21:00' },
    },
    {
      user: 'student04',
      ma: 'HV004',
      ten: 'Đỗ Minh Châu',
      cefr: TrinhDoCEFR.A1,
      dob: '2003-08-25',
      gender: 'Nữ',
      phone: '0904444004',
      email: 'minhchau.do@gmail.com',
      source: 'Học viên mất gốc kiểm tra trực tiếp',
      schedule: { thu: [7, 8], gio: '08:30-11:30' },
    },
    {
      user: 'student05',
      ma: 'HV005',
      ten: 'Vũ Bảo Ngọc',
      cefr: TrinhDoCEFR.B1,
      dob: '2002-12-05',
      gender: 'Nữ',
      phone: '0904444005',
      email: 'baongoc.vu@gmail.com',
      source: 'Thi thử CEFR B1 Online',
      schedule: { thu: [2, 4, 6], gio: '17:30-20:30' },
    },
    {
      user: 'student06',
      ma: 'HV006',
      ten: 'Trịnh Đình Quang',
      cefr: TrinhDoCEFR.C1,
      dob: '1999-07-18',
      gender: 'Nam',
      phone: '0904444006',
      email: 'dinhquang.trinh@gmail.com',
      source: 'IELTS 7.5 BC Certificate',
      schedule: { thu: [2, 4, 6], gio: '18:30-21:30' },
    },
  ];

  const studentProfiles: Record<string, any> = {};

  for (const s of studentData) {
    const u = await prisma.nguoiDung.upsert({
      where: { tenDangNhap: s.user },
      update: { matKhauMaHoa: defaultPassword },
      create: {
        tenDangNhap: s.user,
        matKhauMaHoa: defaultPassword,
        vaiTro: VaiTro.HOC_VIEN,
        email: s.email,
        soDienThoai: s.phone,
      },
    });

    const p = await prisma.hoSoHocVien.upsert({
      where: { maHocVien: s.ma },
      update: { nguoiDungId: u.id },
      create: {
        nguoiDungId: u.id,
        maHocVien: s.ma,
        hoTen: s.ten,
        ngaySinh: new Date(s.dob),
        gioiTinh: s.gender,
        trinhDoCEFR: s.cefr,
        nguonDanhGia: s.source,
        lichRanhJson: s.schedule,
        trangThai: TrangThaiHocVien.DANG_HOC,
      },
    });
    studentProfiles[s.user] = p;
  }
  console.log('✅ Đã nạp 6 Học viên: HV001 → HV006');

  // ============================================================================
  // 2. KHÓA HỌC (6 Khóa học chuẩn CEFR A1 → C1)
  // ============================================================================
  const course1 = await prisma.khoaHoc.upsert({
    where: { maKhoaHoc: 'KH-ENG-A1' },
    update: {},
    create: {
      maKhoaHoc: 'KH-ENG-A1',
      tenKhoaHoc: 'Tiếng Anh Căn Bản Cho Người Mất Gốc (A1)',
      trinhDoYeuCau: TrinhDoCEFR.A1,
      thoiLuongGio: 45,
      hocPhi: 2200000,
      moTa: 'Xây dựng lại nền tảng phát âm chuẩn IPA, từ vựng đời sống và cấu trúc câu đơn giản.',
      trangThai: TrangThaiKhoaHoc.HOAT_DONG,
    },
  });

  const course2 = await prisma.khoaHoc.upsert({
    where: { maKhoaHoc: 'KH-TOEIC-A2' },
    update: {},
    create: {
      maKhoaHoc: 'KH-TOEIC-A2',
      tenKhoaHoc: 'TOEIC Starter 450+ (A2 → B1)',
      trinhDoYeuCau: TrinhDoCEFR.A2,
      thoiLuongGio: 48,
      hocPhi: 2800000,
      moTa: 'Rèn luyện kỹ năng Nghe - Đọc, bẫy đề thi TOEIC và từ vựng môi trường văn phòng.',
      trangThai: TrangThaiKhoaHoc.HOAT_DONG,
    },
  });

  const course3 = await prisma.khoaHoc.upsert({
    where: { maKhoaHoc: 'KH-IELTS-B1' },
    update: {},
    create: {
      maKhoaHoc: 'KH-IELTS-B1',
      tenKhoaHoc: 'IELTS Intensive 5.5 - 6.0 (B1 → B2)',
      trinhDoYeuCau: TrinhDoCEFR.B1,
      thoiLuongGio: 60,
      hocPhi: 3500000,
      moTa: 'Trang bị toàn diện 4 kỹ năng Nghe, Nói, Đọc, Viết chuẩn học thuật IELTS.',
      trangThai: TrangThaiKhoaHoc.HOAT_DONG,
    },
  });

  const course4 = await prisma.khoaHoc.upsert({
    where: { maKhoaHoc: 'KH-IELTS-B2' },
    update: {},
    create: {
      maKhoaHoc: 'KH-IELTS-B2',
      tenKhoaHoc: 'IELTS Master 6.5 - 7.5 (B2 → C1)',
      trinhDoYeuCau: TrinhDoCEFR.B2,
      thoiLuongGio: 72,
      hocPhi: 4800000,
      moTa: 'Chiến thuật nâng Band Speaking & Writing Task 2, phân tích bài luận chuyên sâu.',
      trangThai: TrangThaiKhoaHoc.HOAT_DONG,
    },
  });

  const course5 = await prisma.khoaHoc.upsert({
    where: { maKhoaHoc: 'KH-COMM-B1' },
    update: {},
    create: {
      maKhoaHoc: 'KH-COMM-B1',
      tenKhoaHoc: 'Tiếng Anh Giao Tiếp & Thuyết Trình Doanh Nghiệp',
      trinhDoYeuCau: TrinhDoCEFR.B1,
      thoiLuongGio: 40,
      hocPhi: 3200000,
      moTa: 'Giao tiếp đàm phán, viết email thương mại và thuyết trình trước hội đồng đối tác.',
      trangThai: TrangThaiKhoaHoc.HOAT_DONG,
    },
  });

  const course6 = await prisma.khoaHoc.upsert({
    where: { maKhoaHoc: 'KH-ADV-C1' },
    update: {},
    create: {
      maKhoaHoc: 'KH-ADV-C1',
      tenKhoaHoc: 'Tiếng Anh Học Thuật & Biên Dịch Chuyên Sâu (C1)',
      trinhDoYeuCau: TrinhDoCEFR.C1,
      thoiLuongGio: 80,
      hocPhi: 5500000,
      moTa: 'Biên phiên dịch văn bản học thuật quốc tế và nghiên cứu ngôn ngữ học.',
      trangThai: TrangThaiKhoaHoc.HOAT_DONG,
    },
  });
  console.log('✅ Đã nạp 6 Khóa học');

  // ============================================================================
  // 3. LỚP HỌC & THỜI KHÓA BIỂU
  // ============================================================================
  const class1 = await prisma.lopHoc.upsert({
    where: { maLopHoc: 'IELTS-B1-01' },
    update: { siSoHienTai: 2 },
    create: {
      khoaHocId: course3.id,
      maLopHoc: 'IELTS-B1-01',
      tenLopHoc: 'IELTS B1 Buổi tối (Thứ 2-4-6)',
      siSoToiDa: 25,
      siSoHienTai: 2,
      ngayBatDau: new Date('2024-09-16'),
      ngayKetThuc: new Date('2024-12-16'),
      phongHoc: 'Phòng A101',
      trangThai: TrangThaiLopHoc.DANG_MO_DANG_KY,
    },
  });

  const class2 = await prisma.lopHoc.upsert({
    where: { maLopHoc: 'TOEIC-A2-01' },
    update: { siSoHienTai: 1 },
    create: {
      khoaHocId: course2.id,
      maLopHoc: 'TOEIC-A2-01',
      tenLopHoc: 'TOEIC Starter Thứ 3-5-7',
      siSoToiDa: 25,
      siSoHienTai: 1,
      ngayBatDau: new Date('2024-09-17'),
      ngayKetThuc: new Date('2024-12-10'),
      phongHoc: 'Phòng B202',
      trangThai: TrangThaiLopHoc.DANG_MO_DANG_KY,
    },
  });

  const class3 = await prisma.lopHoc.upsert({
    where: { maLopHoc: 'COMM-B1-01' },
    update: { siSoHienTai: 1 },
    create: {
      khoaHocId: course5.id,
      maLopHoc: 'COMM-B1-01',
      tenLopHoc: 'Giao Tiếp Doanh Nghiệp Tối T2-4-6',
      siSoToiDa: 20,
      siSoHienTai: 1,
      ngayBatDau: new Date('2024-08-01'),
      ngayKetThuc: new Date('2024-11-01'),
      phongHoc: 'Phòng C301',
      trangThai: TrangThaiLopHoc.DANG_HOC,
    },
  });

  const class4 = await prisma.lopHoc.upsert({
    where: { maLopHoc: 'ENG-A1-01' },
    update: { siSoHienTai: 1 },
    create: {
      khoaHocId: course1.id,
      maLopHoc: 'ENG-A1-01',
      tenLopHoc: 'Tiếng Anh Căn Bản Cho Người Mới Bắt Đầu',
      siSoToiDa: 25,
      siSoHienTai: 1,
      ngayBatDau: new Date('2024-09-20'),
      ngayKetThuc: new Date('2024-12-20'),
      phongHoc: 'Phòng B201',
      trangThai: TrangThaiLopHoc.DANG_MO_DANG_KY,
    },
  });

  const class5 = await prisma.lopHoc.upsert({
    where: { maLopHoc: 'IELTS-B2-01' },
    update: { siSoHienTai: 1 },
    create: {
      khoaHocId: course4.id,
      maLopHoc: 'IELTS-B2-01',
      tenLopHoc: 'IELTS Master 6.5+ Chuyên Sâu Tối T2-4-6',
      siSoToiDa: 20,
      siSoHienTai: 1,
      ngayBatDau: new Date('2024-08-15'),
      ngayKetThuc: new Date('2024-11-30'),
      phongHoc: 'Phòng A103',
      trangThai: TrangThaiLopHoc.DANG_HOC,
    },
  });

  const class6 = await prisma.lopHoc.upsert({
    where: { maLopHoc: 'IELTS-B1-02' },
    update: { siSoHienTai: 0 },
    create: {
      khoaHocId: course3.id,
      maLopHoc: 'IELTS-B1-02',
      tenLopHoc: 'IELTS B1 Cuối Tuần (Thứ 7 - CN)',
      siSoToiDa: 25,
      siSoHienTai: 0,
      ngayBatDau: new Date('2024-10-05'),
      ngayKetThuc: new Date('2025-01-05'),
      phongHoc: 'Phòng A102',
      trangThai: TrangThaiLopHoc.DANG_MO_DANG_KY,
    },
  });
  console.log('✅ Đã nạp 6 Lớp học');

  // Lịch học (Schedules)
  const schedules = [
    { lopId: class1.id, thu: 2, bd: '17:30:00', kt: '20:30:00', phong: 'Phòng A101' },
    { lopId: class1.id, thu: 4, bd: '17:30:00', kt: '20:30:00', phong: 'Phòng A101' },
    { lopId: class1.id, thu: 6, bd: '17:30:00', kt: '20:30:00', phong: 'Phòng A101' },
    { lopId: class2.id, thu: 3, bd: '19:00:00', kt: '21:00:00', phong: 'Phòng B202' },
    { lopId: class2.id, thu: 5, bd: '19:00:00', kt: '21:00:00', phong: 'Phòng B202' },
    { lopId: class2.id, thu: 7, bd: '19:00:00', kt: '21:00:00', phong: 'Phòng B202' },
    { lopId: class3.id, thu: 2, bd: '19:00:00', kt: '21:00:00', phong: 'Phòng C301' },
    { lopId: class3.id, thu: 4, bd: '19:00:00', kt: '21:00:00', phong: 'Phòng C301' },
    { lopId: class3.id, thu: 6, bd: '19:00:00', kt: '21:00:00', phong: 'Phòng C301' },
    { lopId: class4.id, thu: 3, bd: '17:30:00', kt: '19:30:00', phong: 'Phòng B201' },
    { lopId: class4.id, thu: 5, bd: '17:30:00', kt: '19:30:00', phong: 'Phòng B201' },
    { lopId: class5.id, thu: 2, bd: '18:00:00', kt: '21:00:00', phong: 'Phòng A103' },
    { lopId: class5.id, thu: 4, bd: '18:00:00', kt: '21:00:00', phong: 'Phòng A103' },
    { lopId: class6.id, thu: 7, bd: '08:30:00', kt: '11:30:00', phong: 'Phòng A102' },
    { lopId: class6.id, thu: 8, bd: '08:30:00', kt: '11:30:00', phong: 'Phòng A102' },
  ];

  for (const sc of schedules) {
    await prisma.lichHoc.upsert({
      where: {
        lopHocId_thuTrongTuan_gioBatDau: {
          lopHocId: sc.lopId,
          thuTrongTuan: sc.thu,
          gioBatDau: new Date(`1970-01-01T${sc.bd}`),
        },
      },
      update: {},
      create: {
        lopHocId: sc.lopId,
        thuTrongTuan: sc.thu,
        gioBatDau: new Date(`1970-01-01T${sc.bd}`),
        gioKetThuc: new Date(`1970-01-01T${sc.kt}`),
        phongHoc: sc.phong,
      },
    });
  }
  console.log('✅ Đã nạp Thời khóa biểu chi tiết');

  // ============================================================================
  // 4. PHÂN CÔNG GIẢNG VIÊN (PhanCongGiaoVien)
  // ============================================================================
  const assignments = [
    { lopId: class1.id, gvId: gv1.id, vaitro: VaiTroPhanCong.CHINH },
    { lopId: class6.id, gvId: gv1.id, vaitro: VaiTroPhanCong.CHINH },
    { lopId: class2.id, gvId: gv2.id, vaitro: VaiTroPhanCong.CHINH },
    { lopId: class3.id, gvId: gv2.id, vaitro: VaiTroPhanCong.CHINH },
    { lopId: class4.id, gvId: gv3.id, vaitro: VaiTroPhanCong.CHINH },
    { lopId: class5.id, gvId: gv3.id, vaitro: VaiTroPhanCong.CHINH },
  ];

  for (const asg of assignments) {
    await prisma.phanCongGiaoVien.upsert({
      where: {
        lopHocId_giaoVienId: {
          lopHocId: asg.lopId,
          giaoVienId: asg.gvId,
        },
      },
      update: {},
      create: {
        lopHocId: asg.lopId,
        giaoVienId: asg.gvId,
        vaiTroPhanCong: asg.vaitro,
        trangThai: TrangThaiPhanCong.DANG_PHU_TRACH,
      },
    });
  }
  console.log('✅ Đã phân công Giảng viên phụ trách các lớp');

  // ============================================================================
  // 5. ĐĂNG KÝ HỌC, HÓA ĐƠN & THANH TOÁN (Enrollments, Invoices, Payments)
  // ============================================================================
  // 5.1 HV001 (Lê Thị Hoa) -> Lớp IELTS-B1-01 (Đã đóng đủ 3.500.000đ)
  const dk1 = await prisma.dangKyHoc.upsert({
    where: { lopHocId_hocVienId: { lopHocId: class1.id, hocVienId: studentProfiles['student01'].id } },
    update: {},
    create: {
      lopHocId: class1.id,
      hocVienId: studentProfiles['student01'].id,
      trangThai: TrangThaiDangKy.DA_XAC_NHAN,
    },
  });
  const hd1 = await prisma.hoaDon.upsert({
    where: { maHoaDon: 'HD-2026-0001' },
    update: {},
    create: {
      maHoaDon: 'HD-2026-0001',
      dangKyHocId: dk1.id,
      hocVienId: studentProfiles['student01'].id,
      soTienPhaiTra: 3500000,
      soTienDaTra: 3500000,
      hanThanhToan: new Date('2024-09-15'),
      trangThai: TrangThaiHoaDon.DA_HOAN_THANH,
    },
  });
  await prisma.thanhToan.upsert({
    where: { maGiaoDich: 'TXN-20260901-0001' },
    update: {},
    create: {
      hoaDonId: hd1.id,
      maGiaoDich: 'TXN-20260901-0001',
      soTien: 3500000,
      phuongThuc: PhuongThucThanhToan.CHUYEN_KHOAN,
      nguoiThuId: staffUser1.id,
      trangThai: TrangThaiThanhToan.THANH_CONG,
      ghiChu: 'Chuyển khoản qua Vietcombank QR',
    },
  });

  // 5.2 HV002 (Phạm Văn Hùng) -> Lớp TOEIC-A2-01 (Đóng trước 1.500.000đ, còn nợ 1.300.000đ)
  const dk2 = await prisma.dangKyHoc.upsert({
    where: { lopHocId_hocVienId: { lopHocId: class2.id, hocVienId: studentProfiles['student02'].id } },
    update: {},
    create: {
      lopHocId: class2.id,
      hocVienId: studentProfiles['student02'].id,
      trangThai: TrangThaiDangKy.CHO_THANH_TOAN,
    },
  });
  const hd2 = await prisma.hoaDon.upsert({
    where: { maHoaDon: 'HD-2026-0002' },
    update: {},
    create: {
      maHoaDon: 'HD-2026-0002',
      dangKyHocId: dk2.id,
      hocVienId: studentProfiles['student02'].id,
      soTienPhaiTra: 2800000,
      soTienDaTra: 1500000,
      hanThanhToan: new Date('2024-09-20'),
      trangThai: TrangThaiHoaDon.THANH_TOAN_MOT_PHAN,
    },
  });
  await prisma.thanhToan.upsert({
    where: { maGiaoDich: 'TXN-20260902-0002' },
    update: {},
    create: {
      hoaDonId: hd2.id,
      maGiaoDich: 'TXN-20260902-0002',
      soTien: 1500000,
      phuongThuc: PhuongThucThanhToan.TIEN_MAT,
      nguoiThuId: staffUser2.id,
      trangThai: TrangThaiThanhToan.THANH_CONG,
      ghiChu: 'Thu tiền mặt tại quầy lễ tân',
    },
  });

  // 5.3 HV003 (Nguyễn Hoàng Long) -> Lớp COMM-B1-01 (Đã đóng đủ 3.200.000đ)
  const dk3 = await prisma.dangKyHoc.upsert({
    where: { lopHocId_hocVienId: { lopHocId: class3.id, hocVienId: studentProfiles['student03'].id } },
    update: {},
    create: {
      lopHocId: class3.id,
      hocVienId: studentProfiles['student03'].id,
      trangThai: TrangThaiDangKy.DA_XAC_NHAN,
    },
  });
  const hd3 = await prisma.hoaDon.upsert({
    where: { maHoaDon: 'HD-2026-0003' },
    update: {},
    create: {
      maHoaDon: 'HD-2026-0003',
      dangKyHocId: dk3.id,
      hocVienId: studentProfiles['student03'].id,
      soTienPhaiTra: 3200000,
      soTienDaTra: 3200000,
      hanThanhToan: new Date('2024-08-01'),
      trangThai: TrangThaiHoaDon.DA_HOAN_THANH,
    },
  });
  await prisma.thanhToan.upsert({
    where: { maGiaoDich: 'TXN-20260801-0003' },
    update: {},
    create: {
      hoaDonId: hd3.id,
      maGiaoDich: 'TXN-20260801-0003',
      soTien: 3200000,
      phuongThuc: PhuongThucThanhToan.CHUYEN_KHOAN,
      nguoiThuId: staffUser1.id,
      trangThai: TrangThaiThanhToan.THANH_CONG,
      ghiChu: 'Chuyển khoản thanh toán toàn phần',
    },
  });

  // 5.4 HV004 (Đỗ Minh Châu) -> Lớp ENG-A1-01 (Chưa đóng tiền)
  const dk4 = await prisma.dangKyHoc.upsert({
    where: { lopHocId_hocVienId: { lopHocId: class4.id, hocVienId: studentProfiles['student04'].id } },
    update: {},
    create: {
      lopHocId: class4.id,
      hocVienId: studentProfiles['student04'].id,
      trangThai: TrangThaiDangKy.CHO_THANH_TOAN,
    },
  });
  await prisma.hoaDon.upsert({
    where: { maHoaDon: 'HD-2026-0004' },
    update: {},
    create: {
      maHoaDon: 'HD-2026-0004',
      dangKyHocId: dk4.id,
      hocVienId: studentProfiles['student04'].id,
      soTienPhaiTra: 2200000,
      soTienDaTra: 0,
      hanThanhToan: new Date('2024-09-25'),
      trangThai: TrangThaiHoaDon.CHUA_THANH_TOAN,
    },
  });

  // 5.5 HV005 (Vũ Bảo Ngọc) -> Lớp IELTS-B1-01 (Đã hoàn thành 3.500.000đ)
  const dk5 = await prisma.dangKyHoc.upsert({
    where: { lopHocId_hocVienId: { lopHocId: class1.id, hocVienId: studentProfiles['student05'].id } },
    update: {},
    create: {
      lopHocId: class1.id,
      hocVienId: studentProfiles['student05'].id,
      trangThai: TrangThaiDangKy.DA_XAC_NHAN,
    },
  });
  const hd5 = await prisma.hoaDon.upsert({
    where: { maHoaDon: 'HD-2026-0005' },
    update: {},
    create: {
      maHoaDon: 'HD-2026-0005',
      dangKyHocId: dk5.id,
      hocVienId: studentProfiles['student05'].id,
      soTienPhaiTra: 3500000,
      soTienDaTra: 3500000,
      hanThanhToan: new Date('2024-09-18'),
      trangThai: TrangThaiHoaDon.DA_HOAN_THANH,
    },
  });
  await prisma.thanhToan.upsert({
    where: { maGiaoDich: 'TXN-20260905-0005' },
    update: {},
    create: {
      hoaDonId: hd5.id,
      maGiaoDich: 'TXN-20260905-0005',
      soTien: 3500000,
      phuongThuc: PhuongThucThanhToan.CHUYEN_KHOAN,
      nguoiThuId: staffUser1.id,
      trangThai: TrangThaiThanhToan.THANH_CONG,
      ghiChu: 'Thanh toán trực tuyến VNPay',
    },
  });
  console.log('✅ Đã nạp Đăng ký học, Hóa đơn & Lịch sử giao dịch thu ngân');

  // ============================================================================
  // 6. BUỔI HỌC & ĐIỂM DANH (BuoiHoc, BanGhiDiemDanh)
  // ============================================================================
  // Xóa các buổi học cũ nếu có để tránh duplicate key
  await prisma.banGhiDiemDanh.deleteMany({
    where: { buoiHoc: { lopHocId: class1.id } },
  });
  await prisma.buoiHoc.deleteMany({
    where: { lopHocId: class1.id },
  });

  const sessionDates = ['2024-09-16', '2024-09-18', '2024-09-20', '2024-09-23', '2024-09-25', '2024-09-27'];
  const sessionTopics = [
    'Unit 1: Introduction to IELTS & Present Perfect Tense',
    'Unit 2: Listening Section 1 & Note Taking Strategies',
    'Unit 3: Reading Skimming & Scanning Techniques',
    'Unit 4: Speaking Part 1 Topics (Hometown, Study & Work)',
    'Unit 5: Writing Task 1 Overview & Line Graph Analysis',
    'Unit 6: Midterm Review & Mini Mock Test',
  ];

  for (let i = 0; i < sessionDates.length; i++) {
    const session = await prisma.buoiHoc.create({
      data: {
        lopHocId: class1.id,
        soThuTu: i + 1,
        ngayHoc: new Date(sessionDates[i]),
        gioBatDau: new Date('1970-01-01T17:30:00'),
        gioKetThuc: new Date('1970-01-01T20:30:00'),
        chuDe: sessionTopics[i],
        trangThai: TrangThaiBuoiHoc.DA_KET_THUC,
      },
    });

    // Điểm danh cho học viên 1 (Lê Thị Hoa) — 5 buổi có mặt, 1 buổi đi muộn
    await prisma.banGhiDiemDanh.create({
      data: {
        buoiHocId: session.id,
        hocVienId: studentProfiles['student01'].id,
        trangThai: i === 3 ? TrangThaiDiemDanh.DI_MUON : TrangThaiDiemDanh.CO_MAT,
        ghiChu: i === 3 ? 'Đến muộn 10 phút do kẹt xe' : 'Tham gia tích cực, phát biểu nhiều',
        giaoVienDiemDanhId: gv1.id,
      },
    });

    // Điểm danh cho học viên 5 (Vũ Bảo Ngọc) — 5 buổi có mặt, 1 buổi có phép
    await prisma.banGhiDiemDanh.create({
      data: {
        buoiHocId: session.id,
        hocVienId: studentProfiles['student05'].id,
        trangThai: i === 4 ? TrangThaiDiemDanh.CO_PHEP : TrangThaiDiemDanh.CO_MAT,
        ghiChu: i === 4 ? 'Có gửi đơn xin nghỉ ốm' : 'Hoàn thành bài tập về nhà đầy đủ',
        giaoVienDiemDanhId: gv1.id,
      },
    });
  }
  console.log('✅ Đã nạp 6 Buổi học & Bảng điểm danh chuyên cần');

  // ============================================================================
  // 7. BẢNG ĐIỂM & ĐÁNH GIÁ (KetQuaHocTap — 20% Chuyên cần, 30% Giữa kỳ, 50% Cuối kỳ)
  // ============================================================================
  // 7.1 Kết quả học viên 1 (Lê Thị Hoa)
  await prisma.ketQuaHocTap.upsert({
    where: {
      lopHocId_hocVienId: {
        lopHocId: class1.id,
        hocVienId: studentProfiles['student01'].id,
      },
    },
    update: {
      diemChuyenCan: 95.0,
      diemGiuaKy: 82.5,
      diemCuoiKy: 88.0,
      diemTongKet: 87.75,
      nhanXet: 'Học viên có nền tảng ngữ pháp rất tốt, phát âm chuẩn và phản xạ nhanh. Cần tiếp tục mở rộng vốn từ vựng học thuật cho bài thi Writing.',
      trangThaiHoanThanh: TrangThaiHoanThanh.DAT,
    },
    create: {
      lopHocId: class1.id,
      hocVienId: studentProfiles['student01'].id,
      diemChuyenCan: 95.0,
      diemGiuaKy: 82.5,
      diemCuoiKy: 88.0,
      diemTongKet: 87.75, // (95*0.2) + (82.5*0.3) + (88*0.5)
      nhanXet: 'Học viên có nền tảng ngữ pháp rất tốt, phát âm chuẩn và phản xạ nhanh. Cần tiếp tục mở rộng vốn từ vựng học thuật cho bài thi Writing.',
      trangThaiHoanThanh: TrangThaiHoanThanh.DAT,
    },
  });

  // 7.2 Kết quả học viên 5 (Vũ Bảo Ngọc)
  await prisma.ketQuaHocTap.upsert({
    where: {
      lopHocId_hocVienId: {
        lopHocId: class1.id,
        hocVienId: studentProfiles['student05'].id,
      },
    },
    update: {
      diemChuyenCan: 85.0,
      diemGiuaKy: 72.0,
      diemCuoiKy: 78.0,
      diemTongKet: 77.6,
      nhanXet: 'Chăm chỉ, làm bài đầy đủ, cần tự tin hơn trong các buổi thảo luận Speaking nhóm.',
      trangThaiHoanThanh: TrangThaiHoanThanh.DAT,
    },
    create: {
      lopHocId: class1.id,
      hocVienId: studentProfiles['student05'].id,
      diemChuyenCan: 85.0,
      diemGiuaKy: 72.0,
      diemCuoiKy: 78.0,
      diemTongKet: 77.6,
      nhanXet: 'Chăm chỉ, làm bài đầy đủ, cần tự tin hơn trong các buổi thảo luận Speaking nhóm.',
      trangThaiHoanThanh: TrangThaiHoanThanh.DAT,
    },
  });

  // 7.3 Kết quả học viên 3 (Nguyễn Hoàng Long) tại lớp COMM-B1-01
  await prisma.ketQuaHocTap.upsert({
    where: {
      lopHocId_hocVienId: {
        lopHocId: class3.id,
        hocVienId: studentProfiles['student03'].id,
      },
    },
    update: {
      diemChuyenCan: 90.0,
      diemGiuaKy: 85.0,
      diemCuoiKy: 86.0,
      diemTongKet: 86.5,
      nhanXet: 'Kỹ năng thuyết trình xuất sắc, phong thái tự tin và vốn từ thương mại phong phú.',
      trangThaiHoanThanh: TrangThaiHoanThanh.DAT,
    },
    create: {
      lopHocId: class3.id,
      hocVienId: studentProfiles['student03'].id,
      diemChuyenCan: 90.0,
      diemGiuaKy: 85.0,
      diemCuoiKy: 86.0,
      diemTongKet: 86.5,
      nhanXet: 'Kỹ năng thuyết trình xuất sắc, phong thái tự tin và vốn từ thương mại phong phú.',
      trangThaiHoanThanh: TrangThaiHoanThanh.DAT,
    },
  });
  console.log('✅ Đã nạp Bảng điểm tổng kết 20/30/50 chuẩn quy chế');

  // ============================================================================
  // 8. AUDIT LOG AI (YeuCauAI)
  // ============================================================================
  await prisma.yeuCauAI.createMany({
    data: [
      {
        nguoiDungId: studentProfiles['student01'].nguoiDungId!,
        loaiChucNang: LoaiChucNangAI.TU_VAN_LOP,
        promptInput: 'Tư vấn lớp học cho học viên trình độ B1, lịch rảnh Thứ 2-4-6 tối',
        rawOutput: '{"lopGoiY": ["IELTS-B1-01", "COMM-B1-01"], "lyDo": "Lịch học khớp 100% với lịch rảnh tối Thứ 2-4-6."}',
        validatedOutputJson: { lopGoiY: ['IELTS-B1-01', 'COMM-B1-01'], lyDo: 'Lịch học khớp 100% với lịch rảnh tối Thứ 2-4-6.' },
        trangThai: TrangThaiYeuCauAI.THANH_CONG,
        thoiGianXuLyMs: 1250,
      },
      {
        nguoiDungId: teacherUser1.id,
        loaiChucNang: LoaiChucNangAI.SINH_BAI_TAP,
        promptInput: 'Sinh 5 câu trắc nghiệm chủ đề Thì Hiện Tại Hoàn Thành chuẩn CEFR B1',
        rawOutput: '{"chuDe": "Present Perfect", "trinhDo": "B1", "cauHoi": [...]}',
        validatedOutputJson: { chuDe: 'Present Perfect', trinhDo: 'B1', cauHoi: [] },
        trangThai: TrangThaiYeuCauAI.THANH_CONG,
        thoiGianXuLyMs: 3400,
      },
      {
        nguoiDungId: studentProfiles['student01'].nguoiDungId!,
        loaiChucNang: LoaiChucNangAI.TOM_TAT_TIEN_DO,
        promptInput: 'Tóm tắt tiến độ học tập cho học viên Lê Thị Hoa lớp IELTS-B1-01',
        rawOutput: '{"chuyenCan": 95, "tongKet": 87.75, "diemManh": "Ngữ pháp xuất sắc, phát âm chuẩn", "canKhacPhuc": "Tăng tốc độ đọc", "loiKhuyen": "Luyện đọc báo cáo kinh tế mỗi ngày"}',
        validatedOutputJson: { chuyenCan: 95, tongKet: 87.75 },
        trangThai: TrangThaiYeuCauAI.THANH_CONG,
        thoiGianXuLyMs: 2100,
      },
    ],
  });
  console.log('✅ Đã nạp Audit Log AI');

  console.log('\n🎉 NẠP TOÀN BỘ SIÊU DỮ LIỆU THÀNH CÔNG!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📋 TÀI KHOẢN HỆ THỐNG ĐÃ SẴN SÀNG (Mật khẩu: 123456):');
  console.log('   👑 Quản lý (Admin)   : admin01');
  console.log('   👨‍🏫 Giáo viên (Teacher): teacher01 (Cô Lan), teacher02 (Thầy Minh), teacher03 (Thầy Nam)');
  console.log('   📞 Tư vấn viên (Staff): staff01 (Thảo), staff02 (Ngân)');
  console.log('   🎓 Học viên (Student) : student01, student02, student03, student04, student05, student06');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

main()
  .catch((e) => {
    console.error('❌ Lỗi Seed Data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
