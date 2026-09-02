import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        await this.$connect();
        console.log('✅ Connected to Database successfully!');
        break;
      } catch (err: any) {
        console.warn(`[Attempt ${attempt}/3] Database connecting... (${err?.message})`);
        if (attempt < 3) {
          await new Promise((r) => setTimeout(r, 2500));
        }
      }
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
