import { Controller, Get, Inject, Query, Req, UseGuards } from '@nestjs/common';
import { ApiSerivce } from './api.service';
import { Request } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { IrModel } from '../ir/ir-model/entities/ir_model.entity';
import { DataSource } from 'typeorm';
import { BaseEntity } from 'src/database/base/base.entity';
import { IrModelAccessService } from '../ir/ir.model.access/ir_model_access.service';
import { AccessRightOption } from '../ir/ir.model.access/types/ir_model_access.type';

@Controller({
  path: 'home',
  version: '1',
})
@ApiTags('Home')
export class ApiController {
  constructor(
    private apiService: ApiSerivce,
    private irModelAccesService: IrModelAccessService,
  ) {}
  @Get()
  homeData(@Req() request: Request) {
    return this.apiService.getHomeData(request);
  }

  @Get('/check')
  checkRight(@Query() irOption: AccessRightOption) {
    return this.irModelAccesService.checkAccessRight(irOption);
  }
}
