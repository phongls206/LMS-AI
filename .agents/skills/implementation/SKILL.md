---
name: implementation
description: Quy chuẩn lập trình Clean Code, tổ chức thư mục Frontend/Backend, quản lý Transaction ACID, kiểm soát RBAC và tích hợp Gemini SDK cho ETC English Center.
---

# Implementation Skill (Quy Chuẩn Lập Trình & Viết Mã Nguồn)

## 1. Mục Đích & Phạm Vi
Skill này quy định phong cách lập trình, kiến trúc mã nguồn (NestJS & Next.js), quy tắc đặt tên, xử lý ngoại lệ, quản lý Transaction CSDL và bảo mật mã nguồn cho hệ thống **ETC English Center**.

---

## 2. Quy Chuẩn Tổ Chức Thư Mục

### 2.1 Backend (NestJS / TypeScript)
```text
backend/src/
├── common/             # Guards, Interceptors, Filters, Decorators, Constants
├── config/             # Environment configurations (.env)
├── database/           # Migrations, Seeds, TypeORM/Prisma entities
└── modules/            # Các module nghiệp vụ độc lập
    ├── auth/           # Login, JWT, Change Password
    ├── users/          # NguoiDung, HoSoHocVien, HoSoGiaoVien
    ├── courses/        # KhoaHoc, LopHoc, LichHoc, PhanCong
    ├── enrollments/    # DangKyHoc, HoaDon, ThanhToan
    ├── attendances/    # BuoiHoc, BanGhiDiemDanh
    ├── grades/         # KetQuaHocTap (Tính điểm 20/30/50)
    ├── statistics/     # Báo cáo Doanh thu, Sĩ số, Tỷ lệ
    └── ai/             # Gemini API Integration, Fallbacks, Audit
```

### 2.2 Frontend (Next.js App Router / TypeScript)
```text
frontend/src/
├── app/                # App Router theo 4 nhóm vai trò (admin, teacher, student, staff)
├── components/         # Reusable UI components
├── hooks/              # Custom React hooks
├── services/           # API Client (Axios/Fetch wrapper với JWT interceptor)
└── types/              # TypeScript Interfaces / Types
```

---

## 3. Nguyên Tắc Lập Trình Cốt Lõi (Core Principles)

1. **Backend Authority:** Mọi logic nghiệp vụ trọng yếu (tính điểm, kiểm tra trùng lịch, giới hạn sĩ số $\le 25$, phân quyền) bắt buộc phải kiểm tra và xử lý ở Backend. Frontend chỉ đóng vai trò hiển thị và hỗ trợ người dùng.
2. **ACID Transaction:** Các thao tác thay đổi nhiều bảng liên quan (VD: Đăng ký lớp $\rightarrow$ Tăng sĩ số $\rightarrow$ Tạo hóa đơn) bắt buộc phải bọc trong Database Transaction. Nếu một bước thất bại phải Rollback toàn bộ.
3. **Security First:** Không hardcode API Key, mật khẩu, JWT Secret vào code. Luôn dùng `process.env`.
4. **Clean Code & KISS:** Đặt tên biến/hàm rõ nghĩa, chia nhỏ hàm xử lý, hạn chế lồng ghép if-else phức tạp, viết comment giải thích logic nghiệp vụ đặc thù.
