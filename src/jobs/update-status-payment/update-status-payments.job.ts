// payments-update.job.ts

import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PAYMENT_STATUS } from 'src/modules/payments/constants/payment-status.enum';
import { UpdateStatusPaymentDto } from 'src/modules/payments/dto/update-status-payment.dto';
import { PaymentsService } from 'src/modules/payments/payments.service';

@Injectable()
export class StatusPaymentsUpdateJob {
  private readonly logger = new Logger();
  constructor(private readonly paymentsService: PaymentsService) {}

  // Lập lịch chạy job cập nhật trạng thái thanh toán mỗi 10 phút
  // @Cron(CronExpression.EVERY_MINUTE)
  async handlePaymentsUpdate() {
    this.logger.debug('Running payments update job...');
    try {
      const pendingPayments = await this.paymentsService.findStatusPayments();
      if (pendingPayments?.length > 0) {
        for (const payment of pendingPayments) {
          const paymentId = payment.id;
          const updateStatusDto = new UpdateStatusPaymentDto();
          updateStatusDto.status = PAYMENT_STATUS.FAILED;
          await this.paymentsService.updateStatusPayment(
            paymentId,
            updateStatusDto,
          );
        }
        this.logger.debug('Payments update job completed successfully.');
      } else {
        this.logger.debug('No payments with status pending found.');
      }
    } catch (error) {
      this.logger.error(`Failed to run payments update job: ${error.message}`);
    }
  }
}
