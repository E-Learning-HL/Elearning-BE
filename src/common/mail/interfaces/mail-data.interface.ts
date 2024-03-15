import { ApiProperty } from '@nestjs/swagger';
import { Any } from 'typeorm';

export class MailData<T = never> {
  @ApiProperty({
    description: 'The email address of the user who receive the mail.',
  })
  to: string;
  @ApiProperty()
  data: T;
}
