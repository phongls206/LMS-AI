---
name: ui-mockup-designer
description: Quy chuẩn thiết kế giao diện mẫu (UI Mockup & Prototype) chuẩn Dark Theme, bố cục chuẩn mực cho các phân hệ của ETC English Center.
---

# 🖥️ UI Mockup & Prototype Design Skill

Quy chuẩn và hướng dẫn thiết kế giao diện mẫu (UI Mockup) chất lượng cao, chuẩn phong cách **Dark Theme chuyên nghiệp** cho hệ thống trung tâm ngoại ngữ **ETC English Center**.

---

## 1. Mục Đích & Phạm Vi Áp Dụng

- **Mục đích:** Phác thảo nhanh giao diện trực quan trước hoặc trong quá trình phát triển, làm tài liệu tham chiếu thống nhất giữa BA, Designer, Lập trình viên và Báo cáo đồ án.
- **Phạm vi:** Áp dụng khi tạo bản vẽ Mockup (dạng ảnh PNG qua `generate_image` hoặc thiết kế Wireframe) cho 4 phân hệ vai trò: Quản lý (Admin), Tư vấn viên (Staff), Giáo viên (Teacher), và Học viên (Student).

---

## 2. Hệ Thống Design System Chuẩn (Sleek Dark Theme)

Mọi giao diện mẫu phải tuân thủ bảng màu và phong cách chuẩn của ETC English:

### 2.1 Bảng Màu Nhận Diện (Color Palette)
- **Nền chính (App Background):** Xanh đen chiều sâu `#0b1329` hoặc `#0f172a`.
- **Thẻ nội dung (Cards / Panels):** Navy đậm `#111928` / `#162032`, có viền mỏng thanh lịch `border: 1px solid #1e2d45`.
- **Màu điểm nhấn chức năng (Accents & Status):**
  - *Teal / Cyan (`#06b6d4`, `#00b4d8`):* Điểm nhấn thương hiệu chính, nút hành động, thẻ học viên/lớp học.
  - *Orange (`#f97316`):* Doanh thu, học phí, cảnh báo quan trọng.
  - *Purple (`#a855f7`):* Tính năng GenAI, phân tích tiến độ, phân phối trình độ C1/C2.
  - *Emerald Green (`#10b981`):* Trạng thái Đang học, tỷ lệ đạt chuẩn, điểm danh Có mặt.
  - *Rose Red (`#f43f5e`):* Vắng học, nợ học phí quá hạn, hủy lớp.
- **Chữ & Nội dung (Typography):**
  - Tiêu đề & Chỉ số: Trắng sáng `#ffffff`, font sans-serif hiện đại, font-weight 700.
  - Nhãn phụ & Text phụ: Slate xám nhạt `#94a3b8` / `#cbd5e1`.

---

## 3. Cấu Trúc Khung Màn Hình Tiêu Chuẩn (Layout Blueprint)

Mỗi bản thiết kế mockup màn hình máy tính phải có cấu trúc 3 phần rõ ràng:

```text
┌─────────────────┬────────────────────────────────────────────────────────────────────────┐
│  ETC LOGO       │  [🔍 Tìm kiếm...]               🔔 [3]   [VN ▾]  [👤 Admin Nguyen ▾]   │
├─────────────────┼────────────────────────────────────────────────────────────────────────┤
│ ⊞ Tổng Quan     │  TỔNG QUAN DASHBOARD (Tiêu đề màn hình)                                │
│ 📖 Khóa Học     │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐   │
│ 👥 Lớp Học      │  │ Tổng Học Viên│ │ Lớp Đang Mở  │ │ Doanh Thu    │ │ Tỷ Lệ Đạt    │   │
│ 🪪 Học Viên     │  │ 55 (+3.1%)   │ │ 6 (+0%)      │ │ 176.9M VND   │ │ 73.1%        │   │
│ 💼 Giảng Viên   │  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘   │
│ 💳 Học Phí      │  ┌─────────────────────────────────┐ ┌─────────────────────────────┐   │
│ 📊 Báo Cáo      │  │ Phân Phối Trình Độ CEFR (Chart) │ │ Tỷ Lệ Lấp Đầy Lớp Học       │   │
│ 🤖 AI Trợ Lý    │  │ [B2: 45%] [B1: 25%] [C1: 15%]...│ │ [Lớp IELTS 6.5: 90% (18/20)]│   │
│                 │  └─────────────────────────────────┘ └─────────────────────────────┘   │
│                 │  © 2026 ETC English Center. All rights reserved.                       │
└─────────────────┴────────────────────────────────────────────────────────────────────────┘
```

1. **Sidebar Trái (Navigation Rail):** 
   - Logo ETC English Center nổi bật ở góc trên.
   - Danh sách menu theo đúng phân quyền (có icon đi kèm, mục đang chọn được highlight nền xanh Teal nhạt kèm viền).
2. **Header Trên Cùng (Top Bar):** 
   - Thanh tìm kiếm thông minh (Search bar bo góc `rounded-xl`).
   - Notification chuông có badge đỏ, nút chuyển ngôn ngữ (`VN/EN`), Avatar và tên người dùng đăng nhập.
3. **Vùng Nội Dung Chính (Main Stage):**
   - Hàng trên: Bộ 4 thẻ KPI chỉ số quan trọng (Metric Cards có icon, số liệu và % tăng/giảm).
   - Hàng giữa/dưới: Biểu đồ thanh ngang (Progress bar), bảng biểu dữ liệu phân trang, hoặc bộ lọc trạng thái.
   - Footer: Dòng bản quyền trung tâm bản quyền `© 2026 ETC English Center`.

---

## 4. Quy Trình 3 Bước Sinh Prompt Tạo Ảnh Mockup (`generate_image`)

Khi cần tạo hình ảnh Mockup minh họa bằng công cụ `generate_image`, Agent tuân thủ cấu trúc prompt chuẩn:

```text
1. Format: UI Mockup screenshot, web application dashboard, desktop view 16:9.
2. Styling: Dark theme modern UI, deep dark navy background (#0b1329), sleek cards (#162032) with subtle dark blue borders (#1e2d45), rounded corners, sharp typography.
3. Elements: Left sidebar with ETC English Center logo and icons (Dashboard, Courses, Classes, Students, Teachers, Fees, Reports, AI Assistant), top navigation bar with search bar and user profile (Admin Nguyen).
4. Content: [Mô tả chi tiết 4 metric cards, biểu đồ, bảng dữ liệu cụ thể bằng tiếng Việt chuẩn].
5. Constraints: No mobile frames, no laptop bezel/frame, straight flat UI screenshot, ultra high quality, clean layout.
```

---

## 5. Mockup Quality Checklist
- [ ] Giao diện chuẩn Dark Theme nền xanh đen `#0b1329`, không dùng nền đen tuyền `#000000` gắt mắt.
- [ ] Bố cục rõ ràng: Sidebar bên trái, Header trên cùng, Thẻ KPI tóm tắt và Vùng nội dung chi tiết.
- [ ] Sử dụng đúng từ ngữ nghiệp vụ tiếng Việt (Học viên, Lớp học, Khóa học, Doanh thu, CEFR, Điểm danh).
- [ ] Tuyệt đối không sinh mockup có khung viền thiết bị bên ngoài (laptop frame, phone frame).
- [ ] Thiết kế cân đối, tỷ lệ hiển thị chuẩn màn hình máy tính (16:9).
