---
name: figma-design
description: Quy chuẩn thiết kế giao diện UI/UX trên Figma, Design System chuẩn Dark Theme, cấu trúc Component và các phương pháp vẽ Mockup/Wireframe chất lượng cao cho dự án ETC English Center.
---

# Figma Design & UI/UX Skill (Quy Chuẩn Thiết Kế Giao Diện Figma)

## 1. Mục Đích & Phạm Vi
Skill này quy định phương pháp luận thiết kế, hệ thống Design System (Design Tokens), quy chuẩn bố cục thành phần (Components & Layouts) và quy trình chuẩn từng bước để thiết kế các bản vẽ giao diện (Wireframe, High-Fidelity Mockup, UI Prototype) trên Figma cho dự án **ETC English Center**.

Tài liệu này đóng vai trò là kim chỉ nam đảm bảo tính thẩm mỹ cao cấp (Rich Aesthetics), sự đồng bộ trải nghiệm người dùng (UX) và tính tương thích 1:1 giữa bản thiết kế đồ họa với mã nguồn Frontend (Next.js + TailwindCSS).

---

## 2. Hệ Thống Design System Cốt Lõi (Design Tokens)

Mọi bản thiết kế trên Figma cho hệ thống ETC English Center bắt buộc phải tuân thủ bảng mã màu và quy chuẩn Typography sau:

### 2.1 Bảng Màu Chuẩn (Color Palette - Modern Sleek Dark Theme)

| Phân Loại | Mã HEX | Mã HSL / Tailwind | Mục Đích Sử Dụng |
| :--- | :--- | :--- | :--- |
| **Canvas Background** | `#020617` | `slate-950` | Nền chính của toàn bộ trang web. |
| **Card / Panel Surface** | `#0F172A` | `slate-900` | Nền của các thẻ Card, Khung chứa dữ liệu, Sidebar. |
| **Card Border / Divider** | `#1E293B` | `slate-800` | Đường viền ngăn cách card, hàng bảng dữ liệu. |
| **Primary Accent (Chính)** | `#6366F1` | `indigo-500` | Nút bấm chính (CTA), menu đang kích hoạt, điểm nhấn thương hiệu. |
| **Primary Light / Glow** | `#818CF8` | `indigo-400` | Text tiêu đề nhấn, icon nổi bật, hiệu ứng hover. |
| **Success / Passed (Đạt)** | `#10B981` | `emerald-500` | Thẻ trạng thái Đạt, Đã thanh toán, Có mặt, Doanh thu. |
| **Warning / Pending (Chờ)**| `#F59E0B` | `amber-500` | Thẻ Đi muộn, Đang học giữa khóa, Đang xử lý, Chờ duyệt. |
| **Danger / Failed (Không đạt)**| `#F43F5E` | `rose-500` | Thẻ Vắng, Không đạt, Lớp full 100% sĩ số, Nút Hủy. |
| **AI Feature Accent (AI)** | `#8B5CF6` | `purple-500` | Các tính năng GenAI (Tư vấn, Sinh đề, Tóm tắt tiến độ). |
| **Text Primary** | `#FFFFFF` / `#F8FAFC` | `white` / `slate-50` | Tiêu đề chính, số liệu thống kê nổi bật. |
| **Text Secondary** | `#94A3B8` | `slate-400` | Nhãn mô tả, tiêu đề cột bảng, thông tin phụ. |

### 2.2 Quy Chuẩn Typography (Phông Chữ & Cỡ Chữ)
* **Font Family:** `Inter`, `Plus Jakarta Sans` hoặc `Roboto` (Sans-serif hiện đại).
* **Thang Cỡ Chữ (Type Scale):**
  * `Display / Big Stat`: 28px – 32px (Bold / Extra Bold - 700/800) $\rightarrow$ Dùng cho số liệu KPI, Doanh thu.
  * `Page Title (H1)`: 20px – 24px (Bold - 700) $\rightarrow$ Dùng cho tiêu đề trang.
  * `Card Title (H2)`: 16px – 18px (Semi-Bold - 600) $\rightarrow$ Dùng cho tiêu đề thẻ.
  * `Body Text`: 13px – 14px (Regular / Medium - 400/500) $\rightarrow$ Dùng cho nội dung bảng, mô tả.
  * `Caption / Badge`: 11px – 12px (Semi-Bold / Bold - 600/700) $\rightarrow$ Dùng cho thẻ trạng thái, nhãn thời gian.

### 2.3 Hệ Thống Lưới & Khoảng Cách (Grid & 8pt Spacing Rule)
* **Kích thước Frame chuẩn Desktop:** `1440 x 900 px` hoặc `1920 x 1080 px`.
* **Grid:** 12-Column Grid (Margin `24px` hoặc `32px`, Gutter `16px` hoặc `24px`).
* **Bo góc (Border Radius):**
  * Card lớn / Modal: `16px` (`rounded-2xl`).
  * Nút bấm / Ô nhập liệu / Card nhỏ: `10px` – `12px` (`rounded-xl`).
  * Chip / Tag trạng thái: `9999px` (`rounded-full`) hoặc `8px` (`rounded-lg`).

