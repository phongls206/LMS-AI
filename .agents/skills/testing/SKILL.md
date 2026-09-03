---
name: software-testing
description: Kiểm thử hệ thống đã hoàn thiện dựa trên tài liệu Word và source code, tạo test plan, test cases và test report.
---

# Software Testing Skill

## 1. Nguồn kiểm thử

Sử dụng:
- File Word tài liệu dự án: EnglishCenterTop.docx
- Source code đã hoàn thiện.
- API và Database nếu có.
- Requirements, Use Case, User Flow.

**File Word EnglishCenterTop.docx là nguồn chính để xác định chức năng cần kiểm thử.**  

Không tự bịa Requirement hoặc Use Case.

---

## 2. Quy trình

```text
Đọc tài liệu → Phân tích hệ thống → Test Plan → Test Cases → Chạy test → Test Report
```

Kết quả lưu tại:

```text
testing/
├── test-plan.md
├── test-cases.md
└── test-report.md
```

---

## 3. test-plan.md

Tự xây dựng kế hoạch kiểm thử dựa trên hệ thống thực tế:
- Phạm vi kiểm thử.
- Chức năng cần test.
- User roles.
- API.
- Database.
- User Flow.
- Rủi ro.
- Loại kiểm thử.

*Lưu ý:* Có thể tự đề xuất edge cases và test ideas, nhưng phải phân biệt rõ ràng với Requirement chính thức trong tài liệu.

---

## 4. test-cases.md

Lấy chức năng và Use Case từ file Word làm cơ sở.

Mỗi chức năng quan trọng cần bao phủ:
- Happy path.
- Invalid input.
- Empty input.
- Missing required fields.
- Boundary cases.
- Duplicate data.
- Permission.
- Error handling.

**Format bảng:**

| ID | Use Case | Test Case | Preconditions | Steps | Expected Result |
| :--- | :--- | :--- | :--- | :--- | :--- |
| TC_01 | ... | ... | ... | 1. ...<br>2. ... | ... |

---

## 5. Thực hiện Test

Kiểm tra hệ thống thực tế trên các tầng:
- Frontend
- Backend
- API
- Database
- Authentication
- Authorization
- Validation
- Business logic
- User Flow
- Error handling

> **Nguyên tắc:** Không đánh dấu `PASS` chỉ bằng cách đọc source code.

---

## 6. test-report.md

Ghi nhận kết quả kiểm thử thực tế.

**Format bảng:**

| ID | Test Case | Expected Result | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- |
| TC_01 | ... | ... | ... | PASS / FAIL / BLOCKED / NOT TESTED |

**Trạng thái hợp lệ:**
- `PASS`
- `FAIL`
- `BLOCKED`
- `NOT TESTED`

**Thống kê cuối report:**
```text
Total: ...
PASS: ...
FAIL: ...
BLOCKED: ...
NOT TESTED: ...
```

---

## 7. Bug Report

Ghi nhận chi tiết khi test case có trạng thái `FAIL`:
- **Bug ID**
- **Test Case liên quan**
- **Mô tả ngắn gọn**
- **Steps to reproduce**
- **Expected Result**
- **Actual Result**
- **Severity:** `Critical` | `High` | `Medium` | `Low`
- **Evidence:** Log, ảnh chụp màn hình, payload API (nếu có)

> Chỉ báo cáo lỗi khi có bằng chứng xác thực hoặc có thể tái hiện 100%.

---

## 8. Nguyên tắc cốt lõi

- **Word:** Xác định phạm vi và đối tượng cần test.
- **AI:** Xây dựng kịch bản kiểm thử + bổ sung edge cases logic.
- **Source code / App thực tế:** Xác nhận luồng chạy và hành vi hệ thống.
- **Test Report:** Ghi nhận trung thực kết quả thực tế.

**Quy tắc cấm:**
- Không bịa Requirement / Use Case ngoài tài liệu.
- Không gắn nhãn `PASS` khi chưa chạy kiểm thử thực tế.
- Không gắn nhãn `FAIL` khi thiếu bằng chứng hoặc không tái hiện được.
- Không tự ý điền trước kết quả vào Test Report khi chưa thực thi.

---

## 9. Output

Cấu trúc thư mục bàn giao chuẩn:

```text
testing/
├── test-plan.md
├── test-cases.md
└── test-report.md
```