import { Module } from '@nestjs/common';
import { PaymentMethodsService } from './payment_methods.service';
import { PaymentMethodsController } from './payment_methods.controller';
import { PaymentMethod } from './entities/payment_method.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [PaymentMethodsController],
  providers: [PaymentMethodsService],
  exports : [PaymentMethodsService],
  imports : [
    TypeOrmModule.forFeature([PaymentMethod]),
  ]
})
export class PaymentMethodsModule {}
