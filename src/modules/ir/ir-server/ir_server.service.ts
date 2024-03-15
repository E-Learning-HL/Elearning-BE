import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IrServer } from './entities/ir_server.entity';

@Injectable()
export class IrServerService {
  constructor(
    @InjectRepository(IrServer) private repos: Repository<IrServer>,
  ) {}
}
