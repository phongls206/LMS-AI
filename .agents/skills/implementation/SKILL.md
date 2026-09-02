---
name: implementation
description: Cẩm nang và quy chuẩn lập trình Fullstack chuyên nghiệp (NestJS + Next.js App Router + Prisma PostgreSQL + Gemini GenAI) cho hệ thống ETC English Center.
---

# 🚀 Implementation Skill — Quy Chuẩn Lập Trình & Viết Mã Nguồn Chuyên Nghiệp

## 1. Mục Đích & Phạm Vi Áp Dụng
Skill này đóng vai trò là **Cẩm nang kỹ thuật thực chiến (Standard Operating Procedure - SOP)** cho toàn bộ quá trình phát triển mã nguồn hệ thống **ETC English Center**, bao gồm Backend (NestJS), Frontend (Next.js 15+ App Router), Cơ sở dữ liệu (Prisma ORM & PostgreSQL) và Tích hợp Trí tuệ Nhân tạo (Gemini GenAI).

Mọi lập trình viên và AI Agent khi tham gia viết mã cho dự án bắt buộc phải tuân thủ nghiêm ngặt các nguyên tắc, cấu trúc thư mục và quy chuẩn bảo mật trong tài liệu này.

---

## 2. Cấu Trúc Mã Nguồn Chuẩn (Monorepo Architecture)

### 2.1 Backend Architecture (NestJS / TypeScript)
Áp dụng mô hình **Kiến trúc Phân tầng (Layered Architecture)** kết hợp **Module-based Pattern**:

```text
backend/src/
├── common/                     # Hạ tầng dùng chung toàn hệ thống
│   ├── decorators/             # @CurrentUser(), @Roles()
│   ├── filters/                # Global HttpExceptionFilter
│   ├── guards/                 # JwtAuthGuard, RolesGuard (RBAC)
│   ├── interceptors/           # TransformResponseInterceptor, LoggingInterceptor
│   └── constants/              # System constants, Enums
├── config/                     # Quản lý biến môi trường (.env)
├── prisma/                     # ORM Prisma Client & Schema
│   ├── schema.prisma           # 14 bảng quan hệ chuẩn 3NF
│   └── prisma.service.ts       # Prisma Service kết nối Neon PostgreSQL
└── modules/                    # Các Module nghiệp vụ độc lập (14 Use Cases)
    ├── auth/                   # UC001: Đăng nhập, JWT Token, Đổi mật khẩu, Logout
    ├── users/                  # UC002, UC003: Quản lý Hồ sơ Học viên & Giáo viên
    ├── courses/                # UC004: Quản lý Khóa học
    ├── classes/                # UC004, UC005: Mở lớp, Xếp lịch (chống trùng phòng), Phân công GV (chống trùng giờ)
    ├── enrollments/            # UC006, UC007: Đăng ký học, Hóa đơn & Quầy thu học phí ACID
    ├── attendances/            # UC008: Buổi học & Điểm danh chuyên cần
    ├── grades/                 # UC009, UC010: Nhập điểm & Bảng điểm theo công thức 20/30/50
    ├── statistics/             # UC011: Báo cáo Thống kê Doanh thu, Tỷ lệ Đỗ/Trượt, Sĩ số
    └── ai/                     # UC012, UC013, UC014: Tư vấn lớp, Sinh bài tập, Tóm tắt tiến độ
```

### 2.2 Frontend Architecture (Next.js 15+ App Router / Tailwind CSS)
Tổ chức giao diện theo **Role-Based Routing (Phân luồng màn hình theo vai trò người dùng)**:

```text
frontend/src/
├── app/                        # Next.js App Router (23 Screen Flows)
│   ├── admin/                  # [SCR-ADM-01..07] Dashboard, Khóa học, Lớp & Lịch, Học viên, Giáo viên, Học phí, Báo cáo
│   ├── staff/                  # [SCR-STA-01..03] Bàn tiếp nhận, Tiếp nhận học viên mới, Quầy thu học phí
│   ├── teacher/                # [SCR-TEA-01..05] Dashboard, Lớp giảng dạy, Sổ điểm danh, Bảng điểm, AI Trợ giảng
│   ├── student/                # [SCR-STU-01..08] Dashboard, Đăng ký lớp, TKB, Học phí, Bảng điểm, 3 màn hình AI
│   ├── login/                  # [SCR-AUTH-01] Màn hình đăng nhập đa vai trò
│   └── change-password/        # [SCR-AUTH-02] Đổi mật khẩu lần đầu & định kỳ
├── components/                 # UI Components tái sử dụng (AppLayout, Navbar, Sidebar, Modals, Badges)
├── services/                   # API Client kết nối Backend (Axios instance + JWT Interceptor)
└── types/                      # TypeScript Interface & Type Definitions đồng bộ 100% với Backend DTO
```

