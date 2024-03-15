import {
  Controller,
  Param,
  Get,
  Put,
  Delete,
  Body,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiResponse } from '@nestjs/swagger';
import { SlideCommentService } from './slide_comment.service';
import { Rating } from './entities/rating_rating.entity';
import { CommentUpdateDto } from './dtos/slide_comment.update.dto';
import { RatingCreateDto } from './dtos/slide_comment.create.dto';
import { ENUM_STAR_RATING } from './enums/rating.enum';
import { RatingPercent } from './interfaces/rating_percent.interface';
import { DataSource } from 'typeorm';
import { SlideChannel } from 'src/modules/website_slides/slide-channel/entities/slide_channel.entity';

@ApiBearerAuth()
@Controller({
  path: 'slide-comment',
  version: '1',
})
@ApiTags('Slide-Comment')
export class SlideCommentController {
  constructor(
    private readonly slideCommentService: SlideCommentService,
    private readonly datasource: DataSource,
  ) {}

  @Get('review/:ratingId')
  async getRating(@Param('ratingId') ratingId: number): Promise<Rating | null> {
    return await this.slideCommentService.getRating(ratingId);
  }

  @Get(':slideId/review/rating/:rating')
  async getReviewByRating(
    @Param('slideId') slideId: number,
    @Param('rating') rating: ENUM_STAR_RATING,
  ): Promise<Rating[]> {
    return await this.slideCommentService.getReviewByRating(slideId, rating);
  }

  @Get(':slideId')
  async getSlideCommentById(
    @Param('slideId') slideId: number,
  ): Promise<Rating[]> {
    const model =
      this.datasource.manager.connection.getMetadata(SlideChannel).tableName;
    return await this.slideCommentService.getSlideComment(
      slideId,
      model.replace('_', '.'),
    );
  }

  @Get('average-rating/:slideId')
  async getAverageRatingBySlide(
    @Param('slideId') slideId: number,
  ): Promise<number> {
    return await this.slideCommentService.getAverageRatingBySlide(slideId);
  }

  @Get('rating-percent/:slideId')
  async getRatingPercent(
    @Param('slideId') slideId: number,
  ): Promise<RatingPercent> {
    return await this.slideCommentService.getRatingPercent(slideId);
  }

  @Put('create-edit/:commentId/:partnerId')
  async editPublisherComment(
    @Param('commentId') commentId: number,
    @Param('partnerId') partnerId: number,
    @Body() commentUpdateDto: CommentUpdateDto,
  ): Promise<Rating> {
    return await this.slideCommentService.editComment(
      commentId,
      partnerId,
      commentUpdateDto,
    );
  }

  @Delete(':commentId')
  async deletePublisherComment(
    @Param('commentId') commentId: number,
  ): Promise<void> {
    return await this.slideCommentService.deleteComment(commentId);
  }

  @Post('review/:slideId/:partnerId')
  async createReview(
    @Param('slideId') slideId: number,
    @Param('partnerId') partnerId: number,
    @Body() ratingCreateDto: RatingCreateDto,
  ): Promise<Rating> {
    const model =
      this.datasource.manager.connection.getMetadata(SlideChannel).tableName;
    return await this.slideCommentService.createReview(
      slideId,
      partnerId,
      ratingCreateDto,
      model,
    );
  }
}
