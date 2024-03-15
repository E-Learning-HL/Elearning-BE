import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGoogleService } from './auth-google.service';
import { AuthService } from '../auth/auth.service';

@ApiTags('Auth')
@Controller({
  path: 'auth/google',
  version: '1',
})
export class AuthGoogleController {
  constructor(
    private readonly authService: AuthService,
    private readonly authGoogleService: AuthGoogleService,
  ) {}

  // @Post('login')
  // @HttpCode(HttpStatus.OK)
  // async login(
  //   @Body() loginDto: AuthGoogleLoginDto,
  // ): Promise<LoginResponseType> {
  //   const socialData = await this.authGoogleService.getProfileByToken(loginDto);

  //   return this.authService.validateSocialLogin('google', socialData);
  // }
}
