import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class GetUserOptionDto {
  @ApiPropertyOptional({
    description: 'Determine to get all active users or not.',
  })
  @Type(() => Boolean)
  active?: boolean;

  @ApiPropertyOptional({
    description: 'Get users with name.',
  })
  name: string;
  // @ApiPropertyOptional({
  //   description: 'Get users with specified rank.',
  // })
  // rank?: string;
  @ApiPropertyOptional({
    description: 'Get users with user.karma not greater than karma_max.',
  })
  @Type(() => Number)
  karma_max?: number;

  @ApiPropertyOptional({
    description: 'Get users with user.karma not lower than karma_min.',
  })
  @Type(() => Number)
  karma_min?: number;
}
