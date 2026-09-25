# Test Cases — ETC English Center LMS AI

**Tổng số:** 45 ca kiểm thử  
**Nguồn:** `docs/design/EnglishCenterTOP.docx` — Bảng 9.3  
**Phạm vi:** 14 Use Case (UC001–UC014) + Audit Log AI  
**Ngày lập:** 01/09/2026

> Mỗi ca kiểm thử bao phủ luồng chính (Main Flow), luồng ngoại lệ (Alternative Flow), điều kiện biên và kiểm soát an toàn AI.

---

## UC001 — Đăng nhập và phân quyền (TC001–TC009)

| ID | Chức năng | Mô tả ca kiểm thử | Điều kiện trước | Dữ liệu Test | Kết quả mong muốn | Ghi chú |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| TC001 | Đăng nhập (UC001) | Đăng nhập thành công vai trò Quản lý | Tài khoản admin01 tồn tại | admin01 / Admin@123 | HTTP 200, cấp JWT, chuyển hướng /admin/dashboard | Bảo mật Argon2 |
| TC002 | Đăng nhập (UC001) | Đăng nhập thành công vai trò Giáo viên | Tài khoản teacher01 tồn tại | teacher01 / Admin@123 | HTTP 200, cấp JWT, chuyển hướng /teacher/dashboard | Bảo mật Argon2 |
| TC003 | Đăng nhập (UC001) | Đăng nhập thành công vai trò Học viên | Tài khoản student01 tồn tại | student01 / Admin@123 | HTTP 200, cấp JWT, chuyển hướng /student/dashboard | Bảo mật Argon2 |
| TC004 | Đăng nhập (UC001) | Đăng nhập thành công vai trò Tư vấn viên | Tài khoản staff01 tồn tại | staff01 / Admin@123 | HTTP 200, cấp JWT, chuyển hướng /staff/dashboard | Bảo mật Argon2 |
| TC005 | Đăng nhập (UC001) | Đăng nhập thất bại khi sai mật khẩu | Tài khoản admin01 tồn tại | admin01 / SaiMatKhau@123 | HTTP 401 Unauthorized, thông báo mật khẩu không đúng | Xử lý ngoại lệ |
| TC006 | Đăng nhập (UC001) | Đăng nhập thất bại khi tài khoản không tồn tại | Hệ thống đang chạy | unknown_user / Admin@123 | HTTP 401 Unauthorized, thông báo tài khoản không tồn tại | Xử lý ngoại lệ |
| TC007 | Đổi mật khẩu (UC001) | Đổi mật khẩu thành công khi nhập đúng MK cũ | Đã đăng nhập tài khoản | MK cũ: Admin@123, MK mới: NewPass@123 | HTTP 200, cập nhật mật khẩu băm Argon2 mới vào CSDL | Bảo mật tài khoản |
| TC008 | Đổi mật khẩu (UC001) | Đổi mật khẩu thất bại khi xác nhận MK không khớp | Đã đăng nhập tài khoản | MK mới: Pass123, Xác nhận: Pass456 | Chặn ở Frontend/Backend, thông báo xác nhận không khớp | Validation |
| TC009 | Đổi mật khẩu (UC001) | Đổi mật khẩu thất bại khi MK mới dưới 6 ký tự | Đã đăng nhập tài khoản | MK mới: 12345 | HTTP 400 Bad Request, yêu cầu độ dài tối thiểu 6 ký tự | Validation |

---

## UC002 — Quản lý học viên và hồ sơ trình độ (TC010–TC014)

