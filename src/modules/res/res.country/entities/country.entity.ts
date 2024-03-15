import {Column, Entity} from "typeorm"
import { BaseEntity } from "src/database/base/base.entity"

@Entity("res_country")
export class Country extends BaseEntity{
    @Column({name:'address_view_id'})
    addressViewID: number

    @Column({type:'integer',name:'currency_id'})
    currencyId: number

    @Column({type:'integer', name:'phone_code'})
    phoneCode: number

    @Column({type:'character varying'})
    code: string

    @Column({type:'character varying', name:'name_position'})
    namePosition: string

    @Column({type:'jsonb'})
    name: any

    @Column({type:'jsonb', name:'vat_label'})
    vatLabel: any

    @Column({type:'text', name:'address_format'})
    addressFormat: string

    @Column({name:'state_required'})
    stateRequired:  boolean
}