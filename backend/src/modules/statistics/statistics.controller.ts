import {
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { StatisticsService } from './statistics.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { VaiTro } from '@prisma/client';

@ApiTags('Reports & Statistics')
@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  /**
   * GET /api/v1/reports/dashboard — UC011 (Chỉ Quản lý)
   */
  @Get('dashboard')
  @Roles(VaiTro.QUAN_LY)
  @ApiOperation({ summary: 'Thống kê tổng hợp: Doanh thu, Sĩ số, Tỷ lệ hoàn thành' })
  @ApiQuery({ name: 'year', required: false, example: 2024 })
  getDashboardReport(@Query('year') year?: number) {
    return this.statisticsService.getDashboardReport(year ? +year : undefined);
  }
}
