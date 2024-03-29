import { manualSync } from "rimraf";
import { BaseEntity } from "src/database/base/base.entity";
import { Task } from "src/modules/tasks/entities/task.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { QUESTION_TYPE } from "../constants/question-type.enum";
import { Answer } from "src/modules/answers/entities/answer.entity";

@Entity('questions')
export class Question extends BaseEntity {
    @Column()
    title : string

    @Column({
        name : 'question_type',
        type: "enum",
        enum: QUESTION_TYPE,
    })
    questionType :  QUESTION_TYPE 

    @ManyToOne(() => Task , (task) => task.question)
    @JoinColumn({name : 'task_id'})
    task : Task

    @OneToMany(() => Answer, (answer) => answer.question) 
    answer : Answer[]
}
