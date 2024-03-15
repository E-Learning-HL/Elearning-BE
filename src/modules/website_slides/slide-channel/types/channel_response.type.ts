import { type } from 'os';
import { SlideChannel } from '../entities/slide_channel.entity';

export type ChannelResponseType = {
  channels: SlideChannel[];
  channelsPopular: SlideChannel[];
  channelsNewest: SlideChannel[];
  channelsMy?: SlideChannel[];
  channelsRelated?: SlideChannel[];
};
