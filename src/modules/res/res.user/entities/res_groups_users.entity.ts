import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('res_groups_users_rel')
export class ResGroupUser {
  @PrimaryColumn({
    name: 'gid',
  })
  groupId: number;
  @PrimaryColumn({
    name: 'uid',
  })
  userId: number;
}
