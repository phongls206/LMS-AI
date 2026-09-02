---
name: context-builder
description: Quy chuẩn và quy trình khảo sát hiện trạng, thu thập yêu cầu bài toán (20 câu hỏi khảo sát), xác định cơ cấu nhân sự, phạm vi và xây dựng ngữ cảnh ban đầu cho hệ thống ETC English Center.
---

# Context Builder Skill (Khảo Sát Hiện Trạng & Khởi Tạo Ngữ Cảnh)

## 1. Mục Đích & Phạm Vi
Skill này hướng dẫn phương pháp thu thập thông tin, khảo sát thực tế quy trình nghiệp vụ tại trung tâm ngoại ngữ, nhận diện các điểm bất cập của phương thức vận hành thủ công và thiết lập hồ sơ bài toán chuẩn xác cho hệ thống **ETC English Center**.

---

## 2. Quy Chuẩn Khảo Sát Hiện Trạng Đơn Vị

### 2.1 Nhận diện Đơn vị Khảo sát & Cơ cấu Vận hành
Khi xây dựng ngữ cảnh, Agent phải bám sát thông tin cơ sở:
- **Tên đơn vị:** Trung Tâm Ngoại Ngữ ETC Native.
- **Lĩnh vực hoạt động:** Đào tạo ngoại ngữ, luyện thi chứng chỉ quốc tế (IELTS, TOEIC, CEFR A1-C2), tiếng Anh giao tiếp.
- **3 Nhóm nhân sự nội bộ chuyên trách:**
  1. *Ban Quản lý (Admin/Manager):* Quản trị toàn diện, ban hành khóa học, mở lớp, xếp lịch, phân công giáo viên, theo dõi doanh thu/báo cáo.
  2. *Bộ phận Tư vấn (Counselor/Front-desk):* Tiếp đón học viên, tổ chức Placement Test, tư vấn lộ trình, tiếp nhận đăng ký, thu học phí và theo dõi công nợ.
  3. *Đội ngũ Giáo viên (Teacher/Instructor):* Giảng dạy theo đề cương, điểm danh chuyên cần từng buổi, chấm điểm Giữa kỳ/Cuối kỳ, soạn bài tập bổ trợ.

### 2.2 Bộ 20 Câu Hỏi Khảo Sát Nghiệp Vụ Chuẩn
Agent sử dụng bộ câu hỏi khảo sát chia theo 5 nhóm trọng tâm để thu thập dữ liệu:
1. **Cơ cấu tổ chức & Phân quyền:** Câu 1 (Phân công trách nhiệm 3 vai trò nội bộ).
2. **Tiếp nhận & Xếp lớp:** Câu 2 (Tiếp nhận hồ sơ mới), Câu 3 (Quy trình thi xếp lớp CEFR đầu vào), Câu 6 (Quy định sĩ số tối đa 25 học viên).
3. **Quản lý Đào tạo & Xếp lịch:** Câu 4 (Ban hành khóa học chuẩn), Câu 5 (Lập kế hoạch mở lớp), Câu 7 (Xếp thời khóa biểu chống trùng phòng), Câu 8 & 9 (Phân công giáo viên và xử lý dạy thay).
4. **Tài chính & Học phí:** Câu 10 (Tiếp nhận đơn đăng ký học), Câu 11 (Quy trình thu học phí và xuất biên lai), Câu 12 (Quản lý và đôn đốc công nợ đóng nhiều đợt).
5. **Học tập, Điểm danh & Đánh giá:** Câu 13 (Theo dõi tiến độ buổi học), Câu 14 (Điểm danh 4 trạng thái), Câu 15 (Quy chế chuyên cần tối thiểu 80%), Câu 16 & 17 (Tổ chức thi, công thức tính điểm 20/30/50 và điều kiện Đạt), Câu 18 (Biên soạn bài tập bổ trợ), Câu 19 (Báo cáo thống kê), Câu 20 (Tổng hợp bất cập lớn nhất).

### 2.3 Phân Tích Điểm Nghẽn Hiện Trạng (Pain Points)
Agent phải đối chiếu giải pháp với 5 bất cập lớn nhất:
- Dữ liệu phân tán trên sổ tay/file Excel rời rạc.
- Xung đột trùng phòng học và trùng giờ dạy của giáo viên khi xếp lịch thủ công.
- Khó kiểm soát công nợ đóng nhiều đợt.
- Tốn nhiều thời gian điểm danh và tính điểm thủ công.
- Thiếu công cụ AI hỗ trợ tư vấn lớp phù hợp và sinh bài tập theo trình độ.

---

## 3. Quy Trình 4 Bước Khởi Tạo Ngữ Cảnh Dự Án

```text
1. Đọc Source of Truth (de_tai_42.md & EnglishCenterTOP.docx)
   ↓
2. Xác định Ranh giới Hệ thống & Tác nhân liên quan
   ↓
3. Tổng hợp Bảng Khảo sát Nghiệp vụ & Danh mục Bất cập
   ↓
4. Thiết lập Mục tiêu Phát biểu Bài toán & Định hướng Công nghệ
```

---

## 4. Nguyên Tắc Bắt Buộc Khi Thực Hiện
- **Trung thực với dữ liệu khảo sát:** Không tự suy diễn quy trình khác với thực tế tại đơn vị khảo sát (ETC Native).
- **Tính kế thừa:** Mọi yêu cầu phát sinh ở các giai đoạn sau (SRS, Database, Code) đều phải bắt nguồn từ các điểm nghẽn và quy trình đã ghi nhận trong bước khảo sát này.
