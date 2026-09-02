import { IsString, IsNotEmpty, IsOptional, IsEnum, IsNumber, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TrinhDoCEFR, TrangThaiKhoaHoc } from '@prisma/client';

export class CreateCourseDto {
  @ApiProperty({ example: 'KH-IELTS-65', description: 'Mã khóa học (duy nhất)' })
  @IsString()
  @IsNotEmpty()
  maKhoaHoc: string;

  @ApiProperty({ example: 'IELTS Intensive 6.5+', description: 'Tên khóa học' })
  @IsString()
  @IsNotEmpty()
  tenKhoaHoc: string;

  @ApiPropertyOptional({ example: 'Tiếng Anh' })
  @IsOptional()
  @IsString()
  ngonNgu?: string;

  @ApiProperty({ enum: TrinhDoCEFR, example: TrinhDoCEFR.B2 })
  @IsEnum(TrinhDoCEFR)
  trinhDoYeuCau: TrinhDoCEFR;

  @ApiProperty({ example: 60, description: 'Thời lượng (giờ)' })
  @IsNumber()
  @Min(1)
  thoiLuongGio: number;

  @ApiProperty({ example: 4500000, description: 'Học phí (VNĐ)' })
  @IsNumber()
  @Min(0)
  hocPhi: number;

  @ApiPropertyOptional({ example: 'Khóa học ôn luyện 4 kỹ năng chuẩn bị thi IELTS' })
  @IsOptional()
  @IsString()
  moTa?: string;
}

export class UpdateCourseDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  tenKhoaHoc?: string;

  @ApiPropertyOptional({ enum: TrinhDoCEFR })
  @IsOptional()
  @IsEnum(TrinhDoCEFR)
  trinhDoYeuCau?: TrinhDoCEFR;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(1)
  thoiLuongGio?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  hocPhi?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  moTa?: string;

  @ApiPropertyOptional({ enum: TrangThaiKhoaHoc })
  @IsOptional()
  @IsEnum(TrangThaiKhoaHoc)
  trangThai?: TrangThaiKhoaHoc;
}
