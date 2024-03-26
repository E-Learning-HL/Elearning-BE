import { ApiProperty } from "@nestjs/swagger";

export class CreateLessonDto {
    @ApiProperty()
    sectionId : number

    @ApiProperty()
    nameLesson : string

    @ApiProperty()
    videoUrl : string

    @ApiProperty()
    document : string

    @ApiProperty()
    order : number
}
