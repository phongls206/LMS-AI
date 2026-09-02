---
name: ai-design
description: Quy chuẩn Prompt Engineering, nguyên tắc Zero-Trust, cơ chế lọc ảo giác (Validation), kiến trúc Fallback và lưu Audit Log cho 3 chức năng GenAI của ETC English Center.
---

# AI Design Skill (Thiết Kế Tích Hợp GenAI & Kiểm Soát Rủi Ro)

## 1. Mục Đích & Phạm Vi
Skill này quy định phương pháp tích hợp mô hình ngôn ngữ lớn (Google Gemini API), thiết kế cấu trúc Prompt chuẩn, thiết lập quy tắc kiểm duyệt đầu vào/đầu ra (Input/Output Validation), xử lý cơ chế dự phòng (Fallback Rule-based) và lưu vết kiểm toán (Audit Logging) cho 3 chức năng AI của hệ thống **ETC English Center**.

---

## 2. Nguyên Tắc Cốt Lõi Khi Tích Hợp GenAI (Zero-Trust)

1. **Zero-Trust (Không tin tưởng tuyệt đối):** Mọi kết quả do AI sinh ra phải được xem là dữ liệu chưa kiểm chứng, bắt buộc đi qua bộ lọc và xác thực (Post-processing Validator) trước khi trả về cho người dùng.
2. **Nguyên tắc dữ liệu tối thiểu:** Chỉ gửi các trường dữ liệu cần thiết (CEFR, giờ rảnh, danh sách lớp đang mở, điểm số), tuyệt đối không gửi thông tin nhạy cảm (mật khẩu, CCCD, thông tin thanh toán cá nhân) lên dịch vụ AI.
3. **Không cam kết / Không bịa đặt:** AI không được cam kết đầu ra (như "chắc chắn đậu IELTS 8.0") và không được gợi ý các lớp không tồn tại trong CSDL.
4. **Giới hạn thời gian chờ (Timeout <= 15s):** Mọi lệnh gọi AI phải gắn Timeout tối đa 15 giây. Nếu quá hạn hoặc gặp lỗi mạng $\rightarrow$ thử lại tối đa 1 lần $\rightarrow$ chuyển ngay sang phương án Fallback Rule-based.

---

## 3. Đặc Tả 3 Chức Năng GenAI & Template Prompt Chuẩn

### 3.1 Chức Năng 1: AI Tư Vấn Lớp Phù Hợp (`UC012` / `FR-AI-001`)
- **Đầu vào:** Trình độ CEFR (`level`), Lịch rảnh (`availability`), Danh sách lớp đang mở & còn chỗ (`classes_json`).
- **System Prompt:**
  ```text
  Bạn là chuyên viên tư vấn đào tạo của trung tâm ngoại ngữ ETC English.
  Nhiệm vụ: Phân tích trình độ và lịch rảnh của học viên để gợi ý tối đa 3 lớp học phù hợp nhất từ danh sách lớp được cung cấp.
  RÀNG BUỘC BẮT BUỘC:
  1. Chỉ được chọn các lớp có trong danh sách được cung cấp. Tuyệt đối không gợi ý lớp không có mã trong dữ liệu.
  2. Tuyệt đối không cam kết điểm số hoặc kết quả đầu ra.
  3. Trả về đúng định dạng JSON: [{"maLopHoc": "...", "tenLopHoc": "...", "lyDoPhuHop": "..."}]
  ```
- **Hậu kiểm tra (Validation):**
  - Parse JSON kết quả.
  - Đối chiếu từng `maLopHoc` trong kết quả với danh sách `LopHocAvailable` từ CSDL. Loại bỏ ngay bất kỳ lớp nào không khớp mã.
- **Cơ chế Dự phòng (Fallback):**
  - Thuật toán Rule-based: Lọc CSDL các lớp có `trinhDoYeuCau == level` và thời khóa biểu nằm trong khoảng `lichRanh` của học viên $\rightarrow$ sắp xếp theo số chỗ trống còn lại.

