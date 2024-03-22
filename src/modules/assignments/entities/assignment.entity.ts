import { BaseEntity } from "src/database/base/base.entity";
import { Course } from "src/modules/courses/entities/course.entity";
import { ExamItem } from "src/modules/exam_items/entities/exam_item.entity";
import { Section } from "src/modules/sections/entities/section.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";

@Entity('assignments')
export class Assignment extends BaseEntity {
    @Column({
        nullable: true,
        name: 'name_assignment'
    })
    nameAssignment: string;

    @Column({
        nullable: true,
    })
    order: number;

    @ManyToOne(() => Course, course => course.assignment )
    @JoinColumn({name: 'course_id'})
    course: Course;

    @ManyToOne(() => Section, section => section.assignment )
    @JoinColumn({name: 'section_id'})
    section: Section;

    @OneToMany(() => ExamItem, examItem => examItem.assignment)
    examItem : ExamItem[];
}
