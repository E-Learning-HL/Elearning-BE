import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Length, Validate } from 'class-validator';
import { IsExist } from 'src/utils/validators/is-exists.validator';
import { Transform } from 'class-transformer';
import { lowerCaseTransformer } from 'src/utils/transformers/lower-case.transformer';

export class AuthEmailLoginDto {
  @ApiProperty({ example: 'test1@example.com' })
  @Transform(lowerCaseTransformer)
  @Validate(IsExist, ['User'], {
    message: 'emailNotExists',
  })
  // @IsEmail()
  username: string;

  @ApiProperty()
  @IsNotEmpty()
  @Length(8)
  password: string;
}
