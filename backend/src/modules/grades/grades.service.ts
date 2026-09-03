import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SubmitGradesDto } from './dto/grades.dto';
import { TrangThaiHoanThanh, TrangThaiDangKy, TrangThaiLopHoc, TrangThaiPhanCong, VaiTro } from '@prisma/client';

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
  async submitClassGrades(classId: number, dto: SubmitGradesDto, user?: any) {
    const classRecord = await this.prisma.lopHoc.findUnique({
      where: { id: BigInt(classId) },
    });
    if (!classRecord) throw new NotFoundException('Lớp học không tồn tại.');
    if (classRecord.trangThai === TrangThaiLopHoc.DA_HUY) {
      throw new BadRequestException('Không thể nhập điểm cho lớp học đã bị hủy.');
    }

    // Nếu người thực hiện là Giáo viên, bắt buộc phải được phân công phụ trách lớp học này
    if (user && user.vaiTro === VaiTro.GIAO_VIEN) {
      const teacher = await this.prisma.hoSoGiaoVien.findUnique({
        where: { nguoiDungId: BigInt(user.id) },
      });
      if (!teacher) {
        throw new ForbiddenException('Hồ sơ giáo viên không tồn tại hoặc chưa được liên kết.');
      }

      const isAssigned = await this.prisma.phanCongGiaoVien.findFirst({
        where: {
          lopHocId: BigInt(classId),
          giaoVienId: teacher.id,
        },
      });
      if (!isAssigned) {
        throw new ForbiddenException('Bạn không được phân công phụ trách lớp học này để nhập điểm.');
      }
    }

    const results = await this.prisma.$transaction(
      async (tx) => {
        const promises = dto.bangDiem.map((item) => {
          const cc =
            item.diemChuyenCan !== undefined &&
            item.diemChuyenCan !== null &&
            !isNaN(Number(item.diemChuyenCan))
              ? Number(item.diemChuyenCan)
              : null;

          const gk =
            item.diemGiuaKy !== undefined &&
            item.diemGiuaKy !== null &&
            !isNaN(Number(item.diemGiuaKy))
              ? Number(item.diemGiuaKy)
              : null;

          const ck =
            item.diemCuoiKy !== undefined &&
            item.diemCuoiKy !== null &&
            !isNaN(Number(item.diemCuoiKy))
              ? Number(item.diemCuoiKy)
              : null;

          let diemTongKet: number | null = null;
          let trangThaiHoanThanh: TrangThaiHoanThanh = TrangThaiHoanThanh.CHUA_XEP_LOAI;

          // Tính điểm tổng kết nếu có đủ 3 đầu điểm
          if (cc !== null && gk !== null && ck !== null) {
            diemTongKet = Number((cc * 0.2 + gk * 0.3 + ck * 0.5).toFixed(2));

            // Quy tắc xếp loại: ĐẠT khi diemTongKet >= 50.00 VÀ diemChuyenCan >= 80.00
            if (diemTongKet >= 50.0 && cc >= 80.0) {
              trangThaiHoanThanh = TrangThaiHoanThanh.DAT;
            } else {
              trangThaiHoanThanh = TrangThaiHoanThanh.KHONG_DAT;
            }
          }

          return tx.ketQuaHocTap.upsert({
            where: {
              lopHocId_hocVienId: {
                lopHocId: BigInt(classId),
                hocVienId: BigInt(item.hocVienId),
              },
            },
            update: {
              diemChuyenCan: cc,
              diemGiuaKy: gk,
              diemCuoiKy: ck,
              diemTongKet,
              nhanXet: item.nhanXet || null,
              trangThaiHoanThanh,
            },
            create: {
              lopHocId: BigInt(classId),
              hocVienId: BigInt(item.hocVienId),
              diemChuyenCan: cc,
              diemGiuaKy: gk,
              diemCuoiKy: ck,
              diemTongKet,
              nhanXet: item.nhanXet || null,
              trangThaiHoanThanh,
            },
          });
        });

        return Promise.all(promises);
      },
      {
        maxWait: 15000,
        timeout: 30000,
      },
    );

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
