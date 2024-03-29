import { Exclude } from 'class-transformer';
import { BaseEntity } from 'src/database/base/base.entity';
import { Enrolment } from 'src/modules/enrolments/entities/enrolment.entity';
import { Payment } from 'src/modules/payments/entities/payment.entity';
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

  @OneToMany(() => Enrolment, (enrolment) => enrolment.user)
  enrolment: Enrolment[];

  @OneToMany(() => Payment, (payment) => payment.user)
  payment: Payment[];
}