| ID | Chức năng | Mô tả ca kiểm thử | Điều kiện trước | Dữ liệu Test | Kết quả mong muốn | Ghi chú |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| TC010 | Hồ sơ Học viên (UC002) | Tạo mới học viên thành công (ACID Transaction) | Đăng nhập quyền Quản lý/TVV | Mã: HV005, Họ tên: Lê Văn C, CEFR: B1 | Tạo đồng thời bản ghi nguoi_dung và ho_so_hoc_vien | ACID Transaction |
| TC011 | Hồ sơ Học viên (UC002) | Chặn tạo học viên khi trùng Mã học viên | Mã HV001 đã có trong CSDL | Mã: HV001, Họ tên: Trần D | HTTP 400, thông báo Mã học viên đã tồn tại | Ràng buộc Unique |
| TC012 | Hồ sơ Học viên (UC002) | Chặn tạo học viên khi trùng Tên đăng nhập | Username student01 đã có | Username: student01, Email: test@edu.vn | HTTP 400, thông báo Tên đăng nhập đã tồn tại | Ràng buộc Unique |
| TC013 | Hồ sơ Học viên (UC002) | Lọc danh sách học viên theo trình độ CEFR | Đăng nhập quyền Quản lý/TVV | Filter: CEFR = B1 | Chỉ hiển thị các học viên có trình độ B1 trong danh sách | Bộ lọc nghiệp vụ |
| TC014 | Hồ sơ Học viên (UC002) | Tìm kiếm học viên theo họ tên hoặc mã số | Đăng nhập quyền Quản lý/TVV | Từ khóa: 'Phạm Văn An' | Trả về đúng kết quả học viên thỏa mãn từ khóa tìm kiếm | Tìm kiếm dữ liệu |

---

## UC003 — Quản lý khóa học (TC015–TC017)

| ID | Chức năng | Mô tả ca kiểm thử | Điều kiện trước | Dữ liệu Test | Kết quả mong muốn | Ghi chú |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| TC015 | Khóa học (UC003) | Tạo mới khóa học thành công | Đăng nhập quyền Quản lý | Mã: KH03, Tên: IELTS Master, Phí: 5M | Tạo khóa học thành công, hiển thị trên danh mục | CRUD Khóa học |
| TC016 | Khóa học (UC003) | Chặn tạo khóa học khi trùng Mã khóa học | Mã KH01 đã tồn tại | Mã: KH01, Tên: Trùng mã | HTTP 400, thông báo Mã khóa học đã tồn tại | Ràng buộc Unique |
| TC017 | Khóa học (UC003) | Validation chặn học phí âm hoặc thời lượng <= 0 | Đăng nhập quyền Quản lý | Học phí: -500000, Tiết: 0 | HTTP 400 Bad Request, từ chối lưu dữ liệu không hợp lệ | Validation số học |

---

## UC004 — Quản lý lớp và lịch học (TC018–TC020)

| ID | Chức năng | Mô tả ca kiểm thử | Điều kiện trước | Dữ liệu Test | Kết quả mong muốn | Ghi chú |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| TC018 | Lớp học (UC004) | Mở lớp học mới với sĩ số tối đa mặc định 25 | Khóa học đã tồn tại | Mã: LOP03, Tên: Lớp IELTS 03 | Tạo lớp với trangThai=DANG_MO_DANG_KY, siSoToiDa=25 | Khống chế sĩ số |
| TC019 | Lịch học (UC004) | Thêm lịch học thành công cho lớp học | Lớp học đã tồn tại | Thứ 3-5 (18h-21h), Phòng P.202 | Lưu thời khóa biểu tuần vào bảng lich_hoc | Xếp lịch lớp |
| TC020 | Lịch học (UC004) | Chặn xếp trùng phòng học cùng ca và thứ trong tuần | Phòng P.101 đã có lớp T2 (18h-21h) | Lớp mới xếp vào P.101, T2 (18h-21h) | HTTP 400, thông báo Phòng P.101 đã có lớp học trong ca này | Chống trùng phòng |

---

## UC005 — Quản lý giáo viên và phân công lớp (TC021–TC023)