---

## 3. Nguyên Tắc Lập Trình Cốt Lõi (Core Engineering Principles)

### 3.1 Backend Authority (Quyền Lực Tối Thượng Thuộc Về Backend)
- **Tuyệt đối không tin tưởng dữ liệu từ Frontend gửi lên.** Mọi ràng buộc nghiệp vụ (sĩ số $\le 25$, điều kiện CEFR đầu vào, kiểm tra trùng giờ dạy của giáo viên, trùng phòng học, tính toán công nợ và điểm tổng kết) **bắt buộc phải kiểm tra và tính toán tại Backend**.
- Frontend chỉ đóng vai trò hiển thị giao diện, điều hướng và hỗ trợ trải nghiệm người dùng (UX).

### 3.2 Quản Lý Giao Dịch ACID (Multi-Table Transaction Safety)
Tất cả các nghiệp vụ làm thay đổi trạng thái của từ 2 bảng CSDL trở lên **bắt buộc phải bọc trong `prisma.$transaction`** để đảm bảo tính toàn vẹn dữ liệu:

1. **Nghiệp vụ Ghi danh lớp học (`UC006`):**
   ```text
   Bắt đầu Transaction:
   1. Tạo bản ghi DangKyHoc (trạng thái: CHO_THANH_TOAN).
   2. Tăng siSoHienTai của LopHoc lên 1 (nếu đã đủ 25 HV -> Rollback ngay).
   3. Tự động sinh HoaDon tương ứng (soTienPhaiTra = hocPhi, soTienDaTra = 0, trangThai = CHUA_THANH_TOAN).
   Commit Transaction.
   ```
2. **Nghiệp vụ Thu học phí & Kích hoạt học viên (`UC007`):**
   ```text
   Bắt đầu Transaction:
   1. Tạo bản ghi phiếu thu ThanhToan (Mã GD-xxxxx, lưu nguoiThuId của TVV).
   2. Cập nhật soTienDaTra trên HoaDon.
   3. Nếu soTienDaTra >= soTienPhaiTra -> Chuyển HoaDon sang DA_HOAN_THANH
      và TỰ ĐỘNG chuyển DangKyHoc sang DA_XAC_NHAN (Học viên chính thức có tên trong sổ điểm danh).
   Commit Transaction.
   ```
3. **Nghiệp vụ Tạo tài khoản & Hồ sơ (`UC002`, `UC003`):**
   ```text
   Bắt đầu Transaction:
   1. Tạo tài khoản NguoiDung (Mã hóa mật khẩu bằng Argon2).
   2. Tạo hồ sơ HoSoHocVien hoặc HoSoGiaoVien gắn với NguoiDung.id vừa tạo.
   Commit Transaction.
   ```

### 3.3 Quy Tắc Serialization Dữ Liệu `BigInt` (PostgreSQL + Prisma)
PostgreSQL sử dụng kiểu `BIGINT` cho khóa chính và khóa ngoại, trong khi chuẩn JavaScript JSON không thể tự động serialize kiểu `bigint`. Do đó, mọi Service Backend bắt buộc phải chuyển đổi `BigInt` thành `Number` trước khi trả kết quả:

```typescript
private serializeBigInt(obj: any) {
  return JSON.parse(
    JSON.stringify(obj, (key, value) =>
      typeof value === 'bigint' ? Number(value) : value,
    ),
  );
}
```

### 3.4 Quy Tắc Chống Xóa Cứng (Soft Delete & Status Transitions)
Để bảo toàn vẹn dữ liệu lịch sử đào tạo, kết quả học tập và nhật ký giao dịch tài chính:
- **Khóa học (`KhoaHoc`):** Không xóa cứng nếu đã có lớp học. Sử dụng trạng thái `DANG_MO` / `NGUNG_HOAT_DONG`.
- **Giáo viên (`HoSoGiaoVien`):** Không xóa giáo viên đã có lịch dạy hoặc điểm danh. Sử dụng chuyển trạng thái: `DANG_LAM_VIEC` $\rightarrow$ `TAM_NGHI` $\rightarrow$ `DA_NGHI_VIEC`.
- **Lớp học (`LopHoc`):** Quản lý qua 5 trạng thái vận hành: `SAP_MO` $\rightarrow$ `DANG_MO_DANG_KY` $\rightarrow$ `DANG_HOC` $\rightarrow$ `DA_KET_THUC` (hoặc `DA_HUY`).

