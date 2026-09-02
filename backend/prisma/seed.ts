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
  console.log('🌱 Bắt đầu nạp SIÊU DỮ LIỆU MẪU TOÀN DIỆN (Comprehensive Rich Seed Data) cho ETC English Center...\n');

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

  // 1.2 Giáo viên (4 Giảng viên chuyên môn sâu)
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
    update: { nguoiDungId: teacherUser1.id, trangThai: TrangThaiGiaoVien.DANG_LAM_VIEC },
    create: {
      nguoiDungId: teacherUser1.id,
      maGiaoVien: 'GV001',
      hoTen: 'Cô Nguyễn Thị Lan',
      chuyenMon: 'IELTS Academic, Ngữ Pháp Nâng Cao',
      bangCap: 'Thạc sĩ Ngôn ngữ Anh - ĐH Ngoại ngữ Hà Nội (IELTS 8.5)',
      trangThai: TrangThaiGiaoVien.DANG_LAM_VIEC,
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
    update: { nguoiDungId: teacherUser2.id, trangThai: TrangThaiGiaoVien.DANG_LAM_VIEC },
    create: {
      nguoiDungId: teacherUser2.id,
      maGiaoVien: 'GV002',
      hoTen: 'Thầy Trần Văn Minh',
      chuyenMon: 'TOEIC L&R, Tiếng Anh Giao Tiếp Thực Chiến',
      bangCap: 'Cử nhân Sư phạm Tiếng Anh - ĐH Sư phạm TP.HCM (TOEIC 985)',
      trangThai: TrangThaiGiaoVien.DANG_LAM_VIEC,
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
    update: { nguoiDungId: teacherUser3.id, trangThai: TrangThaiGiaoVien.DANG_LAM_VIEC },
    create: {
      nguoiDungId: teacherUser3.id,
      maGiaoVien: 'GV003',
      hoTen: 'Thầy Vũ Hoàng Nam',
      chuyenMon: 'Business English, Phản Xạ & Phát Âm IPA',
      bangCap: 'Chứng chỉ CELTA Cambridge, Tốt nghiệp ĐH Ngoại Thương',
      trangThai: TrangThaiGiaoVien.DANG_LAM_VIEC,
    },
  });

  const teacherUser4 = await prisma.nguoiDung.upsert({
    where: { tenDangNhap: 'teacher04' },
    update: { matKhauMaHoa: defaultPassword },
    create: {
      tenDangNhap: 'teacher04',
      matKhauMaHoa: defaultPassword,
      vaiTro: VaiTro.GIAO_VIEN,
      email: 'emily.brown@etc-english.vn',
      soDienThoai: '0902222004',
    },
  });
  const gv4 = await prisma.hoSoGiaoVien.upsert({
    where: { maGiaoVien: 'GV004' },
    update: { nguoiDungId: teacherUser4.id, trangThai: TrangThaiGiaoVien.DANG_LAM_VIEC },
    create: {
      nguoiDungId: teacherUser4.id,
      maGiaoVien: 'GV004',
      hoTen: 'Cô Emily Brown',
      chuyenMon: 'Native English Speaking, Pronunciation & Presentation',
      bangCap: 'Master of Arts in TESOL - University of Sydney',
      trangThai: TrangThaiGiaoVien.DANG_LAM_VIEC,
    },
  });
  console.log('✅ Đã nạp 4 Giảng viên: GV001 → GV004');

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

  // 1.4 Học viên (10 Học viên với nhiều trình độ & lịch rảnh khác nhau)
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
    {
      user: 'student07',
      ma: 'HV007',
      ten: 'Bùi Đức Thắng',
      cefr: TrinhDoCEFR.A2,
      dob: '2004-01-12',
      gender: 'Nam',
      phone: '0904444007',
      email: 'thang.bui@gmail.com',
      source: 'Kiểm tra đầu vào TOEIC 400',
      schedule: { thu: [3, 5, 7], gio: '19:00-21:00' },
    },
    {
      user: 'student08',
      ma: 'HV008',
      ten: 'Hoàng Mai Linh',
      cefr: TrinhDoCEFR.B1,
      dob: '2001-09-30',
      gender: 'Nữ',
      phone: '0904444008',
      email: 'mailinh.hoang@gmail.com',
      source: 'Đánh giá năng lực tiếng Anh B1',
      schedule: { thu: [2, 4, 6], gio: '19:00-21:00' },
    },
    {
      user: 'student09',
      ma: 'HV009',
      ten: 'Phạm Quốc Cường',
      cefr: TrinhDoCEFR.B2,
      dob: '2000-06-22',
      gender: 'Nam',
      phone: '0904444009',
      email: 'cuong.pham@gmail.com',
      source: 'Bảng điểm IELTS 6.5 British Council',
      schedule: { thu: [2, 4, 6], gio: '18:00-21:00' },
    },
    {
      user: 'student10',
      ma: 'HV010',
      ten: 'Trần Phương Anh',
      cefr: TrinhDoCEFR.C1,
      dob: '1998-04-14',
      gender: 'Nữ',
      phone: '0904444010',
      email: 'phuonganh.tran@gmail.com',
      source: 'Cử nhân ngôn ngữ Anh',
      schedule: { thu: [7, 8], gio: '08:30-11:30' },
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
  console.log('✅ Đã nạp 10 Học viên: HV001 → HV010');

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
    update: { siSoHienTai: 2, trangThai: TrangThaiLopHoc.DANG_MO_DANG_KY },
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
    update: { siSoHienTai: 2, trangThai: TrangThaiLopHoc.DANG_HOC },
    create: {
      khoaHocId: course2.id,
      maLopHoc: 'TOEIC-A2-01',
      tenLopHoc: 'TOEIC Starter Thứ 3-5-7',
      siSoToiDa: 25,
      siSoHienTai: 2,
      ngayBatDau: new Date('2024-09-17'),
      ngayKetThuc: new Date('2024-12-10'),
      phongHoc: 'Phòng B202',
      trangThai: TrangThaiLopHoc.DANG_HOC,
    },
  });

  const class3 = await prisma.lopHoc.upsert({
    where: { maLopHoc: 'COMM-B1-01' },
    update: { siSoHienTai: 2, trangThai: TrangThaiLopHoc.DANG_HOC },
    create: {
      khoaHocId: course5.id,
      maLopHoc: 'COMM-B1-01',
      tenLopHoc: 'Giao Tiếp Doanh Nghiệp Tối T2-4-6',
      siSoToiDa: 20,
      siSoHienTai: 2,
      ngayBatDau: new Date('2024-08-01'),
      ngayKetThuc: new Date('2024-11-01'),
      phongHoc: 'Phòng C301',
      trangThai: TrangThaiLopHoc.DANG_HOC,
    },
  });

  const class4 = await prisma.lopHoc.upsert({
    where: { maLopHoc: 'ENG-A1-01' },
    update: { siSoHienTai: 1, trangThai: TrangThaiLopHoc.DANG_MO_DANG_KY },
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
    update: { siSoHienTai: 2, trangThai: TrangThaiLopHoc.DANG_HOC },
    create: {
      khoaHocId: course4.id,
      maLopHoc: 'IELTS-B2-01',
      tenLopHoc: 'IELTS Master 6.5+ Chuyên Sâu Tối T2-4-6',
      siSoToiDa: 20,
      siSoHienTai: 2,
      ngayBatDau: new Date('2024-08-15'),
      ngayKetThuc: new Date('2024-11-30'),
      phongHoc: 'Phòng A103',
      trangThai: TrangThaiLopHoc.DANG_HOC,
    },
  });

  const class6 = await prisma.lopHoc.upsert({
    where: { maLopHoc: 'IELTS-B1-02' },
    update: { siSoHienTai: 1, trangThai: TrangThaiLopHoc.DANG_MO_DANG_KY },
    create: {
      khoaHocId: course3.id,
      maLopHoc: 'IELTS-B1-02',
      tenLopHoc: 'IELTS B1 Cuối Tuần (Thứ 7 - CN)',
      siSoToiDa: 25,
      siSoHienTai: 1,
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
    { lopId: class5.id, gvId: gv4.id, vaitro: VaiTroPhanCong.CHINH },
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

  // Helper upsert enroll + invoice + payment
  const enrollAndPay = async (params: {
    lopId: bigint;
    studentId: bigint;
    enrollStatus: TrangThaiDangKy;
    invoiceCode: string;
    amountDue: number;
    amountPaid: number;
    invoiceStatus: TrangThaiHoaDon;
    dueDate: string;
    txnCode?: string;
    method?: PhuongThucThanhToan;
    staffId?: bigint;
    note?: string;
  }) => {
    const dk = await prisma.dangKyHoc.upsert({
      where: { lopHocId_hocVienId: { lopHocId: params.lopId, hocVienId: params.studentId } },
      update: { trangThai: params.enrollStatus },
      create: {
        lopHocId: params.lopId,
        hocVienId: params.studentId,
        trangThai: params.enrollStatus,
      },
    });

    const hd = await prisma.hoaDon.upsert({
      where: { dangKyHocId: dk.id },
      update: {
        maHoaDon: params.invoiceCode,
        soTienPhaiTra: params.amountDue,
        soTienDaTra: params.amountPaid,
        trangThai: params.invoiceStatus,
        hanThanhToan: new Date(params.dueDate),
      },
      create: {
        maHoaDon: params.invoiceCode,
        dangKyHocId: dk.id,
        hocVienId: params.studentId,
        soTienPhaiTra: params.amountDue,
        soTienDaTra: params.amountPaid,
        hanThanhToan: new Date(params.dueDate),
        trangThai: params.invoiceStatus,
      },
    });

    if (params.txnCode && params.amountPaid > 0 && params.staffId && params.method) {
      await prisma.thanhToan.upsert({
        where: { maGiaoDich: params.txnCode },
        update: {},
        create: {
          hoaDonId: hd.id,
          maGiaoDich: params.txnCode,
          soTien: params.amountPaid,
          phuongThuc: params.method,
          nguoiThuId: params.staffId,
          trangThai: TrangThaiThanhToan.THANH_CONG,
          ghiChu: params.note || 'Thanh toán học phí',
        },
      });
    }
  };

  // 5.1 HV001 (Lê Thị Hoa) -> Lớp IELTS-B1-01 (Đã hoàn thành 3.500.000đ)
  await enrollAndPay({
    lopId: class1.id,
    studentId: studentProfiles['student01'].id,
    enrollStatus: TrangThaiDangKy.DA_XAC_NHAN,
    invoiceCode: 'HD-2026-0001',
    amountDue: 3500000,
    amountPaid: 3500000,
    invoiceStatus: TrangThaiHoaDon.DA_HOAN_THANH,
    dueDate: '2024-09-15',
    txnCode: 'TXN-20260901-0001',
    method: PhuongThucThanhToan.CHUYEN_KHOAN,
    staffId: staffUser1.id,
    note: 'Chuyển khoản Vietcombank QR',
  });

  // 5.2 HV002 (Phạm Văn Hùng) -> Lớp TOEIC-A2-01 (Đóng 1.500.000đ, nợ 1.300.000đ)
  await enrollAndPay({
    lopId: class2.id,
    studentId: studentProfiles['student02'].id,
    enrollStatus: TrangThaiDangKy.CHO_THANH_TOAN,
    invoiceCode: 'HD-2026-0002',
    amountDue: 2800000,
    amountPaid: 1500000,
    invoiceStatus: TrangThaiHoaDon.THANH_TOAN_MOT_PHAN,
    dueDate: '2024-09-20',
    txnCode: 'TXN-20260902-0002',
    method: PhuongThucThanhToan.TIEN_MAT,
    staffId: staffUser2.id,
    note: 'Thu tiền mặt tại quầy',
  });

  // 5.3 HV003 (Nguyễn Hoàng Long) -> Lớp COMM-B1-01 (Đã đóng 3.200.000đ)
  await enrollAndPay({
    lopId: class3.id,
    studentId: studentProfiles['student03'].id,
    enrollStatus: TrangThaiDangKy.DA_XAC_NHAN,
    invoiceCode: 'HD-2026-0003',
    amountDue: 3200000,
    amountPaid: 3200000,
    invoiceStatus: TrangThaiHoaDon.DA_HOAN_THANH,
    dueDate: '2024-08-01',
    txnCode: 'TXN-20260801-0003',
    method: PhuongThucThanhToan.CHUYEN_KHOAN,
    staffId: staffUser1.id,
    note: 'Chuyển khoản toàn phần',
  });

  // 5.4 HV004 (Đỗ Minh Châu) -> Lớp ENG-A1-01 (Chưa đóng tiền)
  await enrollAndPay({
    lopId: class4.id,
    studentId: studentProfiles['student04'].id,
    enrollStatus: TrangThaiDangKy.CHO_THANH_TOAN,
    invoiceCode: 'HD-2026-0004',
    amountDue: 2200000,
    amountPaid: 0,
    invoiceStatus: TrangThaiHoaDon.CHUA_THANH_TOAN,
    dueDate: '2024-09-25',
  });

  // 5.5 HV005 (Vũ Bảo Ngọc) -> Lớp IELTS-B1-01 (Đã hoàn thành 3.500.000đ)
  await enrollAndPay({
    lopId: class1.id,
    studentId: studentProfiles['student05'].id,
    enrollStatus: TrangThaiDangKy.DA_XAC_NHAN,
    invoiceCode: 'HD-2026-0005',
    amountDue: 3500000,
    amountPaid: 3500000,
    invoiceStatus: TrangThaiHoaDon.DA_HOAN_THANH,
    dueDate: '2024-09-18',
    txnCode: 'TXN-20260905-0005',
    method: PhuongThucThanhToan.CHUYEN_KHOAN,
    staffId: staffUser1.id,
    note: 'Thanh toán trực tuyến VNPay',
  });

  // 5.6 HV006 (Trịnh Đình Quang) -> Lớp IELTS-B2-01 (Đã đóng 4.800.000đ)
  await enrollAndPay({
    lopId: class5.id,
    studentId: studentProfiles['student06'].id,
    enrollStatus: TrangThaiDangKy.DA_XAC_NHAN,
    invoiceCode: 'HD-2026-0006',
    amountDue: 4800000,
    amountPaid: 4800000,
    invoiceStatus: TrangThaiHoaDon.DA_HOAN_THANH,
    dueDate: '2024-08-15',
    txnCode: 'TXN-20260815-0006',
    method: PhuongThucThanhToan.CHUYEN_KHOAN,
    staffId: staffUser2.id,
    note: 'Chuyển khoản toàn phần',
  });

  // 5.7 HV007 (Bùi Đức Thắng) -> Lớp TOEIC-A2-01 (Đã đóng 2.800.000đ)
  await enrollAndPay({
    lopId: class2.id,
    studentId: studentProfiles['student07'].id,
    enrollStatus: TrangThaiDangKy.DA_XAC_NHAN,
    invoiceCode: 'HD-2026-0007',
    amountDue: 2800000,
    amountPaid: 2800000,
    invoiceStatus: TrangThaiHoaDon.DA_HOAN_THANH,
    dueDate: '2024-09-17',
    txnCode: 'TXN-20260917-0007',
    method: PhuongThucThanhToan.TIEN_MAT,
    staffId: staffUser1.id,
    note: 'Thu tiền mặt tại quầy',
  });

  // 5.8 HV008 (Hoàng Mai Linh) -> Lớp COMM-B1-01 (Đã đóng 3.200.000đ)
  await enrollAndPay({
    lopId: class3.id,
    studentId: studentProfiles['student08'].id,
    enrollStatus: TrangThaiDangKy.DA_XAC_NHAN,
    invoiceCode: 'HD-2026-0008',
    amountDue: 3200000,
    amountPaid: 3200000,
    invoiceStatus: TrangThaiHoaDon.DA_HOAN_THANH,
    dueDate: '2024-08-01',
    txnCode: 'TXN-20260801-0008',
    method: PhuongThucThanhToan.CHUYEN_KHOAN,
    staffId: staffUser2.id,
    note: 'Chuyển khoản ngân hàng',
  });

  // 5.9 HV009 (Phạm Quốc Cường) -> Lớp IELTS-B2-01 (Đã đóng 4.800.000đ)
  await enrollAndPay({
    lopId: class5.id,
    studentId: studentProfiles['student09'].id,
    enrollStatus: TrangThaiDangKy.DA_XAC_NHAN,
    invoiceCode: 'HD-2026-0009',
    amountDue: 4800000,
    amountPaid: 4800000,
    invoiceStatus: TrangThaiHoaDon.DA_HOAN_THANH,
    dueDate: '2024-08-15',
    txnCode: 'TXN-20260815-0009',
    method: PhuongThucThanhToan.CHUYEN_KHOAN,
    staffId: staffUser1.id,
    note: 'Chuyển khoản qua App Banking',
  });

  // 5.10 HV010 (Trần Phương Anh) -> Lớp IELTS-B1-02 (Chưa đóng học phí)
  await enrollAndPay({
    lopId: class6.id,
    studentId: studentProfiles['student10'].id,
    enrollStatus: TrangThaiDangKy.CHO_THANH_TOAN,
    invoiceCode: 'HD-2026-0010',
    amountDue: 3500000,
    amountPaid: 0,
    invoiceStatus: TrangThaiHoaDon.CHUA_THANH_TOAN,
    dueDate: '2024-10-04',
  });
  console.log('✅ Đã nạp 10 Đăng ký học, Hóa đơn & Lịch sử giao dịch thu ngân đa dạng');

  // ============================================================================
  // 6. BUỔI HỌC & ĐIỂM DANH (BuoiHoc, BanGhiDiemDanh cho các lớp)
  // ============================================================================
  await prisma.banGhiDiemDanh.deleteMany({});
  await prisma.buoiHoc.deleteMany({});

  // 6.1 Buổi học lớp class1 (IELTS-B1-01) - 6 buổi
  const sessionDates1 = ['2024-09-16', '2024-09-18', '2024-09-20', '2024-09-23', '2024-09-25', '2024-09-27'];
  const sessionTopics1 = [
    'Unit 1: Introduction to IELTS & Present Perfect Tense',
    'Unit 2: Listening Section 1 & Note Taking Strategies',
    'Unit 3: Reading Skimming & Scanning Techniques',
    'Unit 4: Speaking Part 1 Topics (Hometown, Study & Work)',
    'Unit 5: Writing Task 1 Overview & Line Graph Analysis',
    'Unit 6: Midterm Review & Mini Mock Test',
  ];

  for (let i = 0; i < sessionDates1.length; i++) {
    const session = await prisma.buoiHoc.create({
      data: {
        lopHocId: class1.id,
        soThuTu: i + 1,
        ngayHoc: new Date(sessionDates1[i]),
        gioBatDau: new Date('1970-01-01T17:30:00'),
        gioKetThuc: new Date('1970-01-01T20:30:00'),
        chuDe: sessionTopics1[i],
        trangThai: TrangThaiBuoiHoc.DA_KET_THUC,
      },
    });

    // Điểm danh HV001 (Lê Thị Hoa)
    await prisma.banGhiDiemDanh.create({
      data: {
        buoiHocId: session.id,
        hocVienId: studentProfiles['student01'].id,
        trangThai: i === 3 ? TrangThaiDiemDanh.DI_MUON : TrangThaiDiemDanh.CO_MAT,
        ghiChu: i === 3 ? 'Đến muộn 10 phút' : 'Tham gia tích cực',
        giaoVienDiemDanhId: gv1.id,
      },
    });

    // Điểm danh HV005 (Vũ Bảo Ngọc)
    await prisma.banGhiDiemDanh.create({
      data: {
        buoiHocId: session.id,
        hocVienId: studentProfiles['student05'].id,
        trangThai: i === 4 ? TrangThaiDiemDanh.CO_PHEP : TrangThaiDiemDanh.CO_MAT,
        ghiChu: i === 4 ? 'Nghỉ ốm có phép' : 'Làm bài tập đầy đủ',
        giaoVienDiemDanhId: gv1.id,
      },
    });
  }

  // 6.2 Buổi học lớp class2 (TOEIC-A2-01) - 4 buổi
  const sessionDates2 = ['2024-09-17', '2024-09-19', '2024-09-21', '2024-09-24'];
  const sessionTopics2 = [
    'Unit 1: TOEIC Listening Part 1 - Photographs',
    'Unit 2: TOEIC Listening Part 2 - Question & Response',
    'Unit 3: TOEIC Reading Part 5 - Incomplete Sentences',
    'Unit 4: Grammar Focus: Modals & Conditionals',
  ];

  for (let i = 0; i < sessionDates2.length; i++) {
    const session = await prisma.buoiHoc.create({
      data: {
        lopHocId: class2.id,
        soThuTu: i + 1,
        ngayHoc: new Date(sessionDates2[i]),
        gioBatDau: new Date('1970-01-01T19:00:00'),
        gioKetThuc: new Date('1970-01-01T21:00:00'),
        chuDe: sessionTopics2[i],
        trangThai: TrangThaiBuoiHoc.DA_KET_THUC,
      },
    });

    // Điểm danh HV002 (Phạm Văn Hùng)
    await prisma.banGhiDiemDanh.create({
      data: {
        buoiHocId: session.id,
        hocVienId: studentProfiles['student02'].id,
        trangThai: i === 2 ? TrangThaiDiemDanh.VANG : TrangThaiDiemDanh.CO_MAT,
        ghiChu: i === 2 ? 'Vắng không phép' : 'Học tập chuyên cần',
        giaoVienDiemDanhId: gv2.id,
      },
    });

    // Điểm danh HV007 (Bùi Đức Thắng)
    await prisma.banGhiDiemDanh.create({
      data: {
        buoiHocId: session.id,
        hocVienId: studentProfiles['student07'].id,
        trangThai: TrangThaiDiemDanh.CO_MAT,
        ghiChu: 'Tiếp thu bài nhanh',
        giaoVienDiemDanhId: gv2.id,
      },
    });
  }

  // 6.3 Buổi học lớp class3 (COMM-B1-01) - 6 buổi
  const sessionDates3 = ['2024-08-05', '2024-08-07', '2024-08-09', '2024-08-12', '2024-08-14', '2024-08-16'];
  const sessionTopics3 = [
    'Unit 1: Business Networking & Small Talk',
    'Unit 2: Professional Email Etiquette',
    'Unit 3: Leading & Participating in Meetings',
    'Unit 4: Negotiation Strategies & Compromise',
    'Unit 5: Presentation Skills & Slide Deck Delivery',
    'Unit 6: Final Business Pitch Project',
  ];

  for (let i = 0; i < sessionDates3.length; i++) {
    const session = await prisma.buoiHoc.create({
      data: {
        lopHocId: class3.id,
        soThuTu: i + 1,
        ngayHoc: new Date(sessionDates3[i]),
        gioBatDau: new Date('1970-01-01T19:00:00'),
        gioKetThuc: new Date('1970-01-01T21:00:00'),
        chuDe: sessionTopics3[i],
        trangThai: TrangThaiBuoiHoc.DA_KET_THUC,
      },
    });

    // Điểm danh HV003 (Nguyễn Hoàng Long)
    await prisma.banGhiDiemDanh.create({
      data: {
        buoiHocId: session.id,
        hocVienId: studentProfiles['student03'].id,
        trangThai: TrangThaiDiemDanh.CO_MAT,
        ghiChu: 'Thuyết trình rất ấn tượng',
        giaoVienDiemDanhId: gv2.id,
      },
    });

    // Điểm danh HV008 (Hoàng Mai Linh)
    await prisma.banGhiDiemDanh.create({
      data: {
        buoiHocId: session.id,
        hocVienId: studentProfiles['student08'].id,
        trangThai: i === 1 ? TrangThaiDiemDanh.DI_MUON : TrangThaiDiemDanh.CO_MAT,
        ghiChu: i === 1 ? 'Muộn 5p' : 'Phát âm tự nhiên',
        giaoVienDiemDanhId: gv2.id,
      },
    });
  }

  // 6.4 Buổi học lớp class5 (IELTS-B2-01) - 5 buổi
  const sessionDates5 = ['2024-08-19', '2024-08-21', '2024-08-23', '2024-08-26', '2024-08-28'];
  const sessionTopics5 = [
    'Unit 1: Advanced Writing Task 2 - Problem & Solution',
    'Unit 2: Complex Sentence Structures & Cohesion',
    'Unit 3: Speaking Part 2 & 3 - Abstract Topics & Idioms',
    'Unit 4: Reading Passage 3 - Science & Philosophy Texts',
    'Unit 5: Mock Exam Simulation Under Real Time Pressure',
  ];

  for (let i = 0; i < sessionDates5.length; i++) {
    const session = await prisma.buoiHoc.create({
      data: {
        lopHocId: class5.id,
        soThuTu: i + 1,
        ngayHoc: new Date(sessionDates5[i]),
        gioBatDau: new Date('1970-01-01T18:00:00'),
        gioKetThuc: new Date('1970-01-01T21:00:00'),
        chuDe: sessionTopics5[i],
        trangThai: TrangThaiBuoiHoc.DA_KET_THUC,
      },
    });

    // Điểm danh HV006 (Trịnh Đình Quang)
    await prisma.banGhiDiemDanh.create({
      data: {
        buoiHocId: session.id,
        hocVienId: studentProfiles['student06'].id,
        trangThai: TrangThaiDiemDanh.CO_MAT,
        ghiChu: 'Kỹ năng làm bài xuất sắc',
        giaoVienDiemDanhId: gv4.id,
      },
    });

    // Điểm danh HV009 (Phạm Quốc Cường)
    await prisma.banGhiDiemDanh.create({
      data: {
        buoiHocId: session.id,
        hocVienId: studentProfiles['student09'].id,
        trangThai: i === 3 ? TrangThaiDiemDanh.CO_PHEP : TrangThaiDiemDanh.CO_MAT,
        ghiChu: i === 3 ? 'Có phép' : 'Tham gia nhiệt tình',
        giaoVienDiemDanhId: gv4.id,
      },
    });
  }
  console.log('✅ Đã nạp 21 Buổi học & Bảng điểm danh chuyên cần cho 4 lớp học');

  // ============================================================================
  // 7. BẢNG ĐIỂM & ĐÁNH GIÁ (KetQuaHocTap — 20% Chuyên cần, 30% Giữa kỳ, 50% Cuối kỳ)
  // ============================================================================

  // 7.1 HV001 (Lê Thị Hoa) tại lớp IELTS-B1-01 (87.75đ - ĐẠT)
  await prisma.ketQuaHocTap.upsert({
    where: { lopHocId_hocVienId: { lopHocId: class1.id, hocVienId: studentProfiles['student01'].id } },
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
      diemTongKet: 87.75,
      nhanXet: 'Học viên có nền tảng ngữ pháp rất tốt, phát âm chuẩn và phản xạ nhanh. Cần tiếp tục mở rộng vốn từ vựng học thuật cho bài thi Writing.',
      trangThaiHoanThanh: TrangThaiHoanThanh.DAT,
    },
  });

  // 7.2 HV005 (Vũ Bảo Ngọc) tại lớp IELTS-B1-01 (77.6đ - ĐẠT)
  await prisma.ketQuaHocTap.upsert({
    where: { lopHocId_hocVienId: { lopHocId: class1.id, hocVienId: studentProfiles['student05'].id } },
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

  // 7.3 HV002 (Phạm Văn Hùng) tại lớp TOEIC-A2-01 (68.5đ - ĐẠT)
  await prisma.ketQuaHocTap.upsert({
    where: { lopHocId_hocVienId: { lopHocId: class2.id, hocVienId: studentProfiles['student02'].id } },
    update: {
      diemChuyenCan: 75.0,
      diemGiuaKy: 65.0,
      diemCuoiKy: 68.0,
      diemTongKet: 68.5,
      nhanXet: 'Kỹ năng Nghe tiến bộ rõ rệt, cần bổ sung thêm từ vựng Reading Part 5.',
      trangThaiHoanThanh: TrangThaiHoanThanh.DAT,
    },
    create: {
      lopHocId: class2.id,
      hocVienId: studentProfiles['student02'].id,
      diemChuyenCan: 75.0,
      diemGiuaKy: 65.0,
      diemCuoiKy: 68.0,
      diemTongKet: 68.5,
      nhanXet: 'Kỹ năng Nghe tiến bộ rõ rệt, cần bổ sung thêm từ vựng Reading Part 5.',
      trangThaiHoanThanh: TrangThaiHoanThanh.DAT,
    },
  });

  // 7.4 HV007 (Bùi Đức Thắng) tại lớp TOEIC-A2-01 (81.0đ - ĐẠT)
  await prisma.ketQuaHocTap.upsert({
    where: { lopHocId_hocVienId: { lopHocId: class2.id, hocVienId: studentProfiles['student07'].id } },
    update: {
      diemChuyenCan: 90.0,
      diemGiuaKy: 78.0,
      diemCuoiKy: 79.0,
      diemTongKet: 80.9,
      nhanXet: 'Tác phong học tập nghiêm túc, làm bài tập về nhà rất chỉn chu.',
      trangThaiHoanThanh: TrangThaiHoanThanh.DAT,
    },
    create: {
      lopHocId: class2.id,
      hocVienId: studentProfiles['student07'].id,
      diemChuyenCan: 90.0,
      diemGiuaKy: 78.0,
      diemCuoiKy: 79.0,
      diemTongKet: 80.9,
      nhanXet: 'Tác phong học tập nghiêm túc, làm bài tập về nhà rất chỉn chu.',
      trangThaiHoanThanh: TrangThaiHoanThanh.DAT,
    },
  });

  // 7.5 HV003 (Nguyễn Hoàng Long) tại lớp COMM-B1-01 (86.5đ - ĐẠT)
  await prisma.ketQuaHocTap.upsert({
    where: { lopHocId_hocVienId: { lopHocId: class3.id, hocVienId: studentProfiles['student03'].id } },
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

  // 7.6 HV008 (Hoàng Mai Linh) tại lớp COMM-B1-01 (90.0đ - ĐẠT)
  await prisma.ketQuaHocTap.upsert({
    where: { lopHocId_hocVienId: { lopHocId: class3.id, hocVienId: studentProfiles['student08'].id } },
    update: {
      diemChuyenCan: 95.0,
      diemGiuaKy: 88.0,
      diemCuoiKy: 89.0,
      diemTongKet: 89.9,
      nhanXet: 'Phát âm tự nhiên, đàm phán linh hoạt, tinh thần làm việc nhóm tuyệt vời.',
      trangThaiHoanThanh: TrangThaiHoanThanh.DAT,
    },
    create: {
      lopHocId: class3.id,
      hocVienId: studentProfiles['student08'].id,
      diemChuyenCan: 95.0,
      diemGiuaKy: 88.0,
      diemCuoiKy: 89.0,
      diemTongKet: 89.9,
      nhanXet: 'Phát âm tự nhiên, đàm phán linh hoạt, tinh thần làm việc nhóm tuyệt vời.',
      trangThaiHoanThanh: TrangThaiHoanThanh.DAT,
    },
  });

  // 7.7 HV006 (Trịnh Đình Quang) tại lớp IELTS-B2-01 (94.0đ - ĐẠT)
  await prisma.ketQuaHocTap.upsert({
    where: { lopHocId_hocVienId: { lopHocId: class5.id, hocVienId: studentProfiles['student06'].id } },
    update: {
      diemChuyenCan: 100.0,
      diemGiuaKy: 92.0,
      diemCuoiKy: 93.0,
      diemTongKet: 94.1,
      nhanXet: 'Trình độ IELTS tương đương 7.5 - 8.0, cấu trúc bài viết Task 2 chặt chẽ và học thuật.',
      trangThaiHoanThanh: TrangThaiHoanThanh.DAT,
    },
    create: {
      lopHocId: class5.id,
      hocVienId: studentProfiles['student06'].id,
      diemChuyenCan: 100.0,
      diemGiuaKy: 92.0,
      diemCuoiKy: 93.0,
      diemTongKet: 94.1,
      nhanXet: 'Trình độ IELTS tương đương 7.5 - 8.0, cấu trúc bài viết Task 2 chặt chẽ và học thuật.',
      trangThaiHoanThanh: TrangThaiHoanThanh.DAT,
    },
  });

  // 7.8 HV009 (Phạm Quốc Cường) tại lớp IELTS-B2-01 (84.5đ - ĐẠT)
  await prisma.ketQuaHocTap.upsert({
    where: { lopHocId_hocVienId: { lopHocId: class5.id, hocVienId: studentProfiles['student09'].id } },
    update: {
      diemChuyenCan: 85.0,
      diemGiuaKy: 82.0,
      diemCuoiKy: 86.0,
      diemTongKet: 84.6,
      nhanXet: 'Nắm vững chiến thuật làm bài, phản xạ Speaking lưu loát và tự nhiên.',
      trangThaiHoanThanh: TrangThaiHoanThanh.DAT,
    },
    create: {
      lopHocId: class5.id,
      hocVienId: studentProfiles['student09'].id,
      diemChuyenCan: 85.0,
      diemGiuaKy: 82.0,
      diemCuoiKy: 86.0,
      diemTongKet: 84.6,
      nhanXet: 'Nắm vững chiến thuật làm bài, phản xạ Speaking lưu loát và tự nhiên.',
      trangThaiHoanThanh: TrangThaiHoanThanh.DAT,
    },
  });
  console.log('✅ Đã nạp 8 Bảng điểm tổng kết 20/30/50 chuẩn quy chế');

  // ============================================================================
  // 8. AUDIT LOG AI (YeuCauAI)
  // ============================================================================
  await prisma.yeuCauAI.deleteMany({});
  await prisma.yeuCauAI.createMany({
    data: [
      {
        nguoiDungId: studentProfiles['student01'].nguoiDungId!,
        loaiChucNang: LoaiChucNangAI.TU_VAN_LOP,
        promptInput: 'Tư vấn lớp học cho học viên trình độ B1, lịch rảnh Thứ 2-4-6 tối, mục tiêu thi IELTS 6.5 trong 3 tháng',
        rawOutput: '[{"maLopHoc": "IELTS-B1-01", "tenLopHoc": "IELTS B1 Buổi tối (Thứ 2-4-6)", "doTuongThich": 96, "lyDoPhuHop": "Trình độ B1 và lịch rảnh trùng khớp 100%."}]',
        validatedOutputJson: [{ maLopHoc: 'IELTS-B1-01', tenLopHoc: 'IELTS B1 Buổi tối (Thứ 2-4-6)', doTuongThich: 96 }],
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
        thoiGianXuLyMs: 2400,
      },
      {
        nguoiDungId: studentProfiles['student01'].nguoiDungId!,
        loaiChucNang: LoaiChucNangAI.TOM_TAT_TIEN_DO,
        promptInput: 'Tóm tắt tiến độ học tập cho học viên Lê Thị Hoa lớp IELTS-B1-01',
        rawOutput: 'Học viên có tỷ lệ chuyên cần cao (95%), điểm tổng kết đạt 87.75. Điểm mạnh: Ngữ pháp chắc chắn, phát âm chuẩn. Cần khắc phục: Nâng cao tốc độ làm bài Reading.',
        validatedOutputJson: { chuyenCan: 95, tongKet: 87.75 },
        trangThai: TrangThaiYeuCauAI.THANH_CONG,
        thoiGianXuLyMs: 1800,
      },
      {
        nguoiDungId: studentProfiles['student03'].nguoiDungId!,
        loaiChucNang: LoaiChucNangAI.TOM_TAT_TIEN_DO,
        promptInput: 'Tóm tắt tiến độ học tập cho học viên Nguyễn Hoàng Long lớp COMM-B1-01',
        rawOutput: 'Học viên tham gia 100% buổi học, điểm tổng kết 86.5. Điểm mạnh: Thuyết trình và phản xạ đàm phán xuất sắc.',
        validatedOutputJson: { chuyenCan: 100, tongKet: 86.5 },
        trangThai: TrangThaiYeuCauAI.THANH_CONG,
        thoiGianXuLyMs: 1650,
      },
    ],
  });
  console.log('✅ Đã nạp Audit Log AI');

  console.log('\n🎉 NẠP TOÀN BỘ SIÊU DỮ LIỆU THÀNH CÔNG!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📋 TÀI KHOẢN HỆ THỐNG ĐÃ SẴN SÀNG (Mật khẩu: 123456):');
  console.log('   👑 Quản lý (Admin)     : admin01');
  console.log('   👨‍🏫 Giáo viên (Teacher) : teacher01 (Cô Lan), teacher02 (Thầy Minh), teacher03 (Thầy Nam), teacher04 (Cô Emily)');
  console.log('   📞 Tư vấn viên (Staff) : staff01 (Thảo), staff02 (Ngân)');
  console.log('   🎓 Học viên (Student)   : student01 → student10');
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
