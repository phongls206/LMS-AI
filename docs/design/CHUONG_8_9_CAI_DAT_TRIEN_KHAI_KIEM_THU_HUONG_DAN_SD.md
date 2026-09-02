# CHƯƠNG 8: CÀI ĐẶT VÀ TRIỂN KHAI HỆ THỐNG

---

## 8.1 Cấu Hình Môi Trường Thực Thi & Cấu Trúc Mã Nguồn

Hệ thống LMS AI được xây dựng theo kiến trúc tách biệt giữa tầng Giao diện (Next.js 14 App Router) và tầng Xử lý nghiệp vụ (NestJS 12 Framework). Dưới đây là các cấu hình môi trường cần thiết để triển khai thực tế:

### 8.1.1 Cấu hình Biến Môi trường (.env)
Toàn bộ các thông số kết nối cơ sở dữ liệu, khóa bảo mật JWT và API Key dịch vụ AI được cô lập trong file `.env` phía máy chủ để đảm bảo an toàn thông tin:
- `DATABASE_URL`: Chuỗi kết nối bảo mật SSL tới hệ quản trị CSDL Neon Serverless PostgreSQL qua kênh Pooling tự động.
- `JWT_SECRET` & `JWT_EXPIRES_IN`: Khóa bí mật dùng để ký chữ ký số HMAC-SHA256 cho mã Token xác thực của 4 vai trò (thời hạn 24 giờ).
- `GEMINI_API_KEY`: Khóa truy cập Google AI Studio để gọi mô hình ngôn ngữ lớn Google Gemini.

### 8.1.2 Cấu trúc Tổ chức Mã nguồn Dự án
Mã nguồn hệ thống được phân rã khoa học thành các thư mục chức năng chuyên biệt:
- `backend/`: Chứa toàn bộ mã nguồn xử lý nghiệp vụ Backend xây dựng bằng NestJS gồm 8 module (`auth`, `users`, `courses`, `classes`, `enrollments`, `attendances`, `grades`, `stats`, `ai`) cùng thư mục `prisma/` quản lý Database Schema 3NF.
- `frontend/`: Chứa 23 màn hình giao diện người dùng Next.js App Router (thư mục `app/admin`, `app/teacher`, `app/student`, `app/staff`), tích hợp TailwindCSS và hệ thống định tuyến RBAC.
- `docs/`: Chứa toàn bộ tài liệu thiết kế hệ thống, sơ đồ kỹ thuật UML/ERD và cẩm nang hướng dẫn vận hành.

---

## 8.2 Khởi Tạo Cơ Sở Dữ Liệu & Nạp Dữ Liệu Mẫu (Database Seeding)

Cơ sở dữ liệu của hệ thống được lưu trữ trực tiếp trên hạ tầng đám mây Neon Serverless PostgreSQL (đặt tại cụm máy chủ AWS), đảm bảo tính khả dụng 24/7 và hỗ trợ mở rộng tài nguyên tự động.

Quy trình khởi tạo CSDL được thực hiện hoàn toàn tự động qua công cụ Prisma ORM:
- **Bước 1 — Đồng bộ Schema:** Thực thi lệnh `npx prisma db push` để khởi tạo 14 bảng quan hệ chuẩn 3NF, thiết lập đầy đủ khóa chính (PK), khóa ngoại (FK) và các ràng buộc toàn vẹn.
- **Bước 2 — Nạp dữ liệu mẫu:** Thực thi lệnh `npm run db:seed` để nạp sẵn danh mục 6 tài khoản người dùng cho 4 vai trò (`admin01`, `teacher01`, `teacher02`, `staff01`, `student01`, `student02`), các khóa học và lớp học ban đầu với mật khẩu băm Argon2 chuẩn an toàn.

---

## 8.3 Kết Quả Cài Đặt Giao Diện & Các Phân Hệ Chức Năng Chính

Dưới đây là kết quả cài đặt và giao diện thực tế tiêu biểu của 6 phân hệ cốt lõi trong hệ thống:

### 8.3.1 Phân Hệ 1: Đăng Nhập & Bàn Làm Việc Quản Trị Trung Tâm
Màn hình đăng nhập (`SCR-AUTH-01`) tích hợp sẵn các nút chọn nhanh tài khoản mẫu cho 4 vai trò, tự động phân giải vai trò qua JWT và chuyển hướng chính xác về Dashboard Quản trị (`SCR-ADM-01`) với các chỉ số hoạt động tổng quan:

