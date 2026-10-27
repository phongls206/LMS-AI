# 🐳 Hướng Dẫn Triển Khai Nhanh Với Docker (ETC English LMS AI)

Tài liệu hướng dẫn triển khai toàn diện hệ thống **ETC English Center LMS AI** trên bất kỳ máy tính mới nào (Windows, macOS, Ubuntu Linux) chỉ với **1 câu lệnh**.

---

## 📋 1. Yêu cầu tiên quyết
Máy tính cần cài đặt **Docker** và **Docker Compose**:
- **Windows / macOS:** Cài đặt [Docker Desktop](https://www.docker.com/products/docker-desktop/) (bật WSL 2 trên Windows).
- **Ubuntu Linux:** Cài đặt Docker Engine (`sudo apt install docker.io docker-compose-plugin`).

---

## 🚀 2. Quy trình 4 bước triển khai siêu tốc

### Bước 1: Sao chép mã nguồn & Cấu hình biến môi trường
```bash
# Clone dự án (nếu tải mới)
git clone https://github.com/phongls206/LMS-AI.git
cd LMS-AI

# Tạo file cấu hình từ mẫu (nếu chưa có file .env)
cp .env.example .env
```
> **Lưu ý:** Mở file `.env` và điền `GEMINI_API_KEY` của bạn để kích hoạt 3 tính năng AI.

### Bước 2: Khởi động toàn bộ 3 dịch vụ
```bash
docker compose up -d --build
```
> Docker sẽ tự động:
> 1. Tải image và khởi chạy **PostgreSQL 15** (`etc_english_db`) có volume bền vững.
> 2. Biên dịch đa tầng và khởi chạy **NestJS API Server** (`etc_english_backend`) tại port **8000**.
> 3. Biên dịch standalone và khởi chạy **Next.js Web App** (`etc_english_frontend`) tại port **3000**.

### Bước 3: Đồng bộ CSDL và nạp dữ liệu mẫu (Seed Data)
```bash
# 1. Khởi tạo cấu trúc bảng Prisma vào CSDL container
docker compose exec backend npx prisma db push

# 2. Nạp dữ liệu mẫu ban đầu (khóa học, lớp học, tài khoản quản trị, GV, HV)
docker compose exec backend npm run db:seed
```

### Bước 4: Truy cập ứng dụng
- 🌐 **Giao diện Web (Frontend):** [http://localhost:3000](http://localhost:3000)
- 📚 **Tài liệu API tương tác (Swagger Docs):** [http://localhost:8000/api/docs](http://localhost:8000/api/docs)
- 🗄️ **Kết nối CSDL PostgreSQL:** `localhost:5432` (`etc_user` / `etc_password_secure_2026`)

---

## 👥 3. Tài khoản kiểm thử mặc định

| Vai trò (Role) | Tài khoản (Username) | Mật khẩu (Password) | Chức năng kiểm thử |
| :--- | :--- | :--- | :--- |
| **Quản lý (Admin)** | `admin01` | `Admin@123` | Dashboard, mở lớp, phân công GV, báo cáo doanh thu |
| **Giáo viên (Teacher)** | `teacher01` | `Admin@123` | Lịch dạy, điểm danh, nhập điểm, trợ lý AI sinh đề |
| **Học viên (Student)** | `student01` | `Admin@123` | Lịch học, bảng điểm, đăng ký lớp, AI tư vấn & luyện tập |
| **Tư vấn viên (Staff)** | `staff01` | `Admin@123` | Tuyển sinh học viên mới, ghi danh, lập phiếu thu học phí |

---

## 🛠️ 4. Các lệnh quản trị thường dùng

```bash
# Xem logs thời gian thực
docker compose logs -f

# Xem logs riêng của backend hoặc frontend
docker compose logs -f backend
docker compose logs -f frontend

# Kiểm tra trạng thái các container
docker compose ps

# Khởi động lại một dịch vụ
docker compose restart backend

# Dừng hệ thống (CSDL trong volume vẫn an toàn)
docker compose stop

# Tắt và xóa container cùng mạng nội bộ
docker compose down

# Sao lưu (Backup) CSDL ra máy chủ
docker exec -t etc_english_db pg_dump -U etc_user etc_english > backup_etc.sql

# Phục hồi (Restore) CSDL từ bản sao lưu
docker exec -i etc_english_db psql -U etc_user etc_english < backup_etc.sql
```
