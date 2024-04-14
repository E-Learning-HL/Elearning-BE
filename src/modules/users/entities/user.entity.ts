import { Exclude } from 'class-transformer';
import { BaseEntity } from 'src/database/base/base.entity';
import { Enrolment } from 'src/modules/enrolments/entities/enrolment.entity';
import { Payment } from 'src/modules/payments/entities/payment.entity';
import { Score } from 'src/modules/scores/entities/score.entity';
import { UserAnswer } from 'src/modules/user_answers/entities/user_answer.entity';
import { Column, Entity, OneToMany } from 'typeorm';
@Entity('accounts')
export class User extends BaseEntity {
  @Column({
    nullable: false,
    unique: true,
  })
  email: string;

  @Column({
    nullable: false,
  })
  password: string;

  @Column({
    nullable: true,
    default: true,
    name :'is_active'
  })
  isActive: boolean;

  @Column({
    nullable: true,
  })
  phone: string;

  @Column({
    nullable: true,
  })
  address: string;

  @Column({
    nullable: true,
  })
  name: string;

  @Column({
    nullable : true,
    name :'verification_code'
  })
  verificationCode : number

  @OneToMany(() => Enrolment, (enrolment) => enrolment.user, { cascade: true })
  enrolment: Enrolment[];

  @OneToMany(() => Payment, (payment) => payment.user, { cascade: true })
  payment: Payment[];

  @OneToMany(() => Score, (score) => score.user, { cascade: true })
  score: Score[];

  @OneToMany(() => UserAnswer, (userAnswer) => userAnswer.user, { cascade: true })
  userAnswer: UserAnswer[];
}
