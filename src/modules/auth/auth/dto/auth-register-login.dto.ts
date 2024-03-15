import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  Validate,
} from 'class-validator';
import { IsNotExist } from 'src/utils/validators/is-not-exists.validator';
import { Transform } from 'class-transformer';
import { lowerCaseTransformer } from 'src/utils/transformers/lower-case.transformer';
import { IsExist } from 'src/utils/validators/is-exists.validator';
import { DefaultCompanyId } from 'src/modules/res/res.company/constants/default.constant';
import { NotificationType } from 'src/modules/res/res.user/enum/notification.enum';
import { KarmaRank } from 'src/modules/gamifications/gamification_karma_rank/entities/karma_rank.entity';
export class AuthRegisterLoginDto {
  @ApiProperty({
    example: 'Join Dole',
  })
  @Transform((value) => value.value?.trim())
  @IsString()
  name: string;

  @ApiProperty({ example: 'test1@example.com' })
  @Transform(lowerCaseTransformer)
  @Validate(IsNotExist, ['User'], {
    message: 'Email already exists',
  })
  @IsEmail()
  username: string;
  @ApiProperty()
  @MinLength(8)
  password: string;

  @ApiPropertyOptional({
    description:
      'A company that user belongs to. Default is the default one in the database',
  })
  @Validate(IsExist, ['Company', 'id'], {
    message: 'Company does not exist.',
  })
  companyId?: number = DefaultCompanyId;
}

export class AuthRegistedUserReturnDto {
  @ApiProperty()
  active: boolean = true;
  @ApiProperty()
  username: string;
  @ApiProperty()
  signature: string;
  @ApiProperty()
  share: boolean = true;
  @ApiProperty()
  notificationType: NotificationType;
  @ApiProperty()
  karma: number;
  @ApiProperty()
  rankId: KarmaRank | null;
  @ApiProperty()
  nextRankId: KarmaRank;
  @ApiProperty()
  isPublicUser: boolean;
}
export class AuthRegisteredReturnDto {
  @ApiProperty()
  isSuccess: boolean;
  @ApiProperty()
  user: AuthRegistedUserReturnDto;
}
