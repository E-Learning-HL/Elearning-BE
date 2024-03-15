import { Controller, Get, Req, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { HomeService } from './home.service';
import { Request, Response } from 'express';

@ApiTags('Home')
@Controller()
export class HomeController {
  constructor(private service: HomeService) {}
  @Get()
  appInfo() {
    return {
      app_name: process.env['APP_NAME'] || 'API-ODIN',
    };
  }
}
