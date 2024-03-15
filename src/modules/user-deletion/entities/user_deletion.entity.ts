import { BaseEntity } from 'src/database/base/base.entity';
import { Entity } from 'typeorm';

@Entity('res_users_deletion')
export class UserDeletion extends BaseEntity {}
