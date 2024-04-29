import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsBoolean,
  Length,
  MaxLength,
  MinLength,
  IsOptional,
} from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    example: 'admin',
  })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isActive: boolean;

  @ApiProperty()
  @IsString()
  @Length(10)
  @IsOptional()
  phone: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  address: string;

  @ApiProperty()
  @MinLength(8)
  @MaxLength(20)
  @IsOptional()
  password: string;
}
