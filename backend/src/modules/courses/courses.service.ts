import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCourseDto, UpdateCourseDto } from './dto/courses.dto';
import { TrangThaiKhoaHoc, TrinhDoCEFR } from '@prisma/client';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  private serializeBigInt(obj: any) {
    return JSON.parse(
      JSON.stringify(obj, (key, value) =>
        typeof value === 'bigint' ? Number(value) : value,
      ),
    );
  }

  /**
   * UC003 — Lấy danh mục khóa học (hỗ trợ phân trang, tìm kiếm và thống kê trạng thái)
   */
  async findAll(
    trinhDo?: TrinhDoCEFR,
    trangThai?: TrangThaiKhoaHoc,
    search?: string,
    page?: number,
    limit?: number,
  ) {
    const baseWhere: any = {};
    if (trinhDo && (trinhDo as any) !== 'ALL') {
      baseWhere.trinhDoYeuCau = trinhDo;
    }

    if (search && search.trim()) {
      const q = search.trim();
      baseWhere.OR = [
        { tenKhoaHoc: { contains: q, mode: 'insensitive' } },
        { maKhoaHoc: { contains: q, mode: 'insensitive' } },
        { moTa: { contains: q, mode: 'insensitive' } },
      ];
    }

    const where: any = { ...baseWhere };
    if (trangThai && (trangThai as any) !== 'ALL') {
      where.trangThai = trangThai;
    }

    if (page !== undefined) {
      const pageSize = limit && limit > 0 ? limit : 6;
      const skip = (page - 1) * pageSize;

      const [total, totalActive, totalInactive, courses] = await Promise.all([
        this.prisma.khoaHoc.count({ where }),
        this.prisma.khoaHoc.count({
          where: { ...baseWhere, trangThai: TrangThaiKhoaHoc.HOAT_DONG },
        }),
        this.prisma.khoaHoc.count({
          where: { ...baseWhere, trangThai: TrangThaiKhoaHoc.NGUNG_HOAT_DONG },
        }),
        this.prisma.khoaHoc.findMany({
          where,
          skip,
          take: pageSize,
          include: {
            _count: { select: { lopHoc: true } },
          },
          orderBy: [
            { trangThai: 'asc' },
            { id: 'asc' },
          ],
        }),
      ]);

      return {
        total,
        page,
        limit: pageSize,
        totalPages: Math.ceil(total / pageSize),
        data: this.serializeBigInt(courses),
        counts: {
          all: totalActive + totalInactive,
          active: totalActive,
          inactive: totalInactive,
        },
      };
    }

    const courses = await this.prisma.khoaHoc.findMany({
      where,
      include: {
        _count: { select: { lopHoc: true } },
      },
      orderBy: [
        { trangThai: 'asc' },
        { id: 'asc' },
      ],
    });

    return this.serializeBigInt(courses);
  }

  /**
   * UC003 — Chi tiết khóa học
   */
  async findById(id: number) {
    const course = await this.prisma.khoaHoc.findUnique({
      where: { id: BigInt(id) },
      include: {
        lopHoc: {
          select: {
            id: true,
            maLopHoc: true,
            tenLopHoc: true,
            siSoHienTai: true,
            siSoToiDa: true,
            trangThai: true,
          },
        },
      },
    });

    if (!course) throw new NotFoundException('Không tìm thấy khóa học.');
    return this.serializeBigInt(course);
  }

  /**
   * UC003 — Tạo mới khóa học
   */
  async create(dto: CreateCourseDto) {
    const existing = await this.prisma.khoaHoc.findUnique({
      where: { maKhoaHoc: dto.maKhoaHoc },
    });

    if (existing) {
      throw new ConflictException('Mã khóa học đã tồn tại.');
    }

    const course = await this.prisma.khoaHoc.create({
      data: {
        maKhoaHoc: dto.maKhoaHoc,
        tenKhoaHoc: dto.tenKhoaHoc,
        ngonNgu: dto.ngonNgu || 'Tiếng Anh',
        trinhDoYeuCau: dto.trinhDoYeuCau,
        thoiLuongGio: dto.thoiLuongGio,
        hocPhi: dto.hocPhi,
        moTa: dto.moTa,
      },
    });

    return this.serializeBigInt(course);
  }

  /**
   * UC003 — Cập nhật khóa học
   */
  async update(id: number, dto: UpdateCourseDto) {
    await this.findById(id);

    const updated = await this.prisma.khoaHoc.update({
      where: { id: BigInt(id) },
      data: {
        tenKhoaHoc: dto.tenKhoaHoc,
        trinhDoYeuCau: dto.trinhDoYeuCau,
        thoiLuongGio: dto.thoiLuongGio,
        hocPhi: dto.hocPhi,
        moTa: dto.moTa,
        trangThai: dto.trangThai,
      },
    });

    return this.serializeBigInt(updated);
  }
}
