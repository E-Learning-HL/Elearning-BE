import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

class Course {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  courseId: number;
}
export class CreateEnrolmentDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @ApiProperty({
    type: [Course],
  })
  @IsNotEmpty()
  course: Course[];
}
