import { CurriculumTopicBank } from './types';

export const ENTERTAINMENT_BANK: CurriculumTopicBank = {
  key: 'ENTERTAINMENT',
  tenChuDe: 'Điện Ảnh, Âm Nhạc & Giải Trí (Entertainment & Media)',
  aliases: [
    "điện ảnh",
    "dien anh",
    "âm nhạc",
    "am nhac",
    "giải trí",
    "giai tri",
    "entertainment",
    "media",
    "movie",
    "film",
    "music",
    "cinema",
    "phim ảnh"
],
  questions: [
    {
        "id": 1,
        "noiDung": "We went to the local __________ to watch the new animated superhero film.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "cinema",
            "B": "hospital",
            "C": "station",
            "D": "airport"
        },
        "dapAnDung": "cinema",
        "giaiThich": "\"Cinema\" là rạp chiếu phim."
    },
    {
        "id": 2,
        "noiDung": "My favorite __________ plays the lead hero in the new comedy movie.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "actor",
            "B": "printer",
            "C": "keyboard",
            "D": "passport"
        },
        "dapAnDung": "actor",
        "giaiThich": "\"Actor\" là nam diễn viên."
    },
    {
        "id": 3,
        "noiDung": "She loves listening to cheerful acoustic pop __________ on her headphones.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "music",
            "B": "cinema",
            "C": "ticket",
            "D": "screen"
        },
        "dapAnDung": "music",
        "giaiThich": "\"Pop music\" là nhạc pop."
    },
    {
        "id": 4,
        "noiDung": "How much is a student admission __________ for the evening movie screening?",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "ticket",
            "B": "actor",
            "C": "song",
            "D": "music"
        },
        "dapAnDung": "ticket",
        "giaiThich": "\"Movie ticket\" là vé xem phim."
    },
    {
        "id": 5,
        "noiDung": "He plays the classical __________ very well in the school brass band.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "guitar",
            "B": "cinema",
            "C": "movie",
            "D": "ticket"
        },
        "dapAnDung": "guitar",
        "giaiThich": "\"Play the guitar\" là chơi đàn ghi-ta."
    },
    {
        "id": 6,
        "noiDung": "The comedy movie was hilarious, and the whole audience began to __________ loudly.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "laugh",
            "B": "cry",
            "C": "sleep",
            "D": "study"
        },
        "dapAnDung": "laugh",
        "giaiThich": "Phim hài khiến khán giả cười lớn (laugh)."
    },
    {
        "id": 7,
        "noiDung": "My sister enjoys singing modern pop __________ with her friends at the weekend.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "songs",
            "B": "actors",
            "C": "cinemas",
            "D": "tickets"
        },
        "dapAnDung": "songs",
        "giaiThich": "\"Sing songs\" là hát các bài hát."
    },
    {
        "id": 8,
        "noiDung": "We bought salted popcorn and fruit soda at the cinema snack __________.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "counter",
            "B": "song",
            "C": "actor",
            "D": "guitar"
        },
        "dapAnDung": "counter",
        "giaiThich": "Quầy bán đồ ăn vặt rạp chiếu phim (snack counter)."
    },
    {
        "id": 9,
        "noiDung": "The action __________ had thrilling car chases and explosive stunt scenes.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "movie",
            "B": "guitar",
            "C": "actor",
            "D": "music"
        },
        "dapAnDung": "movie",
        "giaiThich": "\"Action movie\" là phim hành động."
    },
    {
        "id": 10,
        "noiDung": "I love watching funny animal cartoons on my tablet __________ evening.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "every",
            "B": "never",
            "C": "all",
            "D": "ever"
        },
        "dapAnDung": "every",
        "giaiThich": "Xem hoạt hình mỗi tối: every evening."
    },
    {
        "id": 11,
        "noiDung": "A \"cinema\" is a venue where motion pictures are projected onto a large screen for audiences.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Rạp chiếu phim là nơi trình chiếu các tác phẩm điện ảnh."
    },
    {
        "id": 12,
        "noiDung": "An \"actor\" or \"actress\" portrays a dramatic character in theatre or film.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Diễn viên hóa thân vào các nhân vật trong kịch và phim ảnh."
    },
    {
        "id": 13,
        "noiDung": "A \"guitar\" is a brass musical instrument you blow air through to produce sound.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "B",
        "giaiThich": "Sai. Đàn ghi-ta là nhạc cụ dây (string instrument), không phải kèn thổi khí."
    },
    {
        "id": 14,
        "noiDung": "\"Comedy\" films are designed specifically to make audiences laugh and feel cheerful.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Phim hài được sản xuất để đem lại tiếng cười vui vẻ."
    },
    {
        "id": 15,
        "noiDung": "Popcorn is a traditional snack commonly consumed in modern movie theaters.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Bắp rang bơ là món ăn vặt truyền thống tại rạp chiếu phim."
    },
    {
        "id": 16,
        "noiDung": "Animated films use hand-drawn art or CGI to create moving images.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Phim hoạt hình sử dụng tranh vẽ tay hoặc kỹ thuật đồ họa vi tính (CGI)."
    },
    {
        "id": 17,
        "noiDung": "Select all popular entertainment genres for movies and films: (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "action adventure",
            "B": "romantic comedy",
            "C": "tax audit spreadsheet",
            "D": "animated cartoon"
        },
        "dapAnDung": [
            "A",
            "B",
            "D"
        ],
        "giaiThich": "Phim hành động, hài lãng mạn, hoạt hình là các thể loại điện ảnh."
    },
    {
        "id": 18,
        "noiDung": "Which instruments belong to the musical family: (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "acoustic guitar",
            "B": "piano",
            "C": "violin",
            "D": "desktop computer mouse"
        },
        "dapAnDung": [
            "A",
            "B",
            "C"
        ],
        "giaiThich": "Ghi-ta, piano, vĩ cầm là các nhạc cụ âm nhạc."
    },
    {
        "id": 19,
        "noiDung": "Select all professions within the performing arts and entertainment industry: (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "film actor",
            "B": "pop singer",
            "C": "orchestra musician",
            "D": "airline customs officer"
        },
        "dapAnDung": [
            "A",
            "B",
            "C"
        ],
        "giaiThich": "Diễn viên, ca sĩ, nhạc công là các ngành nghề giải trí nghệ thuật."
    },
    {
        "id": 20,
        "noiDung": "Identify all things commonly found in a cinema theater: (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "A1",
        "luaChon": {
            "A": "projection screen",
            "B": "cushioned seats",
            "C": "swimming pool",
            "D": "sound system"
        },
        "dapAnDung": [
            "A",
            "B",
            "D"
        ],
        "giaiThich": "Màn chiếu, ghế đệm, hệ thống âm thanh là trang thiết bị rạp chiếu phim."
    },
    {
        "id": 21,
        "noiDung": "The rock band announced an eight-city live stadium __________ across Europe.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "tour",
            "B": "ticket",
            "C": "actor",
            "D": "screen"
        },
        "dapAnDung": "tour",
        "giaiThich": "\"Concert tour\" là chuyến lưu diễn vòng quanh các thành phố."
    },
    {
        "id": 22,
        "noiDung": "The movie received rave __________ from critics for its gripping storyline.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "reviews",
            "B": "tickets",
            "C": "actors",
            "D": "instruments"
        },
        "dapAnDung": "reviews",
        "giaiThich": "\"Film reviews\" là các bài phê bình, đánh giá phim."
    },
    {
        "id": 23,
        "noiDung": "Thousands of enthusiastic music fans attended the three-day summer music __________.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "festival",
            "B": "counter",
            "C": "screen",
            "D": "review"
        },
        "dapAnDung": "festival",
        "giaiThich": "\"Music festival\" là lễ hội âm nhạc."
    },
    {
        "id": 24,
        "noiDung": "The orchestra __________ conducted the classical symphony with emotional elegance.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "conductor",
            "B": "audience",
            "C": "review",
            "D": "ticket"
        },
        "dapAnDung": "conductor",
        "giaiThich": "\"Orchestra conductor\" là nhạc trưởng chỉ huy dàn nhạc."
    },
    {
        "id": 25,
        "noiDung": "The movie features spectacular computer-generated visual __________ in every battle.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "effects",
            "B": "actors",
            "C": "tickets",
            "D": "cinemas"
        },
        "dapAnDung": "effects",
        "giaiThich": "\"Visual effects (VFX)\" là hiệu ứng kỹ xảo hình ảnh."
    },
    {
        "id": 26,
        "noiDung": "Her debut studio album climbed to number one on the national music __________.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "charts",
            "B": "reviews",
            "C": "counters",
            "D": "screens"
        },
        "dapAnDung": "charts",
        "giaiThich": "\"Music charts\" là bảng xếp hạng âm nhạc."
    },
    {
        "id": 27,
        "noiDung": "The stage actor gave an electrifying theatrical __________ on opening night.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "performance",
            "B": "review",
            "C": "ticket",
            "D": "instrument"
        },
        "dapAnDung": "performance",
        "giaiThich": "\"Theatrical performance\" là buổi biểu diễn nhạc kịch xuất sắc."
    },
    {
        "id": 28,
        "noiDung": "We bought tickets for the live jazz concert at the municipal __________ hall.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "concert",
            "B": "cinema",
            "C": "actor",
            "D": "review"
        },
        "dapAnDung": "concert",
        "giaiThich": "\"Concert hall\" là phòng hòa nhạc."
    },
    {
        "id": 29,
        "noiDung": "The villain in the thriller film had a sinister, mysterious __________.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "character",
            "B": "ticket",
            "C": "effect",
            "D": "instrument"
        },
        "dapAnDung": "character",
        "giaiThich": "\"Character\" là nhân vật trong phim."
    },
    {
        "id": 30,
        "noiDung": "The film director held auditions to cast the lead role in the romantic __________.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "drama",
            "B": "ticket",
            "C": "chart",
            "D": "counter"
        },
        "dapAnDung": "drama",
        "giaiThich": "\"Romantic drama\" là phim tâm lý tình cảm."
    },
    {
        "id": 31,
        "noiDung": "A \"music festival\" is a community event oriented towards live performances of singing and instrument-playing.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Lễ hội âm nhạc là chuỗi biểu diễn trực tiếp."
    },
    {
        "id": 32,
        "noiDung": "Visual effects (VFX) in films are always created using real physical explosions without computers.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "B",
        "giaiThich": "Sai. Kỹ xảo hình ảnh hiện đại sử dụng phần mềm đồ họa vi tính (CGI) rất tinh vi."
    },
    {
        "id": 33,
        "noiDung": "An \"orchestra conductor\" unifies performers, sets the tempo, and shapes the sound of the musical ensemble.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Nhạc trưởng điều phối nhịp độ và sắc thái biểu cảm của dàn nhạc."
    },
    {
        "id": 34,
        "noiDung": "Music charts track the relative commercial popularity of musical recordings over a given period.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Bảng xếp hạng âm nhạc đo lường độ ăn khách và lượt nghe của bài hát."
    },
    {
        "id": 35,
        "noiDung": "Film reviews written by professional critics can influence box office success.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Đánh giá của các nhà phê bình có tác động lớn đến doanh thu phòng vé."
    },
    {
        "id": 36,
        "noiDung": "A musical \"tour\" is when musicians stay in a studio and refuse to perform for live crowds.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "B",
        "giaiThich": "Sai. Tour lưu diễn là đi biểu diễn trực tiếp qua nhiều thành phố."
    },
    {
        "id": 37,
        "noiDung": "Select all artistic elements of cinematic productions: (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "visual effects (VFX)",
            "B": "original screenplay script",
            "C": "dramatic character development",
            "D": "tax deductible receipts"
        },
        "dapAnDung": [
            "A",
            "B",
            "C"
        ],
        "giaiThich": "Kỹ xảo hình ảnh, kịch bản gốc, xây dựng nhân vật là các yếu tố điện ảnh."
    },
    {
        "id": 38,
        "noiDung": "Which professions contribute directly to live orchestral performances: (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "orchestra conductor",
            "B": "concertmaster violinist",
            "C": "popcorn vendor",
            "D": "symphony percussionist"
        },
        "dapAnDung": [
            "A",
            "B",
            "D"
        ],
        "giaiThich": "Nhạc trưởng, nghệ sĩ vĩ cầm chính, nhạc công gõ là thành phần dàn nhạc."
    },
    {
        "id": 39,
        "noiDung": "Select all musical genres: (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "classical symphony",
            "B": "traditional jazz",
            "C": "desktop keyboard",
            "D": "electronic rock"
        },
        "dapAnDung": [
            "A",
            "B",
            "D"
        ],
        "giaiThich": "Giao hưởng cổ điển, nhạc jazz, nhạc rock điện tử là các thể loại âm nhạc."
    },
    {
        "id": 40,
        "noiDung": "Identify all metrics evaluating the popularity of films and music: (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "A2",
        "luaChon": {
            "A": "box office ticket sales",
            "B": "music chart ranking",
            "C": "critical film reviews",
            "D": "cinema carpet color"
        },
        "dapAnDung": [
            "A",
            "B",
            "C"
        ],
        "giaiThich": "Doanh thu phòng vé, thứ hạng bảng xếp hạng, đánh giá phê bình đo lường mức độ ăn khách."
    },
    {
        "id": 41,
        "noiDung": "The psychological thriller captivated viewers with an astonishing plot __________ in the final scene.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "twist",
            "B": "chart",
            "C": "ticket",
            "D": "review"
        },
        "dapAnDung": "twist",
        "giaiThich": "\"Plot twist\" là bước ngoặt bất ngờ, đảo ngược tình tiết kịch bản."
    },
    {
        "id": 42,
        "noiDung": "The film won the Academy Award for Best Original __________ for its emotionally stirring musical score.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "Soundtrack",
            "B": "Review",
            "C": "Chart",
            "D": "Cinema"
        },
        "dapAnDung": "Soundtrack",
        "giaiThich": "\"Original Soundtrack (OST)\" là nhạc phim gốc."
    },
    {
        "id": 43,
        "noiDung": "Global video streaming __________ like Netflix have revolutionized the distribution of television drama.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "platforms",
            "B": "counters",
            "C": "tickets",
            "D": "conductors"
        },
        "dapAnDung": "platforms",
        "giaiThich": "\"Streaming platforms\" là các nền tảng phát video trực tuyến."
    },
    {
        "id": 44,
        "noiDung": "The director praised the director of photography for the film's breathtaking __________ and camera work.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "cinematography",
            "B": "soundtrack",
            "C": "twist",
            "D": "ticket"
        },
        "dapAnDung": "cinematography",
        "giaiThich": "\"Cinematography\" là nghệ thuật quay phim và góc máy điện ảnh."
    },
    {
        "id": 45,
        "noiDung": "The veteran actor was nominated for a prestigious lifetime achievement __________.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "award",
            "B": "review",
            "C": "twist",
            "D": "ticket"
        },
        "dapAnDung": "award",
        "giaiThich": "\"Nominated for an award\" là được đề cử giải thưởng cống hiến trọn đời."
    },
    {
        "id": 46,
        "noiDung": "The independent documentary shed light on the devastating environmental impacts of __________ mining.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "illegal",
            "B": "acoustic",
            "C": "musical",
            "D": "theatrical"
        },
        "dapAnDung": "illegal",
        "giaiThich": "Phim tài liệu độc lập phản ánh thực trạng khai khoáng trái phép."
    },
    {
        "id": 47,
        "noiDung": "Before commencing filming, the cast gathered for intensive script __________ and table reads.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "rehearsals",
            "B": "soundtracks",
            "C": "awards",
            "D": "charts"
        },
        "dapAnDung": "rehearsals",
        "giaiThich": "\"Script rehearsals\" là các buổi diễn tập đọc kịch bản."
    },
    {
        "id": 48,
        "noiDung": "The post-credits scene provided subtle hints regarding the forthcoming cinematic __________.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "sequel",
            "B": "prequel",
            "C": "soundtrack",
            "D": "twist"
        },
        "dapAnDung": "sequel",
        "giaiThich": "\"Sequel\" là phần phim tiếp theo (hậu truyện)."
    },
    {
        "id": 49,
        "noiDung": "The musical score was recorded live by a seventy-piece philharmonic __________.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "orchestra",
            "B": "platform",
            "C": "twist",
            "D": "review"
        },
        "dapAnDung": "orchestra",
        "giaiThich": "\"Philharmonic orchestra\" là dàn nhạc giao hưởng thính phòng."
    },
    {
        "id": 50,
        "noiDung": "Her breakthrough performance in the indie drama established her as a formidable leading __________.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "actress",
            "B": "soundtrack",
            "C": "cinematography",
            "D": "platform"
        },
        "dapAnDung": "actress",
        "giaiThich": "\"Leading actress\" là nữ diễn viên chính xuất sắc."
    },
    {
        "id": 51,
        "noiDung": "A \"plot twist\" is a radical, unexpected shift in the direction or outcome of the narrative storyline.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Plot twist là cú bẻ lái kịch bản gây bất ngờ cho khán giả."
    },
    {
        "id": 52,
        "noiDung": "\"Cinematography\" refers exclusively to the printing of paper movie tickets at concession stands.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "B",
        "giaiThich": "Sai. Cinematography là nghệ thuật quay phim, ánh sáng và bố cục khuôn hình điện ảnh."
    },
    {
        "id": 53,
        "noiDung": "A film \"sequel\" continues the narrative of a previous production, whereas a \"prequel\" depicts events preceding it.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Sequel là phần tiếp nối sau, prequel là phần tiền truyện."
    },
    {
        "id": 54,
        "noiDung": "Streaming platforms deliver video content over the internet on-demand without requiring physical DVDs.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Nền tảng xem phim trực tuyến cho phép xem tức thì qua mạng."
    },
    {
        "id": 55,
        "noiDung": "An \"original soundtrack\" (OST) consists of recorded music created specifically to accompany a film.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Nhạc phim gốc được sáng tác riêng để đồng hành cùng các thước phim."
    },
    {
        "id": 56,
        "noiDung": "Rehearsals are only necessary for sports players and are never conducted by theatrical actors.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "B",
        "giaiThich": "Sai. Diễn viên kịch nghệ và điện ảnh luôn phải tập dượt kịch bản (rehearsal) kỹ lưỡng."
    },
    {
        "id": 57,
        "noiDung": "Select all cinematic production terminology: (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "original soundtrack (OST)",
            "B": "cinematography & lighting",
            "C": "petty cash receipts",
            "D": "unexpected plot twist"
        },
        "dapAnDung": [
            "A",
            "B",
            "D"
        ],
        "giaiThich": "Nhạc phim, nghệ thuật quay phim, bước ngoặt kịch bản là thuật ngữ điện ảnh."
    },
    {
        "id": 58,
        "noiDung": "Which entertainment distribution channels are prominent in the digital era: (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "subscription video on demand (SVOD)",
            "B": "digital music streaming services",
            "C": "smoke signals",
            "D": "pigeon postal mail"
        },
        "dapAnDung": [
            "A",
            "B"
        ],
        "giaiThich": "Nền tảng xem phim theo gói (Netflix, Disney+) và nghe nhạc số (Spotify, Apple Music)."
    },
    {
        "id": 59,
        "noiDung": "Select all terms relating to theatrical and stage production: (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "cast dress rehearsal",
            "B": "leading role audition",
            "C": "subway train track",
            "D": "opening night ovation"
        },
        "dapAnDung": [
            "A",
            "B",
            "D"
        ],
        "giaiThich": "Tổng duyệt trang phục, tuyển chọn vai chính, tràng pháo tay đêm công chiếu."
    },
    {
        "id": 60,
        "noiDung": "Identify all categories commonly recognized in major film awards: (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "B1",
        "luaChon": {
            "A": "Best Original Screenplay",
            "B": "Best Director",
            "C": "Best Sound Editing",
            "D": "Best Popcorn Cooking"
        },
        "dapAnDung": [
            "A",
            "B",
            "C"
        ],
        "giaiThich": "Kịch bản gốc, đạo diễn xuất sắc, biên tập âm thanh là các hạng mục giải thưởng danh giá."
    },
    {
        "id": 61,
        "noiDung": "The blockbuster superhero flick shattered opening weekend box __________ records worldwide.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "office",
            "B": "counter",
            "C": "terminal",
            "D": "platform"
        },
        "dapAnDung": "office",
        "giaiThich": "\"Box office records\" là kỷ lục doanh thu phòng vé."
    },
    {
        "id": 62,
        "noiDung": "Unauthorized online streaming and peer-to-peer downloading constitute intellectual property __________.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "infringement",
            "B": "cinematography",
            "C": "soundtrack",
            "D": "rehearsal"
        },
        "dapAnDung": "infringement",
        "giaiThich": "\"Copyright / IP infringement\" là hành vi xâm phạm bản quyền sở hữu trí tuệ."
    },
    {
        "id": 63,
        "noiDung": "Independent filmmakers often struggle to secure adequate distribution and commercial __________.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "backing",
            "B": "review",
            "C": "soundtrack",
            "D": "twist"
        },
        "dapAnDung": "backing",
        "giaiThich": "\"Financial / commercial backing\" là nguồn vốn tài trợ tài chính."
    },
    {
        "id": 64,
        "noiDung": "The historical miniseries received critical acclaim for its rigorous period __________ and costume design.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "authenticity",
            "B": "infringement",
            "C": "twist",
            "D": "counter"
        },
        "dapAnDung": "authenticity",
        "giaiThich": "\"Period authenticity\" là độ chân thực lịch sử của bối cảnh và trang phục."
    },
    {
        "id": 65,
        "noiDung": "Film festivals provide an invaluable showcase for avant-garde, non-commercial __________ films.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "indie",
            "B": "blockbuster",
            "C": "box-office",
            "D": "franchise"
        },
        "dapAnDung": "indie",
        "giaiThich": "\"Indie films\" là phim độc lập sáng tạo ngoài hệ thống xưởng phim lớn."
    },
    {
        "id": 66,
        "noiDung": "The film studio launched an aggressive multi-million-dollar publicity __________ ahead of the summer release.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "blitz",
            "B": "twist",
            "C": "soundtrack",
            "D": "rehearsal"
        },
        "dapAnDung": "blitz",
        "giaiThich": "\"Publicity blitz / campaign\" là chiến dịch quảng bá rầm rộ."
    },
    {
        "id": 67,
        "noiDung": "Streaming services have disrupted traditional theatrical distribution windows, prompting legal __________.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "controversies",
            "B": "soundtracks",
            "C": "cinematographies",
            "D": "rehearsals"
        },
        "dapAnDung": "controversies",
        "giaiThich": "\"Legal controversies\" là các tranh cãi pháp lý nảy sinh."
    },
    {
        "id": 68,
        "noiDung": "The method actor underwent transformative physical conditioning to portray the tragic historical __________.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "figure",
            "B": "soundtrack",
            "C": "twist",
            "D": "ticket"
        },
        "dapAnDung": "figure",
        "giaiThich": "\"Historical figure\" là nhân vật lịch sử bi tráng."
    },
    {
        "id": 69,
        "noiDung": "The documentary used raw cinema verite archival footage to capture the political __________.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "turmoil",
            "B": "rehearsal",
            "C": "soundtrack",
            "D": "twist"
        },
        "dapAnDung": "turmoil",
        "giaiThich": "\"Political turmoil\" là sự hỗn loạn biến động chính trị."
    },
    {
        "id": 70,
        "noiDung": "The media conglomerate owns exclusive broadcasting rights for major international sporting __________.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "franchises",
            "B": "soundtracks",
            "C": "twists",
            "D": "cinemas"
        },
        "dapAnDung": "franchises",
        "giaiThich": "\"Sporting franchises / events\" là bản quyền phát sóng thương hiệu thể thao."
    },
    {
        "id": 71,
        "noiDung": "\"Box office\" earnings quantify the gross monetary revenue generated from cinema admission ticket sales.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Doanh thu phòng vé là tổng số tiền bán vé xem phim tại rạp."
    },
    {
        "id": 72,
        "noiDung": "Copyright infringement in the digital entertainment sector carries no statutory civil or criminal penalties.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "B",
        "giaiThich": "Sai. Xâm phạm bản quyền kỹ thuật số bị phạt hành chính và truy cứu hình sự rất nặng."
    },
    {
        "id": 73,
        "noiDung": "\"Method acting\" encourages performers to psychologically inhabit their characters to achieve heightened realism.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Phương pháp diễn xuất nhập tâm (method acting) đòi hỏi đồng cảm và sống cùng nhân vật."
    },
    {
        "id": 74,
        "noiDung": "Independent cinema relies exclusively on multi-billion-dollar Hollywood studio production budgets.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "B",
        "giaiThich": "Sai. Phim độc lập (indie) hoạt động ngoài hệ thống studio lớn và thường có kinh phí khiêm tốn."
    },
    {
        "id": 75,
        "noiDung": "Theatrical distribution windows dictate the duration a film plays exclusively in cinemas before home streaming.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Cửa sổ phát hành rạp quy định thời gian chiếu rạp độc quyền trước khi lên nền tảng số."
    },
    {
        "id": 76,
        "noiDung": "A media franchise is an intellectual property from which films, merchandise, and games are spun off.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Nhượng quyền thương mại truyền thông bao gồm phim ảnh, đồ chơi, trò chơi điện tử."
    },
    {
        "id": 77,
        "noiDung": "Select all concepts central to modern entertainment media economics: (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "global box office revenue",
            "B": "exclusive broadcasting rights",
            "C": "concession popcorn popping rate",
            "D": "intellectual property licensing"
        },
        "dapAnDung": [
            "A",
            "B",
            "D"
        ],
        "giaiThich": "Doanh thu phòng vé, bản quyền phát sóng, cấp phép sở hữu trí tuệ là cốt lõi kinh tế truyền thông."
    },
    {
        "id": 78,
        "noiDung": "Which challenges confront independent filmmakers and documentary producers: (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "securing independent financing and distribution",
            "B": "competing against studio blockbuster marketing budgets",
            "C": "protecting original screenplays against copyright piracy",
            "D": "having too many Oscars awards"
        },
        "dapAnDung": [
            "A",
            "B",
            "C"
        ],
        "giaiThich": "A, B, C là các thách thức lớn của các nhà làm phim độc lập."
    },
    {
        "id": 79,
        "noiDung": "Select all characteristics of method acting and rigorous performance preparation: (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "immersive psychological character study",
            "B": "transformative physical conditioning and dialect coaching",
            "C": "refusing to read the script",
            "D": "emotional recall and vulnerability"
        },
        "dapAnDung": [
            "A",
            "B",
            "D"
        ],
        "giaiThich": "Nghiên cứu tâm lý, tập giọng bản địa, biến đổi thể hình là đặc trưng diễn xuất nhập vai."
    },
    {
        "id": 80,
        "noiDung": "Identify all consequences of the streaming revolution on cinema: (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "B2",
        "luaChon": {
            "A": "shortening of theatrical exclusivity windows",
            "B": "democratization of on-demand global content consumption",
            "C": "complete worldwide elimination of movie screens",
            "D": "direct-to-streaming premier release strategies"
        },
        "dapAnDung": [
            "A",
            "B",
            "D"
        ],
        "giaiThich": "Rút ngắn thời gian chiếu rạp, xem phim theo yêu cầu, phát hành trực tiếp trên app."
    },
    {
        "id": 81,
        "noiDung": "The French New Wave was celebrated for its radical deconstruction of classical narrative __________.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "paradigms",
            "B": "tickets",
            "C": "box offices",
            "D": "soundtracks"
        },
        "dapAnDung": "paradigms",
        "giaiThich": "\"Deconstruction of narrative paradigms\" là giải cấu trúc các khuôn mẫu trần thuật kinh điển."
    },
    {
        "id": 82,
        "noiDung": "The avant-garde theatrical production explored the metaphysical alienation of modern post-industrial __________.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "societies",
            "B": "tickets",
            "C": "box offices",
            "D": "rehearsals"
        },
        "dapAnDung": "societies",
        "giaiThich": "Vở kịch tiên phong khám phá sự tha hóa siêu hình trong xã hội hậu công nghiệp."
    },
    {
        "id": 83,
        "noiDung": "Auteur theory posits that the film director serves as the paramount creative __________ of a cinematic work.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "visionary",
            "B": "soundtrack",
            "C": "infringement",
            "D": "twist"
        },
        "dapAnDung": "visionary",
        "giaiThich": "Thuyết tác giả (Auteur theory) coi đạo diễn là nhà tư tưởng sáng tạo tối thượng của bộ phim."
    },
    {
        "id": 84,
        "noiDung": "The documentary eschewed conventional voice-over commentary, relying instead on pure cinema __________ realism.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "verite",
            "B": "fiction",
            "C": "theatre",
            "D": "animation"
        },
        "dapAnDung": "verite",
        "giaiThich": "Điện ảnh chân thực (Cinema verite) ghi lại cuộc sống tự nhiên không dàn dựng."
    },
    {
        "id": 85,
        "noiDung": "Cultural theorists critique mass media entertainment for its role in manufacturing consumerist __________.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "hegemony",
            "B": "rehearsal",
            "C": "soundtrack",
            "D": "box office"
        },
        "dapAnDung": "hegemony",
        "giaiThich": "Bá quyền văn hóa tiêu dùng (consumerist hegemony) tạo ra bởi truyền thông đại chúng."
    },
    {
        "id": 86,
        "noiDung": "The film's visual palette employed chiaroscuro lighting to evoke psychological dread and moral __________.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "ambiguity",
            "B": "infringement",
            "C": "authenticity",
            "D": "ticket"
        },
        "dapAnDung": "ambiguity",
        "giaiThich": "Ánh sáng tương phản sáng-tối (chiaroscuro) khơi gợi sự mơ hồ về mặt đạo đức."
    },
    {
        "id": 87,
        "noiDung": "The festival jury awarded the Palme d'Or to a profoundly allegorical study of totalitarian __________.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "oppression",
            "B": "rehearsal",
            "C": "soundtrack",
            "D": "twist"
        },
        "dapAnDung": "oppression",
        "giaiThich": "Nghiên cứu mang tính ngụ ngôn về sự áp bức chuyên chế."
    },
    {
        "id": 88,
        "noiDung": "The post-modern pastiche interweaves divergent cinematic tropes to subvert spectator __________.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "expectations",
            "B": "tickets",
            "C": "box offices",
            "D": "soundtracks"
        },
        "dapAnDung": "expectations",
        "giaiThich": "Tác phẩm hậu hiện đại hòa trộn các thủ pháp nhằm lật đổ kỳ vọng của người xem."
    },
    {
        "id": 89,
        "noiDung": "The composer utilized atonal dissonances to underscore the protagonist's descending cognitive __________.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "entropy",
            "B": "rehearsal",
            "C": "infringement",
            "D": "soundtrack"
        },
        "dapAnDung": "entropy",
        "giaiThich": "Nghịch âm phi điệu tính phản ánh sự suy sụp hỗn loạn trong tâm trí nhân vật."
    },
    {
        "id": 90,
        "noiDung": "The academic monograph explores the cinematic representation of historical trauma and collective __________.",
        "loaiCauHoi": "SINGLE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "memory",
            "B": "ticket",
            "C": "soundtrack",
            "D": "counter"
        },
        "dapAnDung": "memory",
        "giaiThich": "Tái hiện điện ảnh về chấn thương lịch sử và ký ức tập thể (collective memory)."
    },
    {
        "id": 91,
        "noiDung": "\"Auteur theory\" views the film director as the primary author whose distinct personal style shapes the entire work.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Thuyết tác giả xem đạo diễn là người định hình toàn bộ phong cách tác phẩm điện ảnh."
    },
    {
        "id": 92,
        "noiDung": "\"Chiaroscuro\" in cinematography refers to the high-contrast treatment of light and dark shadows.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Chiaroscuro là kỹ thuật tương phản sáng tối mạnh mẽ mang đậm tính biểu cảm tâm lý."
    },
    {
        "id": 93,
        "noiDung": "\"Cinema verite\" mandates that all actors memorize rigidly artificial theatrical monologues on soundstages.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "B",
        "giaiThich": "Sai. Cinema verite theo đuổi chủ nghĩa chân thực tự nhiên, không diễn giả tạo trên phim trường."
    },
    {
        "id": 94,
        "noiDung": "A narrative \"pastiche\" deliberately imitates or collages various stylistic genres to comment on or celebrate them.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Pastiche là sự mô phỏng nghệ thuật kết hợp nhiều phong cách."
    },
    {
        "id": 95,
        "noiDung": "Atonal film scores rely exclusively on simple, cheerful nursery rhymes to create emotional comfort.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "B",
        "giaiThich": "Sai. Nhạc phim phi điệu tính (atonal) dùng các hợp âm nghịch để tạo căng thẳng, u ám, kinh dị."
    },
    {
        "id": 96,
        "noiDung": "Allegorical cinema utilizes characters and narrative events as symbolic representations of broader societal dilemmas.",
        "loaiCauHoi": "TRUE_FALSE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "True (Đúng)",
            "B": "False (Sai)"
        },
        "dapAnDung": "A",
        "giaiThich": "Đúng. Điện ảnh ngụ ngôn dùng hình tượng để biểu trưng cho các vấn đề triết học và xã hội rộng lớn."
    },
    {
        "id": 97,
        "noiDung": "Select all theoretical frameworks and concepts in advanced film studies: (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "Auteur theory of directorial authorship",
            "B": "chiaroscuro lighting aesthetics",
            "C": "movie theater popcorn popping physics",
            "D": "cinema verite documentary realism"
        },
        "dapAnDung": [
            "A",
            "B",
            "D"
        ],
        "giaiThich": "Thuyết tác giả, thẩm mỹ chiaroscuro, điện ảnh chân thực là các khung lý thuyết điện ảnh kinh điển."
    },
    {
        "id": 98,
        "noiDung": "Which techniques subvert conventional linear cinematic narrative structure: (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "non-linear chronological flashbacks & flash-forwards",
            "B": "unreliable narrator perspective framing",
            "C": "meta-theatrical fourth-wall deconstruction",
            "D": "selling soda at the intermission"
        },
        "dapAnDung": [
            "A",
            "B",
            "C"
        ],
        "giaiThich": "Dòng thời gian phi tuyến tính, người kể chuyện không đáng tin, phá vỡ bức tường thứ 4."
    },
    {
        "id": 99,
        "noiDung": "Select all artistic elements analyzed in formal soundtrack critique: (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "leitmotif character thematic associations",
            "B": "diegetic versus non-diegetic acoustic layering",
            "C": "the font style of cinema tickets",
            "D": "atonal dissonance and atmospheric timbre"
        },
        "dapAnDung": [
            "A",
            "B",
            "D"
        ],
        "giaiThich": "Mô-típ âm nhạc nhân vật (leitmotif), âm thanh trong/ngoài phim, âm sắc phi điệu tính."
    },
    {
        "id": 100,
        "noiDung": "Identify all socio-cultural critiques leveled against mass entertainment: (Chọn tất cả đáp án đúng)",
        "loaiCauHoi": "MULTIPLE",
        "trinhDo": "C1",
        "luaChon": {
            "A": "manufacturing consumerist ideological hegemony",
            "B": "homogenization of divergent regional cultures",
            "C": "creating comfortable leather armchairs",
            "D": "reduction of complex historical trauma to spectacle"
        },
        "dapAnDung": [
            "A",
            "B",
            "D"
        ],
        "giaiThich": "Bá quyền ý thức hệ tiêu dùng, đồng nhất hóa văn hóa bản địa, biến bi kịch lịch sử thành trò giải trí."
    }
]
};
