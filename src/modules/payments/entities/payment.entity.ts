import { BaseEntity } from "src/database/base/base.entity";
import { Course } from "src/modules/courses/entities/course.entity";
import { PaymentMethod } from "src/modules/payment_methods/entities/payment_method.entity";
import { User } from "src/modules/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

@Entity('payments')
export class Payment extends BaseEntity {
    @ManyToOne(() => User, user => user.payment)
    @JoinColumn({
        name : 'user_id'
    })
    user: User;
  
    @ManyToOne(() => Course, course => course.payment)
    @JoinColumn({
        name : 'course_id'
    })
    course: Course;
  
    @Column({
        nullable : true,
        type: 'decimal', 
        precision: 10, 
        scale: 2 
    })
    amount: number;

    @Column({ 
        type: 'boolean', 
        default: false,
        name : 'is_paid'
    })
    isPaid: boolean;

    @ManyToOne(() => PaymentMethod, paymentMethod => paymentMethod.payments)
    @JoinColumn({
        name : 'payment_method_id'
    })
    paymentMethod: PaymentMethod;
}
