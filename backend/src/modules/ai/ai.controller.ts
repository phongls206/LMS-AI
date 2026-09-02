import {
  Controller,
  Post,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AiService } from './ai.service';
import { ConsultClassDto, GenerateExercisesDto, SummarizeProgressDto } from './dto/ai.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { VaiTro } from '@prisma/client';

@ApiTags('GenAI Services')
@Controller('ai')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AiController {
  constructor(private readonly aiService: AiService) {}

  /**
   * POST /api/v1/ai/consult-classes — UC012 (Tư vấn viên, Học viên)
   */
  @Post('consult-classes')
  @Roles(VaiTro.TU_VAN_VIEN, VaiTro.HOC_VIEN, VaiTro.QUAN_LY)
  @ApiOperation({ summary: 'AI tư vấn gợi ý tối đa 3 lớp học phù hợp (có lọc ảo giác và fallback)' })
  consultClasses(
    @Body() dto: ConsultClassDto,
    @CurrentUser() user: any,
  ) {
    return this.aiService.consultClasses(dto, user.id);
  }

  /**
   * POST /api/v1/ai/generate-exercises — UC013 (Giáo viên, Học viên)
   */
  @Post('generate-exercises')
  @Roles(VaiTro.GIAO_VIEN, VaiTro.HOC_VIEN, VaiTro.QUAN_LY)
  @ApiOperation({ summary: 'AI sinh 5 câu trắc nghiệm chuẩn CEFR kèm giải thích' })
  generateExercises(
    @Body() dto: GenerateExercisesDto,
    @CurrentUser() user: any,
  ) {
    return this.aiService.generateExercises(dto, user.id);
  }

  /**
   * POST /api/v1/ai/summarize-progress — UC014 (Quản lý, Giáo viên, Học viên)
   */
  @Post('summarize-progress')
  @Roles(VaiTro.QUAN_LY, VaiTro.GIAO_VIEN, VaiTro.HOC_VIEN)
  @ApiOperation({ summary: 'AI tóm tắt tiến độ học tập và phân tích điểm mạnh/yếu' })
  summarizeProgress(
    @Body() dto: SummarizeProgressDto,
    @CurrentUser() user: any,
  ) {
    return this.aiService.summarizeProgress(dto, user.id);
  }
}
