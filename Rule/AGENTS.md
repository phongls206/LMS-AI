# AGENTS.md

# PROJECT: HỆ THỐNG QUẢN LÝ TRUNG TÂM NGOẠI NGỮ CÓ TÍCH HỢP AI

## 1. PROJECT OVERVIEW

Đây là dự án xây dựng:

"Hệ thống quản lý trung tâm ngoại ngữ có tích hợp AI"

Hệ thống phục vụ việc quản lý:

- Học viên
- Hồ sơ trình độ
- Khóa học
- Lớp học
- Giáo viên
- Phân công lớp
- Lịch học
- Đăng ký học
- Học phí
- Điểm danh
- Kết quả học tập
- Thống kê

Hệ thống tích hợp AI cho:

- Tư vấn lớp phù hợp
- Sinh bài luyện tập ngắn
- Tóm tắt tiến độ học tập

---

# 2. SOURCE OF TRUTH

File đề tài chính thức:

`de_tai_42.md`

Đây là nguồn yêu cầu gốc của project.

AI phải đọc và bám sát file này trước khi:

- Phân tích requirement
- Thiết kế hệ thống
- Thiết kế database
- Thiết kế API
- Viết code
- Viết test

Không được tự ý thay đổi hoặc mở rộng phạm vi dự án nếu chưa được người dùng xác nhận.

---

# 3. CORE RULES

## Rule 1 — Không tự bịa nghiệp vụ

Nếu thông tin không có trong tài liệu hoặc chưa được người dùng xác nhận:

Không được tự coi đó là requirement chính thức.

Phải đánh dấu:

[CẦN XÁC NHẬN]

hoặc hỏi người dùng.

---

## Rule 2 — Không tự ý mở rộng phạm vi

Không tự thêm:

- Chức năng
- Actor
- Entity
- Business Rule
- API
- Database table
- AI feature

nếu không có căn cứ.

Nếu có đề xuất mở rộng, phải tách riêng thành:

[ĐỀ XUẤT]

và không được coi đó là requirement chính thức.

---

## Rule 3 — Requirement là nền tảng

Mọi thiết kế và code phải truy ngược được về requirement.

Chuỗi bắt buộc:

Requirement
→ Use Case
→ Activity
→ Sequence
→ Class
→ ERD
→ Database
→ API
→ Code
→ Test

Nếu một thành phần không có căn cứ từ thành phần trước đó, phải báo cho người dùng.

---

# 4. DEVELOPMENT WORKFLOW

Project được thực hiện theo 3 giai đoạn chính:

## PHẦN 1 — KHẢO SÁT VÀ PHÂN TÍCH YÊU CẦU

Bao gồm:

- Khảo sát bài toán
- Xác định phạm vi
- Xác định Actor
- Functional Requirements
- Non-functional Requirements
- Use Case
- Business Rules
- Phân tích AI
- Requirement Traceability
- Xác định các điểm chưa rõ

Không được code trong giai đoạn này.

---

## PHẦN 2 — THIẾT KẾ HỆ THỐNG

Bao gồm:

- Use Case Diagram
- Activity Diagram
- Sequence Diagram
- Class Diagram
- ERD
- Database Design
- API Design
- AI Architecture

Không được code khi thiết kế chưa được xác nhận.

---

## PHẦN 3 — DEVELOPMENT & TESTING

Bao gồm:

- Backend
- Frontend
- Database implementation
- Authentication
- Authorization
- Business Logic
- AI Integration
- Validation
- Error Handling
- Testing
- Bug Fixing

---

# 5. CONFIRMATION RULE

Không được tự động chuyển sang giai đoạn tiếp theo.

Sau khi hoàn thành:

PHẦN 1

phải dừng lại để người dùng review.

Chỉ chuyển sang PHẦN 2 khi người dùng xác nhận.

Sau khi hoàn thành:

PHẦN 2

phải dừng lại để người dùng review.

Chỉ chuyển sang PHẦN 3 khi người dùng xác nhận.

---

# 6. CODING RULES

Khi được yêu cầu code:

1. Đọc requirement liên quan.
2. Đọc design liên quan.
3. Kiểm tra cấu trúc project hiện tại.
4. Xác định file cần tạo/sửa.
5. Giải thích ngắn thay đổi.
6. Implement.
7. Kiểm tra lỗi.
8. Viết hoặc cập nhật test.
9. Review ảnh hưởng tới các module khác.

Không tự ý refactor toàn bộ project nếu task không yêu cầu.

Không sửa những file không liên quan nếu không cần thiết.

---

# 7. AI FEATURE RULES

Các chức năng AI gồm:

1. AI tư vấn lớp phù hợp
2. AI sinh bài luyện tập ngắn
3. AI tóm tắt tiến độ học tập

Mỗi AI feature phải xác định:

- Input
- Processing
- Prompt
- Model
- Output
- Validation
- Error Handling
- Fallback
- Test Cases

Không được giả định AI luôn trả về kết quả chính xác.

Output của AI phải được kiểm tra trước khi trả về hệ thống.

---

# 8. TESTING RULES

Các chức năng bắt buộc phải có test theo đề tài:

- Đăng ký lớp
- Học phí
- Điểm danh
- AI

Ngoài ra phải xem xét:

- Unit Test
- Integration Test
- API Test
- Functional Test
- Validation Test
- Authorization Test
- Edge Case Test
- AI Test

---

# 9. COMMUNICATION RULE

Khi không chắc chắn:

Không đoán.

Hãy nói rõ:

"Thông tin này chưa được xác định trong tài liệu."

Sau đó đưa ra câu hỏi hoặc các phương án để người dùng quyết định.

---

# 10. OUTPUT RULE

Khi phân tích:

- Có cấu trúc rõ ràng.
- Có ID cho requirement/use case nếu phù hợp.
- Có bảng khi cần.
- Không viết lan man.

Khi code:

- Code rõ ràng.
- Ngắn gọn.
- Dễ hiểu.
- Phù hợp cấu trúc project.

---

# 11. FINAL PRINCIPLE

Không ưu tiên việc "làm thật nhiều".

Ưu tiên:

ĐÚNG REQUIREMENT
→ ĐÚNG DESIGN
→ ĐÚNG CODE
→ ĐÚNG TEST

Nếu phát hiện mâu thuẫn giữa các tài liệu hoặc thành phần:

DỪNG LẠI
→ BÁO MÂU THUẪN
→ CHỜ NGƯỜI DÙNG XÁC NHẬN.
