import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SlideSlide } from './entities/slide_slide.entity';
import { Any, Repository } from 'typeorm';
import { SlideCommentService } from 'src/modules/rating/rating-rating/slide_comment.service';

@Injectable()
export class SlideSlideService {
  constructor(
    @InjectRepository(SlideSlide) private slideRepos: Repository<SlideSlide>,
  ) {}

  public async get(channelId: number) {
    const slidesInChannel = await this.slideRepos.find({
      where: {
        channel: {
          id: channelId,
          isPublished: true,
        },
      },
    });

    return slidesInChannel;
  }
}
