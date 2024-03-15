import { BaseEntity } from 'src/database/base/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { SlideQuestion } from '../../slide-question/entities/slide_question.entity';

@Entity('slide_answer')
export class SlideAnswer extends BaseEntity {
  @Column()
  sequence: number;
  @ManyToOne(() => SlideQuestion, (p) => p.id)
  @JoinColumn({
    name: 'question_id',
  })
  question: SlideQuestion;
  @Column({
    name: 'text_value',
    type: 'jsonb',
  })
  textValue: any;
  @Column({
    name: 'comment',
    type: 'jsonb',
  })
  comment: any;
  @Column({
    name: 'is_correct',
    type: 'boolean',
    nullable: false,
  })
  isCorrect: boolean;
}
