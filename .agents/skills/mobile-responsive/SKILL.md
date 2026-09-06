---
name: mobile-responsive
description: Quy chuẩn thiết kế và tối ưu giao diện Mobile Responsive (Mobile-First, Breakpoints, Touch Targets, Data Tables, Form Controls) cho dự án ETC English Center.
---

# Mobile Responsive Skill (Quy Chuẩn Tối Ưu Giao Diện Di Động)

## 1. Mục Đích & Nguyên Tắc Vàng (Golden Rules)
Skill này cung cấp bộ quy chuẩn và mẫu code thực chiến để tối ưu hóa toàn bộ giao diện Next.js App Router trên màn hình di động (Mobile: 375px – 430px) mà **tuyệt đối không làm thay đổi, lệch khung hay vỡ giao diện Desktop (PC: >= 1024px)**.

### 4 Nguyên Tắc Vàng:
1. **Zero PC Side-Effects (Không tác dụng phụ lên PC):** Khi sửa lỗi mobile, chỉ can thiệp vào class mặc định (mobile) và giữ nguyên vẹn các tiền tố `sm:`, `md:`, `lg:`, `xl:` dành cho PC.
2. **Mobile-First Progressive Enhancement:** Viết class cho mobile trước, sau đó ghi đè cho màn hình lớn hơn. Ví dụ: `flex flex-col md:flex-row`.
3. **No Horizontal Page Overflow (Chống tràn ngang 100%):** Tuyệt đối không dùng chiều rộng cứng dạng `w-[800px]`, `w-[500px]`. Luôn dùng `w-full max-w-...` kết hợp `overflow-x-hidden` ở container cha.
4. **Touch Target Accessibility:** Mọi nút bấm, input, select trên mobile phải có chiều cao tối thiểu `h-10` (~40px - 44px) và padding đủ lớn để dễ thao tác bằng ngón tay cái.

---

## 2. Hệ Thống Breakpoints Chuẩn Dự Án

| Breakpoint | Kích Thước Viewport | Thiết Bị Tiêu Biểu | Quy Tắc Bố Cục Chủ Đạo |
| :--- | :--- | :--- | :--- |
| **Default** | `< 640px` | iPhone SE (375px), iPhone 14/15/16 (390px - 430px) | 1 cột (`flex-col`, `grid-cols-1`), nút full-width, thanh cuộn bảng riêng |
| **`sm:`** | `>= 640px` | Phablet, iPad Mini ngang, Tablet nhỏ | 2 cột (`sm:grid-cols-2`), bắt đầu dàn ngang một số filter |
| **`md:`** | `>= 768px` | Tablet dọc, iPad 10.2", Laptop nhỏ | 2-3 cột (`md:grid-cols-3`), bắt đầu hiện các bảng dữ liệu đầy đủ |
| **`lg:`** | `>= 1024px` | Laptop, Desktop tiêu chuẩn | Sidebar cố định, bảng đa cột, layout 4-6 chỉ số ngang |
| **`xl:`** | `>= 1280px` | Màn hình lớn Full HD / 2K | Tối đa độ rộng `max-w-7xl` căn giữa trang |

---

## 3. Mẫu Thiết Kế Thành Phần UI Điển Hình (Component Patterns)

### 3.1. Bảng Dữ Liệu Lớn (Data Tables & Ma Trận Điểm Danh)
Bảng có nhiều cột (> 5 cột) trên mobile sẽ bị co rúm chữ nếu để ép khung. Áp dụng 1 trong 2 giải pháp:
- **Giải pháp Container Cuộn Riêng (Cho bảng điểm, điểm danh phức tạp):**
  ```tsx
  <div className="w-full overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 scrollbar-thin">
    <table className="min-w-[640px] md:min-w-full divide-y divide-slate-200 text-xs">
      {/* Cột cố định chiều rộng tối thiểu, không vỡ layout */}
    </table>
  </div>
  ```
- **Giải pháp Hybrid (Card trên Mobile, Table trên PC):**
  ```tsx
  {/* Mobile view: Hiển thị dạng danh sách Card */}
  <div className="space-y-3 block md:hidden">
    {items.map(item => <MobileItemCard key={item.id} data={item} />)}
  </div>
  {/* Desktop view: Bảng đầy đủ */}
  <div className="hidden md:block overflow-hidden rounded-xl border ...">
    <table>...</table>
  </div>
  ```

