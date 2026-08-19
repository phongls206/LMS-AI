# 03 — DEVELOPMENT

## Mục tiêu

Implement hệ thống dựa trên:

- Requirement đã xác nhận
- Design đã xác nhận

Không tự thiết kế lại hệ thống trong lúc code.

---

# 1. PRE-CONDITION

Trước khi code:

Đọc:

`AGENTS.md`

Đọc:

`docs/requirements/`

Đọc:

`docs/design/`

Nếu requirement hoặc design chưa được xác nhận:

DỪNG LẠI.

---

# 2. DEVELOPMENT WORKFLOW

Không implement toàn bộ project một lần.

Chia thành từng Feature.

Workflow:

ANALYZE
→ PLAN
→ IMPLEMENT
→ TEST
→ REVIEW

Sau mỗi Feature phải báo cáo kết quả.

---

# 3. FEATURE ORDER

Ưu tiên:

1. Project Setup
2. Database
3. Authentication
4. Authorization
5. Học viên
6. Giáo viên
7. Khóa học
8. Lớp học
9. Lịch học
10. Đăng ký học
11. Học phí
12. Điểm danh
13. Kết quả học tập
14. Thống kê
15. AI tư vấn lớp
16. AI sinh bài luyện tập
17. AI tóm tắt tiến độ

Không bắt buộc giữ nguyên thứ tự nếu dependency của project yêu cầu khác.

Nếu thay đổi thứ tự:

Giải thích lý do.

---

# 4. BEFORE IMPLEMENTATION

Với mỗi Feature:

Xác định:

- Requirement liên quan
- Use Case liên quan
- Database table liên quan
- API liên quan
- Frontend screen liên quan
- Backend service liên quan
- Test case liên quan

Sau đó xác định:

Files to create
Files to modify

---

# 5. BACKEND

Khi implement Backend:

- Models
- Database access
- Business Logic
- Services
- Controllers / Routes
- Authentication
- Authorization
- Validation
- Error Handling

Phải bám architecture đã thiết kế.

---

# 6. FRONTEND

Khi implement Frontend:

- Pages
- Components
- Forms
- API integration
- Loading state
- Error state
- Empty state
- Validation
- Authentication state

Không tạo UI không có requirement.

---

# 7. AI FEATURES

Với mỗi AI feature:

## Step 1

Validate input.

## Step 2

Chuẩn bị dữ liệu.

## Step 3

Gửi request tới AI Service.

## Step 4

Validate AI output.

## Step 5

Xử lý output không hợp lệ.

## Step 6

Trả response cho frontend.

Không expose API key ở frontend.

---

# 8. CODE QUALITY

Code phải:

- Dễ đọc
- Có cấu trúc
- Có naming rõ ràng
- Không duplicate logic không cần thiết
- Không abstraction quá mức
- Không over-engineering

---

# 9. CHANGE RULE

Nếu phát hiện implementation cần thay đổi:

- Requirement
- Database
- API
- UML
- Architecture

Không tự ý thay đổi.

Báo người dùng trước.

---

# 10. TEST

Sau mỗi Feature:

- Test happy path
- Test invalid input
- Test edge case
- Test authorization nếu liên quan
- Test API nếu có
- Test AI nếu liên quan

---

# 11. FEATURE REPORT

Sau mỗi Feature báo:

## Completed

## Files Created

## Files Modified

## Tests

## Problems

## Remaining Work

Sau đó DỪNG LẠI.

Chờ Feature tiếp theo.
