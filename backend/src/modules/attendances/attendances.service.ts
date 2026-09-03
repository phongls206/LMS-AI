import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  SubmitAttendanceDto,
  CreateSessionDto,
  GenerateSessionsDto,
  UpdateSessionDto,
} from './dto/attendances.dto';
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
    if (
      session.lopHoc?.trangThai === TrangThaiLopHoc.DANG_MO_DANG_KY ||
      session.lopHoc?.trangThai === TrangThaiLopHoc.SAP_MO
    ) {
      throw new BadRequestException(
        'Lớp học đang trong giai đoạn mở tuyển sinh, chưa chính thức vào học. Không thể thực hiện điểm danh buổi học!',
      );
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

  /**
   * Tự động sinh danh sách N buổi học chuẩn kèm ngày và tiêu đề giáo trình cho lớp học
   */
  async generateClassSessions(classId: number, dto?: GenerateSessionsDto) {
    const classRecord = await this.prisma.lopHoc.findUnique({
      where: { id: BigInt(classId) },
      include: { lichHoc: true, khoaHoc: true },
    });
    if (!classRecord) throw new NotFoundException('Lớp học không tồn tại.');

    const soBuoi = dto?.soBuoiHoc && dto.soBuoiHoc > 0 ? dto.soBuoiHoc : 12;

    const existingSessions = await this.prisma.buoiHoc.findMany({
      where: { lopHocId: BigInt(classId) },
      orderBy: { soThuTu: 'desc' },
      take: 1,
    });
    const startSeq = existingSessions.length > 0 ? existingSessions[0].soThuTu + 1 : 1;

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

    const schedules = classRecord.lichHoc;
    const sessionDates: { date: Date; startTime: Date; endTime: Date; room: string }[] = [];

    const defaultStartTime = new Date('1970-01-01T18:00:00');
    const defaultEndTime = new Date('1970-01-01T20:30:00');
    const defaultRoom = classRecord.phongHoc || 'Phòng A101';

    let currentDate = new Date(classRecord.ngayBatDau);
    if (isNaN(currentDate.getTime())) currentDate = new Date();

    if (schedules && schedules.length > 0) {
      let safetyCounter = 0;
      while (sessionDates.length < soBuoi && safetyCounter < 365) {
        const jsDay = currentDate.getDay(); // 0=CN, 1=T2...
        const sysDay = jsDay === 0 ? 8 : jsDay + 1; // 2..8

        const matchedSchedule = schedules.find((s) => Number(s.thuTrongTuan) === sysDay);
        if (matchedSchedule) {
          sessionDates.push({
            date: new Date(currentDate),
            startTime: matchedSchedule.gioBatDau ? new Date(matchedSchedule.gioBatDau) : defaultStartTime,
            endTime: matchedSchedule.gioKetThuc ? new Date(matchedSchedule.gioKetThuc) : defaultEndTime,
            room: matchedSchedule.phongHoc || defaultRoom,
          });
        }
        currentDate.setDate(currentDate.getDate() + 1);
        safetyCounter++;
      }
    } else {
      for (let i = 0; i < soBuoi; i++) {
        sessionDates.push({
          date: new Date(currentDate),
          startTime: defaultStartTime,
          endTime: defaultEndTime,
          room: defaultRoom,
        });
        currentDate.setDate(currentDate.getDate() + (i % 2 === 0 ? 2 : 3));
      }
    }

    const createdSessions = [];
    for (let i = 0; i < sessionDates.length; i++) {
      const seq = startSeq + i;
      const topicName =
        dto?.chuDeMoi && i === 0
          ? dto.chuDeMoi
          : defaultSyllabus[(seq - 1) % defaultSyllabus.length] || `Kỹ năng tiếng Anh thực hành`;
      const chuDe = `Buổi ${seq}: ${topicName}`;

      const session = await this.prisma.buoiHoc.create({
        data: {
          lopHocId: BigInt(classId),
          soThuTu: seq,
          ngayHoc: sessionDates[i].date,
          gioBatDau: sessionDates[i].startTime,
          gioKetThuc: sessionDates[i].endTime,
          phongHoc: sessionDates[i].room,
          chuDe,
          trangThai: TrangThaiBuoiHoc.CHUA_DIEN_RA,
        },
      });
      createdSessions.push(session);
    }

    return this.serializeBigInt(createdSessions);
  }

  /**
   * Tạo một buổi học lẻ cho lớp
   */
  async createSession(classId: number, dto: CreateSessionDto) {
    const classRecord = await this.prisma.lopHoc.findUnique({
      where: { id: BigInt(classId) },
    });
    if (!classRecord) throw new NotFoundException('Lớp học không tồn tại.');

    const startTime = dto.gioBatDau
      ? new Date(`1970-01-01T${dto.gioBatDau.length === 5 ? dto.gioBatDau + ':00' : dto.gioBatDau}`)
      : new Date('1970-01-01T18:00:00');
    const endTime = dto.gioKetThuc
      ? new Date(`1970-01-01T${dto.gioKetThuc.length === 5 ? dto.gioKetThuc + ':00' : dto.gioKetThuc}`)
      : new Date('1970-01-01T20:30:00');

    const session = await this.prisma.buoiHoc.create({
      data: {
        lopHocId: BigInt(classId),
        soThuTu: dto.soThuTu,
        ngayHoc: new Date(dto.ngayHoc),
        gioBatDau: startTime,
        gioKetThuc: endTime,
        phongHoc: dto.phongHoc?.trim() || classRecord.phongHoc || 'Phòng A101',
        chuDe: dto.chuDe || `Buổi ${dto.soThuTu}: Bài học chuyên đề`,
        trangThai: TrangThaiBuoiHoc.CHUA_DIEN_RA,
      },
    });

    return this.serializeBigInt(session);
  }

  /**
   * Cập nhật tiêu đề / ngày / giờ / phòng học của một buổi học
   */
  async updateSession(sessionId: number, dto: UpdateSessionDto) {
    const session = await this.prisma.buoiHoc.findUnique({
      where: { id: BigInt(sessionId) },
    });
    if (!session) throw new NotFoundException('Buổi học không tồn tại.');

    const updateData: any = {};
    if (dto.chuDe !== undefined) updateData.chuDe = dto.chuDe;
    if (dto.phongHoc !== undefined) updateData.phongHoc = dto.phongHoc?.trim() || null;
    if (dto.ngayHoc) updateData.ngayHoc = new Date(dto.ngayHoc);
    if (dto.gioBatDau) {
      updateData.gioBatDau = new Date(
        `1970-01-01T${dto.gioBatDau.length === 5 ? dto.gioBatDau + ':00' : dto.gioBatDau}`,
      );
    }
    if (dto.gioKetThuc) {
      updateData.gioKetThuc = new Date(
        `1970-01-01T${dto.gioKetThuc.length === 5 ? dto.gioKetThuc + ':00' : dto.gioKetThuc}`,
      );
    }

    const updated = await this.prisma.buoiHoc.update({
      where: { id: BigInt(sessionId) },
      data: updateData,
    });

    return this.serializeBigInt(updated);
  }

  /**
   * Xóa một buổi học (Bảo toàn dữ liệu điểm danh + Tự động dồn số thứ tự các buổi sau)
   */
  async deleteSession(sessionId: number) {
    const session = await this.prisma.buoiHoc.findUnique({
      where: { id: BigInt(sessionId) },
      include: {
        _count: { select: { diemDanh: true } },
      },
    });
    if (!session) throw new NotFoundException('Buổi học không tồn tại.');

    // 1. Kiểm tra an toàn: Buổi học đã hoàn thành hoặc đã có bản ghi điểm danh thì TUYỆT ĐỐI không cho xóa
    if (session.trangThai === TrangThaiBuoiHoc.DA_KET_THUC || session._count.diemDanh > 0) {
      throw new BadRequestException(
        `Buổi ${session.soThuTu} đã diễn ra và có dữ liệu điểm danh (${session._count.diemDanh} bản ghi). Không thể xóa để bảo toàn dữ liệu tính điểm và chuyên cần!`,
      );
    }

    const classId = session.lopHocId;
    const deletedOrder = session.soThuTu;

    // 2. ACID Transaction: Xóa buổi học + Sắp xếp lại thứ tự (đẩy Buổi 4 thành Buổi 3...)
    await this.prisma.$transaction(async (tx) => {
      // Xóa buổi học
      await tx.buoiHoc.delete({
        where: { id: BigInt(sessionId) },
      });

      // Lấy toàn bộ các buổi học phía sau để dồn số thứ tự
      const subsequentSessions = await tx.buoiHoc.findMany({
        where: {
          lopHocId: classId,
          soThuTu: { gt: deletedOrder },
        },
        orderBy: { soThuTu: 'asc' },
      });

      for (const s of subsequentSessions) {
        const newOrder = s.soThuTu - 1;
        let newChuDe = s.chuDe;
        if (newChuDe) {
          newChuDe = newChuDe.replace(
            new RegExp(`^Buổi\\s+${s.soThuTu}\\s*:?`, 'i'),
            `Buổi ${newOrder}:`,
          );
        }

        await tx.buoiHoc.update({
          where: { id: s.id },
          data: {
            soThuTu: newOrder,
            chuDe: newChuDe,
          },
        });
      }
    });

    return {
      message: `Đã xóa Buổi ${deletedOrder} và tự động cập nhật số thứ tự các buổi học tiếp theo thành công.`,
    };
  }
}
