import { BaseEntity } from "src/database/base/base.entity";
import { Course } from "src/modules/courses/entities/course.entity";
import { Payment } from "src/modules/payments/entities/payment.entity";
import {  Entity, JoinColumn, ManyToOne } from "typeorm";

@Entity('payment_details')
export class PaymentDetail extends BaseEntity {
    @ManyToOne(() => Payment , payment => payment.paymentDetail )
    @JoinColumn({ 
        name : 'payment_id'
    })
    payment : Payment

    @ManyToOne(() => Course , course => course.paymentDetail )
    @JoinColumn({ 
        name : 'course_id'
    })
    course : Course

}
