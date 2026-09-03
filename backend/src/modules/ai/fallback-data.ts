export interface QuestionItem {
  id: number;
  noiDung: string;
  luaChon: { A: string; B: string; C: string; D: string };
  dapAnDung: 'A' | 'B' | 'C' | 'D';
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
      luaChon: { A: 'studies', B: 'has studied', C: 'studied', D: 'is studying' },
      dapAnDung: 'B',
      giaiThich: 'Dấu hiệu "since + mốc thời gian" dùng thì Hiện tại hoàn thành.',
    },
    {
      id: 5,
      noiDung: 'Look! The bus __________ at the station.',
      luaChon: { A: 'comes', B: 'is coming', C: 'came', D: 'has come' },
      dapAnDung: 'B',
      giaiThich: 'Dấu hiệu "Look!" diễn tả hành động đang xảy ra dùng Hiện tại tiếp diễn.',
    },
  ],
};

export function getFallbackExercises(topic: string, cefr: string, count: number = 5): FallbackExerciseSet {
  const normalized = topic.toLowerCase();
  let bankKey = 'DEFAULT_CEFR';

  if (normalized.includes('hoàn thành') || normalized.includes('perfect')) {
    bankKey = 'PRESENT_PERFECT';
  } else if (normalized.includes('điều kiện') || normalized.includes('conditional')) {
    bankKey = 'CONDITIONALS';
  } else if (normalized.includes('quan hệ') || normalized.includes('relative')) {
    bankKey = 'RELATIVE_CLAUSES';
  } else if (normalized.includes('bị động') || normalized.includes('passive')) {
    bankKey = 'PASSIVE_VOICE';
  } else if (normalized.includes('cụm động từ') || normalized.includes('phrasal')) {
    bankKey = 'PHRASAL_VERBS';
  } else if (normalized.includes('công sở') || normalized.includes('business') || normalized.includes('giao tiếp')) {
    bankKey = 'BUSINESS_ENGLISH';
  }

  // Lấy các câu hỏi từ ngân hàng chính và bổ sung từ các ngân hàng liên quan nếu cần 10 hoặc 15 câu
  const primaryList = FALLBACK_QUESTION_BANKS[bankKey] || FALLBACK_QUESTION_BANKS['DEFAULT_CEFR'];
  const allOtherQuestions = Object.entries(FALLBACK_QUESTION_BANKS)
    .filter(([key]) => key !== bankKey)
    .flatMap(([, qs]) => qs);

  const combined = [...primaryList, ...allOtherQuestions].sort(() => Math.random() - 0.5);
  const targetCount = [5, 10, 15].includes(count) ? count : 5;
  const selectedQuestions = combined.slice(0, targetCount);

  return {
    chuDe: topic,
    trinhDo: cefr,
    cauHoi: selectedQuestions.map((q, idx) => ({
      ...q,
      id: idx + 1,
      noiDung: q.noiDung.replace('(Chủ đề: ...)', `(Trình độ ${cefr})`),
    })),
  };
}
