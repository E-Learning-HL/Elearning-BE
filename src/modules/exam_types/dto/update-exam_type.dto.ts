import { PartialType } from '@nestjs/swagger';
import { CreateExamTypeDto } from './create-exam_type.dto';

export class UpdateExamTypeDto extends PartialType(CreateExamTypeDto) {}
