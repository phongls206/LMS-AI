# CHƯƠNG 8: CÀI ĐẶT VÀ TRIỂN KHAI HỆ THỐNG

---

## 8.1 Môi Trường Và Yêu Cầu Kỹ Thuật

### 8.1.1 Yêu cầu Cấu hình Phần cứng
Hệ thống Quản lý trung tâm ngoại ngữ tích hợp AI (ETC English) được xây dựng theo kiến trúc phân tán (Multi-tier Cloud-ready Architecture), cho phép tối ưu hóa tài nguyên phần cứng máy chủ và máy khách, giảm thiểu chi phí đầu tư hạ tầng ban đầu:

*Bảng 8.1: Yêu cầu cấu hình phần cứng tối thiểu và khuyến nghị*
| Thành phần | Cấu hình tối thiểu | Cấu hình khuyến nghị |
|:---|:---|:---|
| **Máy chủ Phát triển (Dev Server)** | CPU 2 Cores, RAM 4GB, Ổ cứng trống 5GB | CPU 4 Cores, RAM 8GB–16GB, Ổ cứng SSD 20GB |
| **Máy khách Người dùng (Client)** | Thiết bị có trình duyệt web (PC, Laptop, Smartphone) | PC/Laptop màn hình Full HD, kết nối Internet ổn định |
| **Băng thông Mạng** | Tối thiểu 5 Mbps (truy vấn và gọi GenAI API) | Khuyến nghị 20 Mbps trở lên để tải trang mượt mà |

---

### 8.1.2 Yêu cầu Môi trường Phần mềm & Công nghệ
Hệ thống được phát triển hoàn toàn trên nền tảng TypeScript xuyên suốt từ Frontend đến Backend:

*Bảng 8.2: Danh mục công nghệ và phiên bản phần mềm cốt lõi*
| Thành phần | Công nghệ / Framework | Phiên bản | Mục đích sử dụng |
|:---|:---|:---|:---|
| **Runtime Môi trường** | Node.js (LTS) | `v20.x` / `v22.x` | Môi trường thực thi JavaScript/TypeScript phía máy chủ |
| **Quản lý Gói** | npm | `10.x+` | Quản lý và cài đặt các thư viện phụ thuộc |
| **Backend Framework** | NestJS | `v11.x` / `v12.x` | Xây dựng RESTful API kiến trúc phân tầng Modular |
| **ORM / Data Access Layer** | Prisma ORM | `v6.4.1` (Stable) | Quản lý Schema, Migration và Type-safe Database Client |
| **Frontend Framework** | Next.js (App Router) | `v14.x` / `v16.x` | Xây dựng giao diện SSR/CSR với TypeScript |
| **CSS & Giao diện** | TailwindCSS + Lucide Icons | `v3.4.x` / `v4.x` | Thiết kế giao diện hiện đại, Responsive đa thiết bị |
| **Cơ sở Dữ liệu** | PostgreSQL (Neon.tech) | `v15+ / v16+` | CSDL quan hệ Serverless Cloud Database |
| **Trí tuệ Nhân tạo** | Google Gemini SDK | `@google/genai` | Tích hợp mô hình ngôn ngữ lớn (Gemini 2.5 Flash/Pro) |
| **Bảo mật & Mã hóa** | Argon2 + JWT | `argon2`, `@nestjs/jwt` | Băm mật khẩu an toàn và xác thực phân quyền Stateless |

---

### 8.1.3 Cấu trúc Thư mục Mã Nguồn Chuẩn
Dự án được tổ chức theo mô hình Monorepo rõ ràng giữa Backend và Frontend:

