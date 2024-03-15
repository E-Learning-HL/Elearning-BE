import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  SerializeOptions,
  Request,
  Get,
  Param,
  ParseBoolPipe,
  HttpException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger';
import { AuthEmailLoginDto } from './dto/auth-email-login.dto';

import { AuthGuard } from '@nestjs/passport';
import { AuthRegisterLoginDto } from './dto/auth-register-login.dto';
import { LoginResponseType } from './types/login-response.type';
import { MailService } from 'src/common/mail/mail.service';
import { IsEmail, isEmail } from 'class-validator';
import { MailData } from 'src/common/mail/interfaces/mail-data.interface';
import { JwtGuard } from './strategies/jwt.strategy';

@ApiTags('Auth')
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(
    private readonly service: AuthService,
    private readonly mailService: MailService,
  ) {}
  @SerializeOptions({
    groups: ['me'],
  })
  @Post('email/login')
  @HttpCode(HttpStatus.OK)
  public login(
    @Body() loginDto: AuthEmailLoginDto,
  ): Promise<LoginResponseType> {
    return this.service.validateLogin(loginDto);
  }

  @Post('email/register')
  @HttpCode(HttpStatus.CREATED)
  public async register(@Body() registerDto: AuthRegisterLoginDto) {
    // no need to check existence
    return await this.service.register(registerDto);
  }

  @Post('check-token')
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  public async checkToken() {
    return { message: 'OK' };
  }

  @Post('refresh')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt-refresh'))
  @ApiOperation({
    description: 'Append your jwt-refesh-token in header to get a new token.',
  })
  @HttpCode(HttpStatus.OK)
  public refresh(@Request() request) {
    return this.service.refreshToken(request.user);
  }

  @Post('/send-mail')
  public async sendEmail(@Request() request, @Body() to: any) {
    to = to as MailData<{ hash: string }>;

    if (!isEmail(to.to)) {
      throw new HttpException('Invalid email address', HttpStatus.BAD_REQUEST);
    }

    await this.mailService.forgotPassword(to);

    return {
      status: HttpStatus.OK,
      message: 'Email sent successfully.',
    };
  }
}
