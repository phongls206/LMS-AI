---
name: database-design
description: Quy chuẩn và nguyên tắc thiết kế CSDL quan hệ chuẩn 3NF, đặc tả 14 bảng, ràng buộc toàn vẹn và tối ưu hóa truy vấn cho ETC English Center.
---

# Database Design Skill (Thiết Kế Cơ Sở Dữ Liệu Quan Hệ 3NF)

## 1. Mục Đích & Phạm Vi
Skill này quy định các tiêu chuẩn kỹ thuật thiết kế, chuẩn hóa CSDL (3NF), quản lý 14 bảng dữ liệu, thiết lập khóa chính/ngoại và đảm bảo tính toàn vẹn dữ liệu (Integrity Constraints) cho hệ thống **ETC English Center** trên nền tảng **PostgreSQL**.

---

## 2. Quy Chuẩn 14 Bảng CSDL Chuẩn Hóa 3NF

### Nhóm 1: Quản lý Người dùng & RBAC
1. **`NguoiDung`:** Lưu tài khoản (`id` [PK], `ten_dang_nhap` [UQ], `mat_khau_ma_hoa`, `vai_tro` [CHECK: QUAN_LY, GIAO_VIEN, HOC_VIEN, TU_VAN_VIEN], `email` [UQ], `so_dien_thoai`, `dang_hoat_dong`).
2. **`HoSoHocVien`:** Lưu hồ sơ (`id` [PK], `nguoi_dung_id` [FK, UQ], `ma_hoc_vien` [UQ], `ho_ten`, `ngay_sinh`, `gioi_tinh`, `dia_chi`, `trinh_do_cefr` [CHECK: A1..C2], `nguon_danh_gia`, `lich_ranh_json`, `trang_thai`).
3. **`HoSoGiaoVien`:** Lưu hồ sơ GV (`id` [PK], `nguoi_dung_id` [FK, UQ], `ma_giao_vien` [UQ], `ho_ten`, `chuyen_mon`, `bang_cap`, `trang_thai`).

### Nhóm 2: Đào tạo & Xếp lịch
4. **`KhoaHoc`:** Chương trình đào tạo (`id` [PK], `ma_khoa_hoc` [UQ], `ten_khoa_hoc`, `ngon_ngu`, `trinh_do_yeu_cau`, `thoi_luong_gio`, `hoc_phi`, `mo_ta`, `trang_thai`).
5. **`LopHoc`:** Lớp thực tế (`id` [PK], `khoa_hoc_id` [FK], `ma_lop_hoc` [UQ], `ten_lop_hoc`, `si_so_toi_da` [CHECK: 1..25], `si_so_hien_tai`, `ngay_bat_dau`, `ngay_ket_thuc`, `phong_hoc`, `link_online`, `trang_thai`).
6. **`LichHoc`:** Thời khóa biểu (`id` [PK], `lop_hoc_id` [FK], `thu_trong_tuan` [CHECK: 2..8], `gio_bat_dau`, `gio_ket_thuc`, `phong_hoc`).
7. **`PhanCongGiaoVien`:** Phân công (`id` [PK], `lop_hoc_id` [FK], `giao_vien_id` [FK], `vai_tro_phan_cong` [CHECK: CHINH, TRO_GIANG], `thoi_gian_phan_cong`, `trang_thai`).

### Nhóm 3: Đăng ký & Học phí
8. **`DangKyHoc`:** Đơn đăng ký (`id` [PK], `lop_hoc_id` [FK], `hoc_vien_id` [FK], `ngay_dang_ky`, `trang_thai` [CHECK: CHO_THANH_TOAN, DA_XAC_NHAN, DA_HUY, HOAN_THANH]).
9. **`HoaDon`:** Công nợ (`id` [PK], `ma_hoa_don` [UQ], `dang_ky_hoc_id` [FK, UQ], `hoc_vien_id` [FK], `so_tien_phai_tra`, `so_tien_da_tra`, `han_thanh_toan`, `trang_thai`).
10. **`ThanhToan`:** Giao dịch thu tiền (`id` [PK], `hoa_don_id` [FK], `ma_giao_dich` [UQ], `so_tien`, `phuong_thuc` [CHECK: TIEN_MAT, CHUYEN_KHOAN], `thoi_gian_thanh_toan`, `nguoi_thu_id` [FK], `trang_thai`, `ghi_chu`).

