import { BaseEntity } from 'src/database/base/base.entity';
import { Answer } from 'src/modules/answers/entities/answer.entity';
import { Question } from 'src/modules/questions/entities/question.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('user_answers')
export class UserAnswer extends BaseEntity {
  @Column({
    nullable: true,
    name: 'awnser_text',
  })
  answerText: string;

  @ManyToOne(() => User, (user) => user.userAnser)
  @JoinColumn({
    name: 'user_id',
  })
  user: User;

  @ManyToOne(() => Question, (question) => question.userAnser)
  @JoinColumn({
    name: 'qestion_id',
  })
  question: Question;

  @ManyToOne(() => Answer, (answer) => answer.userAnser, { nullable: true })
  @JoinColumn({
    name: 'answer_id',
  })
  answer: Answer;
}
