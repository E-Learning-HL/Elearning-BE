import { BaseEntity } from 'src/database/base/base.entity';
import { Column, Entity } from 'typeorm';
@Entity('slide_question')
export class SlideQuestion extends BaseEntity {
  @Column()
  sequence: number;
  @Column({
    name: 'question',
    nullable: false,
    type: 'jsonb',
  })
  question: any;
}
