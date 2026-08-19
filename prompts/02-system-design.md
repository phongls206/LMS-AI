# 02 — SYSTEM DESIGN

## Mục tiêu

Thiết kế hệ thống dựa trên:

- Requirement đã được xác nhận
- Use Case đã được xác nhận
- Business Rules đã được xác nhận

Không được tự ý thay đổi requirement.

---

# 1. INPUT

Đọc:

`AGENTS.md`

Sau đó đọc toàn bộ tài liệu trong:

`docs/requirements/`

Nếu `docs/requirements/` chưa có nội dung được xác nhận:

DỪNG LẠI và yêu cầu người dùng hoàn thành PHẦN 1.

---

# 2. DESIGN PRINCIPLE

Thiết kế theo chuỗi:

Requirement
→ Use Case
→ Activity
→ Sequence
→ Class
→ ERD
→ Database
→ API

Mỗi thành phần phải nhất quán với thành phần trước.

---

# 3. USE CASE DIAGRAM

Xác định:

- Actor
- Use Case
- Association
- Include
- Extend
- Generalization nếu thực sự cần

Xuất diagram bằng Mermaid hoặc PlantUML.

Không tự thêm Use Case.

---

# 4. ACTIVITY DIAGRAM

Thiết kế Activity Diagram cho các nghiệp vụ chính.

Ưu tiên các nghiệp vụ:

- Đăng nhập
- Đăng ký lớp
- Học phí
- Điểm danh
- AI tư vấn lớp
- AI sinh bài luyện tập
- AI tóm tắt tiến độ

Mỗi Activity phải bám Use Case tương ứng.

---

# 5. SEQUENCE DIAGRAM

Thiết kế Sequence Diagram cho các Use Case quan trọng.

Thể hiện nếu có:

Actor
→ Frontend
→ Backend/API
→ Database
→ AI Service
→ AI Model

Phải thể hiện:

- Request
- Processing
- Response
- Alternative Flow
- Error Flow nếu cần

---

# 6. CLASS DIAGRAM

Xác định:

- Class
- Attribute
- Method
- Relationship
- Cardinality

Phân biệt rõ:

- Entity
- Service
- Controller
- Repository nếu kiến trúc sử dụng chúng

Không tạo class không có căn cứ.

---

# 7. ERD

Thiết kế Entity Relationship Diagram.

Với mỗi Entity:

- Entity Name
- Primary Key
- Foreign Key
- Attributes
- Relationships
- Cardinality

Đảm bảo ERD phản ánh nghiệp vụ đã xác nhận.

---

# 8. DATABASE DESIGN

Chuyển ERD thành Database Schema.

Tạo bảng:

| Table | Column | Type | PK  | FK  | Nullable | Description |
| ----- | ------ | ---- | --- | --- | -------- | ----------- |

Kiểm tra:

- Primary Key
- Foreign Key
- Relationship
- Unique Constraint nếu có căn cứ
- Nullability
- Data integrity

Không tự tạo field chỉ để "cho đầy đủ".

---

# 9. API DESIGN

Thiết kế API dựa trên Use Case.

Bảng:

| Method | Endpoint | Actor | Input | Output | Auth |
| ------ | -------- | ----- | ----- | ------ | ---- |

Mỗi API phải truy ngược được về Use Case.

---

# 10. AI ARCHITECTURE

Thiết kế 3 AI feature.

## AI tư vấn lớp

User
→ Frontend
→ Backend
→ AI Service
→ AI Model
→ Validation
→ Response

## AI sinh bài luyện tập

User
→ Frontend
→ Backend
→ AI Service
→ AI Model
→ Validation
→ Response

## AI tóm tắt tiến độ

User
→ Frontend
→ Backend
→ AI Service
→ AI Model
→ Validation
→ Response

Xác định:

- Input
- Prompt
- Model
- Output
- Validation
- Error Handling
- Fallback

---

# 11. TRACEABILITY

Tạo bảng:

| Requirement | Use Case | Activity | Sequence | Class | ERD | API |
| ----------- | -------- | -------- | -------- | ----- | --- | --- |

Mục tiêu:

Không có requirement bị bỏ sót.

Không có thiết kế không có nguồn gốc.

---

# 12. CONSISTENCY REVIEW

Kiểm tra:

### UML

- Use Case ↔ Activity
- Activity ↔ Sequence
- Sequence ↔ Class

### Database

- Class ↔ ERD
- ERD ↔ Database

### API

- Use Case ↔ API

### AI

- Requirement ↔ AI Flow
- AI Flow ↔ API
- AI Input ↔ Database

---

# 13. OUTPUT

Lưu thiết kế đã được xác nhận trong:

`docs/design/`

Có thể tổ chức:

- use-case.md
- activity.md
- sequence.md
- class-diagram.md
- erd.md
- database.md
- api.md
- ai-architecture.md

---

# IMPORTANT

Không viết code.

Nếu phát hiện requirement hoặc design mâu thuẫn:

DỪNG LẠI.

Báo rõ:

- Thành phần bị mâu thuẫn
- Vấn đề
- Các phương án

Chờ người dùng quyết định.

Sau khi hoàn thành:

DỪNG LẠI để người dùng review.
