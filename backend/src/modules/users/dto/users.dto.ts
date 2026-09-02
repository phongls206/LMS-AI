import { IsString, IsNotEmpty, IsOptional, IsEnum, IsDateString, IsEmail } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TrinhDoCEFR, TrangThaiHocVien, TrangThaiGiaoVien } from '@prisma/client';

export class CreateStudentDto {
  @ApiProperty({ example: 'student03', description: 'Tên đăng nhập' })
  @IsString()
  @IsNotEmpty()
  tenDangNhap: string;

  @ApiProperty({ example: 'Student@123', description: 'Mật khẩu khởi tạo' })
  @IsString()
  @IsNotEmpty()
  matKhau: string;

  @ApiProperty({ example: 'student03@gmail.com', description: 'Email' })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ example: '0905555001' })
  @IsOptional()
  @IsString()
  soDienThoai?: string;

  @ApiProperty({ example: 'HV003', description: 'Mã học viên (duy nhất)' })
  @IsString()
  @IsNotEmpty()
  maHocVien: string;

  @ApiProperty({ example: 'Nguyễn Văn An', description: 'Họ và tên' })
  @IsString()
  @IsNotEmpty()
  hoTen: string;

  @ApiPropertyOptional({ example: '2003-08-10' })
  @IsOptional()
  @IsDateString()
  ngaySinh?: string;

  @ApiPropertyOptional({ example: 'Nam' })
  @IsOptional()
  @IsString()
  gioiTinh?: string;

  @ApiPropertyOptional({ example: 'Hà Nội' })
  @IsOptional()
  @IsString()
  diaChi?: string;

  @ApiProperty({ enum: TrinhDoCEFR, example: TrinhDoCEFR.B1 })
  @IsEnum(TrinhDoCEFR)
  trinhDoCEFR: TrinhDoCEFR;

  @ApiPropertyOptional({ example: 'Placement Test 20/08/2024' })
  @IsOptional()
  @IsString()
  nguonDanhGia?: string;

  @ApiPropertyOptional({ example: { thu: [2, 4, 6], gio: '18:00-20:00' } })
  @IsOptional()
  lichRanhJson?: any;
}

export class UpdateStudentDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  hoTen?: string;

  @ApiPropertyOptional({ enum: TrinhDoCEFR })
  @IsOptional()
  @IsEnum(TrinhDoCEFR)
  trinhDoCEFR?: TrinhDoCEFR;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  soDienThoai?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  diaChi?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  nguonDanhGia?: string;

  @ApiPropertyOptional()
  @IsOptional()
  lichRanhJson?: any;

  @ApiPropertyOptional({ enum: TrangThaiHocVien })
  @IsOptional()
  @IsEnum(TrangThaiHocVien)
  trangThai?: TrangThaiHocVien;
}

export class CreateTeacherDto {
  @ApiProperty({ example: 'teacher04', description: 'Tên đăng nhập' })
  @IsString()
  @IsNotEmpty()
  tenDangNhap: string;

  @ApiProperty({ example: 'Teacher@123', description: 'Mật khẩu' })
  @IsString()
  @IsNotEmpty()
  matKhau: string;

  @ApiProperty({ example: 'teacher04@etc-english.vn', description: 'Email' })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ example: '0902222004' })
  @IsOptional()
  @IsString()
  soDienThoai?: string;

  @ApiProperty({ example: 'GV004', description: 'Mã giáo viên (duy nhất)' })
  @IsString()
  @IsNotEmpty()
  maGiaoVien: string;

  @ApiProperty({ example: 'Hoàng Văn Thái', description: 'Họ và tên giảng viên' })
  @IsString()
  @IsNotEmpty()
  hoTen: string;

  @ApiProperty({ example: 'IELTS Speaking & Writing', description: 'Chuyên môn' })
  @IsString()
  @IsNotEmpty()
  chuyenMon: string;

  @ApiPropertyOptional({ example: 'Thạc sĩ Lý luận & Phương pháp giảng dạy tiếng Anh (TESOL)' })
  @IsOptional()
  @IsString()
  bangCap?: string;
}

export class UpdateTeacherDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  hoTen?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  chuyenMon?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  bangCap?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  soDienThoai?: string;

  @ApiPropertyOptional({ enum: TrangThaiGiaoVien })
  @IsOptional()
  @IsEnum(TrangThaiGiaoVien)
  trangThai?: TrangThaiGiaoVien;
}
