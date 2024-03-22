import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ExamItemsService } from './exam_items.service';
import { CreateExamItemDto } from './dto/create-exam_item.dto';
import { UpdateExamItemDto } from './dto/update-exam_item.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Exam Items')
@Controller('exam-items')
export class ExamItemsController {
  constructor(private readonly examItemsService: ExamItemsService) {}

  @Post()
  create(@Body() createExamItemDto: CreateExamItemDto) {
    return this.examItemsService.create(createExamItemDto);
  }

  @Get()
  findAll() {
    return this.examItemsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.examItemsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateExamItemDto: UpdateExamItemDto) {
    return this.examItemsService.update(+id, updateExamItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.examItemsService.remove(+id);
  }
}
