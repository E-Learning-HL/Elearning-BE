import { ApiProperty } from '@nestjs/swagger';
import { PAYMENT_STATUS } from '../constants/payment-status.enum';
import { IS_ENUM, IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateStatusPaymentDto {
  @ApiProperty()
  @IsString()
  status: PAYMENT_STATUS;
}
