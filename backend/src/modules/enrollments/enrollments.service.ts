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
    });

    if (existingEnrollment) {
      throw new ConflictException('Học viên đã đăng ký lớp học này trước đó.');
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

      return { enrollment, invoice };
    });

    return this.serializeBigInt(result);
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
        thanhToan: true,
      },
      orderBy: { id: 'desc' },
    });

    return this.serializeBigInt(invoices);
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
    const invoice = await this.prisma.hoaDon.findUnique({
      where: { id: BigInt(invoiceId) },
      include: { dangKyHoc: true },
    });

    if (!invoice) throw new NotFoundException('Hóa đơn không tồn tại.');

    const soTienConLai = Number(invoice.soTienPhaiTra) - Number(invoice.soTienDaTra);
    if (soTienConLai <= 0) {
      throw new BadRequestException('Hóa đơn này đã được thanh toán hoàn tất.');
    }

    if (dto.soTien > soTienConLai) {
      throw new BadRequestException(
        `Số tiền thanh toán (${dto.soTien.toLocaleString()} đ) vượt quá số tiền còn lại (${soTienConLai.toLocaleString()} đ).`,
      );
    }

    const maGiaoDich = `GD-${Date.now().toString().slice(-8)}`;
    const soTienDaTraMoi = Number(invoice.soTienDaTra) + dto.soTien;
    const isFullPayment = soTienDaTraMoi >= Number(invoice.soTienPhaiTra);

    const result = await this.prisma.$transaction(async (tx) => {
      // 1. Tạo bản ghi thanh toán
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

      // 2. Cập nhật hóa đơn
      const updatedInvoice = await tx.hoaDon.update({
        where: { id: BigInt(invoiceId) },
        data: {
          soTienDaTra: soTienDaTraMoi,
          trangThai: isFullPayment
            ? TrangThaiHoaDon.DA_HOAN_THANH
            : TrangThaiHoaDon.THANH_TOAN_MOT_PHAN,
        },
      });

      // 3. Nếu đóng đủ tiền -> Xác nhận trạng thái đăng ký học
      if (isFullPayment) {
        await tx.dangKyHoc.update({
          where: { id: invoice.dangKyHocId },
          data: { trangThai: TrangThaiDangKy.DA_XAC_NHAN },
        });
      }

      return { payment, invoice: updatedInvoice };
    });

    return this.serializeBigInt(result);
  }
}