### 3.2 Chức Năng 2: AI Sinh Bài Luyện Tập Ngắn (`UC013` / `FR-AI-002`)
- **Đầu vào:** Chủ đề ôn tập (`topic`), Trình độ CEFR mục tiêu (`level`).
- **System Prompt:**
  ```text
  Bạn là giáo viên biên soạn đề thi tiếng Anh chuyên nghiệp.
  Nhiệm vụ: Sinh 01 bài luyện tập trắc nghiệm ngắn gồm đúng 5 câu hỏi về chủ đề "{{topic}}", chuẩn độ khó CEFR "{{level}}".
  RÀNG BUỘC BẮT BUỘC:
  1. Bài tập phải có đúng 5 câu hỏi trắc nghiệm (mỗi câu 4 lựa chọn A, B, C, D).
  2. Bắt buộc kèm theo đáp án đúng và lời giải thích ngắn gọn, dễ hiểu cho từng câu.
  3. Trả về đúng định dạng JSON:
  {
    "topic": "...",
    "level": "...",
    "questions": [
      {
        "id": 1,
        "question": "...",
        "options": {"A": "...", "B": "...", "C": "...", "D": "..."},
        "correctAnswer": "A",
        "explanation": "..."
      }
    ]
  }
  ```
- **Hậu kiểm tra (Validation):** Kiểm tra mảng `questions` có đúng 5 phần tử, kiểm tra sự tồn tại của `correctAnswer` và `explanation`.
- **Cơ chế Dự phòng (Fallback):** Lấy bài tập mẫu có sẵn từ ngân hàng đề tĩnh theo cặp `(topic, level)`.

### 3.3 Chức Năng 3: AI Tóm Tắt Tiến Độ Học Tập (`UC014` / `FR-AI-003`)
- **Đầu vào:** Dữ liệu điểm danh (`attendance_summary`), Bảng điểm các kỳ & Nhận xét của giáo viên (`grades_data`).
- **System Prompt:**
  ```text
  Bạn là trợ lý học tập thông minh.
  Nhiệm vụ: Tóm tắt tiến độ học tập của học viên dựa CHÍNH XÁC trên dữ liệu điểm danh và điểm số được cung cấp.
  RÀNG BUỘC BẮT BUỘC:
  1. Chỉ nhận xét dựa trên dữ kiện đã có, tuyệt đối không suy diễn hoặc bịa đặt thành tích.
  2. Cấu trúc tóm tắt gồm 3 phần: (1) Điểm mạnh nổi bật, (2) Kỹ năng cần cải thiện, (3) Định hướng ôn tập cho kỳ thi tiếp theo.
  ```
- **Hậu kiểm tra (Validation):** Kiểm tra nội dung tóm tắt không chứa các tuyên bố vi phạm chính sách dữ liệu.
- **Cơ chế Dự phòng (Fallback):** Tổng hợp tóm tắt theo quy tắc: Đếm số buổi có mặt/vắng, tỷ lệ chuyên cần %, so sánh điểm giữa kỳ/cuối kỳ với mốc 50 điểm để xuất đánh giá cơ bản.

---

## 4. Quy Chuẩn Ghi Nhật Ký Kiểm Toán (Audit Logging)
Mọi lượt tương tác với dịch vụ GenAI bắt buộc phải lưu vào bảng `YeuCauAI`:
- `nguoi_dung_id`: ID người dùng yêu cầu.
- `loai_chuc_nang`: `CONSULT_CLASS` | `GENERATE_EXERCISE` | `SUMMARIZE_PROGRESS`.
- `prompt_input`: Chuỗi Prompt đã gửi đi.
- `raw_output`: Chuỗi phản hồi gốc từ Gemini API.
- `validated_output_json`: Kết quả sạch sau khi đã qua bộ lọc kiểm duyệt.
- `trang_thai`: `SUCCESS` | `FALLBACK` | `ERROR`.
- `thoi_gian_xu_ly_ms`: Thời gian xử lý (ms).
