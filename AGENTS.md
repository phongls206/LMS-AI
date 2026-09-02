# AGENTS.MD - ETC ENGLISH PROJECT RULES

## 1. Project Overview

- **Project Name:** ETC ENGLISH
- **System Type:** Hệ thống quản lý trung tâm ngoại ngữ có tích hợp AI
- **Core Features:**
  - Quản lý học viên, giáo viên, khóa học và lớp học.
  - Quản lý lịch học, đăng ký, học phí và điểm danh.
  - Quản lý kết quả học tập.
  - Tra cứu và thống kê báo cáo.
  - Authentication và phân quyền (RBAC).
  - Tích hợp AI: Tư vấn lớp học, sinh bài luyện tập, tóm tắt tiến độ học tập.

---

## 2. Source of Truth & Precedence

1. **Primary Spec (Implementation Baseline):** `docs/design/EnglishCenterTOP.docx`
   - Mọi thiết kế, database schema, API và logic code bắt buộc bám sát tài liệu này.
   - Tuyệt đối không tự ý bịa đặt, suy diễn hoặc thay đổi requirement/design.
2. **Original Requirement:** `de_tai_42.md` (Đề tài gốc từ giảng viên - tham chiếu khi cần đối soát).

---

## 3. Traceability Pipeline

Mọi chức năng khi triển khai phải đảm bảo tính liên kết xuyên suốt theo chuỗi:

```text
Requirement → Use Case → Business Rules → Design → Database / API → Code → Test
```

---

## 4. Skills & Execution Protocol

Khi thực thi các tác vụ chuyên môn, Agent bắt buộc phải tuân thủ và kích hoạt Skill tương ứng tại thư mục `.agents/skills/`:

| Tác vụ                        | Skill áp dụng           |
| ----------------------------- | ----------------------- |
| Xây dựng ngữ cảnh / Khởi tạo  | `context-builder`       |
| Phân tích nghiệp vụ           | `requirements-analysis` |
| Thiết kế kiến trúc            | `architecture-design`   |
| Thiết kế CSDL                 | `database-design`       |
| Thiết kế giao diện API        | `api-design`            |
| Tích hợp / Prompt Engineering | `ai-design`             |
| Lập trình / Viết mã           | `implementation`        |
| Viết và chạy kiểm thử         | `testing`               |
| Rà soát chất lượng code       | `code-review`           |
| Rà soát bảo mật               | `security-review`       |
| Soạn thảo tài liệu            | `documentation`         |
| Thiết kế & vẽ sơ đồ (UML/ERD) | `diagram-design`        |

> **Nguyên tắc phân định:** `AGENTS.md` quy định nguyên tắc tổng quan của hệ thống. `SKILL.md` (hoặc file cấu hình skill cụ thể) quy định quy trình chi tiết từng bước. Không lặp lại chi tiết triển khai của Skill vào file này.

---

## 5. Engineering & Security Guardrails

- **Pre-execution Check:** Luôn đọc và kiểm tra tài liệu requirement/design liên quan trước khi sinh code.
- **Scope Restriction:** Không tự ý thay đổi kiến trúc hệ thống, schema database hoặc API contracts đã chốt.
- **Backend Authority:** Toàn bộ business logic trọng yếu, validation và authorization bắt buộc phải xử lý tại Backend.
- **Security First:** Không hardcode API key, connection string, password hay bất kỳ credential/secret nào vào source code. Sử dụng biến môi trường (`.env` / `appsettings.json` local).
- **KISS & Clean Code:** Không thêm thư viện, công nghệ hoặc pattern phức tạp ngoài phạm vi; ưu tiên code đơn giản, rõ ràng, dễ bảo trì.

---

## 6. Change & Conflict Management

### Quy trình thay đổi Requirement

```text
Requirement Change → Impact Analysis → Update Design → Implementation → Testing → Documentation
```

### Xử lý sai lệch (Design vs Code Mismatch)

1. Xác định chính xác nguyên nhân gây sai lệch.
2. Báo cáo cụ thể các điểm khác biệt.
3. Tuyệt đối không tự ý coi code hiện tại là requirement mới để hợp thức hóa sai sót.

---

## 7. Communication & Decision Rules

- **Task nhỏ, design rõ:** Triển khai trực tiếp theo tài liệu.
- **Thay đổi lớn / Nghi ngờ xung đột:** Dừng lại phân tích impact và thông báo rõ ràng trước khi sửa code.
- **Minh bạch:** Nêu rõ các assumption (giả định kỹ thuật nếu có), không che giấu lỗi, không tự bịa logic khi thiếu dữ kiện.

---

## CORE PRINCIPLE

> **Đúng Requirement → Đúng Design → Đúng Code → Đúng Test**
