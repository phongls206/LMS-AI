# 04 — TESTING & QA

## Mục tiêu

Kiểm thử hệ thống dựa trên:

- Requirement
- Use Case
- Design
- Implementation

Không chỉ test code chạy được.

Phải kiểm tra hệ thống có đúng yêu cầu hay không.

---

# 1. PRE-CONDITION

Đọc:

`AGENTS.md`

Đọc:

`docs/requirements/`

Đọc:

`docs/design/`

Đọc implementation hiện tại.

---

# 2. TESTING LEVELS

Thực hiện khi phù hợp:

- Unit Test
- Integration Test
- API Test
- Functional Test
- Authorization Test
- Validation Test
- End-to-End Test
- AI Test

---

# 3. REQUIREMENT-BASED TESTING

Mỗi Functional Requirement quan trọng phải có test.

Tạo mapping:

| Requirement | Test Case | Expected Result | Status |
| ----------- | --------- | --------------- | ------ |

Không được chỉ test những case dễ.

---

# 4. REQUIRED TESTS

Theo đề tài, đặc biệt kiểm thử:

## Đăng ký lớp

Test:

- Đăng ký hợp lệ
- Dữ liệu không hợp lệ
- Đăng ký sai lớp
- Trường hợp không đủ điều kiện nếu requirement có quy định
- Permission

Không tự tạo business rule nếu tài liệu chưa xác định.

---

## Học phí

Test:

- Dữ liệu hợp lệ
- Dữ liệu không hợp lệ
- Tra cứu
- Permission
- Các trạng thái thanh toán nếu đã được thiết kế

---

## Điểm danh

Test:

- Điểm danh hợp lệ
- Dữ liệu không hợp lệ
- Permission
- Trường hợp bất thường

---

# 5. AI TESTING

Kiểm thử:

## AI tư vấn lớp

Input:

- Trình độ
- Lịch rảnh
- Danh sách lớp

Kiểm tra:

- AI chỉ gợi ý lớp có trong dữ liệu.
- Output có đúng format.
- Input không hợp lệ.
- Không có lớp phù hợp.
- AI trả output không hợp lệ.
- AI service lỗi.

---

## AI sinh bài luyện tập

Kiểm tra:

- Chủ đề
- Trình độ
- Output
- Format
- Nội dung không hợp lệ
- AI lỗi
- Output thiếu dữ liệu

---

## AI tóm tắt tiến độ

Kiểm tra:

- Có dữ liệu học tập
- Dữ liệu thiếu
- Dữ liệu không hợp lệ
- AI lỗi
- Output không hợp lệ

---

# 6. SECURITY TESTING

Kiểm tra:

- Authentication
- Authorization
- Role permission
- API access
- Input validation
- Không expose API key
- Không truy cập dữ liệu trái quyền

---

# 7. EDGE CASES

Tìm các trường hợp:

- Empty input
- Null
- Dữ liệu sai format
- Dữ liệu cực lớn
- Không có dữ liệu
- Request lặp
- API failure
- Database failure
- AI failure

---

# 8. BUG REPORT

Khi phát hiện bug:

| Bug ID | Feature | Steps | Expected | Actual | Severity | Status |
| ------ | ------- | ----- | -------- | ------ | -------- | ------ |

Phân loại:

- Critical
- High
- Medium
- Low

---

# 9. REGRESSION TEST

Sau khi sửa bug:

Kiểm tra lại:

- Feature đã sửa
- Feature liên quan
- Các API liên quan
- Các database operation liên quan

Không giả định rằng sửa một bug không ảnh hưởng phần khác.

---

# 10. FINAL QA REVIEW

Kiểm tra:

Requirement
→ Design
→ Implementation
→ Test

Đánh giá:

- Requirement Coverage
- Test Coverage
- Major Bugs
- Remaining Bugs
- AI Quality
- Security
- Stability

Cuối cùng tạo:

## QA SUMMARY

- Passed
- Failed
- Blocked
- Known Issues
- Recommendation

Không tự tuyên bố project "hoàn thành" nếu còn lỗi nghiêm trọng.
