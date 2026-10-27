import { CurriculumTopicBank } from './types';

export const BUSINESS_ENGLISH_BANK: CurriculumTopicBank = {
  key: 'BUSINESS_ENGLISH',
  tenChuDe: 'Từ Vựng Tiếng Anh Công Sở & Giao Tiếp (Business English)',
  aliases: [
    "công sở",
    "cong so",
    "business english",
    "business",
    "giao tiếp công sở",
    "tiếng anh thương mại",
    "kinh doanh",
    "doanh nghiệp",
    "thương mại",
    "đàm phán",
    "hợp đồng",
    "meeting",
    "mua sắm",
    "mua sam",
    "shopping",
    "bán hàng",
    "sales"
],
  questions: [
    {
        "id": 1,
        "noiDung": "Can I help you with your __________ today, sir?",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "order",
            "B": "meeting",
            "C": "desk",
            "D": "email"
        },
        "dapAnDung": "order",
        "giaiThich": "\"Order\" là đơn đặt hàng/món đồ khách mua."
    },
    {
        "id": 2,
        "noiDung": "Here is my business __________. Please call me if you have any questions.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "card",
            "B": "book",
            "C": "paper",
            "D": "ticket"
        },
        "dapAnDung": "card",
        "giaiThich": "\"Business card\" là danh thiếp."
    },
    {
        "id": 3,
        "noiDung": "Our office __________ at 8:00 AM every weekday morning.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "opens",
            "B": "closes",
            "C": "sells",
            "D": "works"
        },
        "dapAnDung": "opens",
        "giaiThich": "Văn phòng mở cửa lúc 8:00 sáng: opens."
    },
    {
        "id": 4,
        "noiDung": "I need to send an urgent __________ to my manager right now.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "email",
            "B": "desk",
            "C": "card",
            "D": "pen"
        },
        "dapAnDung": "email",
        "giaiThich": "Gửi thư điện tử khẩn: send an email."
    },
    {
        "id": 5,
        "noiDung": "How much is the total __________ for these office supplies?",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "price",
            "B": "money",
            "C": "salary",
            "D": "time"
        },
        "dapAnDung": "price",
        "giaiThich": "\"Price\" là giá tiền của sản phẩm."
    },
    {
        "id": 6,
        "noiDung": "My __________ is very kind and always helps new employees.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "boss",
            "B": "customer",
            "C": "desk",
            "D": "order"
        },
        "dapAnDung": "boss",
        "giaiThich": "\"Boss\" là sếp/cấp trên."
    },
    {
        "id": 7,
        "noiDung": "We have a short team __________ in the conference room at 9 AM.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "meeting",
            "B": "party",
            "C": "holiday",
            "D": "lunch"
        },
        "dapAnDung": "meeting",
        "giaiThich": "\"Team meeting\" là cuộc họp nhóm."
    },
    {
        "id": 8,
        "noiDung": "Could you please sign your name at the bottom of the __________?",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "contract",
            "B": "screen",
            "C": "phone",
            "D": "box"
        },
        "dapAnDung": "contract",
        "giaiThich": "\"Contract\" là hợp đồng ký kết."
    },
    {
        "id": 9,
        "noiDung": "The customer wants to buy three new office __________.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "chairs",
            "B": "bosses",
            "C": "salaries",
            "D": "prices"
        },
        "dapAnDung": "chairs",
        "giaiThich": "Khách hàng mua 3 chiếc ghế văn phòng."
    },
    {
        "id": 10,
        "noiDung": "I work in a modern office in the center of the __________.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "city",
            "B": "room",
            "C": "desk",
            "D": "card"
        },
        "dapAnDung": "city",
        "giaiThich": "Làm việc tại trung tâm thành phố: center of the city."
    },
    {
        "id": 11,
        "noiDung": "A \"business card\" typically contains a person's name, title, and contact details.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Danh thiếp chứa tên, chức danh và thông tin liên lạc."
    },
    {
        "id": 12,
        "noiDung": "The word \"boss\" refers to the person in charge of a workplace or team.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Boss là người quản lý, trưởng nhóm."
    },
    {
        "id": 13,
        "noiDung": "In business English, \"order\" can mean requesting goods to be supplied.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Order là đặt hàng."
    },
    {
        "id": 14,
        "noiDung": "An office meeting is always a social party with loud music and dancing.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "B",
        "giaiThich": "Sai. Cuộc họp công sở là thảo luận công việc nghiêm túc, không phải tiệc khiêu vũ."
    },
    {
        "id": 15,
        "noiDung": "\"Price\" means the amount of money expected in payment for something.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Price là mức giá của hàng hóa/dịch vụ."
    },
    {
        "id": 16,
        "noiDung": "Employees are paid a salary for the work they perform.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Salary là tiền lương của người lao động."
    },
    {
        "id": 17,
        "noiDung": "Select all everyday workplace and office objects: (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "desk",
            "B": "computer",
            "C": "business card",
            "D": "swimsuit"
        },
        "dapAnDung": [
            "A",
            "B",
            "C"
        ],
        "giaiThich": "Bàn làm việc, máy tính, danh thiếp là đồ dùng văn phòng."
    },
    {
        "id": 18,
        "noiDung": "Which words relate to professional communication at work? (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "email",
            "B": "phone call",
            "C": "video game",
            "D": "meeting"
        },
        "dapAnDung": [
            "A",
            "B",
            "D"
        ],
        "giaiThich": "Email, gọi điện, họp là phương thức giao tiếp công sở."
    },
    {
        "id": 19,
        "noiDung": "Select all nouns referring to people in a business environment: (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "colleague",
            "B": "customer",
            "C": "manager",
            "D": "invoice"
        },
        "dapAnDung": [
            "A",
            "B",
            "C"
        ],
        "giaiThich": "Colleague (đồng nghiệp), customer (khách hàng), manager (quản lý). Invoice là hóa đơn."
    },
    {
        "id": 20,
        "noiDung": "Identify all polite phrases used with clients: (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "How may I assist you today?",
            "B": "Thank you for your business.",
            "C": "Give me your money.",
            "D": "Pleasure to meet you."
        },
        "dapAnDung": [
            "A",
            "B",
            "D"
        ],
        "giaiThich": "A, B, D là các câu giao tiếp lịch thiệp với khách hàng."
    },
    {
        "id": 21,
        "noiDung": "Please send the commercial __________ so our accounting department can process payment.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "invoice",
            "B": "postcard",
            "C": "greeting",
            "D": "timetable"
        },
        "dapAnDung": "invoice",
        "giaiThich": "\"Invoice\" là hóa đơn thương mại yêu cầu thanh toán."
    },
    {
        "id": 22,
        "noiDung": "We need to schedule an appointment with the prospective __________ next Tuesday.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "client",
            "B": "desk",
            "C": "salary",
            "D": "building"
        },
        "dapAnDung": "client",
        "giaiThich": "\"Client\" là khách hàng doanh nghiệp."
    },
    {
        "id": 23,
        "noiDung": "The human resources department announced a company-wide __________ increase of 5%.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "salary",
            "B": "client",
            "C": "office",
            "D": "order"
        },
        "dapAnDung": "salary",
        "giaiThich": "\"Salary increase\" là việc tăng lương."
    },
    {
        "id": 24,
        "noiDung": "I am writing to __________ receipt of your formal job application.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "acknowledge",
            "B": "forget",
            "C": "refuse",
            "D": "cancel"
        },
        "dapAnDung": "acknowledge",
        "giaiThich": "\"Acknowledge receipt\" là xác nhận đã nhận được thư từ/hồ sơ."
    },
    {
        "id": 25,
        "noiDung": "The project has a strict __________; we must finish by 5 PM on Friday.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "deadline",
            "B": "invoice",
            "C": "agenda",
            "D": "colleague"
        },
        "dapAnDung": "deadline",
        "giaiThich": "\"Deadline\" là hạn chót hoàn thành công việc."
    },
    {
        "id": 26,
        "noiDung": "All employees must arrive on time and respect the company's working __________.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "hours",
            "B": "salaries",
            "C": "invoices",
            "D": "clients"
        },
        "dapAnDung": "hours",
        "giaiThich": "\"Working hours\" là giờ giấc làm việc."
    },
    {
        "id": 27,
        "noiDung": "She submitted an official __________ to the customer service department regarding the defective unit.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "complaint",
            "B": "compliment",
            "C": "contract",
            "D": "colleague"
        },
        "dapAnDung": "complaint",
        "giaiThich": "\"Complaint\" là khiếu nại của khách hàng."
    },
    {
        "id": 28,
        "noiDung": "Our retail company offers a 10% __________ for bulk wholesale orders.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "discount",
            "B": "deadline",
            "C": "salary",
            "D": "meeting"
        },
        "dapAnDung": "discount",
        "giaiThich": "\"Discount\" là chiết khấu giảm giá."
    },
    {
        "id": 29,
        "noiDung": "The sales team exceeded their quarterly __________ by fifteen percent.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "target",
            "B": "complaint",
            "C": "desk",
            "D": "card"
        },
        "dapAnDung": "target",
        "giaiThich": "\"Sales target\" là chỉ tiêu doanh số bán hàng."
    },
    {
        "id": 30,
        "noiDung": "Could you please attach the budget spreadsheet to your reply __________?",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "email",
            "B": "invoice",
            "C": "salary",
            "D": "deadline"
        },
        "dapAnDung": "email",
        "giaiThich": "\"Attach to your reply email\" (đính kèm vào email trả lời)."
    },
    {
        "id": 31,
        "noiDung": "An \"invoice\" is a document issued by a seller detailing the products or services provided and the sum owed.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Hóa đơn liệt kê hàng hóa dịch vụ và số tiền phải thanh toán."
    },
    {
        "id": 32,
        "noiDung": "\"Deadline\" refers to the earliest possible date when a project can begin.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "B",
        "giaiThich": "Sai. Deadline là hạn chót phải hoàn thành, không phải ngày bắt đầu."
    },
    {
        "id": 33,
        "noiDung": "\"Client\" and \"customer\" are often used interchangeably in commercial dialogue.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Client và customer đều chỉ khách hàng."
    },
    {
        "id": 34,
        "noiDung": "A \"discount\" increases the final purchase price of an item for the buyer.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "B",
        "giaiThich": "Sai. Discount là giảm giá chiết khấu, giúp giảm số tiền phải trả."
    },
    {
        "id": 35,
        "noiDung": "\"Acknowledge receipt\" is a formal phrase commonly used in professional correspondence.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Đây là mẫu câu thông dụng trong email công việc."
    },
    {
        "id": 36,
        "noiDung": "Sales targets define the volume of sales a representative aims to achieve.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Chỉ tiêu doanh số là mục tiêu bán hàng cần đạt."
    },
    {
        "id": 37,
        "noiDung": "Select all documents commonly exchanged in commercial business transactions: (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "commercial invoice",
            "B": "written contract",
            "C": "comic book",
            "D": "purchase order"
        },
        "dapAnDung": [
            "A",
            "B",
            "D"
        ],
        "giaiThich": "Hóa đơn, hợp đồng, đơn đặt hàng là văn bản thương mại."
    },
    {
        "id": 38,
        "noiDung": "Which terms relate directly to employee compensation and time management: (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "monthly salary",
            "B": "project deadline",
            "C": "office wallpaper",
            "D": "working hours"
        },
        "dapAnDung": [
            "A",
            "B",
            "D"
        ],
        "giaiThich": "Lương tháng, hạn chót dự án, giờ làm việc."
    },
    {
        "id": 39,
        "noiDung": "Select all words related to customer relations and sales: (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "client satisfaction",
            "B": "customer complaint",
            "C": "sales discount",
            "D": "computer screen"
        },
        "dapAnDung": [
            "A",
            "B",
            "C"
        ],
        "giaiThich": "Sự hài lòng, khiếu nại, chiết khấu liên quan mật thiết đến khách hàng."
    },
    {
        "id": 40,
        "noiDung": "Identify all standard professional email sign-offs: (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "Best regards,",
            "B": "Sincerely,",
            "C": "See ya later bro,",
            "D": "Kind regards,"
        },
        "dapAnDung": [
            "A",
            "B",
            "D"
        ],
        "giaiThich": "A, B, D là lời chào kết thư trang trọng. C quá thân mật, suồng sã."
    },
    {
        "id": 41,
        "noiDung": "Please review the attached meeting __________ thoroughly prior to our quarterly budget conference.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "agenda",
            "B": "receipt",
            "C": "brochure",
            "D": "syllabus"
        },
        "dapAnDung": "agenda",
        "giaiThich": "\"Agenda\" là chương trình nghị sự cuộc họp."
    },
    {
        "id": 42,
        "noiDung": "After intense negotiation sessions, both corporations successfully reached a mutually beneficial __________.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "compromise",
            "B": "complaint",
            "C": "conflict",
            "D": "competition"
        },
        "dapAnDung": "compromise",
        "giaiThich": "\"Reach a compromise\" là đạt được thỏa hiệp đồng thuận."
    },
    {
        "id": 43,
        "noiDung": "The customer service director presented an innovative strategy to boost long-term client __________.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "retention",
            "B": "rejection",
            "C": "reduction",
            "D": "reaction"
        },
        "dapAnDung": "retention",
        "giaiThich": "\"Client retention\" là duy trì và giữ chân khách hàng."
    },
    {
        "id": 44,
        "noiDung": "All staff members are strictly mandated to abide by the corporation's professional code of __________.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "conduct",
            "B": "communication",
            "C": "compromise",
            "D": "competition"
        },
        "dapAnDung": "conduct",
        "giaiThich": "\"Code of conduct\" là quy tắc ứng xử chuẩn mực nghề nghiệp."
    },
    {
        "id": 45,
        "noiDung": "The management team conducted a comprehensive __________ analysis to identify internal strengths and weaknesses.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "SWOT",
            "B": "ATM",
            "C": "CEO",
            "D": "GPS"
        },
        "dapAnDung": "SWOT",
        "giaiThich": "Phân tích SWOT (Điểm mạnh, yếu, cơ hội, thách thức)."
    },
    {
        "id": 46,
        "noiDung": "We must negotiate favorable payment __________ with our primary raw material suppliers.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "terms",
            "B": "words",
            "C": "clauses",
            "D": "items"
        },
        "dapAnDung": "terms",
        "giaiThich": "\"Payment terms\" là các điều khoản thanh toán."
    },
    {
        "id": 47,
        "noiDung": "The new advertising campaign aims to expand our domestic market __________ by five percent.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "share",
            "B": "part",
            "C": "piece",
            "D": "slice"
        },
        "dapAnDung": "share",
        "giaiThich": "\"Market share\" là thị phần trên thị trường."
    },
    {
        "id": 48,
        "noiDung": "Employees who consistently demonstrate outstanding performance are eligible for annual performance __________.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "bonuses",
            "B": "invoices",
            "C": "agendas",
            "D": "penalties"
        },
        "dapAnDung": "bonuses",
        "giaiThich": "\"Performance bonuses\" là tiền thưởng theo năng suất."
    },
    {
        "id": 49,
        "noiDung": "Before entering new foreign markets, companies should conduct thorough market __________.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "research",
            "B": "invoice",
            "C": "complaint",
            "D": "compromise"
        },
        "dapAnDung": "research",
        "giaiThich": "\"Market research\" là nghiên cứu thị trường."
    },
    {
        "id": 50,
        "noiDung": "The company will __________ its new product line at the international consumer electronics expo.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "launch",
            "B": "dismiss",
            "C": "reject",
            "D": "cancel"
        },
        "dapAnDung": "launch",
        "giaiThich": "\"Launch a product line\" là tung ra dòng sản phẩm mới."
    },
    {
        "id": 51,
        "noiDung": "An \"agenda\" lists the specific items of business to be discussed during a formal meeting.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Agenda là danh mục các chủ đề cần thảo luận."
    },
    {
        "id": 52,
        "noiDung": "\"Customer retention\" measures a company's ability to maintain existing clients over an extended period.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Giữ chân khách hàng là chỉ số đo lường lòng trung thành."
    },
    {
        "id": 53,
        "noiDung": "A \"compromise\" occurs when both parties stubbornly refuse to make any concessions.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "B",
        "giaiThich": "Sai. Compromise là sự thỏa hiệp, mỗi bên nhượng bộ một phần để đạt được thỏa thuận."
    },
    {
        "id": 54,
        "noiDung": "\"Market share\" represents the percentage of an industry's total sales earned by a specific firm.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Thị phần là % doanh số của công ty so với toàn ngành."
    },
    {
        "id": 55,
        "noiDung": "Payment terms define the timeframe and method by which an invoice must be settled.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Điều khoản thanh toán quy định thời hạn và phương thức trả tiền."
    },
    {
        "id": 56,
        "noiDung": "SWOT analysis is a strategic planning tool evaluating Strengths, Weaknesses, Opportunities, and Threats.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. SWOT phân tích điểm mạnh, điểm yếu, cơ hội, nguy cơ."
    },
    {
        "id": 57,
        "noiDung": "Select all strategic business concepts: (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "SWOT analysis",
            "B": "market share expansion",
            "C": "office coffee break",
            "D": "client retention rate"
        },
        "dapAnDung": [
            "A",
            "B",
            "D"
        ],
        "giaiThich": "A, B, D là các khái niệm chiến lược kinh doanh."
    },
    {
        "id": 58,
        "noiDung": "Which phrases relate to meeting facilitation and agenda planning: (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "adopt the meeting agenda",
            "B": "reach a compromise",
            "C": "take meeting minutes",
            "D": "sell products retail"
        },
        "dapAnDung": [
            "A",
            "B",
            "C"
        ],
        "giaiThich": "Thông qua chương trình nghị sự, đạt thỏa hiệp, ghi biên bản họp (take minutes)."
    },
    {
        "id": 59,
        "noiDung": "Select all terms connected to business finance and supplier agreements: (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "payment terms",
            "B": "annual performance bonus",
            "C": "computer keyboard",
            "D": "credit terms"
        },
        "dapAnDung": [
            "A",
            "B",
            "D"
        ],
        "giaiThich": "Điều khoản thanh toán, thưởng hiệu suất, điều khoản tín dụng."
    },
    {
        "id": 60,
        "noiDung": "Identify all formal verbs used with business initiatives: (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "launch a campaign",
            "B": "conduct research",
            "C": "break a chair",
            "D": "negotiate terms"
        },
        "dapAnDung": [
            "A",
            "B",
            "D"
        ],
        "giaiThich": "Tung chiến dịch, làm nghiên cứu, đàm phán điều khoản."
    },
    {
        "id": 61,
        "noiDung": "The board voted unanimously to approve a hostile __________ bid for their rival telecom firm.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "takeover",
            "B": "retention",
            "C": "compromise",
            "D": "agenda"
        },
        "dapAnDung": "takeover",
        "giaiThich": "\"Hostile takeover\" là cuộc thâu tóm thù địch trong kinh doanh."
    },
    {
        "id": 62,
        "noiDung": "To safeguard against currency depreciation, our treasurer implemented robust financial __________ strategies.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "hedging",
            "B": "budgeting",
            "C": "discounting",
            "D": "launching"
        },
        "dapAnDung": "hedging",
        "giaiThich": "\"Hedging strategies\" là chiến lược phòng ngừa rủi ro tài chính."
    },
    {
        "id": 63,
        "noiDung": "The corporation reported substantial operational liabilities on its annual consolidated __________ sheet.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "balance",
            "B": "budget",
            "C": "profit",
            "D": "cash"
        },
        "dapAnDung": "balance",
        "giaiThich": "\"Balance sheet\" là bảng cân đối kế toán."
    },
    {
        "id": 64,
        "noiDung": "All executive officers are bound by a legal __________ responsibility to act in the best interests of shareholders.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "fiduciary",
            "B": "financial",
            "C": "fictional",
            "D": "flexible"
        },
        "dapAnDung": "fiduciary",
        "giaiThich": "\"Fiduciary responsibility\" là trách nhiệm ủy thác pháp lý của ban lãnh đạo."
    },
    {
        "id": 65,
        "noiDung": "The pharmaceutical company experienced significant equity dilution following a secondary __________ of shares.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "issuance",
            "B": "retention",
            "C": "compromise",
            "D": "complaint"
        },
        "dapAnDung": "issuance",
        "giaiThich": "\"Issuance of shares\" là việc phát hành thêm cổ phiếu."
    },
    {
        "id": 66,
        "noiDung": "Management introduced key performance __________ (KPIs) to evaluate employee productivity systematically.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "indicators",
            "B": "invoices",
            "C": "inspections",
            "D": "initiatives"
        },
        "dapAnDung": "indicators",
        "giaiThich": "KPIs (Key Performance Indicators) là các chỉ số đo lường hiệu suất then chốt."
    },
    {
        "id": 67,
        "noiDung": "Before finalizing the multi-billion-dollar merger, both parties conducted rigorous due __________.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "diligence",
            "B": "dedication",
            "C": "discipline",
            "D": "demand"
        },
        "dapAnDung": "diligence",
        "giaiThich": "\"Due diligence\" là việc thẩm định chi tiết toàn diện trước khi sáp nhập."
    },
    {
        "id": 68,
        "noiDung": "The central bank's sudden interest rate hike created severe liquidity constraints and market __________.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "volatility",
            "B": "retention",
            "C": "agenda",
            "D": "conduct"
        },
        "dapAnDung": "volatility",
        "giaiThich": "\"Market volatility\" là sự biến động dữ dội của thị trường."
    },
    {
        "id": 69,
        "noiDung": "The company decided to __________ non-core business assets to reduce debt.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "divest",
            "B": "invest",
            "C": "divert",
            "D": "launch"
        },
        "dapAnDung": "divest",
        "giaiThich": "\"Divest assets\" là thoái vốn, bán bớt tài sản không cốt lõi."
    },
    {
        "id": 70,
        "noiDung": "Our startup secured five million dollars in Series A __________ funding from prominent venture capitalists.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "equity",
            "B": "debt",
            "C": "agenda",
            "D": "conduct"
        },
        "dapAnDung": "equity",
        "giaiThich": "\"Equity funding\" là gọi vốn bằng cổ phần."
    },
    {
        "id": 71,
        "noiDung": "\"Due diligence\" refers to an exhaustive appraisal of a target firm's assets and liabilities prior to a transaction.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Thẩm định chi tiết là bước bắt buộc trước khi mua lại/sáp nhập."
    },
    {
        "id": 72,
        "noiDung": "A \"balance sheet\" summarizes a company's assets, liabilities, and shareholders' equity at a specific point in time.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Bảng cân đối kế toán thể hiện tài sản, nợ và vốn chủ sở hữu."
    },
    {
        "id": 73,
        "noiDung": "\"Hedging\" is purely a speculative strategy designed to maximize gambling profits in stock markets.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "B",
        "giaiThich": "Sai. Hedging là phòng hộ rủi ro, bảo vệ tài sản khỏi biến động giá, không phải đầu cơ cờ bạc."
    },
    {
        "id": 74,
        "noiDung": "\"Divestiture\" involves selling off an operational subsidiary or non-core business assets.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Thoái vốn là việc bán công ty con hoặc tài sản phụ."
    },
    {
        "id": 75,
        "noiDung": "\"Fiduciary duty\" implies that directors can prioritize their personal interests over those of stockholders.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "B",
        "giaiThich": "Sai. Trách nhiệm ủy thác yêu cầu đặt quyền lợi của cổ đông lên trên lợi ích cá nhân."
    },
    {
        "id": 76,
        "noiDung": "Key Performance Indicators (KPIs) provide quantifiable metrics to gauge operational progress toward strategic goals.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. KPIs là chỉ số định lượng đánh giá hiệu quả chiến lược."
    },
    {
        "id": 77,
        "noiDung": "Select all core financial accounting statements: (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "balance sheet",
            "B": "income statement",
            "C": "cash flow statement",
            "D": "marketing brochure"
        },
        "dapAnDung": [
            "A",
            "B",
            "C"
        ],
        "giaiThich": "Bảng cân đối, báo cáo kết quả kinh doanh, lưu chuyển tiền tệ là 3 báo cáo tài chính cốt lõi."
    },
    {
        "id": 78,
        "noiDung": "Which concepts are fundamental to Mergers and Acquisitions (M&A): (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "due diligence investigation",
            "B": "hostile takeover bid",
            "C": "office dress code",
            "D": "asset divestiture"
        },
        "dapAnDung": [
            "A",
            "B",
            "D"
        ],
        "giaiThich": "Thẩm định chi tiết, thâu tóm thù địch, thoái vốn là các khái niệm M&A."
    },
    {
        "id": 79,
        "noiDung": "Select all risks associated with macroeconomic financial markets: (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "currency volatility",
            "B": "liquidity constraints",
            "C": "printing ink shortage",
            "D": "interest rate fluctuations"
        },
        "dapAnDung": [
            "A",
            "B",
            "D"
        ],
        "giaiThich": "Biến động tiền tệ, hạn chế thanh khoản, lãi suất thay đổi là rủi ro vĩ mô."
    },
    {
        "id": 80,
        "noiDung": "Identify all legitimate avenues of corporate capitalization: (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "venture capital equity investment",
            "B": "secondary issuance of shares",
            "C": "petty cash theft",
            "D": "corporate bond issuance"
        },
        "dapAnDung": [
            "A",
            "B",
            "D"
        ],
        "giaiThich": "Đầu tư mạo hiểm, phát hành thêm cổ phiếu, phát hành trái phiếu là các kênh huy động vốn."
    },
    {
        "id": 81,
        "noiDung": "The antitrust tribunal initiated an anti-monopoly probe into the conglomerate's alleged predatory __________.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "pricing",
            "B": "retention",
            "C": "hedging",
            "D": "divestment"
        },
        "dapAnDung": "pricing",
        "giaiThich": "\"Predatory pricing\" là chính sách định giá mang tính thôn tính nhằm triệt hạ đối thủ."
    },
    {
        "id": 82,
        "noiDung": "The independent audit firm declined to express an opinion, citing pervasive accounting __________.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "irregularities",
            "B": "compromises",
            "C": "initiatives",
            "D": "agendas"
        },
        "dapAnDung": "irregularities",
        "giaiThich": "\"Accounting irregularities\" là những điểm bất thường, gian lận kế toán."
    },
    {
        "id": 83,
        "noiDung": "The enterprise engaged in debt-for-equity __________ to avert imminent insolvency.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "swaps",
            "B": "takes",
            "C": "shares",
            "D": "invoices"
        },
        "dapAnDung": "swaps",
        "giaiThich": "\"Debt-for-equity swap\" là hoán đổi nợ thành cổ phần để cứu doanh nghiệp thoát phá sản."
    },
    {
        "id": 84,
        "noiDung": "Senior executives exercised their vested stock __________ before the quarterly earnings announcement.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "options",
            "B": "cards",
            "C": "conducts",
            "D": "invoices"
        },
        "dapAnDung": "options",
        "giaiThich": "\"Vested stock options\" là quyền chọn mua cổ phiếu đã đến hạn thực hiện."
    },
    {
        "id": 85,
        "noiDung": "The firm established a special purpose vehicle (SPV) to keep major project debt off its __________.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "balance sheet",
            "B": "income statement",
            "C": "market share",
            "D": "agenda"
        },
        "dapAnDung": "balance sheet",
        "giaiThich": "Tạo SPV để đưa khoản nợ ra ngoài bảng cân đối kế toán (off-balance-sheet financing)."
    },
    {
        "id": 86,
        "noiDung": "The cross-border acquisition triggered intense scrutiny under foreign direct investment (FDI) __________ laws.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "clearance",
            "B": "complaint",
            "C": "discount",
            "D": "conduct"
        },
        "dapAnDung": "clearance",
        "giaiThich": "\"FDI clearance\" là việc phê duyệt vốn đầu tư nước ngoài của cơ quan quản lý."
    },
    {
        "id": 87,
        "noiDung": "In an era of rapid disruption, agility and digital transformation have become vital strategic __________.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "imperatives",
            "B": "invoices",
            "C": "discounts",
            "D": "cards"
        },
        "dapAnDung": "imperatives",
        "giaiThich": "\"Strategic imperatives\" là những mệnh lệnh/yêu cầu chiến lược sống còn."
    },
    {
        "id": 88,
        "noiDung": "The corporate governance committee recommended splitting the roles of CEO and Chairman to reduce conflict of __________.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "interest",
            "B": "agenda",
            "C": "balance",
            "D": "option"
        },
        "dapAnDung": "interest",
        "giaiThich": "\"Conflict of interest\" là xung đột lợi ích."
    },
    {
        "id": 89,
        "noiDung": "The bank's credit rating was downgraded following severe undercollateralized sovereign __________ exposure.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "debt",
            "B": "discount",
            "C": "invoice",
            "D": "conduct"
        },
        "dapAnDung": "debt",
        "giaiThich": "\"Sovereign debt exposure\" là rủi ro nợ công của chính phủ."
    },
    {
        "id": 90,
        "noiDung": "Shareholders filed a derivative lawsuit alleging gross breach of fiduciary __________ by the supervisory board.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "duty",
            "B": "discount",
            "C": "agenda",
            "D": "card"
        },
        "dapAnDung": "duty",
        "giaiThich": "\"Breach of fiduciary duty\" là vi phạm nghĩa vụ ủy thác đối với cổ đông."
    },
    {
        "id": 91,
        "noiDung": "\"Predatory pricing\" involves setting artificially low prices to drive rivals out of the market and secure a monopoly.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Định giá săn mồi là hành vi độc quyền vi phạm luật cạnh tranh."
    },
    {
        "id": 92,
        "noiDung": "A \"Special Purpose Vehicle\" (SPV) is a subsidiary created to isolate financial risk and manage specific assets.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. SPV là công ty chuyên dụng quản lý rủi ro độc lập."
    },
    {
        "id": 93,
        "noiDung": "A \"debt-for-equity swap\" forces a company into liquidation without any renegotiation with creditors.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "B",
        "giaiThich": "Sai. Hoán đổi nợ - cổ phần là biện pháp tái cấu trúc giúp công ty không bị phá sản."
    },
    {
        "id": 94,
        "noiDung": "\"Conflict of interest\" occurs when an individual's personal interests compromise their professional judgement.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Xung đột lợi ích làm suy giảm tính khách quan nghề nghiệp."
    },
    {
        "id": 95,
        "noiDung": "Vested stock options can only be exercised after specific milestone conditions or vesting periods are satisfied.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Quyền chọn cổ phiếu chỉ được thực hiện khi thỏa mãn điều kiện thời gian hoặc cam kết."
    },
    {
        "id": 96,
        "noiDung": "Corporate governance refers exclusively to the internal office decoration guidelines adopted by a company.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "B",
        "giaiThich": "Sai. Quản trị doanh nghiệp (Corporate governance) là hệ thống luật lệ, cơ chế kiểm soát và điều hành toàn bộ công ty."
    },
    {
        "id": 97,
        "noiDung": "Select all corporate governance principles essential for public companies: (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "independent board oversight",
            "B": "mitigation of conflicts of interest",
            "C": "unrestricted insider trading",
            "D": "transparent financial disclosure"
        },
        "dapAnDung": [
            "A",
            "B",
            "D"
        ],
        "giaiThich": "A, B, D là chuẩn mực quản trị doanh nghiệp. C là hành vi giao dịch nội gián phi pháp."
    },
    {
        "id": 98,
        "noiDung": "Which complex financial mechanisms are used in corporate debt restructuring: (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "debt-for-equity swaps",
            "B": "covenant waivers and renegotiations",
            "C": "petty cash disbursements",
            "D": "personal lottery wins"
        },
        "dapAnDung": [
            "A",
            "B"
        ],
        "giaiThich": "Hoán đổi nợ thành cổ phần và miễn giảm cam kết tài chính (covenant waivers)."
    },
    {
        "id": 99,
        "noiDung": "Select all practices scrutinized under antitrust and fair competition legislation: (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "predatory pricing strategies",
            "B": "collusive market allocation cartels",
            "C": "transparent wholesale discounts",
            "D": "abusive monopoly power"
        },
        "dapAnDung": [
            "A",
            "B",
            "D"
        ],
        "giaiThich": "Định giá hủy diệt, thông đồng phân chia thị trường, lạm dụng vị thế độc quyền."
    },
    {
        "id": 100,
        "noiDung": "Identify all formal legal and corporate terms: (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "fiduciary duty",
            "B": "special purpose vehicle (SPV)",
            "C": "office gossip session",
            "D": "derivative shareholder litigation"
        },
        "dapAnDung": [
            "A",
            "B",
            "D"
        ],
        "giaiThich": "A, B, D là thuật ngữ pháp lý doanh nghiệp cao cấp."
    }
]
};
