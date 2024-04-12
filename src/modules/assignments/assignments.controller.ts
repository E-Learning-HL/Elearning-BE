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

@ApiTags('Assignments')
@Controller('assignments')
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  // @ApiBearerAuth('access-token')
  // @UseGuards(JwtAuthGuard)
  @Post('create-assignment')
  async create(@Body() createAssignmentDto: CreateAssignmentDto) {
    // console.log('createAssignmentDto', createAssignmentDto);
    const assignments = await this.assignmentsService.create(
      createAssignmentDto,
    );
    return assignments;
  }

  // @ApiBearerAuth('access-token')
  // @UseGuards(JwtAuthGuard)
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

  // @ApiBearerAuth('access-token')
  // @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.assignmentsService.findOne(id);
  }

  // @ApiBearerAuth('access-token')
  // @UseGuards(JwtAuthGuard)
  @Get('get-exam/:assignmentType/:courseId')
  findAllAssignmentByCourse(
    @Param('courseId') courseId: number,
    @Param('assignmentType') assignmentType: ASSIGNINMENT_TYPE,
  ) {
    return this.assignmentsService.findAllCourse(courseId, assignmentType);
  }

  // @ApiBearerAuth('access-token')
  // @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateAssignmentDto: UpdateAssignmentDto,
  ) {
    return this.assignmentsService.update(id, updateAssignmentDto);
  }

  // @ApiBearerAuth('access-token')
  // @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<{ message: string }> {
    const result = await this.assignmentsService.remove(id);
    return { message: result };
  }
}
