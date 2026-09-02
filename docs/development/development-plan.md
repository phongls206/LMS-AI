# Kế Hoạch Phát Triển Hệ Thống ETC English Center

> **Phiên bản:** 1.0  
> **Cập nhật lần cuối:** 02/09/2024  
> **Source of Truth:** `docs/design/EnglishCenterTOP.docx`  
> **Nguyên tắc:** Đúng Requirement → Đúng Design → Đúng Code → Đúng Test

---

## 1. Tổng Quan Dự Án

| Hạng mục | Thông tin |
|:---------|:----------|
| **Tên hệ thống** | ETC English Center — LMS AI |
| **Loại phần mềm** | Hệ thống Quản lý Trung tâm Ngoại ngữ tích hợp AI |
| **Frontend** | Next.js 14 (App Router / TypeScript / TailwindCSS) |
| **Backend** | NestJS (Node.js 20 LTS / TypeScript / Prisma ORM) |
| **Database** | PostgreSQL 15+ (3NF, 14 bảng quan hệ) |
| **AI Service** | Google Gemini API (Flash-Lite + Pro) |
| **Xác thực** | JWT + Argon2 + RBAC (4 vai trò) |
| **Tài liệu API** | Swagger UI tại `/api/docs` |

---

## 2. Cấu Trúc Thư Mục Dự Án

```text
lms-ai/
├── backend/                    ← NestJS API Server (Port 8000)
│   ├── prisma/
│   │   ├── schema.prisma       ← 14 Models chuẩn 3NF
│   │   └── seed.ts             ← Dữ liệu mẫu (4 vai trò, khóa học, lớp)
│   └── src/
│       ├── common/
│       │   ├── decorators/     ← @Roles(), @CurrentUser()
│       │   ├── guards/         ← JwtAuthGuard, RolesGuard
│       │   ├── interfaces/     ← JwtPayload
│       │   └── strategies/     ← JwtStrategy (Passport)
│       ├── prisma/             ← PrismaService (Global)
│       └── modules/
│           ├── auth/           ← UC001: Login, Me, ChangePassword, Logout
│           ├── users/          ← UC002, UC005: Học viên, Giáo viên
│           ├── courses/        ← UC003: Khóa học
│           ├── classes/        ← UC004: Lớp học & Lịch học
│           ├── enrollments/    ← UC006, UC007: Đăng ký & Học phí
│           ├── attendances/    ← UC008: Điểm danh
│           ├── grades/         ← UC009: Kết quả (20/30/50)
│           ├── statistics/     ← UC011: Thống kê báo cáo
│           └── ai/             ← UC012-014: Gemini AI + Fallback
│
├── frontend/                   ← Next.js SPA (Port 3000)
│   └── src/
│       ├── app/
│       │   ├── (auth)/         ← SCR-AUTH-01: Trang đăng nhập
│       │   ├── (admin)/        ← SCR-ADM-01..07 (7 màn hình)
│       │   ├── (teacher)/      ← SCR-TEA-01..05 (5 màn hình)
│       │   ├── (student)/      ← SCR-STU-01..08 (8 màn hình)
│       │   └── (staff)/        ← SCR-STA-01..03 (3 màn hình)
│       ├── components/         ← Reusable UI components
│       ├── hooks/              ← Custom React hooks
│       ├── services/           ← Axios API client (JWT interceptor)
│       └── types/              ← TypeScript Interfaces
│
├── docs/
│   ├── design/                 ← Tài liệu gốc (EnglishCenterTOP.docx/.md)
│   ├── development/            ← File này (development-plan.md)
│   ├── references/             ← Tài liệu tham khảo
│   └── testing/                ← Test plans & test cases
│
├── docker-compose.yml          ← PostgreSQL container (nếu dùng local)
└── .env.example                ← Template biến môi trường

```

---

## 3. Kế Hoạch Chi Tiết Theo Tuần (9 Tuần)

### TUẦN 1–3: Phân Tích & Thiết Kế ✅ (Đã hoàn thành)

