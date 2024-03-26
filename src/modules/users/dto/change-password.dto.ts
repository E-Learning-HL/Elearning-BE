import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class ChangePassDTO {
  @ApiProperty()
  @MinLength(8)
  @MaxLength(20)
  @IsNotEmpty()
  oldPassword: string;

  @ApiProperty()
  @MinLength(8)
  @MaxLength(20)
  @IsNotEmpty()
  newPassword: string;
}
