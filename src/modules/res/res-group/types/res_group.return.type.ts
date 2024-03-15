import { IrModuleCategory } from 'src/modules/ir/ir-module-category/entities/ir_module_category.entity';
import { ResGroup } from '../entities/res_group.entity';

export type ResGroupReturnType = {
  parent: IrModuleCategory | null;
  child: ResGroup[] | null;
};
