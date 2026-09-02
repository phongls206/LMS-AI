---
name: documentation
description: Quy chuẩn soạn thảo báo cáo bài tập lớn, cấu trúc tài liệu SRS/Thiết kế hệ thống và cẩm nang hướng dẫn sử dụng (User Guide) cho ETC English Center.
---

# Documentation Skill (Quy Chuẩn Soạn Thảo Báo Cáo & Tài Liệu Kỹ Thuật)

## 1. Mục Đích & Phạm Vi
Skill này quy định quy chuẩn trình bày, bố cục tài liệu kỹ thuật, cách viết báo cáo bài tập lớn và biên soạn cẩm nang hướng dẫn sử dụng (User Guide) theo đúng biểu mẫu giảng viên yêu cầu cho dự án **ETC English Center**.

---

## 2. Quy Chuẩn Bố Cục Báo Cáo Chuẩn (9 Chương Đề Tài)

Mọi tài liệu báo cáo đầy đủ phải tuân thủ chuẩn 9 chương:
- **Trang bìa & Mục lục:** Danh mục bảng, danh mục hình ảnh, kế hoạch chi tiết 9 tuần.
- **Lời giới thiệu:** Đặt vấn đề và tính cần thiết của đề tài.
- **Chương 1: Khảo sát hiện trạng và Phân tích yêu cầu:** Cơ cấu nhân sự, 20 câu hỏi khảo sát nghiệp vụ, phát biểu bài toán, phân loại FR (FR-001..011, FR-AI-001..003) và NFR (NFR-001..009), sơ đồ phân cấp chức năng.
- **Chương 2: Thiết kế hệ thống & Mô tả tổng quan:** Danh sách tác nhân (4 vai trò), danh sách 14 Use Case, biểu đồ Use Case tổng quát và 4 biểu đồ phân rã.
- **Chương 3: Đặc tả các yêu cầu chức năng:** Chi tiết 14 Use Case kèm Activity Diagram và Sequence Diagram cho từng Use Case.
- **Chương 4: Các thông tin hỗ trợ khác & Thiết kế AI:** Dữ liệu I/O, mẫu Prompt chuẩn, kiểm soát rủi ro và phương án dự phòng Fallback.
- **Chương 5: Thiết kế Hướng đối tượng:** Sơ đồ lớp (Class Diagram) và đặc tả 12 lớp nghiệp vụ.
- **Chương 6: Screen Flow & Database:** Danh mục 21 màn hình, sơ đồ phân luồng theo 4 vai trò, ERD Crow's Foot, 14 bảng quan hệ 3NF và các ràng buộc toàn vẹn.
- **Chương 7: Thiết kế Kiến trúc hệ thống & API:** Kiến trúc 4 tầng, GenAI Pipeline, Deployment Diagram, Tech Stack Matrix, đặc tả RESTful API Endpoints và Ma trận truy vết RTM.
- **Chương 8: Cài đặt và Triển khai hệ thống:** Hướng dẫn cài đặt, cấu hình môi trường `.env`, migration CSDL , giao diện thực tế đã triển khai.
- **Chương 9: Kiểm thử hệ thống & Hướng dẫn sử dụng:** Danh sách Test Case chức năng, kết quả kiểm thử và cẩm nang sử dụng cho từng vai trò người dùng.

---

## 3. Nguyên Tắc Định Dạng & Trình Bày
- Sử dụng tiếng Việt rõ ràng, chuẩn thuật ngữ chuyên ngành công nghệ thông tin.
- Đánh số thứ tự cho Bảng biểu (`Bảng 1`, `Bảng 2`,...) và Hình ảnh (`Hình 1`, `Hình 2`,...).
- Sơ đồ phải sử dụng mã nguồn Mermaid chuẩn hoặc hình ảnh chất lượng cao, không để vỡ nét.
