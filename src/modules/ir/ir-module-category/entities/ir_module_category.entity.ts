import { BaseEntity } from 'src/database/base/base.entity';
import { ResGroup } from 'src/modules/res/res-group/entities/res_group.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { IrModule } from '../../ir-module-module/entities/ir_module_module.entity';

@Entity('ir_module_category')
export class IrModuleCategory extends BaseEntity {
  @Column({
    type: 'jsonb',
  })
  name: any;
  @ManyToOne(() => IrModuleCategory)
  @JoinColumn({
    name: 'parent_id',
  })
  parent: IrModuleCategory;
  @Column()
  sequence: number;
  @Column({
    type: 'jsonb',
  })
  description: any;
  @Column({
    name: 'visible',
  })
  isVisible: boolean;
  @Column({
    name: 'exclusive',
  })
  isExclusive: boolean;

  @OneToMany(() => ResGroup, (rs) => rs.category)
  groups: ResGroup[];

  @OneToMany(() => IrModule, (rs) => rs.category)
  modules: IrModule[];
}
