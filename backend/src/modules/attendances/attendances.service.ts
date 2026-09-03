import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SubmitAttendanceDto } from './dto/attendances.dto';
import { TrangThaiBuoiHoc, TrangThaiPhanCong, TrangThaiLopHoc } from '@prisma/client';

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
   * Lấy toàn bộ ma trận điểm danh của cả lớp (tất cả các buổi học và bản ghi điểm danh)
   */
  async getClassAttendanceMatrix(classId: number) {
    const classRecord = await this.prisma.lopHoc.findUnique({
      where: { id: BigInt(classId) },
      include: {
        dangKyHoc: {
          include: {
            hocVien: { select: { id: true, maHocVien: true, hoTen: true, trinhDoCEFR: true } },
          },
        },
        buoiHoc: {
          include: {
            diemDanh: true,
          },
          orderBy: { soThuTu: 'asc' },
        },
      },
    });
    if (!classRecord) throw new NotFoundException('Lớp học không tồn tại.');
    return this.serializeBigInt(classRecord);
  }

  /**
   * UC008 — Ghi nhận / Cập nhật điểm danh buổi học
   */
  async submitAttendance(sessionId: number, dto: SubmitAttendanceDto, teacherUserId: number) {
    const session = await this.prisma.buoiHoc.findUnique({
      where: { id: BigInt(sessionId) },
      include: { lopHoc: true },
    });
    if (!session) throw new NotFoundException('Buổi học không tồn tại.');
    if (session.lopHoc?.trangThai === TrangThaiLopHoc.DA_HUY) {
      throw new BadRequestException('Không thể điểm danh cho lớp học đã bị hủy.');
    }

    const teacher = await this.prisma.hoSoGiaoVien.findUnique({
      where: { nguoiDungId: BigInt(teacherUserId) },
    });

    // Nếu người thực hiện là Giáo viên, bắt buộc phải được phân công phụ trách lớp học này
    if (teacher) {
      const isAssigned = await this.prisma.phanCongGiaoVien.findFirst({
        where: {
          lopHocId: session.lopHocId,
          giaoVienId: teacher.id,
        },
      });
      if (!isAssigned) {
        throw new ForbiddenException('Bạn không được phân công phụ trách lớp học này để thực hiện điểm danh.');
      }
    }

    // Xác định ID giáo viên ghi nhận điểm danh
    let recordTeacherId = teacher?.id;
    if (!recordTeacherId) {
      const assigned = await this.prisma.phanCongGiaoVien.findFirst({
        where: { lopHocId: session.lopHocId },
      });
      recordTeacherId = assigned?.giaoVienId;
    }
    if (!recordTeacherId) {
      const firstTeacher = await this.prisma.hoSoGiaoVien.findFirst();
      recordTeacherId = firstTeacher?.id || 1n;
    }

    // Transaction cập nhật tất cả bản ghi điểm danh song song
    await this.prisma.$transaction(
      async (tx) => {
        const promises = dto.danhSach.map((item) =>
          tx.banGhiDiemDanh.upsert({
            where: {
              buoiHocId_hocVienId: {
                buoiHocId: BigInt(sessionId),
                hocVienId: BigInt(item.hocVienId),
              },
            },
            update: {
              trangThai: item.trangThai,
              ghiChu: item.ghiChu || null,
              giaoVienDiemDanhId: recordTeacherId,
              thoiGianDiemDanh: new Date(),
            },
            create: {
              buoiHocId: BigInt(sessionId),
              hocVienId: BigInt(item.hocVienId),
              trangThai: item.trangThai,
              ghiChu: item.ghiChu || null,
              giaoVienDiemDanhId: recordTeacherId,
            },
          }),
        );

        await Promise.all(promises);

        // Cập nhật trạng thái buổi học thành ĐÃ KẾT THÚC
        await tx.buoiHoc.update({
          where: { id: BigInt(sessionId) },
          data: { trangThai: TrangThaiBuoiHoc.DA_KET_THUC },
        });
      },
      {
        maxWait: 15000,
        timeout: 30000,
      },
    );

    return { message: 'Ghi nhận và lưu điểm danh thành công.' };
  }
}
