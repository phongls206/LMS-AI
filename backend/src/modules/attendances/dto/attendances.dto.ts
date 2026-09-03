import {
  IsNumber,
  IsEnum,
  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TrangThaiDiemDanh } from '@prisma/client';

export class AttendanceRecordDto {
  @ApiProperty({ example: 1, description: 'ID học viên' })
  @IsNumber()
  hocVienId: number;

  @ApiProperty({
    enum: TrangThaiDiemDanh,
    example: TrangThaiDiemDanh.CO_MAT,
    description: 'Trạng thái điểm danh (CO_MAT, VANG, DI_MUON, CO_PHEP)',
  })
  @IsEnum(TrangThaiDiemDanh)
  trangThai: TrangThaiDiemDanh;

  @ApiPropertyOptional({ example: 'Nghỉ có phép do ốm' })
  @IsOptional()
  @IsString()
  ghiChu?: string;
}

export class SubmitAttendanceDto {
  @ApiProperty({
    type: [AttendanceRecordDto],
    description: 'Danh sách điểm danh của các học viên trong buổi học',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttendanceRecordDto)
  danhSach: AttendanceRecordDto[];
}

export class GenerateSessionsDto {
  @ApiPropertyOptional({ example: 12, description: 'Số buổi học cần sinh tự động' })
  @IsOptional()
  @IsNumber()
  soBuoiHoc?: number;

  @ApiPropertyOptional({ example: 'Unit 1: Overview', description: 'Tiêu đề hoặc chủ đề cơ bản' })
  @IsOptional()
  @IsString()
  chuDeMoi?: string;
}

export class CreateSessionDto {
  @ApiProperty({ example: 1, description: 'Số thứ tự buổi học' })
  @IsNumber()
  soThuTu: number;

  @ApiProperty({ example: '2026-09-15', description: 'Ngày diễn ra buổi học (YYYY-MM-DD)' })
  @IsString()
  ngayHoc: string;

  @ApiPropertyOptional({ example: '18:00', description: 'Giờ bắt đầu buổi học' })
  @IsOptional()
  @IsString()
  gioBatDau?: string;

  @ApiPropertyOptional({ example: '20:30', description: 'Giờ kết thúc buổi học' })
  @IsOptional()
  @IsString()
  gioKetThuc?: string;

  @ApiPropertyOptional({ example: 'Chủ đề: Ôn tập ngữ pháp & từ vựng', description: 'Tiêu đề hoặc chủ đề buổi học' })
  @IsOptional()
  @IsString()
  chuDe?: string;
}

export class UpdateSessionDto {
  @ApiPropertyOptional({ example: '2026-09-15', description: 'Ngày học (YYYY-MM-DD)' })
  @IsOptional()
  @IsString()
  ngayHoc?: string;

  @ApiPropertyOptional({ example: '18:00', description: 'Giờ bắt đầu' })
  @IsOptional()
  @IsString()
  gioBatDau?: string;

  @ApiPropertyOptional({ example: '20:30', description: 'Giờ kết thúc' })
  @IsOptional()
  @IsString()
  gioKetThuc?: string;

  @ApiPropertyOptional({ example: 'Tiêu đề buổi học', description: 'Chủ đề buổi học' })
  @IsOptional()
  @IsString()
  chuDe?: string;
}
