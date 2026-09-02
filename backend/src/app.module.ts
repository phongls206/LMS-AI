import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { CoursesModule } from './modules/courses/courses.module';
import { ClassesModule } from './modules/classes/classes.module';
import { EnrollmentsModule } from './modules/enrollments/enrollments.module';
import { AttendancesModule } from './modules/attendances/attendances.module';
import { GradesModule } from './modules/grades/grades.module';
import { StatisticsModule } from './modules/statistics/statistics.module';
import { AiModule } from './modules/ai/ai.module';

@Module({
  imports: [
    // Load biến môi trường .env toàn cục
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    // Prisma CSDL (global — không cần import lại ở từng module)
    PrismaModule,
    // Các module nghiệp vụ
    AuthModule,
    UsersModule,
    CoursesModule,
    ClassesModule,
    EnrollmentsModule,
    AttendancesModule,
    GradesModule,
    StatisticsModule,
    AiModule,
  ],
})
export class AppModule {}
