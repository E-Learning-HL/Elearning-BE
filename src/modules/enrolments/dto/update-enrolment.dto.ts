import { PartialType } from '@nestjs/swagger';
import { CreateEnrolmentDto } from './create-enrolment.dto';

export class UpdateEnrolmentDto extends PartialType(CreateEnrolmentDto) {}
