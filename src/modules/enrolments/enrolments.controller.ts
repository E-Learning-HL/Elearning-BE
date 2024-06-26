import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  DefaultValuePipe,
  HttpException,
  HttpStatus,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { EnrolmentsService } from './enrolments.service';
import { CreateEnrolmentDto } from './dto/create-enrolment.dto';
import { UpdateEnrolmentDto } from './dto/update-enrolment.dto';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { Enrolment } from './entities/enrolment.entity';

@ApiTags('Enrolments')
@Controller('enrolments')
export class EnrolmentsController {
  constructor(private readonly enrolmentsService: EnrolmentsService) {}

  @Post()
  create(@Body() createEnrolmentDto: CreateEnrolmentDto) {
    return this.enrolmentsService.create(createEnrolmentDto);
  }

  // @ApiBearerAuth('access-token')
  // @UseGuards(JwtAuthGuard)
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
    data: Enrolment[];
  }> {
    if (!search) {
      search = '';
    }
    try {
      const paymentList = await this.enrolmentsService.findAll(
        page,
        limit,
        search,
        sort,
      );
      return paymentList;
    } catch (error) {
      throw new HttpException(
        `Failed to get list enrolment ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.enrolmentsService.findOne(+id);
  }

  // @ApiBearerAuth('access-token')
  // @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateEnrolmentDto: UpdateEnrolmentDto,
  ) {
    return this.enrolmentsService.update(id, updateEnrolmentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.enrolmentsService.remove(+id);
  }
}
