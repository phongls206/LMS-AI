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
