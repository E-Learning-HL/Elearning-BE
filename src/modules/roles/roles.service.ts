import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { IrModel } from '../ir/ir-model/entities/ir_model.entity';
import { DataSource, Repository } from 'typeorm';
import { Language } from 'src/i18n/enums/language.enum';
import { RoleEnum } from './enum/roles.enum';
import { ResGroupService } from '../res/res-group/res_group.service';
import { IrModuleCategoryEnum } from '../ir/ir-module-category/enums/ir_module_category.enum';

@Injectable()
export class RoleService {
  constructor(
    @InjectDataSource() private datasource: DataSource,
    private resGroupService: ResGroupService,
  ) {}

  /**
   *
   * @param username the username of a user
   * @returns the user's role in the whole app (system)
   */
  async getUserRole(username: string) {
    const sql = `Select us.id, us.login, gid, rsg.name, category_id from res_users as us
      inner join res_groups_users_rel as relrs
      on us.id = relrs.uid
      inner join res_groups as rsg
      on relrs.gid = rsg.id
      inner join ir_module_category as imc
      on rsg.category_id = imc.id
      where imc.name->>'${Language.ENG}' = '${IrModuleCategoryEnum.UserType}' and us.login = :username;`;

    const query = this.datasource.createQueryRunner();

    const result = query.manager.query(sql, [username]);

    return result;
  }

  async getDefaultPublicRole() {
    const usertypes = await this.resGroupService.getUserGroupCategory();

    if (usertypes && usertypes.child) {
      for (let role of usertypes.child) {
        if (role.name[Language.ENG] == RoleEnum.PortalUser) {
          return role;
        }
      }
    }
    throw {
      error: 'Public role does not exist.',
    };
  }
}