```text
D:\MyProjects\lms-ai\
├── backend/                        # Máy chủ Backend (NestJS 12)
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
│   └── .env                        # File cấu hình biến môi trường Backend
├── frontend/                       # Ứng dụng Giao diện (Next.js 14 App Router)
│   ├── src/
│   │   ├── app/                    # 23 Màn hình phân luồng theo 4 vai trò (RBAC)
│   │   ├── components/             # AppLayout, Sidebar, Header phân quyền
│   │   ├── services/               # Axios API Client với JWT Interceptor
│   │   └── types/                  # TypeScript Data Models & DTO Interfaces
└── docs/                           # Tài liệu thiết kế hệ thống & Đồ án
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
Hệ thống sử dụng đường dẫn kết nối dạng **Connection Pooler (PgBouncer)** của Neon.tech để tối ưu số lượng kết nối đồng thời từ NestJS, đồng thời bật chế độ mã hóa đường truyền bắt buộc (`sslmode=require`).

---

## 8.3 Quy Trình Cài Đặt Và Khởi Tạo Cơ Sở Dữ Liệu

Quy trình thiết lập hệ thống từ mã nguồn được thực hiện theo 3 bước tuần tự:
- **Bước 1: Cài đặt thư viện phụ thuộc (Dependencies):** Chạy `npm install` tại thư mục `backend` và `frontend`.
- **Bước 2: Đồng bộ CSDL và Sinh Prisma Client:** Chạy `npx prisma db push` và `npx prisma generate` để tạo 14 bảng quan hệ 3NF trên Neon PostgreSQL.
- **Bước 3: Nạp Dữ liệu Mẫu Ban Đầu (Database Seeding):** Chạy `npm run db:seed` để nạp 4 vai trò người dùng, 2 khóa học, 2 lớp học và lịch học.

*Bảng 8.3: Danh mục tài khoản người dùng mẫu sau khi nạp Seeding*
| Tên đăng nhập | Mật khẩu | Vai trò (RBAC) | Họ và Tên | Mô tả nghiệp vụ |
|:---|:---|:---|:---|:---|
| `admin01` | `Admin@123` | `QUAN_LY` | Nguyễn Quản Lý | Toàn quyền quản trị trung tâm, tài chính, phân công |
| `teacher01` | `Admin@123` | `GIAO_VIEN` | Nguyễn Thị Lan | Giảng viên IELTS, TOEIC (Phụ trách lớp LOP01) |
| `teacher02` | `Admin@123` | `GIAO_VIEN` | Trần Văn Minh | Giảng viên Giao tiếp (Phụ trách lớp LOP02) |
| `staff01` | `Admin@123` | `TU_VAN_VIEN` | Lê Thị Tư Vấn | Tư vấn viên tiếp nhận học viên & thu phí tại quầy |
| `student01` | `Admin@123` | `HOC_VIEN` | Phạm Văn An | Học viên trình độ CEFR B1 (Lớp LOP01) |
| `student02` | `Admin@123` | `HOC_VIEN` | Hoàng Thị Bình | Học viên trình độ CEFR A2 (Lớp LOP02) |

---

## 8.4 Quy Trình Khởi Chạy Hệ Thống Trên Môi Trường Cục Bộ

1. **Khởi chạy Máy chủ Backend NestJS:** `cd backend && npm run start:dev` (Backend chạy tại port 8000, Swagger UI tại `http://localhost:8000/api/docs`).
2. **Khởi chạy Ứng dụng Giao diện Frontend Next.js:** `cd frontend && npm run dev` (Giao diện chạy tại `http://localhost:3000/login`).
3. **Quản lý Dữ liệu Trực quan Qua Prisma Studio:** `cd backend && npx prisma studio` (Giao diện GUI quản lý 14 bảng CSDL tại `http://localhost:5555`).

---

## 8.5 Phương Án Triển Khai Lên Môi Trường Đám Mây (Cloud Deployment)

