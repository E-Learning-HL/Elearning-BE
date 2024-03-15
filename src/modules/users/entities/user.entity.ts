import { Exclude } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { BaseEntity } from 'src/database/base/base.entity';
import {
  Column,
  Entity,
} from 'typeorm';
@Entity('accounts')
export class User extends BaseEntity {
  @Column()
  @IsNotEmpty()
  email: string;

  @Column()
  @IsNotEmpty()
  password: string;

  @Column({
    nullable : true,
    default : true
  })
  isActive: boolean;

  @Column({
    nullable : true
  })
  phone: string;

  @Column({
    nullable : true
  })
  address: string;

  @Column({
    nullable : true
  })
  name: string;
}
