# 01 — REQUIREMENT ANALYSIS

## Mục tiêu

Thực hiện toàn bộ giai đoạn:

KHẢO SÁT VÀ PHÂN TÍCH YÊU CẦU

cho hệ thống:

"Hệ thống quản lý trung tâm ngoại ngữ có tích hợp AI"

---

# 1. SOURCE

Đọc:

`de_tai_42(1).md`

Đây là tài liệu yêu cầu chính thức.

Không được tự ý bổ sung requirement ngoài tài liệu.

Nếu có suy luận cần thiết, phải đánh dấu:

[SUY LUẬN]

Nếu thông tin chưa rõ:

[CẦN XÁC NHẬN]

---

# 2. KHẢO SÁT BÀI TOÁN

Phân tích:

- Bối cảnh
- Vấn đề cần giải quyết
- Mục tiêu hệ thống
- Đối tượng sử dụng
- Phạm vi hệ thống

Phân biệt:

## In Scope

Những gì hệ thống phải thực hiện.

## Out of Scope

Những gì tài liệu không yêu cầu.

Không tự ý thêm chức năng vào In Scope.

---

# 3. ACTOR ANALYSIS

Xác định toàn bộ Actor từ tài liệu.

Với mỗi Actor:

- Actor ID
- Tên
- Vai trò
- Mục đích sử dụng
- Các chức năng có thể thực hiện

Các role được đề cập trong tài liệu gồm:

- Quản lý
- Giáo viên
- Học viên
- Tư vấn viên

Không tự thêm actor nếu chưa có căn cứ.

---

# 4. FUNCTIONAL REQUIREMENTS

Phân tích toàn bộ Functional Requirements.

Tạo bảng:

| ID  | Requirement | Actor | Description | Priority | Source |
| --- | ----------- | ----- | ----------- | -------- | ------ |

Đảm bảo bao phủ:

- Đăng nhập
- Phân quyền
- Quản lý học viên
- Hồ sơ trình độ
- Khóa học
- Lớp học
- Lịch học
- Giáo viên
- Phân công lớp
- Đăng ký học
- Học phí
- Điểm danh
- Kết quả học tập
- Tra cứu
- Thống kê
- AI

---

# 5. NON-FUNCTIONAL REQUIREMENTS

Phân tích những NFR thực sự có căn cứ trong tài liệu.

Các nhóm cần kiểm tra:

- Security
- Performance
- Reliability
- Usability
- Maintainability
- Scalability

Nếu tài liệu không cung cấp thông tin cụ thể:

[CẦN XÁC NHẬN]

Không tự đặt ra con số hoặc tiêu chuẩn kỹ thuật.

---

# 6. USE CASE LIST

Tạo danh sách Use Case:

| ID  | Use Case | Actor | Description |
| --- | -------- | ----- | ----------- |

Mỗi Functional Requirement quan trọng phải có Use Case tương ứng.

---

# 7. USE CASE SPECIFICATION

Với từng Use Case quan trọng:

- Use Case ID
- Name
- Actor
- Goal
- Preconditions
- Main Flow
- Alternative Flow
- Exception Flow
- Postconditions
- Business Rules

Không tạo flow không có căn cứ.

Nếu cần giả định:

[CẦN XÁC NHẬN]

---

# 8. BUSINESS RULES

Xác định các business rule có trong tài liệu.

Ví dụ cấu trúc:

| Rule ID | Rule | Related Requirement |
| ------- | ---- | ------------------- |

Không tự tạo business rule chỉ để làm hệ thống "có vẻ đầy đủ".

---

# 9. AI REQUIREMENT ANALYSIS

Phân tích riêng 3 chức năng AI.

## 9.1 AI TƯ VẤN LỚP

Phân tích:

Input
→ Processing
→ Output

Tài liệu cho biết input gồm:

- Trình độ
- Lịch rảnh
- Khóa học
- Dữ liệu lớp

Xác định những gì tài liệu thực sự hỗ trợ.

---

## 9.2 AI SINH BÀI LUYỆN TẬP

Phân tích:

Input
→ Processing
→ Output

Bao gồm:

- Chủ đề
- Trình độ
- Nội dung bài luyện tập
- Kết quả

Không tự thêm loại bài nếu chưa được xác định.

---

## 9.3 AI TÓM TẮT TIẾN ĐỘ

Phân tích:

Input
→ Processing
→ Output

Dựa trên dữ liệu học tập được tài liệu cung cấp.

---

# 10. INPUT / OUTPUT

Xác định dữ liệu:

## System Input

## System Output

## AI Input

## AI Output

Đặc biệt đối chiếu với dữ liệu được nêu trong tài liệu.

---

# 11. REQUIREMENT TRACEABILITY

Tạo mapping:

Requirement
→ Actor
→ Use Case
→ Module

Mục tiêu là đảm bảo không có requirement bị bỏ quên.

---

# 12. REQUIREMENT GAP

Liệt kê:

- Thông tin còn thiếu
- Business rule chưa rõ
- Actor chưa rõ
- Input chưa rõ
- Output chưa rõ
- Permission chưa rõ
- AI behavior chưa rõ

Tất cả phải đánh dấu:

[CẦN XÁC NHẬN]

---

# 13. FINAL REVIEW

Tự kiểm tra:

1. Có bỏ sót requirement không?
2. Có actor nào bị bỏ sót không?
3. Có Use Case nào không có requirement không?
4. Có requirement nào không có Use Case không?
5. Có business rule nào tự bịa không?
6. Có AI feature nào tự bịa không?
7. Có thông tin nào cần xác nhận không?

---

# IMPORTANT

CHỈ thực hiện PHẦN 1.

KHÔNG:

- Vẽ UML
- Thiết kế ERD
- Thiết kế database
- Thiết kế API
- Viết code

Sau khi hoàn thành:

DỪNG LẠI.

Chờ người dùng review và xác nhận.