| Công việc | Trạng thái |
|:----------|:-----------|
| Khảo sát 20 câu hỏi nghiệp vụ (Skill: `context-builder`) | ✅ Hoàn tất |
| Phân tích 14 Use Case, FR/NFR, Business Rules (Skill: `requirements-analysis`) | ✅ Hoàn tất |
| Thiết kế kiến trúc 4 tầng, Screen Flow 21 màn hình (Skill: `architecture-design`) | ✅ Hoàn tất |
| Thiết kế 14 bảng CSDL chuẩn 3NF — Prisma Schema (Skill: `database-design`) | ✅ Hoàn tất |
| Đặc tả 32 RESTful API Endpoints, JWT, RBAC (Skill: `api-design`) | ✅ Hoàn tất |
| Thiết kế AI Prompt Engineering + Fallback (Skill: `ai-design`) | ✅ Hoàn tất |
| Thiết lập 12 SKILL.md chuyên môn (`.agents/skills/`) | ✅ Hoàn tất |

---

### TUẦN 4: Khởi Tạo Nền Móng 🔄 (Đang thực hiện)

| Công việc | File/Lệnh | Trạng thái |
|:----------|:----------|:-----------|
| `docker-compose.yml` (PostgreSQL container) | `lms-ai/docker-compose.yml` | ✅ |
| `.env.example` & `.gitignore` chuẩn | `lms-ai/.env.example` | ✅ |
| Khởi tạo NestJS Backend | `backend/` | ✅ |
| Cài đặt dependencies Backend | `backend/package.json` | ✅ |
| `main.ts` (ValidationPipe, Swagger, CORS, Prefix) | `backend/src/main.ts` | ✅ |
| `PrismaModule` & `PrismaService` (Global) | `backend/src/prisma/` | ✅ |
| `AppModule` (tích hợp toàn bộ modules) | `backend/src/app.module.ts` | ✅ |
| `@Roles()` Decorator + `JwtAuthGuard` + `RolesGuard` | `backend/src/common/` | ✅ |
| `JwtStrategy` (Passport.js) | `backend/src/common/strategies/` | ✅ |
| **Prisma Schema** 14 Models đầy đủ | `backend/prisma/schema.prisma` | ✅ |
| **Auth Module** (UC001): Login, Me, ChangePassword, Logout | `backend/src/modules/auth/` | ✅ |
| **Seed Data** (4 vai trò, 2 khóa học, 2 lớp học) | `backend/prisma/seed.ts` | ✅ |
| Thiết lập Database (Neon.tech hoặc local) | `.env → DATABASE_URL` | 🔄 Chờ URL |
| `prisma migrate dev --name init` | — | ⏳ Sau khi có DB |
| `npm run db:seed` | — | ⏳ Sau migrate |
| `npm run start:dev` (kiểm tra server chạy) | `localhost:8000/api/docs` | ⏳ |
| Khởi tạo Next.js Frontend | `frontend/` | ⏳ |

---

### TUẦN 5: Phát Triển Backend — 32 APIs ⏳

**Module Auth** (UC001) — 4 APIs:

| API | Method | Endpoint | Quyền |
|:----|:-------|:---------|:------|
| Đăng nhập | POST | `/api/v1/auth/login` | Public |
| Thông tin hiện tại | GET | `/api/v1/auth/me` | Tất cả |
| Đổi mật khẩu | POST | `/api/v1/auth/change-password` | Tất cả |
| Đăng xuất | POST | `/api/v1/auth/logout` | Tất cả |

**Module Học viên** (UC002) — 4 APIs:

| API | Method | Endpoint | Quyền |
|:----|:-------|:---------|:------|
| Danh sách học viên | GET | `/api/v1/students` | QUAN_LY, TU_VAN_VIEN |
| Tạo hồ sơ học viên | POST | `/api/v1/students` | QUAN_LY, TU_VAN_VIEN |
| Chi tiết học viên | GET | `/api/v1/students/:id` | QUAN_LY, TU_VAN_VIEN, HOC_VIEN |
| Cập nhật hồ sơ | PUT | `/api/v1/students/:id` | QUAN_LY, TU_VAN_VIEN |

