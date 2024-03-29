import { BaseEntity } from "src/database/base/base.entity";
import { Question } from "src/modules/questions/entities/question.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

@Entity('answers')
export class Answer extends BaseEntity {
    @Column()
    content : string

    @Column()
    isCorrect : boolean

    @ManyToOne(() => Question , (question) => question.answer)
    @JoinColumn({name : 'question_id'})
    question :  Question 
}
