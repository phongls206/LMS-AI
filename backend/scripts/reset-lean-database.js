const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function resetToLean() {
  console.log('=== BẮT ĐẦU RESET HỆ THỐNG VỀ TRẠNG THÁI TINH GỌN ===');

  // 1. Tìm các tài khoản cốt lõi
  const coreUsers = await prisma.nguoiDung.findMany({
    where: {
      tenDangNhap: { in: ['admin01', 'teacher01', 'student01', 'staff01', 'staff02'] }
    },
    include: {
      hoSoHocVien: true,
      hoSoGiaoVien: true,
    }
  });

  const adminUser = coreUsers.find(u => u.tenDangNhap === 'admin01');
  const teacherUser = coreUsers.find(u => u.tenDangNhap === 'teacher01');
  const studentUser = coreUsers.find(u => u.tenDangNhap === 'student01');
  const staff1 = coreUsers.find(u => u.tenDangNhap === 'staff01');
  const staff2 = coreUsers.find(u => u.tenDangNhap === 'staff02');

  if (!adminUser || !teacherUser || !studentUser || !staff1 || !staff2) {
    throw new Error('Không tìm đủ 5 tài khoản cốt lõi: admin01, teacher01, student01, staff01, staff02!');
  }

  console.log('✓ Đã xác thực 5 tài khoản cốt lõi:');
  console.log(`  - Admin: ${adminUser.tenDangNhap} (ID: ${adminUser.id})`);
  console.log(`  - Teacher: ${teacherUser.tenDangNhap} (ID: ${teacherUser.id}, GV ID: ${teacherUser.hoSoGiaoVien?.id})`);
  console.log(`  - Student: ${studentUser.tenDangNhap} (ID: ${studentUser.id}, HV ID: ${studentUser.hoSoHocVien?.id})`);
  console.log(`  - Staff 1: ${staff1.tenDangNhap} (ID: ${staff1.id})`);
  console.log(`  - Staff 2: ${staff2.tenDangNhap} (ID: ${staff2.id})`);

  const coreUserIds = coreUsers.map(u => u.id);
  const teacherProfileId = teacherUser.hoSoGiaoVien.id;
  const studentProfileId = studentUser.hoSoHocVien.id;

  // 2. Backup toàn bộ YeuCauAI ra file trước khi thao tác
  const allAiRequests = await prisma.yeuCauAI.findMany();
  const backupDir = path.join(__dirname, '..', 'prisma', 'backups');
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }
  const backupPath = path.join(backupDir, `ai_backup_${Date.now()}.json`);
  fs.writeFileSync(backupPath, JSON.stringify(allAiRequests, (k, v) => typeof v === 'bigint' ? Number(v) : v, 2));
  console.log(`✓ Đã sao lưu ${allAiRequests.length} bản ghi AI vào: ${backupPath}`);

  // 3. Re-assign các câu hỏi AI của người dùng sắp xóa sang teacher01
  const updatedAi = await prisma.yeuCauAI.updateMany({
    where: {
      nguoiDungId: { notIn: coreUserIds }
    },
    data: {
      nguoiDungId: teacherUser.id
    }
  });
  console.log(`✓ Đã chuyển quyền sở hữu ${updatedAi.count} bản ghi AI sang giáo viên ${teacherUser.tenDangNhap}`);

  // 4. Xóa sạch các bảng phát sinh (Giao dịch, điểm, buổi học, đăng ký)
  console.log('--> Đang dọn sạch các bảng dữ liệu phát sinh...');
  const deletedAttendance = await prisma.banGhiDiemDanh.deleteMany({});
  console.log(`  - Đã xóa ${deletedAttendance.count} bản ghi Điểm danh.`);

  const deletedSessions = await prisma.buoiHoc.deleteMany({});
  console.log(`  - Đã xóa ${deletedSessions.count} Buổi học.`);

  const deletedGrades = await prisma.ketQuaHocTap.deleteMany({});
  console.log(`  - Đã xóa ${deletedGrades.count} bản ghi Kết quả học tập.`);

  const deletedPayments = await prisma.thanhToan.deleteMany({});
  console.log(`  - Đã xóa ${deletedPayments.count} Phiếu thu tiền (ThanhToan).`);

  const deletedInvoices = await prisma.hoaDon.deleteMany({});
  console.log(`  - Đã xóa ${deletedInvoices.count} Hóa đơn học phí.`);

  const deletedEnrollments = await prisma.dangKyHoc.deleteMany({});
  console.log(`  - Đã xóa ${deletedEnrollments.count} Đơn đăng ký học.`);

  // 5. Xác định và giữ lại đúng 1 Lớp học mẫu
  // Ưu tiên lớp IELTS-B1-01 hoặc lớp đầu tiên
  let targetClass = await prisma.lopHoc.findFirst({
    where: { maLopHoc: 'IELTS-B1-01' }
  });
  if (!targetClass) {
    targetClass = await prisma.lopHoc.findFirst();
  }
  console.log(`✓ Lớp học giữ lại: ${targetClass.maLopHoc} - ${targetClass.tenLopHoc} (ID: ${targetClass.id})`);

  // Xóa lịch học và phân công của tất cả các lớp KHÁC lớp targetClass
  await prisma.lichHoc.deleteMany({
    where: { lopHocId: { not: targetClass.id } }
  });
  await prisma.phanCongGiaoVien.deleteMany({
    where: { lopHocId: { not: targetClass.id } }
  });

  // Xóa tất cả các lớp khác
  const deletedClasses = await prisma.lopHoc.deleteMany({
    where: { id: { not: targetClass.id } }
  });
  console.log(`  - Đã xóa ${deletedClasses.count} Lớp học thừa.`);

  // Cập nhật lớp học giữ lại: sĩ số = 0, trạng thái DANG_MO hoặc SAP_MO
  await prisma.lopHoc.update({
    where: { id: targetClass.id },
    data: {
      siSoHienTai: 0,
      trangThai: 'DANG_MO_DANG_KY'
    }
  });

  // Đảm bảo lớp học có phân công cho teacher01
  await prisma.phanCongGiaoVien.deleteMany({
    where: { lopHocId: targetClass.id }
  });
  await prisma.phanCongGiaoVien.create({
    data: {
      lopHocId: targetClass.id,
      giaoVienId: teacherProfileId,
      vaiTroPhanCong: 'CHINH',
      trangThai: 'DANG_PHU_TRACH'
    }
  });

  // Đảm bảo lớp học có lịch học tuần chuẩn (Thứ 2 & Thứ 4, 18:00 - 20:00, P.201)
  await prisma.lichHoc.deleteMany({
    where: { lopHocId: targetClass.id }
  });
  await prisma.lichHoc.createMany({
    data: [
      {
        lopHocId: targetClass.id,
        thuTrongTuan: 2,
        gioBatDau: new Date('1970-01-01T18:00:00Z'),
        gioKetThuc: new Date('1970-01-01T20:00:00Z'),
        phongHoc: 'P.201'
      },
      {
        lopHocId: targetClass.id,
        thuTrongTuan: 4,
        gioBatDau: new Date('1970-01-01T18:00:00Z'),
        gioKetThuc: new Date('1970-01-01T20:00:00Z'),
        phongHoc: 'P.201'
      }
    ]
  });
  console.log(`✓ Đã chuẩn hóa lớp ${targetClass.maLopHoc}: Sĩ số = 0, GV = teacher01, 2 buổi/tuần (T2, T4).`);

  // 6. Xóa các hồ sơ học viên & giáo viên thừa
  const deletedStudentProfiles = await prisma.hoSoHocVien.deleteMany({
    where: { id: { not: studentProfileId } }
  });
  console.log(`  - Đã xóa ${deletedStudentProfiles.count} Hồ sơ học viên thừa.`);

  const deletedTeacherProfiles = await prisma.hoSoGiaoVien.deleteMany({
    where: { id: { not: teacherProfileId } }
  });
  console.log(`  - Đã xóa ${deletedTeacherProfiles.count} Hồ sơ giáo viên thừa.`);

  // 7. Xóa toàn bộ tài khoản người dùng thừa
  const deletedUsers = await prisma.nguoiDung.deleteMany({
    where: { id: { notIn: coreUserIds } }
  });
  console.log(`  - Đã xóa ${deletedUsers.count} Tài khoản người dùng thừa.`);

  console.log('\n=== HOÀN TẤT RESET DỮ LIỆU THÀNH CÔNG ===');
}

resetToLean()
  .catch((err) => {
    console.error('LỖI KHI RESET:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