### Nhóm 4: Điểm danh & Đánh giá
11. **`BuoiHoc`:** Tiến độ buổi học (`id` [PK], `lop_hoc_id` [FK], `so_thu_tu`, `ngay_hoc`, `gio_bat_dau`, `gio_ket_thuc`, `chu_de`, `trang_thai`).
12. **`BanGhiDiemDanh`:** Chuyên cần (`id` [PK], `buoi_hoc_id` [FK], `hoc_vien_id` [FK], `trang_thai` [CHECK: CO_MAT, VANG, DI_MUON, CO_PHEP], `ghi_chu`, `thoi_gian_diem_danh`, `giao_vien_diem_danh_id` [FK]).
13. **`KetQuaHocTap`:** Bảng điểm (`id` [PK], `lop_hoc_id` [FK], `hoc_vien_id` [FK], `diem_chuyen_can`, `diem_giua_ky`, `diem_cuoi_ky`, `diem_tong_ket`, `nhan_xet`, `trang_thai_hoan_thanh` [CHECK: DAT, KHONG_DAT, CHUA_XEP_LOAI]).

### Nhóm 5: Audit Log GenAI
14. **`YeuCauAI`:** Nhật ký gọi AI (`id` [PK], `nguoi_dung_id` [FK], `loai_chuc_nang`, `prompt_input`, `raw_output`, `validated_output_json`, `trang_thai`, `thoi_gian_xu_ly_ms`, `thoi_gian_goi`).

---

## 3. Quy Tắc Ràng Buộc Toàn Vẹn (Integrity Rules)
1. **Ràng buộc Khóa & Duy nhất:** Bắt buộc có Unique Constraint trên `ten_dang_nhap`, `email`, `ma_hoc_vien`, `ma_giao_vien`, `ma_khoa_hoc`, `ma_lop_hoc`, `ma_hoa_don`, `ma_giao_dich`.
2. **Ràng buộc Xóa (ON DELETE Rules):**
   - Không được phép xóa cứng Khóa học/Lớp học đã có học viên đăng ký (`ON DELETE RESTRICT`). Phải chuyển `trang_thai = NGUNG_HOAT_DONG` / `DA_HUY`.
   - Xóa Lớp học (khi chưa có học viên) thì xóa các lịch học định kỳ (`ON DELETE CASCADE` trên `LichHoc`).
3. **Ràng buộc Kiểm tra (CHECK Constraints):**
   - Sĩ số lớp: $1 \le \text{si\_so\_toi\_da} \le 25$.
   - Điểm số: $0 \le \text{diem} \le 100$.
   - Thời gian học: $\text{gio\_ket\_thuc} > \text{gio\_bat\_dau}$ và $\text{ngay\_ket\_thuc} \ge \text{ngay\_bat\_dau}$.
   - Học phí & Số tiền: $\ge 0$.

---

## 4. Quy Trình Thiết Kế & Migration CSDL
```text
1. Xác định Thực thể & Mối quan hệ từ Requirement
   ↓
2. Chuẩn hóa về 3NF (Loại bỏ thuộc tính lặp & phụ thuộc bắc cầu)
   ↓
3. Thiết lập Data Types, PK, FK, Index & CHECK Constraints
   ↓
4. Sinh file Migration (TypeORM/Prisma Migration)
   ↓
5. Viết script Seed Data mẫu chuẩn kiểm thử
```
