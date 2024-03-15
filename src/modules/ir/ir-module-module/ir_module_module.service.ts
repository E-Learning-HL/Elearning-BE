import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IrModule } from './entities/ir_module_module.entity';
import { group } from 'console';
import { ResGroupService } from 'src/modules/res/res-group/res_group.service';

@Injectable()
export class IrModuleService {
  constructor(
    @InjectRepository(IrModule) private irModuleRepos: Repository<IrModule>,
    private resGroupService: ResGroupService,
  ) {}

  async getIrModule(moduleName: string) {
    const module = await this.irModuleRepos.findOne({
      where: {
        name: moduleName,
      },
      relations: ['category'],
    });
    return module;
  }

  async getResGroupInModule(moduleName: string) {
    const module = await this.getIrModule(moduleName);
    if (!module || !module.category) {
      return null;
    }
    const groups = await this.resGroupService.getGroupByCategory(module.id);

    return groups ? groups.child : null;
  }
}