Hệ thống được thiết kế sẵn sàng cho việc triển khai phân tán không máy chủ (Serverless Cloud Architecture):
- **Frontend Tier:** Triển khai trên nền tảng Vercel (Edge Network / Serverless Functions) với tên miền chính.
- **Backend Tier:** Triển khai trên Render hoặc Railway với môi trường Docker Node.js Container.
- **Database Tier:** Lưu trữ trực tiếp trên Neon Serverless PostgreSQL với tính năng tự động sao lưu và mở rộng quy mô (Auto-scaling).
- **Chính sách Bảo mật:** Bật tường lửa CORS giới hạn Domain truy cập, áp dụng HTTPS toàn bộ luồng dữ liệu và kích hoạt Rate Limiting ngăn chặn tấn công DDoS.

---
---

# CHƯƠNG 9: KIỂM THỬ HỆ THỐNG VÀ HƯỚNG DẪN SỬ DỤNG

---

## PHẦN 1: KIỂM THỬ CHỨC NĂNG ỨNG DỤNG (FUNCTIONAL TESTING)

*Thời gian thực hiện kiểm thử: Từ 27/07/2026 đến 27/09/2026 (Theo kế hoạch phát triển 9 tuần của dự án).*

---

### 1. Những Yêu Cầu Về Tài Nguyên Cho Kiểm Thử Ứng Dụng

#### a) Tài nguyên Phần cứng:
Môi trường kiểm thử chức năng được thực hiện trên cấu hình máy tính cá nhân kết nối mạng Internet:

*Bảng 9.1: Cấu hình phần cứng phục vụ kiểm thử ứng dụng*
| CPU | RAM | Ổ cứng (SSD) | Kiến trúc hệ thống (Architecture) |
|:---|:---|:---|:---|
| Intel Core i5 / AMD Ryzen 5, 2.5 GHz trở lên | 8 GB / 16 GB | 50 GB dung lượng trống | x64 (64-bit Operating System) |

#### b) Tài nguyên Phần mềm:
*Bảng 9.2: Danh mục phần mềm và công cụ kiểm thử*
| Tên phần mềm / Công cụ | Phiên bản | Loại công cụ / Mục đích sử dụng |
|:---|:---|:---|
| Visual Studio Code / Antigravity IDE | 1.95+ | Công cụ phát triển mã nguồn & Debug |
| Swagger UI & Postman Client | OpenAPI 3.0 / v11+ | Công cụ kiểm thử RESTful API & Endpoint Authorization |
| Trình duyệt Web (Google Chrome / Edge) | v125+ | Kiểm thử giao diện người dùng (Frontend UI Testing) |
| Neon Console & Prisma Studio | v6.4.1 | Kiểm tra tính toàn vẹn dữ liệu quan hệ (Database Integrity) |
| Hệ điều hành Windows 11 | Build 23H2 (64-bit) | Môi trường thực thi kiểm thử cục bộ |

---

### 2. Danh Sách Các Tình Huống Kiểm Thử Ứng Dụng (Test Cases)

Toàn bộ 14 Use Case nghiệp vụ và tính năng tích hợp AI được thiết kế các kịch bản kiểm thử bao gồm cả trường hợp hợp lệ, trường hợp ngoại lệ và điều kiện biên:

