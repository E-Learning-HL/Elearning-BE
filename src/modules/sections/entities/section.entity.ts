import { BaseEntity } from 'src/database/base/base.entity';
import { Assignment } from 'src/modules/assignments/entities/assignment.entity';
import { Course } from 'src/modules/courses/entities/course.entity';
import { Lesson } from 'src/modules/lessons/entities/lesson.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity('sections')
export class Section extends BaseEntity {
  @Column({
    nullable: true,
    name: 'name_section',
  })
  nameSection: string;

  @ManyToOne(() => Course, (course) => course.section)
  @JoinColumn({ name: 'course_id' })
  course: Course;

  @OneToMany(() => Lesson, (lesson) => lesson.section, { cascade: true })
  lesson: Lesson[];

  @OneToMany(() => Assignment, (assignment) => assignment.section, {
    cascade: true,
  })
  assignment: Assignment[];
}
