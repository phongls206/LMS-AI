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
  console.log('🌱 Bắt đầu nạp SIÊU DỮ LIỆU MẪU TOÀN DIỆN (10 Giảng viên, 30 Học viên, Lớp FULL 100%, Đủ ca ĐẠT/KHÔNG ĐẠT/ĐANG HỌC) cho ETC English Center...\n');

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

  // 1.2 Giáo viên (10 Giảng viên chuyên môn sâu)
  const teachersData = [
    { user: 'teacher01', ma: 'GV001', ten: 'Cô Nguyễn Thị Lan', chuyenMon: 'IELTS Academic, Ngữ Pháp Nâng Cao', bangCap: 'Thạc sĩ Ngôn ngữ Anh - ĐH Ngoại ngữ Hà Nội (IELTS 8.5)', email: 'nguyen.thi.lan@etc-english.vn', phone: '0902222001' },
    { user: 'teacher02', ma: 'GV002', ten: 'Thầy Trần Văn Minh', chuyenMon: 'TOEIC L&R, Tiếng Anh Giao Tiếp Thực Chiến', bangCap: 'Cử nhân Sư phạm Tiếng Anh - ĐH Sư phạm TP.HCM (TOEIC 985)', email: 'tran.van.minh@etc-english.vn', phone: '0902222002' },
    { user: 'teacher03', ma: 'GV003', ten: 'Thầy Vũ Hoàng Nam', chuyenMon: 'Business English, Phản Xạ & Phát Âm IPA', bangCap: 'Chứng chỉ CELTA Cambridge, Tốt nghiệp ĐH Ngoại Thương', email: 'vu.hoang.nam@etc-english.vn', phone: '0902222003' },
    { user: 'teacher04', ma: 'GV004', ten: 'Cô Emily Brown', chuyenMon: 'Native English Speaking, Pronunciation & Presentation', bangCap: 'Master of Arts in TESOL - University of Sydney', email: 'emily.brown@etc-english.vn', phone: '0902222004' },
    { user: 'teacher05', ma: 'GV005', ten: 'Thầy Lê Anh Tuấn', chuyenMon: 'IELTS Writing & Speaking Chuyên Sâu', bangCap: 'IELTS 8.0, Cử nhân Sư phạm Tiếng Anh ĐH Quốc Gia', email: 'le.anh.tuan@etc-english.vn', phone: '0902222005' },
    { user: 'teacher06', ma: 'GV006', ten: 'Cô Phạm Thu Hà', chuyenMon: 'Tiếng Anh Giao Tiếp Cơ Bản & Phát Âm Chuẩn', bangCap: 'Chứng chỉ TESOL 120h, Cử nhân ĐH Hà Nội', email: 'pham.thu.ha@etc-english.vn', phone: '0902222006' },
    { user: 'teacher07', ma: 'GV007', ten: 'Thầy Đặng Quốc Bảo', chuyenMon: 'Luyện Thi TOEIC 4 Kỹ Năng Cấp Tốc', bangCap: 'TOEIC 960, Cử nhân Tài chính Quốc tế', email: 'dang.quoc.bao@etc-english.vn', phone: '0902222007' },
    { user: 'teacher08', ma: 'GV008', ten: 'Cô Sarah Jenkins', chuyenMon: 'Cambridge FCE/CAE & Academic Writing', bangCap: 'Cambridge DELTA, University of Oxford Alumni', email: 'sarah.jenkins@etc-english.vn', phone: '0902222008' },
    { user: 'teacher09', ma: 'GV009', ten: 'Thầy Hoàng Minh Đức', chuyenMon: 'Ngữ Pháp Nền Tảng & Luyện Đề Chuyên Ngữ', bangCap: 'Thạc sĩ Lý luận và Phương pháp Dạy học Tiếng Anh', email: 'hoang.minh.duc@etc-english.vn', phone: '0902222009' },
    { user: 'teacher10', ma: 'GV010', ten: 'Cô Đỗ Mai Phương', chuyenMon: 'Tiếng Anh Tổng Quát & Giao Tiếp Phản Xạ', bangCap: 'Cử nhân Ngôn ngữ Anh ĐH Ngoại Ngữ', email: 'do.mai.phuong@etc-english.vn', phone: '0902222010' },
  ];

  const teacherProfiles: Record<string, any> = {};

  for (const t of teachersData) {
    const u = await prisma.nguoiDung.upsert({
      where: { tenDangNhap: t.user },
      update: { matKhauMaHoa: defaultPassword },
      create: {
        tenDangNhap: t.user,
        matKhauMaHoa: defaultPassword,
        vaiTro: VaiTro.GIAO_VIEN,
        email: t.email,
        soDienThoai: t.phone,
      },
    });

    const p = await prisma.hoSoGiaoVien.upsert({
      where: { maGiaoVien: t.ma },
      update: { nguoiDungId: u.id, trangThai: TrangThaiGiaoVien.DANG_LAM_VIEC },
      create: {
        nguoiDungId: u.id,
        maGiaoVien: t.ma,
        hoTen: t.ten,
        chuyenMon: t.chuyenMon,
        bangCap: t.bangCap,
        trangThai: TrangThaiGiaoVien.DANG_LAM_VIEC,
      },
    });
    teacherProfiles[t.user] = p;
  }
  console.log('✅ Đã nạp 10 Giảng viên: GV001 → GV010');

  // 1.3 Tư vấn viên (2 Nhân viên Tuyển sinh / Thu ngân)
  const staffData = [
    { user: 'staff01', ten: 'Nguyễn Thị Thu Thảo', email: 'nguyen.thao@etc-english.vn', phone: '0903333001' },
    { user: 'staff02', ten: 'Hoàng Kim Ngân', email: 'hoang.ngan@etc-english.vn', phone: '0903333002' },
  ];

  for (const s of staffData) {
    await prisma.nguoiDung.upsert({
      where: { tenDangNhap: s.user },
      update: { matKhauMaHoa: defaultPassword },
      create: {
        tenDangNhap: s.user,
        matKhauMaHoa: defaultPassword,
        vaiTro: VaiTro.TU_VAN_VIEN,
        email: s.email,
        soDienThoai: s.phone,
      },
    });
  }
  console.log('✅ Đã nạp 2 Tư vấn viên: staff01, staff02');

  // 1.4 Học viên (30 Học viên với đầy đủ cấp độ CEFR A1 → C1)
  const studentData = [
    { user: 'student01', ma: 'HV001', ten: 'Lê Thị Hoa', cefr: TrinhDoCEFR.B1, dob: '2002-05-15', gender: 'Nữ', phone: '0904444001', email: 'le.thi.hoa@gmail.com', source: 'Placement Test 15/08/2024 (Đạt 58/100)', schedule: { thu: [2, 4, 6], gio: '17:30-21:00' } },
    { user: 'student02', ma: 'HV002', ten: 'Phạm Văn Hùng', cefr: TrinhDoCEFR.A2, dob: '2001-11-20', gender: 'Nam', phone: '0904444002', email: 'pham.van.hung@gmail.com', source: 'Placement Test 01/09/2024 (Đạt 42/100)', schedule: { thu: [3, 5, 7], gio: '19:00-21:00' } },
    { user: 'student03', ma: 'HV003', ten: 'Nguyễn Hoàng Long', cefr: TrinhDoCEFR.B2, dob: '2000-03-10', gender: 'Nam', phone: '0904444003', email: 'hoanglong.nguyen@gmail.com', source: 'IELTS 6.0 IDP Certificate', schedule: { thu: [2, 4, 6], gio: '18:00-21:00' } },
    { user: 'student04', ma: 'HV004', ten: 'Đỗ Minh Châu', cefr: TrinhDoCEFR.A1, dob: '2003-08-25', gender: 'Nữ', phone: '0904444004', email: 'minhchau.do@gmail.com', source: 'Học viên mất gốc kiểm tra trực tiếp', schedule: { thu: [7, 8], gio: '08:30-11:30' } },
    { user: 'student05', ma: 'HV005', ten: 'Vũ Bảo Ngọc', cefr: TrinhDoCEFR.B1, dob: '2002-12-05', gender: 'Nữ', phone: '0904444005', email: 'baongoc.vu@gmail.com', source: 'Thi thử CEFR B1 Online', schedule: { thu: [2, 4, 6], gio: '17:30-20:30' } },
    { user: 'student06', ma: 'HV006', ten: 'Trịnh Đình Quang', cefr: TrinhDoCEFR.C1, dob: '1999-07-18', gender: 'Nam', phone: '0904444006', email: 'dinhquang.trinh@gmail.com', source: 'IELTS 7.5 BC Certificate', schedule: { thu: [2, 4, 6], gio: '18:30-21:30' } },
    { user: 'student07', ma: 'HV007', ten: 'Bùi Đức Thắng', cefr: TrinhDoCEFR.A2, dob: '2004-01-12', gender: 'Nam', phone: '0904444007', email: 'thang.bui@gmail.com', source: 'Kiểm tra đầu vào TOEIC 400', schedule: { thu: [3, 5, 7], gio: '19:00-21:00' } },
    { user: 'student08', ma: 'HV008', ten: 'Hoàng Mai Linh', cefr: TrinhDoCEFR.B1, dob: '2001-09-30', gender: 'Nữ', phone: '0904444008', email: 'mailinh.hoang@gmail.com', source: 'Đánh giá năng lực tiếng Anh B1', schedule: { thu: [2, 4, 6], gio: '19:00-21:00' } },
    { user: 'student09', ma: 'HV009', ten: 'Phạm Quốc Cường', cefr: TrinhDoCEFR.B2, dob: '2000-06-22', gender: 'Nam', phone: '0904444009', email: 'cuong.pham@gmail.com', source: 'Bảng điểm IELTS 6.5 British Council', schedule: { thu: [2, 4, 6], gio: '18:00-21:00' } },
    { user: 'student10', ma: 'HV010', ten: 'Trần Phương Anh', cefr: TrinhDoCEFR.C1, dob: '1998-04-14', gender: 'Nữ', phone: '0904444010', email: 'phuonganh.tran@gmail.com', source: 'Cử nhân ngôn ngữ Anh', schedule: { thu: [7, 8], gio: '08:30-11:30' } },
    
    // 20 học viên từ HV011 -> HV030
    { user: 'student11', ma: 'HV011', ten: 'Nguyễn Văn An', cefr: TrinhDoCEFR.B1, dob: '2003-02-14', gender: 'Nam', phone: '0904444011', email: 'an.nguyen@gmail.com', source: 'Thi thử đầu vào B1', schedule: { thu: [2, 4, 6], gio: '17:30-20:30' } },
    { user: 'student12', ma: 'HV012', ten: 'Trần Thị Bích', cefr: TrinhDoCEFR.B1, dob: '2002-08-19', gender: 'Nữ', phone: '0904444012', email: 'bich.tran@gmail.com', source: 'Chuyển trường từ cơ sở khác', schedule: { thu: [2, 4, 6], gio: '17:30-20:30' } },
    { user: 'student13', ma: 'HV013', ten: 'Lê Minh Cảnh', cefr: TrinhDoCEFR.B1, dob: '2001-04-23', gender: 'Nam', phone: '0904444013', email: 'canh.le@gmail.com', source: 'Kiểm tra trình độ đầu khóa', schedule: { thu: [2, 4, 6], gio: '17:30-20:30' } },
    { user: 'student14', ma: 'HV014', ten: 'Phạm Thu Dung', cefr: TrinhDoCEFR.B1, dob: '2004-10-09', gender: 'Nữ', phone: '0904444014', email: 'dung.pham@gmail.com', source: 'Test đầu vào đạt 62/100', schedule: { thu: [2, 4, 6], gio: '17:30-20:30' } },
    { user: 'student15', ma: 'HV015', ten: 'Hoàng Anh Dũng', cefr: TrinhDoCEFR.B1, dob: '2000-12-11', gender: 'Nam', phone: '0904444015', email: 'dung.hoang@gmail.com', source: 'IELTS 5.5 mock test', schedule: { thu: [2, 4, 6], gio: '17:30-20:30' } },
    { user: 'student16', ma: 'HV016', ten: 'Đinh Thị Giang', cefr: TrinhDoCEFR.B1, dob: '2003-06-07', gender: 'Nữ', phone: '0904444016', email: 'giang.dinh@gmail.com', source: 'Đăng ký học hè', schedule: { thu: [2, 4, 6], gio: '17:30-20:30' } },
    { user: 'student17', ma: 'HV017', ten: 'Vũ Đức Hải', cefr: TrinhDoCEFR.B1, dob: '2002-03-31', gender: 'Nam', phone: '0904444017', email: 'hai.vu@gmail.com', source: 'Placement Test B1', schedule: { thu: [2, 4, 6], gio: '17:30-20:30' } },
    { user: 'student18', ma: 'HV018', ten: 'Ngô Thanh Hằng', cefr: TrinhDoCEFR.B1, dob: '2001-07-28', gender: 'Nữ', phone: '0904444018', email: 'hang.ngo@gmail.com', source: 'Test năng lực B1', schedule: { thu: [2, 4, 6], gio: '17:30-20:30' } },
    { user: 'student19', ma: 'HV019', ten: 'Dương Quốc Huy', cefr: TrinhDoCEFR.B1, dob: '2004-09-15', gender: 'Nam', phone: '0904444019', email: 'huy.duong@gmail.com', source: 'Đánh giá đầu vào', schedule: { thu: [2, 4, 6], gio: '17:30-20:30' } },
    { user: 'student20', ma: 'HV020', ten: 'Lý Mỹ Linh', cefr: TrinhDoCEFR.B1, dob: '2003-11-04', gender: 'Nữ', phone: '0904444020', email: 'linh.ly@gmail.com', source: 'Chứng chỉ Cambridge PET B1', schedule: { thu: [2, 4, 6], gio: '17:30-20:30' } },

    { user: 'student21', ma: 'HV021', ten: 'Mai Tiến Đạt', cefr: TrinhDoCEFR.B1, dob: '2002-01-25', gender: 'Nam', phone: '0904444021', email: 'dat.mai@gmail.com', source: 'Thi B1 đạt yêu cầu', schedule: { thu: [2, 4, 6], gio: '17:30-20:30' } },
    { user: 'student22', ma: 'HV022', ten: 'Trịnh Khánh Huyền', cefr: TrinhDoCEFR.B1, dob: '2003-05-18', gender: 'Nữ', phone: '0904444022', email: 'huyen.trinh@gmail.com', source: 'Placement Test B1', schedule: { thu: [2, 4, 6], gio: '17:30-20:30' } },
    { user: 'student23', ma: 'HV023', ten: 'Phan Tuấn Kiệt', cefr: TrinhDoCEFR.B1, dob: '2001-10-12', gender: 'Nam', phone: '0904444023', email: 'kiet.phan@gmail.com', source: 'Kiểm tra xếp lớp B1', schedule: { thu: [2, 4, 6], gio: '17:30-20:30' } },
    { user: 'student24', ma: 'HV024', ten: 'Lâm Bích Loan', cefr: TrinhDoCEFR.A2, dob: '2004-04-08', gender: 'Nữ', phone: '0904444024', email: 'loan.lam@gmail.com', source: 'TOEIC Starter Test 420', schedule: { thu: [3, 5, 7], gio: '19:00-21:00' } },
    
    { user: 'student25', ma: 'HV025', ten: 'Võ Minh Nhật', cefr: TrinhDoCEFR.A2, dob: '2005-02-17', gender: 'Nam', phone: '0904444025', email: 'nhat.vo@gmail.com', source: 'Kiểm tra đầu vào A2', schedule: { thu: [3, 5, 7], gio: '19:00-21:00' } },
    { user: 'student26', ma: 'HV026', ten: 'Đoàn Kim Oanh', cefr: TrinhDoCEFR.A2, dob: '2004-12-29', gender: 'Nữ', phone: '0904444026', email: 'oanh.doan@gmail.com', source: 'Test đầu vào A2', schedule: { thu: [3, 5, 7], gio: '19:00-21:00' } },
    { user: 'student27', ma: 'HV027', ten: 'Tạ Hoàng Phúc', cefr: TrinhDoCEFR.A1, dob: '2003-08-14', gender: 'Nam', phone: '0904444027', email: 'phuc.ta@gmail.com', source: 'Mất gốc tiếng Anh', schedule: { thu: [3, 5], gio: '17:30-19:30' } },

    { user: 'student28', ma: 'HV028', ten: 'Quách Thái Sơn', cefr: TrinhDoCEFR.B1, dob: '2000-09-03', gender: 'Nam', phone: '0904444028', email: 'son.quach@gmail.com', source: 'Test giao tiếp B1', schedule: { thu: [2, 4, 6], gio: '19:00-21:00' } },
    { user: 'student29', ma: 'HV029', ten: 'Nghiêm Thu Trang', cefr: TrinhDoCEFR.B1, dob: '2001-03-27', gender: 'Nữ', phone: '0904444029', email: 'trang.nghiem@gmail.com', source: 'Phỏng vấn Speaking B1', schedule: { thu: [2, 4, 6], gio: '19:00-21:00' } },
    { user: 'student30', ma: 'HV030', ten: 'Lưu Quang Vinh', cefr: TrinhDoCEFR.B1, dob: '1999-11-19', gender: 'Nam', phone: '0904444030', email: 'vinh.luu@gmail.com', source: 'Chứng chỉ giao tiếp B1', schedule: { thu: [2, 4, 6], gio: '19:00-21:00' } },
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
  console.log('✅ Đã nạp 30 Học viên: HV001 → HV030');

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
  // Lớp 1: IELTS-B1-01 (LỚP FULL 100% SĨ SỐ: 15/15 HV)
  const class1 = await prisma.lopHoc.upsert({
    where: { maLopHoc: 'IELTS-B1-01' },
    update: { siSoToiDa: 15, siSoHienTai: 15, trangThai: TrangThaiLopHoc.DANG_HOC },
    create: {
      khoaHocId: course3.id,
      maLopHoc: 'IELTS-B1-01',
      tenLopHoc: 'IELTS B1 Buổi tối (Thứ 2-4-6)',
      siSoToiDa: 15,
      siSoHienTai: 15,
      ngayBatDau: new Date('2024-09-16'),
      ngayKetThuc: new Date('2024-12-16'),
      phongHoc: 'Phòng A101',
      trangThai: TrangThaiLopHoc.DANG_HOC,
    },
  });

  // Lớp 2: TOEIC-A2-01 (6/15 HV - 40%)
  const class2 = await prisma.lopHoc.upsert({
    where: { maLopHoc: 'TOEIC-A2-01' },
    update: { siSoToiDa: 15, siSoHienTai: 6, trangThai: TrangThaiLopHoc.DANG_HOC },
    create: {
      khoaHocId: course2.id,
      maLopHoc: 'TOEIC-A2-01',
      tenLopHoc: 'TOEIC Starter Thứ 3-5-7',
      siSoToiDa: 15,
      siSoHienTai: 6,
      ngayBatDau: new Date('2024-09-17'),
      ngayKetThuc: new Date('2024-12-10'),
      phongHoc: 'Phòng B202',
      trangThai: TrangThaiLopHoc.DANG_HOC,
    },
  });

  // Lớp 3: COMM-B1-01 (LỚP FULL 100% SĨ SỐ: 5/5 HV)
  const class3 = await prisma.lopHoc.upsert({
    where: { maLopHoc: 'COMM-B1-01' },
    update: { siSoToiDa: 5, siSoHienTai: 5, trangThai: TrangThaiLopHoc.DANG_HOC },
    create: {
      khoaHocId: course5.id,
      maLopHoc: 'COMM-B1-01',
      tenLopHoc: 'Giao Tiếp Doanh Nghiệp Tối T2-4-6',
      siSoToiDa: 5,
      siSoHienTai: 5,
      ngayBatDau: new Date('2024-08-01'),
      ngayKetThuc: new Date('2024-11-01'),
      phongHoc: 'Phòng C301',
      trangThai: TrangThaiLopHoc.DANG_HOC,
    },
  });

  // Lớp 4: ENG-A1-01 (4/20 HV - 20%)
  const class4 = await prisma.lopHoc.upsert({
    where: { maLopHoc: 'ENG-A1-01' },
    update: { siSoToiDa: 20, siSoHienTai: 4, trangThai: TrangThaiLopHoc.DANG_MO_DANG_KY },
    create: {
      khoaHocId: course1.id,
      maLopHoc: 'ENG-A1-01',
      tenLopHoc: 'Tiếng Anh Căn Bản Cho Người Mới Bắt Đầu',
      siSoToiDa: 20,
      siSoHienTai: 4,
      ngayBatDau: new Date('2024-09-20'),
      ngayKetThuc: new Date('2024-12-20'),
      phongHoc: 'Phòng B201',
      trangThai: TrangThaiLopHoc.DANG_MO_DANG_KY,
    },
  });

  // Lớp 5: IELTS-B2-01 (3/10 HV - 30%)
  const class5 = await prisma.lopHoc.upsert({
    where: { maLopHoc: 'IELTS-B2-01' },
    update: { siSoToiDa: 10, siSoHienTai: 3, trangThai: TrangThaiLopHoc.DANG_HOC },
    create: {
      khoaHocId: course4.id,
      maLopHoc: 'IELTS-B2-01',
      tenLopHoc: 'IELTS Master 6.5+ Chuyên Sâu Tối T2-4-6',
      siSoToiDa: 10,
      siSoHienTai: 3,
      ngayBatDau: new Date('2024-08-15'),
      ngayKetThuc: new Date('2024-11-30'),
      phongHoc: 'Phòng A103',
      trangThai: TrangThaiLopHoc.DANG_HOC,
    },
  });

  // Lớp 6: IELTS-B1-02 (2/20 HV - 10%)
  const class6 = await prisma.lopHoc.upsert({
    where: { maLopHoc: 'IELTS-B1-02' },
    update: { siSoToiDa: 20, siSoHienTai: 2, trangThai: TrangThaiLopHoc.DANG_MO_DANG_KY },
    create: {
      khoaHocId: course3.id,
      maLopHoc: 'IELTS-B1-02',
      tenLopHoc: 'IELTS B1 Cuối Tuần (Thứ 7 - CN)',
      siSoToiDa: 20,
      siSoHienTai: 2,
      ngayBatDau: new Date('2024-10-05'),
      ngayKetThuc: new Date('2025-01-05'),
      phongHoc: 'Phòng A102',
      trangThai: TrangThaiLopHoc.DANG_MO_DANG_KY,
    },
  });
  console.log('✅ Đã nạp 6 Lớp học (Bao gồm lớp IELTS-B1-01 và COMM-B1-01 FULL 100% sĩ số)');

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
    { lopId: class1.id, gvId: teacherProfiles['teacher01'].id, vaitro: VaiTroPhanCong.CHINH },
    { lopId: class6.id, gvId: teacherProfiles['teacher01'].id, vaitro: VaiTroPhanCong.CHINH },
    { lopId: class2.id, gvId: teacherProfiles['teacher02'].id, vaitro: VaiTroPhanCong.CHINH },
    { lopId: class3.id, gvId: teacherProfiles['teacher02'].id, vaitro: VaiTroPhanCong.CHINH },
    { lopId: class4.id, gvId: teacherProfiles['teacher03'].id, vaitro: VaiTroPhanCong.CHINH },
    { lopId: class5.id, gvId: teacherProfiles['teacher04'].id, vaitro: VaiTroPhanCong.CHINH },
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
  await prisma.thanhToan.deleteMany({});
  await prisma.hoaDon.deleteMany({});
  await prisma.dangKyHoc.deleteMany({});

  // Helper create enroll + invoice + payment
  const enrollAndPay = async (params: {
    lopId: bigint;
    studentId: bigint;
    enrollStatus: TrangThaiDangKy;
    invoiceCode: string;
    amountDue: number;
    amountPaid: number;
    invoiceStatus: TrangThaiHoaDon;
    payCode?: string;
    payMethod?: PhuongThucThanhToan;
  }) => {
    const dk = await prisma.dangKyHoc.create({
      data: {
        hocVienId: params.studentId,
        lopHocId: params.lopId,
        ngayDangKy: new Date('2024-09-01'),
        trangThai: params.enrollStatus,
      },
    });

    const hd = await prisma.hoaDon.create({
      data: {
        dangKyHocId: dk.id,
        hocVienId: params.studentId,
        maHoaDon: params.invoiceCode,
        soTienPhaiTra: params.amountDue,
        soTienDaTra: params.amountPaid,
        hanThanhToan: new Date('2024-09-15'),
        trangThai: params.invoiceStatus,
      },
    });

    if (params.amountPaid > 0 && params.payCode && params.payMethod) {
      await prisma.thanhToan.create({
        data: {
          hoaDonId: hd.id,
          maGiaoDich: params.payCode,
          soTien: params.amountPaid,
          phuongThuc: params.payMethod,
          thoiGianThanhToan: new Date('2024-09-05'),
          trangThai: TrangThaiThanhToan.THANH_CONG,
        },
      });
    }
  };

  // 5.1 Lớp IELTS-B1-01 (ĐỦ 15 HỌC VIÊN: student01, student05, student11..student23 -> FULL 15/15)
  const class1Students = [
    'student01', 'student05', 'student11', 'student12', 'student13', 
    'student14', 'student15', 'student16', 'student17', 'student18', 
    'student19', 'student20', 'student21', 'student22', 'student23'
  ];
  let idx = 1;
  for (const sUser of class1Students) {
    const sProfile = studentProfiles[sUser];
    await enrollAndPay({
      lopId: class1.id,
      studentId: sProfile.id,
      enrollStatus: TrangThaiDangKy.DA_XAC_NHAN,
      invoiceCode: `HD-IELTS-B1-${String(idx).padStart(3, '0')}`,
      amountDue: 3500000,
      amountPaid: 3500000,
      invoiceStatus: TrangThaiHoaDon.DA_HOAN_THANH,
      payCode: `TX-IELTS-B1-${String(idx).padStart(3, '0')}`,
      payMethod: PhuongThucThanhToan.CHUYEN_KHOAN,
    });
    idx++;
  }

  // 5.2 Lớp TOEIC-A2-01 (6 học viên: student02, student07, student24, student25, student26, student27)
  const class2Students = ['student02', 'student07', 'student24', 'student25', 'student26', 'student27'];
  idx = 1;
  for (const sUser of class2Students) {
    const sProfile = studentProfiles[sUser];
    await enrollAndPay({
      lopId: class2.id,
      studentId: sProfile.id,
      enrollStatus: TrangThaiDangKy.DA_XAC_NHAN,
      invoiceCode: `HD-TOEIC-A2-${String(idx).padStart(3, '0')}`,
      amountDue: 2800000,
      amountPaid: 2800000,
      invoiceStatus: TrangThaiHoaDon.DA_HOAN_THANH,
      payCode: `TX-TOEIC-A2-${String(idx).padStart(3, '0')}`,
      payMethod: PhuongThucThanhToan.TIEN_MAT,
    });
    idx++;
  }

  // 5.3 Lớp COMM-B1-01 (ĐỦ 5 HỌC VIÊN: student03, student08, student28, student29, student30 -> FULL 5/5)
  const class3Students = ['student03', 'student08', 'student28', 'student29', 'student30'];
  idx = 1;
  for (const sUser of class3Students) {
    const sProfile = studentProfiles[sUser];
    await enrollAndPay({
      lopId: class3.id,
      studentId: sProfile.id,
      enrollStatus: TrangThaiDangKy.DA_XAC_NHAN,
      invoiceCode: `HD-COMM-B1-${String(idx).padStart(3, '0')}`,
      amountDue: 3200000,
      amountPaid: 3200000,
      invoiceStatus: TrangThaiHoaDon.DA_HOAN_THANH,
      payCode: `TX-COMM-B1-${String(idx).padStart(3, '0')}`,
      payMethod: PhuongThucThanhToan.CHUYEN_KHOAN,
    });
    idx++;
  }

  // 5.4 Lớp ENG-A1-01 (4 học viên: student04, student25, student26, student27)
  const class4Students = ['student04', 'student25', 'student26', 'student27'];
  idx = 1;
  for (const sUser of class4Students) {
    const sProfile = studentProfiles[sUser];
    await enrollAndPay({
      lopId: class4.id,
      studentId: sProfile.id,
      enrollStatus: TrangThaiDangKy.DA_XAC_NHAN,
      invoiceCode: `HD-ENG-A1-${String(idx).padStart(3, '0')}`,
      amountDue: 2200000,
      amountPaid: 2200000,
      invoiceStatus: TrangThaiHoaDon.DA_HOAN_THANH,
      payCode: `TX-ENG-A1-${String(idx).padStart(3, '0')}`,
      payMethod: PhuongThucThanhToan.TIEN_MAT,
    });
    idx++;
  }

  // 5.5 Lớp IELTS-B2-01 (3 học viên: student06, student09, student10)
  const class5Students = ['student06', 'student09', 'student10'];
  idx = 1;
  for (const sUser of class5Students) {
    const sProfile = studentProfiles[sUser];
    await enrollAndPay({
      lopId: class5.id,
      studentId: sProfile.id,
      enrollStatus: TrangThaiDangKy.DA_XAC_NHAN,
      invoiceCode: `HD-IELTS-B2-${String(idx).padStart(3, '0')}`,
      amountDue: 4800000,
      amountPaid: 4800000,
      invoiceStatus: TrangThaiHoaDon.DA_HOAN_THANH,
      payCode: `TX-IELTS-B2-${String(idx).padStart(3, '0')}`,
      payMethod: PhuongThucThanhToan.CHUYEN_KHOAN,
    });
    idx++;
  }

  // 5.6 Lớp IELTS-B1-02 (2 học viên: student10, student05)
  const class6Students = ['student10', 'student05'];
  idx = 1;
  for (const sUser of class6Students) {
    const sProfile = studentProfiles[sUser];
    await enrollAndPay({
      lopId: class6.id,
      studentId: sProfile.id,
      enrollStatus: TrangThaiDangKy.CHO_THANH_TOAN,
      invoiceCode: `HD-IELTS-B1-02-${String(idx).padStart(3, '0')}`,
      amountDue: 3500000,
      amountPaid: 0,
      invoiceStatus: TrangThaiHoaDon.CHUA_THANH_TOAN,
    });
    idx++;
  }
  console.log('✅ Đã nạp Đăng ký học, Hóa đơn & Thanh toán đầy đủ');

  // ============================================================================
  // 6. BUỔI HỌC & ĐIỂM DANH (BuoiHoc & BanGhiDiemDanh)
  // ============================================================================
  await prisma.banGhiDiemDanh.deleteMany({});
  await prisma.buoiHoc.deleteMany({});
  
  // Tạo 8 buổi học cho lớp IELTS-B1-01
  const class1Sessions = [
    { so: 1, ngay: '2024-09-16', tieude: 'Orientation & Diagnostic Test' },
    { so: 2, ngay: '2024-09-18', tieude: 'Listening Section 1 & 2 Strategies' },
    { so: 3, ngay: '2024-09-20', tieude: 'Reading Skimming & Scanning' },
    { so: 4, ngay: '2024-09-23', tieude: 'Speaking Part 1 Fluency' },
    { so: 5, ngay: '2024-09-25', tieude: 'Writing Task 1 Overview & Trends' },
    { so: 6, ngay: '2024-09-27', tieude: 'Mid-term Assessment & Feedback' },
    { so: 7, ngay: '2024-09-30', tieude: 'Writing Task 2 Essay Structure' },
    { so: 8, ngay: '2024-10-02', tieude: 'Final Mock Test & Wrap-up' },
  ];

  const class1TeacherId = teacherProfiles['teacher01'].id;
  for (const sess of class1Sessions) {
    const b = await prisma.buoiHoc.create({
      data: {
        lopHocId: class1.id,
        soThuTu: sess.so,
        ngayHoc: new Date(sess.ngay),
        gioBatDau: new Date('1970-01-01T17:30:00'),
        gioKetThuc: new Date('1970-01-01T20:30:00'),
        chuDe: sess.tieude,
        trangThai: TrangThaiBuoiHoc.DA_KET_THUC,
      },
    });

    // Điểm danh cho tất cả 15 học viên trong lớp
    for (const sUser of class1Students) {
      const sProfile = studentProfiles[sUser];
      const isAbsent = (sUser === 'student15' && (sess.so === 3 || sess.so === 4 || sess.so === 6)) || (sUser === 'student17' && (sess.so === 2 || sess.so === 5));
      const isLate = sUser === 'student12' && sess.so === 2;
      const attStatus = isAbsent ? TrangThaiDiemDanh.VANG : isLate ? TrangThaiDiemDanh.DI_MUON : TrangThaiDiemDanh.CO_MAT;

      await prisma.banGhiDiemDanh.create({
        data: {
          buoiHocId: b.id,
          hocVienId: sProfile.id,
          giaoVienDiemDanhId: class1TeacherId,
          trangThai: attStatus,
          ghiChu: isAbsent ? 'Vắng không phép' : isLate ? 'Kẹt xe đến muộn 15p' : 'Đi học đúng giờ',
        },
      });
    }
  }

  // Tạo 6 buổi học cho lớp TOEIC-A2-01
  const class2Sessions = [
    { so: 1, ngay: '2024-09-17', tieude: 'Part 1 Photographs & Vocabulary' },
    { so: 2, ngay: '2024-09-19', tieude: 'Part 2 Question - Response' },
    { so: 3, ngay: '2024-09-21', tieude: 'Part 5 Incomplete Sentences Grammar' },
    { so: 4, ngay: '2024-09-24', tieude: 'Mid-term Quiz & Listening Part 3' },
    { so: 5, ngay: '2024-09-26', tieude: 'Part 6 Text Completion' },
    { so: 6, ngay: '2024-09-28', tieude: 'Final Review & Practice Test' },
  ];

  const class2TeacherId = teacherProfiles['teacher02'].id;
  for (const sess of class2Sessions) {
    const b = await prisma.buoiHoc.create({
      data: {
        lopHocId: class2.id,
        soThuTu: sess.so,
        ngayHoc: new Date(sess.ngay),
        gioBatDau: new Date('1970-01-01T19:00:00'),
        gioKetThuc: new Date('1970-01-01T21:00:00'),
        chuDe: sess.tieude,
        trangThai: TrangThaiBuoiHoc.DA_KET_THUC,
      },
    });

    for (const sUser of class2Students) {
      const sProfile = studentProfiles[sUser];
      const isAbsent = sUser === 'student27' && sess.so === 3;
      const attStatus = isAbsent ? TrangThaiDiemDanh.VANG : TrangThaiDiemDanh.CO_MAT;

      await prisma.banGhiDiemDanh.create({
        data: {
          buoiHocId: b.id,
          hocVienId: sProfile.id,
          giaoVienDiemDanhId: class2TeacherId,
          trangThai: attStatus,
          ghiChu: isAbsent ? 'Nghỉ có phép' : 'Có mặt đầy đủ',
        },
      });
    }
  }
  console.log('✅ Đã nạp Buổi học & Bản ghi điểm danh');

  // ============================================================================
  // 7. BẢNG ĐIỂM & ĐÁNH GIÁ (KetQuaHocTap — 20% Chuyên cần, 30% Giữa kỳ, 50% Cuối kỳ)
  // Có đầy đủ ca ĐẠT, KHÔNG ĐẠT (do điểm thấp / vắng nhiều), và ĐANG HỌC
  // ============================================================================
  await prisma.ketQuaHocTap.deleteMany({});

  // Điểm số cho học viên lớp IELTS-B1-01 (15 học viên)
  const class1Grades = [
    // --- Nhóm ĐẠT ---
    { user: 'student01', cc: 95.0, gk: 82.5, ck: 88.0, total: 87.75, note: 'Ngữ pháp tốt, phát âm chuẩn. Cần luyện thêm từ vựng Writing.', status: TrangThaiHoanThanh.DAT },
    { user: 'student05', cc: 85.0, gk: 72.0, ck: 78.0, total: 77.6, note: 'Chăm chỉ, làm bài đầy đủ, tự tin hơn trong Speaking.', status: TrangThaiHoanThanh.DAT },
    { user: 'student11', cc: 90.0, gk: 80.0, ck: 85.0, total: 84.5, note: 'Tiếp thu bài nhanh, phản xạ lưu loát.', status: TrangThaiHoanThanh.DAT },
    { user: 'student12', cc: 88.0, gk: 75.0, ck: 80.0, total: 80.1, note: 'Có tiến bộ rõ rệt ở kỹ năng Reading.', status: TrangThaiHoanThanh.DAT },
    { user: 'student13', cc: 92.0, gk: 88.0, ck: 90.0, total: 89.8, note: 'Bài thi cuối kỳ xuất sắc, nắm chắc cấu trúc bài luận.', status: TrangThaiHoanThanh.DAT },
    { user: 'student14', cc: 95.0, gk: 85.0, ck: 87.0, total: 88.0, note: 'Tác phong học tập gương mẫu, nhiệt tình trao đổi.', status: TrangThaiHoanThanh.DAT },
    { user: 'student16', cc: 90.0, gk: 78.0, ck: 82.0, total: 82.4, note: 'Khả năng Nghe tốt, cần trau chuốt phần phát âm âm đuôi.', status: TrangThaiHoanThanh.DAT },
    { user: 'student18', cc: 92.0, gk: 84.0, ck: 86.0, total: 86.6, note: 'Kỹ năng Writing mạch lạc, lập luận chặt chẽ.', status: TrangThaiHoanThanh.DAT },
    { user: 'student22', cc: 88.0, gk: 76.0, ck: 80.0, total: 80.4, note: 'Hoàn thành tốt các kỹ năng đầu ra của khóa B1.', status: TrangThaiHoanThanh.DAT },

    // --- Nhóm KHÔNG ĐẠT (3 Học viên rớt do vắng nhiều / điểm thi < 50đ) ---
    { user: 'student15', cc: 62.5, gk: 45.0, ck: 40.0, total: 46.0, note: 'Vắng 3/8 buổi (Chuyên cần 62.5% < 80%) và điểm thi dưới 50đ. Không đủ điều kiện hoàn thành khóa.', status: TrangThaiHoanThanh.KHONG_DAT },
    { user: 'student17', cc: 75.0, gk: 42.0, ck: 44.0, total: 49.6, note: 'Chuyên cần dưới 80% và bài thi cuối kỳ không đạt chuẩn B1. Đề xuất học lại lớp tăng cường.', status: TrangThaiHoanThanh.KHONG_DAT },
    { user: 'student23', cc: 70.0, gk: 40.0, ck: 48.0, total: 48.0, note: 'Điểm tổng kết dưới 50đ, không đủ điều kiện cấp chứng nhận hoàn thành.', status: TrangThaiHoanThanh.KHONG_DAT },

    // --- Nhóm ĐANG HỌC (3 Học viên đang giữa khóa, chưa thi cuối kỳ) ---
    { user: 'student19', cc: 85.0, gk: 68.0, ck: null, total: null, note: 'Đang ở giai đoạn giữa khóa, điểm giữa kỳ đạt 68/100.', status: TrangThaiHoanThanh.CHUA_XEP_LOAI },
    { user: 'student20', cc: 90.0, gk: 75.0, ck: null, total: null, note: 'Đang hoàn thành nửa chặng đường khóa học, chờ thi cuối kỳ.', status: TrangThaiHoanThanh.CHUA_XEP_LOAI },
    { user: 'student21', cc: 80.0, gk: 70.0, ck: null, total: null, note: 'Đang theo học chương trình, tiến độ tích lũy ổn định.', status: TrangThaiHoanThanh.CHUA_XEP_LOAI },
  ];

  for (const g of class1Grades) {
    const sProfile = studentProfiles[g.user];
    await prisma.ketQuaHocTap.create({
      data: {
        lopHocId: class1.id,
        hocVienId: sProfile.id,
        diemChuyenCan: g.cc,
        diemGiuaKy: g.gk,
        diemCuoiKy: g.ck,
        diemTongKet: g.total,
        nhanXet: g.note,
        trangThaiHoanThanh: g.status,
      },
    });
  }

  // Điểm số cho học viên lớp TOEIC-A2-01
  const class2Grades = [
    { user: 'student02', cc: 75.0, gk: 65.0, ck: 68.0, total: 68.5, note: 'Kỹ năng Nghe tiến bộ, cần bổ sung từ vựng Part 5.', status: TrangThaiHoanThanh.DAT },
    { user: 'student07', cc: 90.0, gk: 78.0, ck: 79.0, total: 80.9, note: 'Tác phong nghiêm túc, giải đề cẩn thận.', status: TrangThaiHoanThanh.DAT },
    { user: 'student24', cc: 92.0, gk: 85.0, ck: 88.0, total: 87.9, note: 'Xuất sắc, mục tiêu hoàn toàn đạt TOEIC 600+.', status: TrangThaiHoanThanh.DAT },
    { user: 'student25', cc: 85.0, gk: 70.0, ck: 72.0, total: 74.0, note: 'Nắm chắc ngữ pháp cơ bản.', status: TrangThaiHoanThanh.DAT },
    { user: 'student26', cc: 88.0, gk: 76.0, ck: 78.0, total: 79.4, note: 'Tiến độ làm bài thi nhanh và chính xác.', status: TrangThaiHoanThanh.DAT },
    // 1 học viên KHÔNG ĐẠT lớp TOEIC
    { user: 'student27', cc: 75.0, gk: 40.0, ck: 42.0, total: 48.0, note: 'Điểm tổng kết dưới 50đ, chưa nắm vững cấu trúc đề TOEIC.', status: TrangThaiHoanThanh.KHONG_DAT },
  ];

  for (const g of class2Grades) {
    const sProfile = studentProfiles[g.user];
    await prisma.ketQuaHocTap.create({
      data: {
        lopHocId: class2.id,
        hocVienId: sProfile.id,
        diemChuyenCan: g.cc,
        diemGiuaKy: g.gk,
        diemCuoiKy: g.ck,
        diemTongKet: g.total,
        nhanXet: g.note,
        trangThaiHoanThanh: g.status,
      },
    });
  }

  // Điểm số cho học viên lớp COMM-B1-01 (FULL 5/5 học viên)
  const class3Grades = [
    { user: 'student03', cc: 90.0, gk: 85.0, ck: 86.0, total: 86.5, note: 'Thuyết trình tự tin, phản xạ tốt.', status: TrangThaiHoanThanh.DAT },
    { user: 'student08', cc: 95.0, gk: 88.0, ck: 89.0, total: 89.9, note: 'Phát âm tự nhiên, đàm phán linh hoạt.', status: TrangThaiHoanThanh.DAT },
    { user: 'student28', cc: 88.0, gk: 80.0, ck: 82.0, total: 82.6, note: 'Tham gia tương tác tích cực.', status: TrangThaiHoanThanh.DAT },
    { user: 'student29', cc: 92.0, gk: 86.0, ck: 88.0, total: 88.2, note: 'Kỹ năng trình bày báo cáo lưu loát.', status: TrangThaiHoanThanh.DAT },
    { user: 'student30', cc: 90.0, gk: 84.0, ck: 85.0, total: 85.7, note: 'Phản xạ đàm phán linh hoạt, giao tiếp tự tin.', status: TrangThaiHoanThanh.DAT },
  ];

  for (const g of class3Grades) {
    const sProfile = studentProfiles[g.user];
    await prisma.ketQuaHocTap.create({
      data: {
        lopHocId: class3.id,
        hocVienId: sProfile.id,
        diemChuyenCan: g.cc,
        diemGiuaKy: g.gk,
        diemCuoiKy: g.ck,
        diemTongKet: g.total,
        nhanXet: g.note,
        trangThaiHoanThanh: g.status,
      },
    });
  }

  // Điểm số cho học viên lớp IELTS-B2-01
  const class5Grades = [
    { user: 'student06', cc: 95.0, gk: 90.0, ck: 92.0, total: 92.0, note: 'Trình độ IELTS tương đương 7.5 - 8.0, bài viết Task 2 chặt chẽ.', status: TrangThaiHoanThanh.DAT },
    { user: 'student09', cc: 85.0, gk: 82.0, ck: 86.0, total: 84.6, note: 'Nắm vững chiến thuật làm bài, phản xạ Speaking lưu loát.', status: TrangThaiHoanThanh.DAT },
    { user: 'student10', cc: 90.0, gk: 88.0, ck: 90.0, total: 89.4, note: 'Tác phong học thuật chuyên sâu, từ vựng phong phú.', status: TrangThaiHoanThanh.DAT },
  ];

  for (const g of class5Grades) {
    const sProfile = studentProfiles[g.user];
    await prisma.ketQuaHocTap.create({
      data: {
        lopHocId: class5.id,
        hocVienId: sProfile.id,
        diemChuyenCan: g.cc,
        diemGiuaKy: g.gk,
        diemCuoiKy: g.ck,
        diemTongKet: g.total,
        nhanXet: g.note,
        trangThaiHoanThanh: g.status,
      },
    });
  }

  console.log('✅ Đã nạp Bảng điểm chuẩn quy chế: 18 ĐẠT, 4 KHÔNG ĐẠT, 3 ĐANG HỌC');

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
        nguoiDungId: teacherProfiles['teacher01'].nguoiDungId!,
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
    ],
  });
  console.log('✅ Đã nạp Audit Log AI');

  console.log('\n🎉 NẠP TOÀN BỘ SIÊU DỮ LIỆU ĐẦY ĐỦ MỌI KỊCH BẢN THÀNH CÔNG!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📋 TÀI KHOẢN HỆ THỐNG ĐÃ SẴN SÀNG (Mật khẩu mặc định: 123456):');
  console.log('   👑 Quản lý (Admin)     : admin01');
  console.log('   👨‍🏫 Giáo viên (Teacher) : teacher01 → teacher10 (10 Giảng viên)');
  console.log('   📞 Tư vấn viên (Staff) : staff01, staff02');
  console.log('   🎓 Học viên (Student)   : student01 → student30 (30 Học viên)');
  console.log('   🔥 Lớp FULL SĨ SỐ (100%): IELTS-B1-01 (15/15 HV), COMM-B1-01 (5/5 HV)');
  console.log('   📊 Thống kê hoàn thành : 18 ĐẠT (81.8%), 4 KHÔNG ĐẠT (18.2%), 3 ĐANG HỌC');
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
