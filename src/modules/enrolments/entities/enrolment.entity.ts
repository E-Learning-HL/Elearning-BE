import { BaseEntity } from 'src/database/base/base.entity';
import { Course } from 'src/modules/courses/entities/course.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('enrolments')
export class Enrolment extends BaseEntity {
  @ManyToOne(() => Course, (course) => course.enrolment)
  @JoinColumn({
    name: 'courseId',
  })
  course: Course;

  @ManyToOne(() => User, (user) => user.enrolment)
  @JoinColumn({
    name: 'userId',
  })
  user: User;

  @Column({
    name: 'is_active',
    nullable: true,
    default: true,
  })
  isActive: boolean;
}
