import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { TrangThaiHoanThanh, TrangThaiLopHoc } from '@prisma/client';

@Injectable()
export class StatisticsService {
  constructor(private prisma: PrismaService) {}

  private serializeBigInt(obj: any) {
    return JSON.parse(
      JSON.stringify(obj, (key, value) =>
        typeof value === 'bigint' ? Number(value) : value,
      ),
    );
  }

  /**
   * UC011 — Dashboard báo cáo tổng hợp (Doanh thu, Sĩ số, Tỷ lệ đạt)
   */
  async getDashboardReport(year?: number) {
    const currentYear = year || new Date().getFullYear();

    // 1. Tổng doanh thu đã thu
    const payments = await this.prisma.thanhToan.findMany({
      where: {
        trangThai: 'THANH_CONG',
      },
      select: { soTien: true, thoiGianThanhToan: true },
    });

    const totalRevenue = payments.reduce((sum, p) => sum + Number(p.soTien), 0);

    // 2. Tổng số học viên, giáo viên, lớp học
    const [totalStudents, totalTeachers, totalCourses, activeClasses] = await Promise.all([
      this.prisma.hoSoHocVien.count(),
      this.prisma.hoSoGiaoVien.count(),
      this.prisma.khoaHoc.count(),
      this.prisma.lopHoc.count({
        where: {
          trangThai: { in: [TrangThaiLopHoc.DANG_MO_DANG_KY, TrangThaiLopHoc.DANG_HOC] },
        },
      }),
    ]);

    // 3. Tỷ lệ hoàn thành khóa học (DAT vs KHONG_DAT)
    const [passCount, failCount, unrankedCount] = await Promise.all([
      this.prisma.ketQuaHocTap.count({
        where: { trangThaiHoanThanh: TrangThaiHoanThanh.DAT },
      }),
      this.prisma.ketQuaHocTap.count({
        where: { trangThaiHoanThanh: TrangThaiHoanThanh.KHONG_DAT },
      }),
      this.prisma.ketQuaHocTap.count({
        where: { trangThaiHoanThanh: TrangThaiHoanThanh.CHUA_XEP_LOAI },
      }),
    ]);

    const totalEvaluated = passCount + failCount;
    const passRate = totalEvaluated > 0 ? Number(((passCount / totalEvaluated) * 100).toFixed(1)) : 0;

    // 4. Phân bổ sĩ số theo lớp đang mở
    const classEnrollments = await this.prisma.lopHoc.findMany({
      where: {
        trangThai: { in: [TrangThaiLopHoc.DANG_MO_DANG_KY, TrangThaiLopHoc.DANG_HOC] },
      },
      select: {
        id: true,
        maLopHoc: true,
        tenLopHoc: true,
        siSoHienTai: true,
        siSoToiDa: true,
      },
    });

    return this.serializeBigInt({
      tongQuan: {
        tongHocVien: totalStudents,
        tongGiaoVien: totalTeachers,
        tongKhoaHoc: totalCourses,
        lopDangMo: activeClasses,
        tongDoanhThu: totalRevenue,
      },
      tyLeHoanThanh: {
        dat: passCount,
        khongDat: failCount,
        chuaXepLoai: unrankedCount,
        tyLeDatPhanTram: passRate,
      },
      siSoCacLop: classEnrollments,
    });
  }
}
