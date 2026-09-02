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
   * UC003 — Lấy danh mục tất cả khóa học
   */
  async findAll(trinhDo?: TrinhDoCEFR, trangThai?: TrangThaiKhoaHoc) {
    const where: any = {};
    if (trinhDo) where.trinhDoYeuCau = trinhDo;
    if (trangThai) where.trangThai = trangThai;

    const courses = await this.prisma.khoaHoc.findMany({
      where,
      include: {
        _count: { select: { lopHoc: true } },
      },
      orderBy: { id: 'asc' },
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
