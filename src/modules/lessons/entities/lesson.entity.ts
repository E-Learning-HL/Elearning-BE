import { BaseEntity } from 'src/database/base/base.entity';
import { Section } from 'src/modules/sections/entities/section.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('lessons')
export class Lesson extends BaseEntity {
  @Column({
    nullable: true,
    name: 'name_lesson',
  })
  nameLesson: string;

  @Column({
    nullable: true,
    name: 'video_url',
  })
  videoUrl: string;

  @Column({
    nullable: true,
  })
  document: string;

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

  @ManyToOne(() => Section, (section) => section.lesson)
  @JoinColumn({ name: 'section_id' })
  section: Section;
}
