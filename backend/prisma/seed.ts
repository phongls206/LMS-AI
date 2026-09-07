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
  console.log('🌱 Bắt đầu nạp SIÊU DỮ LIỆU MẪU TOÀN DIỆN (10 Giảng viên, 54 Học viên, Lớp ĐẠT SĨ SỐ TỐI ĐA 25/25, Đủ ca ĐẠT/KHÔNG ĐẠT/ĐANG HỌC) cho ETC English Center...\n');

  // Mật khẩu mặc định cho toàn bộ tài khoản: 123456
  const defaultPassword = await argon2.hash('123456');

  // ============================================================================
  // 1. NGƯỜI DÙNG & HỒ SƠ (Quản lý, Giáo viên, Tư vấn viên, Học viên)
  // ============================================================================

  // 1.1 Quản lý (Admin)
  const adminUser = await prisma.nguoiDung.upsert({
    where: { tenDangNhap: 'admin01' },
    update: {
      matKhauMaHoa: defaultPassword,
      hoTen: 'Lê Hồng Phong',
      email: 'lehongphong2108@outlook.com',
      soDienThoai: '0787304341',
    },
    create: {
      tenDangNhap: 'admin01',
      matKhauMaHoa: defaultPassword,
      vaiTro: VaiTro.QUAN_LY,
      hoTen: 'Lê Hồng Phong',
      email: 'lehongphong2108@outlook.com',
      soDienThoai: '0787304341',
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
    { user: 'teacher11', ma: 'GV011', ten: 'Cô Phan Thu Thảo', chuyenMon: 'Luyện Phát Âm Chuẩn Mỹ & Phản Xạ Giao Tiếp', bangCap: 'Chứng chỉ TESOL International, Cử nhân ĐH Sư Phạm TP.HCM', email: 'phan.thu.thao@etc-english.vn', phone: '0902222011' },
    { user: 'teacher12', ma: 'GV012', ten: 'Thầy Robert Taylor', chuyenMon: 'IELTS Academic Writing & Critical Thinking', bangCap: 'Master in Applied Linguistics - Cambridge University', email: 'robert.taylor@etc-english.vn', phone: '0902222012' },
    { user: 'teacher13', ma: 'GV013', ten: 'Thầy Bùi Quang Huy', chuyenMon: 'TOEIC Đột Phá 4 Kỹ Năng & Ngữ Pháp Thực Chiến', bangCap: 'TOEIC 990/990 Tuyệt đối, Cử nhân ĐH Ngoại Thương', email: 'bui.quang.huy@etc-english.vn', phone: '0902222013' },
    { user: 'teacher14', ma: 'GV014', ten: 'Cô Lê Kim Chi', chuyenMon: 'Tiếng Anh Tổng Quát & Luyện Đề Thi Quốc Tế', bangCap: 'IELTS 8.0, Cử nhân Sư phạm Tiếng Anh ĐH Hà Nội', email: 'le.kim.chi@etc-english.vn', phone: '0902222014' },
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
  console.log('✅ Đã nạp 14 Giảng viên: GV001 → GV014');

  // 1.3 Tư vấn viên (2 Nhân viên Tuyển sinh / Thu ngân)
  const staffData = [
    { user: 'staff01', ten: 'Nguyễn Thị Thu Thảo', email: 'nguyen.thao@etc-english.vn', phone: '0903333001' },
    { user: 'staff02', ten: 'Hoàng Kim Ngân', email: 'hoang.ngan@etc-english.vn', phone: '0903333002' },
  ];

  const staffUsers: Record<string, any> = {};
  for (const s of staffData) {
    const su = await prisma.nguoiDung.upsert({
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
    staffUsers[s.user] = su;
  }
  console.log('✅ Đã nạp 2 Tư vấn viên: staff01, staff02');

  // 1.4 Học viên (54 Học viên chuẩn CEFR A1 → C1)
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
    { user: 'student24', ma: 'HV024', ten: 'Lâm Bích Loan', cefr: TrinhDoCEFR.B1, dob: '2004-04-08', gender: 'Nữ', phone: '0904444024', email: 'loan.lam@gmail.com', source: 'TOEIC Starter Test 420', schedule: { thu: [2, 4, 6], gio: '17:30-20:30' } },
    { user: 'student25', ma: 'HV025', ten: 'Võ Minh Nhật', cefr: TrinhDoCEFR.B1, dob: '2005-02-17', gender: 'Nam', phone: '0904444025', email: 'nhat.vo@gmail.com', source: 'Kiểm tra đầu vào B1', schedule: { thu: [2, 4, 6], gio: '17:30-20:30' } },
    { user: 'student26', ma: 'HV026', ten: 'Đoàn Kim Oanh', cefr: TrinhDoCEFR.A2, dob: '2004-12-29', gender: 'Nữ', phone: '0904444026', email: 'oanh.doan@gmail.com', source: 'Test đầu vào A2', schedule: { thu: [3, 5, 7], gio: '19:00-21:00' } },
    { user: 'student27', ma: 'HV027', ten: 'Tạ Hoàng Phúc', cefr: TrinhDoCEFR.A2, dob: '2003-08-14', gender: 'Nam', phone: '0904444027', email: 'phuc.ta@gmail.com', source: 'Test đầu vào A2', schedule: { thu: [3, 5, 7], gio: '19:00-21:00' } },
    { user: 'student28', ma: 'HV028', ten: 'Quách Thái Sơn', cefr: TrinhDoCEFR.A2, dob: '2000-09-03', gender: 'Nam', phone: '0904444028', email: 'son.quach@gmail.com', source: 'Test đầu vào A2', schedule: { thu: [3, 5, 7], gio: '19:00-21:00' } },
    { user: 'student29', ma: 'HV029', ten: 'Nghiêm Thu Trang', cefr: TrinhDoCEFR.A2, dob: '2001-03-27', gender: 'Nữ', phone: '0904444029', email: 'trang.nghiem@gmail.com', source: 'Test đầu vào A2', schedule: { thu: [3, 5, 7], gio: '19:00-21:00' } },
    { user: 'student30', ma: 'HV030', ten: 'Lưu Quang Vinh', cefr: TrinhDoCEFR.A2, dob: '1999-11-19', gender: 'Nam', phone: '0904444030', email: 'vinh.luu@gmail.com', source: 'Test đầu vào A2', schedule: { thu: [3, 5, 7], gio: '19:00-21:00' } },
    { user: 'student31', ma: 'HV031', ten: 'Nguyễn Gia Bảo', cefr: TrinhDoCEFR.A2, dob: '2003-06-15', gender: 'Nam', phone: '0904444031', email: 'giabao.nguyen@gmail.com', source: 'Test đầu vào A2', schedule: { thu: [3, 5, 7], gio: '19:00-21:00' } },
    { user: 'student32', ma: 'HV032', ten: 'Trần Cẩm Tú', cefr: TrinhDoCEFR.A2, dob: '2002-09-22', gender: 'Nữ', phone: '0904444032', email: 'camtu.tran@gmail.com', source: 'Test đầu vào A2', schedule: { thu: [3, 5, 7], gio: '19:00-21:00' } },
    { user: 'student33', ma: 'HV033', ten: 'Lê Khánh An', cefr: TrinhDoCEFR.A2, dob: '2004-03-11', gender: 'Nữ', phone: '0904444033', email: 'khanhan.le@gmail.com', source: 'Test đầu vào A2', schedule: { thu: [3, 5, 7], gio: '19:00-21:00' } },
    { user: 'student34', ma: 'HV034', ten: 'Phạm Minh Đức', cefr: TrinhDoCEFR.A2, dob: '2001-07-04', gender: 'Nam', phone: '0904444034', email: 'minhduc.pham@gmail.com', source: 'Test đầu vào A2', schedule: { thu: [3, 5, 7], gio: '19:00-21:00' } },
    { user: 'student35', ma: 'HV035', ten: 'Hoàng Diệu Linh', cefr: TrinhDoCEFR.A2, dob: '2002-11-18', gender: 'Nữ', phone: '0904444035', email: 'dieulinh.hoang@gmail.com', source: 'Test đầu vào A2', schedule: { thu: [3, 5, 7], gio: '19:00-21:00' } },
    { user: 'student36', ma: 'HV036', ten: 'Vũ Tuấn Anh', cefr: TrinhDoCEFR.A2, dob: '2000-01-30', gender: 'Nam', phone: '0904444036', email: 'tuananh.vu@gmail.com', source: 'Test đầu vào A2', schedule: { thu: [3, 5, 7], gio: '19:00-21:00' } },
    { user: 'student37', ma: 'HV037', ten: 'Đỗ Ngọc Diệp', cefr: TrinhDoCEFR.A2, dob: '2003-10-14', gender: 'Nữ', phone: '0904444037', email: 'ngocdiep.do@gmail.com', source: 'Test đầu vào A2', schedule: { thu: [3, 5, 7], gio: '19:00-21:00' } },
    { user: 'student38', ma: 'HV038', ten: 'Bùi Hải Nam', cefr: TrinhDoCEFR.B1, dob: '2001-08-12', gender: 'Nam', phone: '0904444038', email: 'hainam.bui@gmail.com', source: 'Phỏng vấn Speaking B1', schedule: { thu: [2, 4, 6], gio: '19:00-21:00' } },
    { user: 'student39', ma: 'HV039', ten: 'Ngô Thảo Vy', cefr: TrinhDoCEFR.B1, dob: '2002-04-25', gender: 'Nữ', phone: '0904444039', email: 'thaovy.ngo@gmail.com', source: 'Phỏng vấn Speaking B1', schedule: { thu: [2, 4, 6], gio: '19:00-21:00' } },
    { user: 'student40', ma: 'HV040', ten: 'Dương Văn Thành', cefr: TrinhDoCEFR.B1, dob: '2000-12-01', gender: 'Nam', phone: '0904444040', email: 'vanthanh.duong@gmail.com', source: 'Phỏng vấn Speaking B1', schedule: { thu: [2, 4, 6], gio: '19:00-21:00' } },
    { user: 'student41', ma: 'HV041', ten: 'Lý Gia Huy', cefr: TrinhDoCEFR.B1, dob: '2003-05-19', gender: 'Nam', phone: '0904444041', email: 'giahuy.ly@gmail.com', source: 'Phỏng vấn Speaking B1', schedule: { thu: [2, 4, 6], gio: '19:00-21:00' } },
    { user: 'student42', ma: 'HV042', ten: 'Mai Phương Thảo', cefr: TrinhDoCEFR.B1, dob: '2002-02-14', gender: 'Nữ', phone: '0904444042', email: 'phuongthao.mai@gmail.com', source: 'Phỏng vấn Speaking B1', schedule: { thu: [2, 4, 6], gio: '19:00-21:00' } },
    { user: 'student43', ma: 'HV043', ten: 'Trịnh Minh Khang', cefr: TrinhDoCEFR.B1, dob: '2001-09-09', gender: 'Nam', phone: '0904444043', email: 'minhkhang.trinh@gmail.com', source: 'Phỏng vấn Speaking B1', schedule: { thu: [2, 4, 6], gio: '19:00-21:00' } },
    { user: 'student44', ma: 'HV044', ten: 'Phan Yến Nhi', cefr: TrinhDoCEFR.B1, dob: '2004-06-30', gender: 'Nữ', phone: '0904444044', email: 'yennhi.phan@gmail.com', source: 'Phỏng vấn Speaking B1', schedule: { thu: [2, 4, 6], gio: '19:00-21:00' } },
    { user: 'student45', ma: 'HV045', ten: 'Lâm Tấn Phát', cefr: TrinhDoCEFR.B1, dob: '1999-10-05', gender: 'Nam', phone: '0904444045', email: 'tanphat.lam@gmail.com', source: 'Phỏng vấn Speaking B1', schedule: { thu: [2, 4, 6], gio: '19:00-21:00' } },
    { user: 'student46', ma: 'HV046', ten: 'Võ Thu Hằng', cefr: TrinhDoCEFR.A1, dob: '2004-01-20', gender: 'Nữ', phone: '0904444046', email: 'thuhang.vo@gmail.com', source: 'Mất gốc tiếng Anh', schedule: { thu: [3, 5], gio: '17:30-19:30' } },
    { user: 'student47', ma: 'HV047', ten: 'Đoàn Hữu Phước', cefr: TrinhDoCEFR.A1, dob: '2003-07-16', gender: 'Nam', phone: '0904444047', email: 'huuphuoc.doan@gmail.com', source: 'Mất gốc tiếng Anh', schedule: { thu: [3, 5], gio: '17:30-19:30' } },
    { user: 'student48', ma: 'HV048', ten: 'Tạ Thanh Tùng', cefr: TrinhDoCEFR.A1, dob: '2002-11-28', gender: 'Nam', phone: '0904444048', email: 'thanhtung.ta@gmail.com', source: 'Mất gốc tiếng Anh', schedule: { thu: [3, 5], gio: '17:30-19:30' } },
    { user: 'student49', ma: 'HV049', ten: 'Quách Ánh Tuyết', cefr: TrinhDoCEFR.A1, dob: '2005-03-08', gender: 'Nữ', phone: '0904444049', email: 'anhtuyet.quach@gmail.com', source: 'Mất gốc tiếng Anh', schedule: { thu: [3, 5], gio: '17:30-19:30' } },
    { user: 'student50', ma: 'HV050', ten: 'Nghiêm Bảo Trâm', cefr: TrinhDoCEFR.A1, dob: '2004-08-19', gender: 'Nữ', phone: '0904444050', email: 'baotram.nghiem@gmail.com', source: 'Mất gốc tiếng Anh', schedule: { thu: [3, 5], gio: '17:30-19:30' } },
    { user: 'student51', ma: 'HV051', ten: 'Lưu Thế Hùng', cefr: TrinhDoCEFR.B2, dob: '1999-04-12', gender: 'Nam', phone: '0904444051', email: 'thehung.luu@gmail.com', source: 'IELTS 6.5 mock test', schedule: { thu: [2, 4, 6], gio: '18:00-21:00' } },
    { user: 'student52', ma: 'HV052', ten: 'Nguyễn Thùy Trang', cefr: TrinhDoCEFR.B2, dob: '2000-08-27', gender: 'Nữ', phone: '0904444052', email: 'thuytrang.nguyen@gmail.com', source: 'IELTS 6.5 BC Certificate', schedule: { thu: [2, 4, 6], gio: '18:00-21:00' } },
    { user: 'student53', ma: 'HV053', ten: 'Trần Anh Khoa', cefr: TrinhDoCEFR.B2, dob: '2001-12-14', gender: 'Nam', phone: '0904444053', email: 'anhkhoa.tran@gmail.com', source: 'IELTS 6.0 IDP Certificate', schedule: { thu: [2, 4, 6], gio: '18:00-21:00' } },
    { user: 'student54', ma: 'HV054', ten: 'Lê Diễm Quỳnh', cefr: TrinhDoCEFR.B2, dob: '2002-06-03', gender: 'Nữ', phone: '0904444054', email: 'diemquynh.le@gmail.com', source: 'IELTS 6.5 mock test', schedule: { thu: [2, 4, 6], gio: '18:00-21:00' } },
    { user: 'student55', ma: 'HV055', ten: 'Trần Gia Hưng', cefr: TrinhDoCEFR.B1, dob: '2002-03-15', gender: 'Nam', phone: '0904444055', email: 'giahung.tran@gmail.com', source: 'Test đầu vào B1', schedule: { thu: [2, 4, 6], gio: '18:30-20:30' } },
    { user: 'student56', ma: 'HV056', ten: 'Lê Thảo My', cefr: TrinhDoCEFR.B1, dob: '2003-07-22', gender: 'Nữ', phone: '0904444056', email: 'thaomy.le@gmail.com', source: 'Đánh giá năng lực B1', schedule: { thu: [2, 4, 6], gio: '18:30-20:30' } },
    { user: 'student57', ma: 'HV057', ten: 'Nguyễn Đình Phúc', cefr: TrinhDoCEFR.B1, dob: '2001-11-09', gender: 'Nam', phone: '0904444057', email: 'dinhphuc.nguyen@gmail.com', source: 'TOEIC Starter 480', schedule: { thu: [2, 4, 6], gio: '18:30-20:30' } },
    { user: 'student58', ma: 'HV058', ten: 'Phạm Kiều Trang', cefr: TrinhDoCEFR.B1, dob: '2004-05-18', gender: 'Nữ', phone: '0904444058', email: 'kieutrang.pham@gmail.com', source: 'Test đầu vào B1', schedule: { thu: [2, 4, 6], gio: '18:30-20:30' } },
    { user: 'student59', ma: 'HV059', ten: 'Hoàng Nhật Minh', cefr: TrinhDoCEFR.B1, dob: '2000-09-30', gender: 'Nam', phone: '0904444059', email: 'nhatminh.hoang@gmail.com', source: 'IELTS 5.0 mock test', schedule: { thu: [2, 4, 6], gio: '18:30-20:30' } },
    { user: 'student60', ma: 'HV060', ten: 'Vũ Ngọc Lan', cefr: TrinhDoCEFR.B1, dob: '2002-12-14', gender: 'Nữ', phone: '0904444060', email: 'ngoclan.vu@gmail.com', source: 'Test năng lực B1', schedule: { thu: [2, 4, 6], gio: '18:30-20:30' } },
    { user: 'student61', ma: 'HV061', ten: 'Đặng Quốc Huy', cefr: TrinhDoCEFR.B1, dob: '2003-04-25', gender: 'Nam', phone: '0904444061', email: 'quochuy.dang@gmail.com', source: 'Test đầu vào B1', schedule: { thu: [2, 4, 6], gio: '18:30-20:30' } },
    { user: 'student62', ma: 'HV062', ten: 'Bùi Kim Ngân', cefr: TrinhDoCEFR.B1, dob: '2001-08-03', gender: 'Nữ', phone: '0904444062', email: 'kimngan.bui@gmail.com', source: 'Phỏng vấn B1', schedule: { thu: [2, 4, 6], gio: '18:30-20:30' } },
    { user: 'student63', ma: 'HV063', ten: 'Lý Quốc Đạt', cefr: TrinhDoCEFR.B1, dob: '2004-01-19', gender: 'Nam', phone: '0904444063', email: 'quocdat.ly@gmail.com', source: 'Test đầu vào B1', schedule: { thu: [2, 4, 6], gio: '18:30-20:30' } },
    { user: 'student64', ma: 'HV064', ten: 'Mai Cẩm Vân', cefr: TrinhDoCEFR.B1, dob: '2002-10-08', gender: 'Nữ', phone: '0904444064', email: 'camvan.mai@gmail.com', source: 'Test đầu vào B1', schedule: { thu: [2, 4, 6], gio: '18:30-20:30' } },
    { user: 'student65', ma: 'HV065', ten: 'Nguyễn Thành Nam', cefr: TrinhDoCEFR.A2, dob: '2003-02-28', gender: 'Nam', phone: '0904444065', email: 'thanhnam.nguyen@gmail.com', source: 'Placement Test A2', schedule: { thu: [3, 5, 7], gio: '18:00-20:00' } },
    { user: 'student66', ma: 'HV066', ten: 'Trần Bích Hạnh', cefr: TrinhDoCEFR.A2, dob: '2004-06-12', gender: 'Nữ', phone: '0904444066', email: 'bichhanh.tran@gmail.com', source: 'Placement Test A2', schedule: { thu: [3, 5, 7], gio: '18:00-20:00' } },
    { user: 'student67', ma: 'HV067', ten: 'Lê Đức Trọng', cefr: TrinhDoCEFR.A2, dob: '2001-10-21', gender: 'Nam', phone: '0904444067', email: 'ductrong.le@gmail.com', source: 'Placement Test A2', schedule: { thu: [3, 5, 7], gio: '18:00-20:00' } },
    { user: 'student68', ma: 'HV068', ten: 'Phạm Quỳnh Anh', cefr: TrinhDoCEFR.A2, dob: '2005-01-05', gender: 'Nữ', phone: '0904444068', email: 'quynhanh.pham@gmail.com', source: 'Placement Test A2', schedule: { thu: [3, 5, 7], gio: '18:00-20:00' } },
    { user: 'student69', ma: 'HV069', ten: 'Hoàng Văn Quý', cefr: TrinhDoCEFR.A2, dob: '2000-08-16', gender: 'Nam', phone: '0904444069', email: 'vanquy.hoang@gmail.com', source: 'Placement Test A2', schedule: { thu: [3, 5, 7], gio: '18:00-20:00' } },
    { user: 'student70', ma: 'HV070', ten: 'Đỗ Thùy Linh', cefr: TrinhDoCEFR.A2, dob: '2002-11-23', gender: 'Nữ', phone: '0904444070', email: 'thuylinh.do@gmail.com', source: 'Placement Test A2', schedule: { thu: [3, 5, 7], gio: '18:00-20:00' } },
    { user: 'student71', ma: 'HV071', ten: 'Vũ Hữu Đạt', cefr: TrinhDoCEFR.A2, dob: '2003-09-07', gender: 'Nam', phone: '0904444071', email: 'huudat.vu@gmail.com', source: 'Placement Test A2', schedule: { thu: [3, 5, 7], gio: '18:00-20:00' } },
    { user: 'student72', ma: 'HV072', ten: 'Ngô Mỹ Duyên', cefr: TrinhDoCEFR.A2, dob: '2004-03-14', gender: 'Nữ', phone: '0904444072', email: 'myduyen.ngo@gmail.com', source: 'Placement Test A2', schedule: { thu: [3, 5, 7], gio: '18:00-20:00' } },
    { user: 'student73', ma: 'HV073', ten: 'Trịnh Tuấn Khôi', cefr: TrinhDoCEFR.C1, dob: '1998-05-20', gender: 'Nam', phone: '0904444073', email: 'tuankhoi.trinh@gmail.com', source: 'IELTS 7.5 IDP', schedule: { thu: [3, 5], gio: '18:30-21:00' } },
    { user: 'student74', ma: 'HV074', ten: 'Phan Diệu Huyền', cefr: TrinhDoCEFR.C1, dob: '1999-12-11', gender: 'Nữ', phone: '0904444074', email: 'dieuhuyen.phan@gmail.com', source: 'IELTS 7.5 BC', schedule: { thu: [3, 5], gio: '18:30-21:00' } },
    { user: 'student75', ma: 'HV075', ten: 'Lâm Hoàng Phong', cefr: TrinhDoCEFR.C1, dob: '2000-07-04', gender: 'Nam', phone: '0904444075', email: 'hoangphong.lam@gmail.com', source: 'IELTS 7.5 IDP', schedule: { thu: [3, 5], gio: '18:30-21:00' } },
    { user: 'student76', ma: 'HV076', ten: 'Đoàn Bảo Châu', cefr: TrinhDoCEFR.C1, dob: '2001-02-18', gender: 'Nữ', phone: '0904444076', email: 'baochau.doan@gmail.com', source: 'IELTS 7.5 BC', schedule: { thu: [3, 5], gio: '18:30-21:00' } },
    { user: 'student77', ma: 'HV077', ten: 'Dương Hải Đăng', cefr: TrinhDoCEFR.C1, dob: '1997-10-29', gender: 'Nam', phone: '0904444077', email: 'haidang.duong@gmail.com', source: 'Cử nhân Ngôn ngữ Anh', schedule: { thu: [2, 4], gio: '18:00-21:00' } },
    { user: 'student78', ma: 'HV078', ten: 'Lý Kim Yến', cefr: TrinhDoCEFR.C1, dob: '2000-04-09', gender: 'Nữ', phone: '0904444078', email: 'kimyen.ly@gmail.com', source: 'IELTS 7.5 IDP', schedule: { thu: [3, 5], gio: '18:30-21:00' } },
    { user: 'student79', ma: 'HV079', ten: 'Vũ Quốc Thái', cefr: TrinhDoCEFR.A1, dob: '2005-08-15', gender: 'Nam', phone: '0904444079', email: 'quocthai.vu@gmail.com', source: 'Mất gốc tiếng Anh', schedule: { thu: [7, 8], gio: '14:00-17:00' } },
    { user: 'student80', ma: 'HV080', ten: 'Nguyễn Hồng Nhung', cefr: TrinhDoCEFR.A1, dob: '2004-12-02', gender: 'Nữ', phone: '0904444080', email: 'hongnhung.nguyen@gmail.com', source: 'Mất gốc tiếng Anh', schedule: { thu: [7, 8], gio: '14:00-17:00' } },
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
  console.log('✅ Đã nạp 80 Học viên: HV001 → HV080');

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

  const course7 = await prisma.khoaHoc.upsert({
    where: { maKhoaHoc: 'KH-TOEIC-B1' },
    update: {},
    create: {
      maKhoaHoc: 'KH-TOEIC-B1',
      tenKhoaHoc: 'TOEIC Đột Phá 650 - 800+ (B1 → B2)',
      trinhDoYeuCau: TrinhDoCEFR.B1,
      thoiLuongGio: 54,
      hocPhi: 3600000,
      moTa: 'Chiến thuật giải đề TOEIC 4 kỹ năng nâng cao, bẫy từ vựng thương mại và đàm phán hợp đồng.',
      trangThai: TrangThaiKhoaHoc.HOAT_DONG,
    },
  });

  const course8 = await prisma.khoaHoc.upsert({
    where: { maKhoaHoc: 'KH-COMM-A2' },
    update: {},
    create: {
      maKhoaHoc: 'KH-COMM-A2',
      tenKhoaHoc: 'Tiếng Anh Giao Tiếp Hàng Ngày & Phản Xạ Đời Sống (A2)',
      trinhDoYeuCau: TrinhDoCEFR.A2,
      thoiLuongGio: 40,
      hocPhi: 2600000,
      moTa: 'Tập trung giao tiếp đời sống, phản xạ đàm thoại du lịch, mua sắm và xử lý tình huống thực tế.',
      trangThai: TrangThaiKhoaHoc.HOAT_DONG,
    },
  });

  const course9 = await prisma.khoaHoc.upsert({
    where: { maKhoaHoc: 'KH-IELTS-C1' },
    update: {},
    create: {
      maKhoaHoc: 'KH-IELTS-C1',
      tenKhoaHoc: 'IELTS Expert 7.5 - 8.5+ (C1 → C2)',
      trinhDoYeuCau: TrinhDoCEFR.C1,
      thoiLuongGio: 75,
      hocPhi: 6200000,
      moTa: 'Chinh phục Band điểm tinh hoa, phân tích chuyên sâu các chủ đề học thuật trừu tượng và tư duy biện luận phản biện cùng GV bản xứ.',
      trangThai: TrangThaiKhoaHoc.HOAT_DONG,
    },
  });

  const course10 = await prisma.khoaHoc.upsert({
    where: { maKhoaHoc: 'KH-GRAM-A1' },
    update: {},
    create: {
      maKhoaHoc: 'KH-GRAM-A1',
      tenKhoaHoc: 'Ngữ Pháp Nền Tảng & Luyện Âm Chuẩn Quốc Tế (A1 → A2)',
      trinhDoYeuCau: TrinhDoCEFR.A1,
      thoiLuongGio: 36,
      hocPhi: 1950000,
      moTa: 'Hệ thống hóa toàn diện 12 thì tiếng Anh, từ loại, cấu trúc câu và kỹ thuật phát âm chuẩn IPA.',
      trangThai: TrangThaiKhoaHoc.HOAT_DONG,
    },
  });
  const course11 = await prisma.khoaHoc.upsert({
    where: { maKhoaHoc: 'KH-MAST-C2' },
    update: {},
    create: {
      maKhoaHoc: 'KH-MAST-C2',
      tenKhoaHoc: 'Tiếng Anh Học Thuật Tinh Hoa & Diễn Thuyết Chuyên Sâu (C2 Mastery)',
      trinhDoYeuCau: TrinhDoCEFR.C2,
      thoiLuongGio: 60,
      hocPhi: 6800000,
      moTa: 'Dành cho học viên trình độ cao cấp muốn hoàn thiện năng lực tiếng Anh tương đương người bản ngữ, làm chủ nghệ thuật tranh biện học thuật và xuất bản bài nghiên cứu.',
      trangThai: TrangThaiKhoaHoc.HOAT_DONG,
    },
  });
  console.log('✅ Đã nạp 11 Khóa học toàn diện (Chuẩn 6 bậc CEFR từ A1 đến C2)');

  // ============================================================================
  // 3. LỚP HỌC & THỜI KHÓA BIỂU
  // ============================================================================
  // Lớp 1: IELTS-B1-01 (LỚP ĐẠT SĨ SỐ TỐI ĐA 25/25 HỌC VIÊN - FULL 100%)
  const class1 = await prisma.lopHoc.upsert({
    where: { maLopHoc: 'IELTS-B1-01' },
    update: { siSoToiDa: 25, siSoHienTai: 25, trangThai: TrangThaiLopHoc.DANG_HOC },
    create: {
      khoaHocId: course3.id,
      maLopHoc: 'IELTS-B1-01',
      tenLopHoc: 'IELTS B1 Buổi tối (Thứ 2-4-6)',
      siSoToiDa: 25,
      siSoHienTai: 25,
      ngayBatDau: new Date('2024-09-16'),
      ngayKetThuc: new Date('2024-12-16'),
      phongHoc: 'Phòng Hội Trường A101',
      trangThai: TrangThaiLopHoc.DANG_HOC,
    },
  });

  // Lớp 2: TOEIC-A2-01 (12/25 HV - 48%)
  const class2 = await prisma.lopHoc.upsert({
    where: { maLopHoc: 'TOEIC-A2-01' },
    update: { siSoToiDa: 25, siSoHienTai: 12, trangThai: TrangThaiLopHoc.DANG_HOC },
    create: {
      khoaHocId: course2.id,
      maLopHoc: 'TOEIC-A2-01',
      tenLopHoc: 'TOEIC Starter Thứ 3-5-7',
      siSoToiDa: 25,
      siSoHienTai: 12,
      ngayBatDau: new Date('2024-09-17'),
      ngayKetThuc: new Date('2024-12-10'),
      phongHoc: 'Phòng B202',
      trangThai: TrangThaiLopHoc.DANG_HOC,
    },
  });

  // Lớp 3: COMM-B1-01 (8/15 HV - 53%)
  const class3 = await prisma.lopHoc.upsert({
    where: { maLopHoc: 'COMM-B1-01' },
    update: { siSoToiDa: 15, siSoHienTai: 8, trangThai: TrangThaiLopHoc.DANG_HOC },
    create: {
      khoaHocId: course5.id,
      maLopHoc: 'COMM-B1-01',
      tenLopHoc: 'Giao Tiếp Doanh Nghiệp Tối T2-4-6',
      siSoToiDa: 15,
      siSoHienTai: 8,
      ngayBatDau: new Date('2024-08-01'),
      ngayKetThuc: new Date('2024-11-01'),
      phongHoc: 'Phòng C301',
      trangThai: TrangThaiLopHoc.DANG_HOC,
    },
  });

  // Lớp 4: ENG-A1-01 (5/20 HV - 25%)
  const class4 = await prisma.lopHoc.upsert({
    where: { maLopHoc: 'ENG-A1-01' },
    update: { siSoToiDa: 20, siSoHienTai: 5, trangThai: TrangThaiLopHoc.DANG_MO_DANG_KY },
    create: {
      khoaHocId: course1.id,
      maLopHoc: 'ENG-A1-01',
      tenLopHoc: 'Tiếng Anh Căn Bản Cho Người Mới Bắt Đầu',
      siSoToiDa: 20,
      siSoHienTai: 5,
      ngayBatDau: new Date('2024-09-20'),
      ngayKetThuc: new Date('2024-12-20'),
      phongHoc: 'Phòng B201',
      trangThai: TrangThaiLopHoc.DANG_MO_DANG_KY,
    },
  });

  // Lớp 5: IELTS-B2-01 (4/15 HV - 27%)
  const class5 = await prisma.lopHoc.upsert({
    where: { maLopHoc: 'IELTS-B2-01' },
    update: { siSoToiDa: 15, siSoHienTai: 4, trangThai: TrangThaiLopHoc.DANG_HOC },
    create: {
      khoaHocId: course4.id,
      maLopHoc: 'IELTS-B2-01',
      tenLopHoc: 'IELTS Master 6.5+ Chuyên Sâu Tối T2-4-6',
      siSoToiDa: 15,
      siSoHienTai: 4,
      ngayBatDau: new Date('2024-08-15'),
      ngayKetThuc: new Date('2024-11-30'),
      phongHoc: 'Phòng A103',
      trangThai: TrangThaiLopHoc.DANG_HOC,
    },
  });

  // Lớp 6: IELTS-B1-02 (3/25 HV - 12%)
  const class6 = await prisma.lopHoc.upsert({
    where: { maLopHoc: 'IELTS-B1-02' },
    update: { siSoToiDa: 25, siSoHienTai: 3, trangThai: TrangThaiLopHoc.DANG_MO_DANG_KY },
    create: {
      khoaHocId: course3.id,
      maLopHoc: 'IELTS-B1-02',
      tenLopHoc: 'IELTS B1 Cuối Tuần (Thứ 7 - CN)',
      siSoToiDa: 25,
      siSoHienTai: 3,
      ngayBatDau: new Date('2024-10-05'),
      ngayKetThuc: new Date('2025-01-05'),
      phongHoc: 'Phòng A102',
      trangThai: TrangThaiLopHoc.DANG_MO_DANG_KY,
    },
  });

  // Lớp 7: TOEIC-B1-01 (10/25 HV - 40%)
  const class7 = await prisma.lopHoc.upsert({
    where: { maLopHoc: 'TOEIC-B1-01' },
    update: { siSoToiDa: 25, siSoHienTai: 10, trangThai: TrangThaiLopHoc.DANG_HOC },
    create: {
      khoaHocId: course7.id,
      maLopHoc: 'TOEIC-B1-01',
      tenLopHoc: 'TOEIC Đột Phá 650+ Tối T2-4-6',
      siSoToiDa: 25,
      siSoHienTai: 10,
      ngayBatDau: new Date('2024-09-16'),
      ngayKetThuc: new Date('2024-12-16'),
      phongHoc: 'Phòng B203',
      trangThai: TrangThaiLopHoc.DANG_HOC,
    },
  });

  // Lớp 8: COMM-A2-01 (8/18 HV - 44%)
  const class8 = await prisma.lopHoc.upsert({
    where: { maLopHoc: 'COMM-A2-01' },
    update: { siSoToiDa: 18, siSoHienTai: 8, trangThai: TrangThaiLopHoc.DANG_HOC },
    create: {
      khoaHocId: course8.id,
      maLopHoc: 'COMM-A2-01',
      tenLopHoc: 'Giao Tiếp Phản Xạ Đời Sống Tối T3-5-7',
      siSoToiDa: 18,
      siSoHienTai: 8,
      ngayBatDau: new Date('2024-09-17'),
      ngayKetThuc: new Date('2024-12-17'),
      phongHoc: 'Phòng C302',
      trangThai: TrangThaiLopHoc.DANG_HOC,
    },
  });

  // Lớp 9: IELTS-C1-01 (6/12 HV - 50%)
  const class9 = await prisma.lopHoc.upsert({
    where: { maLopHoc: 'IELTS-C1-01' },
    update: { siSoToiDa: 12, siSoHienTai: 6, trangThai: TrangThaiLopHoc.DANG_HOC },
    create: {
      khoaHocId: course9.id,
      maLopHoc: 'IELTS-C1-01',
      tenLopHoc: 'IELTS Expert 7.5+ Cùng GV Bản Xứ Tối T3-5',
      siSoToiDa: 12,
      siSoHienTai: 6,
      ngayBatDau: new Date('2024-08-20'),
      ngayKetThuc: new Date('2024-11-20'),
      phongHoc: 'Phòng Hội Thảo VIP A104',
      trangThai: TrangThaiLopHoc.DANG_HOC,
    },
  });

  // Lớp 10: ENG-A1-02 (4/20 HV - 20%)
  const class10 = await prisma.lopHoc.upsert({
    where: { maLopHoc: 'ENG-A1-02' },
    update: { siSoToiDa: 20, siSoHienTai: 4, trangThai: TrangThaiLopHoc.DANG_MO_DANG_KY },
    create: {
      khoaHocId: course1.id,
      maLopHoc: 'ENG-A1-02',
      tenLopHoc: 'Tiếng Anh Căn Bản Cuối Tuần (Thứ 7 - CN)',
      siSoToiDa: 20,
      siSoHienTai: 4,
      ngayBatDau: new Date('2024-10-12'),
      ngayKetThuc: new Date('2025-01-12'),
      phongHoc: 'Phòng B201',
      trangThai: TrangThaiLopHoc.DANG_MO_DANG_KY,
    },
  });

  // Lớp 11: ADV-C1-01 (5/15 HV - 33%)
  const class11 = await prisma.lopHoc.upsert({
    where: { maLopHoc: 'ADV-C1-01' },
    update: { siSoToiDa: 15, siSoHienTai: 5, trangThai: TrangThaiLopHoc.DANG_HOC },
    create: {
      khoaHocId: course6.id,
      maLopHoc: 'ADV-C1-01',
      tenLopHoc: 'Biên Dịch Học Thuật Chuyên Sâu Tối Thứ 2-4',
      siSoToiDa: 15,
      siSoHienTai: 5,
      ngayBatDau: new Date('2024-08-15'),
      ngayKetThuc: new Date('2024-11-30'),
      phongHoc: 'Phòng Chuyên Đề A105',
      trangThai: TrangThaiLopHoc.DANG_HOC,
    },
  });

  // Lớp 12: GRAM-A1-01 (0/25 HV - Sắp mở mới)
  const class12 = await prisma.lopHoc.upsert({
    where: { maLopHoc: 'GRAM-A1-01' },
    update: { siSoToiDa: 25, siSoHienTai: 0, trangThai: TrangThaiLopHoc.SAP_MO },
    create: {
      khoaHocId: course10.id,
      maLopHoc: 'GRAM-A1-01',
      tenLopHoc: 'Ngữ Pháp Nền Tảng & Luyện Âm Tối Thứ 3-6',
      siSoToiDa: 25,
      siSoHienTai: 0,
      ngayBatDau: new Date('2024-11-01'),
      ngayKetThuc: new Date('2025-02-01'),
      phongHoc: 'Phòng B204',
      trangThai: TrangThaiLopHoc.SAP_MO,
    },
  });

  // Lớp 13: MAST-C2-01 (0/12 HV - ĐANG MỞ ĐĂNG KÝ)
  const class13 = await prisma.lopHoc.upsert({
    where: { maLopHoc: 'MAST-C2-01' },
    update: { siSoToiDa: 12, siSoHienTai: 0, trangThai: TrangThaiLopHoc.DANG_MO_DANG_KY },
    create: {
      khoaHocId: course11.id,
      maLopHoc: 'MAST-C2-01',
      tenLopHoc: 'C2 Academic Mastery & Advanced Debate (Thứ 7 - CN)',
      siSoToiDa: 12,
      siSoHienTai: 0,
      ngayBatDau: new Date('2024-10-20'),
      ngayKetThuc: new Date('2025-01-20'),
      phongHoc: 'Phòng Hội Thảo VIP A105',
      trangThai: TrangThaiLopHoc.DANG_MO_DANG_KY,
    },
  });

  // Lớp 14: IELTS-C1-02 (0/15 HV - ĐANG MỞ ĐĂNG KÝ)
  const class14 = await prisma.lopHoc.upsert({
    where: { maLopHoc: 'IELTS-C1-02' },
    update: { siSoToiDa: 15, siSoHienTai: 0, trangThai: TrangThaiLopHoc.DANG_MO_DANG_KY },
    create: {
      khoaHocId: course9.id,
      maLopHoc: 'IELTS-C1-02',
      tenLopHoc: 'IELTS Chuyên Sâu 7.5 - 8.5+ Cấp Tốc (Tối Thứ 3-5-7)',
      siSoToiDa: 15,
      siSoHienTai: 0,
      ngayBatDau: new Date('2024-10-15'),
      ngayKetThuc: new Date('2025-01-15'),
      phongHoc: 'Phòng Chuyên Đề A104',
      trangThai: TrangThaiLopHoc.DANG_MO_DANG_KY,
    },
  });

  console.log('✅ Đã nạp 14 Lớp học đa dạng trạng thái (Chuẩn CEFR A1 đến C2)');

  // Lịch học (Schedules)
  const schedules = [
    { lopId: class1.id, thu: 2, bd: '17:30:00', kt: '20:30:00', phong: 'Phòng Hội Trường A101' },
    { lopId: class1.id, thu: 4, bd: '17:30:00', kt: '20:30:00', phong: 'Phòng Hội Trường A101' },
    { lopId: class1.id, thu: 6, bd: '17:30:00', kt: '20:30:00', phong: 'Phòng Hội Trường A101' },
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
    // Lịch học lớp 7-12
    { lopId: class7.id, thu: 2, bd: '18:30:00', kt: '20:30:00', phong: 'Phòng B203' },
    { lopId: class7.id, thu: 4, bd: '18:30:00', kt: '20:30:00', phong: 'Phòng B203' },
    { lopId: class7.id, thu: 6, bd: '18:30:00', kt: '20:30:00', phong: 'Phòng B203' },
    { lopId: class8.id, thu: 3, bd: '18:00:00', kt: '20:00:00', phong: 'Phòng C302' },
    { lopId: class8.id, thu: 5, bd: '18:00:00', kt: '20:00:00', phong: 'Phòng C302' },
    { lopId: class8.id, thu: 7, bd: '18:00:00', kt: '20:00:00', phong: 'Phòng C302' },
    { lopId: class9.id, thu: 3, bd: '18:30:00', kt: '21:00:00', phong: 'Phòng Hội Thảo VIP A104' },
    { lopId: class9.id, thu: 5, bd: '18:30:00', kt: '21:00:00', phong: 'Phòng Hội Thảo VIP A104' },
    { lopId: class10.id, thu: 7, bd: '14:00:00', kt: '17:00:00', phong: 'Phòng B201' },
    { lopId: class10.id, thu: 8, bd: '14:00:00', kt: '17:00:00', phong: 'Phòng B201' },
    { lopId: class11.id, thu: 2, bd: '18:00:00', kt: '21:00:00', phong: 'Phòng Chuyên Đề A105' },
    { lopId: class11.id, thu: 4, bd: '18:00:00', kt: '21:00:00', phong: 'Phòng Chuyên Đề A105' },
    { lopId: class12.id, thu: 3, bd: '18:00:00', kt: '20:00:00', phong: 'Phòng B204' },
    { lopId: class12.id, thu: 6, bd: '18:00:00', kt: '20:00:00', phong: 'Phòng B204' },
    // Lịch học lớp 13 (C2) & 14 (C1)
    { lopId: class13.id, thu: 7, bd: '18:00:00', kt: '20:30:00', phong: 'Phòng Hội Thảo VIP A105' },
    { lopId: class13.id, thu: 8, bd: '18:00:00', kt: '20:30:00', phong: 'Phòng Hội Thảo VIP A105' },
    { lopId: class14.id, thu: 3, bd: '18:00:00', kt: '20:30:00', phong: 'Phòng Chuyên Đề A104' },
    { lopId: class14.id, thu: 5, bd: '18:00:00', kt: '20:30:00', phong: 'Phòng Chuyên Đề A104' },
    { lopId: class14.id, thu: 7, bd: '18:00:00', kt: '20:30:00', phong: 'Phòng Chuyên Đề A104' },
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
    { lopId: class3.id, gvId: teacherProfiles['teacher03'].id, vaitro: VaiTroPhanCong.CHINH },
    { lopId: class4.id, gvId: teacherProfiles['teacher06'].id, vaitro: VaiTroPhanCong.CHINH },
    { lopId: class5.id, gvId: teacherProfiles['teacher05'].id, vaitro: VaiTroPhanCong.CHINH },
    { lopId: class7.id, gvId: teacherProfiles['teacher07'].id, vaitro: VaiTroPhanCong.CHINH },
    { lopId: class8.id, gvId: teacherProfiles['teacher10'].id, vaitro: VaiTroPhanCong.CHINH },
    { lopId: class9.id, gvId: teacherProfiles['teacher04'].id, vaitro: VaiTroPhanCong.CHINH },
    { lopId: class10.id, gvId: teacherProfiles['teacher09'].id, vaitro: VaiTroPhanCong.CHINH },
    { lopId: class11.id, gvId: teacherProfiles['teacher08'].id, vaitro: VaiTroPhanCong.CHINH },
    { lopId: class12.id, gvId: teacherProfiles['teacher11'].id, vaitro: VaiTroPhanCong.CHINH },
    { lopId: class13.id, gvId: teacherProfiles['teacher12'].id, vaitro: VaiTroPhanCong.CHINH },
    { lopId: class14.id, gvId: teacherProfiles['teacher10'].id, vaitro: VaiTroPhanCong.CHINH },
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
    staffUserId?: bigint;
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
          nguoiThuId: params.staffUserId || staffUsers['staff01'].id,
          trangThai: TrangThaiThanhToan.THANH_CONG,
        },
      });
    }
  };

  // 5.1 Lớp IELTS-B1-01 (ĐỦ 25 HỌC VIÊN TỐI ĐA: student01 -> student25) - Thu ngân: staff01
  const class1Students = Array.from({ length: 25 }, (_, i) => `student${String(i + 1).padStart(2, '0')}`);
  let idx = 1;
  for (const sUser of class1Students) {
    const sProfile = studentProfiles[sUser];
    await enrollAndPay({
      lopId: class1.id,
      studentId: sProfile.id,
      staffUserId: staffUsers['staff01'].id,
      enrollStatus: TrangThaiDangKy.DA_XAC_NHAN,
      invoiceCode: `HD-IELTS-B1-${String(idx).padStart(3, '0')}`,
      amountDue: 3500000,
      amountPaid: 3500000,
      invoiceStatus: TrangThaiHoaDon.DA_HOAN_THANH,
      payCode: `TX-IELTS-B1-${String(idx).padStart(3, '0')}`,
      payMethod: idx % 2 === 0 ? PhuongThucThanhToan.TIEN_MAT : PhuongThucThanhToan.CHUYEN_KHOAN,
    });
    idx++;
  }

  // 5.2 Lớp TOEIC-A2-01 (12 học viên: student26 -> student37) - Thu ngân: staff02
  const class2Students = Array.from({ length: 12 }, (_, i) => `student${String(i + 26).padStart(2, '0')}`);
  idx = 1;
  for (const sUser of class2Students) {
    const sProfile = studentProfiles[sUser];
    await enrollAndPay({
      lopId: class2.id,
      studentId: sProfile.id,
      staffUserId: staffUsers['staff02'].id,
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

  // 5.3 Lớp COMM-B1-01 (8 học viên: student38 -> student45) - Thu ngân: staff01
  const class3Students = Array.from({ length: 8 }, (_, i) => `student${String(i + 38).padStart(2, '0')}`);
  idx = 1;
  for (const sUser of class3Students) {
    const sProfile = studentProfiles[sUser];
    await enrollAndPay({
      lopId: class3.id,
      studentId: sProfile.id,
      staffUserId: staffUsers['staff01'].id,
      enrollStatus: TrangThaiDangKy.DA_XAC_NHAN,
      invoiceCode: `HD-COMM-B1-${String(idx).padStart(3, '0')}`,
      amountDue: 2500000,
      amountPaid: 2500000,
      invoiceStatus: TrangThaiHoaDon.DA_HOAN_THANH,
      payCode: `TX-COMM-B1-${String(idx).padStart(3, '0')}`,
      payMethod: idx % 2 === 0 ? PhuongThucThanhToan.CHUYEN_KHOAN : PhuongThucThanhToan.TIEN_MAT,
    });
    idx++;
  }

  // 5.4 Lớp ENG-A1-01 (5 học viên: student46 -> student50) - Thu ngân: staff02
  const class4Students = Array.from({ length: 5 }, (_, i) => `student${String(i + 46).padStart(2, '0')}`);
  idx = 1;
  for (const sUser of class4Students) {
    const sProfile = studentProfiles[sUser];
    await enrollAndPay({
      lopId: class4.id,
      studentId: sProfile.id,
      staffUserId: staffUsers['staff02'].id,
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

  // 5.5 Lớp KIDS-PRE-01 (4 học viên: student51 -> student54) - Thu ngân: staff01
  const class5Students = Array.from({ length: 4 }, (_, i) => `student${String(i + 51).padStart(2, '0')}`);
  idx = 1;
  for (const sUser of class5Students) {
    const sProfile = studentProfiles[sUser];
    await enrollAndPay({
      lopId: class5.id,
      studentId: sProfile.id,
      staffUserId: staffUsers['staff01'].id,
      enrollStatus: TrangThaiDangKy.DA_XAC_NHAN,
      invoiceCode: `HD-KIDS-PRE-${String(idx).padStart(3, '0')}`,
      amountDue: 3000000,
      amountPaid: 3000000,
      invoiceStatus: TrangThaiHoaDon.DA_HOAN_THANH,
      payCode: `TX-KIDS-PRE-${String(idx).padStart(3, '0')}`,
      payMethod: PhuongThucThanhToan.CHUYEN_KHOAN,
    });
    idx++;
  }

  // 5.6 Lớp IELTS-B1-02 (Đang tuyển sinh - 2 học viên: 1 đã đóng tiền 3.500.000 đ, 1 chờ đóng tiền)
  await enrollAndPay({
    lopId: class6.id,
    studentId: studentProfiles['student01'].id,
    staffUserId: staffUsers['staff02'].id,
    enrollStatus: TrangThaiDangKy.DA_XAC_NHAN,
    invoiceCode: 'HD-IELTS-B1-02-001',
    amountDue: 3500000,
    amountPaid: 3500000,
    invoiceStatus: TrangThaiHoaDon.DA_HOAN_THANH,
    payCode: 'TX-IELTS-B1-02-001',
    payMethod: PhuongThucThanhToan.CHUYEN_KHOAN,
  });

  await enrollAndPay({
    lopId: class6.id,
    studentId: studentProfiles['student02'].id,
    enrollStatus: TrangThaiDangKy.CHO_THANH_TOAN,
    invoiceCode: 'HD-IELTS-B1-02-002',
    amountDue: 3500000,
    amountPaid: 0,
    invoiceStatus: TrangThaiHoaDon.CHUA_THANH_TOAN,
  });

  // 5.7 Lớp TOEIC-B1-01 (10 học viên: student55 -> student64) - Thu ngân: staff01 & staff02
  const class7Students = Array.from({ length: 10 }, (_, i) => `student${String(i + 55).padStart(2, '0')}`);
  idx = 1;
  for (const sUser of class7Students) {
    const sProfile = studentProfiles[sUser];
    await enrollAndPay({
      lopId: class7.id,
      studentId: sProfile.id,
      staffUserId: idx % 2 === 0 ? staffUsers['staff01'].id : staffUsers['staff02'].id,
      enrollStatus: TrangThaiDangKy.DA_XAC_NHAN,
      invoiceCode: `HD-TOEIC-B1-${String(idx).padStart(3, '0')}`,
      amountDue: 3600000,
      amountPaid: 3600000,
      invoiceStatus: TrangThaiHoaDon.DA_HOAN_THANH,
      payCode: `TX-TOEIC-B1-${String(idx).padStart(3, '0')}`,
      payMethod: idx % 2 === 0 ? PhuongThucThanhToan.CHUYEN_KHOAN : PhuongThucThanhToan.TIEN_MAT,
    });
    idx++;
  }

  // 5.8 Lớp COMM-A2-01 (8 học viên: student65 -> student72) - Thu ngân: staff01
  const class8Students = Array.from({ length: 8 }, (_, i) => `student${String(i + 65).padStart(2, '0')}`);
  idx = 1;
  for (const sUser of class8Students) {
    const sProfile = studentProfiles[sUser];
    await enrollAndPay({
      lopId: class8.id,
      studentId: sProfile.id,
      staffUserId: staffUsers['staff01'].id,
      enrollStatus: TrangThaiDangKy.DA_XAC_NHAN,
      invoiceCode: `HD-COMM-A2-${String(idx).padStart(3, '0')}`,
      amountDue: 2600000,
      amountPaid: 2600000,
      invoiceStatus: TrangThaiHoaDon.DA_HOAN_THANH,
      payCode: `TX-COMM-A2-${String(idx).padStart(3, '0')}`,
      payMethod: PhuongThucThanhToan.TIEN_MAT,
    });
    idx++;
  }

  // 5.9 Lớp IELTS-C1-01 (6 học viên: student73 -> student78) - Thu ngân: staff02
  const class9Students = Array.from({ length: 6 }, (_, i) => `student${String(i + 73).padStart(2, '0')}`);
  idx = 1;
  for (const sUser of class9Students) {
    const sProfile = studentProfiles[sUser];
    await enrollAndPay({
      lopId: class9.id,
      studentId: sProfile.id,
      staffUserId: staffUsers['staff02'].id,
      enrollStatus: TrangThaiDangKy.DA_XAC_NHAN,
      invoiceCode: `HD-IELTS-C1-${String(idx).padStart(3, '0')}`,
      amountDue: 6200000,
      amountPaid: 6200000,
      invoiceStatus: TrangThaiHoaDon.DA_HOAN_THANH,
      payCode: `TX-IELTS-C1-${String(idx).padStart(3, '0')}`,
      payMethod: PhuongThucThanhToan.CHUYEN_KHOAN,
    });
    idx++;
  }

  // 5.10 Lớp ENG-A1-02 (4 học viên: student79, student80 đã đóng; student04, student49 chờ thanh toán)
  const class10Paid = ['student79', 'student80'];
  idx = 1;
  for (const sUser of class10Paid) {
    const sProfile = studentProfiles[sUser];
    await enrollAndPay({
      lopId: class10.id,
      studentId: sProfile.id,
      staffUserId: staffUsers['staff01'].id,
      enrollStatus: TrangThaiDangKy.DA_XAC_NHAN,
      invoiceCode: `HD-ENG-A1-02-${String(idx).padStart(3, '0')}`,
      amountDue: 2200000,
      amountPaid: 2200000,
      invoiceStatus: TrangThaiHoaDon.DA_HOAN_THANH,
      payCode: `TX-ENG-A1-02-${String(idx).padStart(3, '0')}`,
      payMethod: PhuongThucThanhToan.TIEN_MAT,
    });
    idx++;
  }
  const class10Pending = ['student04', 'student49'];
  for (const sUser of class10Pending) {
    const sProfile = studentProfiles[sUser];
    await enrollAndPay({
      lopId: class10.id,
      studentId: sProfile.id,
      enrollStatus: TrangThaiDangKy.CHO_THANH_TOAN,
      invoiceCode: `HD-ENG-A1-02-${String(idx).padStart(3, '0')}`,
      amountDue: 2200000,
      amountPaid: 0,
      invoiceStatus: TrangThaiHoaDon.CHUA_THANH_TOAN,
    });
    idx++;
  }

  // 5.11 Lớp ADV-C1-01 (5 học viên: student06, student10, student73, student75, student77) - Thu ngân: staff02
  const class11Students = ['student06', 'student10', 'student73', 'student75', 'student77'];
  idx = 1;
  for (const sUser of class11Students) {
    const sProfile = studentProfiles[sUser];
    await enrollAndPay({
      lopId: class11.id,
      studentId: sProfile.id,
      staffUserId: staffUsers['staff02'].id,
      enrollStatus: TrangThaiDangKy.DA_XAC_NHAN,
      invoiceCode: `HD-ADV-C1-${String(idx).padStart(3, '0')}`,
      amountDue: 5500000,
      amountPaid: 5500000,
      invoiceStatus: TrangThaiHoaDon.DA_HOAN_THANH,
      payCode: `TX-ADV-C1-${String(idx).padStart(3, '0')}`,
      payMethod: PhuongThucThanhToan.CHUYEN_KHOAN,
    });
    idx++;
  }

  console.log('✅ Đã nạp Đăng ký học, Hóa đơn & Thanh toán đầy đủ cho 11 lớp học hoạt động');

  // ============================================================================
  // 6. BUỔI HỌC & ĐIỂM DANH (BuoiHoc & BanGhiDiemDanh - Batch Created)
  // ============================================================================
  await prisma.banGhiDiemDanh.deleteMany({});
  await prisma.buoiHoc.deleteMany({});

  const allAttendanceData: any[] = [];

  // Helper tạo buổi học và chuẩn bị dữ liệu điểm danh
  const createSessionsAndAttendance = async (
    lopId: bigint,
    teacherId: bigint,
    studentsList: string[],
    sessionsList: { so: number; ngay: string; tieude: string }[],
    absentMap?: Record<string, number[]>,
    lateMap?: Record<string, number[]>,
  ) => {
    for (const sess of sessionsList) {
      const b = await prisma.buoiHoc.create({
        data: {
          lopHocId: lopId,
          soThuTu: sess.so,
          ngayHoc: new Date(sess.ngay),
          gioBatDau: new Date('1970-01-01T18:00:00'),
          gioKetThuc: new Date('1970-01-01T20:00:00'),
          chuDe: sess.tieude,
          trangThai: TrangThaiBuoiHoc.DA_KET_THUC,
        },
      });

      for (const sUser of studentsList) {
        const sProf = studentProfiles[sUser];
        const isAbsent = absentMap?.[sUser]?.includes(sess.so);
        const isLate = lateMap?.[sUser]?.includes(sess.so);
        const attStatus = isAbsent ? TrangThaiDiemDanh.VANG : isLate ? TrangThaiDiemDanh.DI_MUON : TrangThaiDiemDanh.CO_MAT;

        allAttendanceData.push({
          buoiHocId: b.id,
          hocVienId: sProf.id,
          giaoVienDiemDanhId: teacherId,
          trangThai: attStatus,
          ghiChu: isAbsent ? 'Vắng không phép' : isLate ? 'Kẹt xe đến muộn 15p' : 'Đi học đúng giờ',
        });
      }
    }
  };

  // 6.1 Lớp IELTS-B1-01 (8 buổi x 25 HV)
  await createSessionsAndAttendance(
    class1.id,
    teacherProfiles['teacher01'].id,
    class1Students,
    [
      { so: 1, ngay: '2024-09-16', tieude: 'Orientation & Diagnostic Placement Test' },
      { so: 2, ngay: '2024-09-18', tieude: 'Listening Section 1 & 2 Strategies' },
      { so: 3, ngay: '2024-09-20', tieude: 'Reading Skimming & Scanning Techniques' },
      { so: 4, ngay: '2024-09-23', tieude: 'Speaking Part 1 Fluency & Pronunciation' },
      { so: 5, ngay: '2024-09-25', tieude: 'Writing Task 1 Overview & Line Graphs' },
      { so: 6, ngay: '2024-09-27', tieude: 'Mid-term Assessment & Teacher Feedback' },
      { so: 7, ngay: '2024-09-30', tieude: 'Writing Task 2 Essay Structure & Ideas' },
      { so: 8, ngay: '2024-10-02', tieude: 'Final Full Mock Test & Band Score Evaluation' },
    ],
    {
      student15: [3, 4, 6],
      student17: [2, 5],
      student23: [1, 7],
    },
    {
      student12: [2],
      student25: [4],
    },
  );

  // 6.2 Lớp TOEIC-A2-01 (6 buổi x 12 HV)
  await createSessionsAndAttendance(
    class2.id,
    teacherProfiles['teacher02'].id,
    class2Students,
    [
      { so: 1, ngay: '2024-09-17', tieude: 'Part 1 Photographs & Vocabulary' },
      { so: 2, ngay: '2024-09-19', tieude: 'Part 2 Question - Response' },
      { so: 3, ngay: '2024-09-21', tieude: 'Part 5 Incomplete Sentences Grammar' },
      { so: 4, ngay: '2024-09-24', tieude: 'Mid-term Quiz & Listening Part 3' },
      { so: 5, ngay: '2024-09-26', tieude: 'Part 6 Text Completion' },
      { so: 6, ngay: '2024-09-28', tieude: 'Final Review & Practice Test' },
    ],
    {
      student37: [3, 5],
    },
  );

  // 6.3 Lớp TOEIC-B1-01 (6 buổi x 10 HV)
  await createSessionsAndAttendance(
    class7.id,
    teacherProfiles['teacher07'].id,
    class7Students,
    [
      { so: 1, ngay: '2024-09-16', tieude: 'TOEIC Listening Part 3 & 4 Advance' },
      { so: 2, ngay: '2024-09-18', tieude: 'Business Vocabulary & Email Collocations' },
      { so: 3, ngay: '2024-09-20', tieude: 'Reading Comprehension Double Passages' },
      { so: 4, ngay: '2024-09-23', tieude: 'Mid-term Diagnostic Assessment' },
      { so: 5, ngay: '2024-09-25', tieude: 'Speed Reading & Time Management' },
      { so: 6, ngay: '2024-09-27', tieude: 'Final Practice Test & Band Target Review' },
    ],
    {
      student63: [2, 5],
    },
  );

  // 6.4 Lớp COMM-A2-01 (6 buổi x 8 HV)
  await createSessionsAndAttendance(
    class8.id,
    teacherProfiles['teacher10'].id,
    class8Students,
    [
      { so: 1, ngay: '2024-09-17', tieude: 'Self Introduction & Networking' },
      { so: 2, ngay: '2024-09-19', tieude: 'Daily Routines & Hobbies Conversation' },
      { so: 3, ngay: '2024-09-21', tieude: 'Travel, Airport & Hotel Check-in' },
      { so: 4, ngay: '2024-09-24', tieude: 'Mid-term Role-play Simulation' },
      { so: 5, ngay: '2024-09-26', tieude: 'Dining Out & Shopping English' },
      { so: 6, ngay: '2024-09-28', tieude: 'Final Group Discussion & Presentation' },
    ],
    {
      student71: [3, 6],
    },
  );

  // 6.5 Lớp IELTS-C1-01 (6 buổi x 6 HV)
  await createSessionsAndAttendance(
    class9.id,
    teacherProfiles['teacher04'].id,
    class9Students,
    [
      { so: 1, ngay: '2024-08-20', tieude: 'Academic Discourse & Abstract Topics' },
      { so: 2, ngay: '2024-08-22', tieude: 'Writing Task 2 Band 8.0+ Lexical Resource' },
      { so: 3, ngay: '2024-08-27', tieude: 'Speaking Part 3 Critical Argumentation' },
      { so: 4, ngay: '2024-08-29', tieude: 'Advanced Cohesion & Coherence in Essays' },
      { so: 5, ngay: '2024-09-03', tieude: 'Mock Interview with Native Examiner' },
      { so: 6, ngay: '2024-09-05', tieude: 'Final Full Academic Assessment' },
    ],
  );

  // 6.6 Lớp ADV-C1-01 (6 buổi x 5 HV)
  await createSessionsAndAttendance(
    class11.id,
    teacherProfiles['teacher08'].id,
    class11Students,
    [
      { so: 1, ngay: '2024-08-15', tieude: 'Foundations of Academic Translation' },
      { so: 2, ngay: '2024-08-19', tieude: 'Terminology Management in Law & Commerce' },
      { so: 3, ngay: '2024-08-22', tieude: 'Journal Article Synthesis & Translation' },
      { so: 4, ngay: '2024-08-26', tieude: 'Editing & Proofreading English Manuscripts' },
      { so: 5, ngay: '2024-08-29', tieude: 'Simultaneous Translation Practice' },
      { so: 6, ngay: '2024-09-02', tieude: 'Final Project Submission & Evaluation' },
    ],
  );

  // Batch insert toàn bộ điểm danh trong 1 query
  await prisma.banGhiDiemDanh.createMany({ data: allAttendanceData });
  console.log(`✅ Đã nạp Buổi học & ${allAttendanceData.length} Bản ghi điểm danh tốc độ cao (Batch Insert)`);

  // ============================================================================
  // 7. BẢNG ĐIỂM & ĐÁNH GIÁ (KetQuaHocTap — 20% Chuyên cần, 30% Giữa kỳ, 50% Cuối kỳ)
  // Đảm bảo 100% nhất quán toán học và logic ĐẠT / KHÔNG ĐẠT theo quy chế
  // ============================================================================
  await prisma.ketQuaHocTap.deleteMany({});

  const computeGrade = (user: string, lopId: bigint, cc: number, gk: number, ck: number | null, note: string) => {
    const sProf = studentProfiles[user];
    if (ck === null) {
      return {
        lopHocId: lopId,
        hocVienId: sProf.id,
        diemChuyenCan: cc,
        diemGiuaKy: gk,
        diemCuoiKy: null,
        diemTongKet: null,
        nhanXet: note,
        trangThaiHoanThanh: TrangThaiHoanThanh.CHUA_XEP_LOAI,
      };
    }
    const total = Number(((cc * 0.2) + (gk * 0.3) + (ck * 0.5)).toFixed(2));
    const isPass = cc >= 80.0 && total >= 50.0;
    return {
      lopHocId: lopId,
      hocVienId: sProf.id,
      diemChuyenCan: cc,
      diemGiuaKy: gk,
      diemCuoiKy: ck,
      diemTongKet: total,
      nhanXet: note,
      trangThaiHoanThanh: isPass ? TrangThaiHoanThanh.DAT : TrangThaiHoanThanh.KHONG_DAT,
    };
  };

  const allGradesData = [
    // --- LỚP 1: IELTS-B1-01 (25 học viên) ---
    computeGrade('student01', class1.id, 95.0, 82.5, 88.0, 'Ngữ pháp tốt, phát âm chuẩn. Cần luyện thêm từ vựng Writing.'),
    computeGrade('student02', class1.id, 90.0, 80.0, 85.0, 'Tác phong học tập nghiêm túc, giải đề cẩn thận.'),
    computeGrade('student03', class1.id, 92.0, 86.0, 88.0, 'Phản xạ tốt, tự tin trong Speaking.'),
    computeGrade('student05', class1.id, 85.0, 72.0, 78.0, 'Chăm chỉ, làm bài đầy đủ.'),
    computeGrade('student06', class1.id, 95.0, 90.0, 92.0, 'Kiến thức học thuật chuyên sâu.'),
    computeGrade('student07', class1.id, 88.0, 78.0, 80.0, 'Tiếp thu bài nhanh.'),
    computeGrade('student08', class1.id, 92.0, 85.0, 87.0, 'Phát âm tự nhiên.'),
    computeGrade('student09', class1.id, 90.0, 82.0, 86.0, 'Nắm vững cấu trúc bài thi IELTS.'),
    computeGrade('student11', class1.id, 90.0, 80.0, 85.0, 'Tiếp thu bài nhanh, phản xạ lưu loát.'),
    computeGrade('student12', class1.id, 88.0, 75.0, 80.0, 'Có tiến bộ rõ rệt ở kỹ năng Reading.'),
    computeGrade('student13', class1.id, 92.0, 88.0, 90.0, 'Bài thi cuối kỳ xuất sắc, nắm chắc cấu trúc bài luận.'),
    computeGrade('student14', class1.id, 95.0, 85.0, 87.0, 'Tác phong học tập gương mẫu, nhiệt tình trao đổi.'),
    computeGrade('student16', class1.id, 90.0, 78.0, 82.0, 'Khả năng Nghe tốt, cần trau chuốt phần phát âm âm đuôi.'),
    computeGrade('student18', class1.id, 92.0, 84.0, 86.0, 'Kỹ năng Writing mạch lạc, lập luận chặt chẽ.'),
    computeGrade('student21', class1.id, 88.0, 76.0, 80.0, 'Hoàn thành tốt các kỹ năng đầu ra của khóa B1.'),
    computeGrade('student22', class1.id, 90.0, 80.0, 82.0, 'Làm bài tập đầy đủ, tự tin trong giao tiếp.'),
    computeGrade('student24', class1.id, 92.0, 85.0, 88.0, 'Xuất sắc, mục tiêu đạt IELTS 6.0+.'),
    computeGrade('student15', class1.id, 62.5, 45.0, 40.0, 'Vắng 3/8 buổi (Chuyên cần 62.5% < 80%) và điểm thi dưới 50đ. Không đủ điều kiện hoàn thành khóa.'),
    computeGrade('student17', class1.id, 75.0, 42.0, 44.0, 'Chuyên cần dưới 80% và bài thi cuối kỳ không đạt chuẩn B1. Đề xuất học lại lớp tăng cường.'),
    computeGrade('student23', class1.id, 70.0, 40.0, 48.0, 'Điểm tổng kết dưới 50đ, không đủ điều kiện cấp chứng nhận hoàn thành.'),
    computeGrade('student19', class1.id, 85.0, 68.0, null, 'Đang ở giai đoạn giữa khóa, điểm giữa kỳ đạt 68/100.'),
    computeGrade('student20', class1.id, 90.0, 75.0, null, 'Đang hoàn thành nửa chặng đường khóa học, chờ thi cuối kỳ.'),
    computeGrade('student25', class1.id, 80.0, 70.0, null, 'Đang theo học chương trình, tiến độ tích lũy ổn định.'),

    // --- LỚP 2: TOEIC-A2-01 (12 học viên) ---
    computeGrade('student26', class2.id, 88.0, 76.0, 78.0, 'Tiến độ làm bài thi nhanh và chính xác.'),
    computeGrade('student28', class2.id, 90.0, 80.0, 82.0, 'Nắm chắc ngữ pháp cơ bản.'),
    computeGrade('student29', class2.id, 92.0, 84.0, 86.0, 'Kỹ năng Nghe Part 2 & 3 tốt.'),
    computeGrade('student30', class2.id, 85.0, 75.0, 78.0, 'Tiến bộ rõ rệt ở Part 5.'),
    computeGrade('student31', class2.id, 90.0, 82.0, 85.0, 'Đạt mục tiêu TOEIC 500+.'),
    computeGrade('student32', class2.id, 88.0, 78.0, 80.0, 'Làm bài thi cẩn thận.'),
    computeGrade('student33', class2.id, 92.0, 86.0, 88.0, 'Nắm chắc từ vựng kinh tế văn phòng.'),
    computeGrade('student34', class2.id, 85.0, 72.0, 75.0, 'Hoàn thành tốt khóa học.'),
    computeGrade('student35', class2.id, 90.0, 80.0, 84.0, 'Phản xạ nghe hiểu tốt.'),
    computeGrade('student27', class2.id, 75.0, 40.0, 42.0, 'Điểm tổng kết dưới 50đ, chưa nắm vững cấu trúc đề TOEIC.'),
    computeGrade('student37', class2.id, 60.0, 45.0, 40.0, 'Vắng 2/6 buổi (Chuyên cần 60% < 80%) và điểm thi không đạt.'),
    computeGrade('student36', class2.id, 85.0, 70.0, null, 'Đang theo học giữa khóa.'),

    // --- LỚP 3: COMM-B1-01 (8 học viên) ---
    computeGrade('student38', class3.id, 90.0, 85.0, 86.0, 'Thuyết trình tự tin, phản xạ tốt.'),
    computeGrade('student39', class3.id, 95.0, 88.0, 89.0, 'Phát âm tự nhiên, đàm phán linh hoạt.'),
    computeGrade('student40', class3.id, 88.0, 80.0, 82.0, 'Tham gia tương tác tích cực.'),
    computeGrade('student41', class3.id, 92.0, 86.0, 88.0, 'Kỹ năng trình bày báo cáo lưu loát.'),
    computeGrade('student42', class3.id, 90.0, 84.0, 85.0, 'Phản xạ đàm phán linh hoạt, giao tiếp tự tin.'),
    computeGrade('student43', class3.id, 92.0, 85.0, 87.0, 'Kỹ năng thương thuyết tốt.'),
    computeGrade('student44', class3.id, 88.0, 78.0, 80.0, 'Giao tiếp tự nhiên.'),
    computeGrade('student45', class3.id, 90.0, 82.0, 84.0, 'Hoàn thành xuất sắc khóa giao tiếp B1.'),

    // --- LỚP 4: ENG-A1-01 (5 học viên) ---
    computeGrade('student46', class4.id, 90.0, 75.0, 78.0, 'Nắm vững phát âm IPA cơ bản.'),
    computeGrade('student47', class4.id, 85.0, 70.0, 72.0, 'Tiến bộ vượt bậc từ mất gốc.'),
    computeGrade('student48', class4.id, 92.0, 80.0, 82.0, 'Tự tin phát âm các từ đơn giản.'),
    computeGrade('student49', class4.id, 70.0, 40.0, 42.0, 'Chưa nắm vững quy tắc phát âm cơ bản, cần học lại.'),
    computeGrade('student50', class4.id, 85.0, 68.0, null, 'Đang theo học nửa đầu khóa học.'),

    // --- LỚP 5: IELTS-B2-01 (4 học viên) ---
    computeGrade('student51', class5.id, 95.0, 90.0, 92.0, 'Trình độ IELTS tương đương 7.5, bài viết Task 2 chặt chẽ.'),
    computeGrade('student52', class5.id, 85.0, 82.0, 86.0, 'Nắm vững chiến thuật làm bài, phản xạ Speaking lưu loát.'),
    computeGrade('student53', class5.id, 90.0, 88.0, 90.0, 'Tác phong học thuật chuyên sâu, từ vựng phong phú.'),
    computeGrade('student54', class5.id, 92.0, 85.0, 88.0, 'Lập luận sắc bén trong phần thi Speaking Part 3.'),

    // --- LỚP 7: TOEIC-B1-01 (10 học viên) ---
    computeGrade('student55', class7.id, 92.0, 84.0, 86.0, 'Nắm rất chắc kỹ thuật nghe bẫy TOEIC Part 3 & 4.'),
    computeGrade('student56', class7.id, 90.0, 82.0, 84.0, 'Từ vựng thương mại phong phú, giải đề đọc nhanh.'),
    computeGrade('student57', class7.id, 88.0, 78.0, 80.0, 'Tiến bộ rõ rệt ở phần ngữ pháp Part 5.'),
    computeGrade('student58', class7.id, 95.0, 88.0, 90.0, 'Điểm số xuất sắc, đạt band kỳ vọng 750+.'),
    computeGrade('student59', class7.id, 85.0, 75.0, 78.0, 'Chăm chỉ, làm đầy đủ các đề luyện tập.'),
    computeGrade('student60', class7.id, 90.0, 80.0, 82.0, 'Khả năng phân bổ thời gian làm bài thi rất chuẩn.'),
    computeGrade('student61', class7.id, 88.0, 76.0, 79.0, 'Hoàn thành tốt các mục tiêu của khóa học.'),
    computeGrade('student62', class7.id, 92.0, 85.0, 87.0, 'Tư duy logic tốt, điểm thi cuối kỳ bứt phá.'),
    computeGrade('student63', class7.id, 65.0, 42.0, 45.0, 'Vắng 2 buổi (Chuyên cần 65% < 80%) và điểm thi dưới 50đ. Cần ôn tập lại.'),
    computeGrade('student64', class7.id, 85.0, 72.0, null, 'Đang theo học giữa khóa, theo dõi tiến độ ổn định.'),

    // --- LỚP 8: COMM-A2-01 (8 học viên) ---
    computeGrade('student65', class8.id, 90.0, 80.0, 82.0, 'Tự tin đàm thoại tình huống du lịch và mua sắm.'),
    computeGrade('student66', class8.id, 92.0, 84.0, 85.0, 'Phát âm ngữ điệu tự nhiên, phản xạ nhanh.'),
    computeGrade('student67', class8.id, 88.0, 76.0, 78.0, 'Tiếp thu bài tốt, giao tiếp lưu loát hơn đầu khóa.'),
    computeGrade('student68', class8.id, 95.0, 86.0, 88.0, 'Tương tác nhóm tích cực, vốn từ vựng phong phú.'),
    computeGrade('student69', class8.id, 85.0, 72.0, 74.0, 'Có nhiều nỗ lực vượt bậc trong thực hành giao tiếp.'),
    computeGrade('student70', class8.id, 90.0, 82.0, 84.0, 'Xử lý tình huống đối thoại tiếng Anh rất nhạy bén.'),
    computeGrade('student72', class8.id, 88.0, 78.0, 80.0, 'Hoàn thành xuất sắc mục tiêu phản xạ A2.'),
    computeGrade('student71', class8.id, 68.0, 44.0, 46.0, 'Chuyên cần dưới 80% và kỹ năng phát âm còn nhiều lỗi sai cơ bản.'),

    // --- LỚP 9: IELTS-C1-01 (6 học viên) ---
    computeGrade('student73', class9.id, 95.0, 90.0, 94.0, 'Tư duy học thuật xuất sắc, bài viết Band 8.0 chuẩn Cambridge.'),
    computeGrade('student74', class9.id, 92.0, 88.0, 90.0, 'Phản xạ biện luận sắc sảo, từ vựng C1 phong phú.'),
    computeGrade('student75', class9.id, 95.0, 92.0, 93.0, 'Khả năng phân tích chủ đề phức tạp rất mạch lạc.'),
    computeGrade('student76', class9.id, 90.0, 86.0, 88.0, 'Kỹ năng Speaking lưu loát, không ngập ngừng.'),
    computeGrade('student77', class9.id, 92.0, 89.0, 91.0, 'Cấu trúc bài luận chặt chẽ, luận cứ thuyết phục.'),
    computeGrade('student78', class9.id, 94.0, 87.0, 89.0, 'Hoàn thành xuất sắc chương trình IELTS Expert.'),

    // --- LỚP 11: ADV-C1-01 (5 học viên) ---
    computeGrade('student06', class11.id, 95.0, 92.0, 95.0, 'Kỹ năng dịch thuật văn bản học thuật quốc tế điêu luyện.'),
    computeGrade('student10', class11.id, 92.0, 88.0, 90.0, 'Nắm vững thuật ngữ pháp lý và thương mại quốc tế.'),
    computeGrade('student73', class11.id, 90.0, 86.0, 88.0, 'Biên tập bản dịch chính xác, phong cách học thuật cao.'),
    computeGrade('student75', class11.id, 92.0, 89.0, 91.0, 'Phản xạ dịch cabin và dịch đuổi rất chuẩn xác.'),
    computeGrade('student77', class11.id, 94.0, 90.0, 92.0, 'Tác phong nghiên cứu ngôn ngữ học mẫu mực.'),
  ];

  await prisma.ketQuaHocTap.createMany({ data: allGradesData });
  const passCount = allGradesData.filter((g) => g.trangThaiHoanThanh === TrangThaiHoanThanh.DAT).length;
  const failCount = allGradesData.filter((g) => g.trangThaiHoanThanh === TrangThaiHoanThanh.KHONG_DAT).length;
  const inProgressCount = allGradesData.filter((g) => g.trangThaiHoanThanh === TrangThaiHoanThanh.CHUA_XEP_LOAI).length;
  console.log(`✅ Đã nạp ${allGradesData.length} Bảng điểm chuẩn quy chế (${passCount} ĐẠT, ${failCount} KHÔNG ĐẠT, ${inProgressCount} ĐANG HỌC)`);

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
      {
        nguoiDungId: studentProfiles['student58'].nguoiDungId!,
        loaiChucNang: LoaiChucNangAI.TU_VAN_LOP,
        promptInput: 'Tư vấn lớp TOEIC cấp tốc mục tiêu 750+ cho người đi làm tối 2-4-6',
        rawOutput: '[{"maLopHoc": "TOEIC-B1-01", "tenLopHoc": "TOEIC Đột Phá 650+ Tối T2-4-6", "doTuongThich": 98}]',
        validatedOutputJson: [{ maLopHoc: 'TOEIC-B1-01', tenLopHoc: 'TOEIC Đột Phá 650+ Tối T2-4-6', doTuongThich: 98 }],
        trangThai: TrangThaiYeuCauAI.THANH_CONG,
        thoiGianXuLyMs: 1320,
      },
      {
        nguoiDungId: teacherProfiles['teacher07'].nguoiDungId!,
        loaiChucNang: LoaiChucNangAI.SINH_BAI_TAP,
        promptInput: 'Sinh 10 câu trắc nghiệm từ vựng kinh tế văn phòng TOEIC Part 5 chuẩn CEFR B1',
        rawOutput: '{"chuDe": "Business Vocabulary", "trinhDo": "B1", "cauHoi": [...]}',
        validatedOutputJson: { chuDe: 'Business Vocabulary', trinhDo: 'B1', cauHoi: [] },
        trangThai: TrangThaiYeuCauAI.THANH_CONG,
        thoiGianXuLyMs: 2150,
      },
    ],
  });
  console.log('✅ Đã nạp Audit Log AI đầy đủ');

  console.log('\n🎉 NẠP TOÀN BỘ SIÊU DỮ LIỆU ĐẦY ĐỦ 80 HỌC VIÊN, 14 GIẢNG VIÊN, 11 KHÓA HỌC & 14 LỚP HỌC (CHUẨN CEFR A1 - C2) THÀNH CÔNG!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📋 TÀI KHOẢN HỆ THỐNG ĐÃ SẴN SÀNG (Mật khẩu mặc định: 123456):');
  console.log('   👑 Quản lý (Admin)     : admin01');
  console.log('   👨‍🏫 Giáo viên (Teacher) : teacher01 → teacher14 (14 Giảng viên chuyên môn sâu)');
  console.log('   📞 Tư vấn viên (Staff) : staff01, staff02');
  console.log('   🎓 Học viên (Student)   : student01 → student80 (80 Học viên đầy đủ CEFR A1 → C2)');
  console.log('   📚 Khóa học (Courses)   : 11 Khóa học chuẩn quốc tế (CEFR A1, A2, B1, B2, C1, C2)');
  console.log('   🏫 Lớp học (Classes)    : 14 Lớp học đa dạng (Đủ các lớp mở đăng ký cho cả C1 và C2)');
  console.log(`   📊 Thống kê bảng điểm   : ${passCount} ĐẠT, ${failCount} KHÔNG ĐẠT, ${inProgressCount} ĐANG HỌC (Chuẩn tỷ lệ 20/30/50)`);
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