---

## 4. Bảo Mật & Kiểm Soát Truy Cập (Security & RBAC Protocol)

### 4.1 Cơ Chế Xác Thực & Phân Quyền Backend
1. **Mật khẩu an toàn:** Bắt buộc băm mật khẩu bằng **Argon2** (hoặc Bcrypt với salt rounds $\ge 10$) trước khi lưu vào CSDL.
2. **Access Token:** Sử dụng JWT chứa `{ sub: userId, tenDangNhap, vaiTro }` với thời hạn hợp lý (ví dụ: 1 ngày).
3. **RBAC Guard:** Áp dụng `@UseGuards(JwtAuthGuard, RolesGuard)` và `@Roles(VaiTro.QUAN_LY, ...)` ở cấp độ Controller và Method:
   ```typescript
   @Post('classes')
   @Roles(VaiTro.QUAN_LY)
   createClass(@Body() dto: CreateClassDto) { ... }
   ```

### 4.2 Bảo Vệ Tuyến Đường Phía Frontend (Client-side Route Protection)
Mọi trang nghiệp vụ của Frontend phải được bọc trong component `<AppLayout allowedRoles={['...']}>`:
- Nếu người dùng chưa đăng nhập $\rightarrow$ Chuyển hướng về `/login`.
- Nếu vai trò không nằm trong `allowedRoles` $\rightarrow$ Chuyển hướng về đúng Dashboard tương ứng của vai trò đó.
- Axios HTTP Client tự động đính kèm `Authorization: Bearer <token>` vào mọi request qua Request Interceptor.

---

## 5. Quy Chuẩn Tích Hợp Trí Tuệ Nhân Tạo (Gemini GenAI Standard)

Toàn bộ 3 tính năng AI (`UC012`, `UC013`, `UC014`) bắt buộc phải tuân theo mô hình **3 Lớp Phòng Thủ (3-Tier Defense)**:

```text
[ Người Dùng Yêu Cầu AI ]
           │
           ▼
[ Lớp 1: Gọi Gemini SDK (Khống chế Timeout 30s + System Prompt định dạng JSON) ]
           │
     ┌─────┴───────────────────────┐
 (Thành công)                   (Lỗi / Timeout / Hết Quota)
     │                             │
     ▼                             ▼
[ Lớp 2: Bộ lọc Chống Ảo Giác ] [ Lớp 3: Kích hoạt Fallback Tức thì ]
  ├── Đối soát ID lớp thực tế DB    ├── Lấy dữ liệu tĩnh từ fallback-data.ts
  └── Lọc bỏ các lớp không tồn tại  └── Đảm bảo người dùng luôn nhận được kết quả
     │                             │
     └─────────────┬───────────────┘
                   ▼
[ Ghi Audit Log vào bảng YeuCauAI (nguoiDungId, loaiTacVu, thoiGianPhanHoi) ]
                   │
                   ▼
[ Trả kết quả JSON chuẩn xác về Frontend ]
```

---

## 6. Quy Trình Triển Khai Tính Năng Chuẩn 6 Bước (End-to-End Workflow)

Khi xây dựng bất kỳ tính năng mới hoặc nâng cấp tính năng cũ, lập trình viên phải thực hiện tuần tự:

```text
Bước 1: Đọc & Đối soát Tài liệu Thiết kế (Word SRS, Use Case, Screen Flow, Schema)
  │
Bước 2: Cập nhật Prisma Schema & Chạy Migration (nếu có thay đổi CSDL)
  │
Bước 3: Xây dựng Backend DTO (Validation Pipes) & Service (Business Logic + ACID Transactions)
  │
Bước 4: Xây dựng Backend Controller, gắn @Roles Guard và cấu hình Swagger Docs
  │
Bước 5: Xây dựng Frontend Service API Client & Trang Giao diện UI/UX (Next.js App Router)
  │
Bước 6: Build kiểm tra lỗi (`npm run build`), Viết Unit/Integration Test và Xác thực vận hành
```

---

## 💡 NGUYÊN TẮC VÀNG
> **Đúng Requirement $\rightarrow$ Đúng Design $\rightarrow$ Đúng Code $\rightarrow$ Đúng Test**
