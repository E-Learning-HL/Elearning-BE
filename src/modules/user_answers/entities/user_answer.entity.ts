import { BaseEntity } from 'src/database/base/base.entity';
import { Answer } from 'src/modules/answers/entities/answer.entity';
import { Question } from 'src/modules/questions/entities/question.entity';
import { Task } from 'src/modules/tasks/entities/task.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('user_answers')
export class UserAnswer extends BaseEntity {
  @Column({
    nullable: true,
    name: 'awnser_text',
  })
  answerText: string;

  @ManyToOne(() => User, (user) => user.userAnswer)
  @JoinColumn({
    name: 'user_id',
  })
  user: User;

  @ManyToOne(() => Question, (question) => question.userAnswer, {nullable: true,})
  @JoinColumn({
    name: 'qestion_id',
  })
  question: Question;

  @ManyToOne(() => Answer, (answer) => answer.userAnswer, { nullable: true })
  @JoinColumn({
    name: 'answer_id',
  })
  answer: Answer;

  @ManyToOne(() => Task, (task) => task.userAnswer) 
  @JoinColumn({
    name: 'task_id',
  })
  task: Task;
}