*Bảng 9.3: Danh mục các ca kiểm thử chức năng hệ thống (Test Cases)*
| Test ID | Chức năng | Mô tả ca kiểm thử | Điều kiện trước | Dữ liệu Test | Kết quả mong muốn | Ghi chú |
|:---|:---|:---|:---|:---|:---|:---|
| **TC001** | Đăng nhập (UC001) | Xác thực danh tính và phân quyền theo JWT | Tài khoản đã tồn tại trong CSDL | `admin01` / `Admin@123` | Đăng nhập thành công, cấp JWT Token, chuyển hướng đúng Dashboard Quản trị | Bảo mật Argon2 |
| **TC002** | Hồ sơ Học viên (UC002) | Tạo mới tài khoản và gán trình độ CEFR | Đăng nhập quyền Quản lý/TVV | Học viên: `HV003`, CEFR: `B1` | Hồ sơ được tạo trong CSDL qua ACID Transaction, mã hóa mật khẩu | ACID Transaction |
| **TC003** | Khóa học (UC003) | Tạo mới chương trình đào tạo | Đăng nhập quyền Quản lý | Khóa: `KH03`, Học phí: 4.5M, Tiết: 45 | Khóa học được lưu, mã khóa không trùng lặp, học phí >= 0 | Dữ liệu hợp lệ |
| **TC004** | Lớp & Lịch (UC004) | Xếp lịch học và kiểm tra chống trùng phòng | Lớp học đã được tạo | Phòng `P.101`, Thứ 2 (18h-21h) | Hệ thống chặn nếu phòng P.101 đã có lớp khác học cùng giờ | Chống trùng phòng |
| **TC005** | Phân công GV (UC005) | Gán giảng viên phụ trách lớp học | Giáo viên và lớp đã tồn tại | Gán `GV001` cho lớp `LOP01` | Hệ thống chặn nếu GV001 đã có lịch dạy lớp khác cùng ca/thứ | Chống trùng giờ dạy |
| **TC006** | Đăng ký lớp (UC006) | Kiểm tra 4 điều kiện: Sĩ số, Chưa ĐK, CEFR, Lịch | Học viên đã được cấp mã | Học viên B1 đăng ký lớp LOP01 (CEFR B1) | Đăng ký thành công, sĩ số tăng +1, tự động sinh Hóa đơn học phí | Kiểm tra 4 điều kiện |
| **TC007** | Thu học phí (UC007) | Ghi nhận thanh toán nhiều đợt | Hóa đơn học phí ở trạng thái nợ | Đợt 1 nộp 2.000.000đ | Cộng dồn số tiền đã trả, khi đủ tiền tự chuyển sang DA_HOAN_THANH | Thanh toán từng phần |
| **TC008** | Điểm danh (UC008) | Ghi nhận 4 trạng thái chuyên cần buổi học | Đến giờ học buổi số 1 | `CO_MAT`, `VANG`, `DI_MUON`, `CO_PHEP` | Lưu trữ chính xác 4 trạng thái cho từng học viên, tính tỷ lệ % tham gia | 4 trạng thái chuẩn |
| **TC009** | Nhập điểm (UC009) | Tính điểm tổng kết 20/30/50 và xét ĐẠT | Lớp học hoàn thành kỳ thi | `CC=90`, `GK=80`, `CK=85` | Điểm TK = `90*0.2 + 80*0.3 + 85*0.5 = 84.5`. Xếp loại ĐẠT | Công thức 20/30/50 |
| **TC010** | Tra cứu TKB (UC010) | Học viên xem lịch học và kết quả cá nhân | Đăng nhập tài khoản `student01` | Truy cập `/student/schedule` | Hiển thị đúng danh sách lớp, phòng học, giáo viên phụ trách của cá nhân | Bảo mật RBAC |
| **TC011** | Báo cáo Thống kê (UC011) | Thống kê doanh thu, sĩ số và tỷ lệ hoàn thành | Đăng nhập quyền Quản lý | Truy cập `/admin/reports` | Hiển thị chính xác tổng doanh thu, biểu đồ sĩ số và % học viên ĐẠT | Thống kê thời gian thực |
| **TC012** | AI Tư vấn lớp (UC012) | Gợi ý tối đa 3 lớp học thực tế theo CEFR & lịch rảnh | Đăng nhập quyền Học viên/TVV | CEFR: `B1`, Lịch rảnh: Thứ 2-4-6 | AI gợi ý đúng lớp có thật còn chỗ, có Fallback tự động khi lỗi mạng | Lọc ảo giác Zero-Trust |
| **TC013** | AI Sinh bài tập (UC013) | Sinh tức thì 5 câu trắc nghiệm chuẩn CEFR | Đăng nhập quyền Giáo viên/HV | Chủ đề: `Present Perfect`, CEFR: `B1` | Trả về 5 câu hỏi JSON có 4 lựa chọn, đáp án đúng và giải thích chi tiết | Template Fallback |
| **TC014** | AI Tóm tắt tiến độ (UC014) | Phân tích chuyên cần & điểm thi, đưa lời khuyên | Đăng nhập quyền Học viên | Chọn lớp học đang theo học | AI tóm tắt điểm mạnh, điểm yếu và gợi ý chủ đề cần ôn tập bổ trợ | Audit Logging |

