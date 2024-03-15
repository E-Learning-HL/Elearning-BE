import { BaseEntity } from 'src/database/base/base.entity';
import { Column, Entity } from 'typeorm';

@Entity('gamification_karma_rank')
export class KarmaRank extends BaseEntity {
  @Column({
    name: 'karma_min',
  })
  karmaMin: number;

  @Column({
    name: 'karma_max',
  })
  karmaMax: number;

  @Column({
    type: 'jsonb',
  })
  name: any;

  @Column({
    type: 'jsonb',
  })
  description: any;

  @Column({
    type: 'jsonb',
    name: 'description_motivational',
  })
  descriptionMotivational: any;
}
