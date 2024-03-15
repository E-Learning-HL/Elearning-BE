import { Exclude } from 'class-transformer';
import { BaseEntity } from 'src/database/base/base.entity';
import {
  Column,
  Entity,
  OneToOne,
  ManyToOne,
  ManyToMany,
  JoinColumn,
  JoinTable,
} from 'typeorm';
import { NotificationType } from '../enum/notification.enum';
import { Language } from 'src/i18n/enums/language.enum';
import { Partner } from '../../res.partner/entities/partner.entity';
import { Company } from '../../res.company/entities/company.entity';
import { ResGroup } from '../../res-group/entities/res_group.entity';
import { RoleEnum } from 'src/modules/roles/enum/roles.enum';
import { KarmaRank } from 'src/modules/gamifications/gamification_karma_rank/entities/karma_rank.entity';

@Entity('res_users')
export class User extends BaseEntity {
  @Column({ default: true })
  active: boolean = true;

  @Column({ type: 'character varying', nullable: false, name: 'login' })
  username: string;

  @Column({ type: 'character varying', nullable: false })
  @Exclude()
  password: string;

  @Column({ type: 'integer', name: 'action_id' })
  actionId: number;

  @Column({ type: 'text' })
  signature: string;

  @Column()
  share: boolean = true;

  @Exclude()
  @Column({ type: 'character varying', name: 'totp_secret' })
  totpSecret: string;

  @Column({
    type: 'character varying',
    name: 'notification_type',
    nullable: false,
    default: 'email',
  })
  notificationType: NotificationType = NotificationType.Email;

  @Column({ type: 'integer', default: 0 })
  karma: number = 0;

  @OneToOne(() => KarmaRank)
  @JoinColumn({ name: 'rank_id' })
  currentRank: KarmaRank | null = null;

  @OneToOne(() => KarmaRank)
  @JoinColumn({ name: 'next_rank_id' })
  nextRank: KarmaRank = new KarmaRank();

  @Column({ type: 'character varying', name: 'odoobot_state' })
  odoobotState: string;

  @Column({ name: 'odoobot_failed' })
  odoobotFailed: boolean;

  @OneToOne(() => Partner, (p) => p.user)
  @JoinColumn({
    name: 'partner_id',
  })
  partner: Partner;

  @ManyToOne(() => Company)
  @JoinColumn({
    name: 'company_id',
  })
  company: Company | null;
  @ManyToMany(() => Company)
  @JoinTable({
    name: 'res_company_users_rel',
    joinColumn: {
      name: 'user_id',
    },
    inverseJoinColumn: {
      name: 'cid',
    },
  })
  companies: Company[];

  @ManyToMany(() => ResGroup, (p) => p.id)
  @JoinTable({
    name: 'res_groups_users_rel',
    joinColumn: {
      name: 'uid',
    },
    inverseJoinColumn: {
      name: 'gid',
    },
  })
  groups: ResGroup[];

  isPublicUser() {
    if (!this.groups) {
      return true;
    }
    for (const g of this.groups) {
      if (g.name[Language.ENG] === RoleEnum.PublicUser) {
        return true;
      }
    }
    return false;
  }
}
