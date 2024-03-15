import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { EnrollPolicy } from '../enums/enroll_policy.enum';
import { ChannelVisibility } from '../enums/visibility.enum';
import { BaseEntity } from 'src/database/base/base.entity';
import { SlideSlide } from '../../slide-slide/entities/slide_slide.entity';
import { Forum } from 'src/modules/forum/forum/entities/forum.entity';
import { ResGroup } from 'src/modules/res/res-group/entities/res_group.entity';
import { SlideChannelTag } from '../../slide-channel-tag/entities/slide_channel_tag.entity';
import { User } from 'src/modules/res/res.user/entities/user.entity';
import { Exclude } from 'class-transformer';
import { SlideChannelPartner } from '../../slide-channel-partner/entities/slide_channel_partner.entity';
import { Partner } from 'src/modules/res/res.partner/entities/partner.entity';

@Entity('slide_channel')
export class SlideChannel extends BaseEntity {
  @Column()
  @Exclude({
    toPlainOnly: true,
  })
  sequence: number;

  @Column({
    name: 'website_id',
  })
  @Exclude({
    toPlainOnly: true,
  })
  websiteId: number;

  @Column()
  color: number;

  @OneToMany(() => SlideSlide, (e) => e.channel)
  slides: SlideSlide[];

  @OneToOne(() => SlideChannel, (channel) => channel.id, {
    nullable: true,
  })
  @JoinColumn({
    name: 'promoted_slide_id',
  })
  promotedSlide: SlideChannel;

  @Column({
    name: 'nbr_document',
    default: 0,
  })
  numberOfDocument: number;

  @Column({
    name: 'nbr_video',
    default: 0,
  })
  numberOfVideo: number;

  @Column({
    name: 'nbr_infographic',
    default: 0,
  })
  numberOfInfographic: number;

  @Column({
    name: 'nbr_article',
    default: 0,
  })
  numberOfArticle: number;

  @Column({
    name: 'nbr_quiz',
    default: 0,
  })
  numberOfQuiz: number;

  @Column({
    name: 'total_slides',
    default: 0,
  })
  totalSlides: number;

  @Column({
    name: 'total_views',
    default: 0,
  })
  totalViews: number;
  @Column({
    name: 'total_votes',
  })
  totalVotes: number;
  @Column({
    name: 'publish_template_id',
    comment: 'New content notification',
  })
  @Exclude({
    toPlainOnly: true,
  })
  publishTemplate: number;

  @Column({
    name: 'share_channel_template_id',
    comment: 'channle share template',
  })
  @Exclude({
    toPlainOnly: true,
  })
  shareChannelTemplate: number;

  @Column({
    name: 'share_slide_template_id',
    comment: 'Share template',
  })
  @Exclude({
    toPlainOnly: true,
  })
  shareSlideTemplate: number;

  @Column({
    name: 'completed_template_id',
    comment: 'completion notification',
  })
  @Exclude({
    toPlainOnly: true,
  })
  completedTemplate: number;

  @Column({
    name: 'karma_gen_slide_vote',
  })
  @Exclude({
    toPlainOnly: true,
  })
  karmaGenSlideVote: number;

  @Column({
    name: 'karma_gen_channel_rank',
  })
  @Exclude({
    toPlainOnly: true,
  })
  karmaGenChannelRank: number;

  @Column({
    name: 'karma_review',
    comment: 'Karma needed to add a review on the course.',
  })
  @Exclude({
    toPlainOnly: true,
  })
  karmaReview: number;

  @Column({
    name: 'karma_slide_comment',
    comment: 'Karma needed to add a comment on a slide of this course',
  })
  @Exclude({
    toPlainOnly: true,
  })
  karmaSlideComment: number;

  @Column({
    name: 'karma_slide_vote',
    comment: 'Karma needed to like/dislike a slide of this course.',
  })
  @Exclude({
    toPlainOnly: true,
  })
  karmaSlideVote: number;

  @Column({
    name: 'website_meta_og_img',
  })
  @Exclude({
    toPlainOnly: true,
  })
  websiteMetaOgImg: string;

  @Column({
    name: 'channel_type',
    nullable: false,
    default: 'trainning',
  })
  channelType: string;

  @Column({
    name: 'promote_strategy',
  })
  @Exclude({
    toPlainOnly: true,
  })
  promoteStrategy: string;

  @Column({
    name: 'access_token',
  })
  @Exclude({
    toPlainOnly: true,
  })
  accessToken: string;

  @Column({
    name: 'enroll',
    comment: 'Enroll policy: public or on invitation',
    enum: EnrollPolicy,
  })
  enrollPolicy: EnrollPolicy;

  @Column({
    enum: ChannelVisibility,
    comment: 'The channel should be visibile for anyone or only specific user',
  })
  visibility: ChannelVisibility;

  @Column({
    name: 'slide_last_update',
    default: new Date(),
  })
  slideLastUpdate: Date;

  @Column({
    name: 'website_meta_title',
    type: 'jsonb',
  })
  websiteMetaTitle: any;

  @Column({
    name: 'website_meta_keywords',
    type: 'jsonb',
  })
  @Exclude({
    toPlainOnly: true,
  })
  websiteMetaKeywords: any;

  @Column({
    name: 'seo_name',
    type: 'jsonb',
  })
  @Exclude({
    toPlainOnly: true,
  })
  seoName: any;

  @Column({
    type: 'jsonb',
    nullable: false,
  })
  name: any;

  @Column({
    type: 'jsonb',
  })
  description: any;

  @Column({
    name: 'description_short',
    type: 'jsonb',
  })
  descriptionShort: any;

  @Column({
    name: 'enroll_msg',
    type: 'jsonb',
  })
  @Exclude({
    toPlainOnly: true,
  })
  enrollMessage: any;

  @Column({
    name: 'cover_properties',
    type: 'text',
  })
  @Exclude({
    toPlainOnly: true,
  })
  coverProperties: string;

  @Column({
    name: 'total_time',
  })
  totalTime: number;

  @Column({
    name: 'is_published',
    default: false,
  })
  isPublished: boolean;

  @Column()
  active: boolean;

  @Column({
    name: 'allow_comment',
    comment: 'Allow reviews',
  })
  allowComment: boolean;

  @Column({
    name: 'rating_last_value',
  })
  @Exclude({
    toPlainOnly: true,
  })
  ratingLastValue: number;

  @ManyToOne(() => Forum, {
    nullable: true,
  })
  @JoinColumn({
    name: 'forum_id',
  })
  forumId: number;

  @Column({
    name: 'nbr_certification',
  })
  @Exclude({
    toPlainOnly: true,
  })
  numberOfCertification: number;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({
    name: 'user_id',
  })
  user: User;

  @ManyToMany(() => ResGroup, (resGroup) => resGroup.id)
  @JoinTable({
    name: 'rel_upload_groups',
    joinColumn: {
      name: 'channel_id',
    },
    inverseJoinColumn: {
      name: 'group_id',
    },
  })
  uploadGroups: ResGroup[];

  @ManyToMany(() => SlideChannelTag)
  @JoinTable({
    name: 'slide_channel_tag_rel',
    joinColumn: {
      name: 'channel_id',
    },
    inverseJoinColumn: {
      name: 'tag_id',
    },
  })
  tags: SlideChannelTag[];

  @OneToMany(() => SlideChannelPartner, (e) => e.channel)
  partners: Partner[];
}
