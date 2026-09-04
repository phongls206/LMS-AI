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
          dangKyHoc: {
            include: {
              lopHoc: {
                select: {
                  id: true,
                  maLopHoc: true,
                  tenLopHoc: true,
                  trangThai: true,
                  khoaHoc: {
                    select: { id: true, maKhoaHoc: true, tenKhoaHoc: true },
                  },
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
            },
          },
          ketQua: {
            select: {
              diemTongKet: true,
              trangThaiHoanThanh: true,
            },
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
            lopHoc: {
              include: {
                khoaHoc: true,
                lichHoc: true,
              },
            },
            hoaDon: true,
          },
        },
        hoaDon: {
          include: {
            thanhToan: true,
          },
        },
        ketQua: {
          include: {
            lopHoc: true,
          },
        },
        diemDanh: true,
      },
    });

    if (!student) throw new NotFoundException('Không tìm thấy học viên.');
    return this.serializeBigInt(student);
  }

  /**
   * Sinh mã học viên và tên đăng nhập đề xuất kế tiếp đảm bảo không trùng lặp
   */
  async getNextStudentCode() {
    const students = await this.prisma.hoSoHocVien.findMany({
      select: { maHocVien: true },
    });

    let maxNum = 0;
    for (const s of students) {
      const match = s.maHocVien.match(/^HV(\d+)$/i);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > maxNum) maxNum = num;
      }
    }

    const nextNum = maxNum + 1;
    const nextMaHocVien = `HV${String(nextNum).padStart(3, '0')}`;

    // Tìm tên đăng nhập đề xuất không trùng lặp
    let candidateUsername = `student${String(nextNum).padStart(2, '0')}`;
    let suffix = nextNum;
    while (
      await this.prisma.nguoiDung.findFirst({
        where: { tenDangNhap: { equals: candidateUsername, mode: 'insensitive' } },
      })
    ) {
      suffix++;
      candidateUsername = `student${String(suffix).padStart(2, '0')}`;
    }

    return {
      nextMaHocVien,
      suggestedUsername: candidateUsername,
    };
  }

  /**
   * Kiểm tra trùng lặp thông tin tài khoản học viên trước khi tạo (Real-time check)
   */
  async checkStudentDuplicate(query: {
    tenDangNhap?: string;
    email?: string;
    maHocVien?: string;
    soDienThoai?: string;
  }) {
    const errors: Record<string, string> = {};
    let existingStudent: any = null;

    if (query.tenDangNhap?.trim()) {
      const u = await this.prisma.nguoiDung.findFirst({
        where: { tenDangNhap: { equals: query.tenDangNhap.trim(), mode: 'insensitive' } },
      });
      if (u) {
        errors.tenDangNhap = `Tên đăng nhập "${query.tenDangNhap.trim()}" đã được sử dụng. Vui lòng chọn tên khác.`;
      }
    }

    if (query.email?.trim()) {
      const u = await this.prisma.nguoiDung.findFirst({
        where: { email: { equals: query.email.trim(), mode: 'insensitive' } },
        include: { hoSoHocVien: true, hoSoGiaoVien: true },
      });
      if (u) {
        const ownerName = u.hoSoHocVien?.hoTen || u.hoSoGiaoVien?.hoTen || 'Người dùng khác';
        const ownerCode = u.hoSoHocVien?.maHocVien || u.hoSoGiaoVien?.maGiaoVien || u.tenDangNhap;
        errors.email = `Email "${query.email.trim()}" đã được đăng ký bởi: ${ownerName} (${ownerCode}).`;
        if (u.hoSoHocVien) {
          existingStudent = {
            id: Number(u.hoSoHocVien.id),
            hoTen: u.hoSoHocVien.hoTen,
            maHocVien: u.hoSoHocVien.maHocVien,
            tenDangNhap: u.tenDangNhap,
            email: u.email,
            soDienThoai: u.soDienThoai,
          };
        }
      }
    }

    if (query.maHocVien?.trim()) {
      const hv = await this.prisma.hoSoHocVien.findFirst({
        where: { maHocVien: { equals: query.maHocVien.trim(), mode: 'insensitive' } },
      });
      if (hv) {
        errors.maHocVien = `Mã học viên "${query.maHocVien.trim()}" đã tồn tại (${hv.hoTen}).`;
      }
    }

    if (query.soDienThoai?.trim() && !existingStudent) {
      const u = await this.prisma.nguoiDung.findFirst({
        where: {
          soDienThoai: query.soDienThoai.trim(),
          vaiTro: VaiTro.HOC_VIEN,
        },
        include: { hoSoHocVien: true },
      });
      if (u && u.hoSoHocVien) {
        existingStudent = {
          id: Number(u.hoSoHocVien.id),
          hoTen: u.hoSoHocVien.hoTen,
          maHocVien: u.hoSoHocVien.maHocVien,
          tenDangNhap: u.tenDangNhap,
          email: u.email,
          soDienThoai: u.soDienThoai,
        };
      }
    }

    return {
      hasDuplicate: Object.keys(errors).length > 0,
      errors,
      existingStudent,
    };
  }

  /**
   * UC002 — Tiếp nhận học viên mới (Tạo tài khoản + Hồ sơ trong Transaction, kiểm soát trùng lặp)
   */
  async createStudent(dto: CreateStudentDto) {
    // 1. Tự động sinh mã và tên đăng nhập nếu để trống
    let maHocVien = dto.maHocVien?.trim().toUpperCase();
    let tenDangNhap = dto.tenDangNhap?.trim().toLowerCase();

    if (!maHocVien || !tenDangNhap) {
      const nextInfo = await this.getNextStudentCode();
      if (!maHocVien) maHocVien = nextInfo.nextMaHocVien;
      if (!tenDangNhap) tenDangNhap = nextInfo.suggestedUsername;
    }

    const email = dto.email.trim().toLowerCase();
    const soDienThoai = dto.soDienThoai?.trim() || null;
    const matKhau = dto.matKhau?.trim() || '123456';

    // 2. Kiểm tra trùng lặp chính xác từng trường
    const existingUser = await this.prisma.nguoiDung.findFirst({
      where: { tenDangNhap: { equals: tenDangNhap, mode: 'insensitive' } },
    });
    if (existingUser) {
      throw new ConflictException(`Tên đăng nhập "${tenDangNhap}" đã được sử dụng. Vui lòng chọn tên đăng nhập khác.`);
    }

    const existingEmail = await this.prisma.nguoiDung.findFirst({
      where: { email: { equals: email, mode: 'insensitive' } },
      include: { hoSoHocVien: true, hoSoGiaoVien: true },
    });
    if (existingEmail) {
      const owner = existingEmail.hoSoHocVien
        ? `học viên "${existingEmail.hoSoHocVien.hoTen}" (Mã: ${existingEmail.hoSoHocVien.maHocVien})`
        : `tài khoản khác`;
      throw new ConflictException(`Email "${email}" đã được đăng ký bởi ${owner}. Không thể tạo trùng tài khoản.`);
    }

    const existingHV = await this.prisma.hoSoHocVien.findFirst({
      where: { maHocVien: { equals: maHocVien, mode: 'insensitive' } },
    });
    if (existingHV) {
      throw new ConflictException(`Mã học viên "${maHocVien}" đã tồn tại trên hệ thống (${existingHV.hoTen}). Vui lòng dùng mã khác.`);
    }

    const hashedPassword = await argon2.hash(matKhau);

    try {
      const result = await this.prisma.$transaction(async (tx) => {
        const user = await tx.nguoiDung.create({
          data: {
            tenDangNhap,
            matKhauMaHoa: hashedPassword,
            vaiTro: VaiTro.HOC_VIEN,
            email,
            soDienThoai,
          },
        });

        const student = await tx.hoSoHocVien.create({
          data: {
            nguoiDungId: user.id,
            maHocVien,
            hoTen: dto.hoTen.trim(),
            ngaySinh: dto.ngaySinh ? new Date(dto.ngaySinh) : null,
            gioiTinh: dto.gioiTinh || null,
            diaChi: dto.diaChi || null,
            trinhDoCEFR: dto.trinhDoCEFR,
            nguonDanhGia: dto.nguonDanhGia || null,
            lichRanhJson: dto.lichRanhJson || null,
          },
        });

        return { user, student };
      });

      return this.serializeBigInt(result.student);
    } catch (err: any) {
      if (err.code === 'P2002') {
        const target = (err.meta?.target || []).join(', ');
        if (target.includes('ten_dang_nhap') || target.includes('tenDangNhap')) {
          throw new ConflictException(`Tên đăng nhập "${tenDangNhap}" đã tồn tại trong hệ thống.`);
        }
        if (target.includes('email')) {
          throw new ConflictException(`Email "${email}" đã tồn tại trong hệ thống.`);
        }
        if (target.includes('ma_hoc_vien') || target.includes('maHocVien')) {
          throw new ConflictException(`Mã học viên "${maHocVien}" đã tồn tại trong hệ thống.`);
        }
        throw new ConflictException('Thông tin tài khoản bị trùng lặp trong hệ thống.');
      }
      throw err;
    }
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
   * Sinh mã giáo viên và tên đăng nhập đề xuất kế tiếp đảm bảo không trùng lặp
   */
  async getNextTeacherCode() {
    const teachers = await this.prisma.hoSoGiaoVien.findMany({
      select: { maGiaoVien: true },
    });

    let maxNum = 0;
    for (const t of teachers) {
      const match = t.maGiaoVien.match(/^GV(\d+)$/i);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > maxNum) maxNum = num;
      }
    }

    const nextNum = maxNum + 1;
    const nextMaGiaoVien = `GV${String(nextNum).padStart(3, '0')}`;

    // Tìm tên đăng nhập đề xuất không trùng lặp
    let candidateUsername = `teacher${String(nextNum).padStart(2, '0')}`;
    let suffix = nextNum;
    while (
      await this.prisma.nguoiDung.findFirst({
        where: { tenDangNhap: { equals: candidateUsername, mode: 'insensitive' } },
      })
    ) {
      suffix++;
      candidateUsername = `teacher${String(suffix).padStart(2, '0')}`;
    }

    return {
      nextMaGiaoVien,
      suggestedUsername: candidateUsername,
    };
  }

  /**
   * Kiểm tra trùng lặp thông tin tài khoản giáo viên trước khi tạo (Real-time check)
   */
  async checkTeacherDuplicate(query: {
    tenDangNhap?: string;
    email?: string;
    maGiaoVien?: string;
  }) {
    const errors: Record<string, string> = {};

    if (query.tenDangNhap?.trim()) {
      const u = await this.prisma.nguoiDung.findFirst({
        where: { tenDangNhap: { equals: query.tenDangNhap.trim(), mode: 'insensitive' } },
      });
      if (u) {
        errors.tenDangNhap = `Tên đăng nhập "${query.tenDangNhap.trim()}" đã được sử dụng. Vui lòng chọn tên khác.`;
      }
    }

    if (query.email?.trim()) {
      const u = await this.prisma.nguoiDung.findFirst({
        where: { email: { equals: query.email.trim(), mode: 'insensitive' } },
        include: { hoSoGiaoVien: true },
      });
      if (u) {
        const owner = u.hoSoGiaoVien ? `${u.hoSoGiaoVien.hoTen} (${u.hoSoGiaoVien.maGiaoVien})` : u.tenDangNhap;
        errors.email = `Email "${query.email.trim()}" đã được đăng ký bởi: ${owner}.`;
      }
    }

    if (query.maGiaoVien?.trim()) {
      const gv = await this.prisma.hoSoGiaoVien.findFirst({
        where: { maGiaoVien: { equals: query.maGiaoVien.trim(), mode: 'insensitive' } },
      });
      if (gv) {
        errors.maGiaoVien = `Mã giáo viên "${query.maGiaoVien.trim()}" đã tồn tại (${gv.hoTen}).`;
      }
    }

    return {
      hasDuplicate: Object.keys(errors).length > 0,
      errors,
    };
  }

  /**
   * UC005 — Thêm giáo viên mới (Kiểm soát trùng lặp chặt chẽ)
   */
  async createTeacher(dto: CreateTeacherDto) {
    let maGiaoVien = dto.maGiaoVien?.trim().toUpperCase();
    let tenDangNhap = dto.tenDangNhap?.trim().toLowerCase();

    if (!maGiaoVien || !tenDangNhap) {
      const nextInfo = await this.getNextTeacherCode();
      if (!maGiaoVien) maGiaoVien = nextInfo.nextMaGiaoVien;
      if (!tenDangNhap) tenDangNhap = nextInfo.suggestedUsername;
    }

    const email = dto.email.trim().toLowerCase();
    const soDienThoai = dto.soDienThoai?.trim() || null;
    const matKhau = dto.matKhau?.trim() || '123456';

    const existingUser = await this.prisma.nguoiDung.findFirst({
      where: { tenDangNhap: { equals: tenDangNhap, mode: 'insensitive' } },
    });
    if (existingUser) {
      throw new ConflictException(`Tên đăng nhập "${tenDangNhap}" đã được sử dụng. Vui lòng chọn tên đăng nhập khác.`);
    }

    const existingEmail = await this.prisma.nguoiDung.findFirst({
      where: { email: { equals: email, mode: 'insensitive' } },
      include: { hoSoGiaoVien: true },
    });
    if (existingEmail) {
      const owner = existingEmail.hoSoGiaoVien
        ? `giáo viên "${existingEmail.hoSoGiaoVien.hoTen}" (Mã: ${existingEmail.hoSoGiaoVien.maGiaoVien})`
        : `tài khoản khác`;
      throw new ConflictException(`Email "${email}" đã được đăng ký bởi ${owner}. Không thể tạo trùng tài khoản.`);
    }

    const existingGV = await this.prisma.hoSoGiaoVien.findFirst({
      where: { maGiaoVien: { equals: maGiaoVien, mode: 'insensitive' } },
    });
    if (existingGV) {
      throw new ConflictException(`Mã giáo viên "${maGiaoVien}" đã tồn tại trên hệ thống (${existingGV.hoTen}). Vui lòng dùng mã khác.`);
    }

    const hashedPassword = await argon2.hash(matKhau);

    try {
      const result = await this.prisma.$transaction(async (tx) => {
        const user = await tx.nguoiDung.create({
          data: {
            tenDangNhap,
            matKhauMaHoa: hashedPassword,
            vaiTro: VaiTro.GIAO_VIEN,
            email,
            soDienThoai,
          },
        });

        const teacher = await tx.hoSoGiaoVien.create({
          data: {
            nguoiDungId: user.id,
            maGiaoVien,
            hoTen: dto.hoTen.trim(),
            chuyenMon: dto.chuyenMon.trim(),
            bangCap: dto.bangCap?.trim() || null,
          },
        });

        return { user, teacher };
      });

      return this.serializeBigInt(result.teacher);
    } catch (err: any) {
      if (err.code === 'P2002') {
        const target = (err.meta?.target || []).join(', ');
        if (target.includes('ten_dang_nhap') || target.includes('tenDangNhap')) {
          throw new ConflictException(`Tên đăng nhập "${tenDangNhap}" đã tồn tại trong hệ thống.`);
        }
        if (target.includes('email')) {
          throw new ConflictException(`Email "${email}" đã tồn tại trong hệ thống.`);
        }
        if (target.includes('ma_giao_vien') || target.includes('maGiaoVien')) {
          throw new ConflictException(`Mã giáo viên "${maGiaoVien}" đã tồn tại trong hệ thống.`);
        }
        throw new ConflictException('Thông tin tài khoản giáo viên bị trùng lặp trong hệ thống.');
      }
      throw err;
    }
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
