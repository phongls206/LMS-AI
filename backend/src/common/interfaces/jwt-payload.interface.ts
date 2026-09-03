export interface JwtPayload {
  sub: number; // nguoiDung.id
  vaiTro: string; // VaiTro enum
  email: string;
  sessionId?: string; // Mã phiên làm việc duy nhất để kiểm soát Single Concurrent Session
  iat?: number;
  exp?: number;
}
