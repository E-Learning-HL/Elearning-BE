import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  DefaultValuePipe,
  ParseIntPipe,
  Query,
  HttpException,
  HttpStatus,
  Put,
} from '@nestjs/common';
import { AssignmentsService } from './assignments.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Course } from '../courses/entities/course.entity';
import { Assignment } from './entities/assignment.entity';
import { ASSIGNINMENT_TYPE } from './constants/assignment-type.enum';
import { Permissions } from '../permissions/permission.decorator';
import { PermissionGuard } from '../permissions/guards/permission.guard';
import { Role } from '../roles/constants/role.enum';
import { RoleGuard } from '../roles/guards/role.guard';
import { Roles } from '../roles/role.decorator';
import { Permission } from '../permissions/constants/permission.enum';

@ApiTags('Assignments')
@Controller('assignments')
@ApiBearerAuth('access-token')
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  // @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  // @Permissions(Permission.CREATE)
  // @UseGuards(JwtAuthGuard, RoleGuard, PermissionGuard)
  @Post('create-assignment')
  async create(@Body() createAssignmentDto: CreateAssignmentDto) {
    const assignments = await this.assignmentsService.create(
      createAssignmentDto,
    );
    return assignments;
  }

  // @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  // @Permissions(Permission.READ)
  // @UseGuards(JwtAuthGuard, RoleGuard, PermissionGuard)
  @ApiQuery({ name: 'page', required: false, type: String })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'sort', required: false, type: String })
  @Get('get-list-assignments')
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit?: number,
    @Query('search') search?: string,
    @Query('sort') sort?: 'ASC' | 'DESC',
  ): Promise<{
    total: number;
    currentPage: number;
    perpage: number;
    data: Assignment[];
  }> {
    if (!search) {
      search = '';
    }
    try {
      const assignmentList = await this.assignmentsService.findAll(
        page,
        limit,
        search,
        sort,
      );
      return assignmentList;
    } catch (error) {
      throw new HttpException(
        `Failed to get list course ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  // @Permissions(Permission.READ)
  // @UseGuards(JwtAuthGuard, RoleGuard, PermissionGuard)
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.assignmentsService.findOne(id);
  }

  // @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  // @Permissions(Permission.READ)
  // @UseGuards(JwtAuthGuard, RoleGuard, PermissionGuard)
  @Get('get-exam/:courseId')
  findAllAssignmentByCourse(
    @Param('courseId') courseId: number,
  ) {
    return this.assignmentsService.findAllCourse(courseId);
  }

  // @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  // @Permissions(Permission.UPDATE)
  // @UseGuards(JwtAuthGuard, RoleGuard, PermissionGuard)
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateAssignmentDto: UpdateAssignmentDto,
  ) {
    return this.assignmentsService.update(id, updateAssignmentDto);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Permissions(Permission.DELETE)
  @UseGuards(JwtAuthGuard, RoleGuard, PermissionGuard)
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<{ message: string }> {
    const result = await this.assignmentsService.remove(id);
    return { message: result };
  }
}
