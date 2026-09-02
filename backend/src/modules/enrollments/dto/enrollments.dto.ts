import { IsNumber, IsOptional, IsEnum, IsString, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PhuongThucThanhToan } from '@prisma/client';

export class CreateEnrollmentDto {
  @ApiProperty({ example: 1, description: 'ID hồ sơ học viên' })
  @IsNumber()
  hocVienId: number;

  @ApiProperty({ example: 1, description: 'ID lớp học' })
  @IsNumber()
  lopHocId: number;
}

export class CreatePaymentDto {
  @ApiProperty({ example: 1500000, description: 'Số tiền thanh toán (VNĐ)' })
  @IsNumber()
  @Min(1000, { message: 'Số tiền thanh toán tối thiểu là 1,000 VNĐ.' })
  soTien: number;

  @ApiProperty({ enum: PhuongThucThanhToan, example: PhuongThucThanhToan.TIEN_MAT })
  @IsEnum(PhuongThucThanhToan)
  phuongThuc: PhuongThucThanhToan;

  @ApiPropertyOptional({ example: 'Đóng học phí đợt 1' })
  @IsOptional()
  @IsString()
  ghiChu?: string;
}
