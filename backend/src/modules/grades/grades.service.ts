import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SubmitGradesDto } from './dto/grades.dto';
import { TrangThaiHoanThanh, TrangThaiDangKy, TrangThaiLopHoc } from '@prisma/client';

@Injectable()
export class GradesService {
  constructor(private prisma: PrismaService) {}

  private serializeBigInt(obj: any) {
    return JSON.parse(
      JSON.stringify(obj, (key, value) =>
        typeof value === 'bigint' ? Number(value) : value,
      ),
    );
  }

  /**
   * UC009 — Xem bảng điểm chi tiết của lớp học
   */
  async getClassGrades(classId: number) {
    const grades = await this.prisma.ketQuaHocTap.findMany({
      where: { lopHocId: BigInt(classId) },
      include: {
        hocVien: { select: { id: true, maHocVien: true, hoTen: true, trinhDoCEFR: true } },
      },
      orderBy: { id: 'asc' },
    });

    return this.serializeBigInt(grades);
  }

  /**
   * UC009 — Nhập điểm & Tự động tính Điểm tổng kết (20% CC + 30% GK + 50% CK)
   */
  async submitClassGrades(classId: number, dto: SubmitGradesDto) {
    const classRecord = await this.prisma.lopHoc.findUnique({
      where: { id: BigInt(classId) },
    });
    if (!classRecord) throw new NotFoundException('Lớp học không tồn tại.');

    const results = [];

    await this.prisma.$transaction(async (tx) => {
      for (const item of dto.bangDiem) {
        let diemTongKet: number | null = null;
        let trangThaiHoanThanh: TrangThaiHoanThanh = TrangThaiHoanThanh.CHUA_XEP_LOAI;

        // Tính điểm tổng kết nếu có đủ 3 đầu điểm
        if (
          item.diemChuyenCan !== undefined &&
          item.diemChuyenCan !== null &&
          item.diemGiuaKy !== undefined &&
          item.diemGiuaKy !== null &&
          item.diemCuoiKy !== undefined &&
          item.diemCuoiKy !== null
        ) {
          diemTongKet = Number(
            (
              item.diemChuyenCan * 0.2 +
              item.diemGiuaKy * 0.3 +
              item.diemCuoiKy * 0.5
            ).toFixed(2),
          );

          // Quy tắc xếp loại: ĐẠT khi diemTongKet >= 50.00 VÀ diemChuyenCan >= 80.00
          if (diemTongKet >= 50.0 && item.diemChuyenCan >= 80.0) {
            trangThaiHoanThanh = TrangThaiHoanThanh.DAT;
          } else {
            trangThaiHoanThanh = TrangThaiHoanThanh.KHONG_DAT;
          }
        }

        const saved = await tx.ketQuaHocTap.upsert({
          where: {
            lopHocId_hocVienId: {
              lopHocId: BigInt(classId),
              hocVienId: BigInt(item.hocVienId),
            },
          },
          update: {
            diemChuyenCan: item.diemChuyenCan,
            diemGiuaKy: item.diemGiuaKy,
            diemCuoiKy: item.diemCuoiKy,
            diemTongKet,
            nhanXet: item.nhanXet,
            trangThaiHoanThanh,
          },
          create: {
            lopHocId: BigInt(classId),
            hocVienId: BigInt(item.hocVienId),
            diemChuyenCan: item.diemChuyenCan,
            diemGiuaKy: item.diemGiuaKy,
            diemCuoiKy: item.diemCuoiKy,
            diemTongKet,
            nhanXet: item.nhanXet,
            trangThaiHoanThanh,
          },
        });

        results.push(saved);
      }
    });

    return {
      message: 'Cập nhật bảng điểm và tính điểm tổng kết thành công.',
      data: this.serializeBigInt(results),
    };
  }

  /**
   * UC010 — Học viên tra cứu thời khóa biểu cá nhân
   */
  async getStudentSchedule(userId: number) {
    const student = await this.prisma.hoSoHocVien.findUnique({
      where: { nguoiDungId: BigInt(userId) },
    });
    if (!student) throw new NotFoundException('Hồ sơ học viên không tồn tại.');

    const enrollments = await this.prisma.dangKyHoc.findMany({
      where: {
        hocVienId: student.id,
        trangThai: { in: [TrangThaiDangKy.CHO_THANH_TOAN, TrangThaiDangKy.DA_XAC_NHAN] },
      },
      include: {
        lopHoc: {
          include: {
            khoaHoc: { select: { tenKhoaHoc: true } },
            lichHoc: true,
            phanCong: {
              include: {
                giaoVien: { select: { hoTen: true } },
              },
            },
          },
        },
      },
    });

    return this.serializeBigInt(enrollments);
  }

  /**
   * UC010 — Học viên tra cứu bảng điểm cá nhân
   */
  async getStudentGrades(userId: number) {
    const student = await this.prisma.hoSoHocVien.findUnique({
      where: { nguoiDungId: BigInt(userId) },
    });
    if (!student) throw new NotFoundException('Hồ sơ học viên không tồn tại.');

    const grades = await this.prisma.ketQuaHocTap.findMany({
      where: { hocVienId: student.id },
      include: {
        lopHoc: {
          include: {
            khoaHoc: { select: { tenKhoaHoc: true } },
          },
        },
      },
      orderBy: { id: 'desc' },
    });

    return this.serializeBigInt(grades);
  }
}
