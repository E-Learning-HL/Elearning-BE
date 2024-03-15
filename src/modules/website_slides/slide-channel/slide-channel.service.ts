import { Controller, Get, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SlideChannel } from './entities/slide_channel.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { SlideSlide } from '../slide-slide/entities/slide_slide.entity';
import { GetChannleDetailOptions } from './dtos/get_channel_detail.dto';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { PaginationResultType } from 'src/utils/types/pagination-result.type';
import { FindOptions, paginate } from 'src/utils/pagination';
import { ChannelResponseType } from './types/channel_response.type';
import { SlideCommentService } from 'src/modules/rating/rating-rating/slide_comment.service';
import { SlideChannelPartnerService } from '../slide-channel-partner/slide_channel_partner.service';

@Injectable()
export class ChannelService {
  private options = {
    select: {
      id: true,
      name: true,
      description: true,
      createdAt: true,
      seoName: true,
      totalSlides: true,
      totalTime: true,
      totalViews: true,
      totalVotes: true,
      tags: {
        name: true,
        color: true,
        id: true,
      },
    },
    where: {
      active: true,
      isPublished: true,
    },
    relations: ['tags'],
    order: {
      totalViews: {
        direction: 'DESC',
      },
    },
  } as FindOptions<SlideChannel>;
  constructor(
    @InjectRepository(SlideChannel)
    private channelRepos: Repository<SlideChannel>,
    private commentService: SlideCommentService,
    private slideChannelPartnerService: SlideChannelPartnerService,
  ) {}

  async channelsMy(
    paginationOptions: IPaginationOptions,
    belongto: number,
    options?: FindOptions<SlideChannel>,
  ) {
    const channelsMy = await paginate<SlideChannel>(
      this.channelRepos,
      paginationOptions,
      {
        ...options,
        where: {
          ...options?.where,
          partners: {
            id: belongto,
          },
        },
      },
    );
    return channelsMy;
  }
  async channelsNewest(
    paginationOptions: IPaginationOptions,
    options?: FindOptions<SlideChannel>,
  ) {
    return await paginate<SlideChannel>(this.channelRepos, paginationOptions, {
      ...options,
      order: {
        createdAt: {
          direction: 'DESC',
        },
      },
    });
  }
  async channels(
    paginationOptions: IPaginationOptions,
    options: FindOptions<SlideChannel>,
  ) {
    return await paginate<SlideChannel>(
      this.channelRepos,
      paginationOptions,
      options,
    );
  }

  /**
   *
   * @param paginationOptions : Paginate the response
   * @param belongto : Include channels that belong to a user with his id.
   * @returns
   */
  async getAll(belongto?: number): Promise<ChannelResponseType> {
    const channels = await this.channels(
      {
        limit: 999999999, // default will get all courses
        page: 1,
      },
      this.options,
    );

    // hard code
    const channelsMy =
      belongto == undefined
        ? undefined
        : await this.channelsMy(
            {
              limit: 3,
              page: 1,
            },
            belongto,
            this.options,
          );

    const channelsNewest = Array.from(channels.data)
      .sort((a, b) => {
        return b.createdAt.getTime() - a.createdAt.getTime();
      })
      .slice(0, 3);

    const channelsPopular = Array.from(channels.data)
      .sort((a, b) => {
        return b.totalVotes - a.totalVotes;
      })
      .slice(0, 3);

    return {
      channels: channels.data.slice(0, 6),
      channelsNewest,
      channelsPopular,
      channelsMy: channelsMy?.data.slice(0, 3),
    };
  }
  async getChannelDetail({ channelId }: GetChannleDetailOptions) {
    const channel = await this.channelRepos.findOne({
      where: {
        id: channelId,
      },
      select: {
        ...this.options.select,
        slides: {
          category: true,
          completionTime: true,
          dislikes: true,
          likes: true,
          downloadble: true,
          description: true,
          isActive: true,
          isPreview: true,
          name: true,
          slideCategory: true,
          slideType: true,
          id: true,
          totalSlides: true,
          totalViews: true,
        },
      },
      relations: ['slides'],
    });

    const model =
      this.channelRepos.manager.connection.getMetadata(SlideChannel).tableName;
    const comments = await this.commentService.getSlideComment(
      channelId,
      model.replace('_', '.'),
    );

    return {
      ...channel,
      comments,
    };
  }
}
