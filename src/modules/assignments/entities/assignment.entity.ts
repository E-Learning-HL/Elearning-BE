import { BaseEntity } from 'src/database/base/base.entity';
import { Course } from 'src/modules/courses/entities/course.entity';
import { Task } from 'src/modules/tasks/entities/task.entity';
import { Section } from 'src/modules/sections/entities/section.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { ASSIGNINMENT_TYPE } from '../constants/assignment-type.enum';

@Entity('assignments')
export class Assignment extends BaseEntity {
  @Column({
    nullable: true,
    name: 'name_assignment',
  })
  nameAssignment: string;

  @Column({
    nullable: true,
  })
  order: number;

  @Column({
    name: 'assignment_type',
    type: 'enum',
    enum: ASSIGNINMENT_TYPE,
    nullable: true,
  })
  assignmentType: ASSIGNINMENT_TYPE;

  @Column({
    nullable: true,
    default: true,
    name: 'is_active',
  })
  isActive: boolean;

  @ManyToOne(() => Course, (course) => course.assignment, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'course_id' })
  course: Course;

  @ManyToOne(() => Section, (section) => section.assignment, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'section_id' })
  section: Section;

  @OneToMany(() => Task, (task) => task.assignment, { cascade: true })
  task: Task[];
}
