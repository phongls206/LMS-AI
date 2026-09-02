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
import { CoursesService } from './courses.service';
import { CreateCourseDto, UpdateCourseDto } from './dto/courses.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { VaiTro, TrinhDoCEFR, TrangThaiKhoaHoc } from '@prisma/client';

@ApiTags('Courses')
@Controller('courses')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  /**
   * GET /api/v1/courses — UC003 (Tất cả vai trò đã đăng nhập)
   */
  @Get()
  @ApiOperation({ summary: 'Danh mục tất cả các khóa học' })
  @ApiQuery({ name: 'trinhDo', enum: TrinhDoCEFR, required: false })
  @ApiQuery({ name: 'trangThai', enum: TrangThaiKhoaHoc, required: false })
  findAll(
    @Query('trinhDo') trinhDo?: TrinhDoCEFR,
    @Query('trangThai') trangThai?: TrangThaiKhoaHoc,
  ) {
    return this.coursesService.findAll(trinhDo, trangThai);
  }

  /**
   * GET /api/v1/courses/:id — UC003 (Tất cả vai trò)
   */
  @Get(':id')
  @ApiOperation({ summary: 'Xem chi tiết khóa học' })
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.coursesService.findById(id);
  }

  /**
   * POST /api/v1/courses — UC003 (Chỉ Quản lý)
   */
  @Post()
  @Roles(VaiTro.QUAN_LY)
  @ApiOperation({ summary: 'Tạo mới khóa học đào tạo' })
  create(@Body() dto: CreateCourseDto) {
    return this.coursesService.create(dto);
  }

  /**
   * PUT /api/v1/courses/:id — UC003 (Chỉ Quản lý)
   */
  @Put(':id')
  @Roles(VaiTro.QUAN_LY)
  @ApiOperation({ summary: 'Cập nhật thông tin khóa học' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCourseDto,
  ) {
    return this.coursesService.update(id, dto);
  }
}
