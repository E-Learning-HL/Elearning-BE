import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsString } from "class-validator";

export class CreatePaymentMethodDto {
    @ApiProperty()
    @IsString()
    name : string

    @ApiProperty()
    @IsString()
    description : string

    @ApiProperty()
    @IsBoolean()
    isActive : boolean
}
