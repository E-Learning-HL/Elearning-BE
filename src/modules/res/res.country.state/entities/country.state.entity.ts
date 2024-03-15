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
import { Country } from "../../res.country/entities/country.entity";

@Entity("res_country_state")
export class CountryState extends BaseEntity{
    @Column({type:'integer'})
    name: number

    @Column({type:'character varying'})
    code: string

    @ManyToOne(() => Country)
    country_id: Country
}