---

## 3. Thư Viện Thành Phần Chuẩn (Atomic Component Specifications)

Mỗi màn hình được cấu thành từ 6 khối thành phần chuẩn:

```text
┌─────────────────────────────────────────────────────────────────────────┐
│ 1. TOP HEADER (Breadcrumbs | AI Indicator | User Profile Dropdown)     │
├───────────────┬─────────────────────────────────────────────────────────┤
│               │ 3. KPI METRIC CARDS (4 Thẻ thống kê nhanh trên cùng)     │
│               ├─────────────────────────────────────────────────────────┤
│ 2. SIDEBAR    │ 4. TOOLBAR & FILTER (Search Bar | Filter CEFR | Button) │
│ NAVIGATION    ├─────────────────────────────────────────────────────────┤
│ (Logo, Menus, │ 5. DATA TABLE / VISUAL CARDS (Danh sách dữ liệu)        │
│ Role Badge,   │    - Cột thông tin, Chip Trạng thái, Thanh tiến độ      │
│ Logout)       ├─────────────────────────────────────────────────────────┤
│               │ 6. AI INTERACTIVE PANEL (Hộp thoại tư vấn / Kết quả AI) │
└───────────────┴─────────────────────────────────────────────────────────┘
```

### 3.1 Sidebar Navigation (Thanh điều hướng bên trái)
* **Chiều rộng cố định:** `260px` – `280px`.
* **Phần đầu:** Logo ETC English Center + Slogan.
* **Phần thân:** Menu items kèm icon vector Lucide. Mục đang chọn có nền `bg-indigo-600/20` và vạch sáng bên mép.
* **Phần chân:** Thẻ thông tin cá nhân (Avatar, Tên đăng nhập, Badge Vai trò: `Admin` / `Teacher` / `Student` / `Staff`) và nút Đăng xuất.

### 3.2 Metric Summary Card (Thẻ thống kê KPI)
* Bố cục Auto Layout gồm 2 cột:
  * Cột trái: Giá trị số liệu nổi bật (`28px`), nhãn định danh (`13px`, Slate-400), nhãn tăng trưởng nhỏ (`11px`).
  * Cột phải: Khung icon hình vuông bo góc (`44x44px`), nền màu nhấn trong suốt (`bg-indigo-500/10`).

### 3.3 Data Table (Bảng dữ liệu thông minh)
* **Header:** Nền `bg-slate-900/90`, chữ in hoa cỡ nhỏ `11px`, màu `slate-400`, căn thẳng hàng.
* **Row:** Chiều cao hàng tối thiểu `56px`, có hiệu ứng hover `bg-slate-800/40`, đường viền đáy `border-b border-slate-800/60`.
* **Cột Trạng thái:** Hiển thị dưới dạng Chip / Badge có chấm tròn phát sáng (Ví dụ: `🟢 Đang học`, `🔴 Vắng mặt`, `🟡 Chờ thi`).

### 3.4 AI Glowing Card (Khung hiển thị chức năng GenAI)
* Viền phát sáng gradient: `border border-indigo-500/30` kèm hiệu ứng shadow tím xanh.
* Header luôn có biểu tượng ngôi sao lấp lánh `Sparkles` và nhãn `Powered by Gemini GenAI`.
* Nội dung kết quả phân tích hiển thị dạng Bullet points rõ ràng, có căn cứ số liệu minh bạch.

---

## 4. Các Phương Pháp Vẽ Giao Diện Tốt Nhất (Best Practices)

Để tạo ra bản vẽ Figma xuất sắc và tiết kiệm thời gian nhất cho đề tài:

### 🌟 Phương Pháp 1: "Master Frame + Reusable Components" (Khuyên dùng khi vẽ trên Figma)
1. **Bước 1: Tạo Master App Layout:** Vẽ 1 Frame nền Desktop (`1440x900`), kéo sẵn Sidebar và Topbar. Khóa (Lock) 2 layer này lại làm khung mẫu.
2. **Bước 2: Tạo Component Sheet:** Thiết kế riêng các nút (Button Primary/Secondary), Ô tìm kiếm (Input), Tag trạng thái (Status Badge) thành Master Components.
3. **Bước 3: Lắp ráp từng màn hình:** Nhân bản (Duplicate) Master Layout và thay thế phần nội dung chính giữa (Body) tương ứng với từng chức năng.
4. **Bước 4: Điền dữ liệu thực tế (Realistic Data):** Luôn dùng dữ liệu thật từ hệ thống (Mã lớp `IELTS-B1-01`, Tên học viên `Lê Thị Hoa`, Sĩ số `25/25 HV`, Điểm `87.75đ`), tuyệt đối không dùng chữ giữ chỗ `Lorem Ipsum`.

