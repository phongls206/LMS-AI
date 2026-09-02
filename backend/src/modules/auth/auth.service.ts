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
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
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

    // 4. Ký JWT Token
    const payload: JwtPayload = {
      sub: Number(user.id),
      vaiTro: user.vaiTro,
      email: user.email,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        id: Number(user.id),
        tenDangNhap: user.tenDangNhap,
        email: user.email,
        vaiTro: user.vaiTro,
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
    const user = await this.prisma.nguoiDung.findUnique({
      where: { id: BigInt(userId) },
      select: {
        id: true,
        tenDangNhap: true,
        email: true,
        soDienThoai: true,
        vaiTro: true,
        dangHoatDong: true,
        hoSoHocVien: {
          select: { id: true, maHocVien: true, hoTen: true, trinhDoCEFR: true },
        },
        hoSoGiaoVien: {
          select: { id: true, maGiaoVien: true, hoTen: true, chuyenMon: true },
        },
      },
    });

    if (!user) throw new NotFoundException('Không tìm thấy tài khoản.');

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
}
