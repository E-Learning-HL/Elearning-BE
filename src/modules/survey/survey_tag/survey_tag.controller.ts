import { Controller, Get, Param, Query } from '@nestjs/common';
import { SurveyTagService } from './survey_tag.service';
import { ApiTags } from '@nestjs/swagger';

@Controller({
  path: 'survey/tags',
  version: '1',
})
@ApiTags('Survey Tags')
export class SurveyTagController {
  constructor(private service: SurveyTagService) {}
  @Get()
  async getAllTags(@Param('page') page?: number) {
    return this.service.getAllTags(page);
  }

  @Get('/by-name')
  async getAllTagsByName(@Query('name') name: string) {
    return this.service.getTagsByName(name);
  }
}