![Hình 8.1: Giao diện Dashboard Quản trị trung tâm với các chỉ số hoạt động tổng quan (SCR-ADM-01)](../images/02_admin_dashboard.png)
*Hình 8.1: Giao diện Dashboard Quản trị trung tâm với các chỉ số hoạt động tổng quan (SCR-ADM-01)*

---

### 8.3.2 Phân Hệ 2 & 3: Quản Lý Khóa Học, Lớp Học, Xếp Lịch & Phân Công Giáo Viên
Phân hệ quản lý đào tạo hỗ trợ mở lớp học mới, khống chế sĩ số tối đa 25 học viên, xếp lịch phòng học (có cơ chế kiểm tra chống trùng phòng học) và phân công giảng viên chính (có cơ chế chống trùng lịch dạy của giảng viên):

![Hình 8.2: Giao diện Quản lý Lớp học, Sĩ số và Xếp lịch phòng học (SCR-ADM-03)](../images/04_admin_classes.png)
*Hình 8.2: Giao diện Quản lý Lớp học, Sĩ số và Xếp lịch phòng học (SCR-ADM-03)*

---

### 8.3.3 Phân Hệ 4: Đăng Ký Lớp Học (4 Điều Kiện) & Quản Lý Học Phí
Giao diện đăng ký lớp học cho học viên tự động kiểm tra nghiêm ngặt 4 điều kiện nghiệp vụ (Sĩ số < 25, chưa đăng ký, chuẩn CEFR, không trùng lịch) và tự động sinh Hóa đơn học phí trong cùng một ACID Transaction:

![Hình 8.3: Giao diện Đăng ký Lớp học với cơ chế kiểm tra tự động 4 điều kiện (SCR-STU-02)](../images/10_student_enroll.png)
*Hình 8.3: Giao diện Đăng ký Lớp học với cơ chế kiểm tra tự động 4 điều kiện (SCR-STU-02)*

---

### 8.3.4 Phân Hệ 5: Điểm Danh (4 Trạng Thái) & Bảng Điểm (Công Thức 20/30/50)
Hệ thống hỗ trợ giảng viên điểm danh 4 trạng thái chuyên cần (`Có Mặt`, `Đi Muộn`, `Có Phép`, `Vắng`) và nhập điểm tự động tính toán theo đúng trọng số:
$$\text{Điểm Tổng Kết} = \text{Chuyên Cần} \times 20\% + \text{Giữa Kỳ} \times 30\% + \text{Cuối Kỳ} \times 50\%$$
(xét `ĐẠT` khi $\text{Điểm Tổng Kết} \ge 50.00$ và $\text{Chuyên Cần} \ge 80.00$):

![Hình 8.4: Giao diện Nhập điểm và Tự động tính điểm tổng kết 20/30/50 (SCR-TEA-04)](../images/08_teacher_grades.png)
*Hình 8.4: Giao diện Nhập điểm và Tự động tính điểm tổng kết 20/30/50 (SCR-TEA-04)*

---

### 8.3.5 Phân Hệ 6: Tích Hợp 3 Tính Năng Trí Tuệ Nhân Tạo (GenAI)
Tích hợp mô hình Gemini AI với cơ chế lọc ảo giác Zero-Trust, bảo đảm chỉ gợi ý các lớp học có thật còn chỗ trong CSDL (UC012), tạo tức thì 5 câu hỏi trắc nghiệm tiếng Anh chuẩn CEFR kèm giải thích chi tiết (UC013) và tóm tắt tiến độ học tập cá nhân hóa (UC014):

![Hình 8.5: Giao diện AI Tư vấn lộ trình và gợi ý lớp học chuẩn CEFR (SCR-STU-06)](../images/11_student_ai_consult.png)
*Hình 8.5: Giao diện AI Tư vấn lộ trình và gợi ý lớp học chuẩn CEFR (SCR-STU-06)*

---

## 8.4 Đóng Gói và Triển Khai Hệ Thống

Hệ thống được thiết kế hoàn chỉnh theo quy chuẩn Cloud-Native (Vercel Edge Network cho Frontend, Render/Railway Container cho Backend và Neon Serverless Cloud cho CSDL), tự động sinh tài liệu chuẩn Swagger OpenAPI 32 RESTful APIs tương tác trực tiếp tại `http://localhost:8000/api/docs`:

![Hình 8.6: Giao diện Tài liệu tương tác Swagger OpenAPI 32 RESTful APIs của hệ thống](../images/15_swagger_docs.png)
*Hình 8.6: Giao diện Tài liệu tương tác Swagger OpenAPI 32 RESTful APIs của hệ thống*

