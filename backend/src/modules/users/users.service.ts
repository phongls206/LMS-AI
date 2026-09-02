import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateStudentDto, UpdateStudentDto } from './dto/users.dto';
import { VaiTro } from '@prisma/client';
import * as argon2 from 'argon2';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  private serializeBigInt(obj: any) {
    return JSON.parse(
      JSON.stringify(obj, (key, value) =>
        typeof value === 'bigint' ? Number(value) : value,
      ),
    );
  }

  /**
   * UC002 — Danh sách học viên (phân trang, tìm kiếm)
   */
  async findAllStudents(page = 1, limit = 10, search?: string, cefr?: any) {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (search) {
      where.OR = [
        { hoTen: { contains: search, mode: 'insensitive' } },
        { maHocVien: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (cefr) {
      where.trinhDoCEFR = cefr;
    }

    const [total, data] = await Promise.all([
      this.prisma.hoSoHocVien.count({ where }),
      this.prisma.hoSoHocVien.findMany({
        where,
        skip,
        take: limit,
        include: {
          nguoiDung: {
            select: { email: true, soDienThoai: true, dangHoatDong: true },
          },
        },
        orderBy: { id: 'desc' },
      }),
    ]);

    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      data: this.serializeBigInt(data),
    };
  }

  /**
   * UC002 — Chi tiết học viên
   */
  async findStudentById(id: number) {
    const student = await this.prisma.hoSoHocVien.findUnique({
      where: { id: BigInt(id) },
      include: {
        nguoiDung: {
          select: { email: true, soDienThoai: true, dangHoatDong: true },
        },
        dangKyHoc: {
          include: {
            lopHoc: { select: { maLopHoc: true, tenLopHoc: true, trangThai: true } },
          },
        },
      },
    });

    if (!student) throw new NotFoundException('Không tìm thấy học viên.');
    return this.serializeBigInt(student);
  }

  /**
   * UC002 — Tiếp nhận học viên mới (Tạo tài khoản + Hồ sơ trong Transaction)
   */
  async createStudent(dto: CreateStudentDto) {
    // Kiểm tra trùng username hoặc email
    const existingUser = await this.prisma.nguoiDung.findFirst({
      where: {
        OR: [{ tenDangNhap: dto.tenDangNhap }, { email: dto.email }],
      },
    });

    if (existingUser) {
      throw new ConflictException('Tên đăng nhập hoặc Email đã tồn tại.');
    }

    // Kiểm tra trùng mã học viên
    const existingHV = await this.prisma.hoSoHocVien.findUnique({
      where: { maHocVien: dto.maHocVien },
    });
    if (existingHV) {
      throw new ConflictException('Mã học viên đã tồn tại.');
    }

    const hashedPassword = await argon2.hash(dto.matKhau);

    // ACID Transaction tạo cả tài khoản và hồ sơ
    const result = await this.prisma.$transaction(async (tx) => {
      const user = await tx.nguoiDung.create({
        data: {
          tenDangNhap: dto.tenDangNhap,
          matKhauMaHoa: hashedPassword,
          vaiTro: VaiTro.HOC_VIEN,
          email: dto.email,
          soDienThoai: dto.soDienThoai,
        },
      });

      const student = await tx.hoSoHocVien.create({
        data: {
          nguoiDungId: user.id,
          maHocVien: dto.maHocVien,
          hoTen: dto.hoTen,
          ngaySinh: dto.ngaySinh ? new Date(dto.ngaySinh) : null,
          gioiTinh: dto.gioiTinh,
          diaChi: dto.diaChi,
          trinhDoCEFR: dto.trinhDoCEFR,
          nguonDanhGia: dto.nguonDanhGia,
          lichRanhJson: dto.lichRanhJson,
        },
      });

      return { user, student };
    });

    return this.serializeBigInt(result.student);
  }

  /**
   * UC002 — Cập nhật thông tin học viên
   */
  async updateStudent(id: number, dto: UpdateStudentDto) {
    await this.findStudentById(id);

    const updated = await this.prisma.hoSoHocVien.update({
      where: { id: BigInt(id) },
      data: {
        hoTen: dto.hoTen,
        trinhDoCEFR: dto.trinhDoCEFR,
        nguonDanhGia: dto.nguonDanhGia,
        lichRanhJson: dto.lichRanhJson,
        trangThai: dto.trangThai,
      },
    });

    return this.serializeBigInt(updated);
  }

  /**
   * UC005 — Danh sách giáo viên
   */
  async findAllTeachers() {
    const teachers = await this.prisma.hoSoGiaoVien.findMany({
      include: {
        nguoiDung: {
          select: { email: true, soDienThoai: true, dangHoatDong: true },
        },
      },
      orderBy: { id: 'asc' },
    });

    return this.serializeBigInt(teachers);
  }
}
