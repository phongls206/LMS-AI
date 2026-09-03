import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { SessionManagerService } from '../../modules/auth/session-manager.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
    private sessionManager: SessionManagerService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload) {
    // 1. Kiểm tra cơ chế Single Concurrent Session: Đẩy tài khoản cũ ra nếu có đăng nhập mới
    if (!this.sessionManager.isValidSession(Number(payload.sub), payload.sessionId)) {
      throw new UnauthorizedException(
        'Tài khoản của bạn đã được đăng nhập từ một thiết bị hoặc phiên làm việc khác. Phiên làm việc hiện tại đã bị kết thúc để bảo vệ tài khoản.',
      );
    }

    // 2. Tìm người dùng trong CSDL
    const user = await this.prisma.nguoiDung.findUnique({
      where: { id: BigInt(payload.sub) },
      select: {
        id: true,
        tenDangNhap: true,
        email: true,
        vaiTro: true,
        dangHoatDong: true,
      },
    });

    if (!user || !user.dangHoatDong) {
      throw new UnauthorizedException('Tài khoản không tồn tại hoặc đã bị khóa.');
    }

    return user;
  }
}
