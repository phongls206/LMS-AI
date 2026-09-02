---
name: security-review
description: Quy chuẩn rà soát an toàn thông tin, bảo mật mật khẩu, xác thực JWT RBAC, chống lỗ hổng OWASP và kiểm soát an toàn AI cho ETC English Center.
---

# Security Review Skill (Quy Chuẩn Rà Soát Bảo Mật & An Toàn Thông Tin)

## 1. Mục Đích & Phạm Vi
Skill này quy định danh mục kiểm tra an ninh (Security Checklist), các nguyên tắc phòng chống tấn công (OWASP Top 10), bảo mật phiên làm việc và kiểm soát an toàn dữ liệu GenAI cho hệ thống **ETC English Center**.

---

## 2. Checklist Rà Soát An Ninh 6 Tầng

1. **Bảo Mật Tài Khoản & Mật Khẩu:**
   - Mật khẩu lưu trong DB bắt buộc phải được băm một chiều an toàn bằng **Argon2** hoặc **Bcrypt** (tối thiểu 10 salt rounds), tuyệt đối không lưu Plaintext hoặc MD5/SHA1.
2. **Xác Thực Phiên & Phân Quyền (Authentication & RBAC):**
   - JWT Access Token phải có thời hạn hợp lý (VD: 15-60 phút), Secret Key đủ mạnh và lưu trong biến môi trường.
   - Mọi Endpoint nghiệp vụ phải được bảo vệ bởi `@UseGuards(JwtAuthGuard, RolesGuard)` ở tầng Backend, không phụ thuộc vào ẩn hiện nút trên giao diện.
3. **Phòng Chống SQL Injection & ORM Safety:**
   - Tuyệt đối không nối chuỗi SQL thô (`raw query`). Sử dụng Parameterized Queries hoặc ORM (TypeORM / Prisma).
4. **Phòng Chống XSS & CSRF:**
   - Dữ liệu người dùng nhập phải được sanitize/escape trước khi render ra HTML.
   - Cấu hình CORS chặt chẽ, chỉ cho phép Origin của Frontend truy cập API.
5. **Bảo Vệ Dữ Liệu Nhạy Cảm & Biến Môi Trường:**
   - Không commit file `.env`, API keys (Gemini API Key), Connection String lên Git repository.
6. **An Toàn GenAI (AI Security & Prompt Injection):**
   - Không gửi dữ liệu cá nhân nhạy cảm lên AI.
   - Áp dụng Post-processing validation để chặn ảo giác (Hallucination) và Prompt Injection từ phía người dùng.
