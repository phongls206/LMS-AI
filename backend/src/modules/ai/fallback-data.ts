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

  'PREPOSITIONS': [
    {
      id: 1,
      noiDung: 'The international academic conference starts promptly __________ 8:30 AM tomorrow.',
      loaiCauHoi: 'SINGLE',
      luaChon: { A: 'at', B: 'on', C: 'in', D: 'by' },
      dapAnDung: 'A',
      giaiThich: 'Dùng giới từ "at" trước mốc giờ giấc cụ thể (at 8:30 AM).',
    },
    {
      id: 2,
      noiDung: 'He has worked as an IELTS instructor __________ Hanoi since he graduated from university.',
      loaiCauHoi: 'SINGLE',
      luaChon: { A: 'in', B: 'on', C: 'at', D: 'to' },
      dapAnDung: 'A',
      giaiThich: 'Dùng "in" trước tên thành phố, quốc gia hoặc khu vực địa lý lớn (in Hanoi).',
    },
    {
      id: 3,
      noiDung: 'We use the preposition "on" for specific days of the week and exact dates, such as "on Monday" or "on July 4th".',
      loaiCauHoi: 'TRUE_FALSE',
      luaChon: { A: 'True (Đúng)', B: 'False (Sai)' },
      dapAnDung: 'A',
      giaiThich: 'Đúng. Giới từ "on" dùng cho ngày trong tuần và ngày tháng cụ thể.',
    },
    {
      id: 4,
      noiDung: 'The main administrative office of ETC English Center is located __________ the 3rd floor.',
      loaiCauHoi: 'SINGLE',
      luaChon: { A: 'on', B: 'in', C: 'at', D: 'under' },
      dapAnDung: 'A',
      giaiThich: 'Dùng "on the ... floor" khi nói về tầng trong một tòa nhà.',
    },
    {
      id: 5,
      noiDung: 'Which of the following time phrases are paired with the correct preposition? (Chọn tất cả đáp án đúng)',
      loaiCauHoi: 'MULTIPLE',
      luaChon: { A: 'at midnight', B: 'on Friday morning', C: 'in the summer', D: 'at 2026' },
      dapAnDung: ['A', 'B', 'C'],
      giaiThich: '"at midnight", "on Friday morning", "in the summer" đều đúng. Với năm thì dùng "in 2026", không dùng "at".',
    },
  ],

  'MODAL_VERBS': [
    {
      id: 1,
      noiDung: 'Motorcyclists __________ wear a certified safety helmet when driving on the road; it is strictly required by traffic law.',
      loaiCauHoi: 'SINGLE',
      luaChon: { A: 'must', B: 'might', C: 'could', D: 'may' },
      dapAnDung: 'A',
      giaiThich: '"Must" diễn tả sự bắt buộc theo luật định hoặc quy định nghiêm ngặt.',
    },
    {
      id: 2,
      noiDung: 'She __________ speak three foreign languages fluently when she was only ten years old.',
      loaiCauHoi: 'SINGLE',
      luaChon: { A: 'could', B: 'can', C: 'must', D: 'should' },
      dapAnDung: 'A',
      giaiThich: '"Could" diễn tả năng lực hoặc khả năng chung trong quá khứ.',
    },
    {
      id: 3,
      noiDung: '"Mustn\'t" indicates that something is strictly prohibited, whereas "don\'t have to" indicates lack of necessity/obligation.',
      loaiCauHoi: 'TRUE_FALSE',
      luaChon: { A: 'True (Đúng)', B: 'False (Sai)' },
      dapAnDung: 'A',
      giaiThich: 'Đúng. "Mustn\'t" là cấm đoán, còn "don\'t have to" là không cần thiết (làm hay không tùy ý).',
    },
    {
      id: 4,
      noiDung: 'If you want to achieve an IELTS band 7.0+, you __________ practice academic reading and writing on a daily basis.',
      loaiCauHoi: 'SINGLE',
      luaChon: { A: 'should', B: 'might', C: 'would', D: 'shall' },
      dapAnDung: 'A',
      giaiThich: '"Should" được dùng để đưa ra lời khuyên hữu ích cho người học.',
    },
    {
      id: 5,
      noiDung: 'Which of the following modal verbs can be used to express possibility or uncertainty about a future event? (Chọn tất cả đáp án đúng)',
      loaiCauHoi: 'MULTIPLE',
      luaChon: { A: 'might', B: 'may', C: 'could', D: 'must' },
      dapAnDung: ['A', 'B', 'C'],
      giaiThich: '"might", "may", "could" đều diễn tả khả năng có thể xảy ra trong tương lai nhưng không chắc chắn 100%. "Must" diễn tả suy đoán gần như chắc chắn.',
    },
  ],

  'SUBJECT_VERB_AGREEMENT': [
    {
      id: 1,
      noiDung: 'Each of the students in this intensive grammar course __________ given a personalized learning profile.',
      loaiCauHoi: 'SINGLE',
      luaChon: { A: 'is', B: 'are', C: 'were', D: 'have been' },
      dapAnDung: 'A',
      giaiThich: 'Cụm chủ ngữ bắt đầu bằng "Each of + N(số nhiều)" đi với động từ số ít ("is").',
    },
    {
      id: 2,
      noiDung: 'Neither the head teacher nor the teaching assistants __________ informed about the room reassignment yesterday.',
      loaiCauHoi: 'SINGLE',
      luaChon: { A: 'were', B: 'was', C: 'is', D: 'are' },
      dapAnDung: 'A',
      giaiThich: 'Cấu trúc "Neither... nor..." chia động từ theo chủ ngữ gần nó nhất ("the teaching assistants" số nhiều -> were).',
    },
    {
      id: 3,
      noiDung: 'When a subject consists of two singular nouns connected by "and", the verb that follows is usually plural.',
      loaiCauHoi: 'TRUE_FALSE',
      luaChon: { A: 'True (Đúng)', B: 'False (Sai)' },
      dapAnDung: 'A',
      giaiThich: 'Đúng. Hai danh từ số ít nối bằng "and" thường tạo thành chủ ngữ số nhiều (ví dụ: Lan and Nam are students).',
    },
    {
      id: 4,
      noiDung: 'The total number of enrolled students at ETC Center __________ steadily over the past two quarters.',
      loaiCauHoi: 'SINGLE',
      luaChon: { A: 'has increased', B: 'have increased', C: 'are increasing', D: 'were increased' },
      dapAnDung: 'A',
      giaiThich: '"The number of + N số nhiều" luôn đi với động từ số ít ("has increased"), khác với "A number of + N" đi với động từ số nhiều.',
    },
    {
      id: 5,
      noiDung: 'Which of the following sentences demonstrate correct subject-verb agreement? (Chọn tất cả đáp án đúng)',
      loaiCauHoi: 'MULTIPLE',
      luaChon: {
        A: 'Ten kilometers is a challenging distance for amateur runners.',
        B: 'Bread and butter is a classic English breakfast.',
        C: 'The news broadcast yesterday were extremely encouraging.',
        D: 'Everybody have finished their mid-term exam.',
      },
      dapAnDung: ['A', 'B'],
      giaiThich: 'Khoảng cách ("Ten kilometers") và món ăn kết hợp ("Bread and butter") tính là đơn vị số ít. "News" và "Everybody" phải đi với động từ số ít.',
    },
  ],

  'REPORTED_SPEECH': [
    {
      id: 1,
      noiDung: '"I am working on the semester report right now," Mai said. -> Mai said that she __________ on the semester report at that time.',
      loaiCauHoi: 'SINGLE',
      luaChon: { A: 'was working', B: 'is working', C: 'worked', D: 'has worked' },
      dapAnDung: 'A',
      giaiThich: 'Lùi thì từ Hiện tại tiếp diễn (am working) sang Quá khứ tiếp diễn (was working) trong câu gián tiếp.',
    },
    {
      id: 2,
      noiDung: 'The examiner asked the candidate where he __________ the previous weekend.',
      loaiCauHoi: 'SINGLE',
      luaChon: { A: 'had traveled', B: 'traveled', C: 'has traveled', D: 'was traveling' },
      dapAnDung: 'A',
      giaiThich: 'Câu hỏi ở quá khứ đơn ("did you travel") khi chuyển sang câu gián tiếp lùi về Quá khứ hoàn thành (had traveled).',
    },
    {
      id: 3,
      noiDung: 'In indirect questions, the question word order reverts to normal statement word order (Subject + Verb), and the question mark is omitted.',
      loaiCauHoi: 'TRUE_FALSE',
      luaChon: { A: 'True (Đúng)', B: 'False (Sai)' },
      dapAnDung: 'A',
      giaiThich: 'Đúng. Trong câu tường thuật gián tiếp dạng câu hỏi, trật tự từ đổi thành câu trần thuật (S + V) và không dùng dấu chấm hỏi.',
    },
    {
      id: 4,
      noiDung: '"Please don\'t use your smartphone during the speaking test," the proctor warned. -> The proctor warned the students __________ their smartphones during the test.',
      loaiCauHoi: 'SINGLE',
      luaChon: { A: 'not to use', B: 'to not use', C: 'don\'t use', D: 'no using' },
      dapAnDung: 'A',
      giaiThich: 'Cấu trúc câu mệnh lệnh phủ định gián tiếp: tell / warn + O + not to V (not to use).',
    },
    {
      id: 5,
      noiDung: 'Which of the following time expression transformations are correct in reported speech? (Chọn tất cả đáp án đúng)',
      loaiCauHoi: 'MULTIPLE',
      luaChon: {
        A: 'today -> that day',
        B: 'tomorrow -> the following day / the next day',
        C: 'now -> then',
        D: 'yesterday -> tomorrow',
      },
      dapAnDung: ['A', 'B', 'C'],
      giaiThich: 'A, B, C đều là quy tắc chuyển đổi trạng ngữ chỉ thời gian đúng trong câu gián tiếp. "yesterday" chuyển thành "the day before" hoặc "the previous day".',
    },
  ],

  'COMPARATIVES': [
    {
      id: 1,
      noiDung: 'The updated Next.js platform runs much __________ than the legacy monolithic system.',
      loaiCauHoi: 'SINGLE',
      luaChon: { A: 'more smoothly', B: 'smoothlier', C: 'most smoothly', D: 'as smoothly' },
      dapAnDung: 'A',
      giaiThich: 'Trạng từ 2 âm tiết "smoothly" tạo dạng so sánh hơn bằng cách thêm "more": more smoothly.',
    },
    {
      id: 2,
      noiDung: 'Mount Everest is widely recognized as the __________ peak on Earth.',
      loaiCauHoi: 'SINGLE',
      luaChon: { A: 'highest', B: 'higher', C: 'most high', D: 'more higher' },
      dapAnDung: 'A',
      giaiThich: 'Tính từ ngắn "high" tạo dạng so sánh nhất bằng đuôi "-est": the highest.',
    },
    {
      id: 3,
      noiDung: 'Double comparative sentences follow the pattern "The + comparative ..., the + comparative ..." to demonstrate proportional cause-and-effect relationships.',
      loaiCauHoi: 'TRUE_FALSE',
      luaChon: { A: 'True (Đúng)', B: 'False (Sai)' },
      dapAnDung: 'A',
      giaiThich: 'Đúng. Cấu trúc so sánh kép "The more... the better..." diễn tả mối tương quan nhân quả đồng biến hoặc nghịch biến.',
    },
    {
      id: 4,
      noiDung: 'Studying online with interactive AI tools is becoming __________ popular among young adults.',
      loaiCauHoi: 'SINGLE',
      luaChon: { A: 'more and more', B: 'most and most', C: 'more popular than', D: 'as popular' },
      dapAnDung: 'A',
      giaiThich: 'Cấu trúc "more and more + adj" diễn tả sự việc ngày càng tăng tiến (ngày càng phổ biến).',
    },
    {
      id: 5,
      noiDung: 'Which of the following irregular comparative and superlative adjective forms are correct? (Chọn tất cả đáp án đúng)',
      loaiCauHoi: 'MULTIPLE',
      luaChon: {
        A: 'good -> better -> best',
        B: 'bad -> worse -> worst',
        C: 'far -> further / farther -> furthest / farthest',
        D: 'little -> less -> least',
      },
      dapAnDung: ['A', 'B', 'C', 'D'],
      giaiThich: 'Tất cả 4 cặp trên đều là các dạng so sánh hơn và so sánh nhất bất quy tắc hoàn toàn chính xác trong tiếng Anh.',
    },
  ],

  'ENVIRONMENT_SOCIETY': [
    {
      id: 1,
      noiDung: 'Accelerating the global transition to __________ energy sources such as solar and wind power is vital to curbing carbon emissions.',
      loaiCauHoi: 'SINGLE',
      luaChon: { A: 'renewable', B: 'fossil', C: 'exhaustible', D: 'radioactive' },
      dapAnDung: 'A',
      giaiThich: '"Renewable energy" là năng lượng tái tạo (năng lượng mặt trời, gió, thủy triều).',
    },
    {
      id: 2,
      noiDung: 'Uncontrolled logging and agricultural expansion have resulted in widespread __________ in the Amazon basin.',
      loaiCauHoi: 'SINGLE',
      luaChon: { A: 'deforestation', B: 'reforestation', C: 'urbanization', D: 'conservation' },
      dapAnDung: 'A',
      giaiThich: '"Deforestation" (nạn phá rừng) là hiện tượng rừng bị tàn phá do khai thác gỗ hoặc mở rộng canh tác.',
    },
    {
      id: 3,
      noiDung: '"Carbon footprint" is the total amount of greenhouse gases (including carbon dioxide and methane) generated by our direct and indirect actions.',
      loaiCauHoi: 'TRUE_FALSE',
      luaChon: { A: 'True (Đúng)', B: 'False (Sai)' },
      dapAnDung: 'A',
      giaiThich: 'Đúng. "Carbon footprint" (dấu chân carbon) là tổng lượng khí thải nhà kính do các hoạt động sinh hoạt, sản xuất thải ra.',
    },
    {
      id: 4,
      noiDung: 'Rapid __________ frequently causes municipal overcrowding, traffic gridlock, and severe pressure on public housing infrastructure.',
      loaiCauHoi: 'SINGLE',
      luaChon: { A: 'urbanization', B: 'ruralization', C: 'sanitation', D: 'cultivation' },
      dapAnDung: 'A',
      giaiThich: '"Urbanization" (quá trình đô thị hóa) khi diễn ra quá nhanh sẽ gây áp lực lên hạ tầng giao thông và nhà ở.',
    },
    {
      id: 5,
      noiDung: 'Which of the following actions are recognized as environmentally sustainable practices? (Chọn tất cả đáp án đúng)',
      loaiCauHoi: 'MULTIPLE',
      luaChon: {
        A: 'Promoting circular economy and waste recycling',
        B: 'Preserving natural ecosystems and biodiversity',
        C: 'Unlimited disposal of single-use plastics into rivers',
        D: 'Investing in zero-emission electric public transit',
      },
      dapAnDung: ['A', 'B', 'D'],
      giaiThich: 'Kinh tế tuần hoàn (A), bảo tồn đa dạng sinh học (B) và phát triển xe điện công cộng (D) là các giải pháp bảo vệ môi trường bền vững. Xả rác nhựa (C) là hành vi gây ô nhiễm.',
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
  } else if (normalized.includes('giới từ') || normalized.includes('preposition')) {
    bankKey = 'PREPOSITIONS';
  } else if (normalized.includes('khuyết thiếu') || normalized.includes('modal')) {
    bankKey = 'MODAL_VERBS';
  } else if (normalized.includes('chủ vị') || normalized.includes('hòa hợp') || normalized.includes('subject-verb')) {
    bankKey = 'SUBJECT_VERB_AGREEMENT';
  } else if (normalized.includes('tường thuật') || normalized.includes('gián tiếp') || normalized.includes('reported speech')) {
    bankKey = 'REPORTED_SPEECH';
  } else if (normalized.includes('so sánh') || normalized.includes('comparative') || normalized.includes('superlative')) {
    bankKey = 'COMPARATIVES';
  } else if (normalized.includes('môi trường') || normalized.includes('xã hội') || normalized.includes('environment')) {
    bankKey = 'ENVIRONMENT_SOCIETY';
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

/**
 * Tra cứu bộ đề bài tập từ Ngân hàng đề mẫu chuẩn giáo trình trung tâm ETC.
 * Nếu chủ đề không khớp với bất kỳ bài học/ngân hàng mẫu nào, trả về null.
 */
export function findCurriculumBankExercise(
  topic: string,
  cefr: string,
  count: number = 5,
  loaiCauHoi?: string,
): FallbackExerciseSet | null {
  const normalized = topic.toLowerCase().trim();
  let bankKey: string | null = null;

  if (normalized.includes('hoàn thành') || normalized.includes('present perfect')) {
    bankKey = 'PRESENT_PERFECT';
  } else if (normalized.includes('điều kiện') || normalized.includes('conditional')) {
    bankKey = 'CONDITIONALS';
  } else if (normalized.includes('quan hệ') || normalized.includes('relative')) {
    bankKey = 'RELATIVE_CLAUSES';
  } else if (normalized.includes('bị động') || normalized.includes('passive')) {
    bankKey = 'PASSIVE_VOICE';
  } else if (normalized.includes('cụm động từ') || normalized.includes('phrasal')) {
    bankKey = 'PHRASAL_VERBS';
  } else if (normalized.includes('công sở') || normalized.includes('business')) {
    bankKey = 'BUSINESS_ENGLISH';
  } else if (normalized.includes('công nghệ') || normalized.includes('thông tin') || normalized.includes('it & tech') || normalized.includes('technology')) {
    bankKey = 'INFORMATION_TECHNOLOGY';
  } else if (normalized.includes('du lịch') || normalized.includes('khách sạn') || normalized.includes('travel') || normalized.includes('tourism')) {
    bankKey = 'TOURISM_TRAVEL';
  } else if (normalized.includes('giải trí') || normalized.includes('điện ảnh') || normalized.includes('âm nhạc') || normalized.includes('entertainment')) {
    bankKey = 'ENTERTAINMENT';
  } else if (normalized.includes('giới từ') || normalized.includes('preposition')) {
    bankKey = 'PREPOSITIONS';
  } else if (normalized.includes('khuyết thiếu') || normalized.includes('modal')) {
    bankKey = 'MODAL_VERBS';
  } else if (normalized.includes('chủ vị') || normalized.includes('hòa hợp') || normalized.includes('subject-verb')) {
    bankKey = 'SUBJECT_VERB_AGREEMENT';
  } else if (normalized.includes('tường thuật') || normalized.includes('gián tiếp') || normalized.includes('reported speech')) {
    bankKey = 'REPORTED_SPEECH';
  } else if (normalized.includes('so sánh') || normalized.includes('comparative') || normalized.includes('superlative')) {
    bankKey = 'COMPARATIVES';
  } else if (normalized.includes('môi trường') || normalized.includes('xã hội') || normalized.includes('environment')) {
    bankKey = 'ENVIRONMENT_SOCIETY';
  }

  if (!bankKey || !FALLBACK_QUESTION_BANKS[bankKey]) {
    return null;
  }

  let primaryList = [...FALLBACK_QUESTION_BANKS[bankKey]];

  if (loaiCauHoi && loaiCauHoi !== 'MIXED') {
    const filteredPrimary = primaryList.filter((q) => q.loaiCauHoi === loaiCauHoi);
    if (filteredPrimary.length > 0) {
      primaryList = filteredPrimary;
    }
  }

  const targetCount = [5, 10, 15].includes(count) ? count : 5;
  const selectedQuestions = primaryList.slice(0, targetCount);

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
