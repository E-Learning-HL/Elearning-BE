import { BaseEntity } from "src/database/base/base.entity";
import { Course } from "src/modules/courses/entities/course.entity";
import { PaymentMethod } from "src/modules/payment_methods/entities/payment_method.entity";
import { User } from "src/modules/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { PAYMENT_STATUS } from "../constants/payment-status.enum";
import { PaymentDetail } from "src/modules/payment_details/entities/payment_detail.entity";

@Entity('payments')
export class Payment extends BaseEntity {
    @ManyToOne(() => User, user => user.payment)
    @JoinColumn({
        name : 'user_id'
    })
    user: User;
  
    @Column({
        nullable : true,
        type: 'decimal', 
        precision: 10, 
        scale: 2 
    })
    amount: number;

    @Column({ 
        type: 'enum', 
        name : 'status',
        enum : PAYMENT_STATUS,
    })
    status: string;

    @ManyToOne(() => PaymentMethod, paymentMethod => paymentMethod.payments)
    @JoinColumn({
        name : 'payment_method_id'
    })
    paymentMethod: PaymentMethod;

    @OneToMany(() => PaymentDetail, (paymentDetail) => paymentDetail.course)
    paymentDetail : PaymentDetail[]
}
