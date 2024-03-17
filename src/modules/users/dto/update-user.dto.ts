import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, IsBoolean, IsNotEmpty, Length, MaxLength, MinLength } from 'class-validator';

export class UpdateUserDto  {
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
    phone: string;

    @ApiProperty()
    @IsString()
    address: string;

    @ApiProperty()
    @MinLength(8)
    @MaxLength(20)
    @IsNotEmpty()
    password: string;
}
