import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload) {
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
