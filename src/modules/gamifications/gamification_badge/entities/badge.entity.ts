import { BaseEntity } from 'src/database/base/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { RuleAuth } from '../enums/rule_auth.enum';
import { IrAttachment } from 'src/modules/ir/ir_attachment/entities/ir_attachment.entity';

@Entity('gamification_badge')
export class GamificationBadge extends BaseEntity {
  @Column()
  level: string;

  @Column({
    name: 'rule_auth',
  })
  ruleAuth: RuleAuth;

  @Column({
    type: 'jsonb',
  })
  name: any;

  @Column({
    type: 'jsonb',
  })
  description: any;

  @Column()
  active: boolean;

  @Column({
    name: 'rule_max',
  })
  ruleMax: boolean;
  @Column({
    name: 'is_published',
  })
  isPublished: boolean;

  @ManyToOne(() => IrAttachment)
  @JoinColumn({
    name: 'message_main_attachment_id',
  })
  msgAttachment: IrAttachment;
}
