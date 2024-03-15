import {
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  PrimaryColumn,
  JoinColumn,
  Column,
} from 'typeorm';
import { EntityHelper } from 'src/utils/entity-helper';
import { randomUUID } from 'crypto';
import { Length } from 'class-validator';
import { User } from 'src/modules/res/res.user/entities/user.entity';

@Entity('res_users_apikeys')
export class Session extends EntityHelper {
  @PrimaryColumn()
  id: string;
  @Column()
  name: string;
  @ManyToOne(() => User, {
    eager: true,
  })
  @JoinColumn({
    name: 'user_id',
  })
  user: User;
  @Column({
    name: 'key',
    nullable: false,
  })
  token: string;
  @Column()
  @Length(8)
  index: string;
  @CreateDateColumn({
    name: 'create_date',
  })
  createdAt: Date = new Date();
}
