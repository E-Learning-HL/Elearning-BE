import { SlideChannel } from '../../slide-channel/entities/slide_channel.entity';
import { BaseEntity } from 'src/database/base/base.entity'; 
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { SlideSlidePartner } from './slide_slide_partner.entity';
import { User } from 'src/modules/res/res.user/entities/user.entity';

@Entity('slide_slide')
export class SlideSlide extends BaseEntity {
  @Column()
  likes: number;
  @Column()
  dislikes: number;
  @Column({
    name: 'slide_views',
  })
  slideViews: number;
  @Column({
    name: 'public_views',
  })
  publicViews: number;

  @Column({
    name: 'total_views',
  })
  totalViews: number;
  @Column({
    name: 'nbr_document',
  })
  numberOfDocuments: number;

  @Column({
    name: 'nbr_video',
  })
  numberOfVideos: number;

  @Column({
    name: 'nbr_infographic',
  })
  numberOfInfographics: number;

  @Column({
    name: 'nbr_article',
  })
  numberOfArticals: number;

  @Column({
    name: 'nbr_quiz',
  })
  numberOfQuizes: number;

  @Column({
    name: 'total_slides',
  })
  totalSlides: number;

  @Column({
    name: 'slide_category',
  })
  slideCategory: string;

  @Column({
    name: 'source_type',
  })
  sourceType: string;

  @Column()
  url: string;

  @Column({
    name: 'slide_type',
  })
  slideType: string;

  @Column({
    name: 'seo_name',
    type: 'jsonb',
  })
  seoName: any;

  @Column({
    type: 'jsonb',
  })
  name: any;

  @Column({
    type: 'jsonb',
  })
  description: any;

  @Column({
    name: 'html_content',
    type: 'jsonb',
  })
  htmlContent: any;

  @Column({
    name: 'completion_time',
  })
  completionTime: number;

  @Column({
    name: 'is_published',
  })
  isPublished: boolean;

  @Column({
    name: 'is_preview',
  })
  isPreview: boolean;

  @Column({
    name: 'slide_resource_downloadable',
  })
  downloadble: boolean;

  @Column({
    name: 'date_published',
  })
  datePublished: Date;

  @Column()
  @Column({
    name: 'active',
  })
  isActive: boolean;

  // FK
  @Column({
    name: 'message_main_attachment_id',
  })
  messageMainAttachmentId: number;
  @Column()
  sequence: number;

  // FK to res.user

  @ManyToOne(() => User)
  @JoinColumn({
    name: 'user_id',
  })
  user: User;

  // FK to channel
  @ManyToOne(() => SlideChannel, (c) => c.slides)
  @JoinColumn({
    name: 'channel_id',
  })
  channel: SlideChannel;

  @Column({
    name: 'category_id',
  })
  category: number;

  @OneToMany(() => SlideSlidePartner, (x) => x.slide)
  partners: SlideSlidePartner[];
}
