import { IsString, IsNotEmpty, IsEnum, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TrinhDoCEFR } from '@prisma/client';

export class ConsultClassDto {
  @ApiProperty({ enum: TrinhDoCEFR, example: TrinhDoCEFR.B1, description: 'Trình độ CEFR của học viên' })
  @IsEnum(TrinhDoCEFR)
  cefr: TrinhDoCEFR;

  @ApiPropertyOptional({
    example: { thu: [2, 4, 6], gio: '17:30-20:30' },
    description: 'Lịch rảnh của học viên',
  })
  @IsOptional()
  lichRanhJson?: any;

  @ApiPropertyOptional({
    example: 'Muốn luyện thi cấp tốc trong 2 tháng để đạt chuẩn đầu ra đại học, chú trọng kỹ năng Nói',
    description: 'Mục tiêu / Nguyện vọng học tập chi tiết bằng ngôn ngữ tự nhiên',
  })
  @IsOptional()
  @IsString()
  mucTieu?: string;
}

export class GenerateExercisesDto {
  @ApiProperty({ example: 'Tenses - Hiện tại hoàn thành', description: 'Chủ đề bài tập' })
  @IsString()
  @IsNotEmpty()
  chuDe: string;

  @ApiProperty({ enum: TrinhDoCEFR, example: TrinhDoCEFR.B1, description: 'Độ khó CEFR' })
  @IsEnum(TrinhDoCEFR)
  trinhDo: TrinhDoCEFR;

  @ApiPropertyOptional({ example: 5, description: 'Số lượng câu hỏi trắc nghiệm cần sinh (5, 10 hoặc 15)' })
  @IsOptional()
  @IsNumber()
  soLuong?: number;
}

export class SummarizeProgressDto {
  @ApiProperty({ example: 1, description: 'ID hồ sơ học viên' })
  @IsNumber()
  hocVienId: number;

  @ApiProperty({ example: 1, description: 'ID lớp học' })
  @IsNumber()
  lopHocId: number;
}
