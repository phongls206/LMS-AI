import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateClassDto, CreateScheduleDto, AssignTeacherDto } from './dto/classes.dto';
import { TrangThaiLopHoc, VaiTroPhanCong } from '@prisma/client';

@Injectable()
export class ClassesService {
  constructor(private prisma: PrismaService) {}

  private serializeBigInt(obj: any) {
    return JSON.parse(
      JSON.stringify(obj, (key, value) =>
        typeof value === 'bigint' ? Number(value) : value,
      ),
    );
  }

  private parseTimeString(timeStr: string): Date {
    return new Date(`1970-01-01T${timeStr}:00`);
  }

  /**
   * UC004 — Lấy danh sách lớp học
   */
  async findAll(khoaHocId?: number, trangThai?: TrangThaiLopHoc) {
    const where: any = {};
    if (khoaHocId) where.khoaHocId = BigInt(khoaHocId);
    if (trangThai) where.trangThai = trangThai;

    const classes = await this.prisma.lopHoc.findMany({
      where,
      include: {
        khoaHoc: { select: { tenKhoaHoc: true, hocPhi: true, trinhDoYeuCau: true } },
        lichHoc: true,
        phanCong: {
          include: {
            giaoVien: { select: { maGiaoVien: true, hoTen: true } },
          },
        },
      },
      orderBy: { id: 'desc' },
    });

    return this.serializeBigInt(classes);
  }

  /**
   * UC004 — Chi tiết lớp học kèm danh sách học viên và lịch học
   */
  async findById(id: number) {
    const classRecord = await this.prisma.lopHoc.findUnique({
      where: { id: BigInt(id) },
      include: {
        khoaHoc: true,
        lichHoc: true,
        phanCong: {
          include: {
            giaoVien: { select: { id: true, maGiaoVien: true, hoTen: true, chuyenMon: true } },
          },
        },
        dangKyHoc: {
          include: {
            hocVien: { select: { id: true, maHocVien: true, hoTen: true, trinhDoCEFR: true } },
          },
        },
      },
    });

    if (!classRecord) throw new NotFoundException('Không tìm thấy lớp học.');
    return this.serializeBigInt(classRecord);
  }

  /**
   * UC004 — Mở lớp học mới
   */
  async createClass(dto: CreateClassDto) {
    // Kiểm tra khóa học tồn tại
    const course = await this.prisma.khoaHoc.findUnique({
      where: { id: BigInt(dto.khoaHocId) },
    });
    if (!course) throw new NotFoundException('Khóa học không tồn tại.');

    // Kiểm tra mã lớp duy nhất
    const existing = await this.prisma.lopHoc.findUnique({
      where: { maLopHoc: dto.maLopHoc },
    });
    if (existing) throw new ConflictException('Mã lớp học đã tồn tại.');

    if (new Date(dto.ngayKetThuc) <= new Date(dto.ngayBatDau)) {
      throw new BadRequestException('Ngày kết thúc phải sau ngày bắt đầu.');
    }

    const newClass = await this.prisma.lopHoc.create({
      data: {
        khoaHocId: BigInt(dto.khoaHocId),
        maLopHoc: dto.maLopHoc,
        tenLopHoc: dto.tenLopHoc,
        siSoToiDa: dto.siSoToiDa || 25,
        ngayBatDau: new Date(dto.ngayBatDau),
        ngayKetThuc: new Date(dto.ngayKetThuc),
        phongHoc: dto.phongHoc,
        linkOnline: dto.linkOnline,
        trangThai: TrangThaiLopHoc.DANG_MO_DANG_KY,
      },
    });

    return this.serializeBigInt(newClass);
  }

