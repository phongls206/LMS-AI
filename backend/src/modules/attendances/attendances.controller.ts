import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AttendancesService } from './attendances.service';
import {
  SubmitAttendanceDto,
  CreateSessionDto,
  GenerateSessionsDto,
  UpdateSessionDto,
} from './dto/attendances.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { VaiTro } from '@prisma/client';

@ApiTags('Attendances & Sessions')
@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AttendancesController {
  constructor(private readonly attendancesService: AttendancesService) {}

  /**
   * GET /api/v1/classes/:id/sessions — UC008 (Quản lý, Giáo viên)
   */
  @Get('classes/:id/sessions')
  @Roles(VaiTro.QUAN_LY, VaiTro.GIAO_VIEN)
  @ApiOperation({ summary: 'Lấy danh sách các buổi học của lớp' })
  getClassSessions(@Param('id', ParseIntPipe) id: number) {
    return this.attendancesService.getClassSessions(id);
  }

  /**
   * GET /api/v1/classes/:id/attendance-matrix — UC008 (Quản lý, Giáo viên)
   */
  @Get('classes/:id/attendance-matrix')
  @Roles(VaiTro.QUAN_LY, VaiTro.GIAO_VIEN)
  @ApiOperation({ summary: 'Lấy ma trận điểm danh toàn bộ buổi học của lớp' })
  getClassAttendanceMatrix(@Param('id', ParseIntPipe) id: number) {
    return this.attendancesService.getClassAttendanceMatrix(id);
  }

  /**
   * GET /api/v1/sessions/:id — UC008 (Quản lý, Giáo viên)
   */
  @Get('sessions/:id')
  @Roles(VaiTro.QUAN_LY, VaiTro.GIAO_VIEN)
  @ApiOperation({ summary: 'Xem chi tiết bảng điểm danh của 1 buổi học' })
  getSessionAttendance(@Param('id', ParseIntPipe) id: number) {
    return this.attendancesService.getSessionAttendance(id);
  }

  /**
   * POST /api/v1/sessions/:id/attendance — UC008 (Giáo viên, Quản lý)
   */
  @Post('sessions/:id/attendance')
  @Roles(VaiTro.GIAO_VIEN, VaiTro.QUAN_LY)
  @ApiOperation({ summary: 'Ghi nhận / Cập nhật điểm danh 4 trạng thái cho buổi học' })
  submitAttendance(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: SubmitAttendanceDto,
    @CurrentUser() user: any,
  ) {
    return this.attendancesService.submitAttendance(id, dto, user.id);
  }

  /**
   * POST /api/v1/classes/:id/generate-sessions — (Quản lý, Giáo viên)
   * Tự động sinh danh sách buổi học theo tiến trình giáo trình và lịch tuần
   */
  @Post('classes/:id/generate-sessions')
  @Roles(VaiTro.QUAN_LY, VaiTro.GIAO_VIEN)
  @ApiOperation({ summary: 'Tự động sinh danh mục buổi học cho lớp học' })
  generateSessions(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: GenerateSessionsDto,
  ) {
    return this.attendancesService.generateClassSessions(id, dto);
  }

  /**
   * POST /api/v1/classes/:id/sessions — (Quản lý, Giáo viên)
   * Tạo một buổi học lẻ cho lớp
   */
  @Post('classes/:id/sessions')
  @Roles(VaiTro.QUAN_LY, VaiTro.GIAO_VIEN)
  @ApiOperation({ summary: 'Tạo một buổi học mới cho lớp' })
  createSession(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateSessionDto,
  ) {
    return this.attendancesService.createSession(id, dto);
  }

  /**
   * PUT /api/v1/sessions/:id — (Quản lý, Giáo viên)
   * Sửa thông tin / tiêu đề của buổi học
   */
  @Put('sessions/:id')
  @Roles(VaiTro.QUAN_LY, VaiTro.GIAO_VIEN)
  @ApiOperation({ summary: 'Cập nhật thông tin / tiêu đề buổi học' })
  updateSession(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSessionDto,
  ) {
    return this.attendancesService.updateSession(id, dto);
  }

  /**
   * DELETE /api/v1/sessions/:id — (Quản lý)
   * Xóa một buổi học
   */
  @Delete('sessions/:id')
  @Roles(VaiTro.QUAN_LY)
  @ApiOperation({ summary: 'Xóa một buổi học' })
  deleteSession(@Param('id', ParseIntPipe) id: number) {
    return this.attendancesService.deleteSession(id);
  }
}
