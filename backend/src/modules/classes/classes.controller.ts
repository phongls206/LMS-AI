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
import { ClassesService } from './classes.service';
import { CreateClassDto, CreateScheduleDto, AssignTeacherDto, UpdateClassStatusDto } from './dto/classes.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { VaiTro, TrangThaiLopHoc } from '@prisma/client';

@ApiTags('Classes & Schedules')
@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  /**
   * GET /api/v1/classes — UC004 (Tất cả vai trò)
   */
  @Get('classes')
  @ApiOperation({ summary: 'Danh sách lớp học (lọc theo khóa học, trạng thái)' })
  @ApiQuery({ name: 'khoaHocId', required: false })
  @ApiQuery({ name: 'trangThai', enum: TrangThaiLopHoc, required: false })
  findAll(
    @Query('khoaHocId') khoaHocId?: number,
    @Query('trangThai') trangThai?: TrangThaiLopHoc,
  ) {
    return this.classesService.findAll(khoaHocId ? +khoaHocId : undefined, trangThai);
  }

  /**
   * POST /api/v1/classes — UC004 (Chỉ Quản lý)
   */
  @Post('classes')
  @Roles(VaiTro.QUAN_LY)
  @ApiOperation({ summary: 'Mở lớp học mới' })
  createClass(@Body() dto: CreateClassDto) {
    return this.classesService.createClass(dto);
  }

  /**
   * GET /api/v1/classes/:id — UC004 (Tất cả vai trò)
   */
  @Get('classes/:id')
  @ApiOperation({ summary: 'Xem chi tiết lớp học kèm danh sách học viên' })
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.classesService.findById(id);
  }

  /**
   * POST /api/v1/classes/:id/schedules — UC004 (Chỉ Quản lý)
   */
  @Post('classes/:id/schedules')
  @Roles(VaiTro.QUAN_LY)
  @ApiOperation({ summary: 'Thêm lịch học cho lớp (có kiểm tra chống trùng phòng)' })
  addSchedule(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateScheduleDto,
  ) {
    return this.classesService.addSchedule(id, dto);
  }

  /**
   * POST /api/v1/classes/:id/assign-teacher — UC005 (Chỉ Quản lý)
   */
  @Post('classes/:id/assign-teacher')
  @Roles(VaiTro.QUAN_LY)
  @ApiOperation({ summary: 'Phân công giáo viên (có kiểm tra chống trùng giờ dạy)' })
  assignTeacher(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AssignTeacherDto,
  ) {
    return this.classesService.assignTeacher(id, dto);
  }

  /**
   * PUT /api/v1/classes/:id/status — UC004 (Chỉ Quản lý)
   */
  @Put('classes/:id/status')
  @Roles(VaiTro.QUAN_LY)
  @ApiOperation({ summary: 'Đổi trạng thái lớp học (SAP_MO, DANG_MO_DANG_KY, DANG_HOC, DA_KET_THUC, DA_HUY)' })
  updateClassStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateClassStatusDto,
  ) {
    return this.classesService.updateClassStatus(id, dto.trangThai);
  }

  /**
   * GET /api/v1/teachers/me/schedule — UC005/UC010 (Giáo viên)
   */
  @Get('teachers/me/schedule')
  @Roles(VaiTro.GIAO_VIEN)
  @ApiOperation({ summary: 'Giáo viên xem thời khóa biểu giảng dạy cá nhân' })
  getTeacherSchedule(@CurrentUser() user: any) {
    return this.classesService.getTeacherSchedule(user.id);
  }
}
