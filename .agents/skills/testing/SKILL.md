---
name: testing
description: Quy chuẩn thiết kế Test Plan, viết Unit Test, Integration Test, Functional Test Case và kiểm thử AI an toàn cho ETC English Center.
---

# Testing Skill (Quy Chuẩn Kiểm Thử Hệ Thống & Đảm Bảo Chất Lượng)

## 1. Mục Đích & Phạm Vi
Skill này quy định quy trình kiểm thử phần mềm, cấu trúc bảng Test Case chức năng, phương pháp viết Unit/Integration Test cho Backend/Frontend và quy trình kiểm thử độ tin cậy của 3 chức năng GenAI cho **ETC English Center**.

---

## 2. Quy Chuẩn Thiết Kế Test Case Chức Năng (Chuẩn Bảng 7 Cột)

Mọi Test Case trong báo cáo kiểm thử bắt buộc theo bảng chuẩn:
1. `Test ID`: Mã ca kiểm thử (VD: `TC-ENROLL-01`, `TC-AI-02`).
2. `Use Case / Feature`: Tên ca sử dụng liên quan (`UC006`, `UC012`).
3. `Mô tả mục tiêu kiểm thử`: Kiểm tra trường hợp hợp lệ / ngoại lệ biên.
4. `Dữ liệu đầu vào (Test Data)`: Dữ liệu truyền vào (VD: Lớp có sĩ số = 25).
5. `Các bước thực hiện (Test Steps)`: Hành động thao tác từng bước.
6. `Kết quả mong đợi (Expected Result)`: Phản hồi hệ thống (Mã lỗi, thông báo, bản ghi DB).
7. `Trạng thái (Pass / Fail)`: Kết quả thực tế khi chạy test.

---

## 3. Các Phân Hệ Bắt Buộc Phải Có Test Case

Theo yêu cầu của đề tài, các module sau bắt buộc đạt 100% test coverage:
1. **Module Đăng ký lớp (`UC006`):**
   - Đăng ký thành công lớp còn chỗ.
   - Chặn đăng ký khi lớp đã đủ 25 học viên.
   - Chặn đăng ký khi học viên đã ghi danh lớp đó trước đó.
   - Chặn đăng ký khi CEFR học viên không đạt chuẩn đầu vào của khóa.
   - Cảnh báo/chặn khi thời khóa biểu trùng với lớp khác học viên đang theo học.
2. **Module Quản lý Học phí (`UC007`):**
   - Tự động sinh hóa đơn khi đăng ký lớp.
   - Thanh toán nhiều đợt và tự động cập nhật công nợ (`THANH_TOAN_MOT_PHAN` $\rightarrow$ `DA_HOAN_THANH`).
3. **Module Điểm danh & Kết quả (`UC008`, `UC009`):**
   - Điểm danh 4 trạng thái (`CO_MAT`, `VANG`, `DI_MUON`, `CO_PHEP`).
   - Tính điểm tổng kết theo công thức $20\% + 30\% + 50\%$.
   - Xét điều kiện ĐẠT: $\ge 50$ điểm tổng kết và $\ge 80\%$ chuyên cần.
4. **3 Chức Năng GenAI (`UC012`, `UC013`, `UC014`):**
   - Test trường hợp gợi ý lớp có trong CSDL vs không có trong CSDL (Chặn ảo giác).
   - Test sinh bài tập đúng 5 câu kèm đáp án và giải thích.
   - Test Timeout > 15s và kích hoạt Fallback Rule-based.
