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
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Course } from './entities/course.entity';

@ApiTags('Courses')
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  // @ApiBearerAuth('access-token')
  // @UseGuards(JwtAuthGuard)
  @Post('create-courses')
  async create(@Body() createCourseDto: CreateCourseDto) {
    const courses = await this.coursesService.create(createCourseDto);

    return {
      status: HttpStatus.OK,
      message: 'Create course successfully',
      courses,
      courseId: courses.id,
    };
  }

  // @ApiBearerAuth('access-token')
  // @UseGuards(JwtAuthGuard)
  @Get('get-list')
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('search') search: string,
    @Query('sort') sort: 'ASC' | 'DESC',
  ): Promise<{
    count: number;
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
        'Failed to get list course ',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // @ApiBearerAuth('access-token')
  // @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.coursesService.findOne(id);
  }

  // @ApiBearerAuth('access-token')
  // @UseGuards(JwtAuthGuard)
  @Put(':id')
  updateCourse(
    @Param('id') id: number,
    @Body() updateCourseDto: UpdateCourseDto,
  ): Promise<any> {
    return this.coursesService.update(id, updateCourseDto);
  }

  // @ApiBearerAuth('access-token')
  // @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.coursesService.remove(+id);
  }
}
