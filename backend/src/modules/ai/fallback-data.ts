export type QuestionType = 'SINGLE' | 'TRUE_FALSE' | 'MULTIPLE';

export interface QuestionItem {
  id: number;
  noiDung: string;
  loaiCauHoi?: QuestionType;
  luaChon: Record<string, string>;
  dapAnDung: string | string[];
  giaiThich: string;
}

export interface FallbackExerciseSet {
  chuDe: string;
  trinhDo: string;
  cauHoi: QuestionItem[];
}

export const FALLBACK_QUESTION_BANKS: Record<string, QuestionItem[]> = {
  'PRESENT_PERFECT': [
    {
      id: 1,
      noiDung: 'She __________ in London for five years, but she plans to move soon.',
      luaChon: { A: 'lived', B: 'has lived', C: 'is living', D: 'lives' },
      dapAnDung: 'B',
      giaiThich: 'Diễn tả hành động bắt đầu trong quá khứ kéo dài đến hiện tại (đi kèm "for five years"), dùng Hiện tại hoàn thành.',
    },
    {
      id: 2,
      noiDung: 'Have you ever __________ a famous musician in person?',
      luaChon: { A: 'meet', B: 'met', C: 'meeting', D: 'meets' },
      dapAnDung: 'B',
      giaiThich: 'Cấu trúc câu hỏi trải nghiệm: "Have + S + ever + V3/V-ed...". Quá khứ phân từ của "meet" là "met".',
    },
    {
      id: 3,
      noiDung: 'I haven\'t finished compiling the monthly financial report __________.',
      luaChon: { A: 'already', B: 'just', C: 'yet', D: 'since' },
      dapAnDung: 'C',
      giaiThich: '"Yet" thường đứng ở cuối câu phủ định trong thì Hiện tại hoàn thành, mang nghĩa "chưa".',
    },
    {
      id: 4,
      noiDung: 'Look! Someone __________ the main conference room window.',
      luaChon: { A: 'opened', B: 'has opened', C: 'opens', D: 'was opening' },
      dapAnDung: 'B',
      giaiThich: 'Hành động đã xảy ra trong quá khứ nhưng để lại kết quả trực quan ở hiện tại, dùng Hiện tại hoàn thành.',
    },
    {
      id: 5,
      noiDung: 'Where is the director? — He __________ to the branch office in Da Nang.',
      luaChon: { A: 'has gone', B: 'has been', C: 'went', D: 'goes' },
      dapAnDung: 'A',
      giaiThich: '"Has gone to" chỉ người đã đi đến nơi nào đó và hiện chưa quay về (phân biệt với "has been to").',
    },
  ],

  'CONDITIONALS': [
    {
      id: 1,
      noiDung: 'If it rains tomorrow, we __________ the outdoor workshop.',
      luaChon: { A: 'cancel', B: 'will cancel', C: 'cancelled', D: 'would cancel' },
      dapAnDung: 'B',
      giaiThich: 'Câu điều kiện loại 1 diễn tả sự việc có thể xảy ra ở tương lai: If + S + V(hiện tại), S + will + V(nguyên mẫu).',
    },
    {
      id: 2,
      noiDung: 'If I __________ you, I would accept that scholarship immediately.',
      luaChon: { A: 'am', B: 'was', C: 'were', D: 'have been' },
      dapAnDung: 'C',
      giaiThich: 'Câu điều kiện loại 2 khuyên bảo/giả định trái ngược hiện tại: dùng "were" cho tất cả các ngôi.',
    },
    {
      id: 3,
      noiDung: 'If he had studied harder, he __________ the IELTS exam last month.',
      luaChon: { A: 'would pass', B: 'would have passed', C: 'will pass', D: 'passed' },
      dapAnDung: 'B',
      giaiThich: 'Câu điều kiện loại 3 giả định trái thực tế trong quá khứ: If + S + had V3, S + would have V3.',
    },
    {
      id: 4,
      noiDung: 'Water boils if you __________ it to 100 degrees Celsius.',
      luaChon: { A: 'heat', B: 'heats', C: 'heated', D: 'will heat' },
      dapAnDung: 'A',
      giaiThich: 'Câu điều kiện loại 0 (sự thật hiển nhiên/khoa học): Cả 2 vế đều dùng thì Hiện tại đơn.',
    },
    {
      id: 5,
      noiDung: 'Unless you __________ an umbrella, you will get wet in the rain.',
      luaChon: { A: 'bring', B: 'don\'t bring', C: 'brought', D: 'will bring' },
      dapAnDung: 'A',
      giaiThich: '"Unless" tương đương với "If ... not", vế sau unless ở thể khẳng định: Unless you bring = If you don\'t bring.',
    },
  ],

  'RELATIVE_CLAUSES': [
    {
      id: 1,
      noiDung: 'The teacher __________ teaches IELTS Speaking at ETC English is very dedicated.',
      luaChon: { A: 'who', B: 'which', C: 'whom', D: 'whose' },
      dapAnDung: 'A',
      giaiThich: 'Đại từ quan hệ "who" thay thế cho danh từ chỉ người ("The teacher") làm chủ ngữ trong mệnh đề quan hệ.',
    },
    {
      id: 2,
      noiDung: 'The textbook __________ I borrowed from the library is very helpful.',
      luaChon: { A: 'who', B: 'which', C: 'whom', D: 'whose' },
      dapAnDung: 'B',
      giaiThich: 'Đại từ quan hệ "which" thay thế cho danh từ chỉ vật ("The textbook").',
    },
    {
      id: 3,
      noiDung: 'That is the student __________ essay won first prize in the English contest.',
      luaChon: { A: 'who', B: 'whom', C: 'whose', D: 'that' },
      dapAnDung: 'C',
      giaiThich: '"Whose" chỉ sở hữu cho danh từ đứng trước ("the student\'s essay").',
    },
    {
      id: 4,
      noiDung: 'The company __________ my sister works has a great bonus policy.',
      luaChon: { A: 'where', B: 'which', C: 'that', D: 'when' },
      dapAnDung: 'A',
      giaiThich: 'Trạng từ quan hệ "where" thay thế cho nơi chốn (= at which / in which).',
    },
    {
      id: 5,
      noiDung: 'Mr. Brown, __________ you met yesterday, is our center academic director.',
      luaChon: { A: 'whom', B: 'which', C: 'whose', D: 'that' },
      dapAnDung: 'A',
      giaiThich: '"Whom" làm tân ngữ chỉ người sau dấu phẩy trong mệnh đề quan hệ không xác định (không dùng "that").',
    },
  ],

  'PASSIVE_VOICE': [
    {
      id: 1,
      noiDung: 'The new English curriculum __________ by the academic team last week.',
      luaChon: { A: 'approved', B: 'was approved', C: 'is approved', D: 'has approved' },
      dapAnDung: 'B',
      giaiThich: 'Câu bị động quá khứ đơn với mốc thời gian "last week": S + was/were + V3/ed.',
    },
    {
      id: 2,
      noiDung: 'All course certificates __________ to students by the end of next week.',
      luaChon: { A: 'will deliver', B: 'will be delivered', C: 'delivered', D: 'are delivering' },
      dapAnDung: 'B',
      giaiThich: 'Câu bị động tương lai đơn: S + will be + V3/ed.',
    },
    {
      id: 3,
      noiDung: 'English __________ in almost every country around the world.',
      luaChon: { A: 'speaks', B: 'is spoken', C: 'spoken', D: 'is speaking' },
      dapAnDung: 'B',
      giaiThich: 'Câu bị động ở thì hiện tại đơn chỉ sự thật hiển nhiên: S + is/am/are + V3/ed.',
    },
    {
      id: 4,
      noiDung: 'The classroom is closed because it __________ right now.',
      luaChon: { A: 'is cleaned', B: 'is being cleaned', C: 'was cleaned', D: 'has cleaned' },
      dapAnDung: 'B',
      giaiThich: 'Câu bị động hiện tại tiếp diễn với dấu hiệu "right now": S + is/am/are + being + V3/ed.',
    },
    {
      id: 5,
      noiDung: 'This contract must __________ by both parties before tomorrow morning.',
      luaChon: { A: 'sign', B: 'be signed', C: 'signed', D: 'being signed' },
      dapAnDung: 'B',
      giaiThich: 'Câu bị động với động từ khuyết thiếu (modal verb): modal + be + V3/ed.',
    },
  ],

  'PHRASAL_VERBS': [
    {
      id: 1,
      noiDung: 'Don\'t __________ your dreams just because the journey is difficult.',
      luaChon: { A: 'give up', B: 'look after', C: 'put off', D: 'turn down' },
      dapAnDung: 'A',
      giaiThich: '"Give up" nghĩa là từ bỏ, đầu hàng.',
    },
    {
      id: 2,
      noiDung: 'Due to heavy rain, the center decided to __________ the outdoor speaking club.',
      luaChon: { A: 'call off', B: 'put off', C: 'bring up', D: 'run into' },
      dapAnDung: 'B',
      giaiThich: '"Put off" nghĩa là hoãn lại, dời sang thời gian khác.',
    },
    {
      id: 3,
      noiDung: 'If you don\'t know the meaning of this word, you can __________ it in the dictionary.',
      luaChon: { A: 'look up', B: 'look after', C: 'look for', D: 'look out' },
      dapAnDung: 'A',
      giaiThich: '"Look up" nghĩa là tra cứu thông tin (từ điển, tài liệu).',
    },
    {
      id: 4,
      noiDung: 'She had to __________ the job offer because the commute was too far.',
      luaChon: { A: 'turn on', B: 'turn down', C: 'turn up', D: 'turn off' },
      dapAnDung: 'B',
      giaiThich: '"Turn down" nghĩa là từ chối một lời đề nghị hoặc giảm âm lượng.',
    },
    {
      id: 5,
      noiDung: 'I accidentally __________ an old high school friend at the library yesterday.',
      luaChon: { A: 'ran into', B: 'took off', C: 'got over', D: 'broke down' },
      dapAnDung: 'A',
      giaiThich: '"Run into" nghĩa là tình cờ bắt gặp ai đó.',
    },
  ],

  'BUSINESS_ENGLISH': [
    {
      id: 1,
      noiDung: 'Please review the attached __________ before our quarterly budget meeting.',
      luaChon: { A: 'agenda', B: 'receipt', C: 'brochure', D: 'syllabus' },
      dapAnDung: 'A',
      giaiThich: '"Agenda" nghĩa là chương trình nghị sự, nội dung cuộc họp.',
    },
    {
      id: 2,
      noiDung: 'We need to reach a __________ with our international partners by Friday.',
      luaChon: { A: 'compromise', B: 'complaint', C: 'conflict', D: 'competition' },
      dapAnDung: 'A',
      giaiThich: '"Reach a compromise" nghĩa là đạt được thỏa hiệp/đồng thuận trong đàm phán thương mại.',
    },
    {
      id: 3,
      noiDung: 'The marketing manager submitted a detailed proposal to increase customer __________.',
      luaChon: { A: 'retention', B: 'rejection', C: 'reduction', D: 'reaction' },
      dapAnDung: 'A',
      giaiThich: '"Customer retention" là thuật ngữ kinh doanh chỉ việc duy trì và giữ chân khách hàng.',
    },
    {
      id: 4,
      noiDung: 'All employees are required to adhere to the company\'s strict __________ of conduct.',
      luaChon: { A: 'rule', B: 'code', C: 'law', D: 'norm' },
      dapAnDung: 'B',
      giaiThich: '"Code of conduct" nghĩa là quy tắc ứng xử/bộ quy tắc đạo đức doanh nghiệp.',
    },
    {
      id: 5,
      noiDung: 'The company achieved a 15% increase in its quarterly net __________.',
      luaChon: { A: 'profit', B: 'loss', C: 'debt', D: 'cost' },
      dapAnDung: 'A',
      giaiThich: '"Net profit" nghĩa là lợi nhuận ròng sau thuế.',
    },
  ],

  'DEFAULT_CEFR': [
    {
      id: 1,
      noiDung: 'She __________ to London three times this year.',
      luaChon: { A: 'has been', B: 'went', C: 'goes', D: 'is going' },
      dapAnDung: 'A',
      giaiThich: 'Dùng thì hiện tại hoàn thành diễn tả trải nghiệm lặp lại nhiều lần.',
    },
    {
      id: 2,
      noiDung: 'They haven\'t finished their homework __________.',
      luaChon: { A: 'already', B: 'yet', C: 'since', D: 'just' },
      dapAnDung: 'B',
      giaiThich: '"Yet" dùng ở cuối câu phủ định của thì hiện tại hoàn thành.',
    },
    {
      id: 3,
      noiDung: 'When I __________ home yesterday, my mother was cooking dinner.',
      luaChon: { A: 'arrived', B: 'was arriving', C: 'have arrived', D: 'arrive' },
      dapAnDung: 'A',
      giaiThich: 'Hành động ngắn xen vào hành động đang diễn ra trong quá khứ dùng Quá khứ đơn.',
    },
    {
      id: 4,
      noiDung: 'He __________ English at ETC Center since 2022.',
      loaiCauHoi: 'SINGLE',
      luaChon: { A: 'studies', B: 'has studied', C: 'studied', D: 'is studying' },
      dapAnDung: 'B',
      giaiThich: 'Dấu hiệu "since + mốc thời gian" dùng thì Hiện tại hoàn thành.',
    },
    {
      id: 5,
      noiDung: 'Look! The bus __________ at the station.',
      loaiCauHoi: 'SINGLE',
      luaChon: { A: 'comes', B: 'is coming', C: 'came', D: 'has come' },
      dapAnDung: 'B',
      giaiThich: 'Dấu hiệu "Look!" diễn tả hành động đang xảy ra dùng Hiện tại tiếp diễn.',
    },
  ],

  'INFORMATION_TECHNOLOGY': [
    {
      id: 1,
      noiDung: 'The process of detecting, diagnosing, and fixing programming errors in software code is called __________.',
      loaiCauHoi: 'SINGLE',
      luaChon: { A: 'debugging', B: 'compiling', C: 'encrypting', D: 'deploying' },
      dapAnDung: 'A',
      giaiThich: '"Debugging" là quá trình tìm kiếm và sửa lỗi (bugs) trong mã nguồn phần mềm.',
    },
    {
      id: 2,
      noiDung: 'Open-source software means that the original source code is made freely available and may be redistributed and modified.',
      loaiCauHoi: 'TRUE_FALSE',
      luaChon: { A: 'True (Đúng)', B: 'False (Sai)' },
      dapAnDung: 'A',
      giaiThich: 'Đúng. Phần mềm nguồn mở (Open Source) cho phép cộng đồng tiếp cận mã nguồn tự do, chỉnh sửa và đóng góp phát triển.',
    },
    {
      id: 3,
      noiDung: 'Which of the following are relational database management systems (RDBMS)? (Chọn tất cả đáp án đúng)',
      loaiCauHoi: 'MULTIPLE',
      luaChon: { A: 'PostgreSQL', B: 'Docker Container', C: 'MySQL Server', D: 'Kubernetes Cluster' },
      dapAnDung: ['A', 'C'],
      giaiThich: 'PostgreSQL và MySQL là các hệ quản trị cơ sở dữ liệu quan hệ (RDBMS), trong khi Docker và Kubernetes là công cụ điều phối container.',
    },
    {
      id: 4,
      noiDung: 'Cloud infrastructure allows businesses to dynamically __________ their server capacity according to real-time traffic demand.',
      loaiCauHoi: 'SINGLE',
      luaChon: { A: 'scale', B: 'crash', C: 'erase', D: 'reboot' },
      dapAnDung: 'A',
      giaiThich: '"Scale" (co giãn/mở rộng tài nguyên) là đặc tính cốt lõi của điện toán đám mây (Cloud Computing).',
    },
    {
      id: 5,
      noiDung: 'Phishing is a legitimate cybersecurity technique used by IT administrators to securely authenticate student passwords.',
      loaiCauHoi: 'TRUE_FALSE',
      luaChon: { A: 'True (Đúng)', B: 'False (Sai)' },
      dapAnDung: 'B',
      giaiThich: 'Sai. Phishing là hình thức lừa đảo giả mạo trực tuyến nhằm đánh cắp thông tin nhạy cảm của người dùng (tài khoản, mật khẩu), không phải kỹ thuật bảo mật hợp pháp.',
    },
    {
      id: 6,
      noiDung: 'Which of the following are widely used Frontend development technologies or frameworks? (Chọn tất cả đáp án đúng)',
      loaiCauHoi: 'MULTIPLE',
      luaChon: { A: 'React.js', B: 'Next.js App Router', C: 'PostgreSQL Database', D: 'Linux Kernel Engine' },
      dapAnDung: ['A', 'B'],
      giaiThich: 'React.js và Next.js là các thư viện/framework hàng đầu xây dựng giao diện người dùng (Frontend), PostgreSQL là CSDL và Linux là nhân hệ điều hành.',
    },
    {
      id: 7,
      noiDung: 'An Application Programming Interface (API) enables different software systems to communicate and exchange data with each other.',
      loaiCauHoi: 'TRUE_FALSE',
      luaChon: { A: 'True (Đúng)', B: 'False (Sai)' },
      dapAnDung: 'A',
      giaiThich: 'Đúng. API là cầu nối cho phép hai hoặc nhiều ứng dụng phần mềm giao tiếp và chia sẻ dữ liệu theo giao thức chuẩn (như RESTful JSON).',
    },
    {
      id: 8,
      noiDung: 'Developers usually use Git branches to __________ new features without affecting the stable production codebase.',
      loaiCauHoi: 'SINGLE',
      luaChon: { A: 'isolate', B: 'destroy', C: 'delete', D: 'leak' },
      dapAnDung: 'A',
      giaiThich: '"Isolate" (cô lập, tách biệt). Nhánh (branch) trong Git giúp lập trình viên phát triển tính năng mới độc lập mà không ảnh hưởng mã nguồn chính.',
    },
    {
      id: 9,
      noiDung: 'Which of the following are essential cybersecurity best practices for protecting user accounts? (Chọn tất cả đáp án đúng)',
      loaiCauHoi: 'MULTIPLE',
      luaChon: { A: 'Enabling Two-Factor Authentication (2FA)', B: 'Using strong unique passwords', C: 'Sharing master credentials in public chats', D: 'Storing plaintext passwords in source code' },
      dapAnDung: ['A', 'B'],
      giaiThich: 'Bật xác thực hai yếu tố (2FA) và đặt mật khẩu mạnh, duy nhất là các biện pháp an ninh mạng bắt buộc để bảo vệ tài khoản.',
    },
    {
      id: 10,
      noiDung: 'Artificial Intelligence and Machine Learning models rely heavily on large volumes of high-quality __________ to train effectively.',
      loaiCauHoi: 'SINGLE',
      luaChon: { A: 'data', B: 'hardware cables', C: 'paper documents', D: 'advertisements' },
      dapAnDung: 'A',
      giaiThich: '"Data" (dữ liệu). Các mô hình AI/ML cần khối lượng lớn dữ liệu huấn luyện sạch và chất lượng cao để đạt độ chính xác.',
    },
  ],

  'ENTERTAINMENT': [
    {
      id: 1,
      noiDung: 'The lead actor received a standing __________ from the audience after the dramatic musical performance.',
      loaiCauHoi: 'SINGLE',
      luaChon: { A: 'ovation', B: 'audition', C: 'rehearsal', D: 'broadcast' },
      dapAnDung: 'A',
      giaiThich: '"Standing ovation" nghĩa là tràng pháo tay nhiệt liệt khi toàn bộ khán giả đứng dậy vỗ tay chúc mừng.',
    },
    {
      id: 2,
      noiDung: 'A prequel is a film or book that continues the story of an earlier work by describing what happens afterwards.',
      loaiCauHoi: 'TRUE_FALSE',
      luaChon: { A: 'True (Đúng)', B: 'False (Sai)' },
      dapAnDung: 'B',
      giaiThich: 'Sai. Tác phẩm kể về những sự kiện diễn ra "sau đó" là Sequel (phần tiếp theo). Prequel (tiền truyện) kể về những sự kiện xảy ra TRƯỚC tác phẩm gốc.',
    },
    {
      id: 3,
      noiDung: 'Which of the following are globally recognized awards in the film and music entertainment industries? (Chọn tất cả đáp án đúng)',
      loaiCauHoi: 'MULTIPLE',
      luaChon: { A: 'The Academy Awards (Oscars)', B: 'The Grammy Awards', C: 'The Turing Award', D: 'The Fields Medal' },
      dapAnDung: ['A', 'B'],
      giaiThich: 'Oscars là giải thưởng danh giá ngành điện ảnh và Grammy là giải thưởng âm nhạc quốc tế hàng đầu.',
    },
    {
      id: 4,
      noiDung: 'The entire theatrical cast gathered on stage for their final dress __________ prior to the premiere.',
      loaiCauHoi: 'SINGLE',
      luaChon: { A: 'rehearsal', B: 'premiere', C: 'interview', D: 'script' },
      dapAnDung: 'A',
      giaiThich: '"Dress rehearsal" là buổi tổng duyệt trang phục và diễn xuất cuối cùng trước khi công diễn chính thức.',
    },
    {
      id: 5,
      noiDung: 'The musical score and original songs composed specifically for a motion picture are known as the soundtrack.',
      loaiCauHoi: 'TRUE_FALSE',
      luaChon: { A: 'True (Đúng)', B: 'False (Sai)' },
      dapAnDung: 'A',
      giaiThich: 'Đúng. Soundtrack (nhạc phim) là tập hợp toàn bộ các bản nhạc nền hoặc bài hát chủ đề được sáng tác riêng cho bộ phim.',
    },
    {
      id: 6,
      noiDung: 'Which of the following are popular cinematic genres? (Chọn tất cả đáp án đúng)',
      loaiCauHoi: 'MULTIPLE',
      luaChon: { A: 'Science Fiction (Sci-Fi)', B: 'Historical Documentary', C: 'Relational Database', D: 'Operating System Kernel' },
      dapAnDung: ['A', 'B'],
      giaiThich: 'Science Fiction (khoa học viễn tưởng) và Historical Documentary (phim tài liệu lịch sử) là các thể loại điện ảnh kinh điển.',
    },
    {
      id: 7,
      noiDung: 'A "blockbuster" in the film industry refers to a movie that achieved tremendous commercial success and high box office revenue.',
      loaiCauHoi: 'TRUE_FALSE',
      luaChon: { A: 'True (Đúng)', B: 'False (Sai)' },
      dapAnDung: 'A',
      giaiThich: 'Đúng. "Blockbuster" (phim bom tấn) chỉ những bộ phim có kinh phí lớn và đạt doanh thu phòng vé khổng lồ.',
    },
    {
      id: 8,
      noiDung: 'The music festival was organized to __________ funds for local art and culture conservation charities.',
      loaiCauHoi: 'SINGLE',
      luaChon: { A: 'raise', B: 'rise', C: 'waste', D: 'borrow' },
      dapAnDung: 'A',
      giaiThich: '"Raise funds" là cụm từ cố định mang nghĩa gây quỹ từ thiện/gây quỹ cho mục đích cộng đồng.',
    },
    {
      id: 9,
      noiDung: 'Which of the following roles are directly involved in producing a feature film? (Chọn tất cả đáp án đúng)',
      loaiCauHoi: 'MULTIPLE',
      luaChon: { A: 'Film Director', B: 'Cinematographer (Director of Photography)', C: 'Network Administrator', D: 'Dental Hygienist' },
      dapAnDung: ['A', 'B'],
      giaiThich: 'Đạo diễn (Director) và Nhà quay phim (Cinematographer) là những vai trò then chốt trực tiếp sản xuất tác phẩm điện ảnh.',
    },
    {
      id: 10,
      noiDung: 'An audition is a short performance given by an actor or musician to show their suitability for a role.',
      loaiCauHoi: 'TRUE_FALSE',
      luaChon: { A: 'True (Đúng)', B: 'False (Sai)' },
      dapAnDung: 'A',
      giaiThich: 'Đúng. "Audition" (buổi thử vai/thử giọng) là buổi diễn thử để ban giám khảo đánh giá năng lực của nghệ sĩ.',
    },
  ],

  'TOURISM_TRAVEL': [
    {
      id: 1,
      noiDung: 'All airline passengers must present their valid boarding __________ and passport before passing through security gates.',
      loaiCauHoi: 'SINGLE',
      luaChon: { A: 'pass', B: 'receipt', C: 'brochure', D: 'itinerary' },
      dapAnDung: 'A',
      giaiThich: '"Boarding pass" là thẻ lên máy bay cấp cho hành khách sau khi làm thủ tục check-in.',
    },
    {
      id: 2,
      noiDung: 'An itinerary is a detailed travel plan that lists the scheduled destinations, transport, and daily sightseeing activities.',
      loaiCauHoi: 'TRUE_FALSE',
      luaChon: { A: 'True (Đúng)', B: 'False (Sai)' },
      dapAnDung: 'A',
      giaiThich: 'Đúng. "Itinerary" là lịch trình chi tiết chuyến đi bao gồm thời gian, điểm đến và các hoạt động tham quan.',
    },
    {
      id: 3,
      noiDung: 'Which of the following travel documents are mandatory when embarking on international journeys? (Chọn tất cả đáp án đúng)',
      loaiCauHoi: 'MULTIPLE',
      luaChon: { A: 'Valid International Passport', B: 'Entry Visa (if required by host country)', C: 'University Graduation Diploma', D: 'Public Library Card' },
      dapAnDung: ['A', 'B'],
      giaiThich: 'Hộ chiếu còn hạn sử dụng và thị thực nhập cảnh (Visa) là hai giấy tờ pháp lý tối quan trọng khi xuất nhập cảnh quốc tế.',
    },
    {
      id: 4,
      noiDung: 'Due to severe turbulence and stormy weather, the aircraft had to make an emergency __________ at a nearby island airport.',
      loaiCauHoi: 'SINGLE',
      luaChon: { A: 'landing', B: 'takeoff', C: 'departure', D: 'check-in' },
      dapAnDung: 'A',
      giaiThich: '"Emergency landing" nghĩa là hạ cánh khẩn cấp vì lý do an toàn bay.',
    },
    {
      id: 5,
      noiDung: 'Jet lag is a temporary physical condition causing fatigue and sleep disruption when flying rapidly across multiple time zones.',
      loaiCauHoi: 'TRUE_FALSE',
      luaChon: { A: 'True (Đúng)', B: 'False (Sai)' },
      dapAnDung: 'A',
      giaiThich: 'Đúng. "Jet lag" là trạng thái mệt mỏi, rối loạn đồng hồ sinh học khi cơ thể di chuyển nhanh qua nhiều múi giờ khác nhau.',
    },
    {
      id: 6,
      noiDung: 'Which of the following services are typically included in an "All-Inclusive" luxury holiday package? (Chọn tất cả đáp án đúng)',
      loaiCauHoi: 'MULTIPLE',
      luaChon: { A: 'Hotel accommodation and housekeeping', B: 'Daily meals and selected beverages', C: 'Official passport renewal service', D: 'Government border taxes' },
      dapAnDung: ['A', 'B'],
      giaiThich: 'Gói nghỉ dưỡng "All-inclusive" (trọn gói) thường đã bao gồm tiền phòng nghỉ và các bữa ăn, đồ uống trong kỳ lưu trú.',
    },
    {
      id: 7,
      noiDung: 'Travelers are strongly advised to purchase travel __________ to cover unforeseen medical emergencies or trip cancellations.',
      loaiCauHoi: 'SINGLE',
      luaChon: { A: 'insurance', B: 'souvenir', C: 'luggage', D: 'currency' },
      dapAnDung: 'A',
      giaiThich: '"Travel insurance" là bảo hiểm du lịch, giúp bồi hoàn chi phí y tế khẩn cấp hoặc hủy chuyến bay đột xuất.',
    },
    {
      id: 8,
      noiDung: 'Ecotourism focuses on responsible travel to natural areas that conserves the environment and improves the well-being of local people.',
      loaiCauHoi: 'TRUE_FALSE',
      luaChon: { A: 'True (Đúng)', B: 'False (Sai)' },
      dapAnDung: 'A',
      giaiThich: 'Đúng. "Ecotourism" (du lịch sinh thái) hướng đến việc bảo tồn thiên nhiên hoang dã và tôn trọng văn hóa cộng đồng bản địa.',
    },
    {
      id: 9,
      noiDung: 'Which of the following items are commonly classified as carry-on luggage for commercial flights? (Chọn tất cả đáp án đúng)',
      loaiCauHoi: 'MULTIPLE',
      luaChon: { A: 'Small backpack / laptop bag', B: 'Personal travel wallet', C: 'Large 32kg freight container', D: 'Motorcycle engine' },
      dapAnDung: ['A', 'B'],
      giaiThich: 'Hành lý xách tay (carry-on luggage) là các túi nhỏ, balo máy tính hoặc ví cầm tay được phép mang trực tiếp lên khoang hành khách.',
    },
    {
      id: 10,
      noiDung: 'A layover is a brief stop or connection between flights before continuing to your final destination.',
      loaiCauHoi: 'TRUE_FALSE',
      luaChon: { A: 'True (Đúng)', B: 'False (Sai)' },
      dapAnDung: 'A',
      giaiThich: 'Đúng. "Layover" (điểm dừng quá cảnh) là khoảng dừng ngắn giữa các chuyến bay nối chuyến trước khi bay tiếp đến đích.',
    },
  ],
};

