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

    // 3. Toàn bộ bảng điểm & đánh giá kết quả học tập (KetQuaHocTap)
    const [allGrades, allStudents] = await Promise.all([
      this.prisma.ketQuaHocTap.findMany({
        include: {
          hocVien: {
            select: {
              id: true,
              maHocVien: true,
              hoTen: true,
              trinhDoCEFR: true,
              trangThai: true,
              nguoiDung: { select: { email: true, soDienThoai: true } },
            },
          },
          lopHoc: {
            select: {
              id: true,
              maLopHoc: true,
              tenLopHoc: true,
              trangThai: true,
              khoaHoc: { select: { tenKhoaHoc: true, trinhDoYeuCau: true } },
            },
          },
        },
        orderBy: [{ lopHoc: { maLopHoc: 'asc' } }, { hocVien: { maHocVien: 'asc' } }],
      }),
      this.prisma.hoSoHocVien.findMany({
        include: {
          nguoiDung: { select: { email: true, soDienThoai: true } },
          dangKyHoc: {
            select: {
              id: true,
              trangThai: true,
              lopHoc: { select: { id: true, maLopHoc: true, tenLopHoc: true, trangThai: true } },
            },
          },
          ketQua: {
            select: {
              id: true,
              lopHocId: true,
              diemTongKet: true,
              trangThaiHoanThanh: true,
              lopHoc: { select: { maLopHoc: true, tenLopHoc: true } },
            },
          },
        },
        orderBy: { maHocVien: 'asc' },
      }),
    ]);

    const passCount = allGrades.filter((g) => g.trangThaiHoanThanh === TrangThaiHoanThanh.DAT).length;
    const failCount = allGrades.filter((g) => g.trangThaiHoanThanh === TrangThaiHoanThanh.KHONG_DAT).length;
    const unrankedCount = allGrades.filter((g) => g.trangThaiHoanThanh === TrangThaiHoanThanh.CHUA_XEP_LOAI).length;
    const studentsWithoutGrades = allStudents.filter((s) => s.ketQua.length === 0);

    const uniquePassedStudents = new Set(
      allGrades.filter((g) => g.trangThaiHoanThanh === TrangThaiHoanThanh.DAT).map((g) => g.hocVienId.toString()),
    ).size;
    const uniqueFailedStudents = new Set(
      allGrades.filter((g) => g.trangThaiHoanThanh === TrangThaiHoanThanh.KHONG_DAT).map((g) => g.hocVienId.toString()),
    ).size;
    const uniqueUnrankedStudents = new Set(
      allGrades.filter((g) => g.trangThaiHoanThanh === TrangThaiHoanThanh.CHUA_XEP_LOAI).map((g) => g.hocVienId.toString()),
    ).size;

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
        key: 'DANG_HOC',
        label: 'Đang Theo Học',
        count: dangHoc,
        percent: totalStudents > 0 ? Math.round((dangHoc / totalStudents) * 100) : 0,
        color: 'bg-teal-500',
        text: 'text-teal-700',
      },
      {
        key: 'DA_TOT_NGHIEP',
        label: 'Đã Hoàn Thành Khóa',
        count: daTotNghiep,
        percent: totalStudents > 0 ? Math.round((daTotNghiep / totalStudents) * 100) : 0,
        color: 'bg-emerald-500',
        text: 'text-emerald-700',
      },
      {
        key: 'BAO_LUU',
        label: 'Đang Bảo Lưu',
        count: baoLuu,
        percent: totalStudents > 0 ? Math.round((baoLuu / totalStudents) * 100) : 0,
        color: 'bg-amber-500',
        text: 'text-amber-700',
      },
      {
        key: 'NGHI_HOC',
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
        // Tầng 1: Đánh giá kết quả theo lượt môn học (KetQuaHocTap)
        dat: passCount,
        khongDat: failCount,
        chuaXepLoai: unrankedCount,
        chuaCoDiem: studentsWithoutGrades.length,
        tongLuotDanhGia: allGrades.length,
        tyLeDatPhanTram: passRate,

        // Tầng 2: Đánh giá theo từng học viên (Unique Students)
        hocVienDat: uniquePassedStudents,
        hocVienKhongDat: uniqueFailedStudents,
        hocVienChuaXepLoai: uniqueUnrankedStudents,
        hocVienChuaCoDiem: studentsWithoutGrades.length,
      },
      siSoCacLop: classEnrollments,
      phanBoCEFR: cefrDistribution,
      coCauTrangThaiHocVien: studentStatusMetrics,
      chiTietKetQua: allGrades,
      chiTietHocVien: allStudents,
    });
  }
}
