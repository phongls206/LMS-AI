import { CurriculumTopicBank } from './types';

export const INFORMATION_TECHNOLOGY_BANK: CurriculumTopicBank = {
  key: 'INFORMATION_TECHNOLOGY',
  tenChuDe: 'Tiếng Anh Chuyên Ngành Công Nghệ Thông Tin (IT & Tech)',
  aliases: [
    "công nghệ thông tin",
    "cong nghe thong tin",
    "cntt",
    "it",
    "tech",
    "technology",
    "lập trình",
    "lap trinh",
    "coding",
    "developer",
    "phần mềm",
    "software",
    "hardware",
    "mạng máy tính",
    "cybersecurity",
    "ai",
    "cloud",
    "database"
],
  questions: [
    {
        "id": 1,
        "noiDung": "Please enter your username and __________ to access the computer.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "password",
            "B": "screen",
            "C": "mouse",
            "D": "keyboard"
        },
        "dapAnDung": "password",
        "giaiThich": "\"Password\" là mật khẩu bảo mật."
    },
    {
        "id": 2,
        "noiDung": "Move the __________ to click on the start icon.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "mouse",
            "B": "screen",
            "C": "keyboard",
            "D": "cable"
        },
        "dapAnDung": "mouse",
        "giaiThich": "\"Mouse\" là con chuột máy tính."
    },
    {
        "id": 3,
        "noiDung": "You can type letters and numbers using the __________.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "keyboard",
            "B": "monitor",
            "C": "printer",
            "D": "mouse"
        },
        "dapAnDung": "keyboard",
        "giaiThich": "\"Keyboard\" là bàn phím gõ chữ."
    },
    {
        "id": 4,
        "noiDung": "I bought a new computer monitor with a very clear __________.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "screen",
            "B": "mouse",
            "C": "cable",
            "D": "password"
        },
        "dapAnDung": "screen",
        "giaiThich": "\"Screen\" là màn hình hiển thị."
    },
    {
        "id": 5,
        "noiDung": "Double-click on the blue __________ to open the folder.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "icon",
            "B": "password",
            "C": "cable",
            "D": "keyboard"
        },
        "dapAnDung": "icon",
        "giaiThich": "\"Icon\" là biểu tượng ứng dụng."
    },
    {
        "id": 6,
        "noiDung": "We use the __________ to search for information on the internet.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "web browser",
            "B": "printer",
            "C": "keyboard",
            "D": "cable"
        },
        "dapAnDung": "web browser",
        "giaiThich": "\"Web browser\" là trình duyệt web."
    },
    {
        "id": 7,
        "noiDung": "Please __________ your document before closing the program.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "save",
            "B": "delete",
            "C": "break",
            "D": "throw"
        },
        "dapAnDung": "save",
        "giaiThich": "\"Save\" là lưu lại tài liệu."
    },
    {
        "id": 8,
        "noiDung": "My computer is connected to the internet via high-speed __________.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "Wi-Fi",
            "B": "mouse",
            "C": "paper",
            "D": "screen"
        },
        "dapAnDung": "Wi-Fi",
        "giaiThich": "\"Wi-Fi\" là mạng không dây."
    },
    {
        "id": 9,
        "noiDung": "I need to __________ my laptop battery because it is low.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "charge",
            "B": "click",
            "C": "type",
            "D": "save"
        },
        "dapAnDung": "charge",
        "giaiThich": "\"Charge the battery\" là sạc pin laptop."
    },
    {
        "id": 10,
        "noiDung": "Click the red button to __________ off your desktop computer.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "turn",
            "B": "take",
            "C": "look",
            "D": "give"
        },
        "dapAnDung": "turn",
        "giaiThich": "\"Turn off the computer\" là tắt máy tính."
    },
    {
        "id": 11,
        "noiDung": "A \"password\" should be kept secret to protect personal digital accounts.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Mật khẩu cần được giữ bí mật để bảo vệ tài khoản."
    },
    {
        "id": 12,
        "noiDung": "The \"keyboard\" is used to display video graphics on your desk.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "B",
        "giaiThich": "Sai. Màn hình (screen/monitor) mới hiển thị hình ảnh, bàn phím dùng để nhập ký tự."
    },
    {
        "id": 13,
        "noiDung": "Clicking the \"save\" button prevents your unsaved work from being lost.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Nút Save giúp lưu giữ tiến độ làm việc."
    },
    {
        "id": 14,
        "noiDung": "A computer mouse is primarily an output device that prints paper.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "B",
        "giaiThich": "Sai. Chuột là thiết bị đầu vào (input device), máy in (printer) mới in giấy."
    },
    {
        "id": 15,
        "noiDung": "Wi-Fi allows computers and phones to connect to the internet wirelessly.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Wi-Fi là kết nối mạng không dây."
    },
    {
        "id": 16,
        "noiDung": "Turning off a computer properly helps maintain system stability.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Tắt máy đúng cách bảo vệ hệ thống và ổ cứng."
    },
    {
        "id": 17,
        "noiDung": "Select all fundamental computer hardware components: (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "keyboard",
            "B": "monitor screen",
            "C": "coffee mug",
            "D": "computer mouse"
        },
        "dapAnDung": [
            "A",
            "B",
            "D"
        ],
        "giaiThich": "Bàn phím, màn hình, chuột là phần cứng máy tính cơ bản."
    },
    {
        "id": 18,
        "noiDung": "Which actions are commonly performed on files and folders: (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "save a file",
            "B": "open a folder",
            "C": "cook a file",
            "D": "delete a file"
        },
        "dapAnDung": [
            "A",
            "B",
            "D"
        ],
        "giaiThich": "Lưu, mở, xóa tệp/thư mục."
    },
    {
        "id": 19,
        "noiDung": "Select all terms connected to computer security at a basic level: (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "secure password",
            "B": "user login",
            "C": "paper clip",
            "D": "desk chair"
        },
        "dapAnDung": [
            "A",
            "B"
        ],
        "giaiThich": "Mật khẩu bảo mật và đăng nhập người dùng."
    },
    {
        "id": 20,
        "noiDung": "Identify all common computer devices: (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "laptop",
            "B": "desktop PC",
            "C": "tablet",
            "D": "refrigerator"
        },
        "dapAnDung": [
            "A",
            "B",
            "C"
        ],
        "giaiThich": "Laptop, máy tính để bàn, máy tính bảng."
    },
    {
        "id": 21,
        "noiDung": "You can __________ the software installer directly from the official website.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "download",
            "B": "delete",
            "C": "charge",
            "D": "type"
        },
        "dapAnDung": "download",
        "giaiThich": "\"Download\" là tải tệp về máy tính."
    },
    {
        "id": 22,
        "noiDung": "Please attach the PDF document to your outgoing __________.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "email",
            "B": "screen",
            "C": "printer",
            "D": "keyboard"
        },
        "dapAnDung": "email",
        "giaiThich": "\"Attach to your email\" là đính kèm tệp vào email."
    },
    {
        "id": 23,
        "noiDung": "An __________ program protects your computer from malicious viral software.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "antivirus",
            "B": "internet",
            "C": "browser",
            "D": "printer"
        },
        "dapAnDung": "antivirus",
        "giaiThich": "\"Antivirus program\" là phần mềm diệt virus."
    },
    {
        "id": 24,
        "noiDung": "I forgot my login password, so I clicked the password __________ link.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "reset",
            "B": "delete",
            "C": "charge",
            "D": "install"
        },
        "dapAnDung": "reset",
        "giaiThich": "\"Password reset\" là đặt lại mật khẩu."
    },
    {
        "id": 25,
        "noiDung": "The new operating system takes twenty minutes to __________ on your device.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "install",
            "B": "download",
            "C": "browse",
            "D": "search"
        },
        "dapAnDung": "install",
        "giaiThich": "\"Install\" là cài đặt phần mềm lên thiết bị."
    },
    {
        "id": 26,
        "noiDung": "Google Chrome and Mozilla Firefox are popular web __________.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "browsers",
            "B": "keyboards",
            "C": "monitors",
            "D": "batteries"
        },
        "dapAnDung": "browsers",
        "giaiThich": "Chrome và Firefox là các trình duyệt web (browsers)."
    },
    {
        "id": 27,
        "noiDung": "You can store your photos safely in cloud __________ like Google Drive.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "storage",
            "B": "screen",
            "C": "cable",
            "D": "printer"
        },
        "dapAnDung": "storage",
        "giaiThich": "\"Cloud storage\" là lưu trữ đám mây."
    },
    {
        "id": 28,
        "noiDung": "The computer froze, so I had to __________ the system.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "restart",
            "B": "install",
            "C": "type",
            "D": "click"
        },
        "dapAnDung": "restart",
        "giaiThich": "\"Restart the system\" là khởi động lại máy tính."
    },
    {
        "id": 29,
        "noiDung": "A computer __________ is a software error that causes unintended behavior.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "bug",
            "B": "mouse",
            "C": "icon",
            "D": "cable"
        },
        "dapAnDung": "bug",
        "giaiThich": "\"Bug\" là lỗi phần mềm."
    },
    {
        "id": 30,
        "noiDung": "She used an optical __________ to produce a digital copy of her passport.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "scanner",
            "B": "keyboard",
            "C": "monitor",
            "D": "browser"
        },
        "dapAnDung": "scanner",
        "giaiThich": "\"Scanner\" là máy quét tài liệu."
    },
    {
        "id": 31,
        "noiDung": "\"Download\" means receiving data from a remote server to a local device.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Tải xuống là lấy dữ liệu từ máy chủ từ xa về máy cục bộ."
    },
    {
        "id": 32,
        "noiDung": "\"Upload\" means sending data from a local device to a remote server or website.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Tải lên là gửi dữ liệu từ máy mình lên mạng."
    },
    {
        "id": 33,
        "noiDung": "A \"software bug\" is a beneficial feature that improves computer speed.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "B",
        "giaiThich": "Sai. Bug là lỗi lập trình gây sai lệch, không phải tính năng có lợi."
    },
    {
        "id": 34,
        "noiDung": "Cloud storage requires a network connection to synchronize and retrieve files.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Lưu trữ đám mây cần kết nối internet để đồng bộ hóa."
    },
    {
        "id": 35,
        "noiDung": "Antivirus software should be updated periodically to detect new threats.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Cần cập nhật phần mềm diệt virus thường xuyên để phòng mã độc mới."
    },
    {
        "id": 36,
        "noiDung": "Restarting a computer clears temporary system memory and can resolve glitches.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Khởi động lại giúp giải phóng bộ nhớ RAM và khắc phục sự cố tạm thời."
    },
    {
        "id": 37,
        "noiDung": "Select all popular web browsers used worldwide: (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "Google Chrome",
            "B": "Mozilla Firefox",
            "C": "Adobe Photoshop",
            "D": "Apple Safari"
        },
        "dapAnDung": [
            "A",
            "B",
            "D"
        ],
        "giaiThich": "Chrome, Firefox, Safari là trình duyệt web. Photoshop là phần mềm đồ họa."
    },
    {
        "id": 38,
        "noiDung": "Which file formats are commonly used for documents and images: (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "PDF",
            "B": "DOCX",
            "C": "PNG",
            "D": "BATTERY"
        },
        "dapAnDung": [
            "A",
            "B",
            "C"
        ],
        "giaiThich": "PDF, DOCX, PNG là các định dạng tệp chuẩn."
    },
    {
        "id": 39,
        "noiDung": "Select all actions related to software management: (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "installing an update",
            "B": "downloading a patch",
            "C": "washing a keyboard",
            "D": "uninstalling an app"
        },
        "dapAnDung": [
            "A",
            "B",
            "D"
        ],
        "giaiThich": "Cài đặt cập nhật, tải bản vá lỗi, gỡ cài đặt ứng dụng."
    },
    {
        "id": 40,
        "noiDung": "Identify all common cloud storage platforms: (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "Google Drive",
            "B": "Microsoft OneDrive",
            "C": "Dropbox",
            "D": "Paper Notebook"
        },
        "dapAnDung": [
            "A",
            "B",
            "C"
        ],
        "giaiThich": "Google Drive, OneDrive, Dropbox là dịch vụ lưu trữ đám mây."
    },
    {
        "id": 41,
        "noiDung": "Python and JavaScript are among the most versatile __________ languages in software engineering.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "programming",
            "B": "browsing",
            "C": "downloading",
            "D": "scanning"
        },
        "dapAnDung": "programming",
        "giaiThich": "\"Programming languages\" là ngôn ngữ lập trình."
    },
    {
        "id": 42,
        "noiDung": "A relational __________ management system (RDBMS) organizes data into tables with rows and columns.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "database",
            "B": "browser",
            "C": "scanner",
            "D": "storage"
        },
        "dapAnDung": "database",
        "giaiThich": "\"Relational database\" là cơ sở dữ liệu quan hệ."
    },
    {
        "id": 43,
        "noiDung": "Software engineers write unit tests to ensure that every function executes without __________.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "errors",
            "B": "icons",
            "C": "monitors",
            "D": "cables"
        },
        "dapAnDung": "errors",
        "giaiThich": "Viết unit test để đảm bảo hàm chạy không có lỗi (errors/bugs)."
    },
    {
        "id": 44,
        "noiDung": "The frontend engineering team designed an intuitive user __________ (UI) for the mobile app.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "interface",
            "B": "database",
            "C": "hardware",
            "D": "server"
        },
        "dapAnDung": "interface",
        "giaiThich": "\"User interface (UI)\" là giao diện người dùng."
    },
    {
        "id": 45,
        "noiDung": "A search __________ uses sophisticated algorithms to index and rank web pages.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "engine",
            "B": "browser",
            "C": "monitor",
            "D": "storage"
        },
        "dapAnDung": "engine",
        "giaiThich": "\"Search engine\" là công cụ tìm kiếm (như Google)."
    },
    {
        "id": 46,
        "noiDung": "Developers use version control systems like Git to track source code __________ over time.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "changes",
            "B": "cables",
            "C": "screens",
            "D": "printers"
        },
        "dapAnDung": "changes",
        "giaiThich": "Hệ thống quản lý phiên bản Git theo dõi các thay đổi mã nguồn."
    },
    {
        "id": 47,
        "noiDung": "The web application communicates with the backend server via RESTful __________.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "APIs",
            "B": "CPUs",
            "C": "GPUs",
            "D": "RAMs"
        },
        "dapAnDung": "APIs",
        "giaiThich": "\"RESTful APIs\" là giao diện lập trình ứng dụng kết nối frontend và backend."
    },
    {
        "id": 48,
        "noiDung": "Data __________ ensures that sensitive customer records cannot be deciphered if intercepted.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "encryption",
            "B": "deletion",
            "C": "installation",
            "D": "scanning"
        },
        "dapAnDung": "encryption",
        "giaiThich": "\"Data encryption\" là mã hóa dữ liệu."
    },
    {
        "id": 49,
        "noiDung": "The server encountered a 404 error because the requested resource was not __________.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "found",
            "B": "created",
            "C": "authorized",
            "D": "redirected"
        },
        "dapAnDung": "found",
        "giaiThich": "Mã lỗi HTTP 404: Not Found (Không tìm thấy tài nguyên)."
    },
    {
        "id": 50,
        "noiDung": "Cloud computing allows organizations to scale server infrastructure __________ on demand.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "dynamically",
            "B": "manually",
            "C": "slowly",
            "D": "dangerously"
        },
        "dapAnDung": "dynamically",
        "giaiThich": "Điện toán đám mây cho phép mở rộng hạ tầng máy chủ linh hoạt theo nhu cầu."
    },
    {
        "id": 51,
        "noiDung": "Git is a distributed version control system designed to track changes in source code.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Git là hệ thống quản lý mã nguồn phân tán phổ biến nhất."
    },
    {
        "id": 52,
        "noiDung": "An API (Application Programming Interface) allows two distinct software systems to communicate.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. API là cầu nối cho phép hai hệ thống phần mềm trao đổi dữ liệu."
    },
    {
        "id": 53,
        "noiDung": "Frontend development focuses exclusively on database queries and server-side hardware maintenance.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "B",
        "giaiThich": "Sai. Frontend tập trung vào giao diện và trải nghiệm người dùng; xử lý dữ liệu và server là Backend."
    },
    {
        "id": 54,
        "noiDung": "Data encryption converts plaintext into unreadable ciphertext to prevent unauthorized access.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Mã hóa biến văn bản thô thành bản mã không đọc được nếu thiếu chìa khóa."
    },
    {
        "id": 55,
        "noiDung": "HTTP status code 404 signifies that a server request was completely successful and approved.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "B",
        "giaiThich": "Sai. Mã 200 OK mới là thành công; mã 404 là lỗi không tìm thấy tài nguyên."
    },
    {
        "id": 56,
        "noiDung": "Relational databases store structured data in tables consisting of rows and columns.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. CSDL quan hệ (SQL) tổ chức dữ liệu theo bảng gồm các hàng và cột."
    },
    {
        "id": 57,
        "noiDung": "Select all widely used programming and scripting languages: (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "JavaScript",
            "B": "Python",
            "C": "Adobe Acrobat",
            "D": "TypeScript"
        },
        "dapAnDung": [
            "A",
            "B",
            "D"
        ],
        "giaiThich": "JavaScript, Python, TypeScript là ngôn ngữ lập trình."
    },
    {
        "id": 58,
        "noiDung": "Which components are part of full-stack web application architecture: (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "frontend client interface",
            "B": "backend API server",
            "C": "database persistence layer",
            "D": "office water cooler"
        },
        "dapAnDung": [
            "A",
            "B",
            "C"
        ],
        "giaiThich": "Frontend, Backend, Database là 3 tầng chính của ứng dụng web."
    },
    {
        "id": 59,
        "noiDung": "Select all common HTTP response status codes: (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "200 OK (Success)",
            "B": "404 Not Found (Client error)",
            "C": "999 Unknown",
            "D": "500 Internal Server Error"
        },
        "dapAnDung": [
            "A",
            "B",
            "D"
        ],
        "giaiThich": "200, 404, 500 là các mã trạng thái HTTP chuẩn quốc tế."
    },
    {
        "id": 60,
        "noiDung": "Identify all cybersecurity defense best practices: (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "implementing two-factor authentication (2FA)",
            "B": "encrypting sensitive databases",
            "C": "sharing passwords on sticky notes",
            "D": "regularly patching software vulnerabilities"
        },
        "dapAnDung": [
            "A",
            "B",
            "D"
        ],
        "giaiThich": "Xác thực 2 yếu tố, mã hóa dữ liệu, vá lỗi bảo mật định kỳ."
    },
    {
        "id": 61,
        "noiDung": "Containerization platforms like __________ package applications alongside their dependencies for seamless deployment.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "Docker",
            "B": "Chrome",
            "C": "Photoshop",
            "D": "Excel"
        },
        "dapAnDung": "Docker",
        "giaiThich": "Docker là nền tảng đóng gói container ứng dụng chuẩn công nghiệp."
    },
    {
        "id": 62,
        "noiDung": "Kubernetes is an open-source system designed for orchestrating and managing automated container __________.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "deployment",
            "B": "encryption",
            "C": "scanning",
            "D": "deletion"
        },
        "dapAnDung": "deployment",
        "giaiThich": "Kubernetes điều phối và tự động hóa việc triển khai (deployment) container."
    },
    {
        "id": 63,
        "noiDung": "A microservices architecture decomposes monolithic applications into loosely __________ services.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "coupled",
            "B": "locked",
            "C": "wired",
            "D": "tied"
        },
        "dapAnDung": "coupled",
        "giaiThich": "\"Loosely coupled\" (liên kết lỏng lẻo, độc lập) là đặc trưng của kiến trúc Microservices."
    },
    {
        "id": 64,
        "noiDung": "Continuous integration and continuous __________ (CI/CD) pipelines automate testing and releases.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "deployment",
            "B": "encryption",
            "C": "indexing",
            "D": "caching"
        },
        "dapAnDung": "deployment",
        "giaiThich": "CI/CD (Continuous Integration / Continuous Deployment/Delivery)."
    },
    {
        "id": 65,
        "noiDung": "To minimize network latency, static website assets are cached on geographically distributed __________ servers.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "CDN",
            "B": "SQL",
            "C": "RAM",
            "D": "CPU"
        },
        "dapAnDung": "CDN",
        "giaiThich": "CDN (Content Delivery Network) lưu bộ nhớ đệm tại các máy chủ toàn cầu để giảm độ trễ."
    },
    {
        "id": 66,
        "noiDung": "A Denial of Service (DoS) attack overwhelms server bandwidth with a flood of malicious __________.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "traffic",
            "B": "hardware",
            "C": "storage",
            "D": "encryption"
        },
        "dapAnDung": "traffic",
        "giaiThich": "Tấn công từ chối dịch vụ làm nghẽn băng thông máy chủ bằng lưu lượng truy cập ảo."
    },
    {
        "id": 67,
        "noiDung": "Asymmetric cryptography utilizes a public key for encryption and a distinct __________ key for decryption.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "private",
            "B": "shared",
            "C": "cloud",
            "D": "static"
        },
        "dapAnDung": "private",
        "giaiThich": "Mã hóa bất đối xứng dùng khóa công khai (public key) và khóa riêng tư (private key)."
    },
    {
        "id": 68,
        "noiDung": "Database __________ creates optimized lookup indices to dramatically accelerate query response times.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "indexing",
            "B": "deleting",
            "C": "crashing",
            "D": "locking"
        },
        "dapAnDung": "indexing",
        "giaiThich": "Đánh chỉ mục CSDL (Database indexing) giúp tăng tốc truy vấn."
    },
    {
        "id": 69,
        "noiDung": "In-memory caching engines like Redis significantly reduce recurring database read __________.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "operations",
            "B": "cables",
            "C": "browsers",
            "D": "monitors"
        },
        "dapAnDung": "operations",
        "giaiThich": "Redis lưu cache trên RAM giúp giảm tải các thao tác đọc CSDL."
    },
    {
        "id": 70,
        "noiDung": "Software development teams adhere to Agile and __________ methodologies to deliver iterative value.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "Scrum",
            "B": "Screen",
            "C": "Script",
            "D": "Scan"
        },
        "dapAnDung": "Scrum",
        "giaiThich": "Agile và Scrum là các phương pháp luận phát triển phần mềm linh hoạt."
    },
    {
        "id": 71,
        "noiDung": "Docker containers share the host operating system kernel, making them lighter than traditional virtual machines.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Container dùng chung nhân OS chủ nên nhẹ hơn máy ảo (VM) rất nhiều."
    },
    {
        "id": 72,
        "noiDung": "A Content Delivery Network (CDN) caches static content closer to end-users to reduce latency.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. CDN giúp người dùng tải dữ liệu từ máy chủ gần nhất với độ trễ thấp nhất."
    },
    {
        "id": 73,
        "noiDung": "In asymmetric encryption, the private key is distributed freely to everyone on the internet.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "B",
        "giaiThich": "Sai. Khóa riêng tư (private key) bắt buộc giữ tuyệt mật, chỉ khóa công khai (public key) mới được chia sẻ."
    },
    {
        "id": 74,
        "noiDung": "Kubernetes is an orchestration tool used to automate the deployment, scaling, and management of containers.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. K8s là chuẩn điều phối container tự động trong môi trường điện toán đám mây."
    },
    {
        "id": 75,
        "noiDung": "A monolithic architecture naturally isolates individual microservice failures without affecting other modules.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "B",
        "giaiThich": "Sai. Kiến trúc nguyên khối (Monolith) khi lỗi một mô-đun có thể làm sập toàn bộ hệ thống; Microservices mới cách ly được lỗi."
    },
    {
        "id": 76,
        "noiDung": "Continuous Integration (CI) involves merging developer code changes into a central repository frequently with automated tests.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. CI tích hợp mã nguồn liên tục kèm kiểm thử tự động."
    },
    {
        "id": 77,
        "noiDung": "Select all core technologies and concepts of modern DevOps infrastructure: (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "containerization (Docker)",
            "B": "container orchestration (Kubernetes)",
            "C": "automated CI/CD pipelines",
            "D": "analog television antennas"
        },
        "dapAnDung": [
            "A",
            "B",
            "C"
        ],
        "giaiThich": "A, B, C là xương sống của hạ tầng DevOps hiện đại."
    },
    {
        "id": 78,
        "noiDung": "Which caching mechanisms accelerate web application responsiveness: (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "in-memory datastores (Redis / Memcached)",
            "B": "Content Delivery Networks (CDNs)",
            "C": "paper printing queues",
            "D": "browser HTTP cache headers"
        },
        "dapAnDung": [
            "A",
            "B",
            "D"
        ],
        "giaiThich": "Redis, CDN, Browser cache giúp tối ưu tốc độ phản hồi."
    },
    {
        "id": 79,
        "noiDung": "Select all characteristics of Microservices architecture: (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "decoupled independent deployment",
            "B": "polyglot programming capability",
            "C": "single point of catastrophic failure",
            "D": "modular scalability"
        },
        "dapAnDung": [
            "A",
            "B",
            "D"
        ],
        "giaiThich": "Độc lập triển khai, đa dạng ngôn ngữ, mở rộng theo mô-đun. C là nhược điểm của Monolith."
    },
    {
        "id": 80,
        "noiDung": "Identify all common cybersecurity attack vectors: (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "Distributed Denial of Service (DDoS)",
            "B": "SQL injection exploits",
            "C": "clean keyboard maintenance",
            "D": "Cross-Site Scripting (XSS)"
        },
        "dapAnDung": [
            "A",
            "B",
            "D"
        ],
        "giaiThich": "DDoS, SQL Injection, XSS là các phương thức tấn công mạng phổ biến."
    },
    {
        "id": 81,
        "noiDung": "In distributed systems, the CAP theorem states that a datastore can simultaneously guarantee at most two out of Consistency, Availability, and __________ Tolerance.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "Partition",
            "B": "Performance",
            "C": "Parallel",
            "D": "Program"
        },
        "dapAnDung": "Partition",
        "giaiThich": "Định lý CAP: Consistency (Nhất quán), Availability (Sẵn sàng), Partition tolerance (Dung sai phân vùng mạng)."
    },
    {
        "id": 82,
        "noiDung": "Zero-Trust Network Architecture (ZTNA) operates under the security paradigm of \"never trust, always __________\".",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "verify",
            "B": "grant",
            "C": "encrypt",
            "D": "deploy"
        },
        "dapAnDung": "verify",
        "giaiThich": "Nguyên tắc bất di bất dịch của Zero-Trust: \"Never trust, always verify\" (Không bao giờ tin tưởng, luôn luôn xác minh)."
    },
    {
        "id": 83,
        "noiDung": "Distributed consensus algorithms like Raft and Paxos ensure state machine replication across __________ nodes.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "fault-tolerant",
            "B": "faulty",
            "C": "slow",
            "D": "unencrypted"
        },
        "dapAnDung": "fault-tolerant",
        "giaiThich": "Các thuật toán đồng thuận phân tán đảm bảo nhân bản trạng thái chịu lỗi (fault-tolerant)."
    },
    {
        "id": 84,
        "noiDung": "Cryptographic hashing algorithms like SHA-256 are strictly __________ functions that cannot be inverted.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "one-way",
            "B": "two-way",
            "C": "reversible",
            "D": "linear"
        },
        "dapAnDung": "one-way",
        "giaiThich": "Hàm băm mật mã là hàm một chiều (one-way function), không thể đảo ngược để lấy dữ liệu gốc."
    },
    {
        "id": 85,
        "noiDung": "To optimize read throughput, database architects implement write-ahead __________ (WAL) and eventual consistency models.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "logging",
            "B": "locking",
            "C": "deleting",
            "D": "routing"
        },
        "dapAnDung": "logging",
        "giaiThich": "\"Write-ahead logging (WAL)\" ghi nhật ký trước khi ghi đĩa để đảm bảo tính toàn vẹn giao dịch."
    },
    {
        "id": 86,
        "noiDung": "High-concurrency systems mitigate thread contention through lock-free data structures and __________ processing.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "asynchronous",
            "B": "manual",
            "C": "blocking",
            "D": "monolithic"
        },
        "dapAnDung": "asynchronous",
        "giaiThich": "Xử lý bất đồng bộ (asynchronous) và cấu trúc không khóa (lock-free) giải quyết tranh chấp luồng."
    },
    {
        "id": 87,
        "noiDung": "A distributed tracing framework instruments microservices to track end-to-end request latency across remote __________ calls.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "RPC",
            "B": "CPU",
            "C": "RAM",
            "D": "GUI"
        },
        "dapAnDung": "RPC",
        "giaiThich": "Truy vết phân tán theo dõi độ trễ qua các cuộc gọi thủ tục từ xa (gRPC / RPC)."
    },
    {
        "id": 88,
        "noiDung": "Event-driven architectures decouple producer and consumer microservices using distributed streaming brokers like __________.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "Apache Kafka",
            "B": "Adobe Reader",
            "C": "Notepad",
            "D": "VLC Player"
        },
        "dapAnDung": "Apache Kafka",
        "giaiThich": "Apache Kafka là nền tảng xử lý luồng sự kiện phân tán hàng đầu."
    },
    {
        "id": 89,
        "noiDung": "Hardware-accelerated machine learning workloads rely on tensor processing units (TPUs) and high-bandwidth __________.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "memory",
            "B": "scanners",
            "C": "monitors",
            "D": "keyboards"
        },
        "dapAnDung": "memory",
        "giaiThich": "Bộ nhớ băng thông cao (HBM) tối ưu tính toán trí tuệ nhân tạo."
    },
    {
        "id": 90,
        "noiDung": "Database isolation level \"Serializable\" prevents phantom reads and write __________ completely.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "skew",
            "B": "shift",
            "C": "drift",
            "D": "leak"
        },
        "dapAnDung": "skew",
        "giaiThich": "Cấp độ cô lập cao nhất \"Serializable\" ngăn chặn triệt để hiện tượng Write Skew và Phantom Reads."
    },
    {
        "id": 91,
        "noiDung": "The CAP theorem mathematically proves that no distributed database can simultaneously achieve Consistency, Availability, and Partition Tolerance.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Định lý CAP chứng minh chỉ có thể chọn tối đa 2 trong 3 yếu tố."
    },
    {
        "id": 92,
        "noiDung": "Zero-Trust architecture assumes that threats exist both outside and inside the enterprise network perimeter.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Kiến trúc Zero-Trust giả định mạng nội bộ cũng tiềm ẩn nguy cơ nên luôn phải xác thực mọi truy cập."
    },
    {
        "id": 93,
        "noiDung": "Cryptographic hash functions produce fixed-length digests regardless of input payload magnitude.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Bất kể chuỗi đầu vào dài bao nhiêu, SHA-256 luôn cho ra kết quả băm có độ dài cố định 256 bits."
    },
    {
        "id": 94,
        "noiDung": "In eventual consistency models, data replicas are guaranteed to match instantaneously with zero latency across all nodes.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "B",
        "giaiThich": "Sai. Tính nhất quán sau cùng (Eventual consistency) chấp nhận độ trễ lan truyền, dữ liệu chỉ đồng nhất sau một khoảng thời gian."
    },
    {
        "id": 95,
        "noiDung": "Lock-free data structures utilize atomic CPU primitives like Compare-And-Swap (CAS) to eliminate mutex contention.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Cấu trúc lock-free dùng chỉ lệnh nguyên tử CAS để tránh khóa tài nguyên."
    },
    {
        "id": 96,
        "noiDung": "A distributed Denial of Service (DDoS) attack can be permanently mitigated by simply changing a router password.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "B",
        "giaiThich": "Sai. DDoS tấn công nghẽn băng thông diện rộng, đòi hỏi các giải pháp lọc lưu lượng phân tán chuyên dụng (như Cloudflare), đổi mật khẩu không có tác dụng."
    },
    {
        "id": 97,
        "noiDung": "Select all fundamental distributed system paradigms and theorems: (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "CAP Theorem (Brewers Theorem)",
            "B": "PACELC Theorem",
            "C": "Office Coffee Protocol",
            "D": "Byzantine Fault Tolerance (BFT)"
        },
        "dapAnDung": [
            "A",
            "B",
            "D"
        ],
        "giaiThich": "Định lý CAP, định lý PACELC, và dung sai Byzantine là các nền tảng toán học của hệ phân tán."
    },
    {
        "id": 98,
        "noiDung": "Which distributed stream processing platforms manage massive event pipelines: (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "Apache Kafka",
            "B": "Apache Flink",
            "C": "Microsoft Paint",
            "D": "Google Calendar"
        },
        "dapAnDung": [
            "A",
            "B"
        ],
        "giaiThich": "Apache Kafka và Apache Flink là các nền tảng xử lý luồng dữ liệu phân tán quy mô cực lớn."
    },
    {
        "id": 99,
        "noiDung": "Select all core pillars of Zero-Trust Network Architecture (ZTNA): (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "least privilege access enforcement",
            "B": "continuous contextual authentication",
            "C": "implicit trust for internal intranet users",
            "D": "micro-segmentation of network resources"
        },
        "dapAnDung": [
            "A",
            "B",
            "D"
        ],
        "giaiThich": "Quyền hạn tối thiểu, xác thực liên tục, phân đoạn mạng vi mô. C sai vì Zero-Trust không tin tưởng ngầm định ai."
    },
    {
        "id": 100,
        "noiDung": "Identify ACID transaction properties in database systems: (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "Atomicity",
            "B": "Consistency",
            "C": "Isolation",
            "D": "Bandwidth"
        },
        "dapAnDung": [
            "A",
            "B",
            "C"
        ],
        "giaiThich": "Atomicity, Consistency, Isolation (và Durability) là các thuộc tính ACID. Bandwidth là băng thông mạng."
    }
]
};
