import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateEnrollmentDto, CreatePaymentDto } from './dto/enrollments.dto';
import {
  TrangThaiDangKy,
  TrangThaiHoaDon,
  TrangThaiThanhToan,
  TrangThaiLopHoc,
  TrangThaiKhoaHoc,
  TrinhDoCEFR,
} from '@prisma/client';

const CEFR_RANKS: Record<TrinhDoCEFR, number> = {
  A1: 1,
  A2: 2,
  B1: 3,
  B2: 4,
  C1: 5,
  C2: 6,
};

@Injectable()
export class EnrollmentsService {
  constructor(private prisma: PrismaService) {}

  private serializeBigInt(obj: any) {
    return JSON.parse(
      JSON.stringify(obj, (key, value) =>
        typeof value === 'bigint' ? Number(value) : value,
      ),
    );
  }

  /**
   * UC006 — Đăng ký lớp học (Kiểm tra 4 điều kiện nghiệp vụ + ACID Transaction)
   */
  async createEnrollment(dto: CreateEnrollmentDto) {
    // 1. Kiểm tra Lớp học tồn tại & Sĩ số
    const classRecord = await this.prisma.lopHoc.findUnique({
      where: { id: BigInt(dto.lopHocId) },
      include: {
        khoaHoc: true,
        lichHoc: true,
      },
    });

    if (!classRecord) throw new NotFoundException('Lớp học không tồn tại.');

    // Kiểm tra trạng thái Khóa học: Nếu tạm ngừng tuyển sinh thì tuyệt đối không cho đăng ký
    if (classRecord.khoaHoc?.trangThai === TrangThaiKhoaHoc.NGUNG_HOAT_DONG) {
      throw new BadRequestException(
        `Khóa học "${classRecord.khoaHoc.tenKhoaHoc}" hiện đang tạm ngừng tuyển sinh. Không thể tiếp nhận học viên đăng ký vào lớp này.`
      );
    }

    if (classRecord.trangThai === TrangThaiLopHoc.DA_HUY) {
      throw new BadRequestException('Lớp học này đã bị hủy, không thể tiếp nhận đăng ký mới.');
    }

    if (classRecord.trangThai === TrangThaiLopHoc.DA_KET_THUC) {
      throw new BadRequestException('Lớp học này đã kết thúc khóa học, không thể đăng ký mới.');
    }

    if (
      classRecord.trangThai !== TrangThaiLopHoc.DANG_MO_DANG_KY &&
      classRecord.trangThai !== TrangThaiLopHoc.SAP_MO &&
      classRecord.trangThai !== TrangThaiLopHoc.DANG_HOC
    ) {
      throw new BadRequestException(`Lớp học hiện ở trạng thái "${classRecord.trangThai}", chưa mở tiếp nhận ghi danh.`);
    }

    if (classRecord.siSoHienTai >= classRecord.siSoToiDa) {
      throw new BadRequestException(
        `Lớp học đã đủ sĩ số tối đa (${classRecord.siSoToiDa} học viên).`,
      );
    }

    // 2. Kiểm tra Học viên tồn tại & chưa đăng ký lớp này
    const student = await this.prisma.hoSoHocVien.findUnique({
      where: { id: BigInt(dto.hocVienId) },
    });
    if (!student) throw new NotFoundException('Học viên không tồn tại.');

    const existingEnrollment = await this.prisma.dangKyHoc.findUnique({
      where: {
        lopHocId_hocVienId: {
          lopHocId: BigInt(dto.lopHocId),
          hocVienId: BigInt(dto.hocVienId),
        },
      },
      include: { hoaDon: true },
    });

    if (existingEnrollment) {
      if (existingEnrollment.trangThai !== TrangThaiDangKy.DA_HUY) {
        throw new ConflictException('Học viên đã đăng ký lớp học này trước đó.');
      }

      // Nếu đã từng hủy, cho phép tái kích hoạt đăng ký (Reactivate)
      // 3. Kiểm tra Trình độ CEFR học viên >= Yêu cầu của khóa học
      const studentRank = CEFR_RANKS[student.trinhDoCEFR];
      const courseRank = CEFR_RANKS[classRecord.khoaHoc.trinhDoYeuCau];

      if (studentRank < courseRank) {
        throw new BadRequestException(
          `Trình độ hiện tại của học viên (${student.trinhDoCEFR}) chưa đạt yêu cầu đầu vào của khóa học (${classRecord.khoaHoc.trinhDoYeuCau}).`,
        );
      }

      // 4. Kiểm tra Lịch học xung đột
      const studentActiveSchedules = await this.prisma.lichHoc.findMany({
        where: {
          lopHoc: {
            dangKyHoc: {
              some: {
                hocVienId: BigInt(dto.hocVienId),
                trangThai: { in: [TrangThaiDangKy.CHO_THANH_TOAN, TrangThaiDangKy.DA_XAC_NHAN] },
              },
            },
            trangThai: { in: [TrangThaiLopHoc.DANG_MO_DANG_KY, TrangThaiLopHoc.DANG_HOC] },
          },
        },
        include: { lopHoc: { select: { tenLopHoc: true } } },
      });

      for (const newSch of classRecord.lichHoc) {
        const conflict = studentActiveSchedules.find(
          (activeSch) =>
            activeSch.thuTrongTuan === newSch.thuTrongTuan &&
            activeSch.gioBatDau < newSch.gioKetThuc &&
            activeSch.gioKetThuc > newSch.gioBatDau,
        );

        if (conflict) {
          throw new ConflictException(
            `Lịch học lớp mới bị trùng vào Thứ ${newSch.thuTrongTuan} với lớp bạn đang học (${conflict.lopHoc.tenLopHoc}).`,
          );
        }
      }

      const result = await this.prisma.$transaction(async (tx) => {
        const enrollment = await tx.dangKyHoc.update({
          where: { id: existingEnrollment.id },
          data: {
            trangThai: TrangThaiDangKy.CHO_THANH_TOAN,
            ngayDangKy: new Date(),
          },
        });

        await tx.lopHoc.update({
          where: { id: BigInt(dto.lopHocId) },
          data: { siSoHienTai: { increment: 1 } },
        });

        let invoice;
        if (existingEnrollment.hoaDon) {
          const paid = Number(existingEnrollment.hoaDon.soTienDaTra || 0);
          const fee = Number(classRecord.khoaHoc.hocPhi);
          const isFull = paid >= fee;
          const isPartial = paid > 0 && paid < fee;
          const invStatus = isFull
            ? TrangThaiHoaDon.DA_HOAN_THANH
            : isPartial
            ? TrangThaiHoaDon.THANH_TOAN_MOT_PHAN
            : TrangThaiHoaDon.CHUA_THANH_TOAN;

          invoice = await tx.hoaDon.update({
            where: { id: existingEnrollment.hoaDon.id },
            data: {
              soTienPhaiTra: classRecord.khoaHoc.hocPhi,
              soTienDaTra: existingEnrollment.hoaDon.soTienDaTra,
              hanThanhToan: classRecord.ngayBatDau,
              trangThai: invStatus,
            },
          });

          if (isFull) {
            await tx.dangKyHoc.update({
              where: { id: enrollment.id },
              data: { trangThai: TrangThaiDangKy.DA_XAC_NHAN },
            });
          }
        } else {
          const maHoaDon = `HD-${Date.now().toString().slice(-6)}-${dto.hocVienId}`;
          invoice = await tx.hoaDon.create({
            data: {
              maHoaDon,
              dangKyHocId: enrollment.id,
              hocVienId: BigInt(dto.hocVienId),
              soTienPhaiTra: classRecord.khoaHoc.hocPhi,
              soTienDaTra: 0,
              hanThanhToan: classRecord.ngayBatDau,
              trangThai: TrangThaiHoaDon.CHUA_THANH_TOAN,
            },
          });
        }

        return { enrollment, invoice };
      });

      return this.serializeBigInt(result);
    }

    // 3. Kiểm tra Trình độ CEFR học viên >= Yêu cầu của khóa học
    const studentRank = CEFR_RANKS[student.trinhDoCEFR];
    const courseRank = CEFR_RANKS[classRecord.khoaHoc.trinhDoYeuCau];

    if (studentRank < courseRank) {
      throw new BadRequestException(
        `Trình độ hiện tại của học viên (${student.trinhDoCEFR}) chưa đạt yêu cầu đầu vào của khóa học (${classRecord.khoaHoc.trinhDoYeuCau}).`,
      );
    }

    // 4. Kiểm tra Lịch học xung đột với các lớp khác học viên đang theo học
    const studentActiveSchedules = await this.prisma.lichHoc.findMany({
      where: {
        lopHoc: {
          dangKyHoc: {
            some: {
              hocVienId: BigInt(dto.hocVienId),
              trangThai: { in: [TrangThaiDangKy.CHO_THANH_TOAN, TrangThaiDangKy.DA_XAC_NHAN] },
            },
          },
          trangThai: { in: [TrangThaiLopHoc.DANG_MO_DANG_KY, TrangThaiLopHoc.DANG_HOC] },
        },
      },
      include: { lopHoc: { select: { tenLopHoc: true } } },
    });

    for (const newSch of classRecord.lichHoc) {
      const conflict = studentActiveSchedules.find(
        (activeSch) =>
          activeSch.thuTrongTuan === newSch.thuTrongTuan &&
          activeSch.gioBatDau < newSch.gioKetThuc &&
          activeSch.gioKetThuc > newSch.gioBatDau,
      );

      if (conflict) {
        throw new ConflictException(
          `Lịch học lớp mới bị trùng vào Thứ ${newSch.thuTrongTuan} với lớp bạn đang học (${conflict.lopHoc.tenLopHoc}).`,
        );
      }
    }

    // 5. ACID Transaction: Tạo Đăng Ký + Tăng Sĩ Số + Tự Động Tạo Hóa Đơn
    const maHoaDon = `HD-${Date.now().toString().slice(-6)}-${dto.hocVienId}`;

    const result = await this.prisma.$transaction(async (tx) => {
      const enrollment = await tx.dangKyHoc.create({
        data: {
          lopHocId: BigInt(dto.lopHocId),
          hocVienId: BigInt(dto.hocVienId),
          trangThai: TrangThaiDangKy.CHO_THANH_TOAN,
        },
      });

      await tx.lopHoc.update({
        where: { id: BigInt(dto.lopHocId) },
        data: { siSoHienTai: { increment: 1 } },
      });

      const invoice = await tx.hoaDon.create({
        data: {
          maHoaDon,
          dangKyHocId: enrollment.id,
          hocVienId: BigInt(dto.hocVienId),
          soTienPhaiTra: classRecord.khoaHoc.hocPhi,
          soTienDaTra: 0,
          hanThanhToan: classRecord.ngayBatDau,
          trangThai: TrangThaiHoaDon.CHUA_THANH_TOAN,
        },
      });

      return {
        enrollment,
        invoice: {
          ...invoice,
          ngayLap: enrollment.ngayDangKy,
        },
      };
    });

    return this.serializeBigInt(result);
  }

