import { PartialType } from '@nestjs/swagger';
import { CreateUserAnswerDto } from './create-user_answer.dto';

export class UpdateUserAnswerDto extends PartialType(CreateUserAnswerDto) {}
