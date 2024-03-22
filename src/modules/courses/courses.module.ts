import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { Course } from './entities/course.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Section } from '../sections/entities/section.entity';
import { Lesson } from '../lessons/entities/lesson.entity';

@Module({
  controllers: [CoursesController],
  providers: [CoursesService],
  exports :[CoursesService],
  imports : [TypeOrmModule.forFeature([Course, Section, Lesson])],
})
export class CoursesModule {}