  /**
   * UC006 — Hủy đăng ký lớp học (Soft-cancel: chuyển DA_HUY, giải phóng sĩ số, bảo toàn 100% hóa đơn & phiếu thu)
   */
  async cancelEnrollment(dto: CreateEnrollmentDto, currentUser?: any) {
    const student = await this.prisma.hoSoHocVien.findUnique({
      where: { id: BigInt(dto.hocVienId) },
    });
    if (!student) throw new NotFoundException('Học viên không tồn tại.');

    // Kiểm tra quyền: nếu là HỌC VIÊN thì chỉ được hủy đăng ký của chính mình
    if (currentUser?.vaiTro === 'HOC_VIEN') {
      if (student.nguoiDungId && BigInt(student.nguoiDungId) !== BigInt(currentUser.id)) {
        throw new BadRequestException('Bạn chỉ có thể hủy đăng ký của chính mình.');
      }
    }

    const enrollment = await this.prisma.dangKyHoc.findUnique({
      where: {
        lopHocId_hocVienId: {
          lopHocId: BigInt(dto.lopHocId),
          hocVienId: BigInt(dto.hocVienId),
        },
      },
      include: {
        hoaDon: {
          include: {
            thanhToan: true,
          },
        },
      },
    });

    if (!enrollment) {
      throw new NotFoundException('Không tìm thấy thông tin đăng ký của lớp học này.');
    }

    if (enrollment.trangThai === TrangThaiDangKy.DA_HUY) {
      throw new BadRequestException('Đăng ký lớp học này đã được hủy trước đó.');
    }

    // Nghiệp vụ: Chính sách học phí không hoàn lại. Một khi đã phát sinh thanh toán (paidAmount > 0) thì tuyệt đối không cho tự hủy trên hệ thống
    const paidAmount = Number(enrollment.hoaDon?.soTienDaTra || 0);
    if (paidAmount > 0) {
      throw new BadRequestException(
        `Đăng ký này đã phát sinh thanh toán học phí (${paidAmount.toLocaleString()} đ). Theo quy chế trung tâm, học phí đã đóng không hoàn lại và không thể tự hủy trên hệ thống. Vui lòng liên hệ trực tiếp Quầy tư vấn viên hoặc Quản lý để được hướng dẫn bảo lưu hoặc chuyển lớp theo quy định.`,
      );
    }

    // ACID Transaction Soft-Cancel: Cập nhật trạng thái DA_HUY cho Đăng ký & Hóa đơn, giảm sĩ số lớp, bảo toàn toàn bộ dữ liệu tài chính
    await this.prisma.$transaction(async (tx) => {
      // 1. Cập nhật trạng thái đăng ký học -> DA_HUY
      await tx.dangKyHoc.update({
        where: { id: enrollment.id },
        data: { trangThai: TrangThaiDangKy.DA_HUY },
      });

      // 2. Cập nhật hóa đơn -> DA_HUY (giữ nguyên soTienDaTra và toàn bộ bản ghi thanhToan để lưu vết lịch sử sổ sách)
      if (enrollment.hoaDon) {
        await tx.hoaDon.update({
          where: { id: enrollment.hoaDon.id },
          data: { trangThai: TrangThaiHoaDon.DA_HUY },
        });
      }

      // 3. Giảm sĩ số lớp học (đảm bảo không âm)
      const currentClass = await tx.lopHoc.findUnique({
        where: { id: BigInt(dto.lopHocId) },
        select: { siSoHienTai: true },
      });

      if (currentClass && currentClass.siSoHienTai > 0) {
        await tx.lopHoc.update({
          where: { id: BigInt(dto.lopHocId) },
          data: { siSoHienTai: { decrement: 1 } },
        });
      }
    });

    return {
      success: true,
      message:
        'Hủy đăng ký lớp học thành công. Đã giải phóng chỗ trống và chuyển trạng thái sang Đã hủy. Mọi thông tin hóa đơn và lịch sử giao dịch thanh toán vẫn được bảo toàn nguyên vẹn trong hệ thống.',
    };
  }

