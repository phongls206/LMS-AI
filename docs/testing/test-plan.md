# Test Plan — ETC English Center LMS AI

**Phiên bản:** 2.0 (Mở rộng toàn diện)  
**Ngày cập nhật:** 27/10/2026  
**Tài liệu tham chiếu:** `docs/design/EnglishCenterTOP.docx` 
**Quy mô kiểm thử:** 145 Ca kiểm thử (45 Ca kiểm thử cơ sở + 100 Ca kiểm thử chuyên sâu: Hộp Đen & Hộp Trắng)

---

## 1. Phạm vi kiểm thử

Hệ thống **ETC English Center LMS AI** bao gồm trọn bộ 14 Use Case chính theo tài liệu thiết kế chuẩn `EnglishCenterTOP.docx` kết hợp các mô-đun an ninh, giao dịch CSDL ACID và cơ chế phòng vệ AI:

| Nhóm chức năng | Use Case | Mô tả chi tiết |
| :--- | :--- | :--- |
| **Xác thực & Phân quyền** | UC001 | Đăng nhập phân quyền (JWT + Argon2), kiểm soát RBAC 4 vai trò, DTO validation, phiên làm việc |
| **Quản lý nghiệp vụ đào tạo** | UC002–UC005 | Quản lý hồ sơ học viên, CEFR A1–C2, danh mục khóa học, mở lớp học (max 25 HV), xếp lịch phòng và phân công giảng viên |
| **Ghi danh & Tài chính** | UC006–UC007 | Đăng ký lớp (4 ràng buộc), ACID Transaction, tự sinh hóa đơn 1-1, thu học phí nhiều đợt, xuất phiếu thu PDF |
| **Điểm danh & Kết quả học tập** | UC008–UC011 | Điểm danh 4 trạng thái, tính điểm tổng kết 20/30/50, xét điều kiện ĐẠT (TK >= 50 & CC >= 80%), xuất Excel |
| **Tích hợp GenAI & Phòng vệ** | UC012–UC014 | AI tư vấn lớp, AI sinh bài tập trắc nghiệm, AI tóm tắt tiến độ, lọc ảo giác Zero-Trust và kích hoạt Fallback |

---

## 2. Mục tiêu kiểm thử

- **Kiểm thử Hộp Đen (Black-box Testing):**
  - Xác nhận tất cả 14 Use Case vận hành đúng theo tài liệu thiết kế.
  - Kiểm tra phân quyền RBAC nghiêm ngặt giữa 4 vai trò: Quản lý / Giáo viên / Học viên / Tư vấn viên (chặn 403 Forbidden).
  - Kiểm tra toàn diện các giá trị biên (Boundary Value Analysis): Sĩ số tối đa 25 học viên, điểm số [0, 100], ngưỡng Đạt 50.00 và CC 80.00%.
  - Kiểm tra validation đầu vào (DTOs), định dạng email, số điện thoại và thời gian lịch học.
  - Kiểm tra khả năng chống Prompt Injection và tính đúng đắn JSON schema từ mô hình Google Gemini.
- **Kiểm thử Hộp Trắng (White-box Testing):**
  - Đạt chỉ số bao phủ câu lệnh (Statement Coverage) >= 90% và bao phủ nhánh rẽ (Branch Coverage) >= 85%.
  - Unit Test từng Service cốt lõi: `AuthService`, `CoursesService`, `ClassesService`, `EnrollmentsService`, `AttendancesService`, `GradesService`, `AiService`.
  - Kiểm tra cơ chế Rollback của `prisma.$transaction` khi có lỗi phát sinh trong luồng ghi danh - tạo hóa đơn.
  - Kiểm thử cơ chế bảo vệ Zero-Trust lọc bỏ lớp học ảo giác do LLM sinh ra.
  - Kiểm thử ngắt mạch (Circuit Breaker / Timeout 10s) tự động chuyển sang Curriculum Bank dự phòng offline.

---

## 3. Ma trận phân bổ 145 Ca Kiểm Thử

