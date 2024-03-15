import { ApiProperty } from '@nestjs/swagger';

export class GetChannleDetailOptions {
  @ApiProperty()
  channelId: number;
}