---

### 3. Báo Cáo Kết Quả Kiểm Thử (Test Report)

Toàn bộ các ca kiểm thử đã được chạy nghiệm thu trên môi trường thực tế kết nối Neon Cloud và Google Gemini AI API:

*Bảng 9.4: Báo cáo kết quả kiểm thử hệ thống (Test Report)*
| Test ID | Ngày testing | Người tham gia Test | Pass/Fail | Độ nghiêm trọng | Tóm tắt kết quả kiểm tra | Ghi chú |
|:---|:---|:---|:---|:---|:---|:---|
| **TC001** | 02/09/2026 | Tester & Developer | **PASS** | High | Đăng nhập chính xác cả 4 vai trò, phân quyền bảo mật | Không có lỗi |
| **TC002** | 02/09/2026 | Tester & Developer | **PASS** | High | Tạo học viên thành công, mã hóa mật khẩu bằng Argon2 | Không có lỗi |
| **TC003** | 02/09/2026 | Tester & Developer | **PASS** | Medium | Kiểm tra validation hợp lệ, chặn mã khóa học trùng | Không có lỗi |
| **TC004** | 02/09/2026 | Tester & Developer | **PASS** | High | Chặn thành công việc xếp trùng phòng học cùng ca | Không có lỗi |
| **TC005** | 02/09/2026 | Tester & Developer | **PASS** | High | Chặn phân công trùng lịch dạy của giáo viên | Không có lỗi |
| **TC006** | 02/09/2026 | Tester & Developer | **PASS** | High | Đủ 4 điều kiện ghi danh, tự động tạo hóa đơn học phí | Không có lỗi |
| **TC007** | 02/09/2026 | Tester & Developer | **PASS** | High | Hỗ trợ thu tiền nhiều đợt, tính chính xác số dư công nợ | Không có lỗi |
| **TC008** | 02/09/2026 | Tester & Developer | **PASS** | Medium | Lưu trữ 4 trạng thái chuyên cần chính xác | Không có lỗi |
| **TC009** | 02/09/2026 | Tester & Developer | **PASS** | High | Tính đúng công thức 20/30/50, xét ĐẠT khi TK>=50 và CC>=80 | Không có lỗi |
| **TC010** | 02/09/2026 | Tester & Developer | **PASS** | Medium | Tra cứu nhanh chóng, chỉ xem được dữ liệu cá nhân | Không có lỗi |
| **TC011** | 02/09/2026 | Tester & Developer | **PASS** | Medium | Dashboard thống kê dữ liệu chính xác theo thời gian thực | Không có lỗi |
| **TC012** | 02/09/2026 | Tester & Developer | **PASS** | High | Loại bỏ hoàn toàn lớp ảo giác, tự động Fallback khi mất mạng | Zero-Trust đạt chuẩn |
| **TC013** | 02/09/2026 | Tester & Developer | **PASS** | Medium | Sinh chuẩn 5 câu hỏi JSON kèm đáp án và giải thích chi tiết | Đúng định dạng |
| **TC014** | 02/09/2026 | Tester & Developer | **PASS** | Medium | Đưa ra lời khuyên ôn tập cá nhân hóa sâu sắc | Audit log đầy đủ |

