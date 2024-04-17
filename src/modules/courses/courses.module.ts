import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { Course } from './entities/course.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Section } from '../sections/entities/section.entity';
import { Lesson } from '../lessons/entities/lesson.entity';
import { FileEntity } from '../file/entities/file.entity';
import { FileModule } from '../file/file.module';
import { LessonsModule } from '../lessons/lessons.module';
import { SectionsModule } from '../sections/sections.module';
import { FileService } from '../file/file.service';
import { LessonsService } from '../lessons/lessons.service';
import { SectionsService } from '../sections/sections.service';
import { RoleGuard } from '../roles/guards/role.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PermissionGuard } from '../permissions/guards/permission.guard';
import { Assignment } from '../assignments/entities/assignment.entity';
import { Task } from '../tasks/entities/task.entity';
import { Answer } from '../answers/entities/answer.entity';
import { Question } from '../questions/entities/question.entity';

@Module({
  controllers: [CoursesController],
  providers: [
    CoursesService,
    FileService,
    LessonsService,
    SectionsService,
    JwtAuthGuard,
    RoleGuard,
    PermissionGuard
  ],
  exports: [CoursesService],
  imports: [
    TypeOrmModule.forFeature([Course, Section, Lesson, FileEntity, Task, Assignment, Answer, Question]),
    FileModule,
    LessonsModule,
    SectionsModule,
  ],
})
export class CoursesModule {}
