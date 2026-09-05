import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { LoginDto, ChangePasswordDto } from './dto/auth.dto';
import { JwtPayload } from '../../common/interfaces/jwt-payload.interface';
import { SessionManagerService } from './session-manager.service';
import { randomUUID } from 'crypto';
import * as argon2 from 'argon2';
import { VaiTro } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private sessionManager: SessionManagerService,
  ) {}

  /**
   * UC001 — Đăng nhập và cấp JWT Token
   */
  async login(dto: LoginDto) {
    // 1. Tìm người dùng theo tên đăng nhập
    const user = await this.prisma.nguoiDung.findUnique({
      where: { tenDangNhap: dto.tenDangNhap },
    });

    if (!user) {
      throw new UnauthorizedException('Tên đăng nhập hoặc mật khẩu không đúng.');
    }

    // 2. Kiểm tra tài khoản có đang hoạt động không
    if (!user.dangHoatDong) {
      throw new UnauthorizedException('Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản lý.');
    }

    // 3. Xác thực mật khẩu băm (Argon2)
    const isPasswordValid = await argon2.verify(user.matKhauMaHoa, dto.matKhau);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Tên đăng nhập hoặc mật khẩu không đúng.');
    }

    // 4. Khởi tạo phiên làm việc duy nhất (Single Concurrent Session Kickout)
    const sessionId = randomUUID();
    this.sessionManager.registerSession(Number(user.id), sessionId);

    // 5. Ký JWT Token
    const payload: JwtPayload = {
      sub: Number(user.id),
      vaiTro: user.vaiTro,
      email: user.email,
      sessionId,
    };

    const accessToken = this.jwtService.sign(payload);

    const maTuVanVien =
      user.vaiTro === VaiTro.TU_VAN_VIEN
        ? `TVV${String(user.tenDangNhap.replace(/\D/g, '') || user.id).padStart(3, '0')}`
        : undefined;

    return {
      accessToken,
      user: {
        id: Number(user.id),
        tenDangNhap: user.tenDangNhap,
        email: user.email,
        vaiTro: user.vaiTro,
        hoTen: user.hoTen,
        maTuVanVien,
      },
    };
  }

  private serializeBigInt(obj: any) {
    return JSON.parse(
      JSON.stringify(obj, (key, value) =>
        typeof value === 'bigint' ? Number(value) : value,
      ),
    );
  }

  /**
   * UC001 — Lấy thông tin người dùng hiện tại từ JWT
   */
  async getMe(userId: number) {
    let user = await this.prisma.nguoiDung.findUnique({
      where: { id: BigInt(userId) },
      select: {
        id: true,
        tenDangNhap: true,
        email: true,
        soDienThoai: true,
        vaiTro: true,
        dangHoatDong: true,
        hoTen: true,
        hoSoHocVien: {
          select: {
            id: true,
            maHocVien: true,
            hoTen: true,
            trinhDoCEFR: true,
            ngaySinh: true,
            gioiTinh: true,
            diaChi: true,
          },
        },
        hoSoGiaoVien: {
          select: {
            id: true,
            maGiaoVien: true,
            hoTen: true,
            chuyenMon: true,
            bangCap: true,
          },
        },
      },
    });

    if (!user) throw new NotFoundException('Không tìm thấy tài khoản.');

    // Tự động khởi tạo hồ sơ học viên nếu tài khoản học viên chưa liên kết hồ sơ
    if (user.vaiTro === 'HOC_VIEN' && !user.hoSoHocVien) {
      const nextNum = (await this.prisma.hoSoHocVien.count()) + 1;
      const maHV = `HV${String(nextNum).padStart(3, '0')}`;
      const newProfile = await this.prisma.hoSoHocVien.create({
        data: {
          nguoiDung: { connect: { id: user.id } },
          maHocVien: maHV,
          hoTen: user.hoTen || user.tenDangNhap,
          trinhDoCEFR: 'B1',
          nguonDanhGia: 'Tài khoản đăng ký trực tiếp',
        },
      });
      (user as any).hoSoHocVien = {
        id: newProfile.id,
        maHocVien: newProfile.maHocVien,
        hoTen: newProfile.hoTen,
        trinhDoCEFR: newProfile.trinhDoCEFR,
        ngaySinh: newProfile.ngaySinh,
        gioiTinh: newProfile.gioiTinh,
        diaChi: newProfile.diaChi,
      };
    }

    // Tự động khởi tạo hồ sơ giảng viên nếu tài khoản giáo viên chưa liên kết hồ sơ
    if (user.vaiTro === 'GIAO_VIEN' && !user.hoSoGiaoVien) {
      const nextNum = (await this.prisma.hoSoGiaoVien.count()) + 1;
      const maGV = `GV${String(nextNum).padStart(3, '0')}`;
      const newProfile = await this.prisma.hoSoGiaoVien.create({
        data: {
          nguoiDung: { connect: { id: user.id } },
          maGiaoVien: maGV,
          hoTen: user.hoTen || user.tenDangNhap,
          chuyenMon: 'Tiếng Anh Tổng Quát',
        },
      });
      (user as any).hoSoGiaoVien = {
        id: newProfile.id,
        maGiaoVien: newProfile.maGiaoVien,
        hoTen: newProfile.hoTen,
        chuyenMon: newProfile.chuyenMon,
        bangCap: newProfile.bangCap,
      };
    }

    if (user.vaiTro === VaiTro.TU_VAN_VIEN) {
      const num = user.tenDangNhap.replace(/\D/g, '') || String(user.id);
      (user as any).maTuVanVien = `TVV${String(num).padStart(3, '0')}`;
    }

    return this.serializeBigInt(user);
  }

  /**
   * UC001 — Đổi mật khẩu người dùng
   */
  async changePassword(userId: number, dto: ChangePasswordDto) {
    const user = await this.prisma.nguoiDung.findUnique({
      where: { id: BigInt(userId) },
    });

    if (!user) throw new NotFoundException('Không tìm thấy tài khoản.');

    // Kiểm tra mật khẩu cũ
    const isOldPasswordValid = await argon2.verify(user.matKhauMaHoa, dto.matKhauCu);
    if (!isOldPasswordValid) {
      throw new BadRequestException('Mật khẩu hiện tại không đúng.');
    }

    // Băm mật khẩu mới
    const newHashedPassword = await argon2.hash(dto.matKhauMoi);

    await this.prisma.nguoiDung.update({
      where: { id: BigInt(userId) },
      data: { matKhauMaHoa: newHashedPassword },
    });

    return { message: 'Đổi mật khẩu thành công.' };
  }

  /**
   * UC001 — Thu hồi phiên làm việc khi người dùng đăng xuất
   */
  async logout(userId: number) {
    this.sessionManager.revokeSession(userId);
    return { message: 'Đăng xuất thành công. Phiên làm việc đã được giải phóng.' };
  }
}
