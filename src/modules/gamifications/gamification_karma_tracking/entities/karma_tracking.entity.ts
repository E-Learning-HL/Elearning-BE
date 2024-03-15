import { BaseEntity } from 'src/database/base/base.entity';
import { User } from 'src/modules/res/res.user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('gamification_karma_tracking')
export class KarmaTracking extends BaseEntity {
  @ManyToOne(() => User)
  @JoinColumn({
    name: 'user_id',
  })
  user: User;

  @Column({
    name: 'old_value',
  })
  oldValue: number;

  @Column({
    name: 'new_value',
  })
  newValue: number;

  @Column({
    name: 'tracking_date',
    type: 'date',
  })
  trackingDate: Date = new Date();

  @Column()
  consolidated: boolean;
}
