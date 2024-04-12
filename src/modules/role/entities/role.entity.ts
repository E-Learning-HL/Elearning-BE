import { BaseEntity } from "src/database/base/base.entity";
import { Column, Entity } from "typeorm";

@Entity('roles')
export class Role extends BaseEntity {
    @Column()
    name : string
}
