import os

# Generate 54 students dataset
students = [
    ("student01", "HV001", "Lê Thị Hoa", "B1", "2002-05-15", "Nữ", "0904444001", "le.thi.hoa@gmail.com", "Placement Test 15/08/2024 (Đạt 58/100)", [2, 4, 6], "17:30-21:00"),
    ("student02", "HV002", "Phạm Văn Hùng", "A2", "2001-11-20", "Nam", "0904444002", "pham.van.hung@gmail.com", "Placement Test 01/09/2024 (Đạt 42/100)", [3, 5, 7], "19:00-21:00"),
    ("student03", "HV003", "Nguyễn Hoàng Long", "B2", "2000-03-10", "Nam", "0904444003", "hoanglong.nguyen@gmail.com", "IELTS 6.0 IDP Certificate", [2, 4, 6], "18:00-21:00"),
    ("student04", "HV004", "Đỗ Minh Châu", "A1", "2003-08-25", "Nữ", "0904444004", "minhchau.do@gmail.com", "Học viên mất gốc kiểm tra trực tiếp", [7, 8], "08:30-11:30"),
    ("student05", "HV005", "Vũ Bảo Ngọc", "B1", "2002-12-05", "Nữ", "0904444005", "baongoc.vu@gmail.com", "Thi thử CEFR B1 Online", [2, 4, 6], "17:30-20:30"),
    ("student06", "HV006", "Trịnh Đình Quang", "C1", "1999-07-18", "Nam", "0904444006", "dinhquang.trinh@gmail.com", "IELTS 7.5 BC Certificate", [2, 4, 6], "18:30-21:30"),
    ("student07", "HV007", "Bùi Đức Thắng", "A2", "2004-01-12", "Nam", "0904444007", "thang.bui@gmail.com", "Kiểm tra đầu vào TOEIC 400", [3, 5, 7], "19:00-21:00"),
    ("student08", "HV008", "Hoàng Mai Linh", "B1", "2001-09-30", "Nữ", "0904444008", "mailinh.hoang@gmail.com", "Đánh giá năng lực tiếng Anh B1", [2, 4, 6], "19:00-21:00"),
    ("student09", "HV009", "Phạm Quốc Cường", "B2", "2000-06-22", "Nam", "0904444009", "cuong.pham@gmail.com", "Bảng điểm IELTS 6.5 British Council", [2, 4, 6], "18:00-21:00"),
    ("student10", "HV010", "Trần Phương Anh", "C1", "1998-04-14", "Nữ", "0904444010", "phuonganh.tran@gmail.com", "Cử nhân ngôn ngữ Anh", [7, 8], "08:30-11:30"),
    ("student11", "HV011", "Nguyễn Văn An", "B1", "2003-02-14", "Nam", "0904444011", "an.nguyen@gmail.com", "Thi thử đầu vào B1", [2, 4, 6], "17:30-20:30"),
    ("student12", "HV012", "Trần Thị Bích", "B1", "2002-08-19", "Nữ", "0904444012", "bich.tran@gmail.com", "Chuyển trường từ cơ sở khác", [2, 4, 6], "17:30-20:30"),
    ("student13", "HV013", "Lê Minh Cảnh", "B1", "2001-04-23", "Nam", "0904444013", "canh.le@gmail.com", "Kiểm tra trình độ đầu khóa", [2, 4, 6], "17:30-20:30"),
    ("student14", "HV014", "Phạm Thu Dung", "B1", "2004-10-09", "Nữ", "0904444014", "dung.pham@gmail.com", "Test đầu vào đạt 62/100", [2, 4, 6], "17:30-20:30"),
    ("student15", "HV015", "Hoàng Anh Dũng", "B1", "2000-12-11", "Nam", "0904444015", "dung.hoang@gmail.com", "IELTS 5.5 mock test", [2, 4, 6], "17:30-20:30"),
    ("student16", "HV016", "Đinh Thị Giang", "B1", "2003-06-07", "Nữ", "0904444016", "giang.dinh@gmail.com", "Đăng ký học hè", [2, 4, 6], "17:30-20:30"),
    ("student17", "HV017", "Vũ Đức Hải", "B1", "2002-03-31", "Nam", "0904444017", "hai.vu@gmail.com", "Placement Test B1", [2, 4, 6], "17:30-20:30"),
    ("student18", "HV018", "Ngô Thanh Hằng", "B1", "2001-07-28", "Nữ", "0904444018", "hang.ngo@gmail.com", "Test năng lực B1", [2, 4, 6], "17:30-20:30"),
    ("student19", "HV019", "Dương Quốc Huy", "B1", "2004-09-15", "Nam", "0904444019", "huy.duong@gmail.com", "Đánh giá đầu vào", [2, 4, 6], "17:30-20:30"),
    ("student20", "HV020", "Lý Mỹ Linh", "B1", "2003-11-04", "Nữ", "0904444020", "linh.ly@gmail.com", "Chứng chỉ Cambridge PET B1", [2, 4, 6], "17:30-20:30"),
    ("student21", "HV021", "Mai Tiến Đạt", "B1", "2002-01-25", "Nam", "0904444021", "dat.mai@gmail.com", "Thi B1 đạt yêu cầu", [2, 4, 6], "17:30-20:30"),
    ("student22", "HV022", "Trịnh Khánh Huyền", "B1", "2003-05-18", "Nữ", "0904444022", "huyen.trinh@gmail.com", "Placement Test B1", [2, 4, 6], "17:30-20:30"),
    ("student23", "HV023", "Phan Tuấn Kiệt", "B1", "2001-10-12", "Nam", "0904444023", "kiet.phan@gmail.com", "Kiểm tra xếp lớp B1", [2, 4, 6], "17:30-20:30"),
    ("student24", "HV024", "Lâm Bích Loan", "B1", "2004-04-08", "Nữ", "0904444024", "loan.lam@gmail.com", "TOEIC Starter Test 420", [2, 4, 6], "17:30-20:30"),
    ("student25", "HV025", "Võ Minh Nhật", "B1", "2005-02-17", "Nam", "0904444025", "nhat.vo@gmail.com", "Kiểm tra đầu vào B1", [2, 4, 6], "17:30-20:30"),

    ("student26", "HV026", "Đoàn Kim Oanh", "A2", "2004-12-29", "Nữ", "0904444026", "oanh.doan@gmail.com", "Test đầu vào A2", [3, 5, 7], "19:00-21:00"),
    ("student27", "HV027", "Tạ Hoàng Phúc", "A2", "2003-08-14", "Nam", "0904444027", "phuc.ta@gmail.com", "Test đầu vào A2", [3, 5, 7], "19:00-21:00"),
    ("student28", "HV028", "Quách Thái Sơn", "A2", "2000-09-03", "Nam", "0904444028", "son.quach@gmail.com", "Test đầu vào A2", [3, 5, 7], "19:00-21:00"),
    ("student29", "HV029", "Nghiêm Thu Trang", "A2", "2001-03-27", "Nữ", "0904444029", "trang.nghiem@gmail.com", "Test đầu vào A2", [3, 5, 7], "19:00-21:00"),
    ("student30", "HV030", "Lưu Quang Vinh", "A2", "1999-11-19", "Nam", "0904444030", "vinh.luu@gmail.com", "Test đầu vào A2", [3, 5, 7], "19:00-21:00"),
    ("student31", "HV031", "Nguyễn Gia Bảo", "A2", "2003-06-15", "Nam", "0904444031", "giabao.nguyen@gmail.com", "Test đầu vào A2", [3, 5, 7], "19:00-21:00"),
    ("student32", "HV032", "Trần Cẩm Tú", "A2", "2002-09-22", "Nữ", "0904444032", "camtu.tran@gmail.com", "Test đầu vào A2", [3, 5, 7], "19:00-21:00"),
    ("student33", "HV033", "Lê Khánh An", "A2", "2004-03-11", "Nữ", "0904444033", "khanhan.le@gmail.com", "Test đầu vào A2", [3, 5, 7], "19:00-21:00"),
    ("student34", "HV034", "Phạm Minh Đức", "A2", "2001-07-04", "Nam", "0904444034", "minhduc.pham@gmail.com", "Test đầu vào A2", [3, 5, 7], "19:00-21:00"),
    ("student35", "HV035", "Hoàng Diệu Linh", "A2", "2002-11-18", "Nữ", "0904444035", "dieulinh.hoang@gmail.com", "Test đầu vào A2", [3, 5, 7], "19:00-21:00"),
    ("student36", "HV036", "Vũ Tuấn Anh", "A2", "2000-01-30", "Nam", "0904444036", "tuananh.vu@gmail.com", "Test đầu vào A2", [3, 5, 7], "19:00-21:00"),
    ("student37", "HV037", "Đỗ Ngọc Diệp", "A2", "2003-10-14", "Nữ", "0904444037", "ngocdiep.do@gmail.com", "Test đầu vào A2", [3, 5, 7], "19:00-21:00"),

    ("student38", "HV038", "Bùi Hải Nam", "B1", "2001-08-12", "Nam", "0904444038", "hainam.bui@gmail.com", "Phỏng vấn Speaking B1", [2, 4, 6], "19:00-21:00"),
    ("student39", "HV039", "Ngô Thảo Vy", "B1", "2002-04-25", "Nữ", "0904444039", "thaovy.ngo@gmail.com", "Phỏng vấn Speaking B1", [2, 4, 6], "19:00-21:00"),
    ("student40", "HV040", "Dương Văn Thành", "B1", "2000-12-01", "Nam", "0904444040", "vanthanh.duong@gmail.com", "Phỏng vấn Speaking B1", [2, 4, 6], "19:00-21:00"),
    ("student41", "HV041", "Lý Gia Huy", "B1", "2003-05-19", "Nam", "0904444041", "giahuy.ly@gmail.com", "Phỏng vấn Speaking B1", [2, 4, 6], "19:00-21:00"),
    ("student42", "HV042", "Mai Phương Thảo", "B1", "2002-02-14", "Nữ", "0904444042", "phuongthao.mai@gmail.com", "Phỏng vấn Speaking B1", [2, 4, 6], "19:00-21:00"),
    ("student43", "HV043", "Trịnh Minh Khang", "B1", "2001-09-09", "Nam", "0904444043", "minhkhang.trinh@gmail.com", "Phỏng vấn Speaking B1", [2, 4, 6], "19:00-21:00"),
    ("student44", "HV044", "Phan Yến Nhi", "B1", "2004-06-30", "Nữ", "0904444044", "yennhi.phan@gmail.com", "Phỏng vấn Speaking B1", [2, 4, 6], "19:00-21:00"),
    ("student45", "HV045", "Lâm Tấn Phát", "B1", "1999-10-05", "Nam", "0904444045", "tanphat.lam@gmail.com", "Phỏng vấn Speaking B1", [2, 4, 6], "19:00-21:00"),

    ("student46", "HV046", "Võ Thu Hằng", "A1", "2004-01-20", "Nữ", "0904444046", "thuhang.vo@gmail.com", "Mất gốc tiếng Anh", [3, 5], "17:30-19:30"),
    ("student47", "HV047", "Đoàn Hữu Phước", "A1", "2003-07-16", "Nam", "0904444047", "huuphuoc.doan@gmail.com", "Mất gốc tiếng Anh", [3, 5], "17:30-19:30"),
    ("student48", "HV048", "Tạ Thanh Tùng", "A1", "2002-11-28", "Nam", "0904444048", "thanhtung.ta@gmail.com", "Mất gốc tiếng Anh", [3, 5], "17:30-19:30"),
    ("student49", "HV049", "Quách Ánh Tuyết", "A1", "2005-03-08", "Nữ", "0904444049", "anhtuyet.quach@gmail.com", "Mất gốc tiếng Anh", [3, 5], "17:30-19:30"),
    ("student50", "HV050", "Nghiêm Bảo Trâm", "A1", "2004-08-19", "Nữ", "0904444050", "baotram.nghiem@gmail.com", "Mất gốc tiếng Anh", [3, 5], "17:30-19:30"),

    ("student51", "HV051", "Lưu Thế Hùng", "B2", "1999-04-12", "Nam", "0904444051", "thehung.luu@gmail.com", "IELTS 6.5 mock test", [2, 4, 6], "18:00-21:00"),
    ("student52", "HV052", "Nguyễn Thùy Trang", "B2", "2000-08-27", "Nữ", "0904444052", "thuytrang.nguyen@gmail.com", "IELTS 6.5 BC Certificate", [2, 4, 6], "18:00-21:00"),
    ("student53", "HV053", "Trần Anh Khoa", "B2", "2001-12-14", "Nam", "0904444053", "anhkhoa.tran@gmail.com", "IELTS 6.0 IDP Certificate", [2, 4, 6], "18:00-21:00"),
    ("student54", "HV054", "Lê Diễm Quỳnh", "B2", "2002-06-03", "Nữ", "0904444054", "diemquynh.le@gmail.com", "IELTS 6.5 mock test", [2, 4, 6], "18:00-21:00"),
]