**Module Khóa học** (UC003) — 3 APIs:

| API | Method | Endpoint | Quyền |
|:----|:-------|:---------|:------|
| Danh sách khóa học | GET | `/api/v1/courses` | Tất cả |
| Tạo khóa học | POST | `/api/v1/courses` | QUAN_LY |
| Cập nhật khóa học | PUT | `/api/v1/courses/:id` | QUAN_LY |

**Module Lớp học & Lịch học** (UC004) — 4 APIs:

| API | Method | Endpoint | Quyền |
|:----|:-------|:---------|:------|
| Danh sách lớp học | GET | `/api/v1/classes` | Tất cả |
| Mở lớp học mới | POST | `/api/v1/classes` | QUAN_LY |
| Chi tiết lớp học | GET | `/api/v1/classes/:id` | Tất cả |
| Thêm lịch học | POST | `/api/v1/classes/:id/schedules` | QUAN_LY |

**Module Giáo viên & Phân công** (UC005) — 3 APIs:

| API | Method | Endpoint | Quyền |
|:----|:-------|:---------|:------|
| Danh sách giáo viên | GET | `/api/v1/teachers` | QUAN_LY |
| Phân công giáo viên | POST | `/api/v1/classes/:id/assign-teacher` | QUAN_LY |
| Lịch dạy của GV | GET | `/api/v1/teachers/me/schedule` | GIAO_VIEN |

**Module Đăng ký** (UC006) — 2 APIs:

| API | Method | Endpoint | Quyền | Ghi chú |
|:----|:-------|:---------|:------|:--------|
| Đăng ký lớp | POST | `/api/v1/enrollments` | HOC_VIEN, TU_VAN_VIEN | ACID Transaction 4 điều kiện |
| Danh sách đăng ký | GET | `/api/v1/enrollments` | QUAN_LY, TU_VAN_VIEN | — |

**Module Học phí** (UC007) — 2 APIs:

| API | Method | Endpoint | Quyền |
|:----|:-------|:---------|:------|
| Danh mục hóa đơn | GET | `/api/v1/invoices` | QUAN_LY, TU_VAN_VIEN |
| Ghi nhận thanh toán | POST | `/api/v1/invoices/:id/payments` | QUAN_LY, TU_VAN_VIEN |

**Module Điểm danh** (UC008) — 2 APIs:

| API | Method | Endpoint | Quyền |
|:----|:-------|:---------|:------|
| Danh sách buổi học | GET | `/api/v1/classes/:id/sessions` | GIAO_VIEN, QUAN_LY |
| Ghi điểm danh | POST | `/api/v1/sessions/:id/attendance` | GIAO_VIEN, QUAN_LY |

**Module Kết quả** (UC009) — 2 APIs (Auto tính điểm 20/30/50):

| API | Method | Endpoint | Quyền |
|:----|:-------|:---------|:------|
| Bảng điểm lớp | GET | `/api/v1/classes/:id/grades` | GIAO_VIEN, QUAN_LY |
| Nhập điểm | POST | `/api/v1/classes/:id/grades` | GIAO_VIEN |

**Module Tra cứu** (UC010) — 2 APIs:

| API | Method | Endpoint | Quyền |
|:----|:-------|:---------|:------|
| Lịch học cá nhân | GET | `/api/v1/students/me/schedule` | HOC_VIEN |
| Điểm cá nhân | GET | `/api/v1/students/me/grades` | HOC_VIEN |

**Module Thống kê** (UC011) — 1 API:

| API | Method | Endpoint | Quyền |
|:----|:-------|:---------|:------|
| Dashboard báo cáo | GET | `/api/v1/reports/dashboard` | QUAN_LY |

**Module AI** (UC012–UC014) — 3 APIs (Timeout: 10s → Retry → Fallback):

| API | Method | Endpoint | Quyền | Model Gemini |
|:----|:-------|:---------|:------|:-------------|
| Tư vấn lớp phù hợp | POST | `/api/v1/ai/consult-classes` | HOC_VIEN, TU_VAN_VIEN | Flash-Lite |
| Sinh 5 câu trắc nghiệm | POST | `/api/v1/ai/generate-exercises` | GIAO_VIEN, HOC_VIEN | Flash-Lite |
| Tóm tắt tiến độ | POST | `/api/v1/ai/summarize-progress` | Tất cả | Pro |