  /**
   * UC004 — Thêm lịch học tuần & Kiểm tra CHỐNG TRÙNG PHÒNG
   */
  async addSchedule(classId: number, dto: CreateScheduleDto) {
    await this.findById(classId);

    const gioBatDau = this.parseTimeString(dto.gioBatDau);
    const gioKetThuc = this.parseTimeString(dto.gioKetThuc);

    if (gioKetThuc <= gioBatDau) {
      throw new BadRequestException('Giờ kết thúc phải sau giờ bắt đầu.');
    }

    // Business Rule: Kiểm tra trùng phòng học
    const conflictingRoom = await this.prisma.lichHoc.findFirst({
      where: {
        thuTrongTuan: dto.thuTrongTuan,
        phongHoc: dto.phongHoc,
        AND: [
          { gioBatDau: { lt: gioKetThuc } },
          { gioKetThuc: { gt: gioBatDau } },
        ],
      },
      include: { lopHoc: { select: { maLopHoc: true, tenLopHoc: true } } },
    });

    if (conflictingRoom) {
      throw new ConflictException(
        `Phòng ${dto.phongHoc} đã bị trùng vào Thứ ${dto.thuTrongTuan} (${dto.gioBatDau}-${dto.gioKetThuc}) với lớp ${conflictingRoom.lopHoc.tenLopHoc}.`,
      );
    }

    const schedule = await this.prisma.lichHoc.create({
      data: {
        lopHocId: BigInt(classId),
        thuTrongTuan: dto.thuTrongTuan,
        gioBatDau,
        gioKetThuc,
        phongHoc: dto.phongHoc,
      },
    });

    return this.serializeBigInt(schedule);
  }

  /**
   * UC005 — Phân công giáo viên & Kiểm tra CHỐNG TRÙNG GIỜ DẠY
   */
  async assignTeacher(classId: number, dto: AssignTeacherDto) {
    const classRecord = await this.findById(classId);

    const teacher = await this.prisma.hoSoGiaoVien.findUnique({
      where: { id: BigInt(dto.giaoVienId) },
    });
    if (!teacher) throw new NotFoundException('Giáo viên không tồn tại.');

    // Kiểm tra lịch học của lớp này có bị trùng với các lớp khác giáo viên đang dạy không
    const classSchedules = await this.prisma.lichHoc.findMany({
      where: { lopHocId: BigInt(classId) },
    });

    for (const sch of classSchedules) {
      const conflictingTeaching = await this.prisma.phanCongGiaoVien.findFirst({
        where: {
          giaoVienId: BigInt(dto.giaoVienId),
          lopHocId: { not: BigInt(classId) },
          lopHoc: {
            trangThai: { in: [TrangThaiLopHoc.DANG_MO_DANG_KY, TrangThaiLopHoc.DANG_HOC] },
            lichHoc: {
              some: {
                thuTrongTuan: sch.thuTrongTuan,
                gioBatDau: { lt: sch.gioKetThuc },
                gioKetThuc: { gt: sch.gioBatDau },
              },
            },
          },
        },
        include: { lopHoc: { select: { tenLopHoc: true } } },
      });

      if (conflictingTeaching) {
        throw new ConflictException(
          `Giáo viên ${teacher.hoTen} đã có lịch dạy trùng vào Thứ ${sch.thuTrongTuan} tại lớp ${conflictingTeaching.lopHoc.tenLopHoc}.`,
        );
      }
    }

    const assignment = await this.prisma.phanCongGiaoVien.upsert({
      where: {
        lopHocId_giaoVienId: {
          lopHocId: BigInt(classId),
          giaoVienId: BigInt(dto.giaoVienId),
        },
      },
      update: {
        vaiTroPhanCong: dto.vaiTroPhanCong || VaiTroPhanCong.CHINH,
      },
      create: {
        lopHocId: BigInt(classId),
        giaoVienId: BigInt(dto.giaoVienId),
        vaiTroPhanCong: dto.vaiTroPhanCong || VaiTroPhanCong.CHINH,
      },
    });

    return this.serializeBigInt(assignment);
  }

  /**
   * UC005/UC010 — Lịch dạy của giáo viên hiện tại
   */
  async getTeacherSchedule(userId: number) {
    const teacher = await this.prisma.hoSoGiaoVien.findUnique({
      where: { nguoiDungId: BigInt(userId) },
    });
    if (!teacher) throw new NotFoundException('Hồ sơ giáo viên không tồn tại.');

    const assignments = await this.prisma.phanCongGiaoVien.findMany({
      where: { giaoVienId: teacher.id },
      include: {
        lopHoc: {
          include: {
            khoaHoc: { select: { tenKhoaHoc: true } },
            lichHoc: true,
          },
        },
      },
    });

    return this.serializeBigInt(assignments);
  }
}
