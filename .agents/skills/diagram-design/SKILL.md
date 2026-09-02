---
name: diagram-design
description: Quy chuẩn, nguyên tắc và quy trình chuẩn để phân tích, thiết kế và vẽ các loại sơ đồ kỹ thuật (UML, ERD, Screen Flow, Kiến trúc triển khai) bằng Mermaid cho dự án ETC English Center.
---

# Diagram Design & Modeling Skill (Quy Chuẩn Thiết Kế Sơ Đồ)

## 1. Mục Đích & Phạm Vi
Skill này quy định phương pháp luận, nguyên tắc mô hình hóa, quy chuẩn kỹ thuật và quy trình từng bước để Agent thiết kế và vẽ các biểu đồ kỹ thuật (UML 2.5, Crow's Foot ERD, C4 Model, Flowchart) phục vụ tài liệu phân tích thiết kế của hệ thống **ETC English Center**.

---

## 2. Quy Chuẩn Kỹ Thuật & Nguyên Tắc Mô Hình Hóa

### 2.1 Biểu đồ Use Case (Use Case Diagram)
- **Tác nhân (Actor):** Phải là danh từ chỉ vai trò cụ thể (`Admin`, `Teacher`, `Student`, `Staff`), không dùng tên cá nhân. Đặt ngoài ranh giới hệ thống (`subgraph System`).
- **Use Case:** Đặt tên theo cấu trúc **[Động từ] + [Bổ ngữ/Đối tượng]** (Ví dụ: `Đăng ký lớp`, `Điểm danh buổi học`).
- **Quan hệ:**
  - `Association (Liên kết)`: Nối giữa Actor và Use Case.
  - `<<include>>`: Thể hiện luồng bắt buộc phải thực hiện kèm (Ví dụ: *Đăng ký lớp* `<<include>>` *Tạo hóa đơn*).
  - `<<extend>>`: Thể hiện luồng mở rộng có điều kiện (Ví dụ: *Tư vấn lớp* `<<extend>>` *Fallback AI*).
  - `Generalization`: Thừa kế vai trò hoặc Use case.

### 2.2 Biểu đồ Hoạt động (Activity Diagram)
- **Điểm bắt đầu & kết thúc:** Bắt buộc có nút Start `(( ))` và nút End `(( ))` rõ ràng.
- **Phân làn (Swimlanes):** Bắt buộc phân chia luồng xử lý theo các làn trách nhiệm: `Người dùng (UI)` và `Hệ thống Backend/DB`.
- **Nút rẽ nhánh (Decision Point):** Phải có điều kiện `[True]` / `[False]` hoặc `[Hợp lệ]` / `[Không hợp lệ]` trên từng nhánh ra.
- **Độ mịn:** Mỗi hoạt động biểu thị một hành động đơn nguyên (atomic action), không gộp nhiều bước phức tạp vào một node.

### 2.3 Biểu đồ Trình tự (Sequence Diagram)
- **Đối tượng tham gia (Lifelines):** Sắp xếp theo đúng kiến trúc phân tầng từ trái qua phải:
  `Actor` $\rightarrow$ `Frontend (UI)` $\rightarrow$ `Controller (API)` $\rightarrow$ `Service (Business Logic)` $\rightarrow$ `Database / External AI`.
- **Quy tắc thông điệp (Messages):**
  - Thông điệp đồng bộ (Sync Call): Dùng mũi tên nét liền `->>`.
  - Thông điệp phản hồi (Reply): Dùng mũi tên nét đứt `-->>`.
  - Kích hoạt (Activation): Thể hiện thời gian sống của hàm/xử lý.
  - Đánh số thứ tự: Luôn bật `autonumber`.
- **Khối điều kiện (Fragments):**
  - Dùng `alt ... else ... end` cho luồng thành công / thất bại.
  - Dùng `opt ... end` cho thao tác tùy chọn.
  - Dùng `loop ... end` cho các xử lý lặp lại (như duyệt danh sách học viên).

### 2.4 Biểu đồ Lớp (Class Diagram)
- **Cấu trúc mỗi Class:** Phải chia thành 3 phần rõ ràng: `Tên lớp`, `Thuộc tính (Attributes)`, `Phương thức (Methods)`.
- **Ký hiệu phạm vi truy cập (Visibility):**
  - `+` : Public
  - `-` : Private
  - `#` : Protected
- **Đặc tả kiểu dữ liệu:** Đầy đủ kiểu chuẩn (`Long`, `String`, `Date`, `Decimal`, `Boolean`, `Enum`).
- **Quan hệ & Bản số (Multiplicity):**
  - `Association (Liên kết)`: Nét liền `--` kèm bản số (`1`, `0..1`, `1..*`, `*`).
  - `Aggregation (Kết tập)`: `o--` (Mối quan hệ "has-a", đối tượng con tồn tại độc lập).
  - `Composition (Hợp thành)`: `*--` (Đối tượng con bị xóa khi đối tượng cha bị xóa).
  - `Inheritance (Thừa kế)`: `<|--`.

### 2.5 Biểu đồ Thực thể Quan hệ (ERD - Crow's Foot)
- **Chuẩn hóa:** Bắt buộc tuân thủ chuẩn 3NF (Third Normal Form).
- **Ràng buộc khóa:** Phải ghi rõ `PK` (Primary Key), `FK` (Foreign Key), `UK` (Unique Key).
- **Ký hiệu quan hệ Crow's Foot:**
  - `||--||` : Quan hệ 1 - 1 bắt buộc.
  - `||--o|` : Quan hệ 1 - 0..1 tùy chọn.
  - `||--o{` : Quan hệ 1 - Nhiều (0..N).
  - `||--|{` : Quan hệ 1 - Nhiều bắt buộc (1..N).

### 2.6 Biểu đồ Luồng Màn Hình (Screen Flow Diagram)
- Thể hiện rõ mã màn hình chuẩn (`SCR-AUTH-*`, `SCR-ADM-*`, `SCR-TEA-*`, `SCR-STU-*`, `SCR-STA-*`).
- Thể hiện hướng điều hướng bằng mũi tên có nhãn sự kiện (Click button, submit form, route guard).

### 2.7 Biểu đồ Triển khai (Deployment Diagram)
- Phân tách các tầng vật lý/logic: `Client Tier`, `Security Gateway / Reverse Proxy`, `Application Tier`, `Database Tier`, `External Services (Gemini API)`.
- Thể hiện rõ cổng kết nối (Port: 80, 443, 3000, 8000, 5432) và giao thức truyền tải (HTTPS, TCP, REST).

---

## 3. Quy Chuẩn Kỹ Thuật Mã Nguồn Mermaid

Để đảm bảo sơ đồ hiển thị mượt mà trên mọi trình xem Markdown, Agent bắt buộc tuân theo các quy tắc cú pháp sau:

1. **Tránh lỗi parse ký tự đặc biệt:** Mọi nhãn node chứa dấu ngoặc `()`, `[]`, dấu gạch chéo `/`, dấu cách hoặc ký tự tiếng Việt có dấu **phải được bọc trong dấu ngoặc kép `""`**.
   - *Đúng:* `Node1["Xác thực tài khoản (JWT)"]`
   - *Sai:* `Node1[Xác thực tài khoản (JWT)]`
2. **Hướng biểu đồ (Direction):**
   - Dùng `TD` (Top-Down) hoặc `TB` cho sơ đồ phân cấp, luồng xử lý theo trình tự thời gian.
   - Dùng `LR` (Left-to-Right) cho sơ đồ Use Case và luồng chuyển đổi trạng thái.
3. **Màu sắc & Định dạng (Styling):**
   - Sử dụng `classDef` để phân loại màu sắc giữa các đối tượng (Ví dụ: Phân biệt Actor người dùng, Backend Service, Database).
   - Đảm bảo độ tương phản cao, hỗ trợ tốt cả Light Theme và Dark Theme.

---

## 4. Quy Trình 5 Bước Thực Thi Khi Nhận Yêu Cầu Vẽ Sơ Đồ

```text
1. Xác định Loại Sơ đồ & Phạm vi (Scope & Type)
   ↓
2. Trích xuất Dữ kiện từ Source of Truth (Requirements, DB Schema, Class Spec)
   ↓
3. Áp dụng Luật & Ký hiệu Chuẩn (UML/ERD Rules & Multiplicity)
   ↓
4. Dựng Mã Mermaid & Kiểm tra Cú pháp (Syntax & Escape Characters)
   ↓
5. Đối soát Tính Truy vết (Traceability Check với Use Case / Design Baseline)
```

### Chi tiết từng bước:
- **Bước 1: Xác định loại sơ đồ:** Phân loại sơ đồ thuộc nhóm Hành vi (Use Case, Activity, Sequence) hay Cấu trúc (Class, ERD, Deployment).
- **Bước 2: Thu thập thực thể/thông điệp:** Đọc chính xác tài liệu thiết kế `EnglishCenterTOP.docx` để lấy tên bảng, tên cột, tên phương thức hoặc các bước nghiệp vụ. Tuyệt đối không tự bịa đặt tên thực thể mới.
- **Bước 3: Lập cấu trúc quan hệ:** Xác định đúng các quan hệ (1-1, 1-N, Include/Extend, Sync/Async Call).
- **Bước 4: Sinh mã Mermaid:** Viết code Mermaid tuân thủ mục 3.
- **Bước 5: Rà soát & Bàn giao:** Kiểm tra xem sơ đồ đã có đủ các tình huống ngoại lệ/rẽ nhánh (Alternative Flows, Fallbacks) theo yêu cầu hay chưa.
