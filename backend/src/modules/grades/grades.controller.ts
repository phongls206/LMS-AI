import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { GradesService } from './grades.service';
import { SubmitGradesDto } from './dto/grades.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { VaiTro } from '@prisma/client';

@ApiTags('Grades & Inquiries')
@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class GradesController {
  constructor(private readonly gradesService: GradesService) {}

  /**
   * GET /api/v1/classes/:id/grades — UC009 (Giáo viên, Quản lý)
   */
  @Get('classes/:id/grades')
  @Roles(VaiTro.GIAO_VIEN, VaiTro.QUAN_LY)
  @ApiOperation({ summary: 'Xem bảng điểm chi tiết của lớp học' })
  getClassGrades(@Param('id', ParseIntPipe) id: number) {
    return this.gradesService.getClassGrades(id);
  }

  /**
   * POST /api/v1/classes/:id/grades — UC009 (Giáo viên)
   */
  @Post('classes/:id/grades')
  @Roles(VaiTro.GIAO_VIEN)
  @ApiOperation({
    summary: 'Nhập điểm cho lớp & tự động tính Điểm tổng kết (20% CC + 30% GK + 50% CK)',
  })
  submitClassGrades(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: SubmitGradesDto,
  ) {
    return this.gradesService.submitClassGrades(id, dto);
  }

  /**
   * GET /api/v1/students/me/schedule — UC010 (Học viên)
   */
  @Get('students/me/schedule')
  @Roles(VaiTro.HOC_VIEN)
  @ApiOperation({ summary: 'Học viên tra cứu thời khóa biểu cá nhân' })
  getStudentSchedule(@CurrentUser() user: any) {
    return this.gradesService.getStudentSchedule(user.id);
  }

  /**
   * GET /api/v1/students/me/grades — UC010 (Học viên)
   */
  @Get('students/me/grades')
  @Roles(VaiTro.HOC_VIEN)
  @ApiOperation({ summary: 'Học viên tra cứu bảng điểm cá nhân' })
  getStudentGrades(@CurrentUser() user: any) {
    return this.gradesService.getStudentGrades(user.id);
  }
}
