import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateStudentDto, UpdateStudentDto } from './dto/users.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { VaiTro, TrinhDoCEFR } from '@prisma/client';

@ApiTags('Users & Students')
@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * GET /api/v1/students — UC002 (Quản lý, Tư vấn viên)
   */
  @Get('students')
  @Roles(VaiTro.QUAN_LY, VaiTro.TU_VAN_VIEN)
  @ApiOperation({ summary: 'Lấy danh sách học viên (phân trang, lọc CEFR)' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'cefr', enum: TrinhDoCEFR, required: false })
  findAllStudents(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
    @Query('cefr') cefr?: TrinhDoCEFR,
  ) {
    return this.usersService.findAllStudents(+page, +limit, search, cefr);
  }

  /**
   * POST /api/v1/students — UC002 (Quản lý, Tư vấn viên)
   */
  @Post('students')
  @Roles(VaiTro.QUAN_LY, VaiTro.TU_VAN_VIEN)
  @ApiOperation({ summary: 'Tiếp nhận & tạo mới hồ sơ học viên' })
  createStudent(@Body() dto: CreateStudentDto) {
    return this.usersService.createStudent(dto);
  }

  /**
   * GET /api/v1/students/:id — UC002 (Quản lý, TVV, Học viên xem hồ sơ mình)
   */
  @Get('students/:id')
  @Roles(VaiTro.QUAN_LY, VaiTro.TU_VAN_VIEN, VaiTro.HOC_VIEN)
  @ApiOperation({ summary: 'Xem chi tiết hồ sơ học viên' })
  findStudentById(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findStudentById(id);
  }

  /**
   * PUT /api/v1/students/:id — UC002 (Quản lý, Tư vấn viên)
   */
  @Put('students/:id')
  @Roles(VaiTro.QUAN_LY, VaiTro.TU_VAN_VIEN)
  @ApiOperation({ summary: 'Cập nhật hồ sơ học viên' })
  updateStudent(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateStudentDto,
  ) {
    return this.usersService.updateStudent(id, dto);
  }

  /**
   * GET /api/v1/teachers — UC005 (Quản lý, TVV)
   */
  @Get('teachers')
  @Roles(VaiTro.QUAN_LY, VaiTro.TU_VAN_VIEN)
  @ApiOperation({ summary: 'Danh sách giáo viên & chuyên môn' })
  findAllTeachers() {
    return this.usersService.findAllTeachers();
  }
}
