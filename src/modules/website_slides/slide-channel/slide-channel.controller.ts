import {
  Controller,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ChannelService } from './slide-channel.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SlideSlideService } from '../slide-slide/slide_slide.service';
import { get } from 'http';
import { Roles } from 'src/modules/roles/roles.decorator';
import { SlideChannel } from './entities/slide_channel.entity';
import { PermissionMode } from 'src/modules/ir/ir.model.access/enum/permission.enum';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/modules/roles/guards/roles.guard';
import { JwtGuard } from 'src/modules/auth/auth/strategies/jwt.strategy';
import { PartnerService } from 'src/modules/res/res.partner/partner.service';
import { UsersService } from 'src/modules/res/res.user/user.service';
import { User } from 'src/modules/res/res.user/entities/user.entity';

@ApiBearerAuth()
@Controller({
  path: 'channels',
  version: '1',
})
@ApiTags('Channels/Courses')
export class ChannelController {
  constructor(
    private channelService: ChannelService,
    private slideService: SlideSlideService,
    private userService: UsersService,
  ) {}
  @Get()
  @Roles({
    model: SlideChannel,
    mode: PermissionMode.READ,
    acceptPublic: true,
  })
  @UseGuards(JwtGuard, RolesGuard)
  async getAllChannel(@Req() request: any) {
    const user = request.user;

    let partnerId;

    if (user && user?.id != -1) {
      const userWithId = await this.userService.findOne({
        id: user.id,
      });

      if (userWithId != null) {
        partnerId = userWithId.partner.id;
      }
    }

    return await this.channelService.getAll(partnerId);
  }
  @Get(':id')
  async getChannel(@Param('id', ParseIntPipe) id: number) {
    const channelDetail = await this.channelService.getChannelDetail({
      channelId: id,
    });
    return channelDetail;
  }
}
