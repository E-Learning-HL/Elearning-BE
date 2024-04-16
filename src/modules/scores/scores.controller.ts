import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ScoresService } from './scores.service';
import { CreateScoreDto } from './dto/create-score.dto';
import { UpdateScoreDto } from './dto/update-score.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../roles/role.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RoleGuard } from '../roles/guards/role.guard';
import { PermissionGuard } from '../permissions/guards/permission.guard';
import { Role } from '../roles/constants/role.enum';
import { Permissions } from '../permissions/permission.decorator';
import { Permission } from '../permissions/constants/permission.enum';

@ApiTags('Scores')
@Controller('scores')
@ApiBearerAuth('access-token')
export class ScoresController {
  constructor(private readonly scoresService: ScoresService) {}

  @Post()
  create(@Body() createScoreDto: CreateScoreDto) {
    return this.scoresService.create(createScoreDto);
  }

  @Get()
  findAll() {
    return this.scoresService.findAll();
  }

  @Roles(Role.USER, Role.SUPER_ADMIN)
  @Permissions(Permission.READ)
  @UseGuards(JwtAuthGuard, RoleGuard, PermissionGuard)
  @Get(':id/:taskId')
  findOne(
    @Param('id') id: number,
    @Param('taskId') taskId: number
) {
    return this.scoresService.findOne(id, taskId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateScoreDto: UpdateScoreDto) {
    return this.scoresService.update(+id, updateScoreDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.scoresService.remove(+id);
  }
}
