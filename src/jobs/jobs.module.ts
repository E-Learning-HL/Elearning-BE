import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { PaymentsModule } from 'src/modules/payments/payments.module';
import { StatusPaymentsUpdateJob } from './update-status-payment/update-status-payments.job';

@Module({
  controllers: [JobsController],
  providers: [JobsService, StatusPaymentsUpdateJob],
  imports: [ScheduleModule.forRoot(), PaymentsModule]
})
export class JobsModule {}
