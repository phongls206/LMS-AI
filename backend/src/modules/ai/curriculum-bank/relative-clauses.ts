import { CurriculumTopicBank } from './types';

export const RELATIVE_CLAUSES_BANK: CurriculumTopicBank = {
  key: 'RELATIVE_CLAUSES',
  tenChuDe: 'Mệnh Đề Quan Hệ (Relative Clauses)',
  aliases: [
    "mệnh đề quan hệ",
    "menh de quan he",
    "relative clause",
    "relative clauses",
    "who",
    "whom",
    "whose",
    "which",
    "that",
    "where",
    "when",
    "mệnh đề quan hệ rút gọn"
],
  questions: [
    {
        "id": 1,
        "noiDung": "The boy __________ sits next to me in class is very friendly.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "who",
            "B": "which",
            "C": "where",
            "D": "whose"
        },
        "dapAnDung": "who",
        "giaiThich": "Dùng \"who\" làm đại từ quan hệ thay thế cho người (\"the boy\")."
    },
    {
        "id": 2,
        "noiDung": "I bought a new book __________ has a bright blue cover.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "which",
            "B": "who",
            "C": "where",
            "D": "whom"
        },
        "dapAnDung": "which",
        "giaiThich": "Dùng \"which\" làm đại từ quan hệ thay thế cho đồ vật (\"a new book\")."
    },
    {
        "id": 3,
        "noiDung": "The girl __________ won the singing competition is my sister.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "who",
            "B": "which",
            "C": "where",
            "D": "when"
        },
        "dapAnDung": "who",
        "giaiThich": "\"Who\" thay thế cho danh từ chỉ người đóng vai trò chủ ngữ."
    },
    {
        "id": 4,
        "noiDung": "This is the cat __________ lives in our garden.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "which",
            "B": "who",
            "C": "whom",
            "D": "where"
        },
        "dapAnDung": "which",
        "giaiThich": "Dùng \"which\" thay thế cho động vật (\"the cat\")."
    },
    {
        "id": 5,
        "noiDung": "The doctor __________ helped my grandmother was very gentle.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "who",
            "B": "which",
            "C": "whose",
            "D": "where"
        },
        "dapAnDung": "who",
        "giaiThich": "\"Who\" thay thế cho \"the doctor\" (người)."
    },
    {
        "id": 6,
        "noiDung": "Look at the red car __________ is parked in front of our house.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "which",
            "B": "who",
            "C": "where",
            "D": "whose"
        },
        "dapAnDung": "which",
        "giaiThich": "\"Which\" thay thế cho phương tiện/đồ vật (\"the red car\")."
    },
    {
        "id": 7,
        "noiDung": "The teacher __________ teaches us English comes from Canada.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "who",
            "B": "which",
            "C": "where",
            "D": "whom"
        },
        "dapAnDung": "who",
        "giaiThich": "\"Who\" làm chủ ngữ chỉ người (\"The teacher\")."
    },
    {
        "id": 8,
        "noiDung": "We visited a small museum __________ displays ancient coins.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "which",
            "B": "who",
            "C": "where",
            "D": "whom"
        },
        "dapAnDung": "which",
        "giaiThich": "\"Which\" thay cho đồ vật/bảo tàng làm chủ ngữ cho động từ displays."
    },
    {
        "id": 9,
        "noiDung": "The children __________ are playing in the schoolyard look happy.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "who",
            "B": "which",
            "C": "where",
            "D": "whose"
        },
        "dapAnDung": "who",
        "giaiThich": "\"Who\" chỉ người số nhiều (\"The children\")."
    },
    {
        "id": 10,
        "noiDung": "I lost the pencil case __________ my mother gave me yesterday.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "which",
            "B": "who",
            "C": "where",
            "D": "whom"
        },
        "dapAnDung": "which",
        "giaiThich": "\"Which\" thay cho đồ vật (\"the pencil case\")."
    },
    {
        "id": 11,
        "noiDung": "The relative pronoun \"who\" is used to refer to people.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. \"Who\" dùng để thay thế cho danh từ chỉ người."
    },
    {
        "id": 12,
        "noiDung": "The relative pronoun \"which\" is used to refer to people in standard English.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "B",
        "giaiThich": "Sai. \"Which\" chỉ dùng cho đồ vật hoặc con vật, không dùng cho người."
    },
    {
        "id": 13,
        "noiDung": "In basic English, \"that\" can often replace \"who\" or \"which\" in defining relative clauses.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. \"That\" có thể thay thế cho cả người và vật trong mệnh đề xác định."
    },
    {
        "id": 14,
        "noiDung": "The word \"where\" is used as a relative adverb to refer to a place.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. \"Where\" thay thế cho danh từ chỉ nơi chốn."
    },
    {
        "id": 15,
        "noiDung": "We must use \"which\" when referring to a doctor or a teacher.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "B",
        "giaiThich": "Sai. Bác sĩ và giáo viên là người nên phải dùng \"who\" hoặc \"that\"."
    },
    {
        "id": 16,
        "noiDung": "Relative clauses give additional information about a preceding noun.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Mệnh đề quan hệ bổ nghĩa và làm rõ nghĩa cho danh từ đứng trước."
    },
    {
        "id": 17,
        "noiDung": "Select all sentences where \"who\" is used correctly for people: (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "The boy who won the race is my friend.",
            "B": "The woman who lives next door is kind.",
            "C": "The book who I bought is cheap.",
            "D": "The doctor who treated me was skilled."
        },
        "dapAnDung": [
            "A",
            "B",
            "D"
        ],
        "giaiThich": "A, B, D dùng \"who\" cho người. C sai vì sách là đồ vật."
    },
    {
        "id": 18,
        "noiDung": "Which sentences correctly use \"which\" for things or animals? (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "The phone which is on the table is mine.",
            "B": "The dog which barked at night was loud.",
            "C": "The movie which we saw was exciting.",
            "D": "The man which called you is outside."
        },
        "dapAnDung": [
            "A",
            "B",
            "C"
        ],
        "giaiThich": "A, B, C đúng. D sai vì \"the man\" là người."
    },
    {
        "id": 19,
        "noiDung": "Select all relative pronouns used in English: (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "who",
            "B": "which",
            "C": "where",
            "D": "because"
        },
        "dapAnDung": [
            "A",
            "B",
            "C"
        ],
        "giaiThich": "Who, which, where là đại từ/trạng từ quan hệ. Because là liên từ chỉ nguyên nhân."
    },
    {
        "id": 20,
        "noiDung": "Identify all sentences with grammatically correct basic relative clauses: (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "The student who answered first got a gift.",
            "B": "The watch which I wear is waterproof.",
            "C": "The girl which sang well won the prize.",
            "D": "The bicycle which he rides is green."
        },
        "dapAnDung": [
            "A",
            "B",
            "D"
        ],
        "giaiThich": "A, B, D đúng. C sai khi dùng \"which\" cho \"the girl\"."
    },
    {
        "id": 21,
        "noiDung": "This is the restaurant __________ we had our anniversary dinner last month.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "where",
            "B": "which",
            "C": "who",
            "D": "whose"
        },
        "dapAnDung": "where",
        "giaiThich": "\"Where\" thay thế cho nơi chốn (tại nhà hàng đó)."
    },
    {
        "id": 22,
        "noiDung": "I will always remember the sunny day __________ we first arrived in Paris.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "when",
            "B": "where",
            "C": "which",
            "D": "who"
        },
        "dapAnDung": "when",
        "giaiThich": "\"When\" làm trạng từ quan hệ chỉ thời gian."
    },
    {
        "id": 23,
        "noiDung": "The student __________ backpack was left on the bus came to retrieve it.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "whose",
            "B": "who",
            "C": "whom",
            "D": "which"
        },
        "dapAnDung": "whose",
        "giaiThich": "\"Whose\" chỉ sở hữu (\"chiếc ba lô của học sinh đó\")."
    },
    {
        "id": 24,
        "noiDung": "The laptop __________ I bought online has a very long battery life.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "which",
            "B": "who",
            "C": "where",
            "D": "whose"
        },
        "dapAnDung": "which",
        "giaiThich": "\"Which\" làm tân ngữ thay cho \"The laptop\"."
    },
    {
        "id": 25,
        "noiDung": "Do you know the woman __________ is talking to our principal right now?",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "who",
            "B": "whom",
            "C": "which",
            "D": "whose"
        },
        "dapAnDung": "who",
        "giaiThich": "\"Who\" làm chủ ngữ chỉ người cho động từ \"is talking\"."
    },
    {
        "id": 26,
        "noiDung": "We stayed at a cozy hotel __________ had an indoor heated pool.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "which",
            "B": "where",
            "C": "who",
            "D": "when"
        },
        "dapAnDung": "which",
        "giaiThich": "\"Which\" làm chủ ngữ thay cho \"hotel\" (chú ý: sau đó là động từ \"had\")."
    },
    {
        "id": 27,
        "noiDung": "Summer is the season __________ tourists flock to the coastal beaches.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "when",
            "B": "where",
            "C": "which",
            "D": "who"
        },
        "dapAnDung": "when",
        "giaiThich": "\"When\" thay thế cho thời điểm mùa hè."
    },
    {
        "id": 28,
        "noiDung": "The architect __________ designed this modern library won an award.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "who",
            "B": "which",
            "C": "where",
            "D": "whose"
        },
        "dapAnDung": "who",
        "giaiThich": "\"Who\" thay thế cho \"The architect\" (người)."
    },
    {
        "id": 29,
        "noiDung": "This is the town __________ famous singer Taylor Swift was born.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "where",
            "B": "which",
            "C": "who",
            "D": "whose"
        },
        "dapAnDung": "where",
        "giaiThich": "\"Where\" chỉ nơi chốn sinh ra."
    },
    {
        "id": 30,
        "noiDung": "The musician __________ guitar was damaged received a replacement.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "whose",
            "B": "who",
            "C": "whom",
            "D": "which"
        },
        "dapAnDung": "whose",
        "giaiThich": "\"Whose\" chỉ sở hữu cây đàn của nhạc công."
    },
    {
        "id": 31,
        "noiDung": "\"Where\" cannot be used when the relative pronoun is the subject of the clause (e.g., \"the hotel which has a pool\").",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Nếu phía sau là động từ trực tiếp thì phải dùng \"which/that\", không dùng \"where\"."
    },
    {
        "id": 32,
        "noiDung": "\"Whose\" is used only for people and can never be used for organizations or countries.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "B",
        "giaiThich": "Sai. Trong tiếng Anh, \"whose\" có thể dùng chỉ sở hữu cho cả tổ chức, công ty và quốc gia."
    },
    {
        "id": 33,
        "noiDung": "In defining relative clauses, the relative pronoun can be omitted when it functions as an object.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Khi đại từ quan hệ làm tân ngữ (the book [that] I read), có thể lược bỏ đại từ."
    },
    {
        "id": 34,
        "noiDung": "\"When\" is used to refer to a time or date in relative clauses.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. \"When\" thay thế cho danh từ chỉ thời gian."
    },
    {
        "id": 35,
        "noiDung": "A comma is always required before \"that\" in a defining relative clause.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "B",
        "giaiThich": "Sai. Tuyệt đối không dùng dấu phẩy trước \"that\" trong mệnh đề quan hệ xác định."
    },
    {
        "id": 36,
        "noiDung": "\"Whose\" is followed immediately by a noun without an article.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Sau \"whose\" là danh từ không có mạo từ (whose car, whose father)."
    },
    {
        "id": 37,
        "noiDung": "Select all sentences where the relative pronoun can be omitted: (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "The movie that we watched was great. (Object)",
            "B": "The email which you sent arrived safely. (Object)",
            "C": "The man who lives next door is loud. (Subject)",
            "D": "The guitar which he plays belongs to his father. (Object)"
        },
        "dapAnDung": [
            "A",
            "B",
            "D"
        ],
        "giaiThich": "A, B, D làm tân ngữ nên có thể lược bỏ. C làm chủ ngữ không thể bỏ."
    },
    {
        "id": 38,
        "noiDung": "Which sentences correctly use \"whose\" to express possession? (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "The girl whose phone was stolen called the police.",
            "B": "A widow is a woman whose husband has passed away.",
            "C": "We visited a castle whose walls were built in 1200.",
            "D": "The man whose is standing there is my uncle."
        },
        "dapAnDung": [
            "A",
            "B",
            "C"
        ],
        "giaiThich": "A, B, C đúng. D sai ngữ pháp vì sau whose phải là danh từ, không phải động từ \"is\"."
    },
    {
        "id": 39,
        "noiDung": "Select all sentences correctly using \"where\" for location: (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "The cafe where we met was quiet.",
            "B": "This is the school where my father studied.",
            "C": "The building where was destroyed has been rebuilt.",
            "D": "The park where children play is safe."
        },
        "dapAnDung": [
            "A",
            "B",
            "D"
        ],
        "giaiThich": "A, B, D đúng. C sai vì sau \"where\" phải là một mệnh đề (S + V), nếu là động từ \"was\" thì phải dùng \"which\"."
    },
    {
        "id": 40,
        "noiDung": "Identify all grammatically sound relative clauses: (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "1969 was the year when humans first walked on the Moon.",
            "B": "The author whose novels I love is visiting our city.",
            "C": "The hotel that we stayed had no heating.",
            "D": "The hotel where we stayed was luxurious."
        },
        "dapAnDung": [
            "A",
            "B",
            "D"
        ],
        "giaiThich": "A, B, D đúng. C thiếu giới từ \"in\" (stayed at/in) hoặc phải dùng \"where\"."
    },
    {
        "id": 41,
        "noiDung": "Dr. Henderson, __________ research paper won international acclaim, will speak at our seminar.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "whose",
            "B": "who",
            "C": "whom",
            "D": "which"
        },
        "dapAnDung": "whose",
        "giaiThich": "\"Whose\" chỉ quan hệ sở hữu đối với bài nghiên cứu của Dr. Henderson."
    },
    {
        "id": 42,
        "noiDung": "Mr. Davis, __________ you interviewed yesterday afternoon, has accepted our employment offer.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "whom",
            "B": "which",
            "C": "whose",
            "D": "where"
        },
        "dapAnDung": "whom",
        "giaiThich": "\"Whom\" làm tân ngữ chỉ người trong mệnh đề không xác định trang trọng."
    },
    {
        "id": 43,
        "noiDung": "The Nile River, __________ flows through northeastern Africa, is one of the world's longest rivers.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "which",
            "B": "that",
            "C": "where",
            "D": "who"
        },
        "dapAnDung": "which",
        "giaiThich": "Mệnh đề quan hệ không xác định (có dấu phẩy) chỉ dùng \"which\", không dùng \"that\"."
    },
    {
        "id": 44,
        "noiDung": "My elder brother, __________ works as a civil engineer in Tokyo, is visiting us next weekend.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "who",
            "B": "that",
            "C": "whom",
            "D": "which"
        },
        "dapAnDung": "who",
        "giaiThich": "Mệnh đề không xác định chỉ người có dấu phẩy dùng \"who\" (không dùng \"that\")."
    },
    {
        "id": 45,
        "noiDung": "The university from __________ she graduated has a stellar international reputation.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "which",
            "B": "that",
            "C": "where",
            "D": "whom"
        },
        "dapAnDung": "which",
        "giaiThich": "Sau giới từ (\"from\") chỉ vật bắt buộc dùng \"which\", không dùng \"that\"."
    },
    {
        "id": 46,
        "noiDung": "The candidate to __________ the committee awarded the scholarship expressed deep gratitude.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "whom",
            "B": "who",
            "C": "that",
            "D": "whose"
        },
        "dapAnDung": "whom",
        "giaiThich": "Sau giới từ (\"to\") chỉ người bắt buộc dùng \"whom\"."
    },
    {
        "id": 47,
        "noiDung": "She showed us her newly renovated apartment, __________ balcony overlooked the scenic central park.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "whose",
            "B": "which",
            "C": "that",
            "D": "where"
        },
        "dapAnDung": "whose",
        "giaiThich": "\"Whose balcony\" chỉ ban công của căn hộ."
    },
    {
        "id": 48,
        "noiDung": "We visited Stratford-upon-Avon, __________ William Shakespeare was born and raised.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "where",
            "B": "which",
            "C": "that",
            "D": "when"
        },
        "dapAnDung": "where",
        "giaiThich": "\"Where\" làm trạng từ quan hệ trong mệnh đề không xác định chỉ nơi chốn."
    },
    {
        "id": 49,
        "noiDung": "The historic painting, __________ had been restored diligently, was put on public display.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "which",
            "B": "that",
            "C": "what",
            "D": "whose"
        },
        "dapAnDung": "which",
        "giaiThich": "Mệnh đề không xác định giữa 2 dấu phẩy thay cho bức tranh: dùng \"which\"."
    },
    {
        "id": 50,
        "noiDung": "The team manager with __________ I communicated confirmed all logistics.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "whom",
            "B": "who",
            "C": "which",
            "D": "whose"
        },
        "dapAnDung": "whom",
        "giaiThich": "Sau giới từ \"with\" chỉ người dùng \"whom\"."
    },
    {
        "id": 51,
        "noiDung": "In non-defining relative clauses (separated by commas), \"that\" cannot be used to replace \"which\" or \"who\".",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Tuyệt đối không dùng \"that\" trong mệnh đề không xác định có dấu phẩy."
    },
    {
        "id": 52,
        "noiDung": "After a preposition (e.g., \"to\", \"with\", \"from\"), we can use \"that\" as a relative pronoun.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "B",
        "giaiThich": "Sai. Sau giới từ chỉ được dùng \"whom\" (cho người) hoặc \"which\" (cho vật), không dùng \"that\"."
    },
    {
        "id": 53,
        "noiDung": "Non-defining relative clauses provide essential information without which the sentence loses its core meaning.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "B",
        "giaiThich": "Sai. Mệnh đề không xác định chỉ cung cấp thông tin bổ sung, lược bỏ đi câu vẫn trọn vẹn nghĩa."
    },
    {
        "id": 54,
        "noiDung": "\"Whom\" is used primarily as an object pronoun in formal English.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. \"Whom\" làm tân ngữ chỉ người trong văn phong trang trọng."
    },
    {
        "id": 55,
        "noiDung": "We can omit the relative pronoun in non-defining relative clauses.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "B",
        "giaiThich": "Sai. Trong mệnh đề không xác định, không bao giờ được lược bỏ đại từ quan hệ."
    },
    {
        "id": 56,
        "noiDung": "The preposition can be placed either before the relative pronoun (formal) or at the end of the clause (informal).",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. \"The man to whom I spoke\" (trang trọng) = \"The man who I spoke to\" (thông tục)."
    },
    {
        "id": 57,
        "noiDung": "Select all sentences where \"that\" CANNOT be used: (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "My mother, who loves gardening, planted roses.",
            "B": "The house in which I was born is old.",
            "C": "Paris, which is the capital of France, is romantic.",
            "D": "The movie that I saw was thrilling."
        },
        "dapAnDung": [
            "A",
            "B",
            "C"
        ],
        "giaiThich": "A, C là mệnh đề không xác định; B đứng sau giới từ nên không thể dùng \"that\". D là mệnh đề xác định dùng \"that\" được."
    },
    {
        "id": 58,
        "noiDung": "Which sentences demonstrate correct preposition placement with relative pronouns? (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "The professor to whom I submitted the essay was satisfied.",
            "B": "The project about which we debated was approved.",
            "C": "The manager to that I spoke was helpful.",
            "D": "The colleague with whom she collaborates is talented."
        },
        "dapAnDung": [
            "A",
            "B",
            "D"
        ],
        "giaiThich": "A, B, D chuẩn xác. C sai vì \"that\" không đi sau giới từ."
    },
    {
        "id": 59,
        "noiDung": "Select all sentences containing non-defining relative clauses: (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "Mount Everest, which is in the Himalayas, attracts many climbers.",
            "B": "My brother, whom you met last week, just got promoted.",
            "C": "Students who study hard get good grades.",
            "D": "The Louvre Museum, which houses the Mona Lisa, is crowded."
        },
        "dapAnDung": [
            "A",
            "B",
            "D"
        ],
        "giaiThich": "A, B, D có dấu phẩy bổ sung thông tin (không xác định). C là mệnh đề xác định."
    },
    {
        "id": 60,
        "noiDung": "Identify all grammatically correct sentences: (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "The author, whose novels have sold millions, gave a lecture.",
            "B": "The bridge across which the army marched collapsed.",
            "C": "The girl, that lives in London, is visiting us.",
            "D": "The hotel in which they stayed was demolished."
        },
        "dapAnDung": [
            "A",
            "B",
            "D"
        ],
        "giaiThich": "A, B, D đúng. C sai vì dùng \"that\" trong mệnh đề có dấu phẩy."
    },
    {
        "id": 61,
        "noiDung": "The proposal __________ by the finance subcommittee was rejected due to excessive expenditure.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "submitted",
            "B": "submitting",
            "C": "which submitted",
            "D": "was submitted"
        },
        "dapAnDung": "submitted",
        "giaiThich": "Mệnh đề quan hệ rút gọn ở thể bị động: \"which was submitted\" rút gọn thành \"submitted\"."
    },
    {
        "id": 62,
        "noiDung": "Passengers __________ on flight VN214 are requested to proceed to departure gate 12 immediately.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "traveling",
            "B": "traveled",
            "C": "were traveling",
            "D": "are traveling"
        },
        "dapAnDung": "traveling",
        "giaiThich": "Mệnh đề rút gọn thể chủ động dùng V-ing: \"who are traveling\" -> \"traveling\"."
    },
    {
        "id": 63,
        "noiDung": "He passed all his final examinations with distinction, __________ delighted his parents immensely.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "which",
            "B": "that",
            "C": "what",
            "D": "whose"
        },
        "dapAnDung": "which",
        "giaiThich": "\"Which\" đứng sau dấu phẩy thay thế cho toàn bộ sự việc ở mệnh đề đứng trước."
    },
    {
        "id": 64,
        "noiDung": "The company recruited several software engineers, all of __________ hold advanced postgraduate degrees.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "whom",
            "B": "which",
            "C": "who",
            "D": "whose"
        },
        "dapAnDung": "whom",
        "giaiThich": "\"All of whom\" chỉ người sau lượng từ và giới từ."
    },
    {
        "id": 65,
        "noiDung": "The library houses thousands of ancient manuscripts, many of __________ date back to the medieval era.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "which",
            "B": "whom",
            "C": "that",
            "D": "whose"
        },
        "dapAnDung": "which",
        "giaiThich": "\"Many of which\" chỉ vật sau lượng từ và giới từ."
    },
    {
        "id": 66,
        "noiDung": "Anyone __________ to participate in the international symposium must register before Friday.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "wishing",
            "B": "wished",
            "C": "is wishing",
            "D": "wishes"
        },
        "dapAnDung": "wishing",
        "giaiThich": "Mệnh đề rút gọn chủ động: \"who wishes\" rút thành \"wishing\"."
    },
    {
        "id": 67,
        "noiDung": "The groundbreaking technology, the development of __________ took a decade, is now patented.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "which",
            "B": "whom",
            "C": "that",
            "D": "whose"
        },
        "dapAnDung": "which",
        "giaiThich": "\"The development of which\" (sự phát triển của công nghệ đó)."
    },
    {
        "id": 68,
        "noiDung": "The chemical spill caused severe river pollution, __________ led to the closure of local fisheries.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "which",
            "B": "that",
            "C": "what",
            "D": "where"
        },
        "dapAnDung": "which",
        "giaiThich": "\"Which\" bổ nghĩa cho cả mệnh đề phía trước."
    },
    {
        "id": 69,
        "noiDung": "We interviewed twelve candidates, none of __________ met our rigorous bilingual requirements.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "whom",
            "B": "which",
            "C": "who",
            "D": "whose"
        },
        "dapAnDung": "whom",
        "giaiThich": "\"None of whom\" chỉ người trong mệnh đề không xác định."
    },
    {
        "id": 70,
        "noiDung": "The items __________ in the warehouse fire were estimated to be worth over a million dollars.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "destroyed",
            "B": "destroying",
            "C": "were destroyed",
            "D": "which destroyed"
        },
        "dapAnDung": "destroyed",
        "giaiThich": "Rút gọn bị động: \"which were destroyed\" -> \"destroyed\"."
    },
    {
        "id": 71,
        "noiDung": "In a reduced relative clause, a passive construction (who/which was + V3) can be reduced to just the past participle (V3).",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Rút gọn bị động giữ lại V3/ed (ví dụ: the goods [which were] imported)."
    },
    {
        "id": 72,
        "noiDung": "A relative clause introduced by \"which\" can refer back to an entire preceding clause, not just a single noun.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. \"Which\" có thể thay thế cho cả một ý/mệnh đề đứng trước nó."
    },
    {
        "id": 73,
        "noiDung": "Phrases like \"both of that\" and \"neither of that\" are standard formal English relative expressions.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "B",
        "giaiThich": "Sai. Phải dùng \"both of which / both of whom\", không bao giờ dùng \"of that\"."
    },
    {
        "id": 74,
        "noiDung": "An active relative clause can be reduced to a present participle (-ing) regardless of the original tense.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Rút gọn chủ động đều dùng V-ing (ví dụ: the boy who plays/played -> the boy playing)."
    },
    {
        "id": 75,
        "noiDung": "We can use \"what\" as a standard relative pronoun following an explicit noun antecedent (e.g., \"the book what I bought\").",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "B",
        "giaiThich": "Sai. \"What\" không đứng sau danh từ tiền ngữ, \"what\" = the thing which."
    },
    {
        "id": 76,
        "noiDung": "In quantifier relative structures (e.g., \"many of whom\"), a comma is typically placed before the quantifier phrase.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Đây là dạng mệnh đề không xác định nên luôn có dấu phẩy ngăn cách."
    },
    {
        "id": 77,
        "noiDung": "Select all sentences with grammatically sound reduced relative clauses: (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "The documents signed yesterday are stored in the safe.",
            "B": "The children playing in the rain got completely wet.",
            "C": "The bridge built in 1910 is still in use.",
            "D": "The boy played football is my nephew."
        },
        "dapAnDung": [
            "A",
            "B",
            "C"
        ],
        "giaiThich": "A, B, C rút gọn chuẩn. D sai vì phải là \"playing football\" (chủ động)."
    },
    {
        "id": 78,
        "noiDung": "Which sentences correctly use quantifier expressions with relative pronouns? (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "The company hired fifty employees, most of whom were recent graduates.",
            "B": "We reviewed twenty proposals, three of which were approved.",
            "C": "She owns five cars, none of that are electric.",
            "D": "They consulted several experts, two of whom were Nobel laureates."
        },
        "dapAnDung": [
            "A",
            "B",
            "D"
        ],
        "giaiThich": "A, B, D đúng chuẩn. C sai vì \"that\" không đi sau \"none of\"."
    },
    {
        "id": 79,
        "noiDung": "Select all sentences where \"which\" refers to the entire preceding clause: (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "He arrived an hour late, which annoyed the client.",
            "B": "She passed the difficult exam on her first attempt, which surprised everyone.",
            "C": "She bought a watch which was expensive.",
            "D": "The factory closed down, which caused massive unemployment."
        },
        "dapAnDung": [
            "A",
            "B",
            "D"
        ],
        "giaiThich": "A, B, D \"which\" thay thế cho cả hành động phía trước. C \"which\" chỉ thay cho \"a watch\"."
    },
    {
        "id": 80,
        "noiDung": "Identify all sentences with correct participle reductions: (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "Anyone wanting further information should visit the website.",
            "B": "Vehicles parked illegally will be towed away.",
            "C": "The girl worn the red dress is my cousin.",
            "D": "The funds donated by alumni will build a new laboratory."
        },
        "dapAnDung": [
            "A",
            "B",
            "D"
        ],
        "giaiThich": "A, B, D đúng. C sai (phải là \"wearing the red dress\")."
    },
    {
        "id": 81,
        "noiDung": "The board reached a consensus on the governance restructuring, the details of __________ will remain confidential.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "which",
            "B": "whose",
            "C": "that",
            "D": "whom"
        },
        "dapAnDung": "which",
        "giaiThich": "\"The details of which\" là cấu trúc sở hữu trang trọng trong văn bản học thuật."
    },
    {
        "id": 82,
        "noiDung": "He was accused of corporate embezzlement, in consequence of __________ he was forced to step down immediately.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "which",
            "B": "whom",
            "C": "what",
            "D": "that"
        },
        "dapAnDung": "which",
        "giaiThich": "\"In consequence of which\" (hậu quả của việc đó là...)."
    },
    {
        "id": 83,
        "noiDung": "The committee deliberated the extent to __________ regulatory sanctions should be enforced against the monopoly.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "which",
            "B": "that",
            "C": "what",
            "D": "whom"
        },
        "dapAnDung": "which",
        "giaiThich": "Cụm thành ngữ học thuật: \"the extent to which\" (mức độ mà...)."
    },
    {
        "id": 84,
        "noiDung": "There were three contested clauses in the international treaty, __________ of which posed severe sovereignty concerns.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "none",
            "B": "neither",
            "C": "no",
            "D": "not"
        },
        "dapAnDung": "none",
        "giaiThich": "Với ba đối tượng trở lên dùng \"none of which\", \"neither\" chỉ dùng cho 2 đối tượng."
    },
    {
        "id": 85,
        "noiDung": "We interviewed twelve renowned economists, __________ of whom could foresee the upcoming market collapse.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "none",
            "B": "neither",
            "C": "no one",
            "D": "not"
        },
        "dapAnDung": "none",
        "giaiThich": "Với tập hợp từ 3 người trở lên: \"none of whom\"."
    },
    {
        "id": 86,
        "noiDung": "The innovative semiconductor architecture, __________ benchmark performance was verified independently, hit the market.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "whose",
            "B": "the which",
            "C": "that",
            "D": "whom"
        },
        "dapAnDung": "whose",
        "giaiThich": "\"Whose benchmark performance\" chỉ thuộc tính hiệu năng của kiến trúc chip."
    },
    {
        "id": 87,
        "noiDung": "The corporation instituted new safety protocols, adhering to __________ will be compulsory for all contractor personnel.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "which",
            "B": "whom",
            "C": "that",
            "D": "what"
        },
        "dapAnDung": "which",
        "giaiThich": "\"Adhering to which\" đưa cụm phân từ và giới từ lên đầu mệnh đề quan hệ."
    },
    {
        "id": 88,
        "noiDung": "She made several contentious assertions during the debate, the veracity of __________ was immediately called into question.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "which",
            "B": "whom",
            "C": "that",
            "D": "whose"
        },
        "dapAnDung": "which",
        "giaiThich": "\"The veracity of which\" (tính xác thực của các khẳng định đó)."
    },
    {
        "id": 89,
        "noiDung": "The government enacted antitrust legislation, by virtue of __________ monopolistic mergers can be halted.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "which",
            "B": "that",
            "C": "whom",
            "D": "whose"
        },
        "dapAnDung": "which",
        "giaiThich": "\"By virtue of which\" (nhờ đó / theo đó)."
    },
    {
        "id": 90,
        "noiDung": "The research team analyzed thirty epidemiological case studies, __________ of which exhibited identical viral mutations.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "all",
            "B": "every",
            "C": "each",
            "D": "whole"
        },
        "dapAnDung": "all",
        "giaiThich": "\"All of which\" kết hợp số nhiều với \"exhibited\"."
    },
    {
        "id": 91,
        "noiDung": "Phrases such as \"the extent to which\" and \"the degree to which\" are highly formal idiomatic relative constructions.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. \"The extent/degree to which\" là cấu trúc học thuật rất phổ biến."
    },
    {
        "id": 92,
        "noiDung": "In formal academic English, \"whom\" cannot be replaced by \"who\" when it is the object of a preposition (e.g., \"to whom\").",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Khi đứng ngay sau giới từ, bắt buộc dùng \"whom\", không được dùng \"who\"."
    },
    {
        "id": 93,
        "noiDung": "\"Whatever\" and \"whoever\" can function as nominal relative pronouns meaning \"anything that\" and \"anyone who\".",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. \"Whatever happens\" = anything that happens."
    },
    {
        "id": 94,
        "noiDung": "A relative clause can never be embedded inside another relative clause.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "B",
        "giaiThich": "Sai. Trong văn phong phức hợp cao cấp (C1/C2), hoàn toàn có thể lồng ghép mệnh đề quan hệ (nested relative clauses)."
    },
    {
        "id": 95,
        "noiDung": "\"By virtue of which\" is a formal connective expression meaning \"because of which\" or \"by means of which\".",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. \"By virtue of which\" mang sắc thái pháp lý/học thuật cao."
    },
    {
        "id": 96,
        "noiDung": "The quantifier expression \"all of that\" is interchangeable with \"all of which\" in non-defining clauses.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "B",
        "giaiThich": "Sai. Tuyệt đối không dùng \"all of that\" trong mệnh đề không xác định."
    },
    {
        "id": 97,
        "noiDung": "Select all sophisticated prepositional relative constructions commonly found in academic prose: (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "the extent to which socioeconomic factors influence cognitive development",
            "B": "by virtue of which democratic institutions maintain public trust",
            "C": "the reason of which he resigned was unknown",
            "D": "in the absence of which systematic chaos would ensue"
        },
        "dapAnDung": [
            "A",
            "B",
            "D"
        ],
        "giaiThich": "A, B, D là các cấu trúc chuẩn mực cao cấp. C sai (chuẩn phải là \"for which\" hoặc \"the reason why\")."
    },
    {
        "id": 98,
        "noiDung": "Which sentences demonstrate flawless use of quantifier relative structures? (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "The archives contain thousands of historic deeds, many of which are deteriorating.",
            "B": "The committee questioned five senior executives, neither of whom had kept records.",
            "C": "The expedition encountered three isolated tribes, all of which spoke unique dialects.",
            "D": "The university enrolled 500 scholars, none of whom had prior publications."
        },
        "dapAnDung": [
            "A",
            "C",
            "D"
        ],
        "giaiThich": "A, C, D chuẩn. B sai vì có 5 người nên không dùng \"neither\" (phải dùng \"none of whom\")."
    },
    {
        "id": 99,
        "noiDung": "Select all sentences where nominal relative pronouns (whoever, whatever, whichever) are employed accurately: (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "Whoever authored this anonymous report possesses insider knowledge.",
            "B": "You may select whichever methodology aligns with your research goals.",
            "C": "Whatever consequences arise from this decision, we will shoulder the blame.",
            "D": "Whomever goes to the store must buy milk."
        },
        "dapAnDung": [
            "A",
            "B",
            "C"
        ],
        "giaiThich": "A, B, C đúng. D sai vì làm chủ ngữ cho \"goes\" phải dùng \"whoever\"."
    },
    {
        "id": 100,
        "noiDung": "Identify all grammatically impeccable advanced relative sentences: (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "The corporate merger, the legality of which remains contested, was finalized yesterday.",
            "B": "He outlined several hypotheses, in support of which empirical evidence was presented.",
            "C": "She cited three historical treatises, all of that supported her thesis.",
            "D": "The treaty stipulates terms, adherence to which is legally binding."
        },
        "dapAnDung": [
            "A",
            "B",
            "D"
        ],
        "giaiThich": "A, B, D đúng. C sai vì \"all of that\"."
    }
]
};
