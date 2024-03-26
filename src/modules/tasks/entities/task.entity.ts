import { BaseEntity } from 'src/database/base/base.entity';
import { ExamType } from 'src/modules/exam_types/entities/exam_type.entity';
import { Assignment } from 'src/modules/assignments/entities/assignment.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { FileEntity } from 'src/modules/file/entities/file.entity';

@Entity('tasks')
export class Task extends BaseEntity {
  @Column({
    nullable: true,
  })
  title: string;

  @Column({
    nullable: true,
  })
  content: string;

  @Column({
    nullable: true,
  })
  audio: string;

  @Column({
    nullable: true,
  })
  document: string;

  @Column({
    nullable: true,
    default: true,
    name: 'is_active',
  })
  isActive: boolean;

  @ManyToOne(() => Assignment, (assignment) => assignment.task)
  @JoinColumn({ name: 'assignment_id' })
  assignment: Assignment;

  @ManyToOne(() => ExamType, (examType) => examType.task)
  @JoinColumn({ name: 'exam_type_id' })
  examType: ExamType;

  @OneToMany(() => FileEntity, (file) => file.course)
  file: FileEntity[];
}
