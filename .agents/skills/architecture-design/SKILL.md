---
name: architecture-design
description: Quy chuẩn thiết kế kiến trúc phân tầng (Multi-Tier), mô hình hóa hướng đối tượng (Class Diagram & Đặc tả Lớp), phân luồng màn hình RBAC (Screen Flow) và thiết kế hạ tầng triển khai cho ETC English Center.
---

# Architecture Design Skill (Thiết Kế Kiến Trúc & Hướng Đối Tượng)

## 1. Mục Đích & Phạm Vi
Skill này quy định phương pháp thiết kế kiến trúc tổng thể, mô hình hóa hướng đối tượng (OOD) cho 12 lớp nghiệp vụ, thiết kế luồng điều hướng màn hình (Screen Flow) theo cơ chế phân quyền RBAC và sơ đồ triển khai hạ tầng cho hệ thống **ETC English Center**.

---

## 2. Quy Chuẩn Kiến Trúc Phân Tầng (Multi-Tier Architecture)

Hệ thống được tổ chức thành 4 tầng độc lập, giao tiếp lỏng lẻo (Loosely Coupled):
1. **Tầng Trình Diễn (Presentation Tier - Frontend):**
   - Công nghệ: Next.js (React / TypeScript / TailwindCSS).
   - Trách nhiệm: Render giao diện người dùng, quản lý State, điều hướng Route Guard theo vai trò (RBAC), gọi API backend qua Axios/Fetch kèm JWT.
2. **Tầng Ứng Dụng & API (Application Tier - Backend API):**
   - Công nghệ: NestJS (TypeScript) / RESTful Controller.
   - Trách nhiệm: Định tuyến API, xác thực JWT, phân quyền Guards (`@Roles('ADMIN')`), kiểm tra tính hợp lệ dữ liệu (Validation Pipes qua DTOs).
3. **Tầng Nghiệp Vụ & Dịch Vụ (Business Logic Layer - Services):**
   - Trách nhiệm: Thực thi toàn bộ quy tắc nghiệp vụ trọng yếu (Business Rules: tính điểm, khống chế sĩ số, kiểm tra lịch trùng, xử lý thanh toán giao dịch ACID, gọi AI Service kèm Fallback).
4. **Tầng Dữ Liệu & Dịch Vụ Ngoài (Data Tier & External Services):**
   - PostgreSQL (Lưu trữ 14 bảng quan hệ 3NF).
   - Google Gemini GenAI Cloud Service (Tích hợp AI).

---

## 3. Quy Chuẩn Thiết Kế Hướng Đối Tượng (Object-Oriented Design)

Agent phải đặc tả và duy trì mô hình lớp theo đúng 12 lớp cốt lõi:
- **`NguoiDung`:** Quản lý tài khoản, mã hóa mật khẩu (`matKhauMaHoa`), phương thức `xacThuc()`, `kiemTraQuyen()`.
- **`HoSoHocVien`:** Hồ sơ học viên, trình độ CEFR, `lichRanh` (JSON), phương thức `CapNhatTrinhDo()`.
- **`HoSoGiaoVien`:** Năng lực, bằng cấp, chuyên môn, phương thức `kiemTraTrangThaiDay()`.
- **`KhoaHoc`:** Chương trình đào tạo chuẩn, `hocPhi`, `trinhDoYeuCau`, phương thức `ngungHoatDong()`.
- **`LopHoc`:** Lớp học mở thực tế, `siSoToiDa` (tối đa 25), `siSoHienTai`, phương thức `ConChoTrong()`, `TangSiSo()`.
- **`LichHoc`:** Thời khóa biểu tuần, phương thức `KiemTraXungDot()`.
- **`PhanCongGiaoVien`:** Phân công 1 giáo viên chính cho lớp, phương thức `XacNhanPhanCong()`.
- **`DangKyHoc`:** Giao dịch ghi danh, phương thức `kiemTraDieuKienDangKy()`.
- **`HoaDon` & `ThanhToan`:** Quản lý công nợ, phương thức `CapNhatThanhToan()`.
- **`BuoiHoc` & `BanGhiDiemDanh`:** Quản lý chuyên cần, phương thức `dieuChinhDiemDanh()`.
- **`KetQuaHocTap`:** Bảng điểm 20/30/50, phương thức `TinhDiemTongKet()`.
- **`DichVuAI` & `YeuCauAI`:** Quản lý Prompt, gọi Gemini API, phương thức `validateVaLocAoGiac()`, `xuLyFallback()`.

---

## 4. Quy Chuẩn Phân Luồng Màn Hình & RBAC (Screen Flow)

Mọi luồng người dùng phải bám sát danh mục 21 màn hình chuẩn:
- **Màn hình chung:** `SCR-AUTH-01` (Đăng nhập), `SCR-AUTH-02` (Đổi mật khẩu).
- **Admin Flow (`SCR-ADM-01..07`):** Dashboard $\rightarrow$ Quản lý Khóa học $\rightarrow$ Lớp & Lịch $\rightarrow$ Phân công GV $\rightarrow$ Hồ sơ HV $\rightarrow$ Học phí & Công nợ $\rightarrow$ Thống kê Doanh thu/Sĩ số/Tỷ lệ.
- **Teacher Flow (`SCR-TEA-01..05`):** Dashboard $\rightarrow$ Danh sách lớp dạy $\rightarrow$ Điểm danh buổi học $\rightarrow$ Nhập điểm (20/30/50) $\rightarrow$ AI Sinh bài tập bổ trợ.
- **Student Flow (`SCR-STU-01..08`):** Dashboard $\rightarrow$ AI Tư vấn lớp $\rightarrow$ Đăng ký lớp $\rightarrow$ Lịch học $\rightarrow$ Học phí & Hóa đơn $\rightarrow$ Bảng điểm $\rightarrow$ AI Luyện tập cá nhân $\rightarrow$ AI Tóm tắt tiến độ.
- **Counselor/Staff Flow (`SCR-STA-01..03`):** Dashboard Tuyển sinh $\rightarrow$ Tiếp nhận HV & Test CEFR $\rightarrow$ AI Tư vấn lớp $\rightarrow$ Đăng ký $\rightarrow$ Thu học phí trực tiếp.

---

## 5. Quy Chuẩn Thiết Kế Triển Khai Hạ Tầng
- Cấu hình Reverse Proxy Nginx/Cloudflare làm tường lửa và cân bằng tải.
- Tách biệt biến môi trường (`.env`) giữa Development và Production.
- Không để lộ trực tiếp Database Port (5432) ra ngoài mạng Internet công cộng.
