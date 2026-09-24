import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateClassDto,
  CreateScheduleDto,
  UpdateClassScheduleDto,
  AssignTeacherDto,
  UpdateClassDto,
} from './dto/classes.dto';
import {
  TrangThaiLopHoc,
  TrangThaiKhoaHoc,
  VaiTroPhanCong,
  TrangThaiPhanCong,
  TrangThaiDangKy,
  TrangThaiHoaDon,
} from '@prisma/client';

@Injectable()
export class ClassesService {
  constructor(private prisma: PrismaService) {}

  // Quản lý trạng thái lớp học hoàn toàn thủ công theo chỉ đạo quản trị viên

  /**
   * Tự động kích hoạt trạng thái lớp học theo tiến độ thời gian thực:
   * 1. Khi LopHoc đến ngày ngayBatDau (ngayBatDau <= today):
   *    Tự động chuyển từ DANG_MO_DANG_KY sang DANG_HOC.
   * 2. Khi hết ngày ngayKetThuc (ngayKetThuc < today):
   *    Tự động chuyển từ DANG_HOC sang DA_KET_THUC.
   */
  async autoUpdateClassStatuses(): Promise<{ startedCount: number; endedCount: number }> {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // 1. Chuyển DANG_MO_DANG_KY -> DANG_HOC khi ngayBatDau <= today
    const started = await this.prisma.lopHoc.updateMany({
      where: {
        trangThai: TrangThaiLopHoc.DANG_MO_DANG_KY,
        ngayBatDau: {
          lte: today,
        },
      },
      data: {
        trangThai: TrangThaiLopHoc.DANG_HOC,
      },
    });

    // 2. Chuyển DANG_HOC -> DA_KET_THUC khi hết ngày ngayKetThuc (ngayKetThuc < today)
    const ended = await this.prisma.lopHoc.updateMany({
      where: {
        trangThai: TrangThaiLopHoc.DANG_HOC,
        ngayKetThuc: {
          lt: today,
        },
      },
      data: {
        trangThai: TrangThaiLopHoc.DA_KET_THUC,
      },
    });

    return {
      startedCount: started.count,
      endedCount: ended.count,
    };
  }

  private serializeBigInt(obj: any) {
    return JSON.parse(
      JSON.stringify(obj, (key, value) =>
        typeof value === 'bigint' ? Number(value) : value,
      ),
    );
  }

  private parseTimeString(timeStr: string): Date {
    if (!timeStr) {
      throw new BadRequestException('Giờ học không được để trống.');
    }
    const parts = timeStr.trim().split(':');
    if (parts.length < 2) {
      throw new BadRequestException(`Định dạng giờ học không hợp lệ: "${timeStr}". Vui lòng nhập định dạng HH:mm (ví dụ 08:00 hoặc 8:00).`);
    }
    const hh = parts[0].padStart(2, '0');
    const mm = (parts[1] || '00').padStart(2, '0');
    const ss = (parts[2] || '00').padStart(2, '0');
    const d = new Date(`1970-01-01T${hh}:${mm}:${ss}Z`);
    if (isNaN(d.getTime())) {
      throw new BadRequestException(`Thời gian không hợp lệ: "${timeStr}". Vui lòng nhập định dạng HH:mm.`);
    }
    return d;
  }

  private getDayLabel(thu: number): string {
    if (thu === 8) return 'Chủ Nhật';
    return `Thứ ${thu}`;
  }

