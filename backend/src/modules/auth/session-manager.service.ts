import { Injectable, Logger } from '@nestjs/common';

export interface UserSessionInfo {
  sessionId: string;
  userId: number;
  loggedInAt: Date;
}

/**
 * Quản lý phiên làm việc duy nhất (Single Concurrent Session Manager)
 * Đảm bảo mỗi tài khoản chỉ được phép đăng nhập và hoạt động trên một thiết bị/trình duyệt tại một thời điểm.
 * Khi phát hiện đăng nhập mới từ thiết bị khác, phiên cũ lập tức bị đá ra (Kickout).
 */
@Injectable()
export class SessionManagerService {
  private readonly logger = new Logger(SessionManagerService.name);
  
  // Bản đồ lưu trữ userId -> UserSessionInfo
  private readonly activeSessions = new Map<number, UserSessionInfo>();

  /**
   * Đăng ký một phiên làm việc mới cho người dùng.
   * Nếu người dùng này đã có phiên trước đó, phiên cũ sẽ bị ghi đè và hủy ngay lập tức.
   */
  registerSession(userId: number, sessionId: string): void {
    const existing = this.activeSessions.get(userId);
    if (existing && existing.sessionId !== sessionId) {
      this.logger.warn(
        `🚨 [Session Kickout] Tài khoản ID=${userId} vừa đăng nhập tại phiên mới [${sessionId.substring(
          0,
          8,
        )}...]. Phiên cũ [${existing.sessionId.substring(0, 8)}...] đã bị thu hồi!`,
      );
    }
    this.activeSessions.set(userId, {
      sessionId,
      userId,
      loggedInAt: new Date(),
    });
  }

  /**
   * Kiểm tra tính hợp lệ của phiên làm việc từ JWT Token.
   * Trả về true nếu sessionId khớp với phiên hiện tại đang kích hoạt của userId.
   * Trả về false nếu tài khoản đã đăng nhập nơi khác.
   */
  isValidSession(userId: number, sessionId?: string): boolean {
    if (!sessionId) return true; // Hỗ trợ tương thích ngược nếu có token cũ
    const current = this.activeSessions.get(userId);
    if (!current) {
      // Trường hợp máy chủ vừa restart nhưng người dùng vẫn còn JWT hợp lệ, tự động khôi phục phiên
      this.activeSessions.set(userId, {
        sessionId,
        userId,
        loggedInAt: new Date(),
      });
      return true;
    }
    return current.sessionId === sessionId;
  }

  /**
   * Thu hồi phiên làm việc khi người dùng chủ động bấm Đăng xuất
   */
  revokeSession(userId: number): void {
    this.activeSessions.delete(userId);
    this.logger.log(`Tài khoản ID=${userId} đã đăng xuất. Phiên làm việc đã được giải phóng.`);
  }
}
