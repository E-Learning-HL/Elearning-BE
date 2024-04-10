import { manualSync } from 'rimraf';
import { BaseEntity } from 'src/database/base/base.entity';
import { Task } from 'src/modules/tasks/entities/task.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { QUESTION_TYPE } from '../constants/question-type.enum';
import { Answer } from 'src/modules/answers/entities/answer.entity';
import { UserAnswer } from 'src/modules/user_answers/entities/user_answer.entity';

@Entity('questions')
export class Question extends BaseEntity {
  @Column({
    // nullable: true,
  })
  title: string;

  @Column({
    name: 'question_type',
    type: 'enum',
    enum: QUESTION_TYPE,
    // nullable: true,
  })
  questionType: QUESTION_TYPE;

  @ManyToOne(() => Task, (task) => task.question)
  @JoinColumn({ name: 'task_id' })
  task: Task;

  @OneToMany(() => Answer, (answer) => answer.question, { cascade: true })
  answer: Answer[];

  @OneToMany(() => UserAnswer, (userAnser) => userAnser.question, {
    cascade: true,
  })
  userAnser: UserAnswer[];
}
