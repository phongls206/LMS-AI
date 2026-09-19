---
name: implementation
description: Quy chuẩn lập trình Backend chuyên sâu (NestJS, TypeScript, Prisma ORM, Neon PostgreSQL, Argon2, JWT/RBAC, Clean Architecture) cho ETC English Center.
---

# ⚙️ Backend Engineering & Implementation Skill

Quy chuẩn lập trình Backend chuyên sâu dành cho hệ thống quản lý trung tâm ngoại ngữ ETC English. Mọi logic nghiệp vụ trọng yếu, bảo mật và toàn vẹn dữ liệu **bắt buộc xử lý và kiểm soát tại Backend**.

---

## 1. Backend Tech Stack & Kiến Trúc Phân Tầng

- **Runtime & Framework:** Node.js, NestJS (Modular Architecture), TypeScript (Strict Type-Safety).
- **Database & ORM:** PostgreSQL (Neon Cloud), Prisma ORM v6.
- **Bảo mật & Xác thực:** Argon2 (Password hashing), JWT (`@nestjs/jwt`, Passport JWT Strategy), RBAC Guards.
- **Tích hợp GenAI:** `@google/genai` (Gemini 2.5 Flash), structured JSON output, Fallback Cache.
- **Kiến trúc mô-đun:**
  ```text
  src/
  ├── common/        # Guards (JwtAuth, Roles), Decorators (@Roles, @CurrentUser), Strategies
  ├── config/        # PrismaService, Configuration modules
  ├── modules/       # Auth, Users, Courses, Classes, Enrollments, Grades, Reports, AI
  └── main.ts        # Global ValidationPipe, Swagger config, CORS
  ```

---

## 2. Ràng Buộc Xác Thực Tài Khoản & Mật Khẩu (Account Guardrails)

### 2.1 Chuẩn hóa Tên Đăng Nhập (Username)
- **Tuyệt đối không chứa khoảng trắng:** Không chấp nhận ký tự trắng (`\s`) ở bất kỳ vị trí nào (đầu, cuối hoặc giữa).
- **Ký tự hợp lệ:** Chỉ chấp nhận chữ thường không dấu, chữ số, gạch dưới, gạch ngang, chấm: `/^[a-zA-Z0-9_.-]+$/`.
- **Độ dài:** Tối thiểu 3 ký tự, tối đa 50 ký tự.
- **Sanitization:** Luôn chuẩn hóa `.trim().toLowerCase()` trước khi kiểm tra và lưu DB.

### 2.2 Quy chuẩn Mật Khẩu (Password)
- **Tạo mới:** Tối thiểu 6 ký tự, không chứa khoảng trắng, hash bằng `argon2.hash()`.
- **Đổi mật khẩu (`ChangePasswordDto`):** Tối thiểu 8 ký tự, xác thực mật khẩu cũ trước khi đổi.
- **Zero-plaintext:** Tuyệt đối không lưu, không log mật khẩu thô ra console/file. Loại bỏ `matKhauMaHoa` khỏi output JSON trả về client.

---

## 3. Quy Chuẩn DTO & Validation Pipeline (`class-validator`)

Mọi Controller bắt buộc nhận dữ liệu qua DTO có decorator xác thực nghiêm ngặt:

```typescript
export class CreateStudentDto {
  @ApiPropertyOptional({ example: 'student03' })
  @IsOptional()
  @IsString()
  @MinLength(3, { message: 'Tên đăng nhập phải có ít nhất 3 ký tự.' })
  @MaxLength(50, { message: 'Tên đăng nhập không được vượt quá 50 ký tự.' })
  @Matches(/^\S+$/, { message: 'Tên đăng nhập không được chứa khoảng trắng.' })
  @Matches(/^[a-zA-Z0-9_.-]+$/, { message: 'Tên đăng nhập chỉ chứa chữ cái, số, _, -, .' })
  tenDangNhap?: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự.' })
  @Matches(/^\S+$/, { message: 'Mật khẩu không được chứa khoảng trắng.' })
  matKhau: string;

  @IsEmail({}, { message: 'Email không đúng định dạng.' })
  email: string;
}
```

---

## 4. Giao Dịch Toàn Vẹn ACID (`prisma.$transaction`)

