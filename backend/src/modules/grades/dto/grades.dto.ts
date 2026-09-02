import {
  IsNumber,
  IsOptional,
  IsString,
  IsArray,
  ValidateNested,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class StudentGradeDto {
  @ApiProperty({ example: 1, description: 'ID học viên' })
  @IsNumber()
  hocVienId: number;

  @ApiPropertyOptional({ example: 85.5, description: 'Điểm chuyên cần (Thang 100, trọng số 20%)' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  diemChuyenCan?: number;

  @ApiPropertyOptional({ example: 75.0, description: 'Điểm giữa kỳ (Thang 100, trọng số 30%)' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  diemGiuaKy?: number;

  @ApiPropertyOptional({ example: 80.0, description: 'Điểm cuối kỳ (Thang 100, trọng số 50%)' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  diemCuoiKy?: number;

  @ApiPropertyOptional({ example: 'Học viên tiến bộ tốt, tích cực phát biểu' })
  @IsOptional()
  @IsString()
  nhanXet?: string;
}

export class SubmitGradesDto {
  @ApiProperty({ type: [StudentGradeDto], description: 'Danh sách bảng điểm của lớp' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StudentGradeDto)
  bangDiem: StudentGradeDto[];
}
