import { ApiProperty } from '@nestjs/swagger';
import { bool } from 'aws-sdk/clients/signer';
import { IsBoolean } from 'class-validator';

export class UpdateEnrolmentDto {
  @ApiProperty()
  @IsBoolean()
  status: boolean;
}
