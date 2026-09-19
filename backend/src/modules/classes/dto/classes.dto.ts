import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsNumber,
  IsDateString,
  Min,
  Max,
  IsArray,
  IsBoolean,
  Matches,
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

  @ApiPropertyOptional({ example: 25, description: 'Sĩ số tối đa (tùy chỉnh linh hoạt)' })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(200)
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

  @ApiPropertyOptional({ example: 12, description: 'Số buổi học dự kiến' })
  @IsOptional()
  @IsNumber()
  soBuoiHoc?: number;
}

export class UpdateClassStatusDto {
  @ApiProperty({ enum: TrangThaiLopHoc, example: TrangThaiLopHoc.DANG_HOC, description: 'Trạng thái mới của lớp học' })
  @IsEnum(TrangThaiLopHoc)
  @IsNotEmpty()
  trangThai: TrangThaiLopHoc;
}

export class UpdateClassDto {
  @ApiPropertyOptional({ example: 'IELTS B1 Tối 3-5-7' })
  @IsOptional()
  @IsString()
  tenLopHoc?: string;

  @ApiPropertyOptional({ example: 25 })
  @IsOptional()
  @IsNumber()
  siSoToiDa?: number;

  @ApiPropertyOptional({ example: 'Phòng A101' })
  @IsOptional()
  @IsString()
  phongHoc?: string;

  @ApiPropertyOptional({ example: 'https://meet.google.com/abc-xyz' })
  @IsOptional()
  @IsString()
  linkOnline?: string;

  @ApiPropertyOptional({ example: '2024-10-01' })
  @IsOptional()
  @IsString()
  ngayBatDau?: string;

  @ApiPropertyOptional({ example: '2024-12-30' })
  @IsOptional()
  @IsString()
  ngayKetThuc?: string;
}

export class CreateScheduleDto {
  @ApiProperty({ example: 2, description: 'Thứ trong tuần (2=Thứ Hai ... 8=Chủ Nhật)' })
  @IsNumber()
  @Min(2)
  @Max(8)
  thuTrongTuan: number;

  @ApiProperty({ example: '18:00', description: 'Giờ bắt đầu (HH:mm)' })
  @IsString()
  @IsNotEmpty({ message: 'Giờ bắt đầu không được để trống.' })
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'Định dạng giờ bắt đầu phải là HH:mm (ví dụ 08:00 hoặc 8:00)' })
  gioBatDau: string;

  @ApiProperty({ example: '20:30', description: 'Giờ kết thúc (HH:mm)' })
  @IsString()
  @IsNotEmpty({ message: 'Giờ kết thúc không được để trống.' })
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'Định dạng giờ kết thúc phải là HH:mm (ví dụ 20:30 hoặc 10:30)' })
  gioKetThuc: string;

  @ApiProperty({ example: 'Phòng A101', description: 'Phòng học' })
  @IsString()
  @IsNotEmpty({ message: 'Phòng học không được để trống.' })
  phongHoc: string;
}

export class UpdateClassScheduleDto {
  @ApiProperty({ example: [2, 4, 6], description: 'Danh sách các thứ trong tuần (2=Thứ Hai ... 8=Chủ Nhật)' })
  @IsArray({ message: 'Danh sách ngày học phải là một mảng.' })
  thuTrongTuan: number[];

  @ApiProperty({ example: '18:00', description: 'Giờ bắt đầu (HH:mm)' })
  @IsString()
  @IsNotEmpty({ message: 'Giờ bắt đầu không được để trống.' })
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'Định dạng giờ bắt đầu phải là HH:mm (ví dụ 08:00 hoặc 8:00)' })
  gioBatDau: string;

  @ApiProperty({ example: '20:30', description: 'Giờ kết thúc (HH:mm)' })
  @IsString()
  @IsNotEmpty({ message: 'Giờ kết thúc không được để trống.' })
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'Định dạng giờ kết thúc phải là HH:mm (ví dụ 20:30 hoặc 10:30)' })
  gioKetThuc: string;

  @ApiProperty({ example: 'Phòng A101', description: 'Phòng học' })
  @IsString()
  @IsNotEmpty({ message: 'Phòng học không được để trống.' })
  phongHoc: string;

  @ApiPropertyOptional({ example: true, description: 'True = thay thế toàn bộ lịch cũ của lớp bằng lịch mới này' })
  @IsOptional()
  @IsBoolean()
  replaceExisting?: boolean;
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
