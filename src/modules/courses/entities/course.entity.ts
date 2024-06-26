import { BaseEntity } from 'src/database/base/base.entity';
import { Enrolment } from 'src/modules/enrolments/entities/enrolment.entity';
import { Section } from 'src/modules/sections/entities/section.entity';
import { Payment } from 'src/modules/payments/entities/payment.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Assignment } from 'src/modules/assignments/entities/assignment.entity';
import { FileEntity } from 'src/modules/file/entities/file.entity';
import { PaymentDetail } from 'src/modules/payment_details/entities/payment_detail.entity';

@Entity('courses')
export class Course extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

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
  })
  listening: string;

  @Column({
    nullable: true,
  })
  speaking: string;

  @Column({
    nullable: true,
  })
  reading: string;

  @Column({
    nullable: true,
  })
  writing: string;

  @Column({
    nullable: true,
  })
  start: number;

  @Column({
    nullable: true,
  })
  target: number;

  @Column({
    nullable: true,
    default: true,
    name: 'is_active',
  })
  isActive: boolean;

  @OneToMany(() => Section, (section) => section.course, { cascade: true })
  section: Section[];

  @OneToMany(() => Assignment, (assignment) => assignment.course, {
    cascade: true,
  })
  assignment: Assignment[];

  @OneToMany(() => Enrolment, (enrolment) => enrolment.course, {
    cascade: true,
  })
  enrolment: Enrolment[];

  @OneToMany(() => FileEntity, (file) => file.course, { cascade: true })
  file: FileEntity[];

  @OneToMany(() => PaymentDetail, (paymentDetail) => paymentDetail.course, {
    cascade: true,
  })
  paymentDetail: PaymentDetail[];
}
