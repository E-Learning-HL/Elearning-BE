import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EqualOperator, Repository } from 'typeorm';
import { Rating } from './entities/rating_rating.entity';
import { Exception } from 'handlebars';
import { IrModel } from '../../ir/ir-model/entities/ir_model.entity';
import { CommentUpdateDto } from './dtos/slide_comment.update.dto';
import { Partner } from 'src/modules/res/res.partner/entities/partner.entity';
import { RatingCreateDto } from './dtos/slide_comment.create.dto';
import { ENUM_STAR_RATING } from './enums/rating.enum';
import { ENUM_RATING_TEXT } from './enums/rating_text.enum';
import { RatingPercent } from './interfaces/rating_percent.interface';
import { v4 as uuidv4 } from 'uuid';
import { SlideChannel } from 'src/modules/website_slides/slide-channel/entities/slide_channel.entity';
import { User } from 'src/modules/res/res.user/entities/user.entity';
import { Language } from 'src/i18n/enums/language.enum';
import { MailMessage } from '../../mail-message/entities/mail-message.entity';

@Injectable()
export class SlideCommentService {
  // the id of slide.channel in ir.model table

  // convert star rating to rating text
  private getRatingTextFromRating(rating: ENUM_STAR_RATING): ENUM_RATING_TEXT {
    switch (rating) {
      case ENUM_STAR_RATING.ONE:
      case ENUM_STAR_RATING.TWO:
        return ENUM_RATING_TEXT.KO;
      case ENUM_STAR_RATING.THREE:
        return ENUM_RATING_TEXT.OK;
      case ENUM_STAR_RATING.FOUR:
      case ENUM_STAR_RATING.FIVE:
        return ENUM_RATING_TEXT.TOP;
      default:
        throw new Error(`Invalid rating: ${rating}`);
    }
  }
  constructor(
    @InjectRepository(Rating) private ratingRepos: Repository<Rating>,
    @InjectRepository(IrModel) private irModelRepos: Repository<IrModel>,
    @InjectRepository(Partner) private partnerRepos: Repository<Partner>,
    @InjectRepository(SlideChannel)
    private slideChannelRepos: Repository<SlideChannel>,
    @InjectRepository(User) private userRepos: Repository<User>,
    @InjectRepository(MailMessage)
    private mailMessageRepos: Repository<MailMessage>,
  ) {}

  async getRating(ratingId: number): Promise<Rating | null> {
    return await this.ratingRepos.findOne({
      where: { id: ratingId },
      relations: [
        'model',
        'user',
        'messageId',
        'ratedPartner',
        'publisher',
        'createUid',
        'writeUid',
      ],
      select: {
        model: { id: true },
        user: { id: true },
        messageId: { id: true },
        ratedPartner: { id: true },
        publisher: { id: true },
        createUid: { id: true },
        writeUid: { id: true },
      },
    });
  }

  async getReviewByRating(
    slideId: number,
    rating: ENUM_STAR_RATING,
  ): Promise<Rating[]> {
    const reviews = await this.ratingRepos.find({
      where: {
        resId: slideId,
        rating: rating,
      },
      relations: ['model', 'user', 'publisher'],
      select: {
        id: true,
        feedback: true,
        ratingText: true,
        rating: true,
        publisher: {
          id: true,
          name: true,
          email: true,
        },
        publisherComment: true,
        publisherDatetime: true,
        createdAt: true,
      },
    });

    if (reviews.length === 0) {
      throw new NotFoundException(
        `No reviews found for slide with id ${slideId} and rating  ${rating}`,
      );
    }

    return reviews;
  }

  async getSlideComment(slideId: number, model: string) {
    if (slideId == undefined) {
      throw new Exception('SlideId is required.');
    }
    const channel = await this.irModelRepos.findOne({
      where: {
        model: model,
      },
    });

    if (channel == null) {
      throw new Exception('Model ' + model + ' is not exist.');
    }

    const comments = await this.ratingRepos.find({
      where: {
        model: {
          id: channel.id,
        },
        resId: slideId,
      },
      relations: ['model', 'user', 'publisher'],
      select: {
        id: true,
        feedback: true,
        ratingText: true,
        rating: true,
        publisher: {
          id: true,
          name: true,
          email: true,
        },
        publisherComment: true,
        publisherDatetime: true,
        createdAt: true,
      },
    });
    return comments;
  }

  async getAverageRatingBySlide(slideId: number): Promise<number> {
    const ratings = await this.ratingRepos.find({
      where: {
        resId: slideId,
      },
    });

    if (ratings.length === 0) {
      return 0;
    }

    const totalRating = ratings.reduce(
      (total, rating) => total + rating.rating,
      0,
    );
    const averageRating = totalRating / ratings.length;
    return parseFloat(averageRating.toFixed(2));
  }

