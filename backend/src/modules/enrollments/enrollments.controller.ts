import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { EnrollmentsService } from './enrollments.service';
import { CreateEnrollmentDto, CreatePaymentDto } from './dto/enrollments.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { VaiTro, TrangThaiHoaDon } from '@prisma/client';

@ApiTags('Enrollments & Invoices')
@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  /**
   * POST /api/v1/enrollments — UC006 (Quản lý, Tư vấn viên, Học viên)
   */
  @Post('enrollments')
  @Roles(VaiTro.QUAN_LY, VaiTro.TU_VAN_VIEN, VaiTro.HOC_VIEN)
  @ApiOperation({
    summary: 'Đăng ký lớp học (Kiểm tra 4 điều kiện: sĩ số, trùng lặp, CEFR, lịch học + tự tạo hóa đơn)',
  })
  createEnrollment(@Body() dto: CreateEnrollmentDto) {
    return this.enrollmentsService.createEnrollment(dto);
  }

  /**
   * GET /api/v1/enrollments — UC006 (Quản lý, TVV)
   */
  @Get('enrollments')
  @Roles(VaiTro.QUAN_LY, VaiTro.TU_VAN_VIEN)
  @ApiOperation({ summary: 'Tra cứu danh sách đăng ký học' })
  @ApiQuery({ name: 'lopHocId', required: false })
  @ApiQuery({ name: 'hocVienId', required: false })
  findAllEnrollments(
    @Query('lopHocId') lopHocId?: number,
    @Query('hocVienId') hocVienId?: number,
  ) {
    return this.enrollmentsService.findAllEnrollments(
      lopHocId ? +lopHocId : undefined,
      hocVienId ? +hocVienId : undefined,
    );
  }

  /**
   * GET /api/v1/invoices — UC007 (Quản lý, TVV, Học viên)
   */
  @Get('invoices')
  @Roles(VaiTro.QUAN_LY, VaiTro.TU_VAN_VIEN, VaiTro.HOC_VIEN)
  @ApiOperation({ summary: 'Danh mục hóa đơn & công nợ học phí' })
  @ApiQuery({ name: 'trangThai', enum: TrangThaiHoaDon, required: false })
  @ApiQuery({ name: 'hocVienId', required: false })
  findAllInvoices(
    @Query('trangThai') trangThai?: TrangThaiHoaDon,
    @Query('hocVienId') hocVienId?: number,
  ) {
    return this.enrollmentsService.findAllInvoices(
      trangThai,
      hocVienId ? +hocVienId : undefined,
    );
  }

  /**
   * POST /api/v1/invoices/:id/payments — UC007 (Quản lý, TVV)
   */
  @Post('invoices/:id/payments')
  @Roles(VaiTro.QUAN_LY, VaiTro.TU_VAN_VIEN)
  @ApiOperation({ summary: 'Ghi nhận thanh toán học phí (lập phiếu thu)' })
  createPayment(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreatePaymentDto,
    @CurrentUser() user: any,
  ) {
    return this.enrollmentsService.createPayment(id, dto, user.id);
  }

  /**
   * GET /api/v1/payments — UC007 (Quản lý, TVV)
   */
  @Get('payments')
  @Roles(VaiTro.QUAN_LY, VaiTro.TU_VAN_VIEN)
  @ApiOperation({ summary: 'Danh mục phiếu thu & lịch sử thanh toán' })
  @ApiQuery({ name: 'nguoiThuId', required: false })
  @ApiQuery({ name: 'hoaDonId', required: false })
  findAllPayments(
    @Query('nguoiThuId') nguoiThuId?: number,
    @Query('hoaDonId') hoaDonId?: number,
  ) {
    return this.enrollmentsService.findAllPayments(
      nguoiThuId ? +nguoiThuId : undefined,
      hoaDonId ? +hoaDonId : undefined,
    );
  }
}
