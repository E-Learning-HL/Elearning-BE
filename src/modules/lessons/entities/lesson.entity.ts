import { BaseEntity } from 'src/database/base/base.entity';
import { FileEntity } from 'src/modules/file/entities/file.entity';
import { Section } from 'src/modules/sections/entities/section.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('lessons')
export class Lesson extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: true,
    name: 'name_lesson',
  })
  nameLesson: string;

  @Column({
    nullable: true,
  })
  order: number;

  @Column({
    nullable: true,
    default: true,
    name: 'is_active',
  })
  isActive: boolean;

  // @Column({ nullable: true })
  // section_id: number | null;

  @ManyToOne(() => Section, (section) => section.lesson, { nullable: true })
  @JoinColumn({ name: 'section_id' })
  section: Section;

  @OneToMany(() => FileEntity, (file) => file.lesson)
  file: FileEntity[];
}
