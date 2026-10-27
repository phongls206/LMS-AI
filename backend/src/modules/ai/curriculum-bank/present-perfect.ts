import { CurriculumTopicBank } from './types';

export const PRESENT_PERFECT_BANK: CurriculumTopicBank = {
  key: 'PRESENT_PERFECT',
  tenChuDe: 'Thì Hiện Tại Hoàn Thành (Present Perfect Tense)',
  aliases: [
    "hiện tại hoàn thành",
    "hien tai hoan thanh",
    "present perfect",
    "thì ht hoàn thành",
    "ht ht",
    "since",
    "for",
    "already yet"
],
  questions: [
    {
        "id": 1,
        "noiDung": "I __________ to London two times with my family.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "have been",
            "B": "has been",
            "C": "was",
            "D": "am"
        },
        "dapAnDung": "A",
        "giaiThich": "Trải nghiệm cá nhân: \"have been to\" với chủ ngữ ngôi thứ nhất \"I\"."
    },
    {
        "id": 2,
        "noiDung": "She __________ her homework already, so she can watch TV.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "has finished",
            "B": "have finished",
            "C": "finished",
            "D": "is finishing"
        },
        "dapAnDung": "A",
        "giaiThich": "Chủ ngữ ngôi thứ 3 số ít \"She\" đi với trợ động từ \"has\" + V3 (has finished)."
    },
    {
        "id": 3,
        "noiDung": "Have you ever __________ sushi in a Japanese restaurant?",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "eat",
            "B": "eaten",
            "C": "ate",
            "D": "eating"
        },
        "dapAnDung": "B",
        "giaiThich": "Cấu trúc câu hỏi trải nghiệm: \"Have you ever + V3/ed?\". Quá khứ phân từ của eat là eaten."
    },
    {
        "id": 4,
        "noiDung": "We have lived in this small town __________ 2020.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "since",
            "B": "for",
            "C": "in",
            "D": "at"
        },
        "dapAnDung": "A",
        "giaiThich": "\"Since\" dùng trước mốc thời gian cụ thể trong quá khứ (\"since 2020\")."
    },
    {
        "id": 5,
        "noiDung": "They have known each other __________ three years.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "for",
            "B": "since",
            "C": "during",
            "D": "from"
        },
        "dapAnDung": "A",
        "giaiThich": "\"For\" dùng trước một khoảng thời gian (\"for three years\")."
    },
    {
        "id": 6,
        "noiDung": "He has __________ seen a real elephant in the wild.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "never",
            "B": "ever",
            "C": "yet",
            "D": "already"
        },
        "dapAnDung": "A",
        "giaiThich": "\"Never\" mang nghĩa chưa từng bao giờ làm gì, đứng giữa trợ động từ has và V3."
    },
    {
        "id": 7,
        "noiDung": "I haven't finished reading this comic book __________.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "yet",
            "B": "already",
            "C": "just",
            "D": "since"
        },
        "dapAnDung": "A",
        "giaiThich": "\"Yet\" đứng ở cuối câu phủ định mang nghĩa \"chưa xong\"."
    },
    {
        "id": 8,
        "noiDung": "My brother __________ his car keys, so he cannot drive to work.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "has lost",
            "B": "have lost",
            "C": "lost",
            "D": "is losing"
        },
        "dapAnDung": "A",
        "giaiThich": "Hành động xảy ra để lại kết quả ở hiện tại (chưa tìm thấy chìa khóa): has lost."
    },
    {
        "id": 9,
        "noiDung": "We have __________ had lunch, so we are not hungry.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "just",
            "B": "yet",
            "C": "since",
            "D": "ever"
        },
        "dapAnDung": "A",
        "giaiThich": "\"Just\" diễn tả hành động vừa mới xảy ra tức thì."
    },
    {
        "id": 10,
        "noiDung": "Have they __________ their new English teacher yet?",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "met",
            "B": "meet",
            "C": "meeting",
            "D": "meets"
        },
        "dapAnDung": "A",
        "giaiThich": "Quá khứ phân từ V3 của động từ bất quy tắc \"meet\" là \"met\"."
    },
    {
        "id": 11,
        "noiDung": "The Present Perfect tense is formed using \"have/has + past participle (V3/ed)\".",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Cấu trúc chuẩn của Hiện tại hoàn thành là have/has + V3/ed."
    },
    {
        "id": 12,
        "noiDung": "We use \"since\" to indicate a period or duration of time (e.g., since five hours).",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "B",
        "giaiThich": "Sai. \"Since\" đi với mốc thời gian (since 8 AM), còn \"for\" mới đi với khoảng thời gian (for five hours)."
    },
    {
        "id": 13,
        "noiDung": "The word \"yet\" is typically placed at the end of negative sentences and questions.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. \"Yet\" thường đứng cuối câu phủ định (\"haven't done yet\") và câu hỏi (\"have you done yet?\")."
    },
    {
        "id": 14,
        "noiDung": "Subject \"He\" and \"She\" take \"have\" in the Present Perfect tense.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "B",
        "giaiThich": "Sai. Chủ ngữ He, She, It đi với trợ động từ \"has\"."
    },
    {
        "id": 15,
        "noiDung": "The sentence \"I have visited Da Nang three times\" talks about life experience.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Diễn tả trải nghiệm bao nhiêu lần tính đến hiện tại dùng Hiện tại hoàn thành."
    },
    {
        "id": 16,
        "noiDung": "\"Already\" means that something happened sooner than expected.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. \"Already\" mang nghĩa đã làm xong rồi (sớm hơn dự kiến)."
    },
    {
        "id": 17,
        "noiDung": "Select all time expressions that go with \"since\": (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "since 2018",
            "B": "since last Monday",
            "C": "since 3 weeks",
            "D": "since yesterday"
        },
        "dapAnDung": [
            "A",
            "B",
            "D"
        ],
        "giaiThich": "A, B, D là các mốc thời gian cụ thể. C là khoảng thời gian nên phải dùng \"for 3 weeks\"."
    },
    {
        "id": 18,
        "noiDung": "Which sentences use the Present Perfect tense correctly? (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "She has cleaned her bedroom.",
            "B": "They have watched this cartoon twice.",
            "C": "I has seen that movie before.",
            "D": "We have played tennis today."
        },
        "dapAnDung": [
            "A",
            "B",
            "D"
        ],
        "giaiThich": "A, B, D đúng ngữ pháp. C sai vì \"I\" phải đi với \"have\", không đi với \"has\"."
    },
    {
        "id": 19,
        "noiDung": "Select all irregular past participles (V3): (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "eaten (from eat)",
            "B": "written (from write)",
            "C": "sleeped (from sleep)",
            "D": "seen (from see)"
        },
        "dapAnDung": [
            "A",
            "B",
            "D"
        ],
        "giaiThich": "A, B, D là dạng V3 bất quy tắc đúng. C sai vì V3 của sleep là \"slept\"."
    },
    {
        "id": 20,
        "noiDung": "Which adverbs are commonly used with the Present Perfect tense? (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "already",
            "B": "yesterday",
            "C": "never",
            "D": "yet"
        },
        "dapAnDung": [
            "A",
            "C",
            "D"
        ],
        "giaiThich": "Already, never, yet đi với Hiện tại hoàn thành. \"Yesterday\" chỉ đi với Quá khứ đơn."
    },
    {
        "id": 21,
        "noiDung": "Have you ever __________ a live symphony concert in your hometown?",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "hear",
            "B": "heard",
            "C": "hearing",
            "D": "hears"
        },
        "dapAnDung": "B",
        "giaiThich": "Cấu trúc câu hỏi trải nghiệm: Have + S + ever + V3 (heard)."
    },
    {
        "id": 22,
        "noiDung": "Tom has worked as an electrician in Hanoi __________ five years.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "for",
            "B": "since",
            "C": "during",
            "D": "at"
        },
        "dapAnDung": "A",
        "giaiThich": "\"For five years\" chỉ khoảng thời gian kéo dài 5 năm."
    },
    {
        "id": 23,
        "noiDung": "She hasn't decided which university to attend __________.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "already",
            "B": "yet",
            "C": "just",
            "D": "since"
        },
        "dapAnDung": "B",
        "giaiThich": "\"Yet\" đứng cuối câu phủ định mang nghĩa \"vẫn chưa quyết định\"."
    },
    {
        "id": 24,
        "noiDung": "I have __________ sent the email, so you should receive it any minute.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "already",
            "B": "yet",
            "C": "never",
            "D": "ever"
        },
        "dapAnDung": "A",
        "giaiThich": "\"Already\" diễn tả hành động đã hoàn tất trước thời điểm nói."
    },
    {
        "id": 25,
        "noiDung": "We have been friends __________ we were in primary school.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "since",
            "B": "for",
            "C": "when",
            "D": "from"
        },
        "dapAnDung": "A",
        "giaiThich": "\"Since + mệnh đề quá khứ đơn\" làm mốc thời gian bắt đầu tình bạn."
    },
    {
        "id": 26,
        "noiDung": "Where is Linda? — She has __________ to the post office to mail a parcel.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "gone",
            "B": "been",
            "C": "went",
            "D": "going"
        },
        "dapAnDung": "A",
        "giaiThich": "\"Has gone to\" mang nghĩa đã đi đến đó và hiện chưa trở về."
    },
    {
        "id": 27,
        "noiDung": "Have you __________ tried spicy Thai tom yum soup before?",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "ever",
            "B": "never",
            "C": "yet",
            "D": "already"
        },
        "dapAnDung": "A",
        "giaiThich": "\"Ever\" dùng trong câu hỏi nghi vấn chỉ trải nghiệm."
    },
    {
        "id": 28,
        "noiDung": "The mechanic __________ repaired our motorcycle, so we can ride it now.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "has",
            "B": "have",
            "C": "is",
            "D": "was"
        },
        "dapAnDung": "A",
        "giaiThich": "Chủ ngữ \"The mechanic\" số ít đi với trợ động từ \"has\"."
    },
    {
        "id": 29,
        "noiDung": "How long __________ you studied English at this language academy?",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "have",
            "B": "did",
            "C": "are",
            "D": "do"
        },
        "dapAnDung": "A",
        "giaiThich": "Hỏi về độ dài thời gian tính đến nay: \"How long have you + V3?\"."
    },
    {
        "id": 30,
        "noiDung": "They have __________ returned from their summer vacation in Da Lat.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "just",
            "B": "yet",
            "C": "ever",
            "D": "since"
        },
        "dapAnDung": "A",
        "giaiThich": "\"Have just returned\" diễn tả hành động vừa mới xảy ra tức thì."
    },
    {
        "id": 31,
        "noiDung": "\"Has gone to\" means the person has gone and has not yet returned.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. \"Gone to\" nghĩa là đi chưa về, còn \"been to\" là đã đến và đã về rồi."
    },
    {
        "id": 32,
        "noiDung": "We use the Past Simple, not Present Perfect, with finished time expressions like \"last night\".",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Khi có mốc thời gian kết thúc hẳn trong quá khứ (\"last night\"), bắt buộc dùng Quá khứ đơn."
    },
    {
        "id": 33,
        "noiDung": "The question \"How long have you lived here?\" asks about duration from the past up to now.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. \"How long have you lived\" hỏi về khoảng thời gian kéo dài liên tục đến hiện tại."
    },
    {
        "id": 34,
        "noiDung": "In the sentence \"I have saw him yesterday\", the grammar is completely accurate.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "B",
        "giaiThich": "Sai vì 2 lỗi: \"have saw\" (phải là have seen) và \"yesterday\" không đi với Hiện tại hoàn thành."
    },
    {
        "id": 35,
        "noiDung": "We can use \"since\" followed by a clause in the Past Simple (e.g., \"since I arrived\").",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. \"Since + S + V(quá khứ đơn)\" là cấu trúc rất phổ biến."
    },
    {
        "id": 36,
        "noiDung": "\"So far\" and \"up to now\" are used with the Present Perfect tense.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. \"So far / up to now\" (cho đến nay) là dấu hiệu kinh điển của thì Hiện tại hoàn thành."
    },
    {
        "id": 37,
        "noiDung": "Select all sentences correctly contrasting \"been to\" and \"gone to\": (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "He has been to Paris and brought back souvenirs. (He is back)",
            "B": "She is not here; she has gone to the supermarket. (She is still there)",
            "C": "I have gone to Japan three times in my life. (Experience)",
            "D": "They have been to the doctor and are resting at home now."
        },
        "dapAnDung": [
            "A",
            "B",
            "D"
        ],
        "giaiThich": "A, B, D dùng đúng. C sai vì nói về trải nghiệm đã đi và về phải dùng \"have been to\"."
    },
    {
        "id": 38,
        "noiDung": "Which sentences correctly use \"since\" or \"for\"? (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "I have worked here for six months.",
            "B": "She has been sick since yesterday morning.",
            "C": "They have studied French for 2019.",
            "D": "We have known each other since childhood."
        },
        "dapAnDung": [
            "A",
            "B",
            "D"
        ],
        "giaiThich": "A, B, D dùng since/for chuẩn. C sai vì năm 2019 là mốc thời gian, phải dùng \"since 2019\"."
    },
    {
        "id": 39,
        "noiDung": "Select all sentences containing finished past time markers that CANNOT use Present Perfect: (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "I visited my grandparents two days ago.",
            "B": "She has lived here since last year.",
            "C": "We graduated from high school in 2021.",
            "D": "They bought their car last weekend."
        },
        "dapAnDung": [
            "A",
            "C",
            "D"
        ],
        "giaiThich": "A (two days ago), C (in 2021), D (last weekend) là thời gian xác định trong quá khứ chỉ dùng Quá khứ đơn."
    },
    {
        "id": 40,
        "noiDung": "Which sentences correctly illustrate the Present Perfect tense? (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "Have you called your parents yet?",
            "B": "He has already cooked dinner for us.",
            "C": "We haven't saw that documentary yet.",
            "D": "She has just received an award."
        },
        "dapAnDung": [
            "A",
            "B",
            "D"
        ],
        "giaiThich": "A, B, D đúng ngữ pháp. C sai vì V3 của see là \"seen\", không phải \"saw\"."
    },
    {
        "id": 41,
        "noiDung": "She __________ in London for five years, but she plans to relocate to Manchester soon.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "lived",
            "B": "has lived",
            "C": "is living",
            "D": "lives"
        },
        "dapAnDung": "B",
        "giaiThich": "Diễn tả hành động bắt đầu trong quá khứ kéo dài đến hiện tại (\"for five years\"), dùng Hiện tại hoàn thành."
    },
    {
        "id": 42,
        "noiDung": "Look! Someone __________ a cup of hot espresso all over the conference table.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "spilled",
            "B": "has spilled",
            "C": "spills",
            "D": "was spilling"
        },
        "dapAnDung": "B",
        "giaiThich": "Hành động vừa xảy ra để lại dấu vết/kết quả rõ ràng ở hiện tại (\"Look!\"), dùng Hiện tại hoàn thành."
    },
    {
        "id": 43,
        "noiDung": "This is the first time I __________ such an inspiring motivational lecture.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "hear",
            "B": "have heard",
            "C": "heard",
            "D": "am hearing"
        },
        "dapAnDung": "B",
        "giaiThich": "Cấu trúc cố định: \"It/This is the first time + S + have/has + V3/ed\"."
    },
    {
        "id": 44,
        "noiDung": "The company's revenue __________ significantly over the past three quarters.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "has increased",
            "B": "increased",
            "C": "increases",
            "D": "was increasing"
        },
        "dapAnDung": "A",
        "giaiThich": "\"Over the past three quarters\" là dấu hiệu hành động kéo dài đến nay: has increased."
    },
    {
        "id": 45,
        "noiDung": "Scientists have __________ substantial evidence connecting poor sleep to chronic illness.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "discovered",
            "B": "discovering",
            "C": "discover",
            "D": "discovers"
        },
        "dapAnDung": "A",
        "giaiThich": "Sau trợ động từ \"have\" cần quá khứ phân từ V3: discovered."
    },
    {
        "id": 46,
        "noiDung": "How many books by Haruki Murakami have you __________ so far?",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "read",
            "B": "reading",
            "C": "reads",
            "D": "reader"
        },
        "dapAnDung": "A",
        "giaiThich": "Phân từ 3 của động từ \"read\" viết là \"read\" (phát âm /red/)."
    },
    {
        "id": 47,
        "noiDung": "Our marketing team __________ three separate advertising campaigns this quarter.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "has launched",
            "B": "launched",
            "C": "is launching",
            "D": "was launching"
        },
        "dapAnDung": "A",
        "giaiThich": "\"This quarter\" là khoảng thời gian chưa kết thúc, dùng Hiện tại hoàn thành."
    },
    {
        "id": 48,
        "noiDung": "I have been studying Spanish for months, but I haven't __________ fluent yet.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "become",
            "B": "became",
            "C": "becoming",
            "D": "becomes"
        },
        "dapAnDung": "A",
        "giaiThich": "Dạng V3 của động từ bất quy tắc \"become\" là \"become\"."
    },
    {
        "id": 49,
        "noiDung": "Up to the present time, the organization __________ over ten thousand disadvantaged students.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "has assisted",
            "B": "assisted",
            "C": "assists",
            "D": "was assisting"
        },
        "dapAnDung": "A",
        "giaiThich": "\"Up to the present time\" (cho đến hiện tại) yêu cầu thì Hiện tại hoàn thành."
    },
    {
        "id": 50,
        "noiDung": "It has been raining continuously __________ early yesterday morning.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "since",
            "B": "for",
            "C": "from",
            "D": "during"
        },
        "dapAnDung": "A",
        "giaiThich": "\"Since early yesterday morning\" chỉ mốc thời gian bắt đầu cơn mưa."
    },
    {
        "id": 51,
        "noiDung": "The structure \"It is the first time + S + Present Perfect\" is standard English idiom.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. \"It is the first time I have seen this\" là cấu trúc thành ngữ cố định."
    },
    {
        "id": 52,
        "noiDung": "When an unfinished time period is mentioned (e.g., \"this week\", \"today\"), the Present Perfect can be used.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Khi khoảng thời gian chưa kết thúc hoàn toàn trong ngày/tuần/tháng, ta dùng Hiện tại hoàn thành."
    },
    {
        "id": 53,
        "noiDung": "The Present Perfect is used to narrate a chronological series of finished historical events.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "B",
        "giaiThich": "Sai. Để kể lại chuỗi sự kiện lịch sử đã chấm dứt theo trình tự thời gian, bắt buộc dùng Quá khứ đơn."
    },
    {
        "id": 54,
        "noiDung": "\"Lately\" and \"recently\" are commonly used with the Present Perfect to describe recent developments.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. \"Lately / recently\" (gần đây) thường xuyên bổ nghĩa cho thì Hiện tại hoàn thành."
    },
    {
        "id": 55,
        "noiDung": "In the sentence \"I have known him since five years\", the preposition choice is correct.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "B",
        "giaiThich": "Sai. Năm năm là một khoảng thời gian, phải dùng \"for five years\", không được dùng \"since\"."
    },
    {
        "id": 56,
        "noiDung": "The Present Perfect can show that an action in the past has a direct, visible consequence right now.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Ví dụ: \"I have broken my glasses (so I cannot read now)\"."
    },
    {
        "id": 57,
        "noiDung": "Which sentences correctly employ \"It is the first / second time...\" with Present Perfect? (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "This is the first time I have ever flown on an airplane.",
            "B": "It is the second time she has misplaced her car keys this week.",
            "C": "This is the first time I saw such an eclipse.",
            "D": "It is the third time they have visited Tokyo."
        },
        "dapAnDung": [
            "A",
            "B",
            "D"
        ],
        "giaiThich": "A, B, D dùng đúng Hiện tại hoàn thành. C sai thì (dùng saw)."
    },
    {
        "id": 58,
        "noiDung": "Select all sentences indicating actions with clear results visible in the present: (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "Look! The window has been smashed.",
            "B": "I have lost my wallet, so I cannot pay for dinner.",
            "C": "Christopher Columbus discovered America in 1492.",
            "D": "He has painted the door; be careful, the paint is still wet."
        },
        "dapAnDung": [
            "A",
            "B",
            "D"
        ],
        "giaiThich": "A, B, D đều có hệ quả nhãn tiền ở hiện tại. C là sự kiện lịch sử hoàn tất có mốc năm cụ thể."
    },
    {
        "id": 59,
        "noiDung": "Which time expressions typically pair with the Present Perfect tense? (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "over the last decade",
            "B": "so far this month",
            "C": "three days ago",
            "D": "in recent years"
        },
        "dapAnDung": [
            "A",
            "B",
            "D"
        ],
        "giaiThich": "A, B, D kết nối quá khứ tới hiện tại. C là mốc quá khứ kết thúc hẳn."
    },
    {
        "id": 60,
        "noiDung": "Select all sentences with grammatically accurate forms: (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "We haven't encountered any technical issues so far.",
            "B": "Has the parcel arrived yet?",
            "C": "She has already finished her master's dissertation.",
            "D": "Did you ever been to Hawaii?"
        },
        "dapAnDung": [
            "A",
            "B",
            "C"
        ],
        "giaiThich": "A, B, C chuẩn ngữ pháp. D sai vì phải là \"Have you ever been to Hawaii?\"."
    },
    {
        "id": 61,
        "noiDung": "The board of directors __________ several restructuring proposals since the quarterly review.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "has evaluated",
            "B": "evaluated",
            "C": "evaluates",
            "D": "was evaluating"
        },
        "dapAnDung": "A",
        "giaiThich": "\"Since the quarterly review\" chỉ hành động bắt đầu từ buổi họp và kéo dài đến nay: has evaluated."
    },
    {
        "id": 62,
        "noiDung": "She has been __________ with the regional manager regarding the contract stipulations all morning.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "negotiating",
            "B": "negotiated",
            "C": "negotiate",
            "D": "negotiates"
        },
        "dapAnDung": "A",
        "giaiThich": "Thì Hiện tại hoàn thành tiếp diễn nhấn mạnh tính liên tục suốt buổi sáng: has been negotiating."
    },
    {
        "id": 63,
        "noiDung": "The pharmaceutical giant __________ over two billion dollars in vaccine research to date.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "has invested",
            "B": "invested",
            "C": "is investing",
            "D": "invests"
        },
        "dapAnDung": "A",
        "giaiThich": "\"To date\" (tính đến thời điểm hiện nay) là dấu hiệu kinh điển của Hiện tại hoàn thành."
    },
    {
        "id": 64,
        "noiDung": "Never before in our nation's modern history __________ such severe economic volatility.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "have we witnessed",
            "B": "we have witnessed",
            "C": "did we witnessed",
            "D": "we witnessed"
        },
        "dapAnDung": "A",
        "giaiThich": "Đảo ngữ với trạng từ phủ định \"Never before\": trợ động từ \"have\" đảo lên trước chủ ngữ \"we\"."
    },
    {
        "id": 65,
        "noiDung": "Our engineering department has __________ developed a prototype that cuts energy consumption in half.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "successfully",
            "B": "success",
            "C": "successful",
            "D": "succeed"
        },
        "dapAnDung": "A",
        "giaiThich": "Trạng từ \"successfully\" đứng giữa trợ động từ \"has\" và quá khứ phân từ \"developed\"."
    },
    {
        "id": 66,
        "noiDung": "The inflation rate __________ steadily despite government intervention measures.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "has been climbing",
            "B": "climbing",
            "C": "is climbed",
            "D": "was climbed"
        },
        "dapAnDung": "A",
        "giaiThich": "Thì Hiện tại hoàn thành tiếp diễn diễn tả xu hướng đang tiếp diễn liên tục."
    },
    {
        "id": 67,
        "noiDung": "How many international agreements __________ by the trade delegation during this fiscal year?",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "have been ratified",
            "B": "were ratified",
            "C": "are ratified",
            "D": "had ratified"
        },
        "dapAnDung": "A",
        "giaiThich": "Thể bị động của thì Hiện tại hoàn thành: \"have been ratified\" (được phê chuẩn)."
    },
    {
        "id": 68,
        "noiDung": "The lead archaeologist claims that his team __________ a major prehistoric burial ground.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "has unearthed",
            "B": "unearths",
            "C": "was unearthed",
            "D": "is unearthing"
        },
        "dapAnDung": "A",
        "giaiThich": "Công bố phát hiện có ý nghĩa lớn đối với hiện tại: has unearthed."
    },
    {
        "id": 69,
        "noiDung": "It is the third time this week that the central air conditioning system __________.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "has malfunctioned",
            "B": "malfunctioned",
            "C": "malfunctions",
            "D": "is malfunctioning"
        },
        "dapAnDung": "A",
        "giaiThich": "\"It is the third time... + Present Perfect\": has malfunctioned."
    },
    {
        "id": 70,
        "noiDung": "For decades, environmentalists __________ about the catastrophic consequences of global deforestation.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "have warned",
            "B": "warned",
            "C": "warn",
            "D": "are warned"
        },
        "dapAnDung": "A",
        "giaiThich": "\"For decades\" (suốt nhiều thập kỷ qua) đi kèm Hiện tại hoàn thành: have warned."
    },
    {
        "id": 71,
        "noiDung": "The Present Perfect Continuous emphasizes the duration or continuity of an ongoing activity.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Hiện tại hoàn thành tiếp diễn nhấn mạnh vào quá trình và thời lượng kéo dài liên tục."
    },
    {
        "id": 72,
        "noiDung": "Stative verbs like \"know\", \"believe\", and \"belong\" are standardly used in the Present Perfect Continuous.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "B",
        "giaiThich": "Sai. Các động từ chỉ trạng thái (know, believe, belong) không chia ở dạng tiếp diễn, phải dùng Present Perfect Simple."
    },
    {
        "id": 73,
        "noiDung": "In negative inversions like \"Rarely have I seen...\", the auxiliary verb precedes the subject.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Đảo ngữ sau các trạng từ phủ định (Rarely, Never, Seldom) đưa trợ động từ lên trước chủ ngữ."
    },
    {
        "id": 74,
        "noiDung": "\"To date\" and \"as of yet\" are formal synonyms for \"so far\" used with the Present Perfect.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. \"To date / as of yet\" là cách dùng trang trọng trong báo cáo và văn bản học thuật."
    },
    {
        "id": 75,
        "noiDung": "The sentence \"I have been knowing him for ten years\" is standard grammatical English.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "B",
        "giaiThich": "Sai. \"Know\" là động từ chỉ nhận thức, không chia tiếp diễn (\"I have known him for ten years\")."
    },
    {
        "id": 76,
        "noiDung": "The passive form of the Present Perfect is constructed as \"have/has been + V3/ed\".",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Thể bị động chuẩn: have/has been + V3."
    },
    {
        "id": 77,
        "noiDung": "Which sentences correctly employ inversion with Present Perfect? (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "Never before have we witnessed such remarkable medical breakthroughs.",
            "B": "Seldom has a rookie athlete achieved such extraordinary acclaim.",
            "C": "Rarely have they encountered such fierce market resistance.",
            "D": "Never we have experienced such freezing temperatures."
        },
        "dapAnDung": [
            "A",
            "B",
            "C"
        ],
        "giaiThich": "A, B, C đảo ngữ chuẩn xác. D sai vì chưa đảo trợ động từ \"have\" lên trước chủ ngữ \"we\"."
    },
    {
        "id": 78,
        "noiDung": "Select all stative verbs that should NOT be used in the continuous form: (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "know",
            "B": "resemble",
            "C": "run",
            "D": "possess"
        },
        "dapAnDung": [
            "A",
            "B",
            "D"
        ],
        "giaiThich": "Know, resemble, possess là động từ chỉ trạng thái, không dùng ở thì tiếp diễn. Run là động từ hành động."
    },
    {
        "id": 79,
        "noiDung": "Which sentences illustrate the correct usage of Present Perfect Continuous? (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "The auditors have been reviewing the financial records all morning.",
            "B": "He is exhausted because he has been working out at the gym for two hours.",
            "C": "She has been knowing the director since childhood.",
            "D": "We have been trying to reach tech support without any success."
        },
        "dapAnDung": [
            "A",
            "B",
            "D"
        ],
        "giaiThich": "A, B, D dùng chuẩn thì HTHT tiếp diễn. C sai với động từ \"knowing\"."
    },
    {
        "id": 80,
        "noiDung": "Select all sentences that convey completed accomplishments with Present Perfect: (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "She has published three peer-reviewed research papers this year.",
            "B": "Our team has completed the software migration ahead of deadline.",
            "C": "He has been painting the fence for three hours.",
            "D": "The government has ratified the international treaty."
        },
        "dapAnDung": [
            "A",
            "B",
            "D"
        ],
        "giaiThich": "A, B, D nhấn mạnh vào thành tựu kết quả đã xong. C nhấn mạnh vào quá trình đang diễn ra."
    },
    {
        "id": 81,
        "noiDung": "Scarcely __________ the corporate merger when unexpected regulatory investigations commenced.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "had they finalized",
            "B": "have they finalized",
            "C": "they had finalized",
            "D": "they finalized"
        },
        "dapAnDung": "A",
        "giaiThich": "Cấu trúc đảo ngữ: \"Scarcely had + S + V3 when...\"."
    },
    {
        "id": 82,
        "noiDung": "Only recently __________ the immense geopolitical ramifications of renewable energy independence.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "have global leaders recognized",
            "B": "global leaders have recognized",
            "C": "did global leaders recognize",
            "D": "global leaders recognized"
        },
        "dapAnDung": "A",
        "giaiThich": "Đảo ngữ với cụm \"Only recently\": \"have + S + V3\"."
    },
    {
        "id": 83,
        "noiDung": "Not until the publication of the investigative report __________ the systemic accounting fraud.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "did the board acknowledge",
            "B": "the board acknowledged",
            "C": "has the board acknowledged",
            "D": "the board has acknowledged"
        },
        "dapAnDung": "A",
        "giaiThich": "Đảo ngữ với \"Not until + thời gian/mệnh đề\": mệnh đề chính đảo trợ động từ lên trước."
    },
    {
        "id": 84,
        "noiDung": "The macroeconomic data suggests that corporate investment __________ stagnant throughout the preceding decade.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "has remained",
            "B": "remained",
            "C": "is remaining",
            "D": "was remaining"
        },
        "dapAnDung": "A",
        "giaiThich": "\"Throughout the preceding decade\" kéo dài đến nay: has remained."
    },
    {
        "id": 85,
        "noiDung": "Little __________ the magnitude of the socioeconomic upheavals that were about to unfold.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "did they foresee",
            "B": "they foresaw",
            "C": "have they foreseen",
            "D": "they have foreseen"
        },
        "dapAnDung": "A",
        "giaiThich": "Đảo ngữ với trạng từ phủ định \"Little\": Little did they foresee."
    },
    {
        "id": 86,
        "noiDung": "It is essential that all pertinent clinical trial findings __________ to the regulatory agency without delay.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "be submitted",
            "B": "are submitted",
            "C": "have submitted",
            "D": "were submitted"
        },
        "dapAnDung": "A",
        "giaiThich": "Cấu trúc giả định thức (Subjunctive): \"It is essential that + S + (should) be + V3\"."
    },
    {
        "id": 87,
        "noiDung": "The empirical evidence amassed by the research consortium __________ groundbreaking insights into neurological decay.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "has yielded",
            "B": "have yielded",
            "C": "yielded",
            "D": "is yielding"
        },
        "dapAnDung": "A",
        "giaiThich": "\"Evidence\" là danh từ không đếm được, chia số ít: has yielded."
    },
    {
        "id": 88,
        "noiDung": "Under no circumstances __________ confidential client data to third-party entities without explicit consent.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "should employees disclose",
            "B": "employees should disclose",
            "C": "have employees disclosed",
            "D": "employees have disclosed"
        },
        "dapAnDung": "A",
        "giaiThich": "Đảo ngữ cấm đoán tuyệt đối: \"Under no circumstances should + S + V\"."
    },
    {
        "id": 89,
        "noiDung": "The unprecedented influx of venture capital __________ radical innovation across the artificial intelligence sector.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "has catalyzed",
            "B": "have catalyzed",
            "C": "catalyzes",
            "D": "is catalyzed"
        },
        "dapAnDung": "A",
        "giaiThich": "Chủ ngữ chính \"The influx\" (danh từ số ít) đi với \"has catalyzed\"."
    },
    {
        "id": 90,
        "noiDung": "Seldom in the annals of modern jurisprudence __________ a case that generated such fierce constitutional debate.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "has there been",
            "B": "there has been",
            "C": "was there",
            "D": "there was"
        },
        "dapAnDung": "A",
        "giaiThich": "Đảo ngữ với \"Seldom\": \"has there been + Noun\"."
    },
    {
        "id": 91,
        "noiDung": "In academic discourse, the Present Perfect is frequently employed to review literature and summarize cumulative scholarly discoveries.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Trong văn phong học thuật, Hiện tại hoàn thành dùng tổng kết các công trình nghiên cứu khoa học."
    },
    {
        "id": 92,
        "noiDung": "Inversion structures beginning with negative adverbs such as \"Scarcely\", \"Hardly\", and \"Seldom\" require inverted word order.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Đảo ngữ bắt buộc chuyển trợ động từ lên trước chủ ngữ."
    },
    {
        "id": 93,
        "noiDung": "Uncountable abstract nouns like \"evidence\", \"research\", and \"information\" take plural verbs in Present Perfect.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "B",
        "giaiThich": "Sai. Các danh từ trừu tượng không đếm được luôn đi với động từ số ít (\"has researched\", \"has yielded\")."
    },
    {
        "id": 94,
        "noiDung": "The expression \"to date\" can be seamlessly substituted with \"as of yet\" in high-register formal documentation.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Cả hai cụm từ đều mang tính trang trọng cao trong văn bản hành chính."
    },
    {
        "id": 95,
        "noiDung": "The Present Perfect tense cannot co-occur with passive voice constructions.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "B",
        "giaiThich": "Sai. Bị động Hiện tại hoàn thành (have/has been + V3) được sử dụng cực kỳ rộng rãi."
    },
    {
        "id": 96,
        "noiDung": "\"Hardly had we arrived when...\" expresses two events happening in rapid chronological succession.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. \"Hardly had... when...\" mang nghĩa vừa mới... thì đã ngay lập tức..."
    },
    {
        "id": 97,
        "noiDung": "Which sentences exhibit flawless formal negative inversion? (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "Rarely have scholars encountered such pristine archaeological remains.",
            "B": "Under no circumstances should sensitive credentials be disseminated.",
            "C": "Hardly had the treaty been signed when hostilities resumed.",
            "D": "Seldom we have observed such unprecedented market consolidation."
        },
        "dapAnDung": [
            "A",
            "B",
            "C"
        ],
        "giaiThich": "A, B, C đảo ngữ chuẩn. D sai vì thiếu đảo trợ động từ \"have\" lên trước \"we\"."
    },
    {
        "id": 98,
        "noiDung": "Select all sentences correctly presenting scholarly research findings in Present Perfect: (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "Numerous clinical studies have demonstrated a robust correlation between exercise and longevity.",
            "B": "Recent astrophysical observations have challenged orthodox cosmological models.",
            "C": "Scholars have long debated the origins of this ancient dialect.",
            "D": "Isaac Newton has published his Principia Mathematica in 1687."
        },
        "dapAnDung": [
            "A",
            "B",
            "C"
        ],
        "giaiThich": "A, B, C trích dẫn nghiên cứu khoa học chuẩn. D sai vì năm 1687 là mốc lịch sử quá khứ xác định, phải dùng Quá khứ đơn."
    },
    {
        "id": 99,
        "noiDung": "Which sentences correctly employ subject-verb agreement with collective or abstract nouns in Present Perfect? (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "The body of empirical evidence has expanded exponentially.",
            "B": "A substantial amount of research has been conducted on cognitive fatigue.",
            "C": "All available epidemiological data have been compiled for scrutiny.",
            "D": "The criteria for eligibility has been revised by the committee."
        },
        "dapAnDung": [
            "A",
            "B",
            "C"
        ],
        "giaiThich": "A (body has), B (research has), C (data have - danh từ số nhiều trang trọng) đều đúng. D sai vì \"criteria\" là số nhiều của criterion, phải dùng \"have been revised\"."
    },
    {
        "id": 100,
        "noiDung": "Select all expressions that appropriately introduce cumulative historical developments up to the present: (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "Hitherto",
            "B": "Heretofore",
            "C": "To date",
            "D": "Yesteryear"
        },
        "dapAnDung": [
            "A",
            "B",
            "C"
        ],
        "giaiThich": "Hitherto, Heretofore, To date đều mang nghĩa \"cho đến thời điểm này\". Yesteryear mang nghĩa hoài niệm quá khứ."
    }
]
};
