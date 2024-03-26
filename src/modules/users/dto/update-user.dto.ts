import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, Length, MaxLength, MinLength } from 'class-validator';

export class UpdateUserDto  {
    @ApiProperty({
        example : "admin"
    })
    @IsString()
    name: string;

    @ApiProperty()
    @IsBoolean()
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
    password: string;
}
