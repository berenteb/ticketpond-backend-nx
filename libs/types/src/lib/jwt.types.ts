export type JwtUser = {
  firstName: string;
  lastName: string;
  email: string;
  sub: string;
  merchantId?: string;
  permissions: PermissionLevel[];
};

export enum PermissionLevel {
  ADMIN = 'admin:all',
  MERCHANT = 'merchant:all',
}