---

### TUẦN 6–7: Phát Triển Frontend — 21 Màn Hình ⏳

| Màn hình | Route | Vai trò |
|:---------|:------|:--------|
| SCR-AUTH-01 | `/login` | Tất cả |
| SCR-ADM-01..07 | `/admin/*` | QUAN_LY |
| SCR-TEA-01..05 | `/teacher/*` | GIAO_VIEN |
| SCR-STU-01..08 | `/student/*` | HOC_VIEN |
| SCR-STA-01..03 | `/staff/*` | TU_VAN_VIEN |

---

### TUẦN 8–9: Kiểm Thử & Hoàn Thiện ⏳

| Test Case | UC liên quan | Điều kiện kiểm tra |
|:----------|:-------------|:-------------------|
| TC006 | UC006 | Đăng ký lớp: 5 trường hợp biên (sĩ số đủ, trùng HV, sai CEFR, trùng lịch, thành công) |
| TC007 | UC007 | Học phí nhiều đợt: cộng dồn, đổi trạng thái CHUA_THANH_TOAN → DA_HOAN_THANH |
| TC008 | UC008 | Điểm danh 4 trạng thái (CO_MAT, VANG, DI_MUON, CO_PHEP) |
| TC009 | UC009 | Công thức CC×0.2 + GK×0.3 + CK×0.5 ≥ 50 và CC ≥ 80 → ĐẠT |
| TC012 | UC012 | AI tư vấn: Chỉ trả về lớp có trong CSDL, Fallback khi timeout |
| TC013 | UC013 | AI sinh bài: Đúng 5 câu JSON + đáp án + giải thích |
| TC014 | UC014 | AI tóm tắt: Không bịa dữ kiện, Fallback khi lỗi |

---

## 4. Business Rules Bắt Buộc Khi Code

> Mọi quy tắc dưới đây bắt buộc được kiểm tra tại **Backend Service Layer**,
> không phụ thuộc vào Frontend.

| Mã | Quy tắc | Trigger |
|:---|:--------|:--------|
| **BR-01** | Sĩ số lớp: 1 ≤ siSoHienTai ≤ 25 | Mỗi lần đăng ký lớp |
| **BR-02** | Đăng ký lớp phải thỏa 4 điều kiện đồng thời | `POST /enrollments` |
| **BR-03** | `diemTongKet = CC×0.2 + GK×0.3 + CK×0.5` | Mỗi lần nhập điểm |
| **BR-04** | ĐẠT khi `diemTongKet ≥ 50` VÀ `diemChuyenCan ≥ 80` | Cuối kỳ |
| **BR-05** | Không trùng phòng/giờ khi xếp lịch giáo viên | Phân công lớp |
| **BR-06** | AI chỉ trả về lớp có `maLopHoc` tồn tại trong CSDL | Sau mỗi lệnh gọi AI |

---

## 5. Tiêu Chuẩn Kỹ Thuật

### Bảo Mật
- Mật khẩu: Băm bằng **Argon2** (không dùng MD5/SHA1/bcrypt đơn giản).
- JWT Secret: Lưu trong `.env`, không hardcode.
- RBAC: Kiểm tra tại Backend (`RolesGuard`), không chỉ ẩn hiện UI.
- CORS: Chỉ cho phép `NEXT_PUBLIC_API_URL` (Frontend origin).

### AI Safety
- Timeout: 10 giây → Retry 1 lần → Fallback Rule-based.
- Validate output: Đối chiếu mã lớp với CSDL thực tế.
- Audit Log: Ghi mọi lượt gọi AI vào bảng `yeu_cau_ai`.

### Database
- Mọi thao tác đa bảng bọc trong **Prisma Transaction** (`$transaction`).
- Soft Delete: Không xóa cứng dữ liệu đã có giao dịch tài chính.