---
---

# CHƯƠNG 9: KIỂM THỬ HỆ THỐNG VÀ HƯỚNG DẪN SỬ DỤNG

---

## PHẦN 1: KIỂM THỬ CHỨC NĂNG ỨNG DỤNG (FUNCTIONAL TESTING)

*Thời gian thực hiện kiểm thử: Từ 27/07/2026 đến 27/09/2026 (Theo kế hoạch phát triển 9 tuần của dự án).*

---

### 1. Những Yêu Cầu Về Tài Nguyên Cho Kiểm Thử Ứng Dụng

#### a) Tài nguyên Phần cứng:
Môi trường kiểm thử chức năng được thực hiện trên cấu hình máy tính cá nhân kết nối mạng Internet:

*Bảng 9.1: Cấu hình phần cứng phục vụ kiểm thử ứng dụng*
| CPU | RAM | Ổ cứng (SSD) | Kiến trúc hệ thống (Architecture) |
|:---|:---|:---|:---|
| Intel Core i5 / AMD Ryzen 5, 2.5 GHz trở lên | 8 GB / 16 GB | 50 GB dung lượng trống | x64 (64-bit Operating System) |

#### b) Tài nguyên Phần mềm:
*Bảng 9.2: Danh mục phần mềm và công cụ kiểm thử*
| Tên phần mềm / Công cụ | Phiên bản | Loại công cụ / Mục đích sử dụng |
|:---|:---|:---|
| Visual Studio Code / Antigravity IDE | 1.95+ | Công cụ phát triển mã nguồn & Debug |
| Swagger UI & Postman Client | OpenAPI 3.0 / v11+ | Công cụ kiểm thử RESTful API & Endpoint Authorization |
| Trình duyệt Web (Google Chrome / Edge) | v125+ | Kiểm thử giao diện người dùng (Frontend UI Testing) |
| Neon Console & Prisma Studio | v6.4.1 | Kiểm tra tính toàn vẹn dữ liệu quan hệ (Database Integrity) |
| Hệ điều hành Windows 11 | Build 23H2 (64-bit) | Môi trường thực thi kiểm thử cục bộ |

---

### 2. Danh Sách Các Tình Huống Kiểm Thử Chi Tiết (45 Test Cases)

Toàn bộ 14 Use Case nghiệp vụ và tính năng tích hợp AI được thiết kế chi tiết thành **45 ca kiểm thử** bao phủ toàn diện các trường hợp luồng chính (Main Flow), luồng ngoại lệ (Alternative Flow), các điều kiện biên và kiểm soát an toàn AI:

