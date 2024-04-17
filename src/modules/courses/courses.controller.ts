import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  HttpException,
  Put,
  Req,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Course } from './entities/course.entity';
import { Section } from '../sections/entities/section.entity';
import { Roles } from '../roles/role.decorator';
import { Role } from '../roles/constants/role.enum';
import { RoleGuard } from '../roles/guards/role.guard';
import { PermissionGuard } from '../permissions/guards/permission.guard';
import { Permissions } from '../permissions/permission.decorator';
import { Permission } from '../permissions/constants/permission.enum';

@ApiTags('Courses')
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @ApiBearerAuth('access-token')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Permissions(Permission.CREATE)
  @UseGuards(JwtAuthGuard, RoleGuard, PermissionGuard)
  @Post('create-courses')
  async create(@Body() createCourseDto: CreateCourseDto) {
    const courses = await this.coursesService.create(createCourseDto);
    return courses;
  }
  @ApiBearerAuth('access-token')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Permissions(Permission.READ)
  @UseGuards(JwtAuthGuard, RoleGuard, PermissionGuard)
  @ApiQuery({ name: 'page', required: false, type: String })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'sort', required: false, type: String })
  @Get('get-list')
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit?: number,
    @Query('search') search?: string,
    @Query('sort') sort?: 'ASC' | 'DESC',
  ): Promise<{
    total: number;
    currentPage: number;
    perpage: number;
    data: Course[];
  }> {
    if (!search) {
      search = '';
    }
    try {
      const courseList = await this.coursesService.findAll(
        page,
        limit,
        search,
        sort,
      );
      return courseList;
    } catch (error) {
      throw new HttpException(
        `Failed to get list course ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('course-level')
  getCourseLevel(
    @Query('startPoint') startPoint: number,
    @Query('endPoint') endPoint: number,
  ) {
    return this.coursesService.findCourseLevel(startPoint, endPoint);
  }

  @ApiBearerAuth('access-token')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Permissions(Permission.READ)
  @UseGuards(JwtAuthGuard, RoleGuard, PermissionGuard)
  @Get(':id')
  async findOne(@Param('id') id: number, @Req() request) {
    console.log('request.user', request.user);
    return await this.coursesService.findOne(id);
  }

  @ApiBearerAuth('access-token')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Permissions(Permission.READ)
  @UseGuards(JwtAuthGuard, RoleGuard, PermissionGuard)
  @Get('get-course-public/:id')
  async findCoursePublic(@Param('id') id: number) {
    const isActive = true;
    return await this.coursesService.findCoursePublic(id, isActive);
  }

  @Get('get-course/:id')
  async findCourse(@Param('id') id: number) {
    const isActive = true;
    return await this.coursesService.findCoursePublic(id, isActive);
  }

  @ApiBearerAuth('access-token')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Permissions(Permission.UPDATE)
  @UseGuards(JwtAuthGuard, RoleGuard, PermissionGuard)
  @Patch(':id')
  updateCourse(
    @Param('id') id: number,
    @Body() updateCourseDto: UpdateCourseDto,
  ): Promise<any> {
    return this.coursesService.update(id, updateCourseDto);
  }

  @ApiBearerAuth('access-token')
  @Roles(Role.SUPER_ADMIN)
  @Permissions(Permission.DELETE)
  @UseGuards(JwtAuthGuard, RoleGuard, PermissionGuard)
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<{ message: string }> {
    const result = await this.coursesService.deleteCourseById(id);
    return { message: result };
  }
}
