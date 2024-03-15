export type LoginResponseType = Readonly<{
  token: string;
  tokenExpires: number;
  isAuthenticated: boolean;
  user: {
    id: number;
    active: boolean;
    email: string;
    username: string;
    signature: string;
    share: boolean;
    partnerId: number;
    lang: string;
    isPublicUser: boolean;
    name: string;
  };
  refreshToken: string;
}>;