  /**
   * UC006 — Tra cứu danh sách đăng ký học
   */
  async findAllEnrollments(lopHocId?: number, hocVienId?: number) {
    const where: any = {};
    if (lopHocId) where.lopHocId = BigInt(lopHocId);
    if (hocVienId) where.hocVienId = BigInt(hocVienId);

    const list = await this.prisma.dangKyHoc.findMany({
      where,
      include: {
        lopHoc: { select: { maLopHoc: true, tenLopHoc: true } },
        hocVien: { select: { maHocVien: true, hoTen: true } },
        hoaDon: true,
      },
      orderBy: { id: 'desc' },
    });

    return this.serializeBigInt(list);
  }

  /**
   * UC007 — Danh mục hóa đơn & công nợ học phí
   */
  async findAllInvoices(trangThai?: TrangThaiHoaDon, hocVienId?: number) {
    const where: any = {};
    if (trangThai) where.trangThai = trangThai;
    if (hocVienId) where.hocVienId = BigInt(hocVienId);

    const invoices = await this.prisma.hoaDon.findMany({
      where,
      include: {
        hocVien: { select: { maHocVien: true, hoTen: true } },
        dangKyHoc: {
          include: {
            lopHoc: { select: { maLopHoc: true, tenLopHoc: true } },
          },
        },
        thanhToan: {
          include: {
            nguoiThu: { select: { id: true, tenDangNhap: true, hoTen: true } },
          },
          orderBy: { id: 'asc' },
        },
      },
      orderBy: { id: 'desc' },
    });

    const invoicesWithNgayLap = invoices.map((inv) => ({
      ...inv,
      ngayLap: inv.dangKyHoc?.ngayDangKy || null,
    }));

    return this.serializeBigInt(invoicesWithNgayLap);
  }

