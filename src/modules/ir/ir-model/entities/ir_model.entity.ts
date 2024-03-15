import { BaseEntity } from '../../../../database/base/base.entity';
import { Column, Entity } from 'typeorm';

@Entity('ir_model')
export class IrModel extends BaseEntity {
  @Column({
    comment: "The model's name",
    unique: true,
    nullable: false,
  })
  model: string;

  @Column()
  order: string;

  @Column()
  state: string;

  @Column({
    type: 'jsonb',
  })
  name: any;

  @Column({
    type: 'text',
  })
  info: string;

  @Column()
  transient: boolean;
}
