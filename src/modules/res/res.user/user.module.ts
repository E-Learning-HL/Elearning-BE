import { Module } from '@nestjs/common';
import { UsersService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ResGroupUser } from './entities/res_groups_users.entity';
import { CompanyModule } from '../res.company/company.module';
import { Company } from '../res.company/entities/company.entity';
import { PartnerModule } from '../res.partner/partner.module';
import { UserController } from './user.controller';
import { RoleModule } from 'src/modules/roles/roles.module';
import { IrModelAccessModule } from 'src/modules/ir/ir.model.access/ir_model_access.module';
import { CompanyService } from '../res.company/company.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, ResGroupUser, Company]),
    CompanyModule,
    PartnerModule,
    RoleModule,
    IrModelAccessModule,
  ],
  providers: [UsersService, CompanyService],
  exports: [UsersService],
  controllers: [UserController],
})
export class UserModule {}
