import { CurriculumTopicBank } from './types';

export const REPORTED_SPEECH_BANK: CurriculumTopicBank = {
  key: 'REPORTED_SPEECH',
  tenChuDe: 'Câu Tường Thuật Gián Tiếp (Reported Speech)',
  aliases: [
    "câu tường thuật",
    "cau tuong thuat",
    "reported speech",
    "indirect speech",
    "lùi thì",
    "câu gián tiếp",
    "said that",
    "told me that",
    "asked if"
],
  questions: [
    {
        "id": 1,
        "noiDung": "He said, \"I am tired.\" -> He said that he __________ tired.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "was",
            "B": "is",
            "C": "am",
            "D": "were"
        },
        "dapAnDung": "was",
        "giaiThich": "Lùi thì từ Hiện tại đơn \"am\" sang Quá khứ đơn \"was\"."
    },
    {
        "id": 2,
        "noiDung": "She told me, \"I live in Hanoi.\" -> She told me that she __________ in Hanoi.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "lived",
            "B": "lives",
            "C": "is living",
            "D": "live"
        },
        "dapAnDung": "lived",
        "giaiThich": "Lùi thì \"live\" sang \"lived\"."
    },
    {
        "id": 3,
        "noiDung": "Tom said, \"I have a new bicycle.\" -> Tom said that he __________ a new bicycle.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "had",
            "B": "has",
            "C": "have",
            "D": "having"
        },
        "dapAnDung": "had",
        "giaiThich": "Lùi thì \"have\" sang \"had\"."
    },
    {
        "id": 4,
        "noiDung": "Mary said, \"I can swim.\" -> Mary said that she __________ swim.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "could",
            "B": "can",
            "C": "can to",
            "D": "may"
        },
        "dapAnDung": "could",
        "giaiThich": "Lùi thì động từ khuyết thiếu \"can\" sang \"could\"."
    },
    {
        "id": 5,
        "noiDung": "The teacher said, \"Open your books.\" -> The teacher told the students __________ their books.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "to open",
            "B": "open",
            "C": "opening",
            "D": "opened"
        },
        "dapAnDung": "to open",
        "giaiThich": "Tường thuật câu mệnh lệnh: \"told someone to + V\"."
    },
    {
        "id": 6,
        "noiDung": "He said, \"I am watching TV.\" -> He said that he __________ TV.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "was watching",
            "B": "is watching",
            "C": "watched",
            "D": "watches"
        },
        "dapAnDung": "was watching",
        "giaiThich": "Hiện tại tiếp diễn lùi thì sang Quá khứ tiếp diễn: was watching."
    },
    {
        "id": 7,
        "noiDung": "She said, \"I will call you tomorrow.\" -> She said that she __________ call me the next day.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "would",
            "B": "will",
            "C": "shall",
            "D": "can"
        },
        "dapAnDung": "would",
        "giaiThich": "\"Will\" lùi thì thành \"would\"."
    },
    {
        "id": 8,
        "noiDung": "My mother said, \"Don't run inside the house.\" -> My mother told me __________ inside the house.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "not to run",
            "B": "don't run",
            "C": "to not run",
            "D": "not running"
        },
        "dapAnDung": "not to run",
        "giaiThich": "Mệnh lệnh phủ định: \"told me not to run\"."
    },
    {
        "id": 9,
        "noiDung": "Peter said to me, \"I like ice cream.\" -> Peter told me that he __________ ice cream.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "liked",
            "B": "likes",
            "C": "is liking",
            "D": "like"
        },
        "dapAnDung": "liked",
        "giaiThich": "Lùi thì từ \"like\" sang \"liked\"."
    },
    {
        "id": 10,
        "noiDung": "She said, \"I don't know the answer.\" -> She said that she __________ the answer.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "didn't know",
            "B": "doesn't know",
            "C": "don't know",
            "D": "not knew"
        },
        "dapAnDung": "didn't know",
        "giaiThich": "\"Don't know\" lùi thì thành \"didn't know\"."
    },
    {
        "id": 11,
        "noiDung": "In reported speech, the present simple tense typically shifts back to the past simple (backshifting).",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Hiện tại đơn lùi thì thành Quá khứ đơn."
    },
    {
        "id": 12,
        "noiDung": "The pronoun \"I\" in direct speech always stays as \"I\" in reported speech regardless of who spoke.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "B",
        "giaiThich": "Sai. Đại từ nhân xưng phải biến đổi theo người nói (ví dụ: He said \"I\" -> He said that he)."
    },
    {
        "id": 13,
        "noiDung": "\"Said to me\" is commonly replaced by \"told me\" in reported speech.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. \"Told someone\" thay thế cho \"said to someone\"."
    },
    {
        "id": 14,
        "noiDung": "The modal verb \"will\" changes to \"would\" in indirect speech.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. \"Will\" lùi thì thành \"would\"."
    },
    {
        "id": 15,
        "noiDung": "Imperatives like \"Sit down!\" are reported using \"to-infinitive\" (e.g., told me to sit down).",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Câu mệnh lệnh gián tiếp dùng to-V."
    },
    {
        "id": 16,
        "noiDung": "Quotation marks are kept in reported speech.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "B",
        "giaiThich": "Sai. Trong câu tường thuật gián tiếp, dấu ngoặc kép được bỏ đi hoàn toàn."
    },
    {
        "id": 17,
        "noiDung": "Select all tense shifts (backshifting) that occur in reported speech: (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "Present Simple -> Past Simple",
            "B": "Present Continuous -> Past Continuous",
            "C": "Future Will -> Present Simple",
            "D": "Can -> Could"
        },
        "dapAnDung": [
            "A",
            "B",
            "D"
        ],
        "giaiThich": "A, B, D là quy tắc lùi thì chuẩn. C sai vì will lùi thành would."
    },
    {
        "id": 18,
        "noiDung": "Which reporting verbs can be used to report simple statements: (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "said (that)",
            "B": "told (someone that)",
            "C": "laughed that",
            "D": "danced that"
        },
        "dapAnDung": [
            "A",
            "B"
        ],
        "giaiThich": "Said that và told someone that là 2 động từ tường thuật phát biểu cơ bản."
    },
    {
        "id": 19,
        "noiDung": "Select all correct reported imperative sentences: (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "He told me to wait outside.",
            "B": "She asked him to close the door.",
            "C": "He told me don't speak.",
            "D": "The doctor advised me to rest."
        },
        "dapAnDung": [
            "A",
            "B",
            "D"
        ],
        "giaiThich": "A, B, D đúng cấu trúc to-V. C sai vì phải là \"not to speak\"."
    },
    {
        "id": 20,
        "noiDung": "Identify all words that typically change when moving from direct to reported speech: (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "personal pronouns (I -> he/she)",
            "B": "verb tenses (am -> was)",
            "C": "modal verbs (can -> could)",
            "D": "proper names of cities (London)"
        },
        "dapAnDung": [
            "A",
            "B",
            "C"
        ],
        "giaiThich": "Đại từ, thì của động từ, động từ khuyết thiếu biến đổi. Tên riêng giữ nguyên."
    },
    {
        "id": 21,
        "noiDung": "She asked me, \"Do you speak English?\" -> She asked me __________ I spoke English.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "if",
            "B": "that",
            "C": "what",
            "D": "which"
        },
        "dapAnDung": "if",
        "giaiThich": "Tường thuật câu hỏi Yes/No dùng \"if\" hoặc \"whether\"."
    },
    {
        "id": 22,
        "noiDung": "\"Where do you live?\" the policeman asked. -> The policeman asked me where I __________.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "lived",
            "B": "live",
            "C": "did live",
            "D": "am living"
        },
        "dapAnDung": "lived",
        "giaiThich": "Câu hỏi gián tiếp đảo về trật tự khẳng định S + V (where I lived)."
    },
    {
        "id": 23,
        "noiDung": "He said, \"I bought this car yesterday.\" -> He said he had bought that car __________.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "the day before",
            "B": "yesterday",
            "C": "tomorrow",
            "D": "the next day"
        },
        "dapAnDung": "the day before",
        "giaiThich": "\"Yesterday\" chuyển thành \"the day before\" hoặc \"the previous day\"."
    },
    {
        "id": 24,
        "noiDung": "She said, \"I am meeting Tom today.\" -> She said she was meeting Tom __________.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "that day",
            "B": "today",
            "C": "yesterday",
            "D": "the next day"
        },
        "dapAnDung": "that day",
        "giaiThich": "\"Today\" chuyển thành \"that day\"."
    },
    {
        "id": 25,
        "noiDung": "\"Are you ready to depart?\" he asked. -> He asked __________ we were ready to depart.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "whether",
            "B": "that",
            "C": "what",
            "D": "why"
        },
        "dapAnDung": "whether",
        "giaiThich": "Tường thuật câu hỏi Yes/No: dùng \"whether\"."
    },
    {
        "id": 26,
        "noiDung": "\"I will see you here tomorrow,\" she said. -> She said she would see me __________ the following day.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "there",
            "B": "here",
            "C": "where",
            "D": "everywhere"
        },
        "dapAnDung": "there",
        "giaiThich": "\"Here\" chuyển thành \"there\"."
    },
    {
        "id": 27,
        "noiDung": "\"Why are you crying?\" mother asked. -> Mother asked me why I __________ crying.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "was",
            "B": "am",
            "C": "were",
            "D": "had"
        },
        "dapAnDung": "was",
        "giaiThich": "Trật tự câu trần thuật: why I was crying."
    },
    {
        "id": 28,
        "noiDung": "The doctor __________ me to take the prescribed antibiotics after meals.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "advised",
            "B": "said",
            "C": "told to",
            "D": "suggested"
        },
        "dapAnDung": "advised",
        "giaiThich": "\"Advised someone to + V\" (khuyên ai làm gì)."
    },
    {
        "id": 29,
        "noiDung": "He said, \"I haven't received the parcel yet.\" -> He said that he __________ the parcel yet.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "hadn't received",
            "B": "hasn't received",
            "C": "didn't receive",
            "D": "wasn't receiving"
        },
        "dapAnDung": "hadn't received",
        "giaiThich": "Hiện tại hoàn thành lùi thì thành Quá khứ hoàn thành: hadn't received."
    },
    {
        "id": 30,
        "noiDung": "\"What time does the train arrive?\" she asked. -> She asked what time the train __________.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "arrived",
            "B": "does arrive",
            "C": "did arrive",
            "D": "arrives"
        },
        "dapAnDung": "arrived",
        "giaiThich": "Bỏ trợ động từ does, lùi thì thành \"arrived\"."
    },
    {
        "id": 31,
        "noiDung": "In reported questions, the word order changes back to a statement (Subject + Verb) without inversion.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Câu hỏi gián tiếp không đảo trợ động từ lên trước (ví dụ: where I lived, không nói where did I live)."
    },
    {
        "id": 32,
        "noiDung": "We use \"if\" or \"whether\" to report Yes/No questions.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Tường thuật câu hỏi Yes/No dùng if/whether."
    },
    {
        "id": 33,
        "noiDung": "Time words like \"yesterday\" change to \"the day before\" or \"the previous day\".",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Quy tắc chuyển đổi trạng từ chỉ thời gian trong câu gián tiếp."
    },
    {
        "id": 34,
        "noiDung": "\"Tomorrow\" stays unchanged as \"tomorrow\" in all reported speech scenarios.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "B",
        "giaiThich": "Sai. \"Tomorrow\" phải đổi thành \"the next day\" hoặc \"the following day\"."
    },
    {
        "id": 35,
        "noiDung": "The auxiliary verbs \"do/does/did\" are retained in reported wh- questions (e.g., asked where did I live).",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "B",
        "giaiThich": "Sai. Bỏ do/does/did và chia động từ chính theo thì lùi."
    },
    {
        "id": 36,
        "noiDung": "\"Here\" changes to \"there\" when reporting at a different location.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. \"Here\" đổi thành \"there\"."
    },
    {
        "id": 37,
        "noiDung": "Select all correct time/place word conversions in reported speech: (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "today -> that day",
            "B": "tomorrow -> the following day",
            "C": "yesterday -> tomorrow",
            "D": "here -> there"
        },
        "dapAnDung": [
            "A",
            "B",
            "D"
        ],
        "giaiThich": "Today -> that day, tomorrow -> the following day, here -> there."
    },
    {
        "id": 38,
        "noiDung": "Which words introduce reported Yes/No questions: (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "if",
            "B": "whether",
            "C": "that",
            "D": "because"
        },
        "dapAnDung": [
            "A",
            "B"
        ],
        "giaiThich": "If và whether là 2 từ nối câu hỏi Yes/No."
    },
    {
        "id": 39,
        "noiDung": "Select all sentences where reported question word order is correct: (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "She asked me what my name was.",
            "B": "He asked where I worked.",
            "C": "She asked what was my name.",
            "D": "They asked if we were ready."
        },
        "dapAnDung": [
            "A",
            "B",
            "D"
        ],
        "giaiThich": "A, B, D chuẩn ngữ tự S + V. C sai vì đảo \"was\" lên trước \"my name\"."
    },
    {
        "id": 40,
        "noiDung": "Identify all reporting verbs that take an object + to-infinitive (verb + someone + to-V): (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "tell (someone to go)",
            "B": "advise (someone to rest)",
            "C": "say (someone to go)",
            "D": "ask (someone to help)"
        },
        "dapAnDung": [
            "A",
            "B",
            "D"
        ],
        "giaiThich": "Tell, advise, ask đi với tân ngữ + to-V. \"Say\" không dùng cấu trúc này."
    },
    {
        "id": 41,
        "noiDung": "He __________ having leaked the proprietary source code to our rival company.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "denied",
            "B": "refused",
            "C": "apologized",
            "D": "promised"
        },
        "dapAnDung": "denied",
        "giaiThich": "\"Deny + V-ing\" là phủ nhận đã làm gì."
    },
    {
        "id": 42,
        "noiDung": "She __________ to deliver the project documentation by Friday afternoon.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "promised",
            "B": "suggested",
            "C": "admitted",
            "D": "insisted"
        },
        "dapAnDung": "promised",
        "giaiThich": "\"Promise + to-V\" là hứa sẽ làm gì."
    },
    {
        "id": 43,
        "noiDung": "The auditor __________ conducting a forensic investigation into the cash discrepancies.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "recommended",
            "B": "refused",
            "C": "agreed",
            "D": "ordered"
        },
        "dapAnDung": "recommended",
        "giaiThich": "\"Recommend + V-ing\" là khuyến nghị nên làm gì."
    },
    {
        "id": 44,
        "noiDung": "He __________ to sign the non-disclosure agreement until consulting his attorney.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "refused",
            "B": "denied",
            "C": "apologized",
            "D": "insisted"
        },
        "dapAnDung": "refused",
        "giaiThich": "\"Refuse + to-V\" là từ chối làm gì."
    },
    {
        "id": 45,
        "noiDung": "The suspect finally __________ to breaking into the jewelry boutique.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "admitted",
            "B": "refused",
            "C": "threatened",
            "D": "ordered"
        },
        "dapAnDung": "admitted",
        "giaiThich": "\"Admit to + V-ing\" là thừa nhận đã làm gì."
    },
    {
        "id": 46,
        "noiDung": "She __________ for arriving forty minutes late to the client presentation.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "apologized",
            "B": "denied",
            "C": "accused",
            "D": "refused"
        },
        "dapAnDung": "apologized",
        "giaiThich": "\"Apologize for + V-ing\" là xin lỗi vì điều gì."
    },
    {
        "id": 47,
        "noiDung": "The manager __________ the staff to verify all financial calculations twice.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "reminded",
            "B": "suggested",
            "C": "insisted",
            "D": "denied"
        },
        "dapAnDung": "reminded",
        "giaiThich": "\"Remind someone to + V\" là nhắc nhở ai làm gì."
    },
    {
        "id": 48,
        "noiDung": "He __________ on paying for the entire anniversary dinner bill himself.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "insisted",
            "B": "refused",
            "C": "denied",
            "D": "threatened"
        },
        "dapAnDung": "insisted",
        "giaiThich": "\"Insist on + V-ing\" là khăng khăng đòi làm gì."
    },
    {
        "id": 49,
        "noiDung": "The board __________ the CEO of deliberately misleading company shareholders.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "accused",
            "B": "blamed",
            "C": "denied",
            "D": "apologized"
        },
        "dapAnDung": "accused",
        "giaiThich": "\"Accuse someone of + V-ing\" là cáo buộc ai làm việc gì."
    },
    {
        "id": 50,
        "noiDung": "She __________ taking a short fifteen-minute coffee break before resuming the seminar.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "suggested",
            "B": "demanded",
            "C": "refused",
            "D": "ordered"
        },
        "dapAnDung": "suggested",
        "giaiThich": "\"Suggest + V-ing\" là gợi ý cùng làm gì."
    },
    {
        "id": 51,
        "noiDung": "The reporting verb \"deny\" is followed by a gerund (-ing form), e.g., denied taking the money.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. \"Deny + V-ing\" là phủ nhận đã làm gì."
    },
    {
        "id": 52,
        "noiDung": "\"Refuse\" is followed by a gerund (-ing form), e.g., refused taking the call.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "B",
        "giaiThich": "Sai. \"Refuse\" đi với to-infinitive (refused to take the call)."
    },
    {
        "id": 53,
        "noiDung": "\"Accuse\" takes the preposition \"of\" followed by a gerund (accused someone of doing something).",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Cấu trúc: accuse someone OF V-ing."
    },
    {
        "id": 54,
        "noiDung": "\"Suggest\" can be followed directly by a full infinitive (e.g., He suggested to go home).",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "B",
        "giaiThich": "Sai. \"Suggest\" đi với V-ing (suggested going) hoặc that-clause (suggested that we go), không đi với to-V."
    },
    {
        "id": 55,
        "noiDung": "\"Apologize\" is followed by the preposition \"for\" when citing the action (apologized for being late).",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Apologize for + V-ing."
    },
    {
        "id": 56,
        "noiDung": "\"Promise\" is followed by a to-infinitive (promised to call).",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Promise + to-V."
    },
    {
        "id": 57,
        "noiDung": "Select all reporting verbs followed by a gerund (verb + V-ing): (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "admit to (doing)",
            "B": "deny (doing)",
            "C": "refuse (to do)",
            "D": "suggest (doing)"
        },
        "dapAnDung": [
            "A",
            "B",
            "D"
        ],
        "giaiThich": "Admit, deny, suggest đi kèm V-ing. Refuse đi với to-V."
    },
    {
        "id": 58,
        "noiDung": "Which reporting verbs take an object + preposition + gerund (verb + someone + prep + V-ing): (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "accuse someone of",
            "B": "congratulate someone on",
            "C": "tell someone to",
            "D": "criticize someone for"
        },
        "dapAnDung": [
            "A",
            "B",
            "D"
        ],
        "giaiThich": "Accuse of, congratulate on, criticize for. Tell someone to-V không có giới từ."
    },
    {
        "id": 59,
        "noiDung": "Select all reporting verbs followed by a to-infinitive (verb + to-V): (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "promise to",
            "B": "refuse to",
            "C": "insist on (V-ing)",
            "D": "threaten to"
        },
        "dapAnDung": [
            "A",
            "B",
            "D"
        ],
        "giaiThich": "Promise, refuse, threaten đi với to-V. Insist đi với on + V-ing."
    },
    {
        "id": 60,
        "noiDung": "Identify all grammatically accurate reported speech sentences: (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "She apologized for being late.",
            "B": "He denied breaking the vase.",
            "C": "She suggested to leave early.",
            "D": "He promised to call tonight."
        },
        "dapAnDung": [
            "A",
            "B",
            "D"
        ],
        "giaiThich": "A, B, D chuẩn. C sai vì suggest không đi với to-V."
    },
    {
        "id": 61,
        "noiDung": "The committee recommended that the draft legislation __________ to the full assembly.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "be submitted",
            "B": "is submitted",
            "C": "was submitted",
            "D": "submitted"
        },
        "dapAnDung": "be submitted",
        "giaiThich": "Cấu trúc giả định thức trong câu tường thuật: \"recommended that + S + (should) be + V3\"."
    },
    {
        "id": 62,
        "noiDung": "When reporting permanent scientific truths, the verb tense in the that-clause __________ unchanged.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "remains",
            "B": "changes",
            "C": "loses",
            "D": "inverts"
        },
        "dapAnDung": "remains",
        "giaiThich": "Chân lý khoa học vĩnh cửu không lùi thì trong câu gián tiếp."
    },
    {
        "id": 63,
        "noiDung": "The defense counsel argued that his client __________ at the scene of the crime when it occurred.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "could not have been",
            "B": "cannot be",
            "C": "must not be",
            "D": "should not be"
        },
        "dapAnDung": "could not have been",
        "giaiThich": "Tường thuật suy đoán quá khứ: could not have been."
    },
    {
        "id": 64,
        "noiDung": "She insisted that the financial statements __________ audited by an independent third party.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "be",
            "B": "were",
            "C": "are",
            "D": "being"
        },
        "dapAnDung": "be",
        "giaiThich": "Thức giả định sau insist: insisted that S be audited."
    },
    {
        "id": 65,
        "noiDung": "He demanded to __________ informed immediately should any new developments arise.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "be",
            "B": "is",
            "C": "was",
            "D": "being"
        },
        "dapAnDung": "be",
        "giaiThich": "\"Demand to be + V3\" (yêu cầu được thông báo)."
    },
    {
        "id": 66,
        "noiDung": "The prime minister conceded that the economic reforms __________ more slowly than projected.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "were progressing",
            "B": "progress",
            "C": "is progressing",
            "D": "progressed"
        },
        "dapAnDung": "were progressing",
        "giaiThich": "Tường thuật thì tiếp diễn với động từ \"conceded that\"."
    },
    {
        "id": 67,
        "noiDung": "The judge warned the witness __________ committing perjury during the cross-examination.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "against",
            "B": "for",
            "C": "to",
            "D": "about"
        },
        "dapAnDung": "against",
        "giaiThich": "\"Warn someone against + V-ing\" (cảnh báo ai không được làm gì)."
    },
    {
        "id": 68,
        "noiDung": "The whistleblower disclosed that the firm __________ toxic industrial effluents into the river for years.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "had been dumping",
            "B": "has been dumping",
            "C": "dumps",
            "D": "was dumped"
        },
        "dapAnDung": "had been dumping",
        "giaiThich": "Quá khứ hoàn thành tiếp diễn nhấn mạnh hành động xả thải kéo dài trước đó."
    },
    {
        "id": 69,
        "noiDung": "He boasted __________ having won the national chess championship five consecutive times.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "about",
            "B": "for",
            "C": "to",
            "D": "with"
        },
        "dapAnDung": "about",
        "giaiThich": "\"Boast about / of + V-ing\" là khoe khoang về điều gì."
    },
    {
        "id": 70,
        "noiDung": "The company announced that dividends __________ paid out to shareholders at the end of the quarter.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "would be",
            "B": "will be",
            "C": "are",
            "D": "can be"
        },
        "dapAnDung": "would be",
        "giaiThich": "Tường thuật thì tương lai bị động: would be paid."
    },
    {
        "id": 71,
        "noiDung": "When a reported statement expresses a universal scientific truth or permanent general fact, backshifting is optional or unnecessary.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Chân lý khoa học (ví dụ: The earth revolves around the sun) không bắt buộc phải lùi thì."
    },
    {
        "id": 72,
        "noiDung": "Verbs like \"demand\", \"insist\", and \"recommend\" can be followed by a subjunctive that-clause with a bare infinitive.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Cấu trúc giả định thức dùng động từ nguyên mẫu không chia (recommended that he be present)."
    },
    {
        "id": 73,
        "noiDung": "\"Warn someone against doing something\" means advising them to do it as quickly as possible.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "B",
        "giaiThich": "Sai. \"Warn against doing\" là cảnh báo ai KHÔNG ĐƯỢC làm việc đó."
    },
    {
        "id": 74,
        "noiDung": "In reported speech, modal verbs like \"could\", \"would\", \"should\", and \"might\" do not shift further into the past.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Could, would, should, might giữ nguyên không lùi thì thêm nữa."
    },
    {
        "id": 75,
        "noiDung": "\"Boast of / about\" is followed by a gerund or a noun phrase.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Khoe khoang về cái gì: boast about + V-ing/Noun."
    },
    {
        "id": 76,
        "noiDung": "Direct questions with modal perfects (e.g., must have been) change their modal verb completely when reported.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "B",
        "giaiThich": "Sai. Cấu trúc modal perfect giữ nguyên dạng suy đoán khi tường thuật."
    },
    {
        "id": 77,
        "noiDung": "Select all reporting verbs that can introduce a subjunctive that-clause (verb + that + S + base verb): (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "demand",
            "B": "recommend",
            "C": "refuse",
            "D": "propose"
        },
        "dapAnDung": [
            "A",
            "B",
            "D"
        ],
        "giaiThich": "Demand, recommend, propose đều dùng thức giả định. Refuse đi với to-V."
    },
    {
        "id": 78,
        "noiDung": "Which reported statements appropriately omit tense backshifting due to permanent truths: (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "The teacher said that water boils at 100°C.",
            "B": "Copernicus demonstrated that the Earth orbits the Sun.",
            "C": "He said that he was eating lunch yesterday.",
            "D": "She said she is tired yesterday."
        },
        "dapAnDung": [
            "A",
            "B"
        ],
        "giaiThich": "A và B là chân lý khoa học bất biến nên không lùi thì."
    },
    {
        "id": 79,
        "noiDung": "Select all reporting structures that convey warnings or deterrence: (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "warned someone against trespassing",
            "B": "warned someone not to touch the wire",
            "C": "congratulated someone on winning",
            "D": "thanked someone for helping"
        },
        "dapAnDung": [
            "A",
            "B"
        ],
        "giaiThich": "Warn against V-ing và warn someone not to V là cấu trúc răn đe, cảnh báo."
    },
    {
        "id": 80,
        "noiDung": "Identify all sentences using advanced reporting patterns accurately: (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "The doctor recommended that he reduce his sodium intake.",
            "B": "She boasted about having aced the exam.",
            "C": "He refused that he stole the funds.",
            "D": "The regulator demanded that the plant be inspected."
        },
        "dapAnDung": [
            "A",
            "B",
            "D"
        ],
        "giaiThich": "A, B, D chuẩn. C sai vì refuse không đi với that-clause phủ nhận (phải là denied stealing)."
    },
    {
        "id": 81,
        "noiDung": "The attorney submitted that under no circumstances __________ his client to have had foreknowledge of the transaction.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "could",
            "B": "must",
            "C": "should",
            "D": "would"
        },
        "dapAnDung": "could",
        "giaiThich": "Tường thuật kết hợp đảo ngữ phủ định: under no circumstances could..."
    },
    {
        "id": 82,
        "noiDung": "The manifesto proclaimed that the proletariat __________ no alternative but to overthrow the feudal order.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "had",
            "B": "has",
            "C": "having",
            "D": "to have"
        },
        "dapAnDung": "had",
        "giaiThich": "Tuyên ngôn trong văn phong chính trị lịch sử: had no alternative."
    },
    {
        "id": 83,
        "noiDung": "The senior magistrate ruled that the contested evidence __________ inadmissible on constitutional grounds.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "was",
            "B": "be",
            "C": "is",
            "D": "being"
        },
        "dapAnDung": "was",
        "giaiThich": "Phán quyết tư pháp tường thuật: ruled that the evidence was inadmissible."
    },
    {
        "id": 84,
        "noiDung": "Counsel for the defense contended that the prosecution had failed to establish guilt beyond __________ doubt.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "reasonable",
            "B": "sensible",
            "C": "rational",
            "D": "logical"
        },
        "dapAnDung": "reasonable",
        "giaiThich": "\"Beyond reasonable doubt\" là thuật ngữ pháp lý chuẩn tắc."
    },
    {
        "id": 85,
        "noiDung": "The investigative panel posited that systemic regulatory oversight failures __________ the catastrophic meltdown.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "had precipitated",
            "B": "precipitate",
            "C": "precipitates",
            "D": "was precipitated"
        },
        "dapAnDung": "had precipitated",
        "giaiThich": "Hành động gây ra sự cố xảy ra trước nên lùi về Quá khứ hoàn thành: had precipitated."
    },
    {
        "id": 86,
        "noiDung": "The whistleblower alleged that the executive tier __________ knowingly concealed material audit findings.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "had",
            "B": "has",
            "C": "having",
            "D": "is"
        },
        "dapAnDung": "had",
        "giaiThich": "\"Alleged that the executive tier had concealed\" (cáo buộc rằng cấp lãnh đạo đã che giấu)."
    },
    {
        "id": 87,
        "noiDung": "The central bank governor hinted that monetary tightening __________ be paused should inflation decelerate.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "might",
            "B": "must",
            "C": "can",
            "D": "shall"
        },
        "dapAnDung": "might",
        "giaiThich": "Tường thuật dự báo chính sách với modal: might be paused."
    },
    {
        "id": 88,
        "noiDung": "The foreign ministry spokesperson dismissed allegations that territorial incursions __________ authorized.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "had been",
            "B": "have been",
            "C": "were being",
            "D": "are"
        },
        "dapAnDung": "had been",
        "giaiThich": "Bác bỏ cáo buộc rằng các vụ xâm nhập đã được phê chuẩn: had been authorized."
    },
    {
        "id": 89,
        "noiDung": "The treaty signatories pledged that territorial integrity __________ inviolable under international law.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "should remain",
            "B": "must remain",
            "C": "remains",
            "D": "remained"
        },
        "dapAnDung": "should remain",
        "giaiThich": "\"Pledged that... should remain inviolable\" mang tính cam kết trang trọng."
    },
    {
        "id": 90,
        "noiDung": "The constitutional court held that freedom of assembly __________ paramount in a democratic society.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "is",
            "B": "was",
            "C": "were",
            "D": "had been"
        },
        "dapAnDung": "is",
        "giaiThich": "Nguyên tắc hiến pháp mang tính chân lý vĩnh cửu trong án lệ: giữ nguyên thì hiện tại \"is\"."
    },
    {
        "id": 91,
        "noiDung": "In complex judicial rulings and constitutional treatises, fundamental legal doctrines retain present tense in reported clauses.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Các án lệ hiến pháp thể hiện chân lý tư pháp trường tồn giữ nguyên thì hiện tại."
    },
    {
        "id": 92,
        "noiDung": "\"Alleged that\" implies that an assertion is made with absolute empirical proof confirmed by all parties.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "B",
        "giaiThich": "Sai. \"Allege that\" mang nghĩa cáo buộc một việc mà chưa có bằng chứng kết luận chắc chắn."
    },
    {
        "id": 93,
        "noiDung": "Verbs of scholarly proposition (e.g., posited, hypothesized, contended) allow nuanced framing of intellectual discourse.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Các động từ này giúp tường thuật các giả thuyết khoa học một cách học thuật, khách quan."
    },
    {
        "id": 94,
        "noiDung": "Indirect speech completely forbids the use of modal auxiliary verbs in any shape or form.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "B",
        "giaiThich": "Sai. Câu gián tiếp sử dụng rất phong phú các động từ khuyết thiếu (might, could, should, would)."
    },
    {
        "id": 95,
        "noiDung": "\"Beyond reasonable doubt\" is the highest standard of proof required in criminal jurisprudence.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Vượt qua mọi nghi ngờ hợp lý là tiêu chuẩn chứng minh tội phạm trong tòa án."
    },
    {
        "id": 96,
        "noiDung": "Reported speech can seamlessly incorporate embedded negative inversion clauses.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Văn phong cao cấp có thể lồng ghép đảo ngữ trong mệnh đề tường thuật."
    },
    {
        "id": 97,
        "noiDung": "Select all sophisticated reporting verbs used in legal, academic, and journalistic discourse: (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "contend (lập luận)",
            "B": "posit (đặt giả thuyết)",
            "C": "say funny things",
            "D": "allege (cáo buộc)"
        },
        "dapAnDung": [
            "A",
            "B",
            "D"
        ],
        "giaiThich": "Contend, posit, allege là các động từ học thuật và pháp lý cao cấp."
    },
    {
        "id": 98,
        "noiDung": "Which clauses correctly retain the present tense in reported speech due to enduring normative truth: (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "The Supreme Court ruled that all citizens are equal before the law.",
            "B": "The physicist affirmed that energy can neither be created nor destroyed.",
            "C": "He said he is drinking coffee yesterday.",
            "D": "She claimed that two plus two was four."
        },
        "dapAnDung": [
            "A",
            "B"
        ],
        "giaiThich": "A (bình đẳng trước pháp luật) và B (định luật bảo toàn năng lượng) là chân lý vĩnh viễn nên dùng thì hiện tại."
    },
    {
        "id": 99,
        "noiDung": "Select all formal phrases denoting commitment or declaration in diplomatic speech: (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "pledged that sovereignty should remain inviolable",
            "B": "reaffirmed commitment to the non-proliferation treaty",
            "C": "whispered secret jokes",
            "D": "solemnly resolved that hostilities cease"
        },
        "dapAnDung": [
            "A",
            "B",
            "D"
        ],
        "giaiThich": "A, B, D là các cam kết ngoại giao trang trọng."
    },
    {
        "id": 100,
        "noiDung": "Identify all sentences using advanced reported discourse flawlessly: (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "The defense contended that the evidence was tainted.",
            "B": "The panel posited that structural reforms had failed.",
            "C": "The witness alleged that he sees the crime yesterday.",
            "D": "The court held that fundamental rights are inalienable."
        },
        "dapAnDung": [
            "A",
            "B",
            "D"
        ],
        "giaiThich": "A, B, D đúng ngữ pháp và ngữ cảnh. C sai vì dùng \"sees\" cho bối cảnh \"yesterday\"."
    }
]
};