  private formatTimeDisplay(d: Date | string): string {
    if (!d) return '';
    if (typeof d === 'string') {
      if (d.includes('T')) return d.substring(11, 16);
      return d.substring(0, 5);
    }
    return d.toISOString().substring(11, 16);
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
        lichHoc: {
          orderBy: [
            { thuTrongTuan: 'asc' },
            { gioBatDau: 'asc' },
          ],
        },
        buoiHoc: { select: { id: true, soThuTu: true, ngayHoc: true, chuDe: true, trangThai: true, phongHoc: true } },
        _count: { select: { buoiHoc: true, dangKyHoc: true } },
        dangKyHoc: {
          select: { hocVienId: true, trangThai: true },
        },
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
        lichHoc: {
          orderBy: [
            { thuTrongTuan: 'asc' },
            { gioBatDau: 'asc' },
          ],
        },
        buoiHoc: { orderBy: { soThuTu: 'asc' } },
        phanCong: {
          where: { trangThai: 'DANG_PHU_TRACH' },
          orderBy: { id: 'desc' },
          include: {
            giaoVien: { select: { id: true, maGiaoVien: true, hoTen: true, chuyenMon: true } },
          },
        },
        dangKyHoc: {
          orderBy: { id: 'asc' },
          include: {
            hocVien: {
              select: {
                id: true,
                maHocVien: true,
                hoTen: true,
                trinhDoCEFR: true,
                gioiTinh: true,
                ngaySinh: true,
                diaChi: true,
                trangThai: true,
                nguoiDung: {
                  select: {
                    email: true,
                    soDienThoai: true,
                  },
                },
              },
            },
            hoaDon: {
              select: {
                id: true,
                maHoaDon: true,
                soTienPhaiTra: true,
                soTienDaTra: true,
                trangThai: true,
                hanThanhToan: true,
              },
            },
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
      const cleanTopic = topic.replace(/^Buổi\s+\d+\s*:\s*/i, '');
      await this.prisma.buoiHoc.create({
        data: {
          lopHocId: newClass.id,
          soThuTu: i + 1,
          ngayHoc: new Date(sessDate),
          gioBatDau: new Date('1970-01-01T18:00:00'),
          gioKetThuc: new Date('1970-01-01T20:30:00'),
          phongHoc: dto.phongHoc || 'Phòng A101',
          chuDe: cleanTopic,
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

    const cleanRoom = dto.phongHoc.trim();
    const displayRoom = cleanRoom.toLowerCase().startsWith('phòng') ? cleanRoom : `Phòng ${cleanRoom}`;

    // 1. Business Rule: Kiểm tra trùng giờ trong chính lớp học này (Same Class Overlap)
    const conflictInClass = await this.prisma.lichHoc.findFirst({
      where: {
        lopHocId: BigInt(classId),
        thuTrongTuan: dto.thuTrongTuan,
        AND: [
          { gioBatDau: { lt: gioKetThuc } },
          { gioKetThuc: { gt: gioBatDau } },
        ],
      },
    });

    if (conflictInClass) {
      const bdStr = this.formatTimeDisplay(conflictInClass.gioBatDau);
      const ktStr = this.formatTimeDisplay(conflictInClass.gioKetThuc);
      throw new ConflictException(
        `Lớp học này đã có ca học vào ${this.getDayLabel(dto.thuTrongTuan)} trong khung giờ ${bdStr} - ${ktStr} (${conflictInClass.phongHoc}). Không thể xếp 2 ca học đè lên nhau trong cùng một lớp!`,
      );
    }

    // 2. Business Rule: Kiểm tra trùng phòng học với lớp khác (Room Conflict)
    const conflictingRoom = await this.prisma.lichHoc.findFirst({
      where: {
        thuTrongTuan: dto.thuTrongTuan,
        phongHoc: { equals: cleanRoom, mode: 'insensitive' },
        lopHocId: { not: BigInt(classId) },
        lopHoc: {
          trangThai: { not: TrangThaiLopHoc.DA_HUY },
        },
        AND: [
          { gioBatDau: { lt: gioKetThuc } },
          { gioKetThuc: { gt: gioBatDau } },
        ],
      },
      include: { lopHoc: { select: { maLopHoc: true, tenLopHoc: true } } },
    });

    if (conflictingRoom) {
      const bdStr = this.formatTimeDisplay(conflictingRoom.gioBatDau);
      const ktStr = this.formatTimeDisplay(conflictingRoom.gioKetThuc);
      throw new ConflictException(
        `${displayRoom} đã được xếp cho lớp "${conflictingRoom.lopHoc.tenLopHoc}" (${conflictingRoom.lopHoc.maLopHoc}) vào ${this.getDayLabel(dto.thuTrongTuan)} (${bdStr} - ${ktStr}).`,
      );
    }

    // 3. Business Rule: Kiểm tra trùng lịch giảng dạy của giáo viên phụ trách lớp này (Teacher Conflict)
    const assignedTeachers = await this.prisma.phanCongGiaoVien.findMany({
      where: {
        lopHocId: BigInt(classId),
        trangThai: TrangThaiPhanCong.DANG_PHU_TRACH,
      },
      include: { giaoVien: true },
    });

    for (const asg of assignedTeachers) {
      const teacherConflict = await this.prisma.phanCongGiaoVien.findFirst({
        where: {
          giaoVienId: asg.giaoVienId,
          trangThai: TrangThaiPhanCong.DANG_PHU_TRACH,
          lopHocId: { not: BigInt(classId) },
          lopHoc: {
            trangThai: { in: [TrangThaiLopHoc.DANG_HOC, TrangThaiLopHoc.DANG_MO_DANG_KY] },
            lichHoc: {
              some: {
                thuTrongTuan: dto.thuTrongTuan,
                gioBatDau: { lt: gioKetThuc },
                gioKetThuc: { gt: gioBatDau },
              },
            },
          },
        },
        include: {
          lopHoc: {
            select: {
              maLopHoc: true,
              tenLopHoc: true,
              lichHoc: {
                where: {
                  thuTrongTuan: dto.thuTrongTuan,
                  gioBatDau: { lt: gioKetThuc },
                  gioKetThuc: { gt: gioBatDau },
                },
              },
            },
          },
        },
      });

      if (teacherConflict) {
        const match = teacherConflict.lopHoc.lichHoc[0];
        const bd = match ? this.formatTimeDisplay(match.gioBatDau) : '';
        const kt = match ? this.formatTimeDisplay(match.gioKetThuc) : '';
        throw new ConflictException(
          `Giáo viên ${asg.giaoVien.hoTen} phụ trách lớp này đã có lịch dạy lớp "${teacherConflict.lopHoc.tenLopHoc}" (${teacherConflict.lopHoc.maLopHoc}) vào ${this.getDayLabel(dto.thuTrongTuan)} (${bd} - ${kt}). Không thể xếp lịch trùng giờ cho giáo viên!`,
        );
      }
    }

    const schedule = await this.prisma.lichHoc.create({
      data: {
        lopHocId: BigInt(classId),
        thuTrongTuan: dto.thuTrongTuan,
        gioBatDau,
        gioKetThuc,
        phongHoc: cleanRoom,
      },
    });

    return this.serializeBigInt(schedule);
  }

  /**
   * UC004 — Cập nhật / Thay thế thời khóa biểu cho lớp học
   * - Hỗ trợ xếp lịch nhiều ngày một lúc không bị cộng dồn
   * - Mặc định replaceExisting: true (xóa lịch cũ, thay bằng lịch mới)
   * - Kiểm tra chống trùng phòng với lớp khác và trùng lịch giáo viên
   */
  async updateClassSchedule(classId: number, dto: UpdateClassScheduleDto) {
    const classRecord = await this.findById(classId);
    if (classRecord.trangThai === TrangThaiLopHoc.DA_HUY) {
      throw new BadRequestException('Không thể xếp lịch cho lớp học đã bị hủy.');
    }
    if (classRecord.trangThai === TrangThaiLopHoc.DA_KET_THUC) {
      throw new BadRequestException('Không thể xếp lịch cho lớp học đã kết thúc.');
    }

    if (!dto.thuTrongTuan || dto.thuTrongTuan.length === 0) {
      throw new BadRequestException('Vui lòng chọn ít nhất một ngày học trong tuần.');
    }

    const gioBatDau = this.parseTimeString(dto.gioBatDau);
    const gioKetThuc = this.parseTimeString(dto.gioKetThuc);

    if (gioKetThuc <= gioBatDau) {
      throw new BadRequestException('Giờ kết thúc phải sau giờ bắt đầu.');
    }

    const cleanRoom = dto.phongHoc.trim();
    const displayRoom = cleanRoom.toLowerCase().startsWith('phòng') ? cleanRoom : `Phòng ${cleanRoom}`;
    const replaceExisting = dto.replaceExisting !== false;

    // 1. Kiểm tra xung đột với phòng học của các lớp khác & chính lớp (nếu không replace)
    for (const thu of dto.thuTrongTuan) {
      const dayLabel = this.getDayLabel(thu);

      // Nếu không replace: kiểm tra trùng trong chính lớp
      if (!replaceExisting) {
        const conflictInClass = await this.prisma.lichHoc.findFirst({
          where: {
            lopHocId: BigInt(classId),
            thuTrongTuan: thu,
            AND: [
              { gioBatDau: { lt: gioKetThuc } },
              { gioKetThuc: { gt: gioBatDau } },
            ],
          },
        });
        if (conflictInClass) {
          const bdStr = this.formatTimeDisplay(conflictInClass.gioBatDau);
          const ktStr = this.formatTimeDisplay(conflictInClass.gioKetThuc);
          throw new ConflictException(
            `Lớp học này đã có ca học vào ${dayLabel} (${bdStr} - ${ktStr}). Không thể thêm ca học trùng giờ!`,
          );
        }
      }

      // Kiểm tra trùng phòng học với lớp khác
      const conflictingRoom = await this.prisma.lichHoc.findFirst({
        where: {
          thuTrongTuan: thu,
          phongHoc: { equals: cleanRoom, mode: 'insensitive' },
          lopHocId: { not: BigInt(classId) },
          lopHoc: {
            trangThai: { not: TrangThaiLopHoc.DA_HUY },
          },
          AND: [
            { gioBatDau: { lt: gioKetThuc } },
            { gioKetThuc: { gt: gioBatDau } },
          ],
        },
        include: { lopHoc: { select: { maLopHoc: true, tenLopHoc: true } } },
      });

      if (conflictingRoom) {
        const bdStr = this.formatTimeDisplay(conflictingRoom.gioBatDau);
        const ktStr = this.formatTimeDisplay(conflictingRoom.gioKetThuc);
        throw new ConflictException(
          `${displayRoom} đã được xếp cho lớp "${conflictingRoom.lopHoc.tenLopHoc}" (${conflictingRoom.lopHoc.maLopHoc}) vào ${dayLabel} (${bdStr} - ${ktStr}).`,
        );
      }

      // Kiểm tra trùng lịch giảng dạy của giáo viên phụ trách lớp này với các lớp khác
      const assignedTeachers = await this.prisma.phanCongGiaoVien.findMany({
        where: {
          lopHocId: BigInt(classId),
          trangThai: TrangThaiPhanCong.DANG_PHU_TRACH,
        },
        include: { giaoVien: true },
      });

      for (const asg of assignedTeachers) {
        const teacherConflict = await this.prisma.phanCongGiaoVien.findFirst({
          where: {
            giaoVienId: asg.giaoVienId,
            trangThai: TrangThaiPhanCong.DANG_PHU_TRACH,
            lopHocId: { not: BigInt(classId) },
            lopHoc: {
              trangThai: { in: [TrangThaiLopHoc.DANG_HOC, TrangThaiLopHoc.DANG_MO_DANG_KY] },
              lichHoc: {
                some: {
                  thuTrongTuan: thu,
                  gioBatDau: { lt: gioKetThuc },
                  gioKetThuc: { gt: gioBatDau },
                },
              },
            },
          },
          include: {
            lopHoc: {
              select: {
                maLopHoc: true,
                tenLopHoc: true,
                lichHoc: {
                  where: {
                    thuTrongTuan: thu,
                    gioBatDau: { lt: gioKetThuc },
                    gioKetThuc: { gt: gioBatDau },
                  },
                },
              },
            },
          },
        });

        if (teacherConflict) {
          const match = teacherConflict.lopHoc.lichHoc[0];
          const bd = match ? this.formatTimeDisplay(match.gioBatDau) : '';
          const kt = match ? this.formatTimeDisplay(match.gioKetThuc) : '';
          throw new ConflictException(
            `Giáo viên ${asg.giaoVien.hoTen} phụ trách lớp này đã có lịch dạy lớp "${teacherConflict.lopHoc.tenLopHoc}" (${teacherConflict.lopHoc.maLopHoc}) vào ${dayLabel} (${bd} - ${kt}).`,
          );
        }
      }
    }

    // Thực hiện lưu trong Transaction
    await this.prisma.$transaction(async (tx) => {
      if (replaceExisting) {
        await tx.lichHoc.deleteMany({
          where: { lopHocId: BigInt(classId) },
        });
      }

      for (const thu of dto.thuTrongTuan) {
        await tx.lichHoc.create({
          data: {
            lopHocId: BigInt(classId),
            thuTrongTuan: thu,
            gioBatDau,
            gioKetThuc,
            phongHoc: cleanRoom,
          },
        });
      }

      await tx.lopHoc.update({
        where: { id: BigInt(classId) },
        data: { phongHoc: cleanRoom },
      });

      // Tự động đồng bộ lại ngày & giờ của các buổi học chưa điểm danh theo đúng lịch học mới
      const existingSessions = await tx.buoiHoc.findMany({
        where: { lopHocId: BigInt(classId) },
        include: { _count: { select: { diemDanh: true } } },
        orderBy: { soThuTu: 'asc' },
      });

      const unAttendedSessions = existingSessions.filter((s) => s._count.diemDanh === 0);
      if (unAttendedSessions.length > 0) {
        const allSchedules = await tx.lichHoc.findMany({
          where: { lopHocId: BigInt(classId) },
          orderBy: [{ thuTrongTuan: 'asc' }, { gioBatDau: 'asc' }],
        });

        if (allSchedules.length > 0) {
          let curr = new Date(classRecord.ngayBatDau);
          if (isNaN(curr.getTime())) curr = new Date();
          let idx = 0;
          let safety = 0;

          while (idx < unAttendedSessions.length && safety < 365) {
            const jsDay = curr.getDay();
            const sysDay = jsDay === 0 ? 8 : jsDay + 1;
            const match = allSchedules.find((s) => s.thuTrongTuan === sysDay);
            if (match) {
              await tx.buoiHoc.update({
                where: { id: unAttendedSessions[idx].id },
                data: {
                  ngayHoc: new Date(curr),
                  gioBatDau: match.gioBatDau,
                  gioKetThuc: match.gioKetThuc,
                  phongHoc: match.phongHoc || cleanRoom,
                },
              });
              idx++;
            }
            curr.setDate(curr.getDate() + 1);
            safety++;
          }
        }
      }
    });

    const updated = await this.prisma.lichHoc.findMany({
      where: { lopHocId: BigInt(classId) },
      orderBy: [{ thuTrongTuan: 'asc' }, { gioBatDau: 'asc' }],
    });

    return this.serializeBigInt(updated);
  }

  /**
   * UC004 — Xóa một lịch học trong tuần của lớp (cho phép xóa buổi/thứ đã xếp trước đó)
   */
  async deleteSchedule(classId: number, scheduleId: number) {
    const schedule = await this.prisma.lichHoc.findUnique({
      where: { id: BigInt(scheduleId) },
    });
    if (!schedule || Number(schedule.lopHocId) !== classId) {
      throw new NotFoundException('Không tìm thấy lịch học cần xóa.');
    }
    await this.prisma.lichHoc.delete({
      where: { id: BigInt(scheduleId) },
    });
    return { success: true, message: 'Đã xóa lịch học thành công' };
  }

  /**
   * UC004 — Xóa toàn bộ lịch học của lớp
   */
  async clearAllSchedules(classId: number) {
    await this.findById(classId);
    await this.prisma.lichHoc.deleteMany({
      where: { lopHocId: BigInt(classId) },
    });
    return { success: true, message: 'Đã xóa toàn bộ lịch học của lớp thành công.' };
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
    if (teacher.trangThai === 'DA_NGHI_VIEC') {
      throw new BadRequestException('Không thể phân công giáo viên đã nghỉ việc.');
    }

    // Kiểm tra lịch học của lớp này có bị trùng với các lớp khác giáo viên đang dạy không
    const classSchedules = await this.prisma.lichHoc.findMany({
      where: { lopHocId: BigInt(classId) },
    });

    for (const sch of classSchedules) {
      const conflict = await this.prisma.phanCongGiaoVien.findFirst({
        where: {
          giaoVienId: BigInt(dto.giaoVienId),
          trangThai: TrangThaiPhanCong.DANG_PHU_TRACH,
          lopHoc: {
            id: { not: BigInt(classId) },
            trangThai: { in: [TrangThaiLopHoc.DANG_HOC, TrangThaiLopHoc.DANG_MO_DANG_KY] },
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

      if (conflict) {
        throw new ConflictException(
          `Giáo viên ${teacher.hoTen} đã có lịch dạy lớp ${conflict.lopHoc.tenLopHoc} vào Thứ ${sch.thuTrongTuan}.`,
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
            vaiTroPhanCong: VaiTroPhanCong.CHINH,
            trangThai: TrangThaiPhanCong.DANG_PHU_TRACH,
          },
          data: { trangThai: TrangThaiPhanCong.DA_HUY },
        });
      }

      return tx.phanCongGiaoVien.create({
        data: {
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
            lichHoc: {
              orderBy: [
                { thuTrongTuan: 'asc' },
                { gioBatDau: 'asc' },
              ],
            },
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
      include: {
        dangKyHoc: {
          include: { hoaDon: true },
        },
      },
    });
    if (!classRecord) throw new NotFoundException('Không tìm thấy lớp học.');

    const updated = await this.prisma.$transaction(async (tx) => {
      // 1. Cập nhật trạng thái lớp học
      const res = await tx.lopHoc.update({
        where: { id: BigInt(id) },
        data: {
          trangThai,
          ...(trangThai === TrangThaiLopHoc.DA_HUY ? { siSoHienTai: 0 } : {}),
        },
      });

      // 2. Nếu lớp học bị HỦY (DA_HUY):
      // - Chuyển các đăng ký đang chờ thanh toán sang DA_HUY
      // - Chuyển các hóa đơn chưa thanh toán của lớp đó sang DA_HUY
      if (trangThai === TrangThaiLopHoc.DA_HUY) {
        await tx.dangKyHoc.updateMany({
          where: {
            lopHocId: BigInt(id),
            trangThai: TrangThaiDangKy.CHO_THANH_TOAN,
          },
          data: { trangThai: TrangThaiDangKy.DA_HUY },
        });

        const pendingEnrollmentIds = classRecord.dangKyHoc
          .filter(
            (e) =>
              e.trangThai === TrangThaiDangKy.CHO_THANH_TOAN &&
              e.hoaDon?.trangThai === TrangThaiHoaDon.CHUA_THANH_TOAN,
          )
          .map((e) => e.id);

        if (pendingEnrollmentIds.length > 0) {
          await tx.hoaDon.updateMany({
            where: {
              dangKyHocId: { in: pendingEnrollmentIds },
              trangThai: TrangThaiHoaDon.CHUA_THANH_TOAN,
            },
            data: { trangThai: TrangThaiHoaDon.DA_HUY },
          });
        }
      }

      // 3. Nếu lớp học KẾT THÚC (DA_KET_THUC):
      // - Chuyển các học viên đã xác nhận (DA_XAC_NHAN) sang trạng thái HOAN_THANH
      if (trangThai === TrangThaiLopHoc.DA_KET_THUC) {
        await tx.dangKyHoc.updateMany({
          where: {
            lopHocId: BigInt(id),
            trangThai: TrangThaiDangKy.DA_XAC_NHAN,
          },
          data: { trangThai: TrangThaiDangKy.HOAN_THANH },
        });
      }

      return res;
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
    if (dto.tenLopHoc !== undefined && dto.tenLopHoc.trim() !== '') {
      updateData.tenLopHoc = dto.tenLopHoc.trim();
    }
    if (dto.siSoToiDa !== undefined && !isNaN(Number(dto.siSoToiDa))) {
      updateData.siSoToiDa = Number(dto.siSoToiDa);
    }
    if (dto.phongHoc !== undefined) {
      updateData.phongHoc = dto.phongHoc.trim();
    }
    if (dto.linkOnline !== undefined) {
      updateData.linkOnline = dto.linkOnline.trim();
    }
    if (dto.ngayBatDau && dto.ngayBatDau.trim() !== '') {
      const d = new Date(dto.ngayBatDau);
      if (!isNaN(d.getTime())) updateData.ngayBatDau = d;
    }
    if (dto.ngayKetThuc && dto.ngayKetThuc.trim() !== '') {
      const d = new Date(dto.ngayKetThuc);
      if (!isNaN(d.getTime())) updateData.ngayKetThuc = d;
    }

    const updated = await this.prisma.lopHoc.update({
      where: { id: BigInt(id) },
      data: updateData,
    });

    if (dto.phongHoc && dto.phongHoc.trim() !== '') {
      await this.prisma.lichHoc.updateMany({
        where: { lopHocId: BigInt(id) },
        data: { phongHoc: dto.phongHoc.trim() },
      });
    }

    return this.serializeBigInt(updated);
  }
}
