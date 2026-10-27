import { CurriculumTopicBank } from './types';

export const CONDITIONALS_BANK: CurriculumTopicBank = {
  key: 'CONDITIONALS',
  tenChuDe: 'Câu Điều Kiện Loại 1, 2, 3 (Conditional Sentences)',
  aliases: [
    "điều kiện",
    "dieu kien",
    "conditional",
    "câu điều kiện",
    "cau dieu kien",
    "if",
    "unless",
    "câu if",
    "cau if",
    "mixed conditional"
],
  questions: [
    {
        "id": 1,
        "noiDung": "Water boils if you __________ it to 100 degrees Celsius.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "heat",
            "B": "heats",
            "C": "heated",
            "D": "will heat"
        },
        "dapAnDung": "A",
        "giaiThich": "Câu điều kiện loại 0 (Zero conditional) diễn tả quy luật tự nhiên: cả 2 mệnh đề đều dùng Hiện tại đơn."
    },
    {
        "id": 2,
        "noiDung": "If you freeze water, it __________ ice.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "becomes",
            "B": "became",
            "C": "will become",
            "D": "becoming"
        },
        "dapAnDung": "A",
        "giaiThich": "Quy luật vật lý hiển nhiên (loại 0): Hiện tại đơn ở cả 2 vế. Chủ ngữ \"it\" đi với \"becomes\"."
    },
    {
        "id": 3,
        "noiDung": "If it rains tomorrow, we __________ at home.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "stay",
            "B": "will stay",
            "C": "stayed",
            "D": "staying"
        },
        "dapAnDung": "B",
        "giaiThich": "Câu điều kiện loại 1: Mệnh đề chính dùng \"will + V-inf\" để chỉ hành động trong tương lai."
    },
    {
        "id": 4,
        "noiDung": "If you touch a hot stove, you __________ your hand.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "burn",
            "B": "burns",
            "C": "burned",
            "D": "will burn"
        },
        "dapAnDung": "A",
        "giaiThich": "Thực tế hiển nhiên: chạm vào bếp nóng thì bị bỏng tay (Hiện tại đơn: you burn)."
    },
    {
        "id": 5,
        "noiDung": "If she gets up late, she __________ the morning school bus.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "misses",
            "B": "will miss",
            "C": "missed",
            "D": "missing"
        },
        "dapAnDung": "B",
        "giaiThich": "Điều kiện loại 1: If + Hiện tại đơn, S + will + V-inf (will miss)."
    },
    {
        "id": 6,
        "noiDung": "If you mix red and blue paint, you __________ purple.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "get",
            "B": "gets",
            "C": "got",
            "D": "will get"
        },
        "dapAnDung": "A",
        "giaiThich": "Pha trộn màu sắc là chân lý khoa học tự nhiên (loại 0: you get)."
    },
    {
        "id": 7,
        "noiDung": "If my friend calls me tonight, I __________ him the homework answers.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "tell",
            "B": "will tell",
            "C": "told",
            "D": "telling"
        },
        "dapAnDung": "B",
        "giaiThich": "Dự định trong tương lai với điều kiện loại 1 (will tell)."
    },
    {
        "id": 8,
        "noiDung": "Plants die if they __________ enough water and sunlight.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "don't get",
            "B": "didn't get",
            "C": "won't get",
            "D": "not get"
        },
        "dapAnDung": "A",
        "giaiThich": "Quy luật sinh học (loại 0): Chủ ngữ \"they\" dùng trợ động từ phủ định \"don't get\"."
    },
    {
        "id": 9,
        "noiDung": "If you are hungry, there __________ some fresh bread on the table.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "is",
            "B": "are",
            "C": "will be",
            "D": "was"
        },
        "dapAnDung": "A",
        "giaiThich": "\"Bread\" là danh từ không đếm được, dùng \"there is\"."
    },
    {
        "id": 10,
        "noiDung": "If the weather is sunny this weekend, we __________ to the park for a picnic.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "go",
            "B": "will go",
            "C": "went",
            "D": "gone"
        },
        "dapAnDung": "B",
        "giaiThich": "Điều kiện loại 1 chỉ khả năng xảy ra vào cuối tuần: will go."
    },
    {
        "id": 11,
        "noiDung": "Zero conditional sentences describe general truths, habits, and scientific facts.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Câu điều kiện loại 0 dùng diễn tả các chân lý khoa học và thói quen hiển nhiên."
    },
    {
        "id": 12,
        "noiDung": "In the sentence \"If it rains, take an umbrella\", this is an example of an imperative conditional.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Mệnh đề chính có thể dùng câu mệnh lệnh trực tiếp (\"take an umbrella\")."
    },
    {
        "id": 13,
        "noiDung": "When the if-clause is placed at the start of a sentence, we usually separate it with a comma.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Khi mệnh đề If đứng đầu câu, cần có dấu phẩy ngăn cách với mệnh đề chính."
    },
    {
        "id": 14,
        "noiDung": "In basic English, the word \"will\" is commonly placed inside the if-clause to talk about the future.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "B",
        "giaiThich": "Sai. Trong mệnh đề If, ta dùng thì Hiện tại đơn, không dùng \"will\"."
    },
    {
        "id": 15,
        "noiDung": "The sentence \"If you heat ice, it melts\" is an example of a Zero conditional.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Sự thật vật lý: đun nóng đá thì đá tan chảy (Hiện tại - Hiện tại)."
    },
    {
        "id": 16,
        "noiDung": "Type 1 conditionals talk about impossible situations in the past.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "B",
        "giaiThich": "Sai. Loại 1 diễn tả sự việc có thể xảy ra ở hiện tại hoặc tương lai, không phải quá khứ."
    },
    {
        "id": 17,
        "noiDung": "Select all valid Zero conditional sentences (chân lý, sự thật khoa học): (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "If water reaches 100°C, it boils.",
            "B": "If you freeze water, it turns to ice.",
            "C": "If I win the lottery tomorrow, I will buy a car.",
            "D": "If babies are hungry, they cry."
        },
        "dapAnDung": [
            "A",
            "B",
            "D"
        ],
        "giaiThich": "A, B, D là các quy luật tự nhiên/thói quen (loại 0). C là điều kiện loại 1."
    },
    {
        "id": 18,
        "noiDung": "Which sentences are correct Type 1 conditional sentences? (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "If it rains, we will stay at home.",
            "B": "If you study hard, you will pass the test.",
            "C": "If I had wings, I would fly in the sky.",
            "D": "If she comes early, we will start together."
        },
        "dapAnDung": [
            "A",
            "B",
            "D"
        ],
        "giaiThich": "A, B, D là câu điều kiện loại 1 chuẩn (If + HT đơn, will + V). C là câu điều kiện loại 2 giả định."
    },
    {
        "id": 19,
        "noiDung": "Select all sentences with correct punctuation and structure: (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "If the weather is fine, we go to the beach.",
            "B": "We will call you if we arrive early.",
            "C": "If it will rain, I stay at home.",
            "D": "If you touch ice, your hand feels cold."
        },
        "dapAnDung": [
            "A",
            "B",
            "D"
        ],
        "giaiThich": "A, B, D đúng ngữ pháp. C sai vì dùng \"will rain\" trong mệnh đề If."
    },
    {
        "id": 20,
        "noiDung": "Which conjunctions can introduce a conditional meaning in basic English? (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "If",
            "B": "When",
            "C": "Because",
            "D": "Unless"
        },
        "dapAnDung": [
            "A",
            "B",
            "D"
        ],
        "giaiThich": "If, When, Unless đều dùng đặt điều kiện hoặc thời điểm xảy ra điều kiện. \"Because\" dùng chỉ nguyên nhân."
    },
    {
        "id": 21,
        "noiDung": "Unless you __________ an umbrella, you will get soaked in this heavy rain.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "bring",
            "B": "don't bring",
            "C": "brought",
            "D": "will bring"
        },
        "dapAnDung": "A",
        "giaiThich": "\"Unless\" mang nghĩa phủ định (= If ... not). Mệnh đề đi liền sau unless luôn ở thể khẳng định."
    },
    {
        "id": 22,
        "noiDung": "If you feel tired after the long journey, __________ a short nap.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "take",
            "B": "taking",
            "C": "took",
            "D": "will take"
        },
        "dapAnDung": "A",
        "giaiThich": "Mệnh đề chính dùng câu mệnh lệnh trực tiếp đưa ra lời khuyên: \"take a short nap\"."
    },
    {
        "id": 23,
        "noiDung": "If we don't leave right now, we __________ our train to the capital.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "miss",
            "B": "will miss",
            "C": "missed",
            "D": "would miss"
        },
        "dapAnDung": "B",
        "giaiThich": "Điều kiện loại 1: If + Hiện tại đơn, S + will + V-inf."
    },
    {
        "id": 24,
        "noiDung": "If she __________ enough money saved up, she will buy a new smartphone.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "has",
            "B": "have",
            "C": "had",
            "D": "will have"
        },
        "dapAnDung": "A",
        "giaiThich": "Mệnh đề If thì Hiện tại đơn với chủ ngữ \"she\" chia động từ là \"has\"."
    },
    {
        "id": 25,
        "noiDung": "You will fail the driving test unless you __________ carefully.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "practice",
            "B": "don't practice",
            "C": "practiced",
            "D": "will practice"
        },
        "dapAnDung": "A",
        "giaiThich": "\"Unless you practice\" = If you do not practice. Sau unless dùng thể khẳng định."
    },
    {
        "id": 26,
        "noiDung": "If the fire alarm goes off, all students __________ the building immediately.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "must exit",
            "B": "exited",
            "C": "would exit",
            "D": "had exited"
        },
        "dapAnDung": "A",
        "giaiThich": "Trong câu điều kiện loại 1, mệnh đề chính có thể dùng động từ khiếm khuyết \"must\" chỉ nghĩa vụ khẩn cấp."
    },
    {
        "id": 27,
        "noiDung": "What __________ if the flight is delayed by bad weather?",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "will we do",
            "B": "do we do",
            "C": "did we do",
            "D": "would we do"
        },
        "dapAnDung": "A",
        "giaiThich": "Cấu trúc câu hỏi điều kiện loại 1: \"What will + S + do if + S + V(s/es)?\"."
    },
    {
        "id": 28,
        "noiDung": "If he __________ his room today, his mother will let him go to the cinema.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "cleans",
            "B": "clean",
            "C": "cleaned",
            "D": "will clean"
        },
        "dapAnDung": "A",
        "giaiThich": "Hiện tại đơn với ngôi thứ 3 số ít \"he\" là \"cleans\"."
    },
    {
        "id": 29,
        "noiDung": "If you don't put the milk in the fridge, it __________ sour quickly.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "will turn",
            "B": "turns",
            "C": "turned",
            "D": "turning"
        },
        "dapAnDung": "A",
        "giaiThich": "Hậu quả có thể xảy ra trong tương lai: will turn."
    },
    {
        "id": 30,
        "noiDung": "Unless it __________ tomorrow, we will have our football match as scheduled.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "rains",
            "B": "doesn't rain",
            "C": "rained",
            "D": "will rain"
        },
        "dapAnDung": "A",
        "giaiThich": "\"Unless it rains\" = If it doesn't rain. Dùng Hiện tại đơn sau unless."
    },
    {
        "id": 31,
        "noiDung": "In conditional sentences, \"unless\" is equivalent in meaning to \"if ... not\".",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. \"Unless S + V\" hoàn toàn tương đương với \"If S + don't/doesn't + V\"."
    },
    {
        "id": 32,
        "noiDung": "The sentence \"If you need help, please call me\" uses an imperative in the main clause.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. \"Please call me\" là câu mệnh lệnh lịch sự trong mệnh đề chính."
    },
    {
        "id": 33,
        "noiDung": "We can use modal verbs like \"can\", \"may\", or \"must\" in the main clause of Type 1 conditionals.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Mệnh đề chính loại 1 có thể dùng can, may, must thay cho will."
    },
    {
        "id": 34,
        "noiDung": "The sentence \"Unless you don't study, you will fail\" is grammatically correct English.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "B",
        "giaiThich": "Sai. Đây là lỗi phủ định kép (\"unless\" đi với \"don't study\"). Đúng phải là \"Unless you study\"."
    },
    {
        "id": 35,
        "noiDung": "In the sentence \"If my cat is hungry, it meows loudly\", this is an example of a habit (Zero conditional).",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Thói quen lặp đi lặp lại thường xuyên của con vật dùng điều kiện loại 0."
    },
    {
        "id": 36,
        "noiDung": "A conditional sentence must always have the if-clause first.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "B",
        "giaiThich": "Sai. Mệnh đề chính có thể đứng trước mệnh đề If (ví dụ: \"I will call you if I arrive early\")."
    },
    {
        "id": 37,
        "noiDung": "Which sentences correctly use \"unless\"? (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "Unless you wear a coat, you will catch a cold.",
            "B": "We will miss the bus unless we run.",
            "C": "Unless you don't listen, you will understand.",
            "D": "You cannot enter unless you show your ticket."
        },
        "dapAnDung": [
            "A",
            "B",
            "D"
        ],
        "giaiThich": "A, B, D dùng unless chuẩn xác. C sai lỗi phủ định kép (\"unless you don't listen\")."
    },
    {
        "id": 38,
        "noiDung": "Select all sentences where modal verbs are correctly used in Type 1 conditionals: (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "If you finish your homework, you can play video games.",
            "B": "If it rains, you should take an umbrella.",
            "C": "If you enter the laboratory, you must wear safety goggles.",
            "D": "If I will see him, I might say hello."
        },
        "dapAnDung": [
            "A",
            "B",
            "C"
        ],
        "giaiThich": "A (can), B (should), C (must) đều đúng. D sai vì dùng \"will see\" trong vế If."
    },
    {
        "id": 39,
        "noiDung": "Which of the following sentences describe realistic future possibilities? (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "If I pass my exam, my parents will buy me a bicycle.",
            "B": "If we wake up late tomorrow, we will take a taxi.",
            "C": "If dogs had eight legs, they would run faster.",
            "D": "If the store is open, I will buy some bread."
        },
        "dapAnDung": [
            "A",
            "B",
            "D"
        ],
        "giaiThich": "A, B, D là điều kiện loại 1 thực tế. C là điều kiện hoang tưởng không có thật (loại 2)."
    },
    {
        "id": 40,
        "noiDung": "Identify all grammatically correct conditional sentences: (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "If you heat chocolate, it melts.",
            "B": "She will be upset if you forget her birthday.",
            "C": "If you will come tomorrow, we go out.",
            "D": "Unless you work hard, you won't succeed."
        },
        "dapAnDung": [
            "A",
            "B",
            "D"
        ],
        "giaiThich": "A (loại 0), B (loại 1), D (unless loại 1) đều đúng. C sai thì ở mệnh đề If."
    },
    {
        "id": 41,
        "noiDung": "If I __________ in your position right now, I would accept that scholarship offer.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "am",
            "B": "was",
            "C": "were",
            "D": "have been"
        },
        "dapAnDung": "C",
        "giaiThich": "Câu điều kiện loại 2 giả định trái thực tế ở hiện tại: dùng \"were\" cho tất cả các ngôi trong mệnh đề If."
    },
    {
        "id": 42,
        "noiDung": "If she had enough free time this summer, she __________ Spanish lessons.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "will take",
            "B": "would take",
            "C": "took",
            "D": "has taken"
        },
        "dapAnDung": "B",
        "giaiThich": "Điều kiện loại 2: Mệnh đề chính có cấu trúc \"would + V-inf\"."
    },
    {
        "id": 43,
        "noiDung": "You can borrow my camera as long as you __________ good care of it.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "take",
            "B": "will take",
            "C": "took",
            "D": "would take"
        },
        "dapAnDung": "A",
        "giaiThich": "\"As long as\" (miễn là) đóng vai trò như liên từ điều kiện If loại 1, đi với thì Hiện tại đơn."
    },
    {
        "id": 44,
        "noiDung": "If I won a million dollars in the lottery, I __________ a dream house for my parents.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "will buy",
            "B": "would buy",
            "C": "bought",
            "D": "buy"
        },
        "dapAnDung": "B",
        "giaiThich": "Giả định sự việc khó xảy ra ở hiện tại/tương lai (loại 2): would buy."
    },
    {
        "id": 45,
        "noiDung": "If he spoke fluent German, he __________ apply for that engineering job in Munich.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "could",
            "B": "can",
            "C": "will",
            "D": "shall"
        },
        "dapAnDung": "A",
        "giaiThich": "\"Could + V-inf\" được dùng trong câu điều kiện loại 2 để diễn tả khả năng có thể làm gì nếu điều kiện thỏa mãn."
    },
    {
        "id": 46,
        "noiDung": "Provided that you __________ the assignment by Friday, you will receive full credit.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "submit",
            "B": "will submit",
            "C": "submitted",
            "D": "would submit"
        },
        "dapAnDung": "A",
        "giaiThich": "\"Provided that\" (với điều kiện là) đi kèm thì Hiện tại đơn ở vế điều kiện."
    },
    {
        "id": 47,
        "noiDung": "I __________ you with the project if I didn't have so much work of my own.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "would help",
            "B": "will help",
            "C": "helped",
            "D": "have helped"
        },
        "dapAnDung": "A",
        "giaiThich": "Điều kiện loại 2: Mệnh đề chính \"would help\" kết hợp với mệnh đề if phủ định \"didn't have\"."
    },
    {
        "id": 48,
        "noiDung": "Take an umbrella with you in case it __________ later this afternoon.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "rains",
            "B": "will rain",
            "C": "rained",
            "D": "would rain"
        },
        "dapAnDung": "A",
        "giaiThich": "\"In case\" (phòng khi) đi với thì Hiện tại đơn chỉ tình huống phòng ngừa trong tương lai."
    },
    {
        "id": 49,
        "noiDung": "If we lived closer to the beach, we __________ swimming every morning.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "would go",
            "B": "will go",
            "C": "went",
            "D": "go"
        },
        "dapAnDung": "A",
        "giaiThich": "Điều kiện loại 2 giả định về nơi cư trú trái thực tế ở hiện tại: would go."
    },
    {
        "id": 50,
        "noiDung": "What would you do if you __________ an alien spaceship landing in your backyard?",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "saw",
            "B": "see",
            "C": "will see",
            "D": "have seen"
        },
        "dapAnDung": "A",
        "giaiThich": "Tình huống giả định loại 2: mệnh đề If dùng thì Quá khứ đơn (\"saw\")."
    },
    {
        "id": 51,
        "noiDung": "In formal English, the subjunctive \"were\" is preferred over \"was\" for all subjects in Type 2 conditionals.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Trong văn phong học thuật chuẩn, \"were\" dùng cho mọi ngôi (I were, he were, it were) ở điều kiện loại 2."
    },
    {
        "id": 52,
        "noiDung": "The expression \"If I were you\" is commonly used to give friendly advice.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. \"If I were you, I would...\" là mẫu câu kinh điển đưa ra lời khuyên."
    },
    {
        "id": 53,
        "noiDung": "\"As long as\" and \"provided that\" mean the opposite of \"if\".",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "B",
        "giaiThich": "Sai. \"As long as\" và \"provided that\" mang nghĩa \"miễn là / với điều kiện là\", đồng nghĩa với \"if\"."
    },
    {
        "id": 54,
        "noiDung": "Type 2 conditionals talk about real, highly probable events happening tomorrow.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "B",
        "giaiThich": "Sai. Loại 2 nói về sự việc giả định, không có thật hoặc khó xảy ra ở hiện tại/tương lai."
    },
    {
        "id": 55,
        "noiDung": "We can use \"could\" or \"might\" instead of \"would\" in the main clause of Type 2 conditionals.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Could chỉ khả năng, Might chỉ mức độ khả dĩ có thể thay thế cho would."
    },
    {
        "id": 56,
        "noiDung": "In the sentence \"Take a map in case you get lost\", \"in case\" expresses a precaution.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. \"In case\" dùng để chuẩn bị phòng ngừa một sự cố có thể xảy ra."
    },
    {
        "id": 57,
        "noiDung": "Which sentences represent valid Type 2 conditional sentences (unreal present)? (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "If I had wings, I would fly around the world.",
            "B": "If he knew the truth, he would tell us.",
            "C": "If it freezes tonight, the road will be slippery.",
            "D": "If she were taller, she could join the basketball team."
        },
        "dapAnDung": [
            "A",
            "B",
            "D"
        ],
        "giaiThich": "A, B, D là điều kiện loại 2 giả định hiện tại. C là điều kiện loại 1 thực tế."
    },
    {
        "id": 58,
        "noiDung": "Select all conjunctions that can introduce a condition instead of \"if\": (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "Provided that",
            "B": "As long as",
            "C": "On condition that",
            "D": "Because of"
        },
        "dapAnDung": [
            "A",
            "B",
            "C"
        ],
        "giaiThich": "Provided that, As long as, On condition that đều đặt điều kiện. \"Because of\" chỉ nguyên nhân."
    },
    {
        "id": 59,
        "noiDung": "Which sentences correctly use modal verbs in conditional clauses? (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "If you won the prize, what would you spend it on?",
            "B": "If I were rich, I might purchase an island.",
            "C": "If she practiced more, she could play the piano beautifully.",
            "D": "If you would win, you could buy a house."
        },
        "dapAnDung": [
            "A",
            "B",
            "C"
        ],
        "giaiThich": "A, B, C đúng chuẩn loại 2. D sai vì không dùng \"would win\" trong mệnh đề If."
    },
    {
        "id": 60,
        "noiDung": "Select all sentences with grammatically sound uses of \"in case\": (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "Keep some cash in case credit cards are not accepted.",
            "B": "I wrote down his number in case I forgot it.",
            "C": "In case of emergency, press the alarm button.",
            "D": "I will call you in case if I need help."
        },
        "dapAnDung": [
            "A",
            "B",
            "C"
        ],
        "giaiThich": "A, B, C đúng cấu trúc phòng ngừa. D sai vì thừa chữ \"if\" (\"in case if\")."
    },
    {
        "id": 61,
        "noiDung": "If she had studied more diligently for the exam, she __________ with honors last semester.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "would pass",
            "B": "would have passed",
            "C": "will pass",
            "D": "passed"
        },
        "dapAnDung": "B",
        "giaiThich": "Câu điều kiện loại 3 giả định điều trái thực tế trong quá khứ: If + S + had V3/ed, S + would have V3/ed."
    },
    {
        "id": 62,
        "noiDung": "If I had invested in that tech startup five years ago, I __________ wealthy today.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "would be",
            "B": "would have been",
            "C": "will be",
            "D": "am"
        },
        "dapAnDung": "A",
        "giaiThich": "Câu điều kiện hỗn hợp (Mixed conditional: loại 3 + 2): Điều kiện quá khứ (\"had invested\") dẫn đến kết quả ở hiện tại (\"would be today\")."
    },
    {
        "id": 63,
        "noiDung": "__________ he known about the hazardous road conditions, he would not have driven late at night.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "Had",
            "B": "Should",
            "C": "Were",
            "D": "Unless"
        },
        "dapAnDung": "A",
        "giaiThich": "Đảo ngữ câu điều kiện loại 3: \"Had + S + V3/ed, S + would have V3/ed\"."
    },
    {
        "id": 64,
        "noiDung": "If the paramedics __________ so promptly, the patient might not have survived the cardiac arrest.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "hadn't arrived",
            "B": "didn't arrive",
            "C": "wouldn't arrive",
            "D": "haven't arrived"
        },
        "dapAnDung": "A",
        "giaiThich": "Điều kiện loại 3 trong quá khứ: If + had not + V3/ed."
    },
    {
        "id": 65,
        "noiDung": "Provided that all environmental regulations __________ adhered to, the plant will receive its operating permit.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "are",
            "B": "will be",
            "C": "were",
            "D": "would be"
        },
        "dapAnDung": "A",
        "giaiThich": "\"Provided that\" kết hợp thể bị động thì Hiện tại đơn: are adhered to."
    },
    {
        "id": 66,
        "noiDung": "If you had listened to my financial advice, you __________ in such deep debt right now.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "wouldn't be",
            "B": "wouldn't have been",
            "C": "won't be",
            "D": "aren't"
        },
        "dapAnDung": "A",
        "giaiThich": "Điều kiện hỗn hợp: Quá khứ (\"had listened\") tác động đến thực trạng hiện tại (\"right now\" => wouldn't be)."
    },
    {
        "id": 67,
        "noiDung": "__________ you require any additional documentation, please notify our department immediately.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "Should",
            "B": "Were",
            "C": "Had",
            "D": "If"
        },
        "dapAnDung": "A",
        "giaiThich": "Đảo ngữ câu điều kiện loại 1 mang văn phong trang trọng: \"Should + S + V-inf...\"."
    },
    {
        "id": 68,
        "noiDung": "They would have completed the construction on schedule but for the unforeseen __________.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "delays",
            "B": "delayed",
            "C": "delaying",
            "D": "delay"
        },
        "dapAnDung": "A",
        "giaiThich": "\"But for + Noun phrase\" mang nghĩa \"Nếu không vì...\". Cần danh từ số nhiều \"delays\"."
    },
    {
        "id": 69,
        "noiDung": "If she were more organized in general, she __________ her passport before the international flight.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "wouldn't have misplaced",
            "B": "wouldn't misplace",
            "C": "won't misplace",
            "D": "didn't misplace"
        },
        "dapAnDung": "A",
        "giaiThich": "Điều kiện hỗn hợp (Tính cách thường trực loại 2 -> Kết quả quá khứ loại 3): would not have misplaced."
    },
    {
        "id": 70,
        "noiDung": "We agreed to sign the contract on condition that the delivery date __________ strictly guaranteed.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "was",
            "B": "will be",
            "C": "is",
            "D": "has been"
        },
        "dapAnDung": "A",
        "giaiThich": "Sự phối thì trong quá khứ (\"agreed to sign\"): on condition that + S + was guaranteed."
    },
    {
        "id": 71,
        "noiDung": "Third conditional sentences talk about hypothetical situations and outcomes in the past that never occurred.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Câu điều kiện loại 3 giả định điều trái ngược hoàn toàn với những gì đã diễn ra trong quá khứ."
    },
    {
        "id": 72,
        "noiDung": "The inversion structure for Type 1 conditionals uses \"Should + Subject + V-infinitive\".",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Đảo ngữ loại 1: Should + S + V-inf (ví dụ: Should you need any help...)."
    },
    {
        "id": 73,
        "noiDung": "The sentence \"If I would have known, I would have told you\" is considered standard formal English.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "B",
        "giaiThich": "Sai. Trong tiếng Anh chuẩn, mệnh đề If loại 3 dùng \"had known\", tuyệt đối không dùng \"would have known\"."
    },
    {
        "id": 74,
        "noiDung": "Mixed conditionals can combine a past hypothetical cause with a present result.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Câu điều kiện hỗn hợp 3-2: If had V3 (quá khứ), S + would + V-inf (hiện tại)."
    },
    {
        "id": 75,
        "noiDung": "The phrase \"But for + Noun phrase\" can replace an if-clause in Type 3 conditionals.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. \"But for your help\" (= If it hadn't been for your help) mang nghĩa \"Nếu không có...\"."
    },
    {
        "id": 76,
        "noiDung": "We can use \"even if\" to state that a condition will not alter the eventual outcome.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. \"Even if\" (ngay cả khi / dẫu cho) nhấn mạnh kết quả không bị thay đổi bởi điều kiện."
    },
    {
        "id": 77,
        "noiDung": "Which of the following are grammatically correct conditional inversion sentences? (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "Should you require further information, please contact us.",
            "B": "Had she listened to the warning, she would have been safe.",
            "C": "Were I in your shoes, I would take the offer.",
            "D": "Will you call me, I will pick you up."
        },
        "dapAnDung": [
            "A",
            "B",
            "C"
        ],
        "giaiThich": "A (đảo ngữ loại 1), B (đảo ngữ loại 3), C (đảo ngữ loại 2) đều chính xác. D sai cấu trúc đảo ngữ."
    },
    {
        "id": 78,
        "noiDung": "Select all sentences that correctly illustrate mixed conditionals: (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "If I hadn't broken my leg last month, I would participate in today's race.",
            "B": "If he had learned French in school, he could translate this article now.",
            "C": "If you heat water, it boils at 100°C.",
            "D": "If she were more punctual, she wouldn't have missed the morning flight."
        },
        "dapAnDung": [
            "A",
            "B",
            "D"
        ],
        "giaiThich": "A, B (quá khứ -> hiện tại) và D (bản chất hiện tại -> kết quả quá khứ) là câu hỗn hợp. C là loại 0."
    },
    {
        "id": 79,
        "noiDung": "Which sentences represent valid Type 3 conditional sentences (unreal past)? (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "If they had left earlier, they would not have missed the connecting flight.",
            "B": "If we had booked tickets in advance, we would have saved 30%.",
            "C": "If you had touched the pan, you would burn your fingers today.",
            "D": "She would have accepted the proposal if he had asked her."
        },
        "dapAnDung": [
            "A",
            "B",
            "D"
        ],
        "giaiThich": "A, B, D là câu điều kiện loại 3 chuẩn. C là hỗn hợp chưa chuẩn ngữ cảnh."
    },
    {
        "id": 80,
        "noiDung": "Select all expressions that mean \"if it were not for\" or \"without\": (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "But for",
            "B": "Without",
            "C": "Had it not been for",
            "D": "Due to"
        },
        "dapAnDung": [
            "A",
            "B",
            "C"
        ],
        "giaiThich": "But for, Without, Had it not been for đều mang nghĩa \"nếu không nhờ có...\". Due to nghĩa là \"do/bởi vì\"."
    },
    {
        "id": 81,
        "noiDung": "__________ it not for your timely financial intervention, our enterprise would have declared bankruptcy last quarter.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "Had it been",
            "B": "Had",
            "C": "Were",
            "D": "Should"
        },
        "dapAnDung": "B",
        "giaiThich": "Cấu trúc đảo ngữ điều kiện loại 3: \"Had it not been for + Noun, S + would have V3/ed\" (Nếu không nhờ có...)."
    },
    {
        "id": 82,
        "noiDung": "Were the board __________ to authorize the acquisition, our market share would double instantaneously.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "to agree",
            "B": "agreed",
            "C": "agree",
            "D": "had agreed"
        },
        "dapAnDung": "A",
        "giaiThich": "Đảo ngữ câu điều kiện loại 2 với động từ thường: \"Were + Subject + to-infinitive\"."
    },
    {
        "id": 83,
        "noiDung": "Should any discrepancies __________ during the external audit, an exhaustive inquiry will be initiated immediately.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "arise",
            "B": "arises",
            "C": "arose",
            "D": "arisen"
        },
        "dapAnDung": "A",
        "giaiThich": "Đảo ngữ loại 1: \"Should + S + V(nguyên thể không chia)\". Động từ nguyên thể là \"arise\"."
    },
    {
        "id": 84,
        "noiDung": "__________ for the tireless dedication of the surgical staff, the patient would certainly have succumbed to the trauma.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "But",
            "B": "Unless",
            "C": "Except",
            "D": "Without that"
        },
        "dapAnDung": "A",
        "giaiThich": "\"But for + Noun phrase\" thay thế cho mệnh đề If phủ định trong văn phong học thuật cao cấp."
    },
    {
        "id": 85,
        "noiDung": "Were it not __________ your persistent advocacy, this legislative reform would never have passed the parliamentary committee.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "for",
            "B": "with",
            "C": "about",
            "D": "by"
        },
        "dapAnDung": "A",
        "giaiThich": "Cấu trúc đảo ngữ loại 2: \"Were it not for + Noun\" (Nếu không có sự ủng hộ kiên trì của bạn...)."
    },
    {
        "id": 86,
        "noiDung": "The agreement will remain binding on condition that all confidential trade secrets __________ preserved perpetually.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "be",
            "B": "are being",
            "C": "were",
            "D": "would be"
        },
        "dapAnDung": "A",
        "giaiThich": "Cấu trúc giả định thức (Subjunctive mood) trong văn bản pháp lý: \"on condition that + S + (should) be preserved\"."
    },
    {
        "id": 87,
        "noiDung": "Had the regulatory authorities acted more vigilantly, the widespread financial crisis __________ averted.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "might have been",
            "B": "might be",
            "C": "will have been",
            "D": "had been"
        },
        "dapAnDung": "A",
        "giaiThich": "Đảo ngữ loại 3 với thể bị động của modal verb: \"might have been averted\"."
    },
    {
        "id": 88,
        "noiDung": "Even __________ the economic projections to materialize precisely, structural unemployment would still pose a severe threat.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "were",
            "B": "should",
            "C": "had",
            "D": "if"
        },
        "dapAnDung": "A",
        "giaiThich": "Cấu trúc đảo ngữ nâng cao: \"Even were + S + to-inf\" (Ngay cả khi các dự báo có xảy ra đi chăng nữa...)."
    },
    {
        "id": 89,
        "noiDung": "Provided that no unforeseen geopolitical tensions __________ the supply chain, production targets will be surpassed.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "disrupt",
            "B": "disrupts",
            "C": "disrupted",
            "D": "will disrupt"
        },
        "dapAnDung": "A",
        "giaiThich": "Chủ ngữ số nhiều \"geopolitical tensions\" đi với động từ nguyên thể \"disrupt\" trong mệnh đề điều kiện."
    },
    {
        "id": 90,
        "noiDung": "Had we not overhauled our cybersecurity protocols last year, our servers __________ vulnerable to malware right now.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "would remain",
            "B": "would have remained",
            "C": "will remain",
            "D": "remained"
        },
        "dapAnDung": "A",
        "giaiThich": "Đảo ngữ kết hợp câu điều kiện hỗn hợp (quá khứ \"Had we not overhauled\" dẫn đến kết quả hiện tại \"would remain right now\")."
    },
    {
        "id": 91,
        "noiDung": "The inversion for Type 2 conditionals with regular verbs is formed using \"Were + Subject + to-infinitive\".",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Đảo ngữ loại 2 động từ thường: \"Were + S + to V\" (ví dụ: Were they to discover the truth...)."
    },
    {
        "id": 92,
        "noiDung": "In formal conditional inversion, \"not\" is never contracted with \"Had\" or \"Were\" (e.g., we say \"Had we not\" instead of \"Hadn't we\").",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Trong văn phong đảo ngữ trang trọng, không viết tắt dạng phủ định (Had we not, Were it not)."
    },
    {
        "id": 93,
        "noiDung": "The phrase \"Had it not been for\" is identical in meaning to \"Were it not for\" and can be used interchangeably in all tenses.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "B",
        "giaiThich": "Sai. \"Had it not been for\" dùng cho điều kiện quá khứ (loại 3), còn \"Were it not for\" dùng cho hiện tại (loại 2)."
    },
    {
        "id": 94,
        "noiDung": "The subjunctive construction \"on condition that S + (should) be + V3\" is frequently found in legal and commercial contracts.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Cấu trúc giả định thức mang tính ràng buộc pháp lý cao trong hợp đồng kinh tế."
    },
    {
        "id": 95,
        "noiDung": "In conditional sentences, \"Supposing\" or \"Imagine\" can replace \"if\" to invite contemplation of hypothetical scenarios.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. \"Supposing (that) you were offered the post, would you accept it?\" là cách diễn đạt giả định tình huống."
    },
    {
        "id": 96,
        "noiDung": "An inversion with \"Should\" can only be used with past tense verbs.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "B",
        "giaiThich": "Sai. Đảo ngữ với \"Should\" dùng cho câu điều kiện loại 1 (hiện tại/tương lai) và luôn đi kèm động từ nguyên thể."
    },
    {
        "id": 97,
        "noiDung": "Which sentences illustrate correct advanced inversion of conditional sentences? (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "Were the company to expand into emerging markets, substantial capital would be required.",
            "B": "Had the warning sirens sounded, hundreds of casualties would have been prevented.",
            "C": "Should any passenger require special assistance, our cabin crew will assist immediately.",
            "D": "Did the manager know about the issue, he would intervene."
        },
        "dapAnDung": [
            "A",
            "B",
            "C"
        ],
        "giaiThich": "A (đảo ngữ loại 2 với to-V), B (đảo ngữ loại 3), C (đảo ngữ loại 1) đều chuẩn. D sai vì tiếng Anh không đảo ngữ bằng \"Did\"."
    },
    {
        "id": 98,
        "noiDung": "Select all sentences demonstrating grammatically accurate conditional negative inversions: (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "Had it not been for the whistleblower's courage, the corruption would never have been exposed.",
            "B": "Were it not for your ongoing mentorship, I would struggle in this executive role.",
            "C": "Hadn't it been for his guidance, we would have failed.",
            "D": "Had they not acted decisively, the firm would have faced catastrophic insolvency."
        },
        "dapAnDung": [
            "A",
            "B",
            "D"
        ],
        "giaiThich": "A, B, D chuẩn ngữ pháp trang trọng. C sai vì không được viết tắt \"Hadn't it been\"."
    },
    {
        "id": 99,
        "noiDung": "Which sentences correctly employ mixed conditional structures across timeframes? (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "If the government had enacted climate policies a decade ago, our carbon footprint would be negligible today.",
            "B": "Had she not pursued medical school, she would not be chief of surgery today.",
            "C": "If he were less stubborn in general, he would have accepted the compromise during yesterday's talks.",
            "D": "If it rains yesterday, we would stay home today."
        },
        "dapAnDung": [
            "A",
            "B",
            "C"
        ],
        "giaiThich": "A, B (quá khứ -> hiện tại) và C (tính cách hiện tại -> hành vi quá khứ) là câu hỗn hợp chuẩn. D vô nghĩa và sai ngữ pháp."
    },
    {
        "id": 100,
        "noiDung": "Select all expressions that appropriately introduce formal hypothetical conditions: (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "On the condition that",
            "B": "Supposing that",
            "C": "With the proviso that",
            "D": "Regardless whether"
        },
        "dapAnDung": [
            "A",
            "B",
            "C"
        ],
        "giaiThich": "\"On the condition that\", \"Supposing that\", và \"With the proviso that\" (với điều khoản quy định rằng) đều dùng để đặt điều kiện giả định. D dùng chỉ sự bất chấp."
    }
]
};
