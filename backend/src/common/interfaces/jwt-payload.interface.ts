export interface JwtPayload {
  sub: number;       // nguoiDung.id
  vaiTro: string;    // VaiTro enum
  email: string;
  iat?: number;
  exp?: number;
}
