import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { Lesson } from './entities/lesson.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class LessonsService {
  constructor(
    @InjectRepository(Lesson)
    private lessonRepository: Repository<Lesson>,
  ) {}
  create(createLessonDto: CreateLessonDto) {
    return 'This action adds a new lessonItem';
  }

  findAll() {
    return `This action returns all lessonItems`;
  }

  async findOne(id: number) {
    const lesson = await this.lessonRepository.findOne({
      where: { id: id },
    });
    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }
    return lesson;
  }

  update(id: number, updateLessonDto: UpdateLessonDto) {
    return `This action updates a #${id} lessonItem`;
  }

  remove(id: number) {
    return `This action removes a #${id} lessonItem`;
  }
}
