import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, MinLength, Validate } from 'class-validator';
import { FileEntity } from '../../../../common/files/entities/file.entity';
import { IsExist } from 'src/utils/validators/is-exists.validator';

export class AuthUpdateDto {}