*Bảng 9.3: Danh mục 45 ca kiểm thử chức năng toàn diện của hệ thống (Test Cases)*
| Test ID | Chức năng | Mô tả ca kiểm thử | Điều kiện trước | Dữ liệu Test | Kết quả mong muốn | Ghi chú |
|:---|:---|:---|:---|:---|:---|:---|
| **TC001** | Đăng nhập (UC001) | Đăng nhập thành công vai trò Quản lý | Tài khoản admin01 tồn tại | `admin01` / `Admin@123` | HTTP 200, cấp JWT, chuyển hướng `/admin/dashboard` | Bảo mật Argon2 |
| **TC002** | Đăng nhập (UC001) | Đăng nhập thành công vai trò Giáo viên | Tài khoản teacher01 tồn tại | `teacher01` / `Admin@123` | HTTP 200, cấp JWT, chuyển hướng `/teacher/dashboard` | Bảo mật Argon2 |
| **TC003** | Đăng nhập (UC001) | Đăng nhập thành công vai trò Học viên | Tài khoản student01 tồn tại | `student01` / `Admin@123` | HTTP 200, cấp JWT, chuyển hướng `/student/dashboard` | Bảo mật Argon2 |
| **TC004** | Đăng nhập (UC001) | Đăng nhập thành công vai trò Tư vấn viên | Tài khoản staff01 tồn tại | `staff01` / `Admin@123` | HTTP 200, cấp JWT, chuyển hướng `/staff/dashboard` | Bảo mật Argon2 |
| **TC005** | Đăng nhập (UC001) | Đăng nhập thất bại khi sai mật khẩu | Tài khoản admin01 tồn tại | `admin01` / `SaiMatKhau@123` | HTTP 401 Unauthorized, thông báo mật khẩu không đúng | Xử lý ngoại lệ |
| **TC006** | Đăng nhập (UC001) | Đăng nhập thất bại khi tài khoản không tồn tại | Hệ thống đang chạy | `unknown_user` / `Admin@123` | HTTP 401 Unauthorized, thông báo tài khoản không tồn tại | Xử lý ngoại lệ |
| **TC007** | Đổi mật khẩu (UC001) | Đổi mật khẩu thành công khi nhập đúng MK cũ | Đã đăng nhập tài khoản | MK cũ: `Admin@123`, MK mới: `NewPass@123` | HTTP 200, cập nhật mật khẩu băm Argon2 mới vào CSDL | Bảo mật tài khoản |
| **TC008** | Đổi mật khẩu (UC001) | Đổi mật khẩu thất bại khi xác nhận MK không khớp | Đã đăng nhập tài khoản | MK mới: `Pass123`, Xác nhận: `Pass456` | Chặn ở Frontend/Backend, thông báo xác nhận không khớp | Validation |
| **TC009** | Đổi mật khẩu (UC001) | Đổi mật khẩu thất bại khi MK mới dưới 6 ký tự | Đã đăng nhập tài khoản | MK mới: `12345` | HTTP 400 Bad Request, yêu cầu độ dài tối thiểu 6 ký tự | Validation |
| **TC010** | Hồ sơ Học viên (UC002) | Tạo mới học viên thành công (ACID Transaction) | Đăng nhập quyền Quản lý/TVV | Mã: `HV005`, Họ tên: `Lê Văn C`, CEFR: `B1` | Tạo đồng thời bản ghi nguoi_dung và ho_so_hoc_vien | ACID Transaction |
| **TC011** | Hồ sơ Học viên (UC002) | Chặn tạo học viên khi trùng Mã học viên | Mã HV001 đã có trong CSDL | Mã: `HV001`, Họ tên: `Trần D` | HTTP 400, thông báo Mã học viên đã tồn tại | Ràng buộc Unique |
| **TC012** | Hồ sơ Học viên (UC002) | Chặn tạo học viên khi trùng Tên đăng nhập | Username student01 đã có | Username: `student01`, Email: `test@edu.vn` | HTTP 400, thông báo Tên đăng nhập đã tồn tại | Ràng buộc Unique |
| **TC013** | Hồ sơ Học viên (UC002) | Lọc danh sách học viên theo trình độ CEFR | Đăng nhập quyền Quản lý/TVV | Filter: `CEFR = B1` | Chỉ hiển thị các học viên có trình độ B1 trong danh sách | Bộ lọc nghiệp vụ |
| **TC014** | Hồ sơ Học viên (UC002) | Tìm kiếm học viên theo họ tên hoặc mã số | Đăng nhập quyền Quản lý/TVV | Từ khóa: `Phạm Văn An` | Trả về đúng kết quả học viên thỏa mãn từ khóa tìm kiếm | Tìm kiếm dữ liệu |
| **TC015** | Khóa học (UC003) | Tạo mới khóa học thành công | Đăng nhập quyền Quản lý | Mã: `KH03`, Tên: `IELTS Master`, Phí: `5.000.000đ` | Tạo khóa học thành công, hiển thị trên danh mục | CRUD Khóa học |
| **TC016** | Khóa học (UC003) | Chặn tạo khóa học khi trùng Mã khóa học | Mã KH01 đã tồn tại | Mã: `KH01`, Tên: `Trùng mã` | HTTP 400, thông báo Mã khóa học đã tồn tại | Ràng buộc Unique |
| **TC017** | Khóa học (UC003) | Validation chặn học phí âm hoặc thời lượng <= 0 | Đăng nhập quyền Quản lý | Học phí: `-500000`, Tiết: `0` | HTTP 400 Bad Request, từ chối lưu dữ liệu không hợp lệ | Validation số học |
| **TC018** | Lớp học (UC004) | Mở lớp học mới với sĩ số tối đa mặc định 25 | Khóa học đã tồn tại | Mã: `LOP03`, Tên: `Lớp IELTS 03` | Tạo lớp với trangThai=DANG_MO_DANG_KY, siSoToiDa=25 | Khống chế sĩ số |
| **TC019** | Lịch học (UC004) | Thêm lịch học thành công cho lớp học | Lớp học đã tồn tại | Thứ 3-5 (18h-21h), Phòng `P.202` | Lưu thời khóa biểu tuần vào bảng lich_hoc | Xếp lịch lớp |
| **TC020** | Lịch học (UC004) | Chặn xếp trùng phòng học cùng ca và thứ trong tuần | Phòng P.101 đã có lớp T2 (18h-21h) | Lớp mới xếp vào `P.101`, T2 (18h-21h) | HTTP 400, thông báo Phòng P.101 đã có lớp học trong ca này | Chống trùng phòng |
| **TC021** | Phân công GV (UC005) | Phân công giảng viên chính cho lớp học | Giáo viên và lớp đã tồn tại | Gán `GV001` cho lớp `LOP01` | Lưu bản ghi phan_cong_giao_vien với vaiTro=CHINH | Phân công dạy |
| **TC022** | Phân công GV (UC005) | Chặn phân công trùng giờ dạy của giáo viên | GV001 đã có lịch dạy T2 ca tối | Gán GV001 vào lớp khác cũng học T2 ca tối | HTTP 400, thông báo Giảng viên đã có lịch dạy lớp khác | Chống trùng lịch GV |
| **TC023** | Lịch dạy GV (UC005) | Giảng viên tra cứu lịch giảng dạy cá nhân | Đăng nhập tài khoản teacher01 | Truy cập `/teacher/dashboard` | Hiển thị đúng các lớp và lịch dạy của riêng teacher01 | Bảo mật RBAC |
| **TC024** | Đăng ký lớp (UC006) | Đăng ký lớp thành công khi thỏa 4 điều kiện | Học viên B1, lớp còn chỗ, không trùng lịch | HV001 đăng ký `LOP01` (CEFR B1) | Đăng ký thành công, sĩ số +1, tự động sinh Hóa đơn học phí | ACID Transaction |
| **TC025** | Đăng ký lớp (UC006) | Chặn đăng ký khi lớp học đã đầy sĩ số (>= 25) | Lớp đã đạt sĩ số 25/25 | Học viên đăng ký vào lớp đầy | HTTP 400, thông báo Lớp học đã đủ sĩ số tối đa | Khống chế 25 HV |
| **TC026** | Đăng ký lớp (UC006) | Chặn đăng ký khi học viên đã ghi danh lớp này | HV001 đã có trong lớp LOP01 | HV001 bấm đăng ký lại LOP01 | HTTP 400, thông báo Học viên đã đăng ký lớp học này rồi | Chống trùng lặp |
| **TC027** | Đăng ký lớp (UC006) | Chặn đăng ký khi CEFR học viên < yêu cầu khóa | Học viên có CEFR A2 | Đăng ký vào lớp yêu cầu CEFR B2 | HTTP 400, thông báo Trình độ CEFR chưa đạt yêu cầu đầu vào | Kiểm tra CEFR |
| **TC028** | Đăng ký lớp (UC006) | Chặn đăng ký khi lịch học bị trùng lớp đang học | HV đang học lớp T2-T4 tối | Đăng ký thêm lớp khác cũng học T2-T4 tối | HTTP 400, thông báo Lịch học bị trùng với lớp đang theo học | Chống trùng lịch HV |
| **TC029** | Tự sinh hóa đơn (UC006) | Tự động sinh Hóa đơn học phí sau khi ghi danh | Đăng ký lớp thành công | Lớp học phí 3.000.000đ | Sinh hóa đơn mã HD..., số tiền 3.000.000đ, trạng thái CHUA_THANH_TOAN | Tự động hóa tài chính |
| **TC030** | Thu học phí (UC007) | Thu đủ 100% học phí chuyển trạng thái ĐÃ HOÀN THÀNH | Hóa đơn nợ 3.000.000đ | Nộp đủ 3.000.000đ tiền mặt | Lưu thanh_toan, cập nhật hoa_don -> DA_HOAN_THANH | Tất toán công nợ |
| **TC031** | Thu học phí (UC007) | Thu học phí nhiều đợt (Thanh toán từng phần) | Hóa đơn nợ 3.000.000đ | Đợt 1 nộp 1.500.000đ | Lưu thanh_toan, hoa_don chuyển THANH_TOAN_MOT_PHAN, nợ 1.5M | Đóng phí nhiều đợt |
| **TC032** | Thu học phí (UC007) | Tính toán chính xác số dư công nợ sau nhiều đợt | Đã nộp 1.5M / 3M | Đợt 2 nộp tiếp 1.500.000đ | Số tiền đã trả = 3M, nợ = 0đ, tự động chuyển DA_HOAN_THANH | Cộng dồn số tiền |
| **TC033** | Điểm danh (UC008) | Ghi nhận 4 trạng thái chuyên cần cho từng học viên | Buổi học số 1 đang diễn ra | HV1: `CO_MAT`, HV2: `DI_MUON`, HV3: `CO_PHEP`, HV4: `VANG` | Lưu chính xác 4 trạng thái vào bảng ban_ghi_diem_danh | 4 trạng thái chuẩn |
| **TC034** | Điểm danh (UC008) | Cập nhật điều chỉnh lại trạng thái điểm danh buổi học | Đã điểm danh trước đó | Đổi HV4 từ VANG sang CO_PHEP | Cập nhật thành công trạng thái mới cho học viên trong CSDL | Điều chỉnh chuyên cần |
| **TC035** | Nhập điểm (UC009) | Tự động tính điểm tổng kết: CC*0.2 + GK*0.3 + CK*0.5 | Học viên hoàn thành khóa | `CC = 90`, `GK = 80`, `CK = 85` | Điểm tổng kết = `90*0.2 + 80*0.3 + 85*0.5 = 84.50` | Công thức 20/30/50 |
| **TC036** | Xét kết quả (UC009) | Tự động xếp loại ĐẠT khi Điểm TK >= 50 và CC >= 80 | Nhập điểm học viên | Điểm TK = `65.0`, CC = `85.0` | Hệ thống tự động gán `trangThaiHoanThanh = DAT` | Quy chuẩn ĐẠT |
| **TC037** | Xét kết quả (UC009) | Tự động xếp loại KHÔNG ĐẠT khi vi phạm điều kiện | Nhập điểm học viên | Trường hợp 1: TK=45, CC=90; Trường hợp 2: TK=70, CC=75 | Hệ thống tự động gán `trangThaiHoanThanh = KHONG_DAT` | Quy chuẩn KHÔNG ĐẠT |
| **TC038** | Tra cứu (UC010) | Học viên tra cứu thời khóa biểu và bảng điểm cá nhân | Đăng nhập tài khoản student01 | Truy cập `/student/grades` và `/student/schedule` | Chỉ hiển thị dữ liệu của student01, không xem được học viên khác | Bảo mật phân quyền |
| **TC039** | Thống kê (UC011) | Dashboard thống kê doanh thu, sĩ số và tỷ lệ hoàn thành | Đăng nhập quyền Quản lý | Truy cập `/admin/reports` | Tổng hợp chính xác doanh thu thực thu, sĩ số các lớp và % ĐẠT | Thống kê thời gian thực |
| **TC040** | AI Tư vấn (UC012) | AI gợi ý tối đa 3 lớp học thực tế theo CEFR & lịch rảnh | Đăng nhập Học viên/TVV | CEFR: `B1`, Lịch rảnh: `Thứ 2-4-6` | AI đối soát CSDL thực tế, chỉ gợi ý lớp có thật còn chỗ | Lọc ảo giác Zero-Trust |
| **TC041** | AI Tư vấn (UC012) | Tự động kích hoạt Rule-based Fallback khi mất mạng/lỗi AI | Ngắt kết nối Internet | Bấm 'Tư vấn lớp' | Kích hoạt thuật toán Fallback, trả về danh sách lớp chuẩn CEFR | Kiến trúc Fallback |
| **TC042** | AI Sinh đề (UC013) | AI tạo tức thì 5 câu trắc nghiệm JSON chuẩn CEFR | Đăng nhập Giáo viên/HV | Chủ đề: `Present Perfect`, CEFR: `B1` | Trả về đúng 5 câu hỏi có 4 lựa chọn, đáp án đúng và giải thích | Google Gemini SDK |
| **TC043** | AI Sinh đề (UC013) | Tự động kích hoạt Template Fallback khi quá thời gian 10s | Giả lập mạng chậm > 10s | Bấm 'Sinh đề AI' | Hệ thống tự động lấy bộ 5 câu hỏi mẫu chuẩn theo CEFR | Timeout 10s |
| **TC044** | AI Tóm tắt (UC014) | AI tóm tắt tiến độ, điểm mạnh/yếu và lời khuyên ôn tập | Đăng nhập Học viên | Chọn lớp học đang theo học | AI phân tích chuyên cần + điểm thi, đưa lời khuyên cá nhân hóa | Personalized GenAI |
| **TC045** | AI Audit Log (UC012-14) | Ghi nhận nhật ký kiểm toán cho mọi lượt gọi AI | Thực hiện bất kỳ tác vụ AI | Gọi API `/ai/*` | Tự động lưu prompt, response, latencyMs, mode vào `yeu_cau_ai` | Audit & Security |

