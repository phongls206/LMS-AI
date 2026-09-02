---
name: api-design
description: Quy chuẩn thiết kế RESTful API, định dạng Payload DTO, cơ chế xác thực JWT, mã trạng thái HTTP và kiểm soát phân quyền RBAC cho ETC English Center.
---

# API Design Skill (Thiết Kế RESTful API & Xác Thực JWT)

## 1. Mục Đích & Phạm Vi
Skill này quy định chuẩn giao tiếp RESTful API, cấu trúc Endpoint, định dạng dữ liệu JSON (Request/Response DTO), mã trạng thái HTTP, cơ chế xác thực Token JWT và phân quyền RBAC cho toàn bộ hệ thống **ETC English Center**.

---

## 2. Quy Chuẩn Kỹ Thuật RESTful API

### 2.1 Tiêu Chuẩn Endpoint & Naming Convention
- Gốc API: `/api/v1/`
- Tên tài nguyên (Resources): Dùng danh từ số nhiều, chữ thường, nối từ bằng gạch ngang `-` (Kebab-case). Ví dụ: `/api/v1/students`, `/api/v1/course-classes`.
- Phương thức HTTP:
  - `GET`: Lấy danh sách hoặc chi tiết tài nguyên (Idempotent).
  - `POST`: Tạo mới tài nguyên hoặc kích hoạt tác vụ đặc thù (VD: `POST /api/v1/enrollments`, `POST /api/v1/ai/consult-class`).
  - `PUT` / `PATCH`: Cập nhật toàn phần hoặc một phần tài nguyên.
  - `DELETE`: Xóa mềm hoặc vô hiệu hóa tài nguyên.

### 2.2 Chuẩn Hóa Mã Trạng Thái HTTP (Status Codes)
- `200 OK`: Thành công (GET, PUT, PATCH).
- `201 Created`: Tạo mới bản ghi thành công (POST).
- `400 Bad Request`: Lỗi validation dữ liệu đầu vào (Thiếu trường bắt buộc, sai định dạng, vi phạm business rule).
- `401 Unauthorized`: Chưa đăng nhập hoặc JWT hết hạn / không hợp lệ.
- `403 Forbidden`: Đã đăng nhập nhưng không đủ quyền thực thi chức năng (RBAC check failed).
- `404 Not Found`: Không tìm thấy tài nguyên trong CSDL.
- `409 Conflict`: Trùng lặp dữ liệu (Trùng email, username, mã lớp, trùng lịch).
- `500 Internal Server Error`: Lỗi máy chủ không mong muốn.

### 2.3 Chuẩn Hóa Cấu Trúc Response JSON
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Thông điệp phản hồi thân thiện",
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 50
  }
}
```

---

## 3. Danh Mục RESTful API Theo Phân Hệ Nghiệp Vụ

1. **Authentication (`/api/v1/auth`):**
   - `POST /login` (Đăng nhập, trả về AccessToken)
   - `GET /me` (Lấy hồ sơ người dùng hiện tại)
   - `POST /change-password` (Đổi mật khẩu)
2. **Quản Lý Đào Tạo (`/api/v1/courses`, `/api/v1/classes`, `/api/v1/schedules`):**
   - CRUD Khóa học, Mở lớp, Phân công giảng dạy, Xếp lịch học tuần.
3. **Quản Lý Học Viên & Tuyển Sinh (`/api/v1/students`, `/api/v1/teachers`):**
   - CRUD Hồ sơ học viên, cập nhật điểm Placement Test CEFR, lịch rảnh.
4. **Đăng Ký & Học Phí (`/api/v1/enrollments`, `/api/v1/invoices`, `/api/v1/payments`):**
   - Đăng ký lớp (Check 4 điều kiện $\rightarrow$ Auto sinh hóa đơn), Lập phiếu thu tiền mặt/chuyển khoản.
5. **Học Tập & Điểm Danh (`/api/v1/attendances`, `/api/v1/grades`):**
   - Điểm danh 4 trạng thái theo buổi học, Nhập điểm Chuyên cần/Giữa kỳ/Cuối kỳ $\rightarrow$ Auto tính điểm tổng kết.
6. **Thống Kê Báo Cáo (`/api/v1/statistics`):**
   - `GET /revenue` (Doanh thu), `GET /class-enrollment` (Sĩ số), `GET /completion-rate` (Tỷ lệ hoàn thành).
7. **Tích Hợp GenAI (`/api/v1/ai`):**
   - `POST /consult-class` (AI tư vấn lớp)
   - `POST /generate-exercises` (AI sinh 5 câu trắc nghiệm)
   - `POST /summarize-progress` (AI tóm tắt tiến độ)

---

## 4. Nguyên Tắc Bảo Mật & Validation
- **Luôn kiểm tra DTO tại Backend:** Sử dụng `class-validator` (hoặc `Zod`) để chặn dữ liệu rác từ phía Client trước khi chạm vào Service layer.
- **Bảo vệ Endpoint bằng Guard:** Mọi API nghiệp vụ (trừ `/auth/login`) bắt buộc phải gắn `JwtAuthGuard` và `RolesGuard`.
