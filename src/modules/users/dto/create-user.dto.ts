import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Role } from 'src/modules/roles/constants/role.enum';

export class CreateUserDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @MinLength(8)
  @MaxLength(20)
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ default: false })
  @IsBoolean()
  @IsNotEmpty()
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
  @IsNumber()
  @IsOptional()
  verificationCode: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  role: Role;
}
