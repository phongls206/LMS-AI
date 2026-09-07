const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const hv004 = await prisma.hoSoHocVien.findUnique({
    where: { maHocVien: 'HV004' },
    include: {
      dangKyHoc: { include: { lopHoc: true } },
      ketQua: true
    }
  });

  console.log('HV004 detail:', JSON.stringify(hv004, (k, v) => typeof v === 'bigint' ? v.toString() : v, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
