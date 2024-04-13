import { BaseEntity } from 'src/database/base/base.entity';
import { Question } from 'src/modules/questions/entities/question.entity';
import { UserAnswer } from 'src/modules/user_answers/entities/user_answer.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity('answers')
export class Answer extends BaseEntity {
  @Column()
  content: string;

  @Column({
    // nullable: true,
    name: 'is_correct',
  })
  isCorrect: boolean;

  @ManyToOne(() => Question, (question) => question.answer)
  @JoinColumn({ name: 'question_id' })
  question: Question;

  @OneToMany(() => UserAnswer, (userAnswer) => userAnswer.answer, {
    cascade: true,
  })
  userAnswer: UserAnswer[];
}
