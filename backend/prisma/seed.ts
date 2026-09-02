import { PrismaClient, VaiTro, TrinhDoCEFR } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Bắt đầu Seed Data cho ETC English Center...\n');

  // Mật khẩu mặc định: Admin@123 (băm bằng Argon2)
  const defaultPassword = await argon2.hash('Admin@123');

  // ============================================================================
  // 1. Tạo Tài khoản & Hồ sơ (4 vai trò)
  // ============================================================================

  // --- Quản lý ---
  const adminUser = await prisma.nguoiDung.upsert({
    where: { tenDangNhap: 'admin01' },
    update: {},
    create: {
      tenDangNhap: 'admin01',
      matKhauMaHoa: defaultPassword,
      vaiTro: VaiTro.QUAN_LY,
      email: 'admin@etc-english.vn',
      soDienThoai: '0901111001',
    },
  });
  console.log(`✅ Quản lý: ${adminUser.tenDangNhap} (${adminUser.email})`);

  // --- Giáo viên 1 ---
  const teacherUser1 = await prisma.nguoiDung.upsert({
    where: { tenDangNhap: 'teacher01' },
    update: {},
    create: {
      tenDangNhap: 'teacher01',
      matKhauMaHoa: defaultPassword,
      vaiTro: VaiTro.GIAO_VIEN,
      email: 'nguyen.thi.lan@etc-english.vn',
      soDienThoai: '0902222001',
    },
  });
  await prisma.hoSoGiaoVien.upsert({
    where: { nguoiDungId: teacherUser1.id },
    update: {},
    create: {
      nguoiDungId: teacherUser1.id,
      maGiaoVien: 'GV001',
      hoTen: 'Nguyễn Thị Lan',
      chuyenMon: 'IELTS, TOEIC',
      bangCap: 'Thạc sĩ Ngôn ngữ Anh - ĐH Ngoại ngữ HN',
    },
  });
  console.log(`✅ Giáo viên 1: ${teacherUser1.tenDangNhap}`);

  // --- Giáo viên 2 ---
  const teacherUser2 = await prisma.nguoiDung.upsert({
    where: { tenDangNhap: 'teacher02' },
    update: {},
    create: {
      tenDangNhap: 'teacher02',
      matKhauMaHoa: defaultPassword,
      vaiTro: VaiTro.GIAO_VIEN,
      email: 'tran.van.minh@etc-english.vn',
      soDienThoai: '0902222002',
    },
  });
  await prisma.hoSoGiaoVien.upsert({
    where: { nguoiDungId: teacherUser2.id },
    update: {},
    create: {
      nguoiDungId: teacherUser2.id,
      maGiaoVien: 'GV002',
      hoTen: 'Trần Văn Minh',
      chuyenMon: 'Tiếng Anh giao tiếp, Phát âm',
      bangCap: 'Cử nhân Sư phạm Tiếng Anh - ĐH Sư phạm HCM',
    },
  });
  console.log(`✅ Giáo viên 2: ${teacherUser2.tenDangNhap}`);

  // --- Tư vấn viên ---
  const staffUser = await prisma.nguoiDung.upsert({
    where: { tenDangNhap: 'staff01' },
    update: {},
    create: {
      tenDangNhap: 'staff01',
      matKhauMaHoa: defaultPassword,
      vaiTro: VaiTro.TU_VAN_VIEN,
      email: 'tuvan01@etc-english.vn',
      soDienThoai: '0903333001',
    },
  });
  console.log(`✅ Tư vấn viên: ${staffUser.tenDangNhap}`);

  // --- Học viên 1 ---
  const studentUser1 = await prisma.nguoiDung.upsert({
    where: { tenDangNhap: 'student01' },
    update: {},
    create: {
      tenDangNhap: 'student01',
      matKhauMaHoa: defaultPassword,
      vaiTro: VaiTro.HOC_VIEN,
      email: 'le.thi.hoa@gmail.com',
      soDienThoai: '0904444001',
    },
  });
  await prisma.hoSoHocVien.upsert({
    where: { nguoiDungId: studentUser1.id },
    update: {},
    create: {
      nguoiDungId: studentUser1.id,
      maHocVien: 'HV001',
      hoTen: 'Lê Thị Hoa',
      ngaySinh: new Date('2002-05-15'),
      gioiTinh: 'Nữ',
      trinhDoCEFR: TrinhDoCEFR.B1,
      nguonDanhGia: 'Placement Test 15/08/2024',
      lichRanhJson: { thu: [2, 4, 6], gio: '17:30-21:00' },
    },
  });

  // --- Học viên 2 ---
  const studentUser2 = await prisma.nguoiDung.upsert({
    where: { tenDangNhap: 'student02' },
    update: {},
    create: {
      tenDangNhap: 'student02',
      matKhauMaHoa: defaultPassword,
      vaiTro: VaiTro.HOC_VIEN,
      email: 'pham.van.hung@gmail.com',
      soDienThoai: '0904444002',
    },
  });
  await prisma.hoSoHocVien.upsert({
    where: { nguoiDungId: studentUser2.id },
    update: {},
    create: {
      nguoiDungId: studentUser2.id,
      maHocVien: 'HV002',
      hoTen: 'Phạm Văn Hùng',
      ngaySinh: new Date('2001-11-20'),
      gioiTinh: 'Nam',
      trinhDoCEFR: TrinhDoCEFR.A2,
      nguonDanhGia: 'Placement Test 01/09/2024',
      lichRanhJson: { thu: [3, 5, 7], gio: '19:00-21:00' },
    },
  });
  console.log('✅ Đã tạo 2 học viên mẫu (HV001, HV002)');

  // ============================================================================
  // 2. Tạo Khóa học
  // ============================================================================
  const course1 = await prisma.khoaHoc.upsert({
    where: { maKhoaHoc: 'KH-IELTS-B1' },
    update: {},
    create: {
      maKhoaHoc: 'KH-IELTS-B1',
      tenKhoaHoc: 'IELTS Preparation B1 → B2',
      trinhDoYeuCau: TrinhDoCEFR.B1,
      thoiLuongGio: 60,
      hocPhi: 3500000,
      moTa: 'Khóa học chuẩn bị IELTS 5.5 - 6.0 dành cho học viên trình độ B1',
    },
  });

  const course2 = await prisma.khoaHoc.upsert({
    where: { maKhoaHoc: 'KH-TOEIC-A2' },
    update: {},
    create: {
      maKhoaHoc: 'KH-TOEIC-A2',
      tenKhoaHoc: 'TOEIC Starter A2 → B1',
      trinhDoYeuCau: TrinhDoCEFR.A2,
      thoiLuongGio: 48,
      hocPhi: 2800000,
      moTa: 'Khóa học TOEIC từ 300-450 điểm dành cho học viên A2',
    },
  });
  console.log('✅ Đã tạo 2 khóa học mẫu');

  // ============================================================================
  // 3. Tạo Lớp học
  // ============================================================================
  const class1 = await prisma.lopHoc.upsert({
    where: { maLopHoc: 'IELTS-B1-01' },
    update: {},
    create: {
      khoaHocId: course1.id,
      maLopHoc: 'IELTS-B1-01',
      tenLopHoc: 'IELTS B1 Buổi tối (Thứ 2-4-6)',
      siSoToiDa: 25,
      siSoHienTai: 0,
      ngayBatDau: new Date('2024-09-16'),
      ngayKetThuc: new Date('2024-12-16'),
      phongHoc: 'Phòng A101',
      trangThai: 'DANG_MO_DANG_KY',
    },
  });

  const class2 = await prisma.lopHoc.upsert({
    where: { maLopHoc: 'TOEIC-A2-01' },
    update: {},
    create: {
      khoaHocId: course2.id,
      maLopHoc: 'TOEIC-A2-01',
      tenLopHoc: 'TOEIC Starter Thứ 3-5-7',
      siSoToiDa: 25,
      siSoHienTai: 0,
      ngayBatDau: new Date('2024-09-17'),
      ngayKetThuc: new Date('2024-12-10'),
      phongHoc: 'Phòng B202',
      trangThai: 'DANG_MO_DANG_KY',
    },
  });
  console.log('✅ Đã tạo 2 lớp học mẫu');

  // ============================================================================
  // 4. Tạo Lịch học
  // ============================================================================
  // Lớp IELTS-B1-01: Thứ 2, 4, 6 — 17:30-20:30
  await prisma.lichHoc.upsert({
    where: { lopHocId_thuTrongTuan_gioBatDau: {
      lopHocId: class1.id,
      thuTrongTuan: 2,
      gioBatDau: new Date('1970-01-01T17:30:00'),
    }},
    update: {},
    create: {
      lopHocId: class1.id,
      thuTrongTuan: 2,
      gioBatDau: new Date('1970-01-01T17:30:00'),
      gioKetThuc: new Date('1970-01-01T20:30:00'),
      phongHoc: 'Phòng A101',
    },
  });

  console.log('\n🎉 Seed Data hoàn tất!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📋 Tài khoản mẫu (mật khẩu mặc định: Admin@123):');
  console.log('   👤 Quản lý  : admin01');
  console.log('   👩‍🏫 Giáo viên: teacher01, teacher02');
  console.log('   📞 Tư vấn   : staff01');
  console.log('   🎓 Học viên : student01, student02');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

main()
  .catch((e) => {
    console.error('❌ Lỗi Seed Data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