Mọi thao tác ghi dữ liệu liên đới từ 2 bảng trở lên bắt buộc phải bọc trong `$transaction`:
- **Tiếp nhận học viên (`UC002`):** Tạo `NguoiDung` $\rightarrow$ Tạo `HoSoHocVien` $\rightarrow$ Rollback nếu bất kỳ bước nào lỗi.
- **Tạo giáo viên (`UC003`):** Tạo `NguoiDung` $\rightarrow$ Tạo `HoSoGiaoVien`.
- **Ghi danh học viên (`UC006`):** Check sĩ số $< 25$ $\rightarrow$ Tạo `DangKyHoc` (`CHO_THANH_TOAN`) $\rightarrow$ Tăng `LopHoc.siSoHienTai` $\rightarrow$ Tự động tạo `HoaDon` (`CHUA_THANH_TOAN`).
- **Thu học phí (`UC007`):** Tạo `ThanhToan` $\rightarrow$ Cập nhật `HoaDon.soTienDaTra` $\rightarrow$ Nếu hoàn tất, chuyển `HoaDon.DA_HOAN_THANH` và kích hoạt `DangKyHoc.DA_XAC_NHAN`.

---

## 5. Chuẩn Hóa Thời Gian & Kiểu Dữ Liệu PostgreSQL

### 5.1 Xử lý Date/Time UTC
- PostgreSQL `@db.Time` lưu dạng UTC. Khi parse chuỗi giờ (`HH:mm`), **bắt buộc thêm hậu tố `'Z'`**:
  ```typescript
  private parseTimeString(timeStr: string): Date {
    return new Date(`1970-01-01T${timeStr}:00Z`);
  }
  ```
- Luôn kèm `orderBy: [{ thuTrongTuan: 'asc' }, { gioBatDau: 'asc' }]` khi query thời khóa biểu.

### 5.2 Xử lý BigInt Serialization
- Prisma PostgreSQL trả về kiểu `bigint` cho các khóa chính. Luôn serialize sang `Number` trước khi trả JSON về client:
  ```typescript
  private serializeBigInt(obj: any) {
    return JSON.parse(
      JSON.stringify(obj, (_, value) =>
        typeof value === 'bigint' ? Number(value) : value,
      ),
    );
  }
  ```

---

## 6. Kiểm Soát Phân Quyền RBAC & Controller Guarding

- Mọi endpoint nhạy cảm phải được bảo vệ bởi `JwtAuthGuard`, `RolesGuard` và `@Roles(...)`:
  ```typescript
  @ApiTags('Users')
  @Controller('users')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  export class UsersController {
    @Post('students')
    @Roles(VaiTro.QUAN_LY, VaiTro.TU_VAN_VIEN)
    createStudent(@Body() dto: CreateStudentDto) {
      return this.usersService.createStudent(dto);
    }
  }
  ```
- Phân quyền nghiêm ngặt:
  - `QUAN_LY`: Toàn quyền hệ thống, quản lý khóa học, lớp học, nhân sự, báo cáo tài chính.
  - `TU_VAN_VIEN`: Tiếp nhận học viên mới, tạo phiếu thu, tra cứu và tư vấn tuyển sinh.
  - `GIAO_VIEN`: Quản lý lớp phụ trách, điểm danh buổi học, nhập bảng điểm, sinh bài tập AI.
  - `HOC_VIEN`: Xem lịch học cá nhân, bảng điểm, đóng học phí, làm bài luyện tập AI.

---

## 7. Kiến Trúc 3 Tầng GenAI Service (Zero-Trust)

1. **Tier 1 (Invocation):** Gọi Gemini SDK với System Prompt nghiêm ngặt, JSON Schema, timeout 30s (`Promise.race`).
2. **Tier 2 (Post-Validation):** Kiểm tra đối chiếu dữ liệu AI sinh ra với DB thực tế (chống ảo giác ID lớp, mã khóa học).
3. **Tier 3 (Fallback & Audit):** Tự động trả dữ liệu chuẩn từ cache (`fallback-data.ts`) khi API timeout hoặc lỗi mạng. Luôn ghi log vào bảng `YeuCauAI`.

---

## 8. Backend Quality Checklist Trước Khi Hoàn Thành
- [ ] DTO có validate đầy đủ (chặn khoảng trắng username, password $\ge 6$ ký tự, email hợp lệ).
- [ ] Mật khẩu được mã hóa bằng Argon2, không lộ ra response.
- [ ] Tất cả thao tác ghi nhiều bảng đều dùng `prisma.$transaction`.
- [ ] Hàm thời gian parse có `'Z'` chuẩn UTC, không lỗi so sánh `@db.Time`.
- [ ] BigInt được serialize an toàn trước khi trả JSON.
- [ ] Chạy `npm run build` trong thư mục `backend` đạt mã thoát 0 (zero errors).
