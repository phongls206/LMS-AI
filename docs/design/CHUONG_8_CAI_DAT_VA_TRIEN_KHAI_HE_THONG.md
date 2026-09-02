# CHƯƠNG 8: CÀI ĐẶT VÀ TRIỂN KHAI HỆ THỐNG

---

## 8.1 Môi Trường Và Yêu Cầu Kỹ Thuật

### 8.1.1 Yêu cầu Cấu hình Phần cứng
Hệ thống Quản lý trung tâm ngoại ngữ tích hợp AI (ETC English) được xây dựng theo kiến trúc phân tán (Multi-tier Cloud-ready Architecture), cho phép tối ưu hóa tài nguyên phần cứng máy chủ và máy khách:

*Bảng 8.1: Yêu cầu cấu hình phần cứng tối thiểu và khuyến nghị*
| Thành phần | Cấu hình tối thiểu | Cấu hình khuyến nghị |
|:---|:---|:---|
| **Máy chủ Phát triển (Dev Server)** | CPU 2 Cores, RAM 4GB, Ổ cứng trống 5GB | CPU 4 Cores, RAM 8GB–16GB, Ổ cứng SSD 20GB |
| **Máy khách Người dùng (Client)** | Thiết bị có trình duyệt web (PC, Laptop, Tablet, Smartphone) | PC/Laptop màn hình Full HD, kết nối Internet ổn định |
| **Băng thông Mạng** | Tối thiểu 5 Mbps (truy vấn dữ liệu và gọi GenAI API) | Khuyến nghị 20 Mbps trở lên |

---

### 8.1.2 Yêu cầu Môi trường Phần mềm & Công nghệ
Hệ thống được phát triển hoàn toàn trên nền tảng TypeScript xuyên suốt từ Frontend đến Backend:

*Bảng 8.2: Danh mục công nghệ và phiên bản phần mềm cốt lõi*
| Thành phần | Công nghệ / Framework | Phiên bản | Mục đích sử dụng |
|:---|:---|:---|:---|
| **Runtime Môi trường** | Node.js (LTS) | `v20.x` hoặc `v22.x` | Môi trường thực thi JavaScript/TypeScript phía máy chủ |
| **Quản lý Gói (Package Manager)** | npm | `10.x+` | Quản lý và cài đặt các thư viện phụ thuộc |
| **Backend Framework** | NestJS | `v11.x` / `v12.x` | Xây dựng RESTful API kiến trúc phân tầng Modular |
| **ORM / Data Access Layer** | Prisma ORM | `v6.4.1` (Stable) | Quản lý Schema, Migration và Type-safe Database Client |
| **Frontend Framework** | Next.js (App Router) | `v14.x` / `v16.x` | Xây dựng giao diện SSR/CSR với TypeScript |
| **CSS & Giao diện** | TailwindCSS + Lucide Icons | `v3.4.x` / `v4.x` | Thiết kế giao diện hiện đại, Responsive đa thiết bị |
| **Hệ Quản trị Cơ sở Dữ liệu** | PostgreSQL (Neon.tech) | `v15+ / v16+` | CSDL quan hệ Serverless Cloud Database |
| **Trí tuệ Nhân tạo (GenAI)** | Google Gemini SDK | `@google/genai` | Tích hợp mô hình ngôn ngữ lớn (Gemini 2.5 Flash/Pro) |
| **Bảo mật & Mã hóa** | Argon2 + JWT | `argon2`, `@nestjs/jwt` | Băm mật khẩu an toàn và xác thực phân quyền Stateless |

---

### 8.1.3 Cấu trúc Thư mục Mã Nguồn Chuẩn
Dự án được tổ chức theo mô hình Monorepo rõ ràng giữa Backend và Frontend:

