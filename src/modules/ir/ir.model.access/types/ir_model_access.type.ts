import { Transform, Type } from 'class-transformer';
import { IsIn, IsNumber, IsString } from 'class-validator';
import { PermissionMode } from '../enum/permission.enum';
import { ApiProperty } from '@nestjs/swagger';

export class AccessRightOption {
  @ApiProperty()
  @IsString()
  model: string;

  @ApiProperty()
  @IsIn([
    PermissionMode.CREATE,
    PermissionMode.READ,
    PermissionMode.UNLINK,
    PermissionMode.WRITE,
  ])
  mode: PermissionMode;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  uid: number;
}
