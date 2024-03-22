import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class UpdateStatusUserDto  {
    @ApiProperty()
    @IsBoolean()
    @IsNotEmpty()
    isActive: boolean;
}