---
name: requirements-analysis
description: Quy chuẩn và quy trình phân tích yêu cầu nghiệp vụ, đặc tả Use Case (UC001-UC014), phân loại FR/NFR, xây dựng Business Rules và lập Ma trận truy vết yêu cầu (RTM) cho ETC English Center.
---

# Requirements Analysis Skill (Phân Tích & Đặc Tả Yêu Cầu Nghiệp Vụ)

## 1. Mục Đích & Phạm Vi
Skill này quy định phương pháp phân tích yêu cầu phần mềm theo tiêu chuẩn SRS (Software Requirements Specification), đặc tả chi tiết 14 Use Case, phân định quyền hạn 4 tác nhân, thiết lập các quy tắc nghiệp vụ (Business Rules) và duy trì Ma trận truy vết yêu cầu (RTM) cho hệ thống **ETC English Center**.

---

## 2. Quy Chuẩn Phân Loại Yêu Cầu

### 2.1 Yêu Cầu Chức Năng (Functional Requirements - FR)
Agent phải đảm bảo mọi chức năng thuộc đúng mã định danh đã chốt:
- **FR-001 (Truy cập):** Đăng nhập và phân quyền RBAC.
- **FR-002 -> FR-005 (Đào tạo):** Quản lý học viên & CEFR, Khóa học chuẩn, Lớp học & Lịch học, Giáo viên & Phân công.
- **FR-006 -> FR-007 (Vận hành & Tài chính):** Đăng ký lớp, Quản lý hóa đơn & thanh toán học phí.
- **FR-008 -> FR-009 (Học tập & Đánh giá):** Điểm danh theo buổi, Ghi nhận kết quả (Chuyên cần 20%, Giữa kỳ 30%, Cuối kỳ 50%).
- **FR-010 -> FR-011 (Khai thác dữ liệu):** Tra cứu đa tiêu chí theo quyền, Thống kê doanh thu/sĩ số/tỷ lệ hoàn thành.
- **FR-AI-001 -> FR-AI-003 (Tích hợp AI):** AI tư vấn lớp theo CEFR & lịch rảnh, AI sinh bài tập trắc nghiệm, AI tóm tắt tiến độ học tập.

### 2.2 Yêu Cầu Phi Chức Năng (Non-Functional Requirements - NFR)
- **NFR-001 (Bảo mật & RBAC):** Mật khẩu băm an toàn (Argon2/bcrypt), xác thực JWT, kiểm tra quyền nghiêm ngặt tại Backend.
- **NFR-002 (Toàn vẹn dữ liệu):** Giao dịch nguyên tử (ACID Transaction), không tạo dữ liệu dở dang (ví dụ: đăng ký lớp phải đi kèm tạo hóa đơn).
- **NFR-003 (Độ tin cậy & An toàn AI):** Nguyên tắc Zero-Trust, lọc ảo giác (chỉ gợi ý lớp có thật trong CSDL), Timeout <= 15s và kích hoạt Fallback Rule-based.
- **NFR-004 (Khả năng kiểm thử):** Tối thiểu 100% coverage cho các luồng đăng ký, học phí, điểm danh và 3 chức năng AI.
- **NFR-006 (Hiệu năng):** API thông thường phản hồi < 3 giây; tác vụ AI có giao diện chờ (Loading indicator).

---

## 3. Quy Chuẩn Đặc Tả Use Case (Chuẩn Bảng 8 Mục)

Mỗi Use Case khi đặc tả bắt buộc phải tuân theo cấu trúc chuẩn:
1. **Mã & Tên Use Case:** (VD: `UC006_Đăng ký lớp`).
2. **Mục đích:** Lý do tồn tại của Use Case.
3. **Mô tả ngắn gọn:** Tóm tắt hành động chính.
4. **Tác nhân chính & Phụ:** Phân định rõ ai khởi tạo, ai tham gia (`Quản lý`, `Giáo viên`, `Học viên`, `Tư vấn viên`).
5. **Điều kiện tiên quyết (Pre-conditions):** Trạng thái hệ thống trước khi bắt đầu.
6. **Điều kiện kết thúc (Post-conditions):** Kết quả đạt được sau khi thực hiện thành công/thất bại.
7. **Luồng sự kiện chính (Basic Flows):** Các bước thực hiện tuần tự từ 1 đến N.
8. **Luồng sự kiện phụ & Ngoại lệ (Alternative / Exception Flows):** Các nhánh rẽ khi dữ liệu sai, trùng lịch, hết chỗ hoặc AI lỗi.

---

## 4. Các Quy Tắc Nghiệp Vụ Trọng Yếu (Core Business Rules - BR)

1. **BR-01 (Khống chế sĩ số):** Sĩ số mỗi lớp dao động từ $1 \le \text{Sĩ số} \le 25$ học viên. Vượt quá 25 lập tức đóng tiếp nhận.
2. **BR-02 (Điều kiện Đăng ký lớp):** Phải thỏa mãn đồng thời 4 điều kiện: (1) Lớp đang mở và còn chỗ; (2) Học viên chưa đăng ký lớp này; (3) Trình độ CEFR của học viên $\ge$ chuẩn yêu cầu của khóa; (4) Lịch học không xung đột với các lớp khác đang theo học.
3. **BR-03 (Chuyên cần & Hoàn thành):** Học viên phải tham gia tối thiểu 80% số buổi học (điểm chuyên cần $\ge 80$). Điểm tổng kết $= (\text{Chuyên cần} \times 0.2) + (\text{Giữa kỳ} \times 0.3) + (\text{Cuối kỳ} \times 0.5)$. Điều kiện ĐẠT: $\text{Điểm tổng kết} \ge 50.0$ và $\text{Điểm chuyên cần} \ge 80.0$.
4. **BR-04 (Chống trùng phòng & Trùng giờ dạy):** Một phòng học hoặc một giáo viên không thể có 2 ca học có cùng thứ trong tuần và khoảng thời gian $[gioBatDau, gioKetThuc]$ giao thoa nhau.
5. **BR-05 (Nguyên tắc AI Zero-Trust):** Không được trả về lớp không có trong CSDL; AI tóm tắt không được suy diễn ngoài dữ liệu điểm số/điểm danh được cung cấp.

---

## 5. Ma Trận Truy Vết Yêu Cầu (Requirements Traceability Matrix - RTM)

Agent khi phân tích hoặc lập trình phải đối chiếu theo chuỗi:
$$\text{Requirement (FR/NFR)} \longleftrightarrow \text{Use Case (UC)} \longleftrightarrow \text{Screen (SCR)} \longleftrightarrow \text{API Endpoint} \longleftrightarrow \text{DB Tables} \longleftrightarrow \text{Test Case}$$

---

## 6. Quy Trình Phân Tích Yêu Cầu
```text
1. Tiếp nhận Đề bài / Yêu cầu nghiệp vụ mới
   ↓
2. Xác định Actor & Phạm vi ảnh hưởng
   ↓
3. Phân loại FR/NFR & Áp dụng Business Rules liên quan
   ↓
4. Soạn thảo Đặc tả Use Case chi tiết (Basic & Alternative Flows)
   ↓
5. Cập nhật Ma trận truy vết RTM
```
