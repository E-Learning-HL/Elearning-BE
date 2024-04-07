import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString, Length, MaxLength, MinLength } from "class-validator";

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

    @ApiProperty()
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
}