> **Kết luận nghiệm thu:** 14/14 Ca kiểm thử đạt trạng thái **PASS (Tỷ lệ thành công 100%)**. Hệ thống đáp ứng đầy đủ tất cả các quy tắc nghiệp vụ và sẵn sàng đưa vào vận hành.

---
---

## PHẦN 2: HƯỚNG DẪN SỬ DỤNG ỨNG DỤNG (USER GUIDE)

---

### 1. Giới Thiệu Ứng Dụng
Hệ thống Quản lý Trung tâm Ngoại ngữ tích hợp Trí tuệ Nhân tạo (ETC English LMS AI) là nền tảng quản lý đào tạo toàn diện, hỗ trợ 4 nhóm đối tượng người dùng (Quản lý, Giáo viên, Học viên, Tư vấn viên) thực hiện toàn bộ quy trình từ tuyển sinh, xếp lịch, thu phí, giảng dạy, điểm danh, chấm điểm đến trợ giảng thông minh với GenAI.

---

### 2. Cấu Hình Phần Cứng - Phần Mềm Để Sử Dụng
- **Phần cứng:** Máy tính để bàn, Laptop, Máy tính bảng hoặc Smartphone có kết nối mạng Internet ổn định (băng thông tối thiểu 2 Mbps).
- **Phần mềm:** Trình duyệt web hiện đại (Google Chrome, Microsoft Edge, Mozilla Firefox, Safari) phiên bản mới nhất, không cần cài đặt thêm phần mềm phụ trợ.

---

### 3. Hướng Dẫn Sử Dụng Các Chức Năng Chính Theo Tác Nhân (Actors)

#### 3.1 Chức Năng Của Người Quản Lý (Admin - QUAN_LY)
- **Bước 1 — Đăng nhập Quản trị:** Truy cập trang đăng nhập (`/login`), chọn tài khoản `admin01` (Mật khẩu: `Admin@123`). Hệ thống tự động chuyển hướng đến Dashboard Quản trị (`/admin/dashboard`).
- **Bước 2 — Xem Thống kê Trung tâm:** Dashboard hiển thị tổng số học viên, giáo viên, doanh thu, thanh tiến độ sĩ số các lớp và tỷ lệ học viên hoàn thành khóa.
- **Bước 3 — Quản lý Khóa học & Mở Lớp học:** Vào mục *Khóa học* để tạo khóa học mới; vào mục *Lớp học* để mở lớp, bấm nút *Thêm Lịch Học* (hệ thống tự động kiểm tra chống trùng phòng học) và *Phân Công GV* (kiểm tra chống trùng lịch dạy của giảng viên).
- **Bước 4 — Quản lý Học viên & Thu Học phí:** Vào mục *Học viên* để tìm kiếm, lọc theo trình độ CEFR; vào mục *Học phí* để theo dõi danh sách hóa đơn và lập phiếu thu thanh toán nhiều đợt.
- **Bước 5 — Báo cáo Thống kê Chuyên sâu:** Vào mục *Báo cáo* (`/admin/reports`) để xem biểu đồ phân tích chi tiết hiệu quả đào tạo và xuất báo cáo.

---

