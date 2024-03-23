export type JwtUser = {
  iss: string;
  sub: string;
  aud: string[];
  iat: number;
  exp: number;
  azp: string;
  scope: string;
  permissions: PermissionLevel[];
};

export enum PermissionLevel {
  ADMIN = 'admin:all',
  MERCHANT = 'merchant:all',
}
