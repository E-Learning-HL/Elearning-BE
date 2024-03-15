import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Partner } from 'src/modules/res/res.partner/entities/partner.entity';
import { User } from 'src/modules/res/res.user/entities/user.entity';
import { BaseEntity } from 'src/database/base/base.entity';

@Entity('mail_message')
export class MailMessage extends BaseEntity {

  // @ManyToOne(() => MailMessage, { nullable: true })
  // @JoinColumn({ name: 'parent_id' })
  // parentMessage: MailMessage;

  // @Column({ name: 'res_id', nullable: true })
  // resId: number;

  // @Column({ name: 'subtype_id', nullable: true })
  // subtypeId: number;

  // @Column({ name: 'mail_activity_type_id', nullable: true })
  // mailActivityTypeId: number;

  // @ManyToOne(() => Partner)
  // @JoinColumn({ name: 'author_id' })
  // author: Partner;

  // @Column({ name: 'author_guest_id' })
  // authorGuest: number;

  // @Column({ name: 'mail_server_id', nullable: true })
  // mailServerId: number;


  // @ManyToOne(() => User)
  // @JoinColumn({ name: 'create_uid' })
  // createUid: User;

  // @ManyToOne(() => User)
  // @JoinColumn({ name: 'write_uid' })
  // writeUid: User;

  // @Column({ name: 'subject', collation: 'pg_catalog."default"' })
  // subject: string;

  // @Column({ name: 'model', collation: 'pg_catalog."default"', nullable: true })
  // model: string;

  // @Column({ name: 'record_name', collation: 'pg_catalog."default"', nullable: true })
  // recordName: string;

  // @Column({ name: 'message_type', collation: 'pg_catalog."default"', nullable: false })
  // messageType: string;

  // @Column({ name: 'email_from', collation: 'pg_catalog."default"', nullable: true })
  // emailFrom: string;

  // @Column({ name: 'message_id', collation: 'pg_catalog."default"', nullable: true })
  // messageId: string;

  // @Column({ name: 'reply_to', collation: 'pg_catalog."default"', nullable: true })
  // replyTo: string;

  // @Column({ name: 'email_layout_xmlid', collation: 'pg_catalog."default"', nullable: true })
  // emailLayoutXmlid: string;

  // @Column({ name: 'body', collation: 'pg_catalog."default"', nullable: true })
  // body: string;

  // @Column({ name: 'is_internal', nullable: true })
  // isInternal: boolean;

  // @Column({ name: 'reply_to_force_new', nullable: true })
  // replyToForceNew: boolean;

  // @Column({ name: 'email_add_signature', nullable: true })
  // emailAddSignature: boolean;

  // @Column({ name: 'date', nullable: true })
  // date: Date;
}
