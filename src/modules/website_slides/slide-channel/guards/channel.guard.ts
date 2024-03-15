import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Language } from 'src/i18n/enums/language.enum';

@Injectable()
export class ChannelGuard implements CanActivate {
  constructor(
    private reflector: Reflector, // @InjectRepository(ResGroupUser) repos: Repository<ResGroupUser>,
    // private userSerivce: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // const roles = this.reflector.getAllAndOverride<RoleEnum[]>('roles', [
    //   context.getClass(),
    //   context.getHandler(),
    // ]);
    // const request = context.switchToHttp().getRequest();

    // const user = request.user;

    // if (!user || !user.groups) {
    //   return false;
    // }

    // for (let group of user.groups) {
    //   if (roles.includes(group.name[Language.ENG])) {
    //     return true;
    //   }
    // }
    return false;
  }
}