| ID | Chức năng | Mô tả ca kiểm thử | Điều kiện trước | Dữ liệu Test | Kết quả mong muốn | Ghi chú |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| TC021 | Phân công GV (UC005) | Phân công giảng viên chính cho lớp học | Giáo viên và lớp đã tồn tại | Gán GV001 cho lớp LOP01 | Lưu bản ghi phan_cong_giao_vien với vaiTro=CHINH | Phân công dạy |
| TC022 | Phân công GV (UC005) | Chặn phân công trùng giờ dạy của giáo viên | GV001 đã có lịch dạy T2 ca tối | Gán GV001 vào lớp khác cũng học T2 ca tối | HTTP 400, thông báo Giảng viên đã có lịch dạy lớp khác | Chống trùng lịch GV |
| TC023 | Lịch dạy GV (UC005) | Giảng viên tra cứu lịch giảng dạy cá nhân | Đăng nhập tài khoản teacher01 | Truy cập /teacher/dashboard | Hiển thị đúng các lớp và lịch dạy của riêng teacher01 | Bảo mật RBAC |

---

## UC006 — Đăng ký lớp (TC024–TC029)

| ID | Chức năng | Mô tả ca kiểm thử | Điều kiện trước | Dữ liệu Test | Kết quả mong muốn | Ghi chú |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| TC024 | Đăng ký lớp (UC006) | Đăng ký lớp thành công khi thỏa 4 điều kiện | Học viên B1, lớp còn chỗ, không trùng lịch | HV001 đăng ký LOP01 (CEFR B1) | Đăng ký thành công, sĩ số +1, tự động sinh Hóa đơn học phí | ACID Transaction |
| TC025 | Đăng ký lớp (UC006) | Chặn đăng ký khi lớp học đã đầy sĩ số (>= 25) | Lớp đã đạt sĩ số 25/25 | Học viên đăng ký vào lớp đầy | HTTP 400, thông báo Lớp học đã đủ sĩ số tối đa | Khống chế 25 HV |
| TC026 | Đăng ký lớp (UC006) | Chặn đăng ký khi học viên đã ghi danh lớp này | HV001 đã có trong lớp LOP01 | HV001 bấm đăng ký lại LOP01 | HTTP 400, thông báo Học viên đã đăng ký lớp học này rồi | Chống trùng lặp |
| TC027 | Đăng ký lớp (UC006) | Chặn đăng ký khi CEFR học viên < yêu cầu khóa | Học viên có CEFR A2 | Đăng ký vào lớp yêu cầu CEFR B2 | HTTP 400, thông báo Trình độ CEFR chưa đạt yêu cầu đầu vào | Kiểm tra CEFR |
| TC028 | Đăng ký lớp (UC006) | Chặn đăng ký khi lịch học bị trùng lớp đang học | HV đang học lớp T2-T4 tối | Đăng ký thêm lớp khác cũng học T2-T4 tối | HTTP 400, thông báo Lịch học bị trùng với lớp đang theo học | Chống trùng lịch HV |
| TC029 | Tự sinh hóa đơn (UC006) | Tự động sinh Hóa đơn học phí sau khi ghi danh | Đăng ký lớp thành công | Lớp học phí 3.000.000đ | Sinh hóa đơn mã HD..., số tiền 3.000.000đ, trạng thái CHUA_THANH_TOAN | Tự động hóa tài chính |

---

## UC007 — Quản lý học phí (TC030–TC032)

| ID | Chức năng | Mô tả ca kiểm thử | Điều kiện trước | Dữ liệu Test | Kết quả mong muốn | Ghi chú |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| TC030 | Thu học phí (UC007) | Thu đủ 100% học phí chuyển trạng thái ĐÃ HOÀN THÀNH | Hóa đơn nợ 3.000.000đ | Nộp đủ 3.000.000đ tiền mặt | Lưu thanh_toan, cập nhật hoa_don -> DA_HOAN_THANH | Tất toán công nợ |
| TC031 | Thu học phí (UC007) | Thu học phí nhiều đợt (Thanh toán từng phần) | Hóa đơn nợ 3.000.000đ | Đợt 1 nộp 1.500.000đ | Lưu thanh_toan, hoa_don chuyển THANH_TOAN_MOT_PHAN, nợ 1.5M | Đóng phí nhiều đợt |
| TC032 | Thu học phí (UC007) | Tính toán chính xác số dư công nợ sau nhiều đợt | Đã nộp 1.5M / 3M | Đợt 2 nộp tiếp 1.500.000đ | Số tiền đã trả = 3M, nợ = 0đ, tự động chuyển DA_HOAN_THANH | Cộng dồn số tiền |

