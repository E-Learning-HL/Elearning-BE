import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SectionsService } from './sections.service';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Sections')
@Controller('sections')
export class SectionsController {
  constructor(private readonly sectionsService: SectionsService) {}

  @Post()
  create(@Body() createSectionDto: CreateSectionDto) {
    return this.sectionsService.create(createSectionDto);
  }

  @Get('get-list')
  findAll() {
    return this.sectionsService.findAll();
  }

  // @ApiBearerAuth('access-token')
  // @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.sectionsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSectionnDto: UpdateSectionDto) {
    return this.sectionsService.update(+id, updateSectionnDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sectionsService.remove(+id);
  }
}
