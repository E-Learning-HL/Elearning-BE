import { PartialType } from "@nestjs/swagger";
import { CommentCreateDto, RatingCreateDto } from "./slide_comment.create.dto";

export class CommentUpdateDto extends PartialType(CommentCreateDto){}

export class RatingUpdate extends PartialType(RatingCreateDto){}