  /**
   * UC007 — Tra cứu danh mục phiếu thu / lịch sử thanh toán theo tư vấn viên hoặc hóa đơn
   */
  async findAllPayments(nguoiThuId?: number, hoaDonId?: number) {
    const where: any = {};
    if (nguoiThuId) where.nguoiThuId = BigInt(nguoiThuId);
    if (hoaDonId) where.hoaDonId = BigInt(hoaDonId);

    const payments = await this.prisma.thanhToan.findMany({
      where,
      include: {
        nguoiThu: { select: { id: true, tenDangNhap: true, email: true } },
        hoaDon: {
          include: {
            hocVien: { select: { maHocVien: true, hoTen: true } },
            dangKyHoc: {
              include: {
                lopHoc: { select: { maLopHoc: true, tenLopHoc: true } },
              },
            },
          },
        },
      },
      orderBy: { id: 'desc' },
    });

    return this.serializeBigInt(payments);
  }

  /**
   * UC007 — Ghi nhận thanh toán học phí (Phiếu thu)
   */
  async createPayment(invoiceId: number, dto: CreatePaymentDto, collectorUserId?: number) {
    const maGiaoDich = `GD-${Date.now().toString().slice(-8)}`;

    const result = await this.prisma.$transaction(async (tx) => {
      // 1. Đọc hóa đơn hiện tại bên trong Transaction để bảo đảm tính Atomic
      const invoice = await tx.hoaDon.findUnique({
        where: { id: BigInt(invoiceId) },
        include: { dangKyHoc: true },
      });

      if (!invoice) throw new NotFoundException('Hóa đơn không tồn tại.');

      if (
        invoice.trangThai === TrangThaiHoaDon.DA_HUY ||
        invoice.dangKyHoc?.trangThai === TrangThaiDangKy.DA_HUY
      ) {
        throw new BadRequestException(
          'Không thể thu học phí cho đơn đăng ký hoặc hóa đơn đã bị hủy. Vui lòng hướng dẫn học viên đăng ký lại lớp học trước khi thu tiền.',
        );
      }

      const soTienPhaiTra = Number(invoice.soTienPhaiTra);
      const soTienDaTraHienTai = Number(invoice.soTienDaTra);
      const soTienConLai = Math.max(0, soTienPhaiTra - soTienDaTraHienTai);

      if (soTienConLai <= 0) {
        throw new BadRequestException('Hóa đơn này đã được thanh toán hoàn tất trước đó.');
      }

      if (dto.soTien > soTienConLai) {
        throw new BadRequestException(
          `Số tiền thanh toán (${dto.soTien.toLocaleString()} đ) vượt quá số tiền còn nợ (${soTienConLai.toLocaleString()} đ).`,
        );
      }

      const soTienDaTraMoi = soTienDaTraHienTai + dto.soTien;
      const isFullPayment = soTienDaTraMoi >= soTienPhaiTra;

      // 2. Tạo bản ghi thanh toán (Phiếu thu)
      const payment = await tx.thanhToan.create({
        data: {
          hoaDonId: BigInt(invoiceId),
          maGiaoDich,
          soTien: dto.soTien,
          phuongThuc: dto.phuongThuc,
          nguoiThuId: collectorUserId ? BigInt(collectorUserId) : null,
          trangThai: TrangThaiThanhToan.THANH_CONG,
          ghiChu: dto.ghiChu,
        },
      });

      // 3. Cập nhật hóa đơn
      const updatedInvoice = await tx.hoaDon.update({
        where: { id: BigInt(invoiceId) },
        data: {
          soTienDaTra: soTienDaTraMoi,
          trangThai: isFullPayment
            ? TrangThaiHoaDon.DA_HOAN_THANH
            : TrangThaiHoaDon.THANH_TOAN_MOT_PHAN,
        },
      });

      // 4. Nếu đóng đủ tiền -> Xác nhận trạng thái đăng ký học
      if (isFullPayment && invoice.dangKyHocId) {
        await tx.dangKyHoc.update({
          where: { id: invoice.dangKyHocId },
          data: { trangThai: TrangThaiDangKy.DA_XAC_NHAN },
        });
      }

      return {
        payment,
        invoice: {
          ...updatedInvoice,
          ngayLap: invoice.dangKyHoc?.ngayDangKy || null,
        },
      };
    });

    return this.serializeBigInt(result);
  }
}
