import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsNumber } from "class-validator";
import { ENUM_STAR_RATING } from "../enums/rating.enum";
import { ENUM_RATING_TEXT } from "../enums/rating_text.enum";

export class CommentCreateDto {
    @ApiProperty()
    @IsString()
    publisherComment : string 

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    publisher : number
}

export class RatingCreateDto{
    @ApiProperty()
    @IsString()
    feedback: string;

    @ApiProperty({
        enum : ENUM_RATING_TEXT
    })
    @IsNotEmpty()
    @IsString()
    ratingText: ENUM_RATING_TEXT;

    @ApiProperty({
        enum : ENUM_STAR_RATING
    })
    @IsNumber()
    @IsNotEmpty()
    rating : ENUM_STAR_RATING

}
