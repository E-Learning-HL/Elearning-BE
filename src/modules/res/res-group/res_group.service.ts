import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { ResGroup } from './entities/res_group.entity';
import { DataSource, Repository } from 'typeorm';
import { ResGroupReturnType } from './types/res_group.return.type';
import { IrModuleCategoryEnum } from 'src/modules/ir/ir-module-category/enums/ir_module_category.enum';
import { IrModuleCategoryService } from 'src/modules/ir/ir-module-category/ir_module_category.service';

@Injectable()
export class ResGroupService {
  constructor(
    @InjectRepository(ResGroup) private resGroupService: Repository<ResGroup>,
    private irModuleCategoryService: IrModuleCategoryService,
    @InjectDataSource() private datasource: DataSource,
  ) {}

  // return all types of a group associate with a module category
  // for example: 'User types' category have three different types of user: Public, Internal, Portal
  async getGroupByCategory(
    categoryId: number | IrModuleCategoryEnum,
  ): Promise<ResGroupReturnType | null> {
    const parent = await this.irModuleCategoryService.getCategory(categoryId);
    return parent
      ? {
          parent: parent,
          child: await this.resGroupService.find({
            where: {
              category: {
                id: parent?.id,
                isVisible: true,
              },
            },
          }),
        }
      : null;
  }

  async getUserGroupCategory(): Promise<ResGroupReturnType | null> {
    return await this.getGroupByCategory(IrModuleCategoryEnum.UserType);
  }
}
