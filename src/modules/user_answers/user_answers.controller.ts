import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserAnswersService } from './user_answers.service';
import { CreateUserAnswerDto } from './dto/create-user_answer.dto';
import { UpdateUserAnswerDto } from './dto/update-user_answer.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../roles/role.decorator';
import { Permissions } from '../permissions/permission.decorator';
import { RoleGuard } from '../roles/guards/role.guard';
import { PermissionGuard } from '../permissions/guards/permission.guard';
import { Role } from '../roles/constants/role.enum';
import { Permission } from '../permissions/constants/permission.enum';

@ApiTags('User Answers')
@Controller('user-answers')
@ApiBearerAuth('access-token')
export class UserAnswersController {
  constructor(private readonly userAnswersService: UserAnswersService) {}

  @Roles(Role.USER, Role.SUPER_ADMIN)
  @Permissions(Permission.CREATE)
  @UseGuards(JwtAuthGuard, RoleGuard, PermissionGuard)
  @Post()
  create(
    @Req() req,
    @Body() createUserAnswerDto: CreateUserAnswerDto) {
    return this.userAnswersService.create(req.user.id,createUserAnswerDto);
  }

  @Roles(Role.USER, Role.SUPER_ADMIN)
  @Permissions(Permission.READ)
  @UseGuards(JwtAuthGuard, RoleGuard, PermissionGuard)
  @Get('get-history-answer/:taskId')
  getHistoryAnswer(
    @Req() req,
    @Param('taskId') taskId: number) {
    return this.userAnswersService.getUserAnswer(req.user.id, taskId);
  }

  @Roles(Role.USER, Role.SUPER_ADMIN)
  @Permissions(Permission.UPDATE)
  @UseGuards(JwtAuthGuard, RoleGuard, PermissionGuard)
  @Patch('redo-test')
  update(
    @Req() req,
    @Body() updateUserAnswerDto: UpdateUserAnswerDto,
  ) {
    return this.userAnswersService.updateUserAnswer(req.user.id, updateUserAnswerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userAnswersService.remove(+id);
  }
}
