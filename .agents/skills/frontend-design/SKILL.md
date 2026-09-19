---
name: frontend-design
description: Quy chuẩn thiết kế giao diện UI/UX và lập trình Frontend Next.js App Router, Tailwind CSS, Dark Mode và Form Validation cho ETC English Center.
---

# 🎨 Frontend Design & Engineering Skill

Hướng dẫn kết hợp giữa tư duy thiết kế giao diện độc bản (Intentional UI/UX) và kỹ thuật phát triển ứng dụng Frontend hiện đại bằng Next.js App Router, Tailwind CSS cho trung tâm ETC English.

---

## 1. Triết Lý Thiết Kế Trực Quan (Design Principles)

- **Màu sắc & Điểm nhấn:** Sử dụng bảng màu có chủ đích (Teal/Slate/Emerald). Tránh các màu cơ bản mặc định hoặc gradient lòe loẹt. Dành sự nổi bật cho một yếu tố chính (Hero action hoặc Metrics cốt lõi), các thành phần phụ giữ nhịp điệu phẳng, thanh lịch.
- **Typography:** Phân cấp cỡ chữ rõ ràng, độ dài dòng $< 80$ ký tự. Tránh các thói quen máy móc như in hoa toàn bộ nhãn, đánh dấu màu lẻ tẻ 1 từ trong tiêu đề.
- **Cấu trúc & Nhịp điệu:** Sử dụng border nhẹ nhàng (`border-slate-200/90 dark:border-[#1e2d45]`), bo góc nhất quán (`rounded-2xl`, `rounded-xl`). Tránh chia cắt giao diện thành các card lặp lại đơn điệu.
- **Hỗ trợ Dark Mode toàn diện:** Mọi thành phần đều phải có cặp class sáng/tối tương ứng (`bg-white dark:bg-[#111928]`, `text-slate-900 dark:text-white`, `border-slate-200 dark:border-[#22324e]`).

---

## 2. Kiến Trúc Ứng Dụng Frontend (Next.js App Router)

- **Cấu trúc thư mục:**
  ```text
  frontend/src/
  ├── app/             # Next.js App Router (admin, staff, teacher, student, login)
  ├── components/      # Reusable UI components (AppLayout, Modals, Tables, Forms)
  ├── services/        # Centralized Axios API client (api.ts) & Token interceptor
  ├── types/           # TypeScript interfaces & Enums đồng bộ với Backend
  └── utils/           # Formatters (tiền tệ, ngày tháng, trạng thái, thời gian)
  ```
- **Bảo vệ màn hình bằng `<AppLayout>`:** Mọi trang nội bộ phải bọc trong `<AppLayout>` với `allowedRoles`:
  ```tsx
  'use client';
  export default function TeacherPage() {
    return (
      <AppLayout allowedRoles={['GIAO_VIEN']} title="Quản Lý Lớp Học" subtitle="Theo dõi lịch giảng dạy">
        {/* Nội dung trang */}
      </AppLayout>
    );
  }
  ```

---

## 3. Quy Chuẩn Xử Lý Form & Ràng Buộc Dữ Liệu (Form Validation UX)

### 3.1 Ràng buộc Tên Đăng Nhập & Mật Khẩu
- **Tên đăng nhập (Username):**
  - Tự động loại bỏ dấu gạch dưới (`_`), khoảng trắng và mọi ký tự đặc biệt ngay khi người dùng gõ (chỉ chấp nhận chữ cái và số):
    ```tsx
    onChange={(e) => setFormData({ ...formData, tenDangNhap: e.target.value.toLowerCase().replace(/[^a-zA-Z0-9]/g, '') })}
    ```
  - Định dạng bắt buộc `^[a-zA-Z0-9]+$`, độ dài $\ge 3$ ký tự, tuyệt đối không chứa `_` hay ký tự lạ.
- **Mật khẩu:** Tối thiểu 6 ký tự (khởi tạo) hoặc 8 ký tự (đổi mật khẩu). Tuyệt đối cấm khoảng trắng (`replace(/\s/g, '')`). Hiển thị nút bật/tắt ẩn/hiện mật khẩu.
- **Kiểm tra trùng lặp thời gian thực (Debounced check):** Gọi API check duplicate tên đăng nhập/email/mã học viên để báo lỗi ngay khi nhập xong.

### 3.2 Phản Hồi Trạng Thái Tương Tác (Interactive Feedback)
- **Nút Submit:** Phải có trạng thái `disabled` và icon xoay `animate-spin` khi đang gửi request (`submitting`).
- **Thông báo lỗi/thành công:** Dùng alert banner rõ ràng, chỉ dẫn cụ thể người dùng cần làm gì để sửa, tránh thông báo chung chung.

---

## 4. Bố Cục Bảng Dữ Liệu & Responsive Mobile

- **Mobile First:** Mọi màn hình phải hiển thị tốt từ màn hình điện thoại ($< 640px$), tablet ($768px$) đến màn hình lớn ($1024px+$).
- **Thẻ hiển thị thời khóa biểu:** Hiển thị thứ tăng dần từ Thứ 2 đến Chủ Nhật, giờ sớm đến giờ muộn.
- **Bảng dữ liệu phức tạp:** Sử dụng `overflow-x-auto`, giữ `sticky` thanh tiêu đề bảng hoặc chuyển đổi sang dạng thẻ (Card list) trên màn hình nhỏ.
- **Touch Targets:** Kích thước nút bấm và ô chọn tối thiểu $44 \times 44px$ trên thiết bị cảm ứng để thao tác thuận tiện.

---

## 5. Ngôn Ngữ Giao Diện & Copywriting

- **Viết theo góc nhìn người dùng:** Dùng từ ngữ nghiệp vụ thân thuộc ("Học viên", "Học phí", "Ghi danh", "Điểm danh"), tránh từ ngữ kỹ thuật backend (không dùng "entity", "payload", "schema").
- **Hành động rõ ràng (Active Voice):** Nút bấm nêu chính xác hành động: "Lưu thay đổi", "Xác nhận điểm danh", "Tạo tài khoản học viên" thay vì chữ "Gửi" hay "Submit".
- **Trạng thái trống (Empty State):** Khi danh sách trống, hiển thị hình ảnh minh họa nhẹ nhàng kèm lời hướng dẫn tạo mới thay vì để màn hình trắng trơn.

---

## 6. Frontend Quality Checklist
- [ ] Giao diện hoạt động mượt mà ở cả chế độ Sáng (Light) và Tối (Dark).
- [ ] Form chặn triệt để khoảng trắng ở username và kiểm tra mật khẩu $\ge 6$ ký tự.
- [ ] Các thao tác gọi API có loading indicator và disable nút tránh bấm đúp.
- [ ] Responsive hoàn chỉnh trên mobile, không bị vỡ layout hoặc tràn màn hình ngang.
- [ ] Chạy `npm run build` trong thư mục `frontend` biên dịch thành công không có lỗi.
