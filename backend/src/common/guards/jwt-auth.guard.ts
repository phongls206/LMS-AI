import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * JwtAuthGuard — Bảo vệ toàn bộ Endpoint bằng JWT Bearer Token.
 * Nếu token không hợp lệ hoặc hết hạn, trả về HTTP 401 Unauthorized.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
