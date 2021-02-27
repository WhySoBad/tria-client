import { UserConstructor } from './User.types';

export enum ChatRole {
  OWNER = 0,
  ADMIN = 1,
  MEMBER = 2,
}

export interface MemberConstructor {
  role: ChatRole;
  joinedAt: Date;
  user: UserConstructor;
}
