import { CurriculumTopicBank } from './types';

export const TOURISM_TRAVEL_BANK: CurriculumTopicBank = {
  key: 'TOURISM_TRAVEL',
  tenChuDe: 'Từ Vựng Du Lịch, Khách Sạn & Khám Phá (Travel & Tourism)',
  aliases: [
    "du lịch",
    "du lich",
    "travel",
    "tourism",
    "khách sạn",
    "khach san",
    "hotel",
    "đặt phòng",
    "booking",
    "sân bay",
    "airport",
    "hộ chiếu",
    "passport",
    "vé máy bay"
],
  questions: [
    {
        "id": 1,
        "noiDung": "You must show your valid __________ at airport border security.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "passport",
            "B": "hotel",
            "C": "suitcase",
            "D": "ticket"
        },
        "dapAnDung": "passport",
        "giaiThich": "\"Passport\" là hộ chiếu xuất nhập cảnh."
    },
    {
        "id": 2,
        "noiDung": "I booked a double room with an ocean view at a beachside __________.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "hotel",
            "B": "airplane",
            "C": "station",
            "D": "airport"
        },
        "dapAnDung": "hotel",
        "giaiThich": "\"Hotel\" là khách sạn nghỉ dưỡng."
    },
    {
        "id": 3,
        "noiDung": "Don't forget to pack your warm clothes into your __________.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "suitcase",
            "B": "passport",
            "C": "ticket",
            "D": "airport"
        },
        "dapAnDung": "suitcase",
        "giaiThich": "\"Suitcase\" là vali hành lý."
    },
    {
        "id": 4,
        "noiDung": "Our flight to Tokyo departs from gate number __________.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "seven",
            "B": "passport",
            "C": "hotel",
            "D": "beach"
        },
        "dapAnDung": "seven",
        "giaiThich": "Cổng khởi hành sân bay: gate number seven."
    },
    {
        "id": 5,
        "noiDung": "How much is a return train __________ to London?",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "ticket",
            "B": "passport",
            "C": "suitcase",
            "D": "hotel"
        },
        "dapAnDung": "ticket",
        "giaiThich": "\"Train ticket\" là vé tàu hỏa."
    },
    {
        "id": 6,
        "noiDung": "We took a city bus to visit the famous historical __________.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "museum",
            "B": "suitcase",
            "C": "passport",
            "D": "ticket"
        },
        "dapAnDung": "museum",
        "giaiThich": "\"Museum\" là bảo tàng tham quan."
    },
    {
        "id": 7,
        "noiDung": "The sandy __________ was crowded with tourists enjoying the sunshine.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "beach",
            "B": "airport",
            "C": "suitcase",
            "D": "station"
        },
        "dapAnDung": "beach",
        "giaiThich": "\"Beach\" là bãi biển."
    },
    {
        "id": 8,
        "noiDung": "We arrived at the international __________ two hours before our departure.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "airport",
            "B": "hotel",
            "C": "beach",
            "D": "passport"
        },
        "dapAnDung": "airport",
        "giaiThich": "\"Airport\" là sân bay quốc tế."
    },
    {
        "id": 9,
        "noiDung": "I want to take lots of beautiful __________ during my holiday in Da Nang.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "photos",
            "B": "passports",
            "C": "hotels",
            "D": "suitcases"
        },
        "dapAnDung": "photos",
        "giaiThich": "\"Take photos\" là chụp ảnh kỷ niệm."
    },
    {
        "id": 10,
        "noiDung": "Can you show me the way to the central train __________?",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "station",
            "B": "beach",
            "C": "hotel",
            "D": "suitcase"
        },
        "dapAnDung": "station",
        "giaiThich": "\"Train station\" là nhà ga xe lửa."
    },
    {
        "id": 11,
        "noiDung": "A \"passport\" is an official government document required for international travel.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Hộ chiếu là giấy tờ pháp lý để xuất nhập cảnh quốc tế."
    },
    {
        "id": 12,
        "noiDung": "A \"boarding pass\" is a document you eat for breakfast at a restaurant.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "B",
        "giaiThich": "Sai. Boarding pass là thẻ lên máy bay, không phải đồ ăn."
    },
    {
        "id": 13,
        "noiDung": "You use a \"suitcase\" to carry clothes and personal belongings while traveling.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Vali dùng để đựng hành lý và đồ dùng cá nhân."
    },
    {
        "id": 14,
        "noiDung": "An \"airport departure gate\" is where passengers wait to board their flight.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Cổng khởi hành là nơi hành khách chờ lên máy bay."
    },
    {
        "id": 15,
        "noiDung": "A hotel room with an \"ocean view\" looks directly onto the sea.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Phòng hướng biển (ocean view) nhìn thẳng ra biển."
    },
    {
        "id": 16,
        "noiDung": "Trains and airplanes are forms of public transportation.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Tàu hỏa và máy bay là các phương tiện giao thông vận tải công cộng."
    },
    {
        "id": 17,
        "noiDung": "Select all essential items packed for an international trip: (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "valid passport",
            "B": "flight tickets",
            "C": "packed suitcase",
            "D": "heavy desktop monitor"
        },
        "dapAnDung": [
            "A",
            "B",
            "C"
        ],
        "giaiThich": "Hộ chiếu, vé máy bay, vali hành lý là đồ dùng du lịch thiết yếu."
    },
    {
        "id": 18,
        "noiDung": "Which places are commonly visited by tourists on vacation: (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "sandy beaches",
            "B": "historic museums",
            "C": "industrial factories",
            "D": "ancient temples"
        },
        "dapAnDung": [
            "A",
            "B",
            "D"
        ],
        "giaiThich": "Bãi biển, bảo tàng, đền chùa cổ kính là điểm du lịch hấp dẫn."
    },
    {
        "id": 19,
        "noiDung": "Select all forms of passenger travel transportation: (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "commercial airplane",
            "B": "passenger train",
            "C": "cruise ship",
            "D": "office printer"
        },
        "dapAnDung": [
            "A",
            "B",
            "C"
        ],
        "giaiThich": "Máy bay, tàu hỏa, tàu du lịch là phương tiện chuyên chở hành khách."
    },
    {
        "id": 20,
        "noiDung": "Identify all hotel facilities offered to guests: (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "swimming pool",
            "B": "free breakfast buffet",
            "C": "passport confiscation",
            "D": "complimentary Wi-Fi"
        },
        "dapAnDung": [
            "A",
            "B",
            "D"
        ],
        "giaiThich": "Hồ bơi, bữa sáng buffet, wifi miễn phí là dịch vụ khách sạn."
    },
    {
        "id": 21,
        "noiDung": "Please proceed to the check-in __________ to drop off your oversized luggage.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "counter",
            "B": "beach",
            "C": "museum",
            "D": "itinerary"
        },
        "dapAnDung": "counter",
        "giaiThich": "\"Check-in counter\" là quầy làm thủ tục tại sân bay."
    },
    {
        "id": 22,
        "noiDung": "Excuse me, could you give me __________ to the nearest underground metro station?",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "directions",
            "B": "passports",
            "C": "suitcases",
            "D": "hotels"
        },
        "dapAnDung": "directions",
        "giaiThich": "\"Ask for directions\" là hỏi đường đi."
    },
    {
        "id": 23,
        "noiDung": "We made an online __________ for three nights at a boutique bed-and-breakfast.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "reservation",
            "B": "direction",
            "C": "suitcase",
            "D": "counter"
        },
        "dapAnDung": "reservation",
        "giaiThich": "\"Make a reservation\" là đặt chỗ trước."
    },
    {
        "id": 24,
        "noiDung": "All passengers must fasten their seatbelts during airplane __________ and landing.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "takeoff",
            "B": "checkout",
            "C": "reservation",
            "D": "counter"
        },
        "dapAnDung": "takeoff",
        "giaiThich": "\"Takeoff and landing\" là cất cánh và hạ cánh."
    },
    {
        "id": 25,
        "noiDung": "Our tour __________ explained the ancient legends of the historic fortress.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "guide",
            "B": "counter",
            "C": "ticket",
            "D": "suitcase"
        },
        "dapAnDung": "guide",
        "giaiThich": "\"Tour guide\" là hướng dẫn viên du lịch."
    },
    {
        "id": 26,
        "noiDung": "You should exchange your domestic currency at the official airport __________ booth.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "currency exchange",
            "B": "check-in counter",
            "C": "souvenir shop",
            "D": "baggage claim"
        },
        "dapAnDung": "currency exchange",
        "giaiThich": "\"Currency exchange\" là quầy đổi ngoại tệ."
    },
    {
        "id": 27,
        "noiDung": "We spent the entire afternoon __________ through the historic cobblestone alleys.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "sightseeing",
            "B": "checking in",
            "C": "boarding",
            "D": "packing"
        },
        "dapAnDung": "sightseeing",
        "giaiThich": "\"Go sightseeing\" là đi ngắm cảnh, tham quan."
    },
    {
        "id": 28,
        "noiDung": "Please collect your checked baggage from carousel number four at the baggage __________ area.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "claim",
            "B": "counter",
            "C": "gate",
            "D": "guide"
        },
        "dapAnDung": "claim",
        "giaiThich": "\"Baggage claim\" là khu vực nhận lại hành lý ký gửi."
    },
    {
        "id": 29,
        "noiDung": "Hotel __________ time is strictly at 12:00 noon; late departure may incur a fee.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "checkout",
            "B": "takeoff",
            "C": "sightseeing",
            "D": "boarding"
        },
        "dapAnDung": "checkout",
        "giaiThich": "\"Hotel checkout\" là thủ tục trả phòng khách sạn."
    },
    {
        "id": 30,
        "noiDung": "I bought a handcrafted ceramic magnet as a __________ of our trip to Hoi An.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "souvenir",
            "B": "passport",
            "C": "itinerary",
            "D": "reservation"
        },
        "dapAnDung": "souvenir",
        "giaiThich": "\"Souvenir\" là quà lưu niệm."
    },
    {
        "id": 31,
        "noiDung": "\"Baggage claim\" is the designated area in an airport where passengers retrieve checked luggage.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Baggage claim là băng chuyền nhận hành lý ký gửi."
    },
    {
        "id": 32,
        "noiDung": "\"Hotel checkout\" refers to the process of arriving and receiving your room keys for the first time.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "B",
        "giaiThich": "Sai. Đó là \"check-in\"; còn \"checkout\" là trả phòng và thanh toán khi rời đi."
    },
    {
        "id": 33,
        "noiDung": "A \"souvenir\" is an object purchased as a memento of a travel destination.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Souvenir là đồ lưu niệm gợi nhớ về chuyến đi."
    },
    {
        "id": 34,
        "noiDung": "Passengers are permitted to unfasten their seatbelts during turbulent airplane takeoff.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "B",
        "giaiThich": "Sai. Khi máy bay cất cánh bắt buộc phải thắt chặt dây an toàn."
    },
    {
        "id": 35,
        "noiDung": "A \"tour guide\" provides cultural, historical, and geographical commentary to travelers.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Hướng dẫn viên du lịch thuyết minh lịch sử, văn hóa cho du khách."
    },
    {
        "id": 36,
        "noiDung": "Foreign currency can be converted into local money at an exchange booth.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Quầy ngoại tệ dùng để đổi tiền sang đồng bản địa."
    },
    {
        "id": 37,
        "noiDung": "Select all common airport checkpoints and facilities: (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "check-in counter",
            "B": "baggage claim area",
            "C": "security screening gate",
            "D": "hotel master bedroom"
        },
        "dapAnDung": [
            "A",
            "B",
            "C"
        ],
        "giaiThich": "Quầy check-in, khu lấy hành lý, cổng soi chiếu an ninh là cơ sở tại sân bay."
    },
    {
        "id": 38,
        "noiDung": "Which activities are typical for recreational vacation travelers: (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "guided city sightseeing",
            "B": "purchasing local souvenirs",
            "C": "filing tax audits",
            "D": "trying traditional regional cuisine"
        },
        "dapAnDung": [
            "A",
            "B",
            "D"
        ],
        "giaiThich": "Ngắm cảnh, mua quà lưu niệm, thưởng thức ẩm thực bản địa."
    },
    {
        "id": 39,
        "noiDung": "Select all terms relating to hotel accommodations: (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "room reservation",
            "B": "late checkout fee",
            "C": "airplane runway",
            "D": "complimentary breakfast buffet"
        },
        "dapAnDung": [
            "A",
            "B",
            "D"
        ],
        "giaiThich": "Đặt phòng, phí trả phòng trễ, buffet sáng là thuật ngữ khách sạn."
    },
    {
        "id": 40,
        "noiDung": "Identify all words connected to money and travel transactions: (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "currency exchange",
            "B": "entrance admission fee",
            "C": "service tipping",
            "D": "mountain hiking trail"
        },
        "dapAnDung": [
            "A",
            "B",
            "C"
        ],
        "giaiThich": "Đổi ngoại tệ, phí vào cổng, tiền boa (tip) là các giao dịch tiền tệ khi du lịch."
    },
    {
        "id": 41,
        "noiDung": "Our travel agent prepared a comprehensive day-by-day travel __________ covering five European capitals.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "itinerary",
            "B": "souvenir",
            "C": "reservation",
            "D": "passport"
        },
        "dapAnDung": "itinerary",
        "giaiThich": "\"Itinerary\" là lịch trình chuyến đi chi tiết."
    },
    {
        "id": 42,
        "noiDung": "Purchasing international travel __________ protects you against unforeseen medical emergencies abroad.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "insurance",
            "B": "itinerary",
            "C": "souvenir",
            "D": "takeoff"
        },
        "dapAnDung": "insurance",
        "giaiThich": "\"Travel insurance\" là bảo hiểm du lịch."
    },
    {
        "id": 43,
        "noiDung": "Before entering the transit lounge, all international travelers must clear customs and __________ declarations.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "customs",
            "B": "reservations",
            "C": "itineraries",
            "D": "souvenirs"
        },
        "dapAnDung": "customs",
        "giaiThich": "\"Customs declarations\" là thủ tục khai báo hải quan."
    },
    {
        "id": 44,
        "noiDung": "Due to an unexpected mechanical fault, our connecting flight suffered a four-hour __________.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "layover",
            "B": "itinerary",
            "C": "souvenir",
            "D": "reservation"
        },
        "dapAnDung": "layover",
        "giaiThich": "\"Layover\" là thời gian quá cảnh/chờ nối chuyến tại sân bay trung gian."
    },
    {
        "id": 45,
        "noiDung": "The coastal resort promotes eco-friendly practices to preserve fragile marine __________.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "ecosystems",
            "B": "itineraries",
            "C": "passports",
            "D": "counters"
        },
        "dapAnDung": "ecosystems",
        "giaiThich": "\"Marine ecosystems\" là hệ sinh thái biển ven bờ."
    },
    {
        "id": 46,
        "noiDung": "Travelers visiting certain tropical nations must present proof of mandatory yellow fever __________.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "vaccination",
            "B": "itinerary",
            "C": "souvenir",
            "D": "reservation"
        },
        "dapAnDung": "vaccination",
        "giaiThich": "\"Vaccination\" là chứng nhận tiêm chủng vắc-xin."
    },
    {
        "id": 47,
        "noiDung": "Our boutique hotel provided a complimentary shuttle service to and from the international __________.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "terminal",
            "B": "itinerary",
            "C": "souvenir",
            "D": "counter"
        },
        "dapAnDung": "terminal",
        "giaiThich": "\"Airport terminal\" là nhà ga sân bay."
    },
    {
        "id": 48,
        "noiDung": "She prefers off-the-beaten-__________ backpacking adventures over crowded resort package tours.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "track",
            "B": "road",
            "C": "path",
            "D": "trail"
        },
        "dapAnDung": "track",
        "giaiThich": "\"Off-the-beaten-track\" là đi đến những nơi hoang sơ ít người biết."
    },
    {
        "id": 49,
        "noiDung": "The airline offered complimentary hotel accommodation to all passengers affected by flight __________.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "cancellations",
            "B": "itineraries",
            "C": "souvenirs",
            "D": "passports"
        },
        "dapAnDung": "cancellations",
        "giaiThich": "\"Flight cancellations\" là việc hủy chuyến bay."
    },
    {
        "id": 50,
        "noiDung": "Please ensure your passport has at least six months of remaining __________ prior to international travel.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "validity",
            "B": "reservation",
            "C": "itinerary",
            "D": "souvenir"
        },
        "dapAnDung": "validity",
        "giaiThich": "\"Passport validity\" là thời hạn hiệu lực của hộ chiếu (ít nhất 6 tháng)."
    },
    {
        "id": 51,
        "noiDung": "An \"itinerary\" outlines the planned schedule of travel events, dates, and destinations.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Lịch trình du lịch ghi rõ ngày giờ và điểm đến."
    },
    {
        "id": 52,
        "noiDung": "\"Travel insurance\" reimburses policyholders for covered expenses like medical emergencies or trip cancellations.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Bảo hiểm du lịch chi trả chi phí y tế khẩn cấp và bồi thường hủy chuyến."
    },
    {
        "id": 53,
        "noiDung": "A \"layover\" refers to the final destination where a passenger disembarks and ends their journey permanently.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "B",
        "giaiThich": "Sai. Layover là điểm dừng chuyển tiếp/quá cảnh tạm thời, không phải điểm đến cuối cùng."
    },
    {
        "id": 54,
        "noiDung": "Many countries mandate that a visitor's passport must remain valid for at least six months beyond their travel dates.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Đa số các nước yêu cầu hộ chiếu còn hạn tối thiểu 6 tháng."
    },
    {
        "id": 55,
        "noiDung": "\"Customs\" officials are responsible for inspecting imported goods and collecting applicable import tariffs.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Hải quan kiểm tra hàng hóa xuất nhập khẩu và thu thuế."
    },
    {
        "id": 56,
        "noiDung": "\"Off-the-beaten-track\" destinations are typically overcrowded tourist hubs located in metropolitan capitals.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "B",
        "giaiThich": "Sai. Địa điểm off-the-beaten-track là nơi hẻo lánh, nguyên sơ, vắng khách du lịch."
    },
    {
        "id": 57,
        "noiDung": "Select all official travel documents and administrative requirements: (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "customs declaration form",
            "B": "entry tourist visa",
            "C": "souvenir postcard",
            "D": "international vaccination certificate"
        },
        "dapAnDung": [
            "A",
            "B",
            "D"
        ],
        "giaiThich": "Tờ khai hải quan, thị thực visa, chứng nhận tiêm chủng là giấy tờ pháp lý."
    },
    {
        "id": 58,
        "noiDung": "Which terms relate to air travel logistics and transit delays: (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "scheduled layover duration",
            "B": "flight cancellation compensation",
            "C": "airport passenger terminal",
            "D": "hotel swimming pool"
        },
        "dapAnDung": [
            "A",
            "B",
            "C"
        ],
        "giaiThich": "Thời gian quá cảnh, bồi thường hủy chuyến, nhà ga sân bay."
    },
    {
        "id": 59,
        "noiDung": "Select all responsible eco-tourism and cultural exploration concepts: (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "off-the-beaten-track expeditions",
            "B": "fragile ecosystem conservation",
            "C": "littering plastic bottles on coral reefs",
            "D": "supporting indigenous artisan communities"
        },
        "dapAnDung": [
            "A",
            "B",
            "D"
        ],
        "giaiThich": "Khám phá nơi hoang sơ, bảo tồn hệ sinh thái, ủng hộ nghệ nhân địa phương."
    },
    {
        "id": 60,
        "noiDung": "Identify all protections commonly covered under comprehensive travel insurance: (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "emergency medical evacuation",
            "B": "lost baggage reimbursement",
            "C": "gambling casino losses",
            "D": "trip cancellation reimbursement"
        },
        "dapAnDung": [
            "A",
            "B",
            "D"
        ],
        "giaiThich": "Cấp cứu y tế khẩn cấp, bồi thường mất hành lý, hoàn tiền hủy chuyến bay."
    },
    {
        "id": 61,
        "noiDung": "The Ministry of Foreign Affairs issued an urgent travel __________ warning citizens against non-essential travel.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "advisory",
            "B": "itinerary",
            "C": "reservation",
            "D": "souvenir"
        },
        "dapAnDung": "advisory",
        "giaiThich": "\"Travel advisory\" là cảnh báo du lịch chính thức từ Bộ Ngoại Giao."
    },
    {
        "id": 62,
        "noiDung": "Unregulated mass tourism has led to the severe degradation of fragile World __________ sites.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "Heritage",
            "B": "Counter",
            "C": "Terminal",
            "D": "Claim"
        },
        "dapAnDung": "Heritage",
        "giaiThich": "\"World Heritage sites\" là các di sản thế giới được UNESCO công nhận."
    },
    {
        "id": 63,
        "noiDung": "The remote archipelago operates sustainable __________ tourism that caps daily visitor intake strictly.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "eco-",
            "B": "mass-",
            "C": "industrial-",
            "D": "fast-"
        },
        "dapAnDung": "eco-",
        "giaiThich": "\"Eco-tourism\" là du lịch sinh thái bền vững hạn chế lượng khách."
    },
    {
        "id": 64,
        "noiDung": "The embassy expedited the processing of our diplomatic __________ prior to the bilateral summit.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "visas",
            "B": "itineraries",
            "C": "layovers",
            "D": "counters"
        },
        "dapAnDung": "visas",
        "giaiThich": "\"Diplomatic visas\" là thị thực ngoại giao."
    },
    {
        "id": 65,
        "noiDung": "Rapid commercialization threatens to erode the authentic cultural __________ of indigenous mountain communities.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "heritage",
            "B": "baggage",
            "C": "reservation",
            "D": "ticket"
        },
        "dapAnDung": "heritage",
        "giaiThich": "\"Cultural heritage\" là di sản văn hóa truyền thống."
    },
    {
        "id": 66,
        "noiDung": "The national park charges a conservation __________ to fund endangered wildlife habitat restoration.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "levy",
            "B": "itinerary",
            "C": "souvenir",
            "D": "passport"
        },
        "dapAnDung": "levy",
        "giaiThich": "\"Conservation levy/fee\" là khoản phí bảo tồn thiên nhiên."
    },
    {
        "id": 67,
        "noiDung": "The hospitality group expanded its luxury portfolio by acquiring a prestigious __________ hotel chain.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "boutique",
            "B": "baggage",
            "C": "counter",
            "D": "layover"
        },
        "dapAnDung": "boutique",
        "giaiThich": "\"Boutique hotel\" là khách sạn phong cách độc đáo, sang trọng."
    },
    {
        "id": 68,
        "noiDung": "Travelers caught smuggling endangered flora or fauna face severe criminal __________ under international law.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "penalties",
            "B": "itineraries",
            "C": "advisories",
            "D": "souvenirs"
        },
        "dapAnDung": "penalties",
        "giaiThich": "\"Criminal penalties\" là các hình phạt hình sự nghiêm khắc."
    },
    {
        "id": 69,
        "noiDung": "The local municipal government introduced dynamic congestion __________ on cruise ships docking at the historic harbor.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "tariffs",
            "B": "itineraries",
            "C": "baggage",
            "D": "counters"
        },
        "dapAnDung": "tariffs",
        "giaiThich": "\"Congestion tariffs\" là thuế/phí chống quá tải đối với tàu du lịch."
    },
    {
        "id": 70,
        "noiDung": "The tour operator specializes in high-altitude mountaineering __________ across the Himalayas.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "expeditions",
            "B": "itineraries",
            "C": "reservations",
            "D": "layovers"
        },
        "dapAnDung": "expeditions",
        "giaiThich": "\"Mountaineering expeditions\" là các chuyến thám hiểm leo núi chuyên nghiệp."
    },
    {
        "id": 71,
        "noiDung": "A \"travel advisory\" provides official governmental guidance regarding safety and security risks abroad.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Khuyến cáo du lịch cảnh báo các rủi ro chiến sự, dịch bệnh, an ninh."
    },
    {
        "id": 72,
        "noiDung": "\"Overtourism\" describes the negative socio-ecological impacts when visitors exceed a destination's carrying capacity.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Du lịch quá tải gây hủy hoại môi trường và xáo trộn đời sống bản địa."
    },
    {
        "id": 73,
        "noiDung": "UNESCO World Heritage designations permit unrestricted commercial development and strip mining on historical monuments.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "B",
        "giaiThich": "Sai. Di sản UNESCO cấm khai thác hủy hoại và áp đặt quy chế bảo tồn nghiêm ngặt."
    },
    {
        "id": 74,
        "noiDung": "A \"boutique hotel\" is typically characterized by intimate scale, unique thematic design, and personalized service.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Khách sạn boutique mang thiết kế đặc sắc và dịch vụ cá nhân hóa cao."
    },
    {
        "id": 75,
        "noiDung": "CITES regulations strictly prohibit the unauthorized international commercial trade of endangered species.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Công ước CITES cấm buôn bán động thực vật hoang dã nguy cấp."
    },
    {
        "id": 76,
        "noiDung": "Congestion tariffs on tourist cruise liners are intended to encourage even larger crowds to flood historic centers.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "B",
        "giaiThich": "Sai. Thuế quá tải được ban hành nhằm hạn chế mật độ du khách tràn ngập các khu di tích."
    },
    {
        "id": 77,
        "noiDung": "Select all challenges and consequences associated with overtourism: (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "accelerated erosion of fragile historical landmarks",
            "B": "skyrocketing local residential rental prices",
            "C": "instant preservation of pristine coral reefs",
            "D": "strain on local water and municipal waste management"
        },
        "dapAnDung": [
            "A",
            "B",
            "D"
        ],
        "giaiThich": "Xói mòn di tích, giá thuê nhà tăng vọt, quá tải rác thải là hậu quả của du lịch đại chúng."
    },
    {
        "id": 78,
        "noiDung": "Which measures promote sustainable tourism and ecological conservation: (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "capping daily visitor allocations at fragile heritage sites",
            "B": "earmarking tourist levies directly for reforestation",
            "C": "banning single-use plastics across marine national parks",
            "D": "permitting unregulated souvenir coral harvesting"
        },
        "dapAnDung": [
            "A",
            "B",
            "C"
        ],
        "giaiThich": "A, B, C là các biện pháp bảo tồn sinh thái bền vững."
    },
    {
        "id": 79,
        "noiDung": "Select all official diplomatic travel categorizations: (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "consular travel advisory",
            "B": "biometric visa exemption agreement",
            "C": "souvenir shopping spree",
            "D": "diplomatic immunity passport"
        },
        "dapAnDung": [
            "A",
            "B",
            "D"
        ],
        "giaiThich": "Cảnh báo lãnh sự, miễn thị thực sinh trắc học, hộ chiếu ngoại giao."
    },
    {
        "id": 80,
        "noiDung": "Identify all characteristics defining boutique and luxury hospitality: (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "curated bespoke guest experiences",
            "B": "distinctive regional architectural aesthetics",
            "C": "mass industrial dormitory bunks",
            "D": "personalized concierge services"
        },
        "dapAnDung": [
            "A",
            "B",
            "D"
        ],
        "giaiThich": "Trải nghiệm may đo riêng, kiến trúc độc bản, dịch vụ quản gia cá nhân hóa."
    },
    {
        "id": 81,
        "noiDung": "The influx of mass tourism threatens to commodify indigenous cultural __________ into superficial spectacles.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "rituals",
            "B": "counters",
            "C": "itineraries",
            "D": "suitcases"
        },
        "dapAnDung": "rituals",
        "giaiThich": "\"Commodify cultural rituals\" là thương mại hóa các nghi lễ tâm linh truyền thống thành trò biểu diễn bề nổi."
    },
    {
        "id": 82,
        "noiDung": "The municipality implemented visitor carrying __________ metrics to protect delicate limestone karst formations.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "capacity",
            "B": "baggage",
            "C": "terminal",
            "D": "itinerary"
        },
        "dapAnDung": "capacity",
        "giaiThich": "\"Carrying capacity\" là sức chứa sinh thái tối đa của điểm đến."
    },
    {
        "id": 83,
        "noiDung": "Geopolitical instability precipitated a catastrophic slump in cross-border inbound __________ revenues.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "tourism",
            "B": "counter",
            "C": "baggage",
            "D": "souvenir"
        },
        "dapAnDung": "tourism",
        "giaiThich": "\"Inbound tourism revenues\" là doanh thu từ du khách quốc tế nhập cảnh."
    },
    {
        "id": 84,
        "noiDung": "Archaeologists warned that uncontrolled pedestrian footfall causes irreparable __________ to ancient mosaic floors.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "attrition",
            "B": "reservation",
            "C": "itinerary",
            "D": "passport"
        },
        "dapAnDung": "attrition",
        "giaiThich": "\"Attrition\" là sự hao mòn, mài mòn vật lý do bước chân du khách dẫm đạp."
    },
    {
        "id": 85,
        "noiDung": "The luxury eco-lodge operates strictly on net-zero carbon __________ and closed-loop greywater filtration.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "emissions",
            "B": "counters",
            "C": "suitcases",
            "D": "terminals"
        },
        "dapAnDung": "emissions",
        "giaiThich": "\"Net-zero carbon emissions\" là phát thải ròng bằng không."
    },
    {
        "id": 86,
        "noiDung": "The island council levied a progressive ecotax, the proceeds of __________ are channeled into mangrove restoration.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "which",
            "B": "whom",
            "C": "that",
            "D": "whose"
        },
        "dapAnDung": "which",
        "giaiThich": "\"The proceeds of which\" là toàn bộ số tiền thu được từ thuế sinh thái."
    },
    {
        "id": 87,
        "noiDung": "The historical quarter underwent extensive gentrification, alienating long-standing residential __________.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "communities",
            "B": "itineraries",
            "C": "counters",
            "D": "suitcases"
        },
        "dapAnDung": "communities",
        "giaiThich": "\"Gentrification alienating communities\" (quá trình thương mại hóa đô thị làm đẩy cư dân bản địa đi)."
    },
    {
        "id": 88,
        "noiDung": "Heritage conservationists decried the Disneyfication of the historic canal city into an artificial tourist __________.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "enclave",
            "B": "passport",
            "C": "baggage",
            "D": "terminal"
        },
        "dapAnDung": "enclave",
        "giaiThich": "\"Disneyfication into an artificial tourist enclave\" (biến thành khu vui chơi nhân tạo mất bản sắc)."
    },
    {
        "id": 89,
        "noiDung": "Bilateral treaties established reciprocal visa-free regimes to stimulate cross-cultural __________ and trade.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "mobility",
            "B": "itinerary",
            "C": "baggage",
            "D": "counter"
        },
        "dapAnDung": "mobility",
        "giaiThich": "\"Cross-cultural mobility\" là sự tự do đi lại và giao lưu văn hóa giữa các quốc gia."
    },
    {
        "id": 90,
        "noiDung": "The state heritage authority imposed stringent architectural covenants to preserve historic facades against modern __________.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "encroachment",
            "B": "itinerary",
            "C": "reservation",
            "D": "passport"
        },
        "dapAnDung": "encroachment",
        "giaiThich": "\"Preserve against modern encroachment\" (bảo vệ di tích trước sự xâm lấn của công trình hiện đại)."
    },
    {
        "id": 91,
        "noiDung": "\"Carrying capacity\" refers to the maximum number of visitors a site can accommodate without degrading the environment or visitor experience.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Sức chứa du lịch là ngưỡng tối đa để không hủy hoại môi trường."
    },
    {
        "id": 92,
        "noiDung": "\"Disneyfication\" describes stripping a historic site of its genuine authenticity to create commercialized, sanitized amusement.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Disney hóa là biến di sản lịch sử thành trò giải trí thương mại hóa nhân tạo."
    },
    {
        "id": 93,
        "noiDung": "Cultural commodification universally enhances the sacred spiritual significance of indigenous ritual practices.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "B",
        "giaiThich": "Sai. Thương mại hóa văn hóa thường làm xói mòn và tầm thường hóa các giá trị tâm linh thiêng liêng."
    },
    {
        "id": 94,
        "noiDung": "A progressive ecotax can be hypothecated directly toward ecological remediation and habitat preservation.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Thuế sinh thái được dùng trực tiếp để tái tạo môi trường và bảo tồn thiên nhiên."
    },
    {
        "id": 95,
        "noiDung": "Gentrification in historic cities always lowers living costs and guarantees affordable housing for indigenous residents.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "B",
        "giaiThich": "Sai. Đô thị hóa du lịch đẩy giá nhà lên cao khiến người dân bản địa bị trục xuất khỏi nơi cư trú lâu đời."
    },
    {
        "id": 96,
        "noiDung": "Reciprocal visa waivers encourage international scholar and professional mobility while bolstering regional diplomatic ties.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Miễn thị thực song phương thúc đẩy giao lưu và gắn kết ngoại giao."
    },
    {
        "id": 97,
        "noiDung": "Select all socio-cultural concepts examined in advanced tourism sociology: (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "Disneyfication of historic urban fabric",
            "B": "commodification of indigenous ritual ceremonies",
            "C": "packing an extra t-shirt in luggage",
            "D": "tourist-driven resident displacement (gentrification)"
        },
        "dapAnDung": [
            "A",
            "B",
            "D"
        ],
        "giaiThich": "Disney hóa, thương mại hóa văn hóa, đẩy đuổi cư dân là các vấn đề xã hội học du lịch."
    },
    {
        "id": 98,
        "noiDung": "Which ecological metrics are critical for responsible environmental stewardship in tourism: (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "ecosystem carrying capacity thresholds",
            "B": "closed-loop greywater recycling efficiency",
            "C": "volume of cheap plastic souvenir sales",
            "D": "net-zero lifecycle carbon emissions"
        },
        "dapAnDung": [
            "A",
            "B",
            "D"
        ],
        "giaiThich": "Sức chứa sinh thái, tái chế nước thải vòng kín, phát thải carbon ròng bằng không."
    },
    {
        "id": 99,
        "noiDung": "Select all structural legal instruments utilized in heritage site preservation: (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "stringent architectural covenants and facades protection",
            "B": "statutory limits on daily visitor footfall",
            "C": "unrestricted neon billboard installations",
            "D": "earmarked ecological restoration levies"
        },
        "dapAnDung": [
            "A",
            "B",
            "D"
        ],
        "giaiThich": "Khế ước kiến trúc, giới hạn lượng khách hàng ngày, quỹ bảo tồn sinh thái."
    },
    {
        "id": 100,
        "noiDung": "Identify all formal macro-level economic tourism terms: (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "inbound tourism foreign exchange earnings",
            "B": "reciprocal cross-border mobility treaties",
            "C": "airplane snack bag",
            "D": "hospitality asset yield management"
        },
        "dapAnDung": [
            "A",
            "B",
            "D"
        ],
        "giaiThich": "Doanh thu ngoại tệ du lịch quốc tế, hiệp ước tự do đi lại, quản trị lợi suất tài sản khách sạn."
    }
]
};
