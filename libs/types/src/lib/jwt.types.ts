export type JwtUser = {
  iss: string;
  sub: string;
  aud: string[];
  iat: number;
  exp: number;
  azp: string;
  scope: string;
  permissions: Permissions[];
};

export enum Permissions {
  ADMIN = 'admin:all',
  MERCHANT = 'merchant:all',
}
