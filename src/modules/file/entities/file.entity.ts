import { BaseEntity } from 'src/database/base/base.entity';
import { Course } from 'src/modules/courses/entities/course.entity';
import { Lesson } from 'src/modules/lessons/entities/lesson.entity';
import { Task } from 'src/modules/tasks/entities/task.entity';
import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';

@Entity('file')
export class FileEntity extends BaseEntity {
  @Column()
  url: string;

  @Column({ nullable: true })
  name: string;

  @ManyToOne(() => Course, (course) => course.file, { nullable: true })
  @JoinColumn({
    name: 'course_id',
  })
  course: Course;

  @ManyToOne(() => Lesson, (lesson) => lesson.file, { nullable: true })
  @JoinColumn({
    name: 'lesson_id',
  })
  lesson: Lesson;

  @ManyToOne(() => Task, (task) => task.file, { nullable: true })
  @JoinColumn({ name: 'task_id' })
  task: Task;
}
