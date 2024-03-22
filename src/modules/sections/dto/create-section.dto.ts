import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class CreateSectionDto  {
    @ApiProperty()
    @IsNumber()
    courseId : number

    @ApiProperty()
    @IsString()
    name : string
}
