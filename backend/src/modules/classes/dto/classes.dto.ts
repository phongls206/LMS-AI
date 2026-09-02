import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsNumber,
  IsDateString,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TrangThaiLopHoc, VaiTroPhanCong } from '@prisma/client';

export class CreateClassDto {
  @ApiProperty({ example: 1, description: 'ID khóa học' })
  @IsNumber()
  khoaHocId: number;

  @ApiProperty({ example: 'IELTS-B1-02', description: 'Mã lớp học' })
  @IsString()
  @IsNotEmpty()
  maLopHoc: string;

  @ApiProperty({ example: 'IELTS B1 Tối 3-5-7', description: 'Tên lớp học' })
  @IsString()
  @IsNotEmpty()
  tenLopHoc: string;

  @ApiPropertyOptional({ example: 25, description: 'Sĩ số tối đa (1-25)' })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(25)
  siSoToiDa?: number;

  @ApiProperty({ example: '2024-10-01', description: 'Ngày bắt đầu' })
  @IsDateString()
  ngayBatDau: string;

  @ApiProperty({ example: '2024-12-30', description: 'Ngày kết thúc' })
  @IsDateString()
  ngayKetThuc: string;

  @ApiPropertyOptional({ example: 'Phòng A102' })
  @IsOptional()
  @IsString()
  phongHoc?: string;

  @ApiPropertyOptional({ example: 'https://meet.google.com/abc-def-ghi' })
  @IsOptional()
  @IsString()
  linkOnline?: string;
}

export class CreateScheduleDto {
  @ApiProperty({ example: 2, description: 'Thứ trong tuần (2=Thứ Hai ... 8=Chủ Nhật)' })
  @IsNumber()
  @Min(2)
  @Max(8)
  thuTrongTuan: number;

  @ApiProperty({ example: '18:00', description: 'Giờ bắt đầu (HH:mm)' })
  @IsString()
  @IsNotEmpty()
  gioBatDau: string;

  @ApiProperty({ example: '20:30', description: 'Giờ kết thúc (HH:mm)' })
  @IsString()
  @IsNotEmpty()
  gioKetThuc: string;

  @ApiProperty({ example: 'Phòng A101', description: 'Phòng học' })
  @IsString()
  @IsNotEmpty()
  phongHoc: string;
}

export class AssignTeacherDto {
  @ApiProperty({ example: 1, description: 'ID hồ sơ giáo viên' })
  @IsNumber()
  giaoVienId: number;

  @ApiPropertyOptional({ enum: VaiTroPhanCong, example: VaiTroPhanCong.CHINH })
  @IsOptional()
  @IsEnum(VaiTroPhanCong)
  vaiTroPhanCong?: VaiTroPhanCong;
}
