import { User } from "src/modules/res/res.user/entities/user.entity";

export type JwtPayloadType = User & {
  iat: number;
  exp: number;
};
