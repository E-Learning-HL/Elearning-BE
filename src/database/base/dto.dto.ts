import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { EntityTarget } from 'typeorm';

export abstract class AbstractDto {
  abstract toDto(entity: any);
}
