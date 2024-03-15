// import { BaseEntity } from 'src/database/base/base.entity';
// import { IrModel } from 'src/modules/ir/ir-model/entities/ir_model.entity';
// import { Partner } from 'src/modules/res/res.partner/entities/partner.entity';
// import {
//   AfterUpdate,
//   Column,
//   Entity,
//   JoinColumn,
//   ManyToOne,
//   OneToOne,
// } from 'typeorm';

// @Entity('rating_rating')
// export class Rating extends BaseEntity {
//   @ManyToOne(() => IrModel, (ir) => ir.id)
//   @JoinColumn({
//     name: 'res_model_id',
//   })
//   model: IrModel;
//   @Column({
//     name: 'res_id',
//     nullable: false,
//     comment: 'Id of children of res_model_id',
//   })
//   resId: number;

//   @Column({
//     name: 'parent_res_model_id',
//     comment: 'Parent of res_model_id',
//   })
//   parentResModelId: number;

//   @Column({
//     name: 'parent_res_id',
//     comment: 'Parent of res_id',
//   })
//   parentResId: number;

//   @Column({
//     name: 'rated_partner_id',
//   })
//   ratedPartner: number;

//   @ManyToOne(() => Partner)
//   @JoinColumn({
//     name: 'partner_id',
//   })
//   // partner who commented on the course
//   user: Partner;

//   @Column({
//     name: 'message_id',
//   })
//   messageId: number;

//   @Column({
//     name: 'res_name',
//   })
//   resName: string;

//   @Column({
//     name: 'res_model',
//   })
//   resModel: string;

//   @Column({
//     name: 'rating_text',
//   })
//   ratingText: string;

//   @Column({
//     name: 'feedback',
//   })
//   feedback: string;

//   @Column({
//     name: 'is_internal',
//   })
//   isInternal: boolean;

//   @Column()
//   consumed: boolean;

//   @Column()
//   rating: number;

//   @Column({
//     name: 'publisher_id',
//   })
//   @ManyToOne(() => Partner)
//   @JoinColumn({
//     name: 'publisher_id',
//   })
//   publisher: Partner;

//   @Column({
//     name: 'publisher_comment',
//   })
//   publisherComment: string;

//   @Column({
//     name: 'publisher_datetime',
//   })
//   publisherDatetime: Date;
// }


import {  Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { IrModel } from '../../../ir/ir-model/entities/ir_model.entity';
import { Partner } from 'src/modules/res/res.partner/entities/partner.entity';
import { MailMessage } from '../../../mail-message/entities/mail-message.entity';
import { User } from 'src/modules/res/res.user/entities/user.entity';
import { ENUM_RATING_TEXT } from '../enums/rating_text.enum';
import { ENUM_STAR_RATING } from '../enums/rating.enum';
import { BaseEntity } from 'src/database/base/base.entity';

@Entity('rating_rating')
export class Rating extends BaseEntity {
  @ManyToOne(() => IrModel, (ir) => ir.id)
  @JoinColumn({
    name: 'res_model_id',
  })
  model: IrModel;

  @Column({
    name: 'res_id',
    nullable: false,
    comment: 'Id of children of res_model_id',
  })
  resId: number;

  @ManyToOne(() => IrModel, (ir) => ir.id)
  @JoinColumn({ name: 'parent_res_model_id' })
  parentResModelId: IrModel;

  @Column({
    name: 'parent_res_id',
    comment: 'Parent of res_id',
  })
  parentResId: number;

  @ManyToOne(() => Partner, (partner) => partner.id)
  @JoinColumn({
    name: 'rated_partner_id',
  })
  ratedPartner: Partner;

  @ManyToOne(() => Partner, (partner) => partner.id)
  @JoinColumn({
    name: 'partner_id',
  })
  user: Partner;

  @ManyToOne(() => MailMessage, (mailMessage) => mailMessage.id)
  @JoinColumn({
    name: 'message_id',
  })
  messageId: MailMessage;

  @Column({
    name: 'res_name',
  })
  resName: string;

  @Column({
    name: 'res_model',
  })
  resModel: string;

  @Column({
    name: 'rating_text',
    type: 'enum',
    enum: ENUM_RATING_TEXT,
  })
  ratingText: ENUM_RATING_TEXT;

  @Column({
    name : 'access_token'
  })
  accessToken : string

  @Column({
    name: 'feedback',
  })
  feedback: string;

  @Column({
    name: 'is_internal',
  })
  isInternal: boolean;

  @Column()
  consumed: boolean;

  @Column({
    type: 'enum',
    enum: ENUM_STAR_RATING,
  })
  rating: ENUM_STAR_RATING;

  @ManyToOne(() => Partner, (partner) => partner.id)
  @JoinColumn({ name: 'publisher_id' })
  publisher: Partner;

  @Column({
    name: 'publisher_comment',
    nullable: true,
  })
  publisherComment: string;

  @Column({
    name: 'publisher_datetime',
    nullable: true,
  })
  publisherDatetime: Date;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'create_user' })
  createUid: User;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'write_user' })
  writeUid: User;

}