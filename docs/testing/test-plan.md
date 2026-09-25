# Test Plan — ETC English Center LMS AI

**Phiên bản:** 1.0  
**Ngày lập:** 25/09/2026  
**Người lập:** QA Team  
**Tài liệu tham chiếu:** `docs/design/EnglishCenterTOP.docx`

---

## 1. Phạm vi kiểm thử

Hệ thống **ETC English Center LMS AI** bao gồm 14 Use Case chính theo tài liệu thiết kế `EnglishCenterTOP.docx`, chia thành 3 nhóm chính:

| Nhóm | Use Case | Mô tả |
| :--- | :--- | :--- |
| **Xác thực & Phân quyền** | UC001 | Đăng nhập và phân quyền |
| **Quản lý nghiệp vụ** | UC002–UC011 | Quản lý học viên, khóa học, lớp, giáo viên, đăng ký, học phí, điểm danh, kết quả, tra cứu, thống kê |
| **Tích hợp AI** | UC012–UC014 | AI tư vấn lớp, AI sinh bài luyện tập, AI tóm tắt tiến độ |

---

## 2. Mục tiêu kiểm thử

- Xác nhận tất cả 14 Use Case vận hành đúng theo tài liệu thiết kế.
- Kiểm tra phân quyền RBAC: Quản lý / Giáo viên / Học viên / Tư vấn viên.
- Kiểm tra validation đầu vào, xử lý lỗi, và các luồng phụ (Alternative Flows).
- Kiểm tra tích hợp Gemini AI (UC012–UC014) và cơ chế Fallback khi AI không khả dụng.
- Kiểm tra tính toán trọng số điểm: Chuyên cần 20% + Giữa kỳ 30% + Cuối kỳ 50%.

---

## 3. Phạm vi KHÔNG kiểm thử

- Kiểm thử hiệu năng tải cao (Load/Stress Testing).
- Kiểm thử bảo mật nâng cao (Penetration Testing).
- Kiểm thử tương thích trình duyệt cũ (IE 11 trở xuống).
- Kiểm thử môi trường Production thực tế.

---

## 4. Vai trò người dùng (User Roles)

| Vai trò | Quyền chính |
| :--- | :--- |
| **Quản lý (Admin)** | Toàn quyền: quản lý học viên, khóa học, lớp, giáo viên, học phí, thống kê |
| **Giáo viên (Teacher)** | Điểm danh, ghi nhận kết quả, xem lịch dạy |
| **Học viên (Student)** | Tra cứu lịch học, xem học phí, xem kết quả, dùng AI |
| **Tư vấn viên (Consultant)** | Quản lý học viên, đăng ký lớp, tra cứu, AI tư vấn |

---

## 5. Chức năng cần kiểm thử

### 5.1 UC001 — Đăng nhập và phân quyền
- Đăng nhập đúng tài khoản/mật khẩu → vào đúng màn hình theo vai trò.
- Đăng nhập sai thông tin → báo lỗi, không tạo phiên.
- Tài khoản bị vô hiệu hóa → từ chối đăng nhập.
- Token JWT hết hạn → yêu cầu đăng nhập lại.

### 5.2 UC002 — Quản lý học viên và hồ sơ trình độ
- Tạo mới, cập nhật, tìm kiếm thông tin học viên.
- Gắn hồ sơ trình độ CEFR (A1–C2) và lịch rảnh.
- Từ chối email/số điện thoại trùng.
- Phân quyền: chỉ Quản lý và Tư vấn viên được thao tác.

### 5.3 UC003 — Quản lý khóa học
- Tạo, cập nhật khóa học với mã, tên, CEFR, thời lượng, học phí.
- Từ chối mã khóa trùng.
- Khóa đã phát sinh lớp: chỉ cho ngừng hoạt động, không xóa cứng.

### 5.4 UC004 — Quản lý lớp và lịch học
- Tạo lớp từ khóa học có sẵn, giới hạn tối đa 25 học viên.
- Kiểm tra trùng lịch phòng học và giáo viên.
- Sĩ số ngoài 1–25: từ chối.

### 5.5 UC005 — Quản lý giáo viên và phân công lớp
- Tạo, cập nhật hồ sơ giáo viên.
- Phân công giáo viên phụ trách lớp, kiểm tra trùng lịch dạy.
- Giáo viên hoặc lớp không hoạt động: từ chối phân công.

### 5.6 UC006 — Đăng ký lớp
- Đăng ký khi lớp còn chỗ, đúng CEFR, không trùng lịch học.
- Từ chối đăng ký trùng, lớp đầy (25 HV), lớp đã đóng.
- Cảnh báo nếu trình độ/lịch không phù hợp.

### 5.7 UC007 — Quản lý học phí
- Tự động tạo hóa đơn khi đăng ký lớp.
- Ghi nhận thanh toán tiền mặt / chuyển khoản.
- Học viên chỉ được xem học phí của mình.

