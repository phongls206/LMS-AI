const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verifyLean() {
  console.log('=== KIỂM ĐẾM DỮ LIỆU SAU KHI RESET ===\n');

  const [
    nguoiDung,
    hoSoHocVien,
    hoSoGiaoVien,
    khoaHoc,
    lopHoc,
    lichHoc,
    phanCongGiaoVien,
    dangKyHoc,
    hoaDon,
    thanhToan,
    buoiHoc,
    banGhiDiemDanh,
    ketQuaHocTap,
    yeuCauAI
  ] = await Promise.all([
    prisma.nguoiDung.count(),
    prisma.hoSoHocVien.count(),
    prisma.hoSoGiaoVien.count(),
    prisma.khoaHoc.count(),
    prisma.lopHoc.count(),
    prisma.lichHoc.count(),
    prisma.phanCongGiaoVien.count(),
    prisma.dangKyHoc.count(),
    prisma.hoaDon.count(),
    prisma.thanhToan.count(),
    prisma.buoiHoc.count(),
    prisma.banGhiDiemDanh.count(),
    prisma.ketQuaHocTap.count(),
    prisma.yeuCauAI.count()
  ]);

  const stats = [
    { Bang: 'NguoiDung (Tài khoản)', SoLuong: nguoiDung, KyVong: 5 },
    { Bang: 'HoSoGiaoVien', SoLuong: hoSoGiaoVien, KyVong: 1 },
    { Bang: 'HoSoHocVien', SoLuong: hoSoHocVien, KyVong: 1 },
    { Bang: 'LopHoc', SoLuong: lopHoc, KyVong: 1 },
    { Bang: 'KhoaHoc', SoLuong: khoaHoc, KyVong: '>=1' },
    { Bang: 'LichHoc (Tuần)', SoLuong: lichHoc, KyVong: 2 },
    { Bang: 'PhanCongGiaoVien', SoLuong: phanCongGiaoVien, KyVong: 1 },
    { Bang: 'DangKyHoc (Đơn)', SoLuong: dangKyHoc, KyVong: 0 },
    { Bang: 'HoaDon', SoLuong: hoaDon, KyVong: 0 },
    { Bang: 'ThanhToan (Phiếu thu)', SoLuong: thanhToan, KyVong: 0 },
    { Bang: 'BuoiHoc', SoLuong: buoiHoc, KyVong: 0 },
    { Bang: 'BanGhiDiemDanh', SoLuong: banGhiDiemDanh, KyVong: 0 },
    { Bang: 'KetQuaHocTap (Điểm)', SoLuong: ketQuaHocTap, KyVong: 0 },
    { Bang: 'YeuCauAI (Kho câu hỏi)', SoLuong: yeuCauAI, KyVong: 30 }
  ];

  console.table(stats);

  const users = await prisma.nguoiDung.findMany({
    select: { id: true, tenDangNhap: true, vaiTro: true, email: true, hoTen: true },
    orderBy: { id: 'asc' }
  });
  console.log('--- DANH SÁCH 5 TÀI KHOẢN CỐT LÕI ---');
  console.table(JSON.parse(JSON.stringify(users, (k, v) => typeof v === 'bigint' ? Number(v) : v)));

  const classes = await prisma.lopHoc.findMany({
    include: {
      phanCong: { include: { giaoVien: true } },
      lichHoc: true,
      khoaHoc: true
    }
  });
  console.log('--- CHI TIẾT 1 LỚP HỌC MẪU ---');
  for (const c of classes) {
    console.log(`Lớp: [${c.maLopHoc}] ${c.tenLopHoc}`);
    console.log(`  - Khóa: ${c.khoaHoc?.tenKhoaHoc} (Học phí: ${c.khoaHoc?.hocPhi})`);
    console.log(`  - Sĩ số hiện tại: ${c.siSoHienTai} / ${c.siSoToiDa}`);
    console.log(`  - Giáo viên: ${c.phanCong.map(p => p.giaoVien.hoTen).join(', ') || 'Chưa phân công'}`);
    console.log(`  - Lịch học: ${c.lichHoc.map(l => `Thứ ${l.thuTrongTuan} (${new Date(l.gioBatDau).toISOString().substring(11, 16)} - ${new Date(l.gioKetThuc).toISOString().substring(11, 16)})`).join(' | ')}`);
  }
}

verifyLean()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
