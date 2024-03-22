import { Injectable } from '@nestjs/common';
import { CreateExamItemDto } from './dto/create-exam_item.dto';
import { UpdateExamItemDto } from './dto/update-exam_item.dto';

@Injectable()
export class ExamItemsService {
  create(createExamItemDto: CreateExamItemDto) {
    return 'This action adds a new examItem';
  }

  findAll() {
    return `This action returns all examItems`;
  }

  findOne(id: number) {
    return `This action returns a #${id} examItem`;
  }

  update(id: number, updateExamItemDto: UpdateExamItemDto) {
    return `This action updates a #${id} examItem`;
  }

  remove(id: number) {
    return `This action removes a #${id} examItem`;
  }
}
