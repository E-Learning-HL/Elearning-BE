import { BaseEntity } from 'src/database/base/base.entity';
import { Company } from 'src/modules/res/res.company/entities/company.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { IrServer } from '../../ir-server/entities/ir_server.entity';

@Entity('ir_attachment')
export class IrAttachment extends BaseEntity {
  @Column({
    name: 'res_id',
  })
  resId: number;

  @ManyToOne(() => Company)
  @JoinColumn({
    name: 'company_id',
  })
  company: Company;

  @Column()
  name: string;

  @Column({
    name: 'res_model',
  })
  resModel: string;

  @Column({
    name: 'res_field',
  })
  resField: string;

  @Column()
  type: string;

  @Column()
  url: string;

  @Column({
    name: 'store_fname',
  })
  storeFileName: string;

  @Column({
    name: 'access_token',
  })
  accessToken: string;

  @Column({
    name: 'mimetype',
  })
  mimetype: string;

  @Column({
    name: 'description',
    type: 'text',
  })
  description: string;

  @ManyToOne(() => IrServer, {
    eager: true,
  })
  @JoinColumn({
    name: 'server_id',
  })
  attachmentServer: IrServer;

  @Column({
    name: 'path',
  })
  path: string;
}
