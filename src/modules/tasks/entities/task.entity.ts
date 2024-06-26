import { BaseEntity } from 'src/database/base/base.entity';
import { Assignment } from 'src/modules/assignments/entities/assignment.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { FileEntity } from 'src/modules/file/entities/file.entity';
import { Question } from 'src/modules/questions/entities/question.entity';
import { TASK_TYPE } from '../constants/task-type.enum';
import { Score } from 'src/modules/scores/entities/score.entity';

@Entity('tasks')
export class Task extends BaseEntity {
  @Column({
    nullable: true,
  })
  content: string;

  @ManyToOne(() => Assignment, (assignment) => assignment.task, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'assignment_id' })
  assignment: Assignment;

  @Column({
    name: 'task_type',
    type: 'enum',
    enum: TASK_TYPE,
  })
  taskType: TASK_TYPE;

  @OneToMany(() => FileEntity, (file) => file.task, { cascade: true })
  file: FileEntity[];

  @OneToMany(() => Question, (question) => question.task, { cascade: true })
  question: Question[];

  @OneToMany(() => Score, (score) => score.task, { cascade: true })
  score: Score[];
}