---

### 3. Báo Cáo Kết Quả Kiểm Thử Toàn Diện (Test Report)

Toàn bộ 45 ca kiểm thử đã được chạy nghiệm thu trên môi trường thực tế kết nối Neon Cloud PostgreSQL và Google Gemini AI API:

*Bảng 9.4: Báo cáo kết quả kiểm thử hệ thống 45/45 Ca đạt PASS (Test Report)*
| Test ID | Ngày testing | Người tham gia Test | Pass/Fail | Độ nghiêm trọng | Tóm tắt kết quả kiểm tra | Ghi chú |
|:---|:---|:---|:---|:---|:---|:---|
| **TC001**–**TC045** | 02/09/2026 | Tester & Developer | **PASS** | High / Medium | Chức năng hoạt động chính xác theo đúng đặc tả nghiệp vụ và bảo mật | Nghiệm thu thành công |

> **Kết luận nghiệm thu:** 45/45 Ca kiểm thử đạt trạng thái **PASS (Tỷ lệ thành công 100%)**. Hệ thống đáp ứng đầy đủ tất cả các quy tắc nghiệp vụ, kiểm soát chặt chẽ các trường hợp biên và sẵn sàng đưa vào vận hành thực tế.

---
---

## PHẦN 2: HƯỚNG DẪN SỬ DỤNG ỨNG DỤNG (USER GUIDE)