  async getRatingPercent(slideId: number): Promise<RatingPercent> {
    const slideRatings = await this.ratingRepos.find({
      where: {
        resId: slideId,
      },
    });

    const totalRatings = slideRatings.length;
    if (totalRatings === 0) {
      return {
        slideId: slideId,
        ratingOne: 0,
        ratingTwo: 0,
        ratingThree: 0,
        ratingFour: 0,
        ratingFive: 0,
      };
    }

    const oneStarCount = slideRatings.filter(
      (rating) => rating.rating === 1,
    ).length;
    const twoStarCount = slideRatings.filter(
      (rating) => rating.rating === 2,
    ).length;
    const threeStarCount = slideRatings.filter(
      (rating) => rating.rating === 3,
    ).length;
    const fourStarCount = slideRatings.filter(
      (rating) => rating.rating === 4,
    ).length;
    const fiveStarCount = slideRatings.filter(
      (rating) => rating.rating === 5,
    ).length;

    const oneStarPercentage = (oneStarCount / totalRatings) * 100;
    const twoStarPercentage = (twoStarCount / totalRatings) * 100;
    const threeStarPercentage = (threeStarCount / totalRatings) * 100;
    const fourStarPercentage = (fourStarCount / totalRatings) * 100;
    const fiveStarPercentage = (fiveStarCount / totalRatings) * 100;

    return {
      slideId: slideId,
      ratingOne: parseFloat(oneStarPercentage.toFixed(2)),
      ratingTwo: parseFloat(twoStarPercentage.toFixed(2)),
      ratingThree: parseFloat(threeStarPercentage.toFixed(2)),
      ratingFour: parseFloat(fourStarPercentage.toFixed(2)),
      ratingFive: parseFloat(fiveStarPercentage.toFixed(2)),
    };
  }

  async editComment(
    commentId: number,
    partnerId: number,
    commentUpdateDto: CommentUpdateDto,
  ): Promise<Rating> {
    const comment = await this.ratingRepos.findOne({
      where: { id: commentId },
      relations: ['user'],
    });

    if (!comment) {
      throw new NotFoundException(`Comment with id ${commentId} not found`);
    }

    const publisher = await this.partnerRepos.findOne({
      where: { id: partnerId },
    });
    if (!publisher) {
      throw new NotFoundException(`Publisher with id ${partnerId} not found`);
    }
    comment.publisher = publisher;
    comment.publisherComment =
      commentUpdateDto.publisherComment ?? comment.publisherComment;
    return await this.ratingRepos.save(comment);
  }

  async deleteComment(commentId: number) {
    const comment = await this.ratingRepos.findOne({
      where: { id: commentId },
      relations: ['user'],
    });

    if (!comment) {
      throw new NotFoundException(`Comment with id ${commentId} not found`);
    }

    if (comment.publisher && comment.publisherComment) {
      comment.publisherComment = '';
      await this.ratingRepos.save(comment);
    }
  }
  /**
   * Mình không fix cứng cái model id nữa vì cái model id này nó không cố định(luôn thay đổi nếu
   *  database thay đổi), thay nó bằng cái tên model.
   */
  async createReview(
    slideId: number,
    partnerId: number,
    ratingCreateDto: RatingCreateDto,
    model: string,
  ): Promise<Rating> {
    const { feedback, ratingText, rating } = ratingCreateDto;

    const channel = await this.irModelRepos.findOne({
      where: { model: model },
    });
    if (!channel) {
      throw new NotFoundException(`Channel with id ${model} not found.`);
    }

    const slide = await this.ratingRepos.findOne({ where: { id: slideId } });
    if (!slide) {
      throw new NotFoundException(`Slide with id ${slideId} not found.`);
    }

    const partner = await this.partnerRepos.findOne({
      where: { id: partnerId },
    });
    if (!partner) {
      throw new NotFoundException(`Partner with id ${partnerId} not found.`);
    }

    const slideChannel = await this.slideChannelRepos.findOne({
      where: { id: slideId },
    });
    if (!slideChannel) {
      throw new NotFoundException(`SlideChannel with id ${slideId} not found.`);
    }

    const createUser = await this.userRepos.findOne({
      where: { partner: { id: partnerId } },
    });
    const writeUser = await this.userRepos.findOne({
      where: { partner: { id: partnerId } },
    });

    if (!createUser || !writeUser) {
      throw new NotFoundException(`User with id ${partnerId} not found.`);
    }

    const newReview = new Rating();
    newReview.model = channel;
    newReview.resId = slideId;
    newReview.resName = slideChannel.name;
    newReview.resModel = channel.model;
    newReview.ratingText = ratingText;
    newReview.feedback = feedback;
    newReview.rating = rating;
    newReview.user = partner;
    // newReview.messageId = ;
    newReview.parentResId = 0;
    newReview.consumed = true;
    newReview.isInternal = false;
    newReview.writeUid = writeUser;
    newReview.createUid = createUser;
    newReview.accessToken = uuidv4();

    return await this.ratingRepos.save(newReview);
  }
}
