import { IrModuleCategory } from 'src/modules/ir/ir-module-category/entities/ir_module_category.entity';
import { BaseEntity } from 'src/database/base/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('res_groups')
export class ResGroup extends BaseEntity {
  @Column({
    type: 'jsonb',
  })
  name: any;

  @Column()
  color: number;

  @Column({
    type: 'jsonb',
  })
  comment: any;

  @Column({
    type: 'boolean',
    name: 'share',
  })
  canShare: boolean;
  @ManyToOne(() => IrModuleCategory)
  @JoinColumn({
    name: 'category_id',
  })
  category: IrModuleCategory;
}
