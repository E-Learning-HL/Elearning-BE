import { BaseEntity } from 'src/database/base/base.entity';
import { ExamType } from 'src/modules/exam_types/entities/exam_type.entity';
import { Assignment } from 'src/modules/assignments/entities/assignment.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('exam_items')
export class ExamItem extends BaseEntity {
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

  @ManyToOne(() => Assignment, (assignment) => assignment.examItem)
  @JoinColumn({ name: 'exam_id' })
  assignment: Assignment;

  @ManyToOne(() => ExamType, (examType) => examType.examItem)
  @JoinColumn({ name: 'exam_type_id' })
  examType: ExamType;
}
