import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Payment } from '../payments/entities/payment.entity';
import { PaymentDetail } from '../payment_details/entities/payment_detail.entity';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
  imports: [
    TypeOrmModule.forFeature([User , Payment, PaymentDetail])
],
})
export class UsersModule {}
