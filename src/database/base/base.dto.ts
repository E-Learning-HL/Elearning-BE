import { ApiProperty } from '@nestjs/swagger';
import { AbstractDto } from './dto.dto';

export abstract class BaseDto extends AbstractDto {
  @ApiProperty()
  id: number;
  @ApiProperty({
    default: 'Current datetime.',
  })
  createdAt: Date;
  @ApiProperty({
    default: 'Current datetime.',
  })
  deletedAt: Date;
  @ApiProperty({
    default: 'Current datetime.',
  })
  updatedAt: Date;
}
