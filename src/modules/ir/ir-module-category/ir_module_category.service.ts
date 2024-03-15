import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IrModuleCategory } from './entities/ir_module_category.entity';
import { Repository } from 'typeorm';
import { Language } from 'src/i18n/enums/language.enum';
import { IrModuleCategoryEnum } from './enums/ir_module_category.enum';

@Injectable()
export class IrModuleCategoryService {
  constructor(
    @InjectRepository(IrModuleCategory)
    private irModuleCategoryRepos: Repository<IrModuleCategory>,
  ) {}
  /**
   *
   * @param category either category's name or category's id
   * @returns Returns only information of module that has id is 'category'
   */
  async getCategory(category: IrModuleCategoryEnum | number) {
    let query = '';

    if (typeof category === 'number') {
      query = 'ir.id = :value';
    } else {
      query = `ir.name->>'${Language.ENG}' = :value`;
    }
    const userType = await this.irModuleCategoryRepos
      .createQueryBuilder('ir')
      .where(query, {
        value: category,
      })
      .getOne();
    return userType;
  }
}
