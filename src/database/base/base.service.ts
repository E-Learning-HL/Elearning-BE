import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/modules/res/res.user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BaseService {
  constructor(@InjectRepository(User) userRepos: Repository<User>) {}

  getBaseInfo() {}
}
