import { JwtUser } from './jwt.types';

export type Identifiable = {
  id: string;
};

export type WithoutId<T extends Identifiable> = Omit<T, 'id'>;

export type ReqWithUser = {
  user: JwtUser;
} & Request;
