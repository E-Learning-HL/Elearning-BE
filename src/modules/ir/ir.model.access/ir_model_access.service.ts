import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AccessRightOption } from './types/ir_model_access.type';

@Injectable()
export class IrModelAccessService {
  constructor(@InjectDataSource() private datasource: DataSource) {}

  /**
   * @param model Model name
   * @param uid User id
   * @param mode Read, write, create or unlink
   */
  async checkAccessRight({ model, uid, mode }: AccessRightOption) {
    const sqlQuery = `
            SELECT m.model
              FROM ir_model_access a
              JOIN ir_model m ON (m.id = a.model_id)
              WHERE a.perm_${mode}
               AND a.active
               AND (
                    a.group_id IS NULL OR
                    -- use subselect fo force a better query plan. See #99695 --
                    a.group_id IN (
                        SELECT gu.gid
                            FROM res_groups_users_rel gu
                            WHERE gu.uid = ${uid}
                    )
                )
                AND m.model = '${model}'
            GROUP BY m.model`;
    const manager = this.datasource.manager;
    const models = await manager.query(sqlQuery);

    return models.length > 0;
  }
}