### 5.8 UC008 — Điểm danh
- Giáo viên ghi nhận 4 trạng thái: Có mặt, Vắng, Đi muộn, Có phép.
- Chỉ giáo viên phụ trách lớp được điểm danh.
- Từ chối điểm danh học viên không thuộc lớp.

### 5.9 UC009 — Ghi nhận kết quả học tập
- Nhập điểm 0–100 cho Chuyên cần, Giữa kỳ, Cuối kỳ.
- Tổng kết = Chuyên cần×20% + Giữa kỳ×30% + Cuối kỳ×50%.
- Từ chối điểm ngoài phạm vi 0–100.

### 5.10 UC010 — Tra cứu lịch, lớp và học phí
- Tra cứu hiển thị đúng dữ liệu theo quyền vai trò.
- Hiển thị trạng thái rỗng khi không có dữ liệu.

### 5.11 UC011 — Xem thống kê
- Thống kê sĩ số, doanh thu, tỷ lệ hoàn thành theo phạm vi/thời gian.
- Chỉ Quản lý được xem.
- Hoàn thành khi Tổng kết >= 50 và Chuyên cần >= 80%.

### 5.12 UC012 — AI tư vấn lớp phù hợp
- Gợi ý tối đa 3 lớp dựa trên CEFR và lịch rảnh.
- Chỉ gợi ý lớp thực sự tồn tại trong CSDL.
- Fallback khi AI lỗi hoặc timeout >15 giây: lọc theo CEFR + lịch + chỗ trống.

### 5.13 UC013 — AI sinh bài luyện tập ngắn
- Sinh bài trắc nghiệm theo chủ đề và trình độ CEFR.
- Output phải có cấu trúc câu hỏi + đáp án + giải thích.
- Fallback khi AI lỗi: trả bộ bài mẫu theo CEFR/chủ đề.

### 5.14 UC014 — AI tóm tắt tiến độ học tập
- Tóm tắt dựa đúng trên dữ liệu kết quả học tập.
- AI không được thêm dữ kiện ngoài dữ liệu nguồn.
- Fallback khi AI lỗi: trả tóm tắt theo quy tắc.

---

## 6. Các loại kiểm thử

| Loại | Mô tả |
| :--- | :--- |
| **Functional Testing** | Kiểm thử đúng logic nghiệp vụ từng Use Case |
| **Integration Testing** | Kiểm thử luồng liên kết giữa các module (VD: Đăng ký → Hóa đơn) |
| **API Testing** | Kiểm thử REST API endpoint (status code, payload, auth) |
| **Database Testing** | Kiểm thử ràng buộc CSDL, trigger và tính toàn vẹn dữ liệu |
| **Authorization Testing** | Kiểm thử phân quyền RBAC cho từng API |
| **Validation Testing** | Kiểm thử input validation, boundary cases |
| **AI Integration Testing** | Kiểm thử Gemini API integration + Fallback |
| **Regression Testing** | Kiểm thử hồi quy sau mỗi lần thay đổi code |

---

## 7. Môi trường kiểm thử

| Hạng mục | Thông tin |
| :--- | :--- |
| **OS** | Windows 11 |
| **Backend** | NestJS (Node.js) |
| **Frontend** | Next.js (React/TypeScript) |
| **Database** | PostgreSQL (Neon DB) |
| **ORM** | Prisma |
| **AI Service** | Google Gemini API |
| **API Test Tool** | Postman / Thunder Client |
| **Auth** | JWT (Access Token + Refresh Token) |

---

## 8. Rủi ro và phương án xử lý

| Rủi ro | Xác suất | Ảnh hưởng | Phương án |
| :--- | :--- | :--- | :--- |
| Gemini API giới hạn quota / timeout | Trung bình | Cao | Kiểm thử Fallback mode; mock API response |
| Dữ liệu test không đủ đa dạng | Thấp | Trung bình | Seed data đầy đủ theo từng UC |
| Xung đột lịch khi test song song | Thấp | Trung bình | Chạy test tuần tự hoặc dùng data isolation |
| Tính toán điểm trọng số sai | Thấp | Cao | Kiểm thử kỹ boundary và công thức |

---

## 9. Tiêu chí hoàn thành (Exit Criteria)

- Tất cả test case Happy Path đạt PASS.
- Không còn bug mức Critical hoặc High còn mở.
- Phân quyền RBAC hoạt động đúng với 4 vai trò.
- Cơ chế Fallback AI hoạt động khi Gemini không phản hồi.
- Công thức tính tổng kết điểm cho kết quả chính xác.

---

## 10. Cấu trúc tài liệu kiểm thử

```
docs/testing/
├── test-plan.md       ← Kế hoạch kiểm thử (file này)
├── test-cases.md      ← Danh sách test cases chi tiết
└── test-report.md     ← Kết quả kiểm thử thực tế
```
