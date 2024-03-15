import { BaseEntity } from 'src/database/base/base.entity';
import { User } from 'src/modules/res/res.user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('gamification_goal')
export class GamificationGoal extends BaseEntity {
  @Column({
    name: 'definition_id',
  })
  definition: number;

  @ManyToOne(() => User)
  @JoinColumn({
    name: 'user_id',
  })
  user: User;

  @JoinColumn({
    name: 'line_id',
  })
  gamificationLine: number;

  @JoinColumn({
    name: 'challenge_id',
  })
  challenge: number;

  @Column({
    name: 'remind_update_delay',
  })
  remindUpdateDelay: number;

  @Column()
  state: string;

  @Column({
    name: 'start_date',
    type: 'date',
  })
  startDate: Date = new Date();

  @Column({
    name: 'end_date',
    type: 'date',
  })
  endDate: Date;

  @Column({
    name: 'last_update',
    type: 'date',
  })
  lastUpdate: Date;

  @Column({
    name: 'to_update',
  })
  toUpdate: boolean;

  @Column({
    name: 'closed',
  })
  isClosed: boolean;

  @Column({
    name: 'target_goal',
  })
  targetGoal: number;

  @Column()
  current: number;
}
