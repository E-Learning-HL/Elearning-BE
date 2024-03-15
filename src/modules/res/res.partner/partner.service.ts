import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Partner } from './entities/partner.entity';
import { Repository } from 'typeorm';
import { DefaultPartnerId } from './constants/default.constant';

@Injectable()
export class PartnerService {
  constructor(
    @InjectRepository(Partner) private partnerRepos: Repository<Partner>,
  ) {}

  createNewOne() {
    return this.partnerRepos.create();
  }
  async save(partner: Partner) {
    return await this.partnerRepos.save(partner);
  }

  async getDefaultPartner() {
    return await this.partnerRepos.findOne({
      where: {
        name: 'Public user',
        active: false,
      },
    });
  }

  async getPartner(partnerId: number) {
    return await this.partnerRepos.findOne({
      where: {
        id: partnerId,
      },
    });
  }
}
