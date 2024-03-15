import { Exclude } from 'class-transformer';
import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AbstractDto } from './dto.dto';
import { User } from 'src/modules/res/res.user/entities/user.entity';

export abstract class AbstractEntity {
  abstract toDto(): AbstractDto;
}
export class BaseEntity extends AbstractEntity {
  toDto(): AbstractDto {
    throw new Error('Method not implemented.');
  }
  @PrimaryGeneratedColumn()
  id: number;

  @UpdateDateColumn({ name: 'write_date', default: new Date() })
  updatedAt: Date = new Date();

  @Exclude()
  @CreateDateColumn({
    name: 'create_date',
    default: new Date(),
  })
  createdAt: Date = new Date();

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({
    name: 'create_uid',
  })
  createUser: User;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({
    name: 'write_uid',
  })
  writeUser: User;
}
