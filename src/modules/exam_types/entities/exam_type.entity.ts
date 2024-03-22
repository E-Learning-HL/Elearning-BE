import { BaseEntity } from "src/database/base/base.entity";
import { ExamItem } from "src/modules/exam_items/entities/exam_item.entity";
import { Column, Entity, OneToMany } from "typeorm";

@Entity('exam_types')
export class ExamType extends BaseEntity {
    @Column({nullable : true})
    name: string; 


    @OneToMany(() => ExamItem, examItem => examItem.examType)
    examItem: ExamItem[];
    
}
