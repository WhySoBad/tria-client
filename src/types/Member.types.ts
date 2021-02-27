import { UserConstructor } from '.';

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
