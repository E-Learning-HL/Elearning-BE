import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller({
  path: 'companies',
  version: '1',
})
@ApiTags('Companies')
export class CompanyController {}