### 🌟 Phương Pháp 2: "Code-Aligned Mockup Frame" (Tận dụng giao diện Web thực tế)
1. Mở trang Web chạy thực tế tại `http://localhost:3000` ở độ phân giải chuẩn (`1440 x 900`).
2. Chụp toàn màn hình (Full Screenshot).
3. Đưa vào Figma, đặt vào một Frame có mockup viền cửa sổ trình duyệt (Browser Header với 3 nút đỏ/vàng/xanh và thanh URL `https://etc-english.edu.vn/admin/dashboard`).
4. Thêm các ghi chú mũi tên (Callout Annotations) chỉ rõ các vùng chức năng để chèn vào báo cáo.

---

## 5. Danh Mục 8 Màn Hình Cốt Lõi Cần Có Trong Báo Cáo

Bản thiết kế giao diện của đề tài bắt buộc phải có đầy đủ 8 màn hình tương ứng với 4 vai trò:

| STT | Tên Màn Hình | Vai Trò (Actor) | Thành Phần Trọng Tâm Bắt Buộc |
| :---: | :--- | :--- | :--- |
| **1** | **Màn hình Đăng nhập (Login)** | Toàn bộ 4 vai trò | Form đăng nhập bảo mật, chuyển đổi vai trò, thông báo lỗi. |
| **2** | **Admin Dashboard Tổng quan** | Quản lý (Admin) | 4 Thẻ KPI, Thanh tiến độ sĩ số (Lớp full 25/25), Biểu đồ % Đạt đầu ra. |
| **3** | **Quản lý Danh sách Lớp học** | Admin & Tư vấn viên | Bảng lớp, phân công GV, trạng thái mở đăng ký / đang học. |
| **4** | **Quản lý Đội ngũ Giảng viên** | Quản lý (Admin) | Danh sách 10 Giảng viên, Mã GV, Tài khoản login, Bằng cấp/Chứng chỉ. |
| **5** | **Quản lý Hồ sơ 54 Học viên** | Admin & Tư vấn viên | Bộ lọc CEFR A1-C1, Trạng thái Đang học/Bảo lưu, Lịch rảnh. |
| **6** | **Điểm danh Buổi học (Attendance)**| Giáo viên (Teacher) | Danh sách học viên lớp, 3 nút Có mặt / Đi muộn / Vắng, Ghi chú. |
| **7** | **Quản lý Bảng điểm (Gradebook)**| Giáo viên & Quản lý | Bảng điểm 3 cột (20% Chuyên cần, 30% Giữa kỳ, 50% Cuối kỳ), Xếp loại. |
| **8** | **Module AI Tóm tắt & Tư vấn** | Học viên & Quản lý | Chatbot tư vấn lớp theo CEFR, Thẻ tóm tắt tiến độ học tập đa giai đoạn. |

---

## 6. Quy Chuẩn Xuất Ảnh & Đóng Gói Vào Báo Cáo (Academic Standard)

* **Định dạng:** Xuất ảnh định dạng **PNG @2x** (độ phân giải cao, chữ sắc nét, không bị vỡ khi in ấn).
* **Đánh số thứ tự trong Word:** Đặt tại **Mục 6.4 (Chương 6)** theo cú pháp:
  * `Hình 6.1: Bản vẽ thiết kế giao diện - Màn hình Đăng nhập hệ thống (Login)`
  * `Hình 6.2: Bản vẽ thiết kế giao diện - Màn hình Tổng quan Dashboard Quản trị`
  * `Hình 6.3: Bản vẽ thiết kế giao diện - Màn hình Quản lý Lớp học & Sĩ số`
  * `Hình 6.4: Bản vẽ thiết kế giao diện - Màn hình Quản lý Đội ngũ Giảng viên`
  * `Hình 6.5: Bản vẽ thiết kế giao diện - Màn hình Quản lý Hồ sơ Học viên`
  * `Hình 6.6: Bản vẽ thiết kế giao diện - Màn hình Điểm danh Buổi học`
  * `Hình 6.7: Bản vẽ thiết kế giao diện - Màn hình Quản lý Bảng điểm và Kết quả học tập`
  * `Hình 6.8: Bản vẽ thiết kế giao diện - Màn hình Trợ lý AI Tư vấn và Tóm tắt tiến độ`
* **Diễn giải đi kèm:** Dưới mỗi hình bắt buộc có đoạn văn ngắn (3 - 5 dòng) giải thích: *Mục đích màn hình, Các trường dữ liệu hiển thị, Các nút thao tác và luồng tương tác người dùng*.
