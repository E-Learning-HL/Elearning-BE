import { User } from 'src/modules/res/res.user/entities/user.entity';

export type JwtTokenData = {
  id: User['id'];
  username: User['partner']['name'];
  email: User['username'];
  lang: User['partner']['lang'];
  partnerId?: User['partner']['id'];
  name?: User['partner']['name'];
};
