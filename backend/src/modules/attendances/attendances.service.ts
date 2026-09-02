import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SubmitAttendanceDto } from './dto/attendances.dto';
import { TrangThaiBuoiHoc, TrangThaiPhanCong } from '@prisma/client';

@Injectable()
export class AttendancesService {
  constructor(private prisma: PrismaService) {}

  private serializeBigInt(obj: any) {
    return JSON.parse(
      JSON.stringify(obj, (key, value) =>
        typeof value === 'bigint' ? Number(value) : value,
      ),
    );
  }

  /**
   * UC008 — Lấy danh sách buổi học của lớp
   */
  async getClassSessions(classId: number) {
    const sessions = await this.prisma.buoiHoc.findMany({
      where: { lopHocId: BigInt(classId) },
      include: {
        _count: { select: { diemDanh: true } },
      },
      orderBy: { soThuTu: 'asc' },
    });

    return this.serializeBigInt(sessions);
  }

  /**
   * UC008 — Xem chi tiết điểm danh của 1 buổi học
   */
  async getSessionAttendance(sessionId: number) {
    const session = await this.prisma.buoiHoc.findUnique({
      where: { id: BigInt(sessionId) },
      include: {
        lopHoc: { select: { id: true, tenLopHoc: true, maLopHoc: true } },
        diemDanh: {
          include: {
            hocVien: { select: { id: true, maHocVien: true, hoTen: true } },
          },
        },
      },
    });

    if (!session) throw new NotFoundException('Buổi học không tồn tại.');
    return this.serializeBigInt(session);
  }

  /**
   * UC008 — Ghi nhận / Cập nhật điểm danh buổi học
   */
  async submitAttendance(sessionId: number, dto: SubmitAttendanceDto, teacherUserId: number) {
    const session = await this.prisma.buoiHoc.findUnique({
      where: { id: BigInt(sessionId) },
    });
    if (!session) throw new NotFoundException('Buổi học không tồn tại.');

    const teacher = await this.prisma.hoSoGiaoVien.findUnique({
      where: { nguoiDungId: BigInt(teacherUserId) },
    });

    // Nếu người thực hiện là Giáo viên, bắt buộc phải được phân công phụ trách lớp học này
    if (teacher) {
      const isAssigned = await this.prisma.phanCongGiaoVien.findFirst({
        where: {
          lopHocId: session.lopHocId,
          giaoVienId: teacher.id,
          trangThai: TrangThaiPhanCong.DANG_PHU_TRACH,
        },
      });
      if (!isAssigned) {
        throw new ForbiddenException('Bạn không được phân công phụ trách lớp học này để thực hiện điểm danh.');
      }
    }

    // Transaction cập nhật tất cả bản ghi điểm danh
    await this.prisma.$transaction(async (tx) => {
      for (const item of dto.danhSach) {
        await tx.banGhiDiemDanh.upsert({
          where: {
            buoiHocId_hocVienId: {
              buoiHocId: BigInt(sessionId),
              hocVienId: BigInt(item.hocVienId),
            },
          },
          update: {
            trangThai: item.trangThai,
            ghiChu: item.ghiChu,
            giaoVienDiemDanhId: teacher.id,
            thoiGianDiemDanh: new Date(),
          },
          create: {
            buoiHocId: BigInt(sessionId),
            hocVienId: BigInt(item.hocVienId),
            trangThai: item.trangThai,
            ghiChu: item.ghiChu,
            giaoVienDiemDanhId: teacher.id,
          },
        });
      }

      // Cập nhật trạng thái buổi học thành ĐÃ KẾT THÚC
      await tx.buoiHoc.update({
        where: { id: BigInt(sessionId) },
        data: { trangThai: TrangThaiBuoiHoc.DA_KET_THUC },
      });
    });

    return { message: 'Ghi nhận điểm danh thành công.' };
  }
}
