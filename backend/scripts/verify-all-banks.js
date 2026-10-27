const { CURRICULUM_BANKS, findCurriculumBankExercise } = require('../dist/modules/ai/curriculum-bank');

console.log('=== VERIFYING ALL 15 TOPICS IN CURRICULUM BANK ===\n');

const topicKeys = Object.keys(CURRICULUM_BANKS);
console.log(`Found ${topicKeys.length} topics in CURRICULUM_BANKS.`);

let allPassed = true;

for (const key of topicKeys) {
  const bank = CURRICULUM_BANKS[key];
  const qCount = bank.questions.length;
  const levelCounts = { A1: 0, A2: 0, B1: 0, B2: 0, C1: 0 };
  const typeCounts = { SINGLE: 0, TRUE_FALSE: 0, MULTIPLE: 0 };

  for (const q of bank.questions) {
    if (levelCounts[q.trinhDo] !== undefined) levelCounts[q.trinhDo]++;
    if (typeCounts[q.loaiCauHoi] !== undefined) typeCounts[q.loaiCauHoi]++;
  }

  const levelsOk = levelCounts.A1 >= 20 && levelCounts.A2 >= 20 && levelCounts.B1 >= 20 && levelCounts.B2 >= 20 && levelCounts.C1 >= 20;
  const totalOk = qCount === 100;

  if (!totalOk || !levelsOk) {
    allPassed = false;
    console.error(`[FAIL] ${key}: total=${qCount}, levels=${JSON.stringify(levelCounts)}, types=${JSON.stringify(typeCounts)}`);
  } else {
    console.log(`[PASS] ${key.padEnd(26)}: ${qCount} questions | A1:${levelCounts.A1} A2:${levelCounts.A2} B1:${levelCounts.B1} B2:${levelCounts.B2} C1:${levelCounts.C1} | SINGLE:${typeCounts.SINGLE} TF:${typeCounts.TRUE_FALSE} MULTI:${typeCounts.MULTIPLE}`);
  }
}

console.log('\n=== TESTING findCurriculumBankExercise WITH DIFFERENT LEVELS AND TYPES ===\n');

const testCases = [
  { topic: 'CONDITIONALS', cefr: 'A1', type: 'SINGLE', count: 10 },
  { topic: 'CONDITIONALS', cefr: 'B2', type: 'TRUE_FALSE', count: 10 },
  { topic: 'CONDITIONALS', cefr: 'C1', type: 'MULTIPLE', count: 10 },
  { topic: 'CONDITIONALS', cefr: 'A1', type: 'MIXED', count: 10 },
  { topic: 'REPORTED_SPEECH', cefr: 'A1', type: 'SINGLE', count: 10 },
  { topic: 'REPORTED_SPEECH', cefr: 'B1', type: 'MIXED', count: 15 },
  { topic: 'BUSINESS_ENGLISH', cefr: 'A2', type: 'SINGLE', count: 10 },
  { topic: 'ENVIRONMENT_SOCIETY', cefr: 'C1', type: 'MULTIPLE', count: 10 },
  { topic: 'TOURISM_TRAVEL', cefr: 'A1', type: 'TRUE_FALSE', count: 10 }
];

for (const tc of testCases) {
  const result = findCurriculumBankExercise(tc.topic, tc.topic, tc.cefr, tc.count, tc.type, 1);
  if (!result || !result.cauHoi) {
    console.error(`[FAIL] findCurriculumBankExercise returned null for ${JSON.stringify(tc)}`);
    allPassed = false;
    continue;
  }

  const returnedLevels = {};
  const returnedTypes = {};
  for (const q of result.cauHoi) {
    returnedLevels[q.trinhDo] = (returnedLevels[q.trinhDo] || 0) + 1;
    returnedTypes[q.loaiCauHoi] = (returnedTypes[q.loaiCauHoi] || 0) + 1;
  }

  console.log(`Test: ${tc.topic} (CEFR: ${tc.cefr}, Type: ${tc.type}, Count: ${tc.count}) -> Returned: ${result.cauHoi.length} questions`);
  console.log(`      Levels: ${JSON.stringify(returnedLevels)} | Types: ${JSON.stringify(returnedTypes)}`);

  // Verify that for specific type, all questions match that type
  if (tc.type !== 'MIXED') {
    const wrongType = result.cauHoi.filter(q => q.loaiCauHoi !== tc.type);
    if (wrongType.length > 0) {
      console.error(`[FAIL] Found mismatched types: ${wrongType.length}`);
      allPassed = false;
    }
  }

  // Verify level purity (when bank has 20 questions for that level, it should be 100% pure)
  const targetLevelQuestions = result.cauHoi.filter(q => q.trinhDo === tc.cefr);
  if (targetLevelQuestions.length < result.cauHoi.length) {
    console.warn(`[WARN] Some questions fell back to adjacent level: ${targetLevelQuestions.length}/${result.cauHoi.length} match ${tc.cefr}`);
  }
}

console.log('\n=== SUMMARY ===');
if (allPassed) {
  console.log('ALL CHECKS PASSED PERFECTLY!');
} else {
  console.log('SOME CHECKS FAILED!');
}