---

### 1. Giới Thiệu Ứng Dụng
Hệ thống Quản lý Trung tâm Ngoại ngữ tích hợp Trí tuệ Nhân tạo (ETC English LMS AI) là nền tảng quản lý đào tạo toàn diện, hỗ trợ 4 nhóm đối tượng người dùng (Quản lý, Giáo viên, Học viên, Tư vấn viên) thực hiện toàn bộ quy trình từ tuyển sinh, xếp lịch, thu phí, giảng dạy, điểm danh, chấm điểm đến trợ giảng thông minh với GenAI.

---

### 2. Cấu Hình Phần Cứng - Phần Mềm Để Sử Dụng
- **Phần cứng:** Máy tính để bàn, Laptop, Máy tính bảng hoặc Smartphone có kết nối mạng Internet ổn định (băng thông tối thiểu 2 Mbps).
- **Phần mềm:** Trình duyệt web hiện đại (Google Chrome, Microsoft Edge, Mozilla Firefox, Safari) phiên bản mới nhất, không cần cài đặt thêm phần mềm phụ trợ.

---

### 3. Hướng Dẫn Sử Dụng Các Chức Năng Chính Theo Tác Nhân (Actors)

#### 3.1 Chức Năng Của Người Quản Lý (Admin - QUAN_LY)
- **Bước 1 — Đăng nhập Quản trị:** Truy cập trang đăng nhập (`/login`), chọn tài khoản `admin01` (Mật khẩu: `Admin@123`). Hệ thống tự động chuyển hướng đến Dashboard Quản trị (`/admin/dashboard`).
- **Bước 2 — Xem Thống kê Trung tâm:** Dashboard hiển thị tổng số học viên, giáo viên, doanh thu, thanh tiến độ sĩ số các lớp và tỷ lệ học viên hoàn thành khóa.
- **Bước 3 — Quản lý Khóa học & Mở Lớp học:** Vào mục *Khóa học* để tạo khóa học mới; vào mục *Lớp học* để mở lớp, bấm nút *Thêm Lịch Học* (hệ thống tự động kiểm tra chống trùng phòng học) và *Phân Công GV* (kiểm tra chống trùng lịch dạy của giảng viên).
- **Bước 4 — Quản lý Học viên & Thu Học phí:** Vào mục *Học viên* để tìm kiếm, lọc theo trình độ CEFR; vào mục *Học phí* để theo dõi danh sách hóa đơn và lập phiếu thu thanh toán nhiều đợt.
- **Bước 5 — Báo cáo Thống kê Chuyên sâu:** Vào mục *Báo cáo* (`/admin/reports`) để xem biểu đồ phân tích chi tiết hiệu quả đào tạo và xuất báo cáo.