```text
D:\MyProjects\lms-ai\
├── backend/                        # Máy chủ Backend (NestJS)
│   ├── prisma/
│   │   ├── schema.prisma           # 14 Models thực thể chuẩn 3NF
│   │   └── seed.ts                 # Script nạp dữ liệu mẫu ban đầu
│   ├── src/
│   │   ├── common/                 # Guards, Decorators, Strategies (RBAC)
│   │   ├── modules/
│   │   │   ├── auth/               # Module xác thực JWT & Argon2
│   │   │   ├── users/              # Module học viên & giáo viên
│   │   │   ├── courses/            # Module quản lý khóa học
│   │   │   ├── classes/            # Module lớp học & lịch học (chống trùng phòng/GV)
│   │   │   ├── enrollments/        # Module đăng ký lớp & hóa đơn học phí
│   │   │   ├── attendances/        # Module buổi học & điểm danh 4 trạng thái
│   │   │   ├── grades/             # Module bảng điểm (công thức 20/30/50)
│   │   │   ├── statistics/         # Module báo cáo doanh thu & tỷ lệ hoàn thành
│   │   │   └── ai/                 # Module tích hợp Gemini AI & Lọc ảo giác
│   │   ├── prisma/                 # Prisma Module & Prisma Service
│   │   ├── app.module.ts           # Root Module của NestJS
│   │   └── main.ts                 # Điểm khởi chạy hệ thống, Swagger & Validation
│   ├── .env                        # File biến môi trường Backend
│   ├── package.json
│   └── tsconfig.json
├── frontend/                       # Ứng dụng Giao diện (Next.js 14 App Router)
│   ├── src/
│   │   ├── app/                    # 23 Màn hình phân luồng theo 4 vai trò (RBAC)
│   │   │   ├── (auth)/             # SCR-AUTH-01: Đăng nhập
│   │   │   ├── change-password/    # SCR-AUTH-02: Đổi mật khẩu
│   │   │   ├── admin/              # SCR-ADM-01..07 (Dashboard, Lớp, Học phí, Báo cáo)
│   │   │   ├── teacher/            # SCR-TEA-01..05 (Lịch dạy, Điểm danh, Nhập điểm, AI)
│   │   │   ├── student/            # SCR-STU-01..08 (Lịch học, Bảng điểm, 3 Công cụ AI)
│   │   │   └── staff/              # SCR-STA-01..03 (Tiếp nhận HV, Thu phí tại quầy)
│   │   ├── components/             # AppLayout, Sidebar, Header phân quyền
│   │   ├── services/               # Axios API Client với JWT Interceptor
│   │   └── types/                  # TypeScript Data Models & DTO Interfaces
│   ├── package.json
│   └── tailwind.config.ts
├── docs/                           # Tài liệu thiết kế hệ thống & Đồ án
└── docker-compose.yml              # Cấu hình container hóa dự phòng
```

---

## 8.2 Cấu Hình Môi Trường & Quản Trị Bí Mật (Environment & Secrets)

### 8.2.1 Cấu hình Biến Môi Trường Backend (`backend/.env`)
Toàn bộ thông tin cấu hình nhạy cảm được quản lý qua biến môi trường độc lập, tuyệt đối không hardcode vào mã nguồn:

```env
# Cổng dịch vụ Backend
PORT=8000

# Chuỗi kết nối Neon Serverless PostgreSQL (Pooler Mode hỗ trợ SSL)
DATABASE_URL="postgresql://neondb_owner:npg_3lFnjQKIo5rM@ep-dark-resonance-axjf1mzr-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

# Khóa bí mật ký phát mã JWT (Stateless Token)
JWT_SECRET="etc_english_center_jwt_secret_key_2026_super_secure"
JWT_EXPIRES_IN="24h"

# Khóa API Google Gemini AI (Tích hợp AI)
GEMINI_API_KEY="AIzaSy...your_gemini_api_key_here..."

# Cấu hình CORS cho phép Frontend truy cập
FRONTEND_URL="http://localhost:3000"
```

---

### 8.2.2 Cấu hình Chuỗi Kết Nối Cơ Sở Dữ Liệu Neon Cloud
Hệ thống sử dụng đường dẫn kết nối dạng **Connection Pooler (PgBouncer)** của Neon.tech để tối ưu số lượng kết nối đồng thời từ NestJS:
- **Giao thức:** `postgresql://`
- **Chế độ bảo mật:** `sslmode=require` bắt buộc mã hóa đường truyền TLS giữa ứng dụng và máy chủ CSDL.
- **Tính khả dụng:** Database hoạt động độc lập trên hạ tầng AWS đám mây 24/7.

---

## 8.3 Quy Trình Cài Đặt Và Khởi Tạo Cơ Sở Dữ Liệu

### Bước 1: Cài Đặt Thư Viện Phụ Thuộc (Dependencies)
Thực hiện cài đặt các package cho cả Backend và Frontend:

```bash
# 1. Cài đặt thư viện Backend
cd D:\MyProjects\lms-ai\backend
npm install

# 2. Cài đặt thư viện Frontend
cd D:\MyProjects\lms-ai\frontend
npm install
```

---

### Bước 2: Đồng Bộ CSDL và Sinh Prisma Client
Sử dụng công cụ Prisma CLI để tự động kiến tạo 14 bảng quan hệ 3NF lên cơ sở dữ liệu Neon Cloud:

```bash
cd D:\MyProjects\lms-ai\backend

# Đẩy schema lên cơ sở dữ liệu đám mây
npx prisma db push

# Sinh mã nguồn TypeScript Client định kiểu an toàn
npx prisma generate
```

---

### Bước 3: Nạp Dữ Liệu Mẫu Ban Đầu (Database Seeding)
Chạy script `seed.ts` để nạp sẵn dữ liệu tài khoản, khóa học, lớp học và thời khóa biểu ban đầu:

```bash
cd D:\MyProjects\lms-ai\backend
npm run db:seed
```