---

## UC008 — Điểm danh (TC033–TC034)

| ID | Chức năng | Mô tả ca kiểm thử | Điều kiện trước | Dữ liệu Test | Kết quả mong muốn | Ghi chú |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| TC033 | Điểm danh (UC008) | Ghi nhận 4 trạng thái chuyên cần cho từng học viên | Buổi học số 1 đang diễn ra | HV1: CO_MAT, HV2: DI_MUON, HV3: CO_PHEP, HV4: VANG | Lưu chính xác 4 trạng thái vào bảng ban_ghi_diem_danh | 4 trạng thái chuẩn |
| TC034 | Điểm danh (UC008) | Cập nhật điều chỉnh lại trạng thái điểm danh buổi học | Đã điểm danh trước đó | Đổi HV4 từ VANG sang CO_PHEP | Cập nhật thành công trạng thái mới cho học viên trong CSDL | Điều chỉnh chuyên cần |

---

## UC009 — Ghi nhận kết quả học tập (TC035–TC037)

| ID | Chức năng | Mô tả ca kiểm thử | Điều kiện trước | Dữ liệu Test | Kết quả mong muốn | Ghi chú |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| TC035 | Nhập điểm (UC009) | Tự động tính điểm tổng kết: CC×0.2 + GK×0.3 + CK×0.5 | Học viên hoàn thành khóa | CC = 90, GK = 80, CK = 85 | Điểm tổng kết = 90×0.2 + 80×0.3 + 85×0.5 = 84.50 | Công thức 20/30/50 |
| TC036 | Xét kết quả (UC009) | Tự động xếp loại ĐẠT khi Điểm TK >= 50 và CC >= 80 | Nhập điểm học viên | Điểm TK = 65.0, CC = 85.0 | Hệ thống tự động gán trangThaiHoanThanh = DAT | Quy chuẩn ĐẠT |
| TC037 | Xét kết quả (UC009) | Tự động xếp loại KHÔNG ĐẠT khi vi phạm điều kiện | Nhập điểm học viên | TH1: TK=45, CC=90; TH2: TK=70, CC=75 | Hệ thống tự động gán trangThaiHoanThanh = KHONG_DAT | Quy chuẩn KHÔNG ĐẠT |

---

## UC010 — Tra cứu lịch, lớp và học phí (TC038)

| ID | Chức năng | Mô tả ca kiểm thử | Điều kiện trước | Dữ liệu Test | Kết quả mong muốn | Ghi chú |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| TC038 | Tra cứu (UC010) | Học viên tra cứu thời khóa biểu và bảng điểm cá nhân | Đăng nhập tài khoản student01 | Truy cập /student/grades và /student/schedule | Chỉ hiển thị dữ liệu của student01, không xem được học viên khác | Bảo mật phân quyền |

---

## UC011 — Xem thống kê (TC039)

| ID | Chức năng | Mô tả ca kiểm thử | Điều kiện trước | Dữ liệu Test | Kết quả mong muốn | Ghi chú |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| TC039 | Thống kê (UC011) | Dashboard thống kê doanh thu, sĩ số và tỷ lệ hoàn thành | Đăng nhập quyền Quản lý | Truy cập /admin/reports | Tổng hợp chính xác doanh thu thực thu, sĩ số các lớp và % ĐẠT | Thống kê thời gian thực |

---

## UC012 — AI tư vấn lớp phù hợp (TC040–TC041)

