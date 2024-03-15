import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { User } from './entities/user.entity';
import { DataSource, DeepPartial, FindOptionsWhere, Repository } from 'typeorm';
import { NullableType } from 'src/utils/types/nullable.type';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Injectable, SerializeOptions } from '@nestjs/common';
import { ResGroupUser } from './entities/res_groups_users.entity';
import { Company } from '../res.company/entities/company.entity';

import { PartnerService } from '../res.partner/partner.service';
import { CompanyService } from '../res.company/company.service';
import { FindOptions, paginate } from 'src/utils/pagination';
import { PaginationResultType } from 'src/utils/types/pagination-result.type';
import { RoleService } from 'src/modules/roles/roles.service';
import {
  AuthRegisterLoginDto,
  AuthRegisteredReturnDto,
} from 'src/modules/auth/auth/dto/auth-register-login.dto';
import { Partner } from '../res.partner/entities/partner.entity';
import { KarmaRank } from 'src/modules/gamifications/gamification_karma_rank/entities/karma_rank.entity';
import { UpdateUserDto } from './dtos/update_user.dto';
import { UpdatePartnerDto } from '../res.partner/dtos/update_partner.dto';
import {
  CryptoContext,
  HashingStrategy,
} from 'src/utils/crypto/passlib_crypto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private companyService: CompanyService,
    private roleService: RoleService,
    private partnerService: PartnerService,
    private datasource: DataSource,
  ) {}

  async getAllUser(
    options?: FindOptions<User>,
    paginationOptions?: IPaginationOptions,
  ): Promise<PaginationResultType<User>> {
    return await paginate<User>(
      this.usersRepository,
      paginationOptions ||
        ({
          limit: 10,
          page: 1,
        } as IPaginationOptions),
      options,
    );
  }

  async create(
    createProfileDto: AuthRegisterLoginDto,
  ): Promise<AuthRegisteredReturnDto> {
    const { username, password, companyId, name } = createProfileDto;
    const partner = new Partner();

    partner.name = name;
    partner.displayName = name;
    partner.email = username;
    partner.emailNormalized = username;

    const newUser = new User();

    const cryptoContext = new CryptoContext({
      digest: HashingStrategy.PBKDF2_SHA512,
      encoding: 'base64',
    });
    newUser.username = username;

    if (companyId) {
      const requiredCompany = await this.companyService.getOne(companyId);
      newUser.company = requiredCompany;
      newUser.companies = [];
      newUser.companies.push(requiredCompany!);
    }

    const publicRole = await this.roleService.getDefaultPublicRole();

    newUser.groups = [];
    newUser.groups.push(publicRole);

    const nextRank = new KarmaRank();
    nextRank.id = 1;

    newUser.nextRank = nextRank;

    // Because hashing take longer time so we place it at the bottom
    const randomSalt = cryptoContext.generateSalt();

    newUser.password = cryptoContext.hash(
      password,
      randomSalt,
      Number(process.env.HASH_ROUNDS || 350000),
    );
    return await this.datasource.manager.transaction(async (manager) => {
      const savePartner = await manager.save(Partner, partner);
      newUser.partner = savePartner;
      const savedUser = await manager.save(User, newUser);
      newUser.password = null!;
      return {
        isSuccess: true,
        user: {
          username: savedUser.username,
          active: savedUser.active,
          karma: savedUser.karma,
          nextRankId: savedUser.nextRank,
          notificationType: savedUser.notificationType,
          rankId: savedUser.currentRank,
          share: savedUser.share,
          signature: savedUser.signature,
          isPublicUser: savedUser.isPublicUser(),
        },
      };
    });
  }

  async findOne(fields: EntityCondition<User>): Promise<User | null> {
    return await this.usersRepository.findOne({
      where: fields,
      select: {
        password: false,
        partner: {
          id: true,
          lang: true,
          name: true,
        },
      },
      relations: ['partner', 'groups'],
    });
  }

  async update(id: User['id'], payload: UpdateUserDto): Promise<void> {
    const currUser = await this.usersRepository.findOne({
      where: {
        id: id,
      },
      select: {
        partner: {
          id: true,
        },
      },
      relations: ['partner'],
    });

    if (!currUser) {
      throw {
        error: `Cannot find any user with id = ${id}`,
      };
    }
    const partner = currUser.partner;

    const manager = this.datasource.manager;

    await manager.transaction(async (manager) => {
      if (payload.partner) {
        await manager.update(
          Partner,
          {
            id: partner.id,
          },
          {
            ...partner,
            ...payload.partner,
          },
        );
      }
      // remove partner in payload:
      delete payload.partner;
      await manager.transaction(async (manager) => {
        manager.update(User, { id }, {
          ...payload,
        } as User);
      });
    });
  }

  async softDelete(id: User['id']): Promise<void> {
    await this.usersRepository.softDelete(id);
  }
}
