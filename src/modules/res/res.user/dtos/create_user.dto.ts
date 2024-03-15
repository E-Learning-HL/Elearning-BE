import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, Length } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsEmail()
  username: string;

  @ApiProperty()
  @Length(8)
  password: string;
}
