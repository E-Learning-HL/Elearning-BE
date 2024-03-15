import { Expose } from "class-transformer";
import internal from "stream";
import { BaseEntity } from "src/database/base/base.entity";
import {
    Column,
    Entity,
    OneToOne,
    OneToMany,
    ManyToOne,
    ManyToMany, 
    JoinColumn
} from "typeorm";

@Entity("res_partner_title")
export class PartnerTitle extends BaseEntity{
    @Column({type:'jsonb'})
    name: any

    @Column({type:'jsonb'})
    shortcut: any
    
}