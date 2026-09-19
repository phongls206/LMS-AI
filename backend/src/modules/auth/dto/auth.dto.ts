import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'admin01', description: 'Tên đăng nhập hoặc Email' })
  @IsString()
  @IsNotEmpty({ message: 'Tên đăng nhập hoặc Email không được để trống.' })
  @Matches(/^\S+$/, { message: 'Tên đăng nhập hoặc Email không được chứa khoảng trắng.' })
  @Matches(/^([a-zA-Z0-9]+|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/, {
    message: 'Tên đăng nhập chỉ được chứa chữ cái và số, không được chứa dấu gạch dưới (_) hay ký tự đặc biệt (hoặc nhập địa chỉ Email hợp lệ).',
  })
  tenDangNhap: string;

  @ApiProperty({ example: '123456', description: 'Mật khẩu' })
  @IsString()
  @IsNotEmpty({ message: 'Mật khẩu không được để trống.' })
  @Matches(/^\S+$/, { message: 'Mật khẩu không được chứa khoảng trắng.' })
  matKhau: string;
}

export class ChangePasswordDto {
  @ApiProperty({ description: 'Mật khẩu hiện tại' })
  @IsString()
  @IsNotEmpty({ message: 'Mật khẩu hiện tại không được để trống.' })
  @Matches(/^\S+$/, { message: 'Mật khẩu hiện tại không được chứa khoảng trắng.' })
  matKhauCu: string;

  @ApiProperty({ description: 'Mật khẩu mới (tối thiểu 8 ký tự, không chứa khoảng trắng)' })
  @IsString()
  @MinLength(8, { message: 'Mật khẩu mới phải có ít nhất 8 ký tự.' })
  @Matches(/^\S+$/, { message: 'Mật khẩu mới không được chứa khoảng trắng.' })
  matKhauMoi: string;
}
