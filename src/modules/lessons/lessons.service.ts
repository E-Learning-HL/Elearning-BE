import { Injectable } from '@nestjs/common';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';

@Injectable()
export class LessonsService {
  create(createLessonDto: CreateLessonDto) {
    return 'This action adds a new lessonItem';
  }

  findAll() {
    return `This action returns all lessonItems`;
  }

  findOne(id: number) {
    return `This action returns a #${id} lessonItem`;
  }

  update(id: number, updateLessonDto: UpdateLessonDto) {
    return `This action updates a #${id} lessonItem`;
  }

  remove(id: number) {
    return `This action removes a #${id} lessonItem`;
  }
}