#### 3.2 Chức Năng Của Giáo Viên (Teacher - GIAO_VIEN)
- **Bước 1 — Đăng nhập Giảng viên:** Chọn tài khoản `teacher01` (Nguyễn Thị Lan) tại màn hình đăng nhập. Hệ thống chuyển hướng đến Bàn làm việc Giảng viên (`/teacher/dashboard`).
- **Bước 2 — Xem Lịch Dạy & Lớp Phụ Trách:** Giảng viên theo dõi danh sách các lớp được phân công, thời khóa biểu từng thứ trong tuần và phòng học tương ứng.
- **Bước 3 — Điểm Danh Buổi Học:** Truy cập mục *Điểm danh* (`/teacher/attendance`), chọn lớp học. Hệ thống hiển thị danh sách học viên; giảng viên chọn 1 trong 4 trạng thái (`Có Mặt`, `Đi Muộn`, `Có Phép`, `Vắng`) và bấm *Lưu Điểm Danh*.
- **Bước 4 — Nhập Điểm & Đánh Giá Kết Quả:** Truy cập mục *Bảng điểm* (`/teacher/grades`), nhập điểm Chuyên cần (20%), Giữa kỳ (30%), Cuối kỳ (50%). Hệ thống tự động tính điểm tổng kết và xếp loại `ĐẠT` / `KHÔNG ĐẠT`.
- **Bước 5 — Trợ Lý AI Sinh Bài Luyện Tập:** Truy cập mục *AI Sinh đề* (`/teacher/ai-exercises`), nhập chủ đề ngữ pháp/từ vựng và chọn độ khó CEFR. Bấm *Sinh Đề AI* để Gemini tạo tức thì 5 câu trắc nghiệm kèm đáp án và giải thích chi tiết.

---

#### 3.3 Chức Năng Của Học Viên (Student - HOC_VIEN)
- **Bước 1 — Đăng nhập Góc Học Tập:** Chọn tài khoản `student01` (Phạm Văn An - CEFR B1). Hệ thống hiển thị thông tin hồ sơ và các lớp đang theo học (`/student/dashboard`).
- **Bước 2 — AI Tư Vấn Lộ Trình & Lớp Học:** Vào mục *AI Tư vấn* (`/student/ai-consult`), chọn trình độ CEFR và các buổi rảnh trong tuần. Hệ thống Gemini AI phân tích và gợi ý top 3 lớp học thực tế phù hợp nhất.
- **Bước 3 — Đăng Ký Lớp Học Mới:** Vào mục *Đăng ký lớp* (`/student/enroll`), chọn lớp mong muốn. Hệ thống tự động kiểm tra 4 điều kiện (Sĩ số < 25, chưa đăng ký, chuẩn CEFR, không trùng lịch) và tự động sinh hóa đơn học phí.
- **Bước 4 — Tra Cứu Thời Khóa Biểu & Bảng Điểm:** Vào mục *Thời khóa biểu* (`/student/schedule`) để xem lịch học; vào mục *Bảng điểm* (`/student/grades`) để theo dõi điểm 3 thành phần và trạng thái ĐẠT khóa học.
- **Bước 5 — AI Luyện Tập & Tóm Tắt Tiến Độ:** Vào *AI Luyện tập* (`/student/ai-practice`) để làm bài trắc nghiệm tương tác có chấm điểm trực tiếp; vào *AI Tóm tắt* (`/student/ai-progress`) để nhận bản đánh giá điểm mạnh/yếu và lời khuyên ôn tập cá nhân hóa.

---

#### 3.4 Chức Năng Của Tư Vấn Viên (Staff/Counselor - TU_VAN_VIEN)
- **Bước 1 — Đăng nhập Tuyển sinh:** Chọn tài khoản `staff01` (Lê Thị Tư Vấn). Hệ thống chuyển hướng đến Bàn làm việc Tuyển sinh (`/staff/dashboard`).
- **Bước 2 — Tiếp Nhận Học Viên Mới:** Vào mục *Tiếp nhận học viên* (`/staff/new-student`), nhập họ tên, thông tin liên hệ và kết quả đánh giá trình độ CEFR đầu vào để khởi tạo hồ sơ học viên trong hệ thống.
- **Bước 3 — Tư Vấn & Ghi Danh Lớp Học:** Sử dụng công cụ AI Tư vấn để tìm lớp phù hợp theo lịch rảnh của học viên, sau đó vào mục *Ghi danh & Thu phí* (`/staff/collect-fee`) để đăng ký lớp.
- **Bước 4 — Lập Phiếu Thu Học Phí:** Nhập số tiền thu (tiền mặt hoặc chuyển khoản) để cập nhật công nợ và xuất hóa đơn xác nhận cho học viên.
