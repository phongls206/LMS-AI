Hệ thống quản lý trung tâm ngoại ngữ có tích hợp AI
1. Mô tả bài toán

Trung tâm ngoại ngữ cần quản lý học viên, khóa học, lớp, giáo viên, lịch học, điểm danh, học phí và kết quả học tập. Học viên thường cần tư vấn lớp phù hợp và ôn tập theo trình độ. Hệ thống cần quản lý trung tâm ngoại ngữ và tích hợp AI tư vấn lớp, sinh bài luyện tập ngắn và tóm tắt tiến độ học.
2. Mục tiêu

- Quản lý học viên, khóa học, lớp, giáo viên, lịch học, học phí và điểm danh.
- Tích hợp AI để tư vấn lớp, sinh bài luyện tập, tóm tắt tiến độ.
- Sử dụng AI trong SDLC và kiểm thử chức năng AI học tập.
3. Yêu cầu chức năng
3.1. Chức năng quản lý
1. Đăng nhập và phân quyền quản lý, giáo viên, học viên, tư vấn viên.
2. Quản lý học viên và hồ sơ trình độ.
3. Quản lý khóa học, lớp học, lịch học.
4. Quản lý giáo viên và phân công lớp.
5. Quản lý đăng ký học và học phí.
6. Điểm danh và ghi nhận kết quả học tập.
7. Tra cứu lịch học, lớp, học phí.
8. Thống kê sĩ số, doanh thu, tỷ lệ hoàn thành khóa.
3.2. Chức năng AI
1. AI tư vấn lớp phù hợp theo trình độ và lịch rảnh.
2. AI sinh bài luyện tập ngắn theo chủ đề và trình độ.
3. AI tóm tắt tiến độ học tập của học viên.
4. Yêu cầu kỹ thuật

- Backend FastAPI/Flask/Django; frontend React/Vue/HTML.
- CSDL SQLite/MySQL/PostgreSQL.
- AI Engine OpenAI/Gemini/Claude/Hugging Face/Ollama.
- Có test cho đăng ký lớp, học phí, điểm danh và AI.
5. Dữ liệu đầu vào, đầu ra và dữ liệu hệ thống

- Dữ liệu chính: học viên, khóa học, lớp, giáo viên, lịch học, học phí, điểm danh, kết quả.
- Đầu vào AI: trình độ, lịch rảnh, khóa học, kết quả học tập.
- Đầu ra AI: gợi ý lớp, bài luyện tập, tóm tắt tiến độ.

Prompt mẫu:

System: Bạn là trợ lý tư vấn trung tâm ngoại ngữ. Chỉ gợi ý lớp có trong dữ liệu và không cam kết kết quả học tập.
User: Học viên có trình độ {{level}}, lịch rảnh {{availability}}. Danh sách lớp: {{classes}}. Hãy gợi ý lớp phù hợp.
6. Hướng dẫn sử dụng AI trong từng giai đoạn SDLC

- KT1: Dùng AI phân tích khóa/lớp/học phí/điểm danh; thiết kế CSDL và chức năng AI.
- KT2: Dùng AI sinh CRUD học viên, lớp, giáo viên, học phí; debug lịch học.
- KT3: Dùng AI thiết kế prompt tư vấn và sinh bài tập; test trình độ không rõ.
- Cuối kỳ: Dùng AI viết tài liệu, báo cáo, slide và đánh giá chất lượng AI.
7. Mức độ khó

Trung bình: Dù gần lĩnh vực giáo dục, miền nghiệp vụ khác quản lý đào tạo đại học; AI hỗ trợ tư vấn lớp và luyện tập.
