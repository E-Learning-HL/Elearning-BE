import { BaseEntity } from 'src/database/base/base.entity';
import { IrModel } from 'src/modules/ir/ir-model/entities/ir_model.entity';
import { ResGroup } from 'src/modules/res/res-group/entities/res_group.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity('ir_model_access')
export class IrModelAccess extends BaseEntity {
  @ManyToOne(() => IrModel)
  @JoinColumn({
    name: 'model_id',
  })
  model: IrModel;

  @ManyToOne(() => ResGroup)
  @JoinColumn({
    name: 'group_id',
  })
  group: ResGroup;

  @Column()
  name: string;

  @Column({
    name: 'active',
  })
  isActive: boolean;

  @Column({
    name: 'perm_read',
  })
  canRead: boolean;

  @Column({
    name: 'perm_write',
  })
  canWrite: boolean;

  @Column({
    name: 'perm_create',
  })
  canCreate: boolean;

  @Column({
    name: 'perm_unlink',
  })
  canUnlink: boolean;
}
