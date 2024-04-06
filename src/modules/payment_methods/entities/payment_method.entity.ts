import { BaseEntity } from "src/database/base/base.entity";
import { Payment } from "src/modules/payments/entities/payment.entity";
import { Column, Entity, OneToMany } from "typeorm";

@Entity('payment_methods')
export class PaymentMethod extends BaseEntity {
    @Column({ type: 'varchar', length: 50 })
    name: string; 
  
    @Column({ type: 'text', nullable: true })
    description: string; 

    @Column({name : 'is_active', nullable : true})
    isActive : boolean

    @OneToMany(() => Payment, payment => payment.paymentMethod)
    payments: Payment[];
}
