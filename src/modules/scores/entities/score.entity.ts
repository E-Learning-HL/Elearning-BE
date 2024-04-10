import { BaseEntity } from 'src/database/base/base.entity';
import { Task } from 'src/modules/tasks/entities/task.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('scores')
export class Score extends BaseEntity {
  @Column()
  score: number;

  @ManyToOne(() => Task, (task) => task.score)
  @JoinColumn({
    name: 'task_id',
  })
  task: Task;

  @ManyToOne(() => User, (user) => user.score)
  @JoinColumn({
    name: 'user_id',
  })
  user: User;
}
