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
  JoinTable,
} from 'typeorm';
import { User } from '../../res.user/entities/user.entity';

@Entity('res_company')
export class Company extends BaseEntity {
  @Column({ type: 'character varying', name: 'social_twitter' })
  socialTwitter: string;

  @Column({ type: 'character varying', name: 'social_youtube' })
  socialYoutube: string;

  @Column({ type: 'character varying', name: 'social_facebook' })
  socialFacebook: string;

  @Column({ type: 'character varying', name: 'social_instagram' })
  socialInstagram: string;

  @Column({ type: 'character varying' })
  email: string;

  @Column({ type: 'character varying' })
  phone: string;

  @Column({ type: 'character varying', nullable: false })
  name: string;

  @Column({ type: 'character varying', name: 'primary_color' })
  primaryColor: string;

  @Column({ type: 'character varying', name: 'secondary_color' })
  secondaryColor: string;

  @Column({ type: 'character varying' })
  mobile: string;

  @Column({ type: 'character varying', name: 'base_onboarding_company_state' })
  basOnboardingCompanyState: string;

  @Column({ type: 'character varying' })
  font: string;

  @Column({
    type: 'character varying',
    name: 'layout_background',
    nullable: false,
  })
  layoutBackground: string;

  @Column({ type: 'jsonb', name: 'report_footer' })
  reportFooter: any;

  @Column({ type: 'text', name: 'report_header' })
  reportHeader: string;

  @Column({ type: 'text', name: 'company_details' })
  companyDetails: string;

  @Column()
  active: boolean;

  @Column({ type: 'bytea', name: 'logo_web' })
  logoWeb: Buffer;

  @Column({ type: 'character varying', name: 'social_github' })
  socialGithub: string;

  @Column({ type: 'character varying', name: 'social_linkedin' })
  socialLinkedin: string;

  @Column({ type: 'integer', name: 'partner_gid' })
  partnerGid: number;

  @Column({ name: 'iap_enrich_auto_done' })
  iapEnrichAutoDone: boolean;

  @Column({ name: 'snailmail_color' })
  snailmailColor: boolean;

  @Column({ name: 'snailmail_duplex' })
  snailmailDuplex: boolean;

  // @Column({ type: 'integer', name: 'fiscalyear_last_day:', nullable: false })
  // fiscalyearLastDay: number;

  // @Column({ type: 'character varying', name: 'fiscalyear_last_month' })
  // fiscalyearLastMonth: string;

  // @Column({ type: 'character varying', name: 'bank_account_code_prefix' })
  // bankAccountCodePrefix: string;

  // @Column({ type: 'character varying', name: 'cash_account_code_prefix' })
  // cashAccountCodePrefix: string;

  // @Column({ type: 'character varying', name: 'early_pay_discount_computation' })
  // earlyPayDiscountComputation: string;

  // @Column({ type: 'character varying', name: 'transfer_account_code_prefix' })
  // transferAccountCodePrefix: string;

  // @Column({
  //   type: 'character varying',
  //   name: 'tax_calculation_rounding_method',
  // })
  // taxCalculationRoundingMethod: string;

  // @Column({ type: 'character varying', name: 'account_setup_bank_data_state' })
  // accountSetupBankDataState: string;

  // @Column({ type: 'character varying', name: 'account_setup_fy_data_state' })
  // accountSetupFyDataState: string;

  // @Column({ type: 'character varying', name: 'account_setup_coa_state' })
  // accountSetupCoaState: string;

  // @Column({ type: 'character varying', name: 'account_setup_taxes_state' })
  // accountSetupTaxesState: string;

  // @Column({
  //   type: 'character varying',
  //   name: 'account_onboarding_invoice_layout_state',
  // })
  // accountOnboardingInvoiceLayoutState: string;

  // @Column({
  //   type: 'character varying',
  //   name: 'account_onboarding_sale_tax_state',
  // })
  // accountOnboardingSaleTaxState: string;

  // @Column({
  //   type: 'character varying',
  //   name: 'account_invoice_onboarding_state',
  // })
  // accountInvoiceOnboardingState: string;

  // @Column({
  //   type: 'character varying',
  //   name: 'account_dashboard_onboarding_state',
  // })
  // accountDashboardOnboardingState: string;

  // @Column({ type: 'character varying', name: 'terms_type' })
  // termsType: string;

  // @Column({ type: 'character varying', name: 'account_setup_bill_state' })
  // accountSetupBillState: string;

  // @Column({ type: 'character varying', name: 'quick_edit_mode' })
  // quickEditMode: string;

  @ManyToMany(() => User)
  @JoinTable({
    name: 'res_company_users_rel',
    joinColumn: {
      name: 'cid',
    },
    inverseJoinColumn: {
      name: 'user_id',
    },
  })
  users: User[];
}
