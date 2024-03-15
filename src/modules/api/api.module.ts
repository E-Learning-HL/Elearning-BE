import { Module } from '@nestjs/common';
import { ApiSerivce } from './api.service';
import { ApiController } from './api.controller';
import { UserModule } from '../res/res.user/user.module';
import { ChannelModule } from '../website_slides/slide-channel/slide-channel.module';
import { IrModelAccessModule } from '../ir/ir.model.access/ir_model_access.module';

@Module({
  imports: [IrModelAccessModule, UserModule, ChannelModule],
  providers: [ApiSerivce],
  controllers: [ApiController],
})
export class ApiModule {}
