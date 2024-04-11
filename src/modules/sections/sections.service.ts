import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Section } from './entities/section.entity';

@Injectable()
export class SectionsService {
  constructor(
    @InjectRepository(Section)
    private sectionRepository: Repository<Section>,
  ) {}
  create(createSectionDto: CreateSectionDto) {
    return 'This action adds a new lesson';
  }

  findAll() {
    return `This action returns all lessons`;
  }

  async findOne(id: number): Promise<Section | null> {
    const section = await this.sectionRepository.findOne({
      where: { id: id },
      relations: ['lesson.file'],
    });
    if (!section) {
      throw new NotFoundException('Section not found');
    }
    return section;
  }

  update(id: number, updateSectionDto: UpdateSectionDto) {
    return `This action updates a #${id} lesson`;
  }

  remove(id: number) {
    return `This action removes a #${id} lesson`;
  }
}
