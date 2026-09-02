import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateStudentDto,
  UpdateStudentDto,
  CreateTeacherDto,
  UpdateTeacherDto,
} from './dto/users.dto';
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

  // ============================================================================
  // HỌC VIÊN (STUDENT) CRUD
  // ============================================================================

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
            select: { id: true, tenDangNhap: true, email: true, soDienThoai: true, dangHoatDong: true },
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
          select: { id: true, tenDangNhap: true, email: true, soDienThoai: true, dangHoatDong: true },
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
    const existingUser = await this.prisma.nguoiDung.findFirst({
      where: {
        OR: [{ tenDangNhap: dto.tenDangNhap }, { email: dto.email }],
      },
    });

    if (existingUser) {
      throw new ConflictException('Tên đăng nhập hoặc Email đã tồn tại.');
    }

    const existingHV = await this.prisma.hoSoHocVien.findUnique({
      where: { maHocVien: dto.maHocVien },
    });
    if (existingHV) {
      throw new ConflictException('Mã học viên đã tồn tại.');
    }

    const hashedPassword = await argon2.hash(dto.matKhau);

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
    const student = await this.prisma.hoSoHocVien.findUnique({
      where: { id: BigInt(id) },
    });
    if (!student) throw new NotFoundException('Không tìm thấy học viên.');

    const updated = await this.prisma.$transaction(async (tx) => {
      const userUpdateData: any = {};
      if (dto.soDienThoai) userUpdateData.soDienThoai = dto.soDienThoai;
      if (dto.matKhauMoi) userUpdateData.matKhauMaHoa = await argon2.hash(dto.matKhauMoi);

      if (Object.keys(userUpdateData).length > 0 && student.nguoiDungId) {
        await tx.nguoiDung.update({
          where: { id: student.nguoiDungId },
          data: userUpdateData,
        });
      }

      return tx.hoSoHocVien.update({
        where: { id: BigInt(id) },
        data: {
          hoTen: dto.hoTen,
          trinhDoCEFR: dto.trinhDoCEFR,
          diaChi: dto.diaChi,
          nguonDanhGia: dto.nguonDanhGia,
          lichRanhJson: dto.lichRanhJson,
          trangThai: dto.trangThai,
        },
      });
    });

    return this.serializeBigInt(updated);
  }

  /**
   * UC002 — Xóa học viên
   */
  async deleteStudent(id: number) {
    const student = await this.prisma.hoSoHocVien.findUnique({
      where: { id: BigInt(id) },
    });
    if (!student) throw new NotFoundException('Không tìm thấy học viên.');

    await this.prisma.$transaction(async (tx) => {
      // Xóa các bảng phụ liên quan nếu có
      await tx.banGhiDiemDanh.deleteMany({ where: { hocVienId: BigInt(id) } });
      await tx.ketQuaHocTap.deleteMany({ where: { hocVienId: BigInt(id) } });
      
      const dangKy = await tx.dangKyHoc.findMany({ where: { hocVienId: BigInt(id) } });
      for (const dk of dangKy) {
        await tx.thanhToan.deleteMany({ where: { hoaDon: { dangKyHocId: dk.id } } });
        await tx.hoaDon.deleteMany({ where: { dangKyHocId: dk.id } });
      }
      await tx.dangKyHoc.deleteMany({ where: { hocVienId: BigInt(id) } });
      await tx.hoaDon.deleteMany({ where: { hocVienId: BigInt(id) } });

      await tx.hoSoHocVien.delete({ where: { id: BigInt(id) } });
      if (student.nguoiDungId) {
        await tx.nguoiDung.delete({ where: { id: student.nguoiDungId } });
      }
    });

    return { message: 'Đã xóa hồ sơ học viên thành công.' };
  }

  // ============================================================================
  // GIÁO VIÊN (TEACHER) CRUD
  // ============================================================================

  /**
   * UC005 — Danh sách giáo viên
   */
  async findAllTeachers() {
    const teachers = await this.prisma.hoSoGiaoVien.findMany({
      include: {
        nguoiDung: {
          select: { id: true, tenDangNhap: true, email: true, soDienThoai: true, dangHoatDong: true },
        },
        phanCong: {
          where: { trangThai: 'DANG_PHU_TRACH' },
          include: {
            lopHoc: { select: { id: true, maLopHoc: true, tenLopHoc: true } },
          },
        },
      },
      orderBy: { id: 'asc' },
    });

    return this.serializeBigInt(teachers);
  }

  /**
   * UC005 — Chi tiết giáo viên
   */
  async findTeacherById(id: number) {
    const teacher = await this.prisma.hoSoGiaoVien.findUnique({
      where: { id: BigInt(id) },
      include: {
        nguoiDung: {
          select: { id: true, tenDangNhap: true, email: true, soDienThoai: true, dangHoatDong: true },
        },
        phanCong: {
          include: {
            lopHoc: true,
          },
        },
      },
    });

    if (!teacher) throw new NotFoundException('Không tìm thấy giáo viên.');
    return this.serializeBigInt(teacher);
  }

  /**
   * UC005 — Thêm giáo viên mới
   */
  async createTeacher(dto: CreateTeacherDto) {
    const existingUser = await this.prisma.nguoiDung.findFirst({
      where: {
        OR: [{ tenDangNhap: dto.tenDangNhap }, { email: dto.email }],
      },
    });

    if (existingUser) {
      throw new ConflictException('Tên đăng nhập hoặc Email đã tồn tại.');
    }

    const existingGV = await this.prisma.hoSoGiaoVien.findUnique({
      where: { maGiaoVien: dto.maGiaoVien },
    });
    if (existingGV) {
      throw new ConflictException('Mã giáo viên đã tồn tại.');
    }

    const hashedPassword = await argon2.hash(dto.matKhau);

    const result = await this.prisma.$transaction(async (tx) => {
      const user = await tx.nguoiDung.create({
        data: {
          tenDangNhap: dto.tenDangNhap,
          matKhauMaHoa: hashedPassword,
          vaiTro: VaiTro.GIAO_VIEN,
          email: dto.email,
          soDienThoai: dto.soDienThoai,
        },
      });

      const teacher = await tx.hoSoGiaoVien.create({
        data: {
          nguoiDungId: user.id,
          maGiaoVien: dto.maGiaoVien,
          hoTen: dto.hoTen,
          chuyenMon: dto.chuyenMon,
          bangCap: dto.bangCap,
        },
      });

      return { user, teacher };
    });

    return this.serializeBigInt(result.teacher);
  }

  /**
   * UC005 — Cập nhật thông tin giáo viên
   */
  async updateTeacher(id: number, dto: UpdateTeacherDto) {
    const teacher = await this.prisma.hoSoGiaoVien.findUnique({
      where: { id: BigInt(id) },
    });
    if (!teacher) throw new NotFoundException('Không tìm thấy giáo viên.');

    const updated = await this.prisma.$transaction(async (tx) => {
      const userUpdateData: any = {};
      if (dto.soDienThoai) userUpdateData.soDienThoai = dto.soDienThoai;
      if (dto.matKhauMoi) userUpdateData.matKhauMaHoa = await argon2.hash(dto.matKhauMoi);

      if (Object.keys(userUpdateData).length > 0 && teacher.nguoiDungId) {
        await tx.nguoiDung.update({
          where: { id: teacher.nguoiDungId },
          data: userUpdateData,
        });
      }

      return tx.hoSoGiaoVien.update({
        where: { id: BigInt(id) },
        data: {
          hoTen: dto.hoTen,
          chuyenMon: dto.chuyenMon,
          bangCap: dto.bangCap,
          trangThai: dto.trangThai,
        },
      });
    });

    return this.serializeBigInt(updated);
  }

  /**
   * UC005 — Xóa giáo viên
   */
  async deleteTeacher(id: number) {
    const teacher = await this.prisma.hoSoGiaoVien.findUnique({
      where: { id: BigInt(id) },
    });
    if (!teacher) throw new NotFoundException('Không tìm thấy giáo viên.');

    await this.prisma.$transaction(async (tx) => {
      await tx.phanCongGiaoVien.deleteMany({ where: { giaoVienId: BigInt(id) } });
      await tx.hoSoGiaoVien.delete({ where: { id: BigInt(id) } });
      if (teacher.nguoiDungId) {
        await tx.nguoiDung.delete({ where: { id: teacher.nguoiDungId } });
      }
    });

    return { message: 'Đã xóa thông tin giáo viên thành công.' };
  }
}