*Bảng 8.3: Danh mục tài khoản người dùng mẫu sau khi nạp Seeding*
| Tên đăng nhập | Mật khẩu mặc định | Vai trò (RBAC) | Họ và Tên | Mô tả nghiệp vụ |
|:---|:---|:---|:---|:---|
| `admin01` | `Admin@123` | `QUAN_LY` | Nguyễn Quản Lý | Toàn quyền quản trị trung tâm, tài chính, phân công |
| `teacher01` | `Admin@123` | `GIAO_VIEN` | Nguyễn Thị Lan | Giảng viên IELTS, TOEIC (Phụ trách lớp LOP01) |
| `teacher02` | `Admin@123` | `GIAO_VIEN` | Trần Văn Minh | Giảng viên Giao tiếp (Phụ trách lớp LOP02) |
| `staff01` | `Admin@123` | `TU_VAN_VIEN` | Lê Thị Tư Vấn | Tư vấn viên tiếp nhận học viên & thu phí tại quầy |
| `student01` | `Admin@123` | `HOC_VIEN` | Phạm Văn An | Học viên trình độ CEFR B1 (Lớp LOP01) |
| `student02` | `Admin@123` | `HOC_VIEN` | Hoàng Thị Bình | Học viên trình độ CEFR A2 (Lớp LOP02) |

*(Toàn bộ mật khẩu mẫu đã được băm tự động bằng thuật toán bảo mật cao cấp **Argon2**).*

---

## 8.4 Quy Trình Khởi Chạy Hệ Thống Trên Môi Trường Cục Bộ (Localhost)

### 8.4.1 Khởi Chạy Máy Chủ Backend NestJS
Mở Terminal 1 và thực thi lệnh:
```bash
cd D:\MyProjects\lms-ai\backend
npm run start:dev
```
- **Máy chủ Backend lắng nghe tại:** `http://localhost:8000`
- **Tài liệu Swagger API tương tác trực tiếp:** `http://localhost:8000/api/docs`

---

### 8.4.2 Khởi Chạy Ứng Dụng Giao Diện Frontend Next.js
Mở Terminal 2 và thực thi lệnh:
```bash
cd D:\MyProjects\lms-ai\frontend
npm run dev
```
- **Giao diện Người dùng Web truy cập tại:** `http://localhost:3000/login`

---

### 8.4.3 Quản Lý Dữ Liệu Trực Quan Qua Prisma Studio
Để xem và chỉnh sửa trực tiếp 14 bảng CSDL trên trình duyệt:
```bash
cd D:\MyProjects\lms-ai\backend
npx prisma studio
```
- **Địa chỉ truy cập Prisma Studio GUI:** `http://localhost:5555`

---

## 8.5 Phương Án Triển Khai Lên Môi Trường Đám Mây (Cloud Deployment)

### 8.5.1 Kiến Trúc Triển Khai Tổng Thể
Hệ thống được thiết kế theo mô hình **Cloud-Native Decoupled Architecture**:

```text
┌─────────────────────────────────────────────────────────────┐
│                       NGƯỜI DÙNG                            │
│           (Web Browser trên Desktop / Mobile)              │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTPS (Port 443)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 FRONTEND HOSTING (Vercel)                   │
│          Next.js 14 App Router (Node.js Serverless)         │
│                 Domain: https://etc-english.edu.vn          │
└──────────────────────────────┬──────────────────────────────┘
                               │ RESTful API / JWT Bearer
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 BACKEND HOSTING (Render / Railway)          │
│                 NestJS API Server (Port 8000)               │
│                 Domain: https://api.etc-english.edu.vn      │
└───────────────┬─────────────────────────────┬───────────────┘
                │ SSL / TLS (5432)            │ HTTPS (REST)
                ▼                             ▼
┌───────────────────────────────┐ ┌───────────────────────────┐
│   DATABASE TIER (Neon Cloud)  │ │      GENAI PROVIDER       │
│  PostgreSQL 15 Serverless DB  │ │     Google Gemini SDK     │
│       (Auto-scaling / 3NF)    │ │   (Gemini 2.5 Flash/Pro)  │
└───────────────────────────────┘ └───────────────────────────┘
```

---

### 8.5.2 Chính Sách Bảo Mật Mạng & Vận Hành Khi Triển Khai Thực Tế
1. **Mã Hóa Toàn Diện (End-to-End Encryption):** Mọi luồng giao tiếp giữa Client $\rightarrow$ Frontend $\rightarrow$ Backend $\rightarrow$ Database $\rightarrow$ Gemini API đều bắt buộc thông qua giao thức bảo mật **HTTPS** và **TLS/SSL**.
2. **Cấu Hình CORS Chặt Chẽ:** Backend chỉ cho phép Domain chính thức của Frontend gửi yêu cầu, ngăn chặn các tấn công Cross-Origin Request Forgery.
3. **Cơ Chế Bảo Vệ API Rate Limiting:** Thiết lập giới hạn số lượt request tối đa (Throttle) trên các Endpoint quan trọng như Đăng nhập (`/auth/login`) và Gọi GenAI (`/ai/*`) nhằm chống tấn công DDoS và tiết kiệm chi phí Token AI.
4. **Giám Sát & Nhật Ký Kiểm Toán (Audit Logging):** Mọi truy vấn AI đều được lưu vào bảng `yeu_cau_ai` trong CSDL để phục vụ kiểm toán độ chính xác và phát hiện các trường hợp Fallback tự động.
