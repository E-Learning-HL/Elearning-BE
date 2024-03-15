import { BaseEntity } from 'src/database/base/base.entity';

import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { IrModuleCategory } from '../../ir-module-category/entities/ir_module_category.entity';

@Entity('ir_module_module')
export class IrModule extends BaseEntity {
  @Column()
  name: string;
  @Column({
    type: 'jsonb',
  })
  summary: any;

  @ManyToOne(() => IrModuleCategory)
  @JoinColumn({
    name: 'category_id',
  })
  category: IrModuleCategory;
}
