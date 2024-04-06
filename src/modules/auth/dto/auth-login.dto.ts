import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AuthLoginDTO {
  @ApiProperty({
    example : "linh@gmail.com"
  })
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({
    example : "12345678"
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