| ID | Chức năng | Mô tả ca kiểm thử | Điều kiện trước | Dữ liệu Test | Kết quả mong muốn | Ghi chú |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| TC040 | AI Tư vấn (UC012) | AI gợi ý tối đa 3 lớp học thực tế theo CEFR & lịch rảnh | Đăng nhập Học viên/TVV | CEFR: B1, Lịch rảnh: Thứ 2-4-6 | AI đối soát CSDL thực tế, chỉ gợi ý lớp có thật còn chỗ | Lọc ảo giác Zero-Trust |
| TC041 | AI Tư vấn (UC012) | Tự động kích hoạt Rule-based Fallback khi mất mạng/lỗi AI | Ngắt kết nối Internet | Bấm 'Tư vấn lớp' | Kích hoạt thuật toán Fallback, trả về danh sách lớp chuẩn CEFR | Kiến trúc Fallback |

---

## UC013 — AI sinh bài luyện tập ngắn (TC042–TC043)

| ID | Chức năng | Mô tả ca kiểm thử | Điều kiện trước | Dữ liệu Test | Kết quả mong muốn | Ghi chú |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| TC042 | AI Sinh đề (UC013) | AI tạo tức thì các câu trắc nghiệm JSON chuẩn CEFR | Đăng nhập Giáo viên/HV | Chủ đề: Present Perfect, CEFR: B1 | Trả về đúng 5/10/15 câu hỏi có 4 lựa chọn, đáp án đúng và giải thích | Google Gemini SDK |
| TC043 | AI Sinh đề (UC013) | Tự động kích hoạt Template Fallback khi quá thời gian 10s | Giả lập mạng chậm > 10s | Bấm 'Sinh đề AI' | Hệ thống tự động lấy bộ câu hỏi mẫu chuẩn theo CEFR | Timeout 10s |

---

## UC014 — AI tóm tắt tiến độ học tập (TC044)

| ID | Chức năng | Mô tả ca kiểm thử | Điều kiện trước | Dữ liệu Test | Kết quả mong muốn | Ghi chú |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| TC044 | AI Tóm tắt (UC014) | AI tóm tắt tiến độ, điểm mạnh/yếu và lời khuyên ôn tập | Đăng nhập Học viên | Chọn lớp học đang theo học | AI phân tích chuyên cần + điểm thi, đưa lời khuyên cá nhân hóa | Personalized GenAI |

---

## Audit Log AI (TC045)

| ID | Chức năng | Mô tả ca kiểm thử | Điều kiện trước | Dữ liệu Test | Kết quả mong muốn | Ghi chú |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| TC045 | AI Audit Log (UC012-14) | Ghi nhận nhật ký kiểm toán cho mọi lượt gọi AI | Thực hiện bất kỳ tác vụ AI | Gọi API /ai/* | Tự động lưu prompt, response, latencyMs, mode vào yeu_cau_ai | Audit & Security |

---

## Tổng kết phân bổ Test Cases

| Use Case | Số TC | Phạm vi kiểm thử |
| :--- | :--- | :--- |
| UC001 — Đăng nhập & phân quyền | 9 | TC001–TC009 |
| UC002 — Quản lý học viên | 5 | TC010–TC014 |
| UC003 — Quản lý khóa học | 3 | TC015–TC017 |
| UC004 — Quản lý lớp & lịch học | 3 | TC018–TC020 |
| UC005 — Quản lý giáo viên | 3 | TC021–TC023 |
| UC006 — Đăng ký lớp | 6 | TC024–TC029 |
| UC007 — Quản lý học phí | 3 | TC030–TC032 |
| UC008 — Điểm danh | 2 | TC033–TC034 |
| UC009 — Ghi nhận kết quả | 3 | TC035–TC037 |
| UC010 — Tra cứu | 1 | TC038 |
| UC011 — Xem thống kê | 1 | TC039 |
| UC012 — AI tư vấn lớp | 2 | TC040–TC041 |
| UC013 — AI sinh bài luyện tập | 2 | TC042–TC043 |
| UC014 — AI tóm tắt tiến độ | 1 | TC044 |
| AI Audit Log | 1 | TC045 |
| **TỔNG** | **45** | **TC001–TC045** |