| Phân hệ / Nhóm kiểm thử | Dải mã Test ID | Phương pháp | Số lượng | Trọng tâm kiểm thử |
| :--- | :--- | :--- | :--- | :--- |
| **14 Use Case Cơ Sở** | TC001 — TC045 | Black-box | 45 TCs | Các luồng chính (Main Flow) và luồng phụ cơ bản của 14 Use Case |
| **Xác thực, RBAC & DTO** | TC046 — TC055 | Black-box | 10 TCs | Đổi mật khẩu, JWT expired, chặn truy cập chéo vai trò 403 |
| **Đào tạo, Lớp học & Xếp lịch** | TC056 — TC065 | Black-box | 10 TCs | Ràng buộc FK Restrict, biên học phí 0đ, trùng phòng, trùng giờ GV |
| **Ghi danh & Quản trị Tài chính** | TC066 — TC075 | Black-box | 10 TCs | Hủy đăng ký hoàn sĩ số, chặn nộp tiền âm/thừa, xuất PDF phiếu thu |
| **Điểm danh & Học thuật chuyên sâu** | TC076 — TC085 | Black-box | 10 TCs | Điểm danh học bù, chặn điểm ngoài [0,100], biên Đạt 49.99 vs 50.00 |
| **Bộ ba GenAI & Phòng chống ảo giác**| TC086 — TC095 | Black-box | 10 TCs | Prompt Injection, schema JSON 4 kỹ năng, Rate Limit 429 Fallback |
| **Unit Test Auth & RolesGuard** | TC096 — TC105 | White-box | 10 TCs | Bao phủ nhánh Argon2 verify, Reflector RolesGuard, Session limits |
| **Unit Test Đào tạo & Xếp lịch** | TC106 — TC115 | White-box | 10 TCs | Thuật toán checkScheduleConflict, checkTeacherConflict, State Machine |
| **Unit Test Giao dịch Ghi danh ACID** | TC116 — TC125 | White-box | 10 TCs | Prisma.$transaction, atomicity rollback, khống chế cứng 25 HV |
| **Unit Test Điểm danh & Bảng điểm** | TC126 — TC135 | White-box | 10 TCs | Upsert bản ghi, công thức làm tròn 20/30/50, ma trận điểm danh 2 chiều |
| **Unit Test GenAI & Chốt chặn Zero-Trust**| TC136 — TC145 | White-box | 10 TCs | Mock Gemini API, Promise.race timeout 10s, filterNonExistentClasses |

---

## 4. Môi trường kiểm thử

| Hạng mục | Thông số kỹ thuật / Phiên bản | Ghi chú |
| :--- | :--- | :--- |
| **Hệ điều hành** | Microsoft Windows 11 Enterprise / Ubuntu 22.04 LTS | Môi trường phát triển và CI/CD |
| **Backend Service** | Node.js v24.21.0, NestJS 12.0.1, TypeScript 6.0 | RESTful API 32 endpoints |
| **Frontend Client** | Next.js 16.3.4 (App Router), React 19.2.8, Tailwind CSS v4 | Web dashboard phân quyền |
| **Cơ sở dữ liệu** | PostgreSQL Serverless (Neon Cloud), Prisma ORM 6.4.1 | 14 Bảng quan hệ chuẩn 3NF |
| **AI Integration** | @google/genai v2.20.0 (Google Gemini 2.5 / 3.8 Flash) | LLM tích hợp có cấu trúc JSON |
| **Testing Framework** | Vitest v4.1.2, Supertest 7.0, React Testing Library | Unit Test & Integration Test |

---

## 5. Tiêu chí nghiệm thu hoàn thành (Exit Criteria)

- 100% các ca kiểm thử đạt trạng thái **PASS** (145/145 TCs).
- Độ bao phủ mã nguồn (Code Coverage): **Statement Coverage đạt >= 94.0%**, **Branch Coverage đạt >= 90.0%**.
- 0 lỗi phát sinh mức độ Nghiêm trọng (Critical) hoặc Cao (High).
- Luồng ACID Transaction đảm bảo không tạo bản ghi rác hoặc lệch sĩ số khi gặp lỗi mạng.
- Chốt chặn Zero-Trust loại bỏ 100% các lớp học ảo giác do AI sinh ra.
