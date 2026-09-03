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

    // 5. Phân bổ trình độ CEFR thực tế từ CSDL
    const cefrGroups = await this.prisma.hoSoHocVien.groupBy({
      by: ['trinhDoCEFR'],
      _count: { id: true },
    });

    const cefrDistribution = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map((level) => {
      const found = cefrGroups.find((g) => g.trinhDoCEFR === level);
      const count = found ? found._count.id : 0;
      const percent = totalStudents > 0 ? Math.round((count / totalStudents) * 100) : 0;
      return {
        level,
        count,
        percent,
      };
    });

    // 6. Cơ cấu trạng thái học tập của học viên thực tế từ CSDL
    const statusGroups = await this.prisma.hoSoHocVien.groupBy({
      by: ['trangThai'],
      _count: { id: true },
    });

    const statusMap: Record<string, number> = {};
    statusGroups.forEach((g) => {
      statusMap[g.trangThai] = g._count.id;
    });

    const dangHoc = statusMap['DANG_HOC'] || 0;
    const daTotNghiep = statusMap['DA_TOT_NGHIEP'] || 0;
    const baoLuu = statusMap['BAO_LUU'] || 0;
    const nghiHoc = statusMap['NGHI_HOC'] || 0;

    const studentStatusMetrics = [
      {
        label: 'Đang Theo Học',
        count: dangHoc,
        percent: totalStudents > 0 ? Math.round((dangHoc / totalStudents) * 100) : 0,
        color: 'bg-teal-500',
        text: 'text-teal-700',
      },
      {
        label: 'Đã Hoàn Thành Khóa',
        count: daTotNghiep,
        percent: totalStudents > 0 ? Math.round((daTotNghiep / totalStudents) * 100) : 0,
        color: 'bg-emerald-500',
        text: 'text-emerald-700',
      },
      {
        label: 'Đang Bảo Lưu',
        count: baoLuu,
        percent: totalStudents > 0 ? Math.round((baoLuu / totalStudents) * 100) : 0,
        color: 'bg-amber-500',
        text: 'text-amber-700',
      },
      {
        label: 'Đã Thôi Học',
        count: nghiHoc,
        percent: totalStudents > 0 ? Math.round((nghiHoc / totalStudents) * 100) : 0,
        color: 'bg-rose-500',
        text: 'text-rose-700',
      },
    ];

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
      phanBoCEFR: cefrDistribution,
      coCauTrangThaiHocVien: studentStatusMetrics,
    });
  }
}