### 3.2. Thanh Điều Khiển & Bộ Lọc (Filter Bars & Toolbars)
- **Quy tắc:** Dropdown, Search Input và Action Button phải xếp dọc toàn màn hình trên Mobile, xếp ngang trên PC:
  ```tsx
  <div className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full md:w-auto">
      <select className="w-full sm:w-auto min-w-[200px] h-10 px-3 text-xs ...">...</select>
      <input className="w-full sm:w-auto h-10 px-3 text-xs ..." placeholder="Tìm kiếm..." />
    </div>
    <button className="w-full md:w-auto h-10 px-5 flex items-center justify-center space-x-2 ...">
      <span>Thực Hiện</span>
    </button>
  </div>
  ```

### 3.3. Dải Chỉ Số & Thẻ Thống Kê (Stat Metrics)
- **Quy tắc:** Tránh dùng `grid-cols-6` cứng. Hãy chia cấp bậc lưới:
  ```tsx
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
    {/* Mobile: 2 cột gọn gàng; Tablet: 3 cột; PC: 6 cột dàn ngang */}
  </div>
  ```

### 3.4. Hộp Thoại & Modal (Modals & Popup Dialogs)
- **Quy tắc:** Không cố định `w-[600px]`. Dùng `w-full max-w-lg mx-3` và khống chế chiều cao cuộn nội dung:
  ```tsx
  <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
    <div className="w-full max-w-lg max-h-[90vh] flex flex-col rounded-2xl bg-white shadow-xl overflow-hidden">
      <div className="p-4 border-b flex justify-between items-center shrink-0">...</div>
      <div className="p-4 overflow-y-auto space-y-3">...</div>
      <div className="p-4 border-t flex flex-col-reverse sm:flex-row justify-end gap-2 shrink-0">...</div>
    </div>
  </div>
  ```

### 3.5. Header Trang & Tiêu Đề Điều Hướng
- **Quy tắc:** Tránh nhồi nhét quá nhiều nút hành động trên thanh Header của Mobile:
  ```tsx
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4">
    <div>
      <h1 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900">Tiêu Đề Trang</h1>
      <p className="text-xs text-slate-500 mt-0.5 line-clamp-1 sm:line-clamp-none">Mô tả ngắn gọn</p>
    </div>
    <div className="flex items-center space-x-2 self-start sm:self-auto">
      {/* Nút hành động */}
    </div>
  </div>
  ```

---

## 4. Typography & Spacing Scale Cho Mobile

| Thuộc Tính | Mobile (`< 640px`) | Desktop (`>= 1024px`) | Class Khuyên Dùng |
| :--- | :--- | :--- | :--- |
| **Page Padding** | `p-3` hoặc `p-4` | `p-6` hoặc `p-8` | `p-3.5 sm:p-6 lg:p-8` |
| **Card Padding** | `p-3` hoặc `p-3.5` | `p-5` hoặc `p-6` | `p-3.5 sm:p-5` |
| **Heading 1** | `text-lg` (18px) | `text-2xl` (24px) | `text-lg sm:text-xl md:text-2xl` |
| **Body Text** | `text-xs` (12px) | `text-sm` (14px) | `text-xs sm:text-sm` |
| **Caption/Tag** | `text-[10px]` - `text-[11px]` | `text-xs` (12px) | `text-[11px] sm:text-xs` |
| **Gap / Space** | `gap-2` hoặc `gap-2.5` | `gap-4` hoặc `gap-6` | `gap-2.5 sm:gap-4` |

---

## 5. Checklist Kiểm Thử Mobile Trước Khi Bàn Giao

Mỗi khi chỉnh sửa hoặc tạo mới component, Developer/Agent bắt buộc đối soát 5 tiêu chí:
- [ ] **Không tràn ngang (No Horizontal Scroll):** Thu nhỏ trình duyệt về bề ngang `375px`, cuộn từ trên xuống dưới không thấy trang bị lệch sang phải.
- [ ] **Nút bấm & Ô nhập liệu không bị che:** Các nút chính luôn có chiều rộng đủ lớn, không bị dropdown khác che khuất.
- [ ] **Bảng dữ liệu có container cuộn mượt mà:** Người dùng có thể vuốt ngón tay để xem các cột bị ẩn mà không làm méo khung trang.
- [ ] **Menu Drawer hoạt động trơn tru:** Nhấn nút hamburger mở menu trượt, bấm vào màn mờ (overlay) hoặc chọn menu thì đóng lại.
- [ ] **PC không bị thay đổi giao diện:** Chuyển lại độ phân giải `1920x1080` hoặc `1440x900` để đảm bảo layout trên PC vẫn chuẩn chỉnh 100%.