students_code = "const studentData = [\n"
for s in students:
    students_code += f"    {{ user: '{s[0]}', ma: '{s[1]}', ten: '{s[2]}', cefr: TrinhDoCEFR.{s[3]}, dob: '{s[4]}', gender: '{s[5]}', phone: '{s[6]}', email: '{s[7]}', source: '{s[8]}', schedule: {{ thu: {s[9]}, gio: '{s[10]}' }} }},\n"
students_code += "  ];"

seed_ts_content = f'''import {{
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
}} from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {{
  console.log('🌱 Bắt đầu nạp SIÊU DỮ LIỆU MẪU TOÀN DIỆN (10 Giảng viên, 54 Học viên, Lớp ĐẠT SĨ SỐ TỐI ĐA 25/25, Đủ ca ĐẠT/KHÔNG ĐẠT/ĐANG HỌC) cho ETC English Center...\\n');

  // Mật khẩu mặc định cho toàn bộ tài khoản: 123456
  const defaultPassword = await argon2.hash('123456');

  // ============================================================================
  // 1. NGƯỜI DÙNG & HỒ SƠ (Quản lý, Giáo viên, Tư vấn viên, Học viên)
  // ============================================================================

  // 1.1 Quản lý (Admin)
  const adminUser = await prisma.nguoiDung.upsert({{
    where: {{ tenDangNhap: 'admin01' }},
    update: {{ matKhauMaHoa: defaultPassword }},
    create: {{
      tenDangNhap: 'admin01',
      matKhauMaHoa: defaultPassword,
      vaiTro: VaiTro.QUAN_LY,
      email: 'admin@etc-english.vn',
      soDienThoai: '0901111001',
    }},
  }});
  console.log(`✅ Admin: ${{adminUser.tenDangNhap}}`);

  // 1.2 Giáo viên (10 Giảng viên chuyên môn sâu)
  const teachersData = [
    {{ user: 'teacher01', ma: 'GV001', ten: 'Cô Nguyễn Thị Lan', chuyenMon: 'IELTS Academic, Ngữ Pháp Nâng Cao', bangCap: 'Thạc sĩ Ngôn ngữ Anh - ĐH Ngoại ngữ Hà Nội (IELTS 8.5)', email: 'nguyen.thi.lan@etc-english.vn', phone: '0902222001' }},
    {{ user: 'teacher02', ma: 'GV002', ten: 'Thầy Trần Văn Minh', chuyenMon: 'TOEIC L&R, Tiếng Anh Giao Tiếp Thực Chiến', bangCap: 'Cử nhân Sư phạm Tiếng Anh - ĐH Sư phạm TP.HCM (TOEIC 985)', email: 'tran.van.minh@etc-english.vn', phone: '0902222002' }},
    {{ user: 'teacher03', ma: 'GV003', ten: 'Thầy Vũ Hoàng Nam', chuyenMon: 'Business English, Phản Xạ & Phát Âm IPA', bangCap: 'Chứng chỉ CELTA Cambridge, Tốt nghiệp ĐH Ngoại Thương', email: 'vu.hoang.nam@etc-english.vn', phone: '0902222003' }},
    {{ user: 'teacher04', ma: 'GV004', ten: 'Cô Emily Brown', chuyenMon: 'Native English Speaking, Pronunciation & Presentation', bangCap: 'Master of Arts in TESOL - University of Sydney', email: 'emily.brown@etc-english.vn', phone: '0902222004' }},
    {{ user: 'teacher05', ma: 'GV005', ten: 'Thầy Lê Anh Tuấn', chuyenMon: 'IELTS Writing & Speaking Chuyên Sâu', bangCap: 'IELTS 8.0, Cử nhân Sư phạm Tiếng Anh ĐH Quốc Gia', email: 'le.anh.tuan@etc-english.vn', phone: '0902222005' }},
    {{ user: 'teacher06', ma: 'GV006', ten: 'Cô Phạm Thu Hà', chuyenMon: 'Tiếng Anh Giao Tiếp Cơ Bản & Phát Âm Chuẩn', bangCap: 'Chứng chỉ TESOL 120h, Cử nhân ĐH Hà Nội', email: 'pham.thu.ha@etc-english.vn', phone: '0902222006' }},
    {{ user: 'teacher07', ma: 'GV007', ten: 'Thầy Đặng Quốc Bảo', chuyenMon: 'Luyện Thi TOEIC 4 Kỹ Năng Cấp Tốc', bangCap: 'TOEIC 960, Cử nhân Tài chính Quốc tế', email: 'dang.quoc.bao@etc-english.vn', phone: '0902222007' }},
    {{ user: 'teacher08', ma: 'GV008', ten: 'Cô Sarah Jenkins', chuyenMon: 'Cambridge FCE/CAE & Academic Writing', bangCap: 'Cambridge DELTA, University of Oxford Alumni', email: 'sarah.jenkins@etc-english.vn', phone: '0902222008' }},
    {{ user: 'teacher09', ma: 'GV009', ten: 'Thầy Hoàng Minh Đức', chuyenMon: 'Ngữ Pháp Nền Tảng & Luyện Đề Chuyên Ngữ', bangCap: 'Thạc sĩ Lý luận và Phương pháp Dạy học Tiếng Anh', email: 'hoang.minh.duc@etc-english.vn', phone: '0902222009' }},
    {{ user: 'teacher10', ma: 'GV010', ten: 'Cô Đỗ Mai Phương', chuyenMon: 'Tiếng Anh Tổng Quát & Giao Tiếp Phản Xạ', bangCap: 'Cử nhân Ngôn ngữ Anh ĐH Ngoại Ngữ', email: 'do.mai.phuong@etc-english.vn', phone: '0902222010' }},
  ];

  const teacherProfiles: Record<string, any> = {{}};

  for (const t of teachersData) {{
    const u = await prisma.nguoiDung.upsert({{
      where: {{ tenDangNhap: t.user }},
      update: {{ matKhauMaHoa: defaultPassword }},
      create: {{
        tenDangNhap: t.user,
        matKhauMaHoa: defaultPassword,
        vaiTro: VaiTro.GIAO_VIEN,
        email: t.email,
        soDienThoai: t.phone,
      }},
    }});

    const p = await prisma.hoSoGiaoVien.upsert({{
      where: {{ maGiaoVien: t.ma }},
      update: {{ nguoiDungId: u.id, trangThai: TrangThaiGiaoVien.DANG_LAM_VIEC }},
      create: {{
        nguoiDungId: u.id,
        maGiaoVien: t.ma,
        hoTen: t.ten,
        chuyenMon: t.chuyenMon,
        bangCap: t.bangCap,
        trangThai: TrangThaiGiaoVien.DANG_LAM_VIEC,
      }},
    }});
    teacherProfiles[t.user] = p;
  }}
  console.log('✅ Đã nạp 10 Giảng viên: GV001 → GV010');

  // 1.3 Tư vấn viên (2 Nhân viên Tuyển sinh / Thu ngân)
  const staffData = [
    {{ user: 'staff01', ten: 'Nguyễn Thị Thu Thảo', email: 'nguyen.thao@etc-english.vn', phone: '0903333001' }},
    {{ user: 'staff02', ten: 'Hoàng Kim Ngân', email: 'hoang.ngan@etc-english.vn', phone: '0903333002' }},
  ];

  const staffUsers: Record<string, any> = {{}};
  for (const s of staffData) {{
    const su = await prisma.nguoiDung.upsert({{
      where: {{ tenDangNhap: s.user }},
      update: {{ matKhauMaHoa: defaultPassword }},
      create: {{
        tenDangNhap: s.user,
        matKhauMaHoa: defaultPassword,
        vaiTro: VaiTro.TU_VAN_VIEN,
        email: s.email,
        soDienThoai: s.phone,
      }},
    }});
    staffUsers[s.user] = su;
  }}
  console.log('✅ Đã nạp 2 Tư vấn viên: staff01, staff02');

  // 1.4 Học viên (54 Học viên chuẩn CEFR A1 → C1)
  {students_code}

  const studentProfiles: Record<string, any> = {{}};

  for (const s of studentData) {{
    const u = await prisma.nguoiDung.upsert({{
      where: {{ tenDangNhap: s.user }},
      update: {{ matKhauMaHoa: defaultPassword }},
      create: {{
        tenDangNhap: s.user,
        matKhauMaHoa: defaultPassword,
        vaiTro: VaiTro.HOC_VIEN,
        email: s.email,
        soDienThoai: s.phone,
      }},
    }});

    const p = await prisma.hoSoHocVien.upsert({{
      where: {{ maHocVien: s.ma }},
      update: {{ nguoiDungId: u.id }},
      create: {{
        nguoiDungId: u.id,
        maHocVien: s.ma,
        hoTen: s.ten,
        ngaySinh: new Date(s.dob),
        gioiTinh: s.gender,
        trinhDoCEFR: s.cefr,
        nguonDanhGia: s.source,
        lichRanhJson: s.schedule,
        trangThai: TrangThaiHocVien.DANG_HOC,
      }},
    }});
    studentProfiles[s.user] = p;
  }}
  console.log('✅ Đã nạp 54 Học viên: HV001 → HV054');

  // ============================================================================
  // 2. KHÓA HỌC (6 Khóa học chuẩn CEFR A1 → C1)
  // ============================================================================
  const course1 = await prisma.khoaHoc.upsert({{
    where: {{ maKhoaHoc: 'KH-ENG-A1' }},
    update: {{}},
    create: {{
      maKhoaHoc: 'KH-ENG-A1',
      tenKhoaHoc: 'Tiếng Anh Căn Bản Cho Người Mất Gốc (A1)',
      trinhDoYeuCau: TrinhDoCEFR.A1,
      thoiLuongGio: 45,
      hocPhi: 2200000,
      moTa: 'Xây dựng lại nền tảng phát âm chuẩn IPA, từ vựng đời sống và cấu trúc câu đơn giản.',
      trangThai: TrangThaiKhoaHoc.HOAT_DONG,
    }},
  }});

  const course2 = await prisma.khoaHoc.upsert({{
    where: {{ maKhoaHoc: 'KH-TOEIC-A2' }},
    update: {{}},
    create: {{
      maKhoaHoc: 'KH-TOEIC-A2',
      tenKhoaHoc: 'TOEIC Starter 450+ (A2 → B1)',
      trinhDoYeuCau: TrinhDoCEFR.A2,
      thoiLuongGio: 48,
      hocPhi: 2800000,
      moTa: 'Rèn luyện kỹ năng Nghe - Đọc, bẫy đề thi TOEIC và từ vựng môi trường văn phòng.',
      trangThai: TrangThaiKhoaHoc.HOAT_DONG,
    }},
  }});

  const course3 = await prisma.khoaHoc.upsert({{
    where: {{ maKhoaHoc: 'KH-IELTS-B1' }},
    update: {{}},
    create: {{
      maKhoaHoc: 'KH-IELTS-B1',
      tenKhoaHoc: 'IELTS Intensive 5.5 - 6.0 (B1 → B2)',
      trinhDoYeuCau: TrinhDoCEFR.B1,
      thoiLuongGio: 60,
      hocPhi: 3500000,
      moTa: 'Trang bị toàn diện 4 kỹ năng Nghe, Nói, Đọc, Viết chuẩn học thuật IELTS.',
      trangThai: TrangThaiKhoaHoc.HOAT_DONG,
    }},
  }});

  const course4 = await prisma.khoaHoc.upsert({{
    where: {{ maKhoaHoc: 'KH-IELTS-B2' }},
    update: {{}},
    create: {{
      maKhoaHoc: 'KH-IELTS-B2',
      tenKhoaHoc: 'IELTS Master 6.5 - 7.5 (B2 → C1)',
      trinhDoYeuCau: TrinhDoCEFR.B2,
      thoiLuongGio: 72,
      hocPhi: 4800000,
      moTa: 'Chiến thuật nâng Band Speaking & Writing Task 2, phân tích bài luận chuyên sâu.',
      trangThai: TrangThaiKhoaHoc.HOAT_DONG,
    }},
  }});

  const course5 = await prisma.khoaHoc.upsert({{
    where: {{ maKhoaHoc: 'KH-COMM-B1' }},
    update: {{}},
    create: {{
      maKhoaHoc: 'KH-COMM-B1',
      tenKhoaHoc: 'Tiếng Anh Giao Tiếp & Thuyết Trình Doanh Nghiệp',
      trinhDoYeuCau: TrinhDoCEFR.B1,
      thoiLuongGio: 40,
      hocPhi: 3200000,
      moTa: 'Giao tiếp đàm phán, viết email thương mại và thuyết trình trước hội đồng đối tác.',
      trangThai: TrangThaiKhoaHoc.HOAT_DONG,
    }},
  }});

  const course6 = await prisma.khoaHoc.upsert({{
    where: {{ maKhoaHoc: 'KH-ADV-C1' }},
    update: {{}},
    create: {{
      maKhoaHoc: 'KH-ADV-C1',
      tenKhoaHoc: 'Tiếng Anh Học Thuật & Biên Dịch Chuyên Sâu (C1)',
      trinhDoYeuCau: TrinhDoCEFR.C1,
      thoiLuongGio: 80,
      hocPhi: 5500000,
      moTa: 'Biên phiên dịch văn bản học thuật quốc tế và nghiên cứu ngôn ngữ học.',
      trangThai: TrangThaiKhoaHoc.HOAT_DONG,
    }},
  }});
  console.log('✅ Đã nạp 6 Khóa học');

  // ============================================================================
  // 3. LỚP HỌC & THỜI KHÓA BIỂU
  // ============================================================================
  // Lớp 1: IELTS-B1-01 (LỚP ĐẠT SĨ SỐ TỐI ĐA 25/25 HỌC VIÊN - FULL 100%)
  const class1 = await prisma.lopHoc.upsert({{
    where: {{ maLopHoc: 'IELTS-B1-01' }},
    update: {{ siSoToiDa: 25, siSoHienTai: 25, trangThai: TrangThaiLopHoc.DANG_HOC }},
    create: {{
      khoaHocId: course3.id,
      maLopHoc: 'IELTS-B1-01',
      tenLopHoc: 'IELTS B1 Buổi tối (Thứ 2-4-6)',
      siSoToiDa: 25,
      siSoHienTai: 25,
      ngayBatDau: new Date('2024-09-16'),
      ngayKetThuc: new Date('2024-12-16'),
      phongHoc: 'Phòng Hội Trường A101',
      trangThai: TrangThaiLopHoc.DANG_HOC,
    }},
  }});

  // Lớp 2: TOEIC-A2-01 (12/25 HV - 48%)
  const class2 = await prisma.lopHoc.upsert({{
    where: {{ maLopHoc: 'TOEIC-A2-01' }},
    update: {{ siSoToiDa: 25, siSoHienTai: 12, trangThai: TrangThaiLopHoc.DANG_HOC }},
    create: {{
      khoaHocId: course2.id,
      maLopHoc: 'TOEIC-A2-01',
      tenLopHoc: 'TOEIC Starter Thứ 3-5-7',
      siSoToiDa: 25,
      siSoHienTai: 12,
      ngayBatDau: new Date('2024-09-17'),
      ngayKetThuc: new Date('2024-12-10'),
      phongHoc: 'Phòng B202',
      trangThai: TrangThaiLopHoc.DANG_HOC,
    }},
  }});

  // Lớp 3: COMM-B1-01 (8/15 HV - 53%)
  const class3 = await prisma.lopHoc.upsert({{
    where: {{ maLopHoc: 'COMM-B1-01' }},
    update: {{ siSoToiDa: 15, siSoHienTai: 8, trangThai: TrangThaiLopHoc.DANG_HOC }},
    create: {{
      khoaHocId: course5.id,
      maLopHoc: 'COMM-B1-01',
      tenLopHoc: 'Giao Tiếp Doanh Nghiệp Tối T2-4-6',
      siSoToiDa: 15,
      siSoHienTai: 8,
      ngayBatDau: new Date('2024-08-01'),
      ngayKetThuc: new Date('2024-11-01'),
      phongHoc: 'Phòng C301',
      trangThai: TrangThaiLopHoc.DANG_HOC,
    }},
  }});

  // Lớp 4: ENG-A1-01 (5/20 HV - 25%)
  const class4 = await prisma.lopHoc.upsert({{
    where: {{ maLopHoc: 'ENG-A1-01' }},
    update: {{ siSoToiDa: 20, siSoHienTai: 5, trangThai: TrangThaiLopHoc.DANG_MO_DANG_KY }},
    create: {{
      khoaHocId: course1.id,
      maLopHoc: 'ENG-A1-01',
      tenLopHoc: 'Tiếng Anh Căn Bản Cho Người Mới Bắt Đầu',
      siSoToiDa: 20,
      siSoHienTai: 5,
      ngayBatDau: new Date('2024-09-20'),
      ngayKetThuc: new Date('2024-12-20'),
      phongHoc: 'Phòng B201',
      trangThai: TrangThaiLopHoc.DANG_MO_DANG_KY,
    }},
  }});

  // Lớp 5: IELTS-B2-01 (4/15 HV - 27%)
  const class5 = await prisma.lopHoc.upsert({{
    where: {{ maLopHoc: 'IELTS-B2-01' }},
    update: {{ siSoToiDa: 15, siSoHienTai: 4, trangThai: TrangThaiLopHoc.DANG_HOC }},
    create: {{
      khoaHocId: course4.id,
      maLopHoc: 'IELTS-B2-01',
      tenLopHoc: 'IELTS Master 6.5+ Chuyên Sâu Tối T2-4-6',
      siSoToiDa: 15,
      siSoHienTai: 4,
      ngayBatDau: new Date('2024-08-15'),
      ngayKetThuc: new Date('2024-11-30'),
      phongHoc: 'Phòng A103',
      trangThai: TrangThaiLopHoc.DANG_HOC,
    }},
  }});

  // Lớp 6: IELTS-B1-02 (3/25 HV - 12%)
  const class6 = await prisma.lopHoc.upsert({{
    where: {{ maLopHoc: 'IELTS-B1-02' }},
    update: {{ siSoToiDa: 25, siSoHienTai: 3, trangThai: TrangThaiLopHoc.DANG_MO_DANG_KY }},
    create: {{
      khoaHocId: course3.id,
      maLopHoc: 'IELTS-B1-02',
      tenLopHoc: 'IELTS B1 Cuối Tuần (Thứ 7 - CN)',
      siSoToiDa: 25,
      siSoHienTai: 3,
      ngayBatDau: new Date('2024-10-05'),
      ngayKetThuc: new Date('2025-01-05'),
      phongHoc: 'Phòng A102',
      trangThai: TrangThaiLopHoc.DANG_MO_DANG_KY,
    }},
  }});
  console.log('✅ Đã nạp 6 Lớp học (Bao gồm lớp IELTS-B1-01 ĐẠT SĨ SỐ TỐI ĐA 25/25 HV)');

  // Lịch học (Schedules)
  const schedules = [
    {{ lopId: class1.id, thu: 2, bd: '17:30:00', kt: '20:30:00', phong: 'Phòng Hội Trường A101' }},
    {{ lopId: class1.id, thu: 4, bd: '17:30:00', kt: '20:30:00', phong: 'Phòng Hội Trường A101' }},
    {{ lopId: class1.id, thu: 6, bd: '17:30:00', kt: '20:30:00', phong: 'Phòng Hội Trường A101' }},
    {{ lopId: class2.id, thu: 3, bd: '19:00:00', kt: '21:00:00', phong: 'Phòng B202' }},
    {{ lopId: class2.id, thu: 5, bd: '19:00:00', kt: '21:00:00', phong: 'Phòng B202' }},
    {{ lopId: class2.id, thu: 7, bd: '19:00:00', kt: '21:00:00', phong: 'Phòng B202' }},
    {{ lopId: class3.id, thu: 2, bd: '19:00:00', kt: '21:00:00', phong: 'Phòng C301' }},
    {{ lopId: class3.id, thu: 4, bd: '19:00:00', kt: '21:00:00', phong: 'Phòng C301' }},
    {{ lopId: class3.id, thu: 6, bd: '19:00:00', kt: '21:00:00', phong: 'Phòng C301' }},
    {{ lopId: class4.id, thu: 3, bd: '17:30:00', kt: '19:30:00', phong: 'Phòng B201' }},
    {{ lopId: class4.id, thu: 5, bd: '17:30:00', kt: '19:30:00', phong: 'Phòng B201' }},
    {{ lopId: class5.id, thu: 2, bd: '18:00:00', kt: '21:00:00', phong: 'Phòng A103' }},
    {{ lopId: class5.id, thu: 4, bd: '18:00:00', kt: '21:00:00', phong: 'Phòng A103' }},
    {{ lopId: class6.id, thu: 7, bd: '08:30:00', kt: '11:30:00', phong: 'Phòng A102' }},
    {{ lopId: class6.id, thu: 8, bd: '08:30:00', kt: '11:30:00', phong: 'Phòng A102' }},
  ];

  for (const sc of schedules) {{
    await prisma.lichHoc.upsert({{
      where: {{
        lopHocId_thuTrongTuan_gioBatDau: {{
          lopHocId: sc.lopId,
          thuTrongTuan: sc.thu,
          gioBatDau: new Date(`1970-01-01T${{sc.bd}}`),
        }},
      }},
      update: {{}},
      create: {{
        lopHocId: sc.lopId,
        thuTrongTuan: sc.thu,
        gioBatDau: new Date(`1970-01-01T${{sc.bd}}`),
        gioKetThuc: new Date(`1970-01-01T${{sc.kt}}`),
        phongHoc: sc.phong,
      }},
    }});
  }}
  console.log('✅ Đã nạp Thời khóa biểu chi tiết');

  // ============================================================================
  // 4. PHÂN CÔNG GIẢNG VIÊN (PhanCongGiaoVien)
  // ============================================================================
  const assignments = [
    {{ lopId: class1.id, gvId: teacherProfiles['teacher01'].id, vaitro: VaiTroPhanCong.CHINH }},
    {{ lopId: class6.id, gvId: teacherProfiles['teacher01'].id, vaitro: VaiTroPhanCong.CHINH }},
    {{ lopId: class2.id, gvId: teacherProfiles['teacher02'].id, vaitro: VaiTroPhanCong.CHINH }},
    {{ lopId: class3.id, gvId: teacherProfiles['teacher03'].id, vaitro: VaiTroPhanCong.CHINH }},
    {{ lopId: class4.id, gvId: teacherProfiles['teacher06'].id, vaitro: VaiTroPhanCong.CHINH }},
    {{ lopId: class5.id, gvId: teacherProfiles['teacher05'].id, vaitro: VaiTroPhanCong.CHINH }},
  ];

  for (const asg of assignments) {{
    await prisma.phanCongGiaoVien.upsert({{
      where: {{
        lopHocId_giaoVienId: {{
          lopHocId: asg.lopId,
          giaoVienId: asg.gvId,
        }},
      }},
      update: {{}},
      create: {{
        lopHocId: asg.lopId,
        giaoVienId: asg.gvId,
        vaiTroPhanCong: asg.vaitro,
        trangThai: TrangThaiPhanCong.DANG_PHU_TRACH,
      }},
    }});
  }}
  console.log('✅ Đã phân công Giảng viên phụ trách các lớp');

  // ============================================================================
  // 5. ĐĂNG KÝ HỌC, HÓA ĐƠN & THANH TOÁN (Enrollments, Invoices, Payments)
  // ============================================================================
  await prisma.thanhToan.deleteMany({{}});
  await prisma.hoaDon.deleteMany({{}});
  await prisma.dangKyHoc.deleteMany({{}});

  // Helper create enroll + invoice + payment
  const enrollAndPay = async (params: {{
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
  }}) => {{
    const dk = await prisma.dangKyHoc.create({{
      data: {{
        hocVienId: params.studentId,
        lopHocId: params.lopId,
        ngayDangKy: new Date('2024-09-01'),
        trangThai: params.enrollStatus,
      }},
    }});

    const hd = await prisma.hoaDon.create({{
      data: {{
        dangKyHocId: dk.id,
        hocVienId: params.studentId,
        maHoaDon: params.invoiceCode,
        soTienPhaiTra: params.amountDue,
        soTienDaTra: params.amountPaid,
        hanThanhToan: new Date('2024-09-15'),
        trangThai: params.invoiceStatus,
      }},
    }});

    if (params.amountPaid > 0 && params.payCode && params.payMethod) {{
      await prisma.thanhToan.create({{
        data: {{
          hoaDonId: hd.id,
          maGiaoDich: params.payCode,
          soTien: params.amountPaid,
          phuongThuc: params.payMethod,
          thoiGianThanhToan: new Date('2024-09-05'),
          nguoiThuId: params.staffUserId || staffUsers['staff01'].id,
          trangThai: TrangThaiThanhToan.THANH_CONG,
        }},
      }});
    }}
  }};

  // 5.1 Lớp IELTS-B1-01 (ĐỦ 25 HỌC VIÊN TỐI ĐA: student01 -> student25) - Thu ngân: staff01
  const class1Students = Array.from({{ length: 25 }}, (_, i) => `student${{String(i + 1).padStart(2, '0')}}`);
  let idx = 1;
  for (const sUser of class1Students) {{
    const sProfile = studentProfiles[sUser];
    await enrollAndPay({{
      lopId: class1.id,
      studentId: sProfile.id,
      staffUserId: staffUsers['staff01'].id,
      enrollStatus: TrangThaiDangKy.DA_XAC_NHAN,
      invoiceCode: `HD-IELTS-B1-${{String(idx).padStart(3, '0')}}`,
      amountDue: 3500000,
      amountPaid: 3500000,
      invoiceStatus: TrangThaiHoaDon.DA_HOAN_THANH,
      payCode: `TX-IELTS-B1-${{String(idx).padStart(3, '0')}}`,
      payMethod: idx % 2 === 0 ? PhuongThucThanhToan.TIEN_MAT : PhuongThucThanhToan.CHUYEN_KHOAN,
    }});
    idx++;
  }}

  // 5.2 Lớp TOEIC-A2-01 (12 học viên: student26 -> student37) - Thu ngân: staff02
  const class2Students = Array.from({{ length: 12 }}, (_, i) => `student${{String(i + 26).padStart(2, '0')}}`);
  idx = 1;
  for (const sUser of class2Students) {{
    const sProfile = studentProfiles[sUser];
    await enrollAndPay({{
      lopId: class2.id,
      studentId: sProfile.id,
      staffUserId: staffUsers['staff02'].id,
      enrollStatus: TrangThaiDangKy.DA_XAC_NHAN,
      invoiceCode: `HD-TOEIC-A2-${{String(idx).padStart(3, '0')}}`,
      amountDue: 2800000,
      amountPaid: 2800000,
      invoiceStatus: TrangThaiHoaDon.DA_HOAN_THANH,
      payCode: `TX-TOEIC-A2-${{String(idx).padStart(3, '0')}}`,
      payMethod: PhuongThucThanhToan.TIEN_MAT,
    }});
    idx++;
  }}

  // 5.3 Lớp COMM-B1-01 (8 học viên: student38 -> student45) - Thu ngân: staff01
  const class3Students = Array.from({{ length: 8 }}, (_, i) => `student${{String(i + 38).padStart(2, '0')}}`);
  idx = 1;
  for (const sUser of class3Students) {{
    const sProfile = studentProfiles[sUser];
    await enrollAndPay({{
      lopId: class3.id,
      studentId: sProfile.id,
      staffUserId: staffUsers['staff01'].id,
      enrollStatus: TrangThaiDangKy.DA_XAC_NHAN,
      invoiceCode: `HD-COMM-B1-${{String(idx).padStart(3, '0')}}`,
      amountDue: 3200000,
      amountPaid: 3200000,
      invoiceStatus: TrangThaiHoaDon.DA_HOAN_THANH,
      payCode: `TX-COMM-B1-${{String(idx).padStart(3, '0')}}`,
      payMethod: PhuongThucThanhToan.CHUYEN_KHOAN,
    }});
    idx++;
  }}

  // 5.4 Lớp ENG-A1-01 (5 học viên: student46 -> student50) - Thu ngân: staff02
  const class4Students = Array.from({{ length: 5 }}, (_, i) => `student${{String(i + 46).padStart(2, '0')}}`);
  idx = 1;
  for (const sUser of class4Students) {{
    const sProfile = studentProfiles[sUser];
    await enrollAndPay({{
      lopId: class4.id,
      studentId: sProfile.id,
      staffUserId: staffUsers['staff02'].id,
      enrollStatus: TrangThaiDangKy.DA_XAC_NHAN,
      invoiceCode: `HD-ENG-A1-${{String(idx).padStart(3, '0')}}`,
      amountDue: 2200000,
      amountPaid: 2200000,
      invoiceStatus: TrangThaiHoaDon.DA_HOAN_THANH,
      payCode: `TX-ENG-A1-${{String(idx).padStart(3, '0')}}`,
      payMethod: PhuongThucThanhToan.TIEN_MAT,
    }});
    idx++;
  }}

  // 5.5 Lớp IELTS-B2-01 (4 học viên: student51 -> student54) - Thu ngân: staff02
  const class5Students = Array.from({{ length: 4 }}, (_, i) => `student${{String(i + 51).padStart(2, '0')}}`);
  idx = 1;
  for (const sUser of class5Students) {{
    const sProfile = studentProfiles[sUser];
    await enrollAndPay({{
      lopId: class5.id,
      studentId: sProfile.id,
      staffUserId: staffUsers['staff02'].id,
      enrollStatus: TrangThaiDangKy.DA_XAC_NHAN,
      invoiceCode: `HD-IELTS-B2-${{String(idx).padStart(3, '0')}}`,
      amountDue: 4800000,
      amountPaid: 4800000,
      invoiceStatus: TrangThaiHoaDon.DA_HOAN_THANH,
      payCode: `TX-IELTS-B2-${{String(idx).padStart(3, '0')}}`,
      payMethod: PhuongThucThanhToan.CHUYEN_KHOAN,
    }});
    idx++;
  }}

  // 5.6 Lớp IELTS-B1-02 (3 học viên chờ thanh toán: student04, student10, student20)
  const class6Students = ['student04', 'student10', 'student20'];
  idx = 1;
  for (const sUser of class6Students) {{
    const sProfile = studentProfiles[sUser];
    await enrollAndPay({{
      lopId: class6.id,
      studentId: sProfile.id,
      enrollStatus: TrangThaiDangKy.CHO_THANH_TOAN,
      invoiceCode: `HD-IELTS-B1-02-${{String(idx).padStart(3, '0')}}`,
      amountDue: 3500000,
      amountPaid: 0,
      invoiceStatus: TrangThaiHoaDon.CHUA_THANH_TOAN,
    }});
    idx++;
  }}
  console.log('✅ Đã nạp Đăng ký học, Hóa đơn & Thanh toán đầy đủ');

  // ============================================================================
  // 6. BUỔI HỌC & ĐIỂM DANH (BuoiHoc & BanGhiDiemDanh)
  // ============================================================================
  await prisma.banGhiDiemDanh.deleteMany({{}});
  await prisma.buoiHoc.deleteMany({{}});
  
  // Tạo 8 buổi học cho lớp IELTS-B1-01
  const class1Sessions = [
    {{ so: 1, ngay: '2024-09-16', tieude: 'Orientation & Diagnostic Placement Test' }},
    {{ so: 2, ngay: '2024-09-18', tieude: 'Listening Section 1 & 2 Strategies' }},
    {{ so: 3, ngay: '2024-09-20', tieude: 'Reading Skimming & Scanning Techniques' }},
    {{ so: 4, ngay: '2024-09-23', tieude: 'Speaking Part 1 Fluency & Pronunciation' }},
    {{ so: 5, ngay: '2024-09-25', tieude: 'Writing Task 1 Overview & Line Graphs' }},
    {{ so: 6, ngay: '2024-09-27', tieude: 'Mid-term Assessment & Teacher Feedback' }},
    {{ so: 7, ngay: '2024-09-30', tieude: 'Writing Task 2 Essay Structure & Ideas' }},
    {{ so: 8, ngay: '2024-10-02', tieude: 'Final Full Mock Test & Band Score Evaluation' }},
  ];

  const class1TeacherId = teacherProfiles['teacher01'].id;
  for (const sess of class1Sessions) {{
    const b = await prisma.buoiHoc.create({{
      data: {{
        lopHocId: class1.id,
        soThuTu: sess.so,
        ngayHoc: new Date(sess.ngay),
        gioBatDau: new Date('1970-01-01T17:30:00'),
        gioKetThuc: new Date('1970-01-01T20:30:00'),
        chuDe: sess.tieude,
        trangThai: TrangThaiBuoiHoc.DA_KET_THUC,
      }},
    }});

    // Điểm danh cho tất cả 25 học viên trong lớp
    for (const sUser of class1Students) {{
      const sProfile = studentProfiles[sUser];
      const isAbsent = (sUser === 'student15' && (sess.so === 3 || sess.so === 4 || sess.so === 6)) || 
                       (sUser === 'student17' && (sess.so === 2 || sess.so === 5)) ||
                       (sUser === 'student23' && (sess.so === 1 || sess.so === 7));
      const isLate = (sUser === 'student12' && sess.so === 2) || (sUser === 'student25' && sess.so === 4);
      const attStatus = isAbsent ? TrangThaiDiemDanh.VANG : isLate ? TrangThaiDiemDanh.DI_MUON : TrangThaiDiemDanh.CO_MAT;

      await prisma.banGhiDiemDanh.create({{
        data: {{
          buoiHocId: b.id,
          hocVienId: sProfile.id,
          giaoVienDiemDanhId: class1TeacherId,
          trangThai: attStatus,
          ghiChu: isAbsent ? 'Vắng không phép' : isLate ? 'Kẹt xe đến muộn 15p' : 'Đi học đúng giờ',
        }},
      }});
    }}
  }}

  // Tạo 6 buổi học cho lớp TOEIC-A2-01
  const class2Sessions = [
    {{ so: 1, ngay: '2024-09-17', tieude: 'Part 1 Photographs & Vocabulary' }},
    {{ so: 2, ngay: '2024-09-19', tieude: 'Part 2 Question - Response' }},
    {{ so: 3, ngay: '2024-09-21', tieude: 'Part 5 Incomplete Sentences Grammar' }},
    {{ so: 4, ngay: '2024-09-24', tieude: 'Mid-term Quiz & Listening Part 3' }},
    {{ so: 5, ngay: '2024-09-26', tieude: 'Part 6 Text Completion' }},
    {{ so: 6, ngay: '2024-09-28', tieude: 'Final Review & Practice Test' }},
  ];

  const class2TeacherId = teacherProfiles['teacher02'].id;
  for (const sess of class2Sessions) {{
    const b = await prisma.buoiHoc.create({{
      data: {{
        lopHocId: class2.id,
        soThuTu: sess.so,
        ngayHoc: new Date(sess.ngay),
        gioBatDau: new Date('1970-01-01T19:00:00'),
        gioKetThuc: new Date('1970-01-01T21:00:00'),
        chuDe: sess.tieude,
        trangThai: TrangThaiBuoiHoc.DA_KET_THUC,
      }},
    }});

    for (const sUser of class2Students) {{
      const sProfile = studentProfiles[sUser];
      const isAbsent = sUser === 'student37' && (sess.so === 3 || sess.so === 5);
      const attStatus = isAbsent ? TrangThaiDiemDanh.VANG : TrangThaiDiemDanh.CO_MAT;

      await prisma.banGhiDiemDanh.create({{
        data: {{
          buoiHocId: b.id,
          hocVienId: sProfile.id,
          giaoVienDiemDanhId: class2TeacherId,
          trangThai: attStatus,
          ghiChu: isAbsent ? 'Vắng có phép' : 'Có mặt đầy đủ',
        }},
      }});
    }}
  }}
  console.log('✅ Đã nạp Buổi học & Bản ghi điểm danh');

  // ============================================================================
  // 7. BẢNG ĐIỂM & ĐÁNH GIÁ (KetQuaHocTap — 20% Chuyên cần, 30% Giữa kỳ, 50% Cuối kỳ)
  // Có đầy đủ ca ĐẠT (38 HV), KHÔNG ĐẠT (6 HV), và ĐANG HỌC GIỮA KHÓA (10 HV)
  // ============================================================================
  await prisma.ketQuaHocTap.deleteMany({{}});

  // Điểm số cho học viên lớp IELTS-B1-01 (25 học viên)
  const class1Grades = [
    // --- Nhóm ĐẠT (17 học viên) ---
    {{ user: 'student01', cc: 95.0, gk: 82.5, ck: 88.0, total: 87.75, note: 'Ngữ pháp tốt, phát âm chuẩn. Cần luyện thêm từ vựng Writing.', status: TrangThaiHoanThanh.DAT }},
    {{ user: 'student02', cc: 90.0, gk: 80.0, ck: 85.0, total: 84.5, note: 'Tác phong học tập nghiêm túc, giải đề cẩn thận.', status: TrangThaiHoanThanh.DAT }},
    {{ user: 'student03', cc: 92.0, gk: 86.0, ck: 88.0, total: 88.2, note: 'Phản xạ tốt, tự tin trong Speaking.', status: TrangThaiHoanThanh.DAT }},
    {{ user: 'student05', cc: 85.0, gk: 72.0, ck: 78.0, total: 77.6, note: 'Chăm chỉ, làm bài đầy đủ.', status: TrangThaiHoanThanh.DAT }},
    {{ user: 'student06', cc: 95.0, gk: 90.0, ck: 92.0, total: 92.0, note: 'Kiến thức học thuật chuyên sâu.', status: TrangThaiHoanThanh.DAT }},
    {{ user: 'student07', cc: 88.0, gk: 78.0, ck: 80.0, total: 81.0, note: 'Tiếp thu bài nhanh.', status: TrangThaiHoanThanh.DAT }},
    {{ user: 'student08', cc: 92.0, gk: 85.0, ck: 87.0, total: 87.4, note: 'Phát âm tự nhiên.', status: TrangThaiHoanThanh.DAT }},
    {{ user: 'student09', cc: 90.0, gk: 82.0, ck: 86.0, total: 85.6, note: 'Nắm vững cấu trúc bài thi IELTS.', status: TrangThaiHoanThanh.DAT }},
    {{ user: 'student11', cc: 90.0, gk: 80.0, ck: 85.0, total: 84.5, note: 'Tiếp thu bài nhanh, phản xạ lưu loát.', status: TrangThaiHoanThanh.DAT }},
    {{ user: 'student12', cc: 88.0, gk: 75.0, ck: 80.0, total: 80.1, note: 'Có tiến bộ rõ rệt ở kỹ năng Reading.', status: TrangThaiHoanThanh.DAT }},
    {{ user: 'student13', cc: 92.0, gk: 88.0, ck: 90.0, total: 89.8, note: 'Bài thi cuối kỳ xuất sắc, nắm chắc cấu trúc bài luận.', status: TrangThaiHoanThanh.DAT }},
    {{ user: 'student14', cc: 95.0, gk: 85.0, ck: 87.0, total: 88.0, note: 'Tác phong học tập gương mẫu, nhiệt tình trao đổi.', status: TrangThaiHoanThanh.DAT }},
    {{ user: 'student16', cc: 90.0, gk: 78.0, ck: 82.0, total: 82.4, note: 'Khả năng Nghe tốt, cần trau chuốt phần phát âm âm đuôi.', status: TrangThaiHoanThanh.DAT }},
    {{ user: 'student18', cc: 92.0, gk: 84.0, ck: 86.0, total: 86.6, note: 'Kỹ năng Writing mạch lạc, lập luận chặt chẽ.', status: TrangThaiHoanThanh.DAT }},
    {{ user: 'student21', cc: 88.0, gk: 76.0, ck: 80.0, total: 80.4, note: 'Hoàn thành tốt các kỹ năng đầu ra của khóa B1.', status: TrangThaiHoanThanh.DAT }},
    {{ user: 'student22', cc: 90.0, gk: 80.0, ck: 82.0, total: 83.0, note: 'Làm bài tập đầy đủ, tự tin trong giao tiếp.', status: TrangThaiHoanThanh.DAT }},
    {{ user: 'student24', cc: 92.0, gk: 85.0, ck: 88.0, total: 87.9, note: 'Xuất sắc, mục tiêu đạt IELTS 6.0+.', status: TrangThaiHoanThanh.DAT }},

    // --- Nhóm KHÔNG ĐẠT (3 Học viên rớt do vắng nhiều / điểm thi < 50đ) ---
    {{ user: 'student15', cc: 62.5, gk: 45.0, ck: 40.0, total: 46.0, note: 'Vắng 3/8 buổi (Chuyên cần 62.5% < 80%) và điểm thi dưới 50đ. Không đủ điều kiện hoàn thành khóa.', status: TrangThaiHoanThanh.KHONG_DAT }},
    {{ user: 'student17', cc: 75.0, gk: 42.0, ck: 44.0, total: 49.6, note: 'Chuyên cần dưới 80% và bài thi cuối kỳ không đạt chuẩn B1. Đề xuất học lại lớp tăng cường.', status: TrangThaiHoanThanh.KHONG_DAT }},
    {{ user: 'student23', cc: 70.0, gk: 40.0, ck: 48.0, total: 48.0, note: 'Điểm tổng kết dưới 50đ, không đủ điều kiện cấp chứng nhận hoàn thành.', status: TrangThaiHoanThanh.KHONG_DAT }},

    // --- Nhóm ĐANG HỌC (5 Học viên đang giữa khóa, chưa thi cuối kỳ) ---
    {{ user: 'student19', cc: 85.0, gk: 68.0, ck: null, total: null, note: 'Đang ở giai đoạn giữa khóa, điểm giữa kỳ đạt 68/100.', status: TrangThaiHoanThanh.CHUA_XEP_LOAI }},
    {{ user: 'student20', cc: 90.0, gk: 75.0, ck: null, total: null, note: 'Đang hoàn thành nửa chặng đường khóa học, chờ thi cuối kỳ.', status: TrangThaiHoanThanh.CHUA_XEP_LOAI }},
    {{ user: 'student25', cc: 80.0, gk: 70.0, ck: null, total: null, note: 'Đang theo học chương trình, tiến độ tích lũy ổn định.', status: TrangThaiHoanThanh.CHUA_XEP_LOAI }},
  ];

  for (const g of class1Grades) {{
    const sProfile = studentProfiles[g.user];
    await prisma.ketQuaHocTap.create({{
      data: {{
        lopHocId: class1.id,
        hocVienId: sProfile.id,
        diemChuyenCan: g.cc,
        diemGiuaKy: g.gk,
        diemCuoiKy: g.ck,
        diemTongKet: g.total,
        nhanXet: g.note,
        trangThaiHoanThanh: g.status,
      }},
    }});
  }}

  // Điểm số cho học viên lớp TOEIC-A2-01 (12 học viên)
  const class2Grades = [
    {{ user: 'student26', cc: 88.0, gk: 76.0, ck: 78.0, total: 79.4, note: 'Tiến độ làm bài thi nhanh và chính xác.', status: TrangThaiHoanThanh.DAT }},
    {{ user: 'student28', cc: 90.0, gk: 80.0, ck: 82.0, total: 83.0, note: 'Nắm chắc ngữ pháp cơ bản.', status: TrangThaiHoanThanh.DAT }},
    {{ user: 'student29', cc: 92.0, gk: 84.0, ck: 86.0, total: 86.6, note: 'Kỹ năng Nghe Part 2 & 3 tốt.', status: TrangThaiHoanThanh.DAT }},
    {{ user: 'student30', cc: 85.0, gk: 75.0, ck: 78.0, total: 78.5, note: 'Tiến bộ rõ rệt ở Part 5.', status: TrangThaiHoanThanh.DAT }},
    {{ user: 'student31', cc: 90.0, gk: 82.0, ck: 85.0, total: 85.1, note: 'Đạt mục tiêu TOEIC 500+.', status: TrangThaiHoanThanh.DAT }},
    {{ user: 'student32', cc: 88.0, gk: 78.0, ck: 80.0, total: 81.0, note: 'Làm bài thi cẩn thận.', status: TrangThaiHoanThanh.DAT }},
    {{ user: 'student33', cc: 92.0, gk: 86.0, ck: 88.0, total: 88.2, note: 'Nắm chắc từ vựng kinh tế văn phòng.', status: TrangThaiHoanThanh.DAT }},
    {{ user: 'student34', cc: 85.0, gk: 72.0, ck: 75.0, total: 76.1, note: 'Hoàn thành tốt khóa học.', status: TrangThaiHoanThanh.DAT }},
    {{ user: 'student35', cc: 90.0, gk: 80.0, ck: 84.0, total: 84.0, note: 'Phản xạ nghe hiểu tốt.', status: TrangThaiHoanThanh.DAT }},
    // 2 học viên KHÔNG ĐẠT lớp TOEIC
    {{ user: 'student27', cc: 75.0, gk: 40.0, ck: 42.0, total: 48.0, note: 'Điểm tổng kết dưới 50đ, chưa nắm vững cấu trúc đề TOEIC.', status: TrangThaiHoanThanh.KHONG_DAT }},
    {{ user: 'student37', cc: 60.0, gk: 45.0, ck: 40.0, total: 45.5, note: 'Vắng 2/6 buổi (Chuyên cần 60% < 80%) và điểm thi không đạt.', status: TrangThaiHoanThanh.KHONG_DAT }},
    // 1 học viên đang học
    {{ user: 'student36', cc: 85.0, gk: 70.0, ck: null, total: null, note: 'Đang theo học giữa khóa.', status: TrangThaiHoanThanh.CHUA_XEP_LOAI }},
  ];

  for (const g of class2Grades) {{
    const sProfile = studentProfiles[g.user];
    await prisma.ketQuaHocTap.create({{
      data: {{
        lopHocId: class2.id,
        hocVienId: sProfile.id,
        diemChuyenCan: g.cc,
        diemGiuaKy: g.gk,
        diemCuoiKy: g.ck,
        diemTongKet: g.total,
        nhanXet: g.note,
        trangThaiHoanThanh: g.status,
      }},
    }});
  }}

  // Điểm số cho học viên lớp COMM-B1-01 (8 học viên)
  const class3Grades = [
    {{ user: 'student38', cc: 90.0, gk: 85.0, ck: 86.0, total: 86.5, note: 'Thuyết trình tự tin, phản xạ tốt.', status: TrangThaiHoanThanh.DAT }},
    {{ user: 'student39', cc: 95.0, gk: 88.0, ck: 89.0, total: 89.9, note: 'Phát âm tự nhiên, đàm phán linh hoạt.', status: TrangThaiHoanThanh.DAT }},
    {{ user: 'student40', cc: 88.0, gk: 80.0, ck: 82.0, total: 82.6, note: 'Tham gia tương tác tích cực.', status: TrangThaiHoanThanh.DAT }},
    {{ user: 'student41', cc: 92.0, gk: 86.0, ck: 88.0, total: 88.2, note: 'Kỹ năng trình bày báo cáo lưu loát.', status: TrangThaiHoanThanh.DAT }},
    {{ user: 'student42', cc: 90.0, gk: 84.0, ck: 85.0, total: 85.7, note: 'Phản xạ đàm phán linh hoạt, giao tiếp tự tin.', status: TrangThaiHoanThanh.DAT }},
    {{ user: 'student43', cc: 92.0, gk: 85.0, ck: 87.0, total: 87.4, note: 'Kỹ năng thương thuyết tốt.', status: TrangThaiHoanThanh.DAT }},
    {{ user: 'student44', cc: 88.0, gk: 78.0, ck: 80.0, total: 81.0, note: 'Giao tiếp tự nhiên.', status: TrangThaiHoanThanh.DAT }},
    {{ user: 'student45', cc: 90.0, gk: 82.0, ck: 84.0, total: 84.6, note: 'Hoàn thành xuất sắc khóa giao tiếp B1.', status: TrangThaiHoanThanh.DAT }},
  ];

  for (const g of class3Grades) {{
    const sProfile = studentProfiles[g.user];
    await prisma.ketQuaHocTap.create({{
      data: {{
        lopHocId: class3.id,
        hocVienId: sProfile.id,
        diemChuyenCan: g.cc,
        diemGiuaKy: g.gk,
        diemCuoiKy: g.ck,
        diemTongKet: g.total,
        nhanXet: g.note,
        trangThaiHoanThanh: g.status,
      }},
    }});
  }}

  // Điểm số cho học viên lớp ENG-A1-01 (5 học viên)
  const class4Grades = [
    {{ user: 'student46', cc: 90.0, gk: 75.0, ck: 78.0, total: 79.5, note: 'Nắm vững phát âm IPA cơ bản.', status: TrangThaiHoanThanh.DAT }},
    {{ user: 'student47', cc: 85.0, gk: 70.0, ck: 72.0, total: 74.0, note: 'Tiến bộ vượt bậc từ mất gốc.', status: TrangThaiHoanThanh.DAT }},
    {{ user: 'student48', cc: 92.0, gk: 80.0, ck: 82.0, total: 83.4, note: 'Tự tin phát âm các từ đơn giản.', status: TrangThaiHoanThanh.DAT }},
    // 1 KHÔNG ĐẠT lớp A1
    {{ user: 'student49', cc: 70.0, gk: 40.0, ck: 42.0, total: 47.0, note: 'Chưa nắm vững quy tắc phát âm cơ bản, cần học lại.', status: TrangThaiHoanThanh.KHONG_DAT }},
    {{ user: 'student50', cc: 85.0, gk: 68.0, ck: null, total: null, note: 'Đang theo học nửa đầu khóa học.', status: TrangThaiHoanThanh.CHUA_XEP_LOAI }},
  ];

  for (const g of class4Grades) {{
    const sProfile = studentProfiles[g.user];
    await prisma.ketQuaHocTap.create({{
      data: {{
        lopHocId: class4.id,
        hocVienId: sProfile.id,
        diemChuyenCan: g.cc,
        diemGiuaKy: g.gk,
        diemCuoiKy: g.ck,
        diemTongKet: g.total,
        nhanXet: g.note,
        trangThaiHoanThanh: g.status,
      }},
    }});
  }}

  // Điểm số cho học viên lớp IELTS-B2-01 (4 học viên)
  const class5Grades = [
    {{ user: 'student51', cc: 95.0, gk: 90.0, ck: 92.0, total: 92.0, note: 'Trình độ IELTS tương đương 7.5, bài viết Task 2 chặt chẽ.', status: TrangThaiHoanThanh.DAT }},
    {{ user: 'student52', cc: 85.0, gk: 82.0, ck: 86.0, total: 84.6, note: 'Nắm vững chiến thuật làm bài, phản xạ Speaking lưu loát.', status: TrangThaiHoanThanh.DAT }},
    {{ user: 'student53', cc: 90.0, gk: 88.0, ck: 90.0, total: 89.4, note: 'Tác phong học thuật chuyên sâu, từ vựng phong phú.', status: TrangThaiHoanThanh.DAT }},
    {{ user: 'student54', cc: 92.0, gk: 85.0, ck: 88.0, total: 87.9, note: 'Lập luận sắc bén trong phần thi Speaking Part 3.', status: TrangThaiHoanThanh.DAT }},
  ];

  for (const g of class5Grades) {{
    const sProfile = studentProfiles[g.user];
    await prisma.ketQuaHocTap.create({{
      data: {{
        lopHocId: class5.id,
        hocVienId: sProfile.id,
        diemChuyenCan: g.cc,
        diemGiuaKy: g.gk,
        diemCuoiKy: g.ck,
        diemTongKet: g.total,
        nhanXet: g.note,
        trangThaiHoanThanh: g.status,
      }},
    }});
  }}

  console.log('✅ Đã nạp Bảng điểm chuẩn quy chế: 40 ĐẠT, 6 KHÔNG ĐẠT, 5 ĐANG HỌC');

  // ============================================================================
  // 8. AUDIT LOG AI (YeuCauAI)
  // ============================================================================
  await prisma.yeuCauAI.deleteMany({{}});
  await prisma.yeuCauAI.createMany({{
    data: [
      {{
        nguoiDungId: studentProfiles['student01'].nguoiDungId!,
        loaiChucNang: LoaiChucNangAI.TU_VAN_LOP,
        promptInput: 'Tư vấn lớp học cho học viên trình độ B1, lịch rảnh Thứ 2-4-6 tối, mục tiêu thi IELTS 6.5 trong 3 tháng',
        rawOutput: '[{{"maLopHoc": "IELTS-B1-01", "tenLopHoc": "IELTS B1 Buổi tối (Thứ 2-4-6)", "doTuongThich": 96, "lyDoPhuHop": "Trình độ B1 và lịch rảnh trùng khớp 100%."}}]',
        validatedOutputJson: [{{ maLopHoc: 'IELTS-B1-01', tenLopHoc: 'IELTS B1 Buổi tối (Thứ 2-4-6)', doTuongThich: 96 }}],
        trangThai: TrangThaiYeuCauAI.THANH_CONG,
        thoiGianXuLyMs: 1250,
      }},
      {{
        nguoiDungId: teacherProfiles['teacher01'].nguoiDungId!,
        loaiChucNang: LoaiChucNangAI.SINH_BAI_TAP,
        promptInput: 'Sinh 5 câu trắc nghiệm chủ đề Thì Hiện Tại Hoàn Thành chuẩn CEFR B1',
        rawOutput: '{{"chuDe": "Present Perfect", "trinhDo": "B1", "cauHoi": [...]}}',
        validatedOutputJson: {{ chuDe: 'Present Perfect', trinhDo: 'B1', cauHoi: [] }},
        trangThai: TrangThaiYeuCauAI.THANH_CONG,
        thoiGianXuLyMs: 2400,
      }},
      {{
        nguoiDungId: studentProfiles['student01'].nguoiDungId!,
        loaiChucNang: LoaiChucNangAI.TOM_TAT_TIEN_DO,
        promptInput: 'Tóm tắt tiến độ học tập cho học viên Lê Thị Hoa lớp IELTS-B1-01',
        rawOutput: 'Học viên có tỷ lệ chuyên cần cao (95%), điểm tổng kết đạt 87.75. Điểm mạnh: Ngữ pháp chắc chắn, phát âm chuẩn. Cần khắc phục: Nâng cao tốc độ làm bài Reading.',
        validatedOutputJson: {{ chuyenCan: 95, tongKet: 87.75 }},
        trangThai: TrangThaiYeuCauAI.THANH_CONG,
        thoiGianXuLyMs: 1800,
      }},
    ],
  }});
  console.log('✅ Đã nạp Audit Log AI');

  console.log('\\n🎉 NẠP TOÀN BỘ SIÊU DỮ LIỆU ĐẦY ĐỦ 54 HỌC VIÊN & LỚP TỐI ĐA 25/25 THÀNH CÔNG!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📋 TÀI KHOẢN HỆ THỐNG ĐÃ SẴN SÀNG (Mật khẩu mặc định: 123456):');
  console.log('   👑 Quản lý (Admin)     : admin01');
  console.log('   👨‍🏫 Giáo viên (Teacher) : teacher01 → teacher10 (10 Giảng viên)');
  console.log('   📞 Tư vấn viên (Staff) : staff01, staff02');
  console.log('   🎓 Học viên (Student)   : student01 → student54 (54 Học viên)');
  console.log('   🔥 Lớp SĨ SỐ TỐI ĐA 25 : IELTS-B1-01 (25/25 HV - 100% Sĩ số)');
  console.log('   📊 Thống kê hoàn thành : 40 ĐẠT (87.0%), 6 KHÔNG ĐẠT (13.0%), 5 ĐANG HỌC');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}}

main()
  .catch((e) => {{
    console.error('❌ Lỗi Seed Data:', e);
    process.exit(1);
  }})
  .finally(async () => {{
    await prisma.$disconnect();
  }});
'''

with open(r'D:\MyProjects\lms-ai\backend\prisma\seed.ts', 'w', encoding='utf-8') as f:
    f.write(seed_ts_content)

print("SUCCESS: Updated seed.ts with 54 students, 10 teachers, max capacity class 25/25 and complete scenarios!")
