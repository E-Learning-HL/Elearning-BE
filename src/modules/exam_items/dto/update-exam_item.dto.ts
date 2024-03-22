import { PartialType } from '@nestjs/swagger';
import { CreateExamItemDto } from './create-exam_item.dto';

export class UpdateExamItemDto extends PartialType(CreateExamItemDto) {}
