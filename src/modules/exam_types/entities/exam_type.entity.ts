import { BaseEntity } from 'src/database/base/base.entity';
import { Task } from 'src/modules/tasks/entities/task.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity('exam_types')
export class ExamType extends BaseEntity {
  @Column({ nullable: true })
  name: string;

  @OneToMany(() => Task, (task) => task.examType)
  task: Task[];
}