export function getFallbackExercises(
  topic: string,
  cefr: string,
  count: number = 5,
  loaiCauHoi?: string,
): FallbackExerciseSet {
  const normalized = topic.toLowerCase();
  let bankKey = 'DEFAULT_CEFR';

  if (
    normalized.includes('công nghệ') ||
    normalized.includes('thông tin') ||
    normalized.includes('it') ||
    normalized.includes('software') ||
    normalized.includes('hardware') ||
    normalized.includes('lập trình') ||
    normalized.includes('developer') ||
    normalized.includes('computer') ||
    normalized.includes('ai') ||
    normalized.includes('tech')
  ) {
    bankKey = 'INFORMATION_TECHNOLOGY';
  } else if (
    normalized.includes('giải trí') ||
    normalized.includes('entertainment') ||
    normalized.includes('âm nhạc') ||
    normalized.includes('music') ||
    normalized.includes('phim') ||
    normalized.includes('movie') ||
    normalized.includes('điện ảnh') ||
    normalized.includes('cinema') ||
    normalized.includes('showbiz')
  ) {
    bankKey = 'ENTERTAINMENT';
  } else if (
    normalized.includes('du lịch') ||
    normalized.includes('travel') ||
    normalized.includes('tourism') ||
    normalized.includes('khách sạn') ||
    normalized.includes('hotel') ||
    normalized.includes('khám phá') ||
    normalized.includes('vacation') ||
    normalized.includes('holiday')
  ) {
    bankKey = 'TOURISM_TRAVEL';
  } else if (normalized.includes('hoàn thành') || normalized.includes('perfect')) {
    bankKey = 'PRESENT_PERFECT';
  } else if (normalized.includes('điều kiện') || normalized.includes('conditional')) {
    bankKey = 'CONDITIONALS';
  } else if (normalized.includes('quan hệ') || normalized.includes('relative')) {
    bankKey = 'RELATIVE_CLAUSES';
  } else if (normalized.includes('bị động') || normalized.includes('passive')) {
    bankKey = 'PASSIVE_VOICE';
  } else if (normalized.includes('cụm động từ') || normalized.includes('phrasal')) {
    bankKey = 'PHRASAL_VERBS';
  } else if (
    normalized.includes('công sở') ||
    normalized.includes('business') ||
    normalized.includes('giao tiếp')
  ) {
    bankKey = 'BUSINESS_ENGLISH';
  }

  // Lấy các câu hỏi từ ngân hàng đã chọn
  let primaryList = FALLBACK_QUESTION_BANKS[bankKey] || FALLBACK_QUESTION_BANKS['DEFAULT_CEFR'];

  // Nếu người dùng chọn lọc theo dạng câu hỏi cụ thể (SINGLE, TRUE_FALSE, MULTIPLE)
  if (loaiCauHoi && loaiCauHoi !== 'MIXED') {
    const filteredPrimary = primaryList.filter((q) => q.loaiCauHoi === loaiCauHoi);
    if (filteredPrimary.length > 0) {
      primaryList = filteredPrimary;
    }
  }

  const allOtherQuestions = Object.entries(FALLBACK_QUESTION_BANKS)
    .filter(([key]) => key !== bankKey)
    .flatMap(([, qs]) => qs)
    .filter((q) => !loaiCauHoi || loaiCauHoi === 'MIXED' || q.loaiCauHoi === loaiCauHoi);

  const combined = [...primaryList, ...allOtherQuestions].sort(() => Math.random() - 0.5);
  const targetCount = [5, 10, 15].includes(count) ? count : 5;
  const selectedQuestions = combined.slice(0, targetCount);

  return {
    chuDe: topic,
    trinhDo: cefr,
    cauHoi: selectedQuestions.map((q, idx) => ({
      ...q,
      id: idx + 1,
      loaiCauHoi: q.loaiCauHoi || (Array.isArray(q.dapAnDung) ? 'MULTIPLE' : Object.keys(q.luaChon).length === 2 ? 'TRUE_FALSE' : 'SINGLE'),
    })),
  };
}
