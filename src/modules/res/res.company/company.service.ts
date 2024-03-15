import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company) private companyService: Repository<Company>,
  ) {}

  getCompanies() {}

  getOne(companyId: number) {
    const foundCompany = this.companyService.findOne({
      where: {
        id: companyId,
        active: true,
      },
    });

    if (!foundCompany) {
      throw {
        error: 'Company does not exist.',
      };
    }
    return foundCompany;
  }
}
