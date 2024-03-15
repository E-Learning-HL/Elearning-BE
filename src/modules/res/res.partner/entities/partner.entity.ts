import { Expose } from 'class-transformer';
import internal from 'stream';
import { BaseEntity } from 'src/database/base/base.entity';
import {
  Column,
  Entity,
  OneToOne,
  OneToMany,
  ManyToOne,
  ManyToMany,
  JoinColumn,
} from 'typeorm';
import { Country } from '../../res.country/entities/country.entity';
import { PartnerTitle } from '../../res.partner.title/entities/partner.title.entity';
import { User } from '../../res.user/entities/user.entity';
import { PartnerType } from '../types/partner.type';

@Entity('res_partner')
export class Partner extends BaseEntity {
  @Column({ name: 'company_id' })
  companyId: number;

  @Column({ type: 'character varying', nullable: false })
  name: string;

  @Column()
  color: number;

  @Column({ type: 'character varying' })
  ref: string;

  @Column({ type: 'character varying' })
  lang: string = 'en_US';

  @Column({ type: 'character varying' })
  tz: string;

  @Column({ type: 'character varying' })
  vat: string;

  @Column({ type: 'character varying', name: 'company_registry' })
  companyRegistry: string;

  @Column({ type: 'character varying' })
  website: string;

  @Column({ type: 'character varying' })
  function: string;

  @Column({ type: 'character varying' })
  type: PartnerType;

  @Column({ type: 'character varying' })
  street: string;

  @Column({ type: 'character varying' })
  street2: string;

  @Column({ type: 'character varying' })
  zip: string;

  @Column({ type: 'character varying' })
  city: string;

  @Column({ type: 'character varying' })
  email: string;

  @Column({ type: 'character varying' })
  phone: string;

  @Column({ type: 'character varying' })
  mobile: string;

  @Column({ type: 'character varying', name: 'commercial_company_name' })
  commercialCompanyName: string;

  @Column({ type: 'character varying', name: 'company_name' })
  companyName: string;

  @Column()
  date: Date;

  @Column({ type: 'text' })
  comment: string;

  @Column({ type: 'numeric', name: 'partner_latitude' })
  partnerLatitude: number;

  @Column({ type: 'numeric', name: 'partner_longitude' })
  partnerLongitude: number;

  @Column({ default: true })
  active: boolean = true;

  @Column()
  employee: boolean;

  @Column({ name: 'is_company' })
  isCompany: boolean = false;

  @Column({ name: 'partner_share' })
  partnerShare: boolean = true;

  @Column({ name: 'message_bounce' })
  messageBounce: number;

  @Column({ type: 'character varying', name: 'email_normalized' })
  emailNormalized: string;

  @Column({ type: 'character varying', name: 'signup_token' })
  signupToken: string;

  @Column({ type: 'character varying', name: 'signup_type' })
  signupType: string;

  @Column({ type: 'timestamp without time zone', name: 'signup_expiration' })
  signupExpiration: Date;

  @Column({ name: 'partner_gid' })
  partnerGid: number;

  @Column({ type: 'character varying', name: 'additional_info' })
  additionalInfo: string;

  @Column({ type: 'character varying', name: 'phone_sanitized' })
  phoneSanitized: string;

  // @Column({ type: 'character varying', name: 'invoice_warn' })
  // invoiceWan: string;

  // @Column({ type: 'character varying', name: 'invoice_warn_msg' })
  // invoiceWanMsg: string;

  // @Column({ type: 'numeric', name: 'debit_limit' })
  // debitLimit: number;

  // @Column({
  //   type: 'timestamp without time zone',
  //   name: 'last_time_entries_checked',
  // })
  // lastTimeEntriesChecked: Date;

  // @Column({ type: 'character varying', name: 'sale_warn' })
  // saleWarn: string;

  // @Column({ type: 'character varying', name: 'sale_warn_msg' })
  // saleWarnMsg: string;

  // @Column({
  //   type: 'timestamp without time zone',
  //   name: 'calendar_last_notif_ack',
  // })
  // calendarLastNotifAck: Date;

  @Column({ name: 'is_published' })
  isPublished: boolean = false;

  // @Column({ type: 'date', name: 'date_localization' })
  // dateLocalization: Date;

  // @Column({ type: 'character varying', name: 'website_meta_og_img' })
  // websiteMetaOgImg: string;

  // @Column({ type: 'jsonb', name: 'website_meta_title' })
  // websiteMetaTitle: any;

  // @Column({ type: 'jsonb', name: 'website_meta_description' })
  // websiteMetaDescription: any;

  // @Column({ type: 'jsonb', name: 'website_meta_keywords' })
  // websiteMetaKeywords: any;

  @Column({ type: 'jsonb', name: 'seo_name' })
  seoName: any;

  @Column({ type: 'jsonb', name: 'website_description' })
  websiteDescription: any;

  @Column({ type: 'jsonb', name: 'website_short_description' })
  websiteShortDescription: any;

  // @Column({ name: 'is_parent' })
  // isParent: boolean;

  // @Column({ name: 'is_student' })
  // isStudent: boolean;

  // @Column({ name: 'is_venue' })
  // isVenue: boolean;

  @OneToOne(() => User, (u) => u.partner)
  @JoinColumn({
    name: 'user_id',
  })
  user: User;

  @ManyToOne(() => PartnerTitle)
  @JoinColumn({
    name: 'title',
  })
  title: PartnerTitle;

  @ManyToOne(() => Country)
  @JoinColumn({
    name: 'country_id',
  })
  country: Country;
  @Column({
    name: 'display_name',
  })
  displayName: string;
}
