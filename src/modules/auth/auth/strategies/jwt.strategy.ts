import { ExtractJwt, Strategy } from 'passport-jwt';
import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/common/config/config.type';
import { JwtPayloadType } from './types/jwt-payload.type';
import { OrNeverType } from 'src/utils/types/or-never.type';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { RoleOption } from 'src/modules/roles/roles.decorator';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private configService: ConfigService<AllConfigType>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('auth.secret', { infer: true }),
    });
  }

  public validate(payload: JwtPayloadType): OrNeverType<JwtPayloadType> {
    if (!payload.id) {
      throw new UnauthorizedException('A jwt token is required.');
    }
    return payload;
  }
}

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super(reflector);
  }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.getAllAndOverride<RoleOption>('roles', [
      context.getClass(),
      context.getHandler(),
    ]);
    const authPromise = super.canActivate(context) as Promise<boolean>;
    const isAuth = authPromise
      .then((data) => {
        return true;
      })
      .catch((err) => {
        if (roles && roles.acceptPublic === true) {
          return true;
        }
        throw new UnauthorizedException(
          'This route requires a valid jwt-token.',
        );
      });

    return isAuth;
  }
}
