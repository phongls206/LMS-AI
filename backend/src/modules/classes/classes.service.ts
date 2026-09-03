import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateClassDto, CreateScheduleDto, AssignTeacherDto, UpdateClassDto } from './dto/classes.dto';
import { TrangThaiLopHoc, TrangThaiKhoaHoc, VaiTroPhanCong, TrangThaiPhanCong } from '@prisma/client';

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
        buoiHoc: { select: { id: true, soThuTu: true, ngayHoc: true, chuDe: true, trangThai: true, phongHoc: true } },
        _count: { select: { buoiHoc: true, dangKyHoc: true } },
        phanCong: {
          where: { trangThai: 'DANG_PHU_TRACH' },
          orderBy: { id: 'desc' },
          include: {
            giaoVien: { select: { id: true, maGiaoVien: true, hoTen: true } },
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
        buoiHoc: { orderBy: { soThuTu: 'asc' } },
        phanCong: {
          where: { trangThai: 'DANG_PHU_TRACH' },
          orderBy: { id: 'desc' },
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

    if (course.trangThai === TrangThaiKhoaHoc.NGUNG_HOAT_DONG) {
      throw new BadRequestException(
        `Khóa học "${course.tenKhoaHoc}" hiện đang tạm ngừng tuyển sinh. Không thể mở lớp học mới cho khóa này.`
      );
    }

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

    // Tự động sinh danh sách buổi học giáo trình cho lớp học mới
    const soBuoi = dto.soBuoiHoc && dto.soBuoiHoc > 0 ? dto.soBuoiHoc : 12;
    const defaultSyllabus = [
      'Orientation, Placement Test & Study Guide',
      'Unit 1: Pronunciation & Core Vocabulary',
      'Unit 2: Listening Strategies & Audio Comprehension',
      'Unit 3: Reading Techniques (Skimming & Scanning)',
      'Unit 4: Grammar Mastery & Sentence Building',
      'Mid-term Assessment & Instructor Feedback (Kiểm tra giữa kỳ)',
      'Unit 5: Interactive Speaking & Conversational Flow',
      'Unit 6: Idioms, Collocations & Advanced Lexicon',
      'Unit 7: Practical Writing & Paragraph Coherence',
      'Unit 8: Presentation Skills & Critical Debating',
      'Comprehensive Course Review & Final Exam Prep',
      'Final Proficiency Test & Performance Evaluation (Kiểm tra cuối kỳ)',
    ];

    let sessDate = new Date(dto.ngayBatDau);
    if (isNaN(sessDate.getTime())) sessDate = new Date();
    for (let i = 0; i < soBuoi; i++) {
      const topic = defaultSyllabus[i % defaultSyllabus.length] || `Kỹ năng tiếng Anh thực hành`;
      await this.prisma.buoiHoc.create({
        data: {
          lopHocId: newClass.id,
          soThuTu: i + 1,
          ngayHoc: new Date(sessDate),
          gioBatDau: new Date('1970-01-01T18:00:00'),
          gioKetThuc: new Date('1970-01-01T20:30:00'),
          phongHoc: dto.phongHoc || 'Phòng A101',
          chuDe: `Buổi ${i + 1}: ${topic}`,
        },
      });
      sessDate.setDate(sessDate.getDate() + (i % 2 === 0 ? 2 : 3));
    }

    return this.serializeBigInt(newClass);
  }

  /**
   * UC004 — Thêm lịch học tuần & Kiểm tra CHỐNG TRÙNG PHÒNG
   */
  async addSchedule(classId: number, dto: CreateScheduleDto) {
    const classRecord = await this.findById(classId);
    if (classRecord.trangThai === TrangThaiLopHoc.DA_HUY) {
      throw new BadRequestException('Không thể thêm lịch học cho lớp học đã bị hủy.');
    }
    if (classRecord.trangThai === TrangThaiLopHoc.DA_KET_THUC) {
      throw new BadRequestException('Không thể thêm lịch học cho lớp học đã kết thúc.');
    }

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
    if (classRecord.trangThai === TrangThaiLopHoc.DA_HUY) {
      throw new BadRequestException('Không thể phân công giáo viên cho lớp học đã bị hủy.');
    }
    if (classRecord.trangThai === TrangThaiLopHoc.DA_KET_THUC) {
      throw new BadRequestException('Không thể phân công giáo viên cho lớp học đã kết thúc.');
    }

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

    const role = dto.vaiTroPhanCong || VaiTroPhanCong.CHINH;

    const assignment = await this.prisma.$transaction(async (tx) => {
      // Nếu phân công giáo viên chính -> Hủy trạng thái phụ trách của giáo viên chính cũ để tránh chồng lấn
      if (role === VaiTroPhanCong.CHINH) {
        await tx.phanCongGiaoVien.updateMany({
          where: {
            lopHocId: BigInt(classId),
            giaoVienId: { not: BigInt(dto.giaoVienId) },
            vaiTroPhanCong: VaiTroPhanCong.CHINH,
            trangThai: 'DANG_PHU_TRACH',
          },
          data: {
            trangThai: 'DA_HUY',
          },
        });
      }

      return tx.phanCongGiaoVien.upsert({
        where: {
          lopHocId_giaoVienId: {
            lopHocId: BigInt(classId),
            giaoVienId: BigInt(dto.giaoVienId),
          },
        },
        update: {
          vaiTroPhanCong: role,
          trangThai: 'DANG_PHU_TRACH',
          thoiGianPhanCong: new Date(),
        },
        create: {
          lopHocId: BigInt(classId),
          giaoVienId: BigInt(dto.giaoVienId),
          vaiTroPhanCong: role,
          trangThai: 'DANG_PHU_TRACH',
        },
        include: {
          giaoVien: { select: { id: true, maGiaoVien: true, hoTen: true } },
          lopHoc: { select: { id: true, maLopHoc: true, tenLopHoc: true } },
        },
      });
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
      where: {
        giaoVienId: teacher.id,
        trangThai: TrangThaiPhanCong.DANG_PHU_TRACH,
        lopHoc: { trangThai: { not: TrangThaiLopHoc.DA_HUY } },
      },
      include: {
        lopHoc: {
          include: {
            khoaHoc: { select: { tenKhoaHoc: true, maKhoaHoc: true, trinhDoYeuCau: true } },
            lichHoc: true,
            buoiHoc: {
              orderBy: { soThuTu: 'asc' },
              include: {
                _count: { select: { diemDanh: true } },
              },
            },
            _count: { select: { dangKyHoc: true } },
          },
        },
      },
      orderBy: { id: 'desc' },
    });

    return this.serializeBigInt(assignments);
  }

  /**
   * UC004 — Đổi trạng thái lớp học (SAP_MO, DANG_MO_DANG_KY, DANG_HOC, DA_KET_THUC, DA_HUY)
   */
  async updateClassStatus(id: number, trangThai: TrangThaiLopHoc) {
    const classRecord = await this.prisma.lopHoc.findUnique({
      where: { id: BigInt(id) },
    });
    if (!classRecord) throw new NotFoundException('Không tìm thấy lớp học.');

    const updated = await this.prisma.lopHoc.update({
      where: { id: BigInt(id) },
      data: { trangThai },
    });

    return this.serializeBigInt(updated);
  }

  /**
   * UC004 — Cập nhật thông tin lớp học (phòng học, tên lớp, sĩ số, ngày học)
   */
  async updateClass(id: number, dto: UpdateClassDto) {
    const classRecord = await this.prisma.lopHoc.findUnique({
      where: { id: BigInt(id) },
    });
    if (!classRecord) throw new NotFoundException('Không tìm thấy lớp học.');

    const updateData: any = {};
    if (dto.tenLopHoc !== undefined) updateData.tenLopHoc = dto.tenLopHoc;
    if (dto.siSoToiDa !== undefined) updateData.siSoToiDa = dto.siSoToiDa;
    if (dto.phongHoc !== undefined) updateData.phongHoc = dto.phongHoc;
    if (dto.ngayBatDau !== undefined) updateData.ngayBatDau = new Date(dto.ngayBatDau);
    if (dto.ngayKetThuc !== undefined) updateData.ngayKetThuc = new Date(dto.ngayKetThuc);

    const updated = await this.prisma.lopHoc.update({
      where: { id: BigInt(id) },
      data: updateData,
    });

    return this.serializeBigInt(updated);
  }
}
