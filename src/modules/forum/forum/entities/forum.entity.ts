import { BaseEntity } from 'src/database/base/base.entity';
import { Entity } from 'typeorm';

@Entity('forum_forum')
export class Forum extends BaseEntity {}
