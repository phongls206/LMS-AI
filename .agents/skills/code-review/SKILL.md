---
name: code-review
description: Quy chuẩn rà soát chất lượng mã nguồn (Code Review), kiểm tra tính tuân thủ Design, Clean Code, TypeScript Types và xử lý lỗi cho ETC English Center.
---

# Code Review Skill (Quy Chuẩn Rà Soát Chất Lượng Mã Nguồn)

## 1. Mục Đích & Phạm Vi
Skill này quy định quy trình và checklist rà soát mã nguồn (Backend NestJS & Frontend Next.js) nhằm đảm bảo code bám sát 100% tài liệu thiết kế, sạch, dễ bảo trì và không có lỗi tiềm ẩn cho hệ thống **ETC English Center**.

---

## 2. Checklist Rà Soát 5 Tiêu Chí Bắt Buộc

1. **Tính Tuân Thủ Thiết Kế (Traceability & Design Adherence):**
   - Tên bảng, tên cột, khóa ngoại có khớp 100% với 14 bảng CSDL trong `database-design`?
   - Logic kiểm tra đăng ký có đủ 4 điều kiện (sĩ số $\le 25$, chưa đăng ký, CEFR, lịch trùng) trong `requirements-analysis`?
   - Công thức tính điểm có đúng $20\% + 30\% + 50\%$ và chuẩn Đạt $\ge 50$ điểm, $\ge 80\%$ chuyên cần?
2. **Kiến Trúc & Phân Lớp (Architecture & Layering):**
   - Logic nghiệp vụ có được viết tập trung tại Service Layer (Backend) thay vì nằm ở Controller hoặc Frontend không?
   - Các thao tác đa bảng có được bọc trong Transaction không?
3. **An Toàn Kiểu Dữ Liệu & Validation (Type Safety & DTO):**
   - Có dùng `any` bừa bãi trong TypeScript không?
   - Input đầu vào Controller có được Validate qua DTO (`class-validator` / `Zod`) không?
4. **Xử Lý Ngoại Lệ & Lỗi (Error Handling):**
   - Có bắt lỗi đầy đủ và trả về đúng mã HTTP (400, 401, 403, 404, 409, 500) không?
   - Lệnh gọi GenAI có gắn Timeout (<= 15s) và Fallback Rule-based không?
5. **Clean Code & KISS:**
   - Code có dễ đọc, tránh lồng ghép if-else quá sâu, không duplicate code không?
