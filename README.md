# 🌟 ETC ENGLISH CENTER — HỆ THỐNG QUẢN LÝ TRUNG TÂM NGOẠI NGỮ TÍCH HỢP AI (LMS + GENAI)

> **Hệ thống Quản lý Đào tạo & Vận hành Trung tâm Ngoại ngữ ETC** — Tích hợp Trí tuệ Nhân tạo thế hệ mới (Gemini GenAI), hỗ trợ toàn diện 4 nhóm đối tượng: **Quản Trị Viên (Admin)**, **Nhân Viên Tư Vấn (Staff)**, **Giáo Viên (Teacher)** và **Học Viên (Student)**.

🌐 **Live Demo:** [etcedu.vercel.app](https://etcedu.vercel.app/)  
📚 **Swagger API Docs:** `http://localhost:8000/api/docs` (sau khi khởi chạy backend)

---

## 📌 MỤC LỤC
1. [Giới Thiệu Tổng Quan](#-1-giới-thiệu-tổng-quan)
2. [Công Nghệ Sử Dụng (Tech Stack)](#-2-công-nghệ-sử-dụng-tech-stack)
3. [Cấu Trúc Thư Mục Dự Án](#-3-cấu-trúc-thư-mục-dự-án)
4. [Hướng Dẫn Cài Đặt & Chạy Hệ Thống](#-4-hướng-dẫn-cài-đặt--chạy-hệ-thống)
5. [Danh Sách Tài Khoản Mẫu (Demo Credentials)](#-5-danh-sách-tài-khoản-mẫu-demo-credentials)
6. [Các Phân Hệ Chức Năng Chính](#-6-các-phân-hệ-chức-năng-chính)
7. [Tài Liệu API Swagger](#-7-tài-liệu-api-swagger)

---

## 📖 1. Giới Thiệu Tổng Quan

Hệ thống **ETC English Center** được thiết kế và xây dựng chuẩn hóa theo mô hình kiến trúc phân tầng (Multi-tier Architecture), tuân thủ nguyên tắc toàn vẹn dữ liệu **ACID Transactions**, phân quyền truy cập nghiêm ngặt dựa trên vai trò (**RBAC - Role-Based Access Control**), và cơ chế phòng vệ 3 lớp (**3-Tier Defense**) khi tích hợp các mô hình ngôn ngữ lớn (LLM/GenAI).

### 🎯 Điểm nổi bật:
* **Quản lý Đào tạo & Vận hành:** Khóa học, Lớp học, Xếp thời khóa biểu chống trùng lịch, Tiếp nhận học viên, Phân công giảng viên.
* **Tài chính & Học phí:** Tự động sinh hóa đơn khi đăng ký lớp, theo dõi công nợ, quản lý phiếu thu nhiều đợt.
* **Điểm danh & Kết quả:** Điểm danh 4 trạng thái, Ma trận chuyên cần toàn khóa (Attendance Matrix), Nhập điểm & Tính điểm tự động theo tỷ lệ: `20% Chuyên cần + 30% Giữa kỳ + 50% Cuối kỳ`.
* **Trí tuệ Nhân tạo (GenAI Features):**
  * 🤖 **AI Tư Vấn Lớp Học:** Phân tích hồ sơ, mục tiêu và lịch rảnh học viên để đề xuất lớp học tối ưu.
  * 📝 **AI Sinh Bài Tập Trắc Nghiệm:** Tự động sinh đề luyện tập 4 kỹ năng chuẩn CEFR (A1..C2) kèm đáp án và giải thích chi tiết.
  * 📊 **AI Tóm Tắt Báo Cáo Tiến Độ:** Phân tích chuyên cần, điểm số và đưa ra lộ trình cải thiện cá nhân hóa.

---

## 🛠️ 2. Công Nghệ Sử Dụng (Tech Stack)

### Backend (RESTful API Server)
* **Framework:** [NestJS](https://nestjs.com/) (Node.js & TypeScript)
* **ORM & Database:** [Prisma ORM](https://www.prisma.io/) + PostgreSQL ([Neon Cloud Serverless](https://neon.tech/))
* **Bảo mật & Xác thực:** Argon2 Password Hashing, Passport JWT, Role Guards
* **API Documentation:** Swagger / OpenAPI 3.0
* **AI SDK:** `@google/genai` (Google Gemini 2.5 Flash)

### Frontend (Client Web Application)
* **Framework:** [Next.js](https://nextjs.org/) (App Router & Turbopack)
* **Ngôn ngữ:** TypeScript, React 19
* **Styling:** Tailwind CSS (Dark Theme Dashboard System)
* **Icons & Animation:** Lucide Icons

---

## 📂 3. Cấu Trúc Thư Mục Dự Án

```text
LMS-AI/
├── .agents/                       # Cấu hình AI Agents & Automation Skills
├── backend/                       # NestJS API Server
│   ├── prisma/
│   │   ├── schema.prisma          # Cấu trúc CSDL 14 bảng chuẩn 3NF
│   │   └── seed.ts                # Kịch bản nạp dữ liệu mẫu toàn diện
│   ├── src/
│   │   ├── modules/               # Các Module nghiệp vụ (auth, users, courses,
│   │   │                          # classes, enrollments, attendances, grades, ai...)
│   │   ├── common/                # Guards, Interceptors, DTOs, Filters
│   │   ├── config/                # Cấu hình môi trường & AI
│   │   └── main.ts                # Điểm khởi chạy Backend (Port 8000)
│   └── package.json
│
├── frontend/                      # Next.js Web Client
│   ├── src/
│   │   ├── app/                   # App Router Pages
│   │   │   ├── admin/             # Phân hệ Quản trị viên (Dashboard, Classes, Courses, Students...)
│   │   │   ├── staff/             # Phân hệ Tư vấn viên (Thu học phí, Tiếp nhận HV...)
│   │   │   ├── teacher/           # Phân hệ Giáo viên (Điểm danh, Nhập điểm, Sinh bài tập AI...)
│   │   │   ├── student/           # Phân hệ Học viên (Lịch học, Điểm số, Đăng ký lớp, AI Tư vấn...)
│   │   │   └── login/             # Màn hình Đăng nhập
│   │   ├── components/            # UI Components (AppLayout, Navbar, Modals...)
│   │   └── services/api.ts        # Axios Client kết nối Backend API
│   └── package.json
│
├── docs/                          # Tài liệu thiết kế & Báo cáo kỹ thuật
│   └── design/
│       └── EnglishCenterTOP.docx  # Tài liệu Baseline của dự án
├── scripts/                       # Deployment & Migration scripts
├── docker-compose.yml             # Cấu hình Docker services
└── README.md                      # Hướng dẫn chạy dự án
```

---

## 🚀 4. Hướng Dẫn Cài Đặt & Chạy Hệ Thống

### 📋 Yêu Cầu Môi Trường
* **Node.js:** Phiên bản `>= 18.x` (Khuyến nghị Node.js 20 hoặc 22 LTS)
* **NPM:** Phiên bản `>= 9.x`
* **Git**

---

### Bước 1: Cấu hình Môi Trường Backend

Tạo hoặc kiểm tra file `backend/.env`:

```env
# Database (PostgreSQL) - Thay bằng connection string Neon thực tế của bạn
DATABASE_URL="postgresql://username:password@ep-sample-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h

# Server Port
PORT=8000
NODE_ENV=development

# Google Gemini AI API
GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE
GEMINI_FLASH_MODEL=gemini-2.5-flash
GEMINI_PRO_MODEL=gemini-2.5-flash
GEMINI_TIMEOUT_MS=30000
```

---

### Bước 2: Cài Đặt & Khởi Chạy Backend

Mở Terminal tại thư mục gốc của dự án:

```bash
# 1. Di chuyển vào thư mục backend
cd backend

# 2. Cài đặt các thư viện phụ thuộc
npm install

# 3. Sinh Prisma Client và đồng bộ CSDL
npx prisma generate
npx prisma db push

# 4. (Tùy chọn) Nạp dữ liệu mẫu ban đầu nếu CSDL mới tinh
npx prisma db seed

# 5. Khởi chạy Backend Server
npm run start:dev
```

> 🎯 **Backend API sẽ chạy tại:** `http://localhost:8000`  
> 📚 **Tài liệu Swagger OpenAPI:** `http://localhost:8000/api/docs`

---

### Bước 3: Cài Đặt & Khởi Chạy Frontend

Mở một cửa sổ Terminal mới:

```bash
# 1. Di chuyển vào thư mục frontend
cd frontend

# 2. Cài đặt các thư viện phụ thuộc
npm install

# 3. Tạo file .env.local cấu hình API URL (nếu cần đổi URL Backend)
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local

# 4. Khởi chạy máy chủ phát triển (Next.js Dev Server)
npm run dev
```

> 🌐 **Giao diện Web Client sẽ chạy tại:** `http://localhost:3000`

---

## 🔑 5. Danh Sách Tài Khoản Mẫu (Demo Credentials)

> 💡 **Mật khẩu chung cho TẤT CẢ tài khoản mẫu là:** `123456`

| Vai trò | Tên đăng nhập (Username) | Mật khẩu | Chức năng chính |
| :--- | :--- | :--- | :--- |
| **Quản Trị Viên (Admin)** | `admin01` | `123456` | Toàn quyền quản trị Dashboard, Khóa học, Lớp học, Giáo viên, Học viên, Báo cáo Doanh thu & AI |
| **Tư Vấn Viên (Staff)** | `staff01`, `staff02` | `123456` | Tiếp nhận học viên mới, Xếp lớp, Thu học phí và Xuất phiếu thu |
| **Giáo Viên (Teacher)** | `teacher01` → `teacher10` | `123456` | Xem TKB, Điểm danh buổi học, Ma trận chuyên cần, Nhập điểm & Đánh giá kết quả, Sinh bài tập AI |
| **Học Viên (Student)** | `student01` → `student54` | `123456` | Xem TKB cá nhân, Tra cứu bảng điểm, Đăng ký lớp học, Luyện bài tập AI, AI Tư vấn & Tóm tắt tiến độ |
| **Học Viên Mới** | `phongls206` | `123456` | Tài khoản học viên kiểm thử đăng ký lớp & hóa đơn |

---

## 🖥️ 6. Các Phân Hệ Chức Năng Chính

### 1. Phân Hệ Quản Trị Viên (`/admin`)
* **Dashboard Tổng Quan (`/admin/dashboard`):** Biểu đồ KPI doanh thu, số lượng học viên, lớp học và phân bố CEFR.
* **Quản Lý Khóa Học (`/admin/courses`):** Danh mục khóa học IELTS, TOEIC, Giao tiếp, Chuẩn đầu vào CEFR, Học phí.
* **Quản Lý Lớp Học & TKB (`/admin/classes`):** Tạo lớp, Xếp phòng học, Phân công giảng viên, Kiểm tra chống trùng lịch.
* **Hồ Sơ Học Viên (`/admin/students`):** Quản lý chi tiết học viên, xem lớp & khóa đang học, công nợ học phí, mở popup Hồ sơ toàn diện.
* **Hồ Sơ Giảng Viên (`/admin/teachers`):** Quản lý danh sách giảng viên, chuyên môn, phân công giảng dạy.
* **Quản Lý Học Phí & Hóa Đơn (`/admin/fees`):** Quản lý toàn bộ hóa đơn học phí, ghi nhận thanh toán tại quầy.
* **Báo Cáo & Thống Kê (`/admin/reports`):** Thống kê doanh thu theo tháng, tỷ lệ hoàn thành khóa học.

### 2. Phân Hệ Giáo Viên (`/teacher`)
* **Lớp Phụ Trách & TKB (`/teacher/classes`):** Danh sách các lớp được phân công giảng dạy và lịch học trong tuần.
* **Điểm Danh Buổi Học (`/teacher/attendance`):** Điểm danh theo từng buổi học (Có mặt, Đi muộn, Có phép, Vắng) kèm tính năng **Ma Trận Điểm Danh Toàn Khóa** và xem Lịch sử chuyên cần từng học viên.
* **Nhập Điểm & Kết Quả (`/teacher/grades`):** Nhập điểm chuyên cần, giữa kỳ, cuối kỳ; Hệ thống tự động tính điểm tổng kết và xếp loại Đạt/Không Đạt.
* **Sinh Bài Tập AI (`/teacher/ai-exercises`):** Giáo viên nhập chủ đề và kỹ năng → Gemini AI sinh trắc nghiệm tự động.

### 3. Phân Hệ Học Viên (`/student`)
* **Bàn Làm Việc & TKB (`/student/dashboard`, `/student/schedule`):** Xem lịch học hôm nay, phòng học và giảng viên phụ trách.
* **Bảng Điểm & Kết Quả (`/student/grades`):** Tra cứu điểm số chi tiết từng môn và trạng thái tốt nghiệp.
* **Đăng Ký Khóa Học (`/student/enroll`):** Tự chọn và ghi danh vào các lớp học phù hợp với trình độ CEFR; Hệ thống tự động sinh hóa đơn học phí.
* **Học Phí & Hóa Đơn (`/student/fees`):** Tra cứu mã hóa đơn, số tiền đã đóng, còn nợ và hạn thanh toán.
* **AI Tư Vấn Lớp Học (`/student/ai-consult`):** Nhập mục tiêu cá nhân → AI gợi ý lộ trình và lớp học tối ưu.
* **AI Luyện Trắc Nghiệm (`/student/ai-practice`):** Làm bài trắc nghiệm tương tác do AI sinh trực tiếp, chấm điểm và xem giải thích tức thì.
* **AI Tóm Tắt Tiến Độ (`/student/ai-progress`):** AI phân tích điểm mạnh, điểm yếu và đưa ra lời khuyên học tập.

---

## 📚 7. Tài Liệu API Swagger

Sau khi khởi chạy Backend, truy cập:  
👉 **`http://localhost:8000/api/docs`**

Hệ thống tài liệu Swagger OpenAPI bao gồm đầy đủ:
* Mô tả chi tiết tất cả **14 Use Cases**.
* Cấu trúc DTO Request / Response của từng Endpoint.
* Nút **Authorize** tích hợp sẵn Bearer JWT Token để kiểm thử API trực tiếp trên trình duyệt.

---

## 👥 Nhóm Tác Giả & Bản Quyền
* **Dự án:** Hệ Thống Quản Lý Trung Tâm Ngoại Ngữ Tích Hợp AI (ETC English Center LMS)
* **Phiên bản:** `1.0.0`
* **Năm thực hiện:** 2026