---

#### 3.2 Chức Năng Của Giáo Viên (Teacher - GIAO_VIEN)
- **Bước 1 — Đăng nhập Giảng viên:** Chọn tài khoản `teacher01` (Nguyễn Thị Lan) tại màn hình đăng nhập. Hệ thống chuyển hướng đến Bàn làm việc Giảng viên (`/teacher/dashboard`).
- **Bước 2 — Xem Lịch Dạy & Lớp Phụ Trách:** Giảng viên theo dõi danh sách các lớp được phân công, thời khóa biểu từng thứ trong tuần và phòng học tương ứng.
- **Bước 3 — Điểm Danh Buổi Học:** Truy cập mục *Điểm danh* (`/teacher/attendance`), chọn lớp học. Hệ thống hiển thị danh sách học viên; giảng viên chọn 1 trong 4 trạng thái (`Có Mặt`, `Đi Muộn`, `Có Phép`, `Vắng`) và bấm *Lưu Điểm Danh*.
- **Bước 4 — Nhập Điểm & Đánh Giá Kết Quả:** Truy cập mục *Bảng điểm* (`/teacher/grades`), nhập điểm Chuyên cần (20%), Giữa kỳ (30%), Cuối kỳ (50%). Hệ thống tự động tính điểm tổng kết và xếp loại `ĐẠT` / `KHÔNG ĐẠT`.
- **Bước 5 — Trợ Lý AI Sinh Bài Luyện Tập:** Truy cập mục *AI Sinh đề* (`/teacher/ai-exercises`), nhập chủ đề ngữ pháp/từ vựng và chọn độ khó CEFR. Bấm *Sinh Đề AI* để Gemini tạo tức thì 5 câu trắc nghiệm kèm đáp án và giải thích chi tiết.

---

#### 3.3 Chức Năng Của Học Viên (Student - HOC_VIEN)
- **Bước 1 — Đăng nhập Góc Học Tập:** Chọn tài khoản `student01` (Phạm Văn An - CEFR B1). Hệ thống hiển thị thông tin hồ sơ và các lớp đang theo học (`/student/dashboard`).
- **Bước 2 — AI Tư Vấn Lộ Trình & Lớp Học:** Vào mục *AI Tư vấn* (`/student/ai-consult`), chọn trình độ CEFR và các buổi rảnh trong tuần. Hệ thống Gemini AI phân tích và gợi ý top 3 lớp học thực tế phù hợp nhất.
- **Bước 3 — Đăng Ký Lớp Học Mới:** Vào mục *Đăng ký lớp* (`/student/enroll`), chọn lớp mong muốn. Hệ thống tự động kiểm tra 4 điều kiện (Sĩ số < 25, chưa đăng ký, chuẩn CEFR, không trùng lịch) và tự động sinh hóa đơn học phí.
- **Bước 4 — Tra Cứu Thời Khóa Biểu & Bảng Điểm:** Vào mục *Thời khóa biểu* (`/student/schedule`) để xem lịch học; vào mục *Bảng điểm* (`/student/grades`) để theo dõi điểm 3 thành phần và trạng thái ĐẠT khóa học.
- **Bước 5 — AI Luyện Tập & Tóm Tắt Tiến Độ:** Vào *AI Luyện tập* (`/student/ai-practice`) để làm bài trắc nghiệm tương tác có chấm điểm trực tiếp; vào *AI Tóm tắt* (`/student/ai-progress`) để nhận bản đánh giá điểm mạnh/yếu và lời khuyên ôn tập cá nhân hóa.

---

#### 3.4 Chức Năng Của Tư Vấn Viên (Staff/Counselor - TU_VAN_VIEN)
- **Bước 1 — Đăng nhập Tuyển sinh:** Chọn tài khoản `staff01` (Lê Thị Tư Vấn). Hệ thống chuyển hướng đến Bàn làm việc Tuyển sinh (`/staff/dashboard`).
- **Bước 2 — Tiếp Nhận Học Viên Mới:** Vào mục *Tiếp nhận học viên* (`/staff/new-student`), nhập họ tên, thông tin liên hệ và kết quả đánh giá trình độ CEFR đầu vào để khởi tạo hồ sơ học viên trong hệ thống.
- **Bước 3 — Tư Vấn & Ghi Danh Lớp Học:** Sử dụng công cụ AI Tư vấn để tìm lớp phù hợp theo lịch rảnh của học viên, sau đó vào mục *Ghi danh & Thu phí* (`/staff/collect-fee`) để đăng ký lớp.
- **Bước 4 — Lập Phiếu Thu Học Phí:** Nhập số tiền thu (tiền mặt hoặc chuyển khoản) để cập nhật công nợ và xuất hóa đơn xác nhận cho học viên.
