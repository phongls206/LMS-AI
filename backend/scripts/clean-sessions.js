const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const sessions = await prisma.buoiHoc.findMany({
    include: { lopHoc: { include: { lichHoc: true } } },
    orderBy: { id: 'asc' }
  });

  console.log(`Tìm thấy ${sessions.length} buổi học trong DB.`);

  let updatedCount = 0;
  for (const s of sessions) {
    let cleanTopic = s.chuDe || '';
    // Strip redundant "Buổi X: " or "Buổi X : "
    while (/^Buổi\s+\d+\s*:\s*/i.test(cleanTopic)) {
      cleanTopic = cleanTopic.replace(/^Buổi\s+\d+\s*:\s*/i, '').trim();
    }

    if (cleanTopic !== s.chuDe) {
      await prisma.buoiHoc.update({
        where: { id: s.id },
        data: { chuDe: cleanTopic }
      });
      console.log(`[ID ${s.id}] '${s.chuDe}' -> '${cleanTopic}'`);
      updatedCount++;
    }
  }

  console.log(`Đã làm sạch tiêu đề cho ${updatedCount} buổi học.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
