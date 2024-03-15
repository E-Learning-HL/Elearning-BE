import { BaseEntity } from 'src/database/base/base.entity';
import { Column, Entity } from 'typeorm';

@Entity('ir_server')
export class IrServer extends BaseEntity {
  @Column({
    nullable: false,
  })
  protocol: string;

  @Column({
    nullable: false,
  })
  domain: string;

  @Column({
    nullable: false,
  })
  path: string;

  getFullPath(file: string): string {
    return `${this.protocol}://${this.domain}/${this.path}/${file}`;
  }
}
