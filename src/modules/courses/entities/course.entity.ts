import { BaseEntity } from 'src/database/base/base.entity';
import { Enrolment } from 'src/modules/enrolments/entities/enrolment.entity';
import { Section } from 'src/modules/sections/entities/section.entity';
import { Payment } from 'src/modules/payments/entities/payment.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Assignment } from 'src/modules/assignments/entities/assignment.entity';

@Entity('courses')
export class Course extends BaseEntity {
  @Column({
    nullable: true,
    name: 'name_course',
  })
  nameCourse: string;

  @Column({
    nullable: true,
  })
  price: number;

  @Column({
    nullable: true,
  })
  introduce: string;

  @Column({
    nullable: true,
    name: 'image_url',
  })
  imageUrl: string;

  @Column({
    nullable: true,
    default: true,
    name: 'is_active',
  })
  isActive: boolean;

  @OneToMany(() => Section, (section) => section.course)
  section: Section[];

  @OneToMany(() => Assignment, (assignment) => assignment.course)
  assignment: Assignment[];

  @OneToMany(() => Enrolment, (enrolment) => enrolment.course)
  enrolment: Enrolment[];

  @OneToMany(() => Payment, (payment) => payment.course)
  payment: Payment[];
}
