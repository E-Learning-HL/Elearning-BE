import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { PaymentMethod } from '../payment_methods/entities/payment_method.entity';
import { Course } from '../courses/entities/course.entity';
import { PaymentDetail } from '../payment_details/entities/payment_detail.entity';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { PaymentMethodsService } from '../payment_methods/payment_methods.service';
import { UsersModule } from '../users/users.module';
import { PaymentMethodsModule } from '../payment_methods/payment_methods.module';
import { PaymentDetailsService } from '../payment_details/payment_details.service';
import { Enrolment } from '../enrolments/entities/enrolment.entity';

@Module({
  controllers: [PaymentsController],
  providers: [
    PaymentsService,
    UsersService,
    PaymentMethodsService,
    PaymentDetailsService,
  ],
  exports: [PaymentsService],
  imports: [
    TypeOrmModule.forFeature([
      Payment,
      PaymentMethod,
      PaymentDetail,
      User,
      Course,
      Enrolment,
    ]),
    PaymentMethodsModule,
    UsersModule,
  ],
})
export class PaymentsModule {}
