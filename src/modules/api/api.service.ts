import { Injectable, Req } from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from '../res/res.user/user.service';
import { ChannelService } from '../website_slides/slide-channel/slide-channel.service';

@Injectable()
export class ApiSerivce {
  constructor(
    private userService: UsersService,
    private channelService: ChannelService,
  ) {}
  getHomeData(@Req() request: Request) {
    return {
      user: request.user || null,
    };
  }
}
