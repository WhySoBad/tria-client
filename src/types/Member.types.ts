import { UserConstructor } from '.';

export enum ChatRole {
  /**
   * Owner role
   */

  OWNER = 0,

  /**
   * Admin role
   */

  ADMIN = 1,

  /**
   * Member role
   */

  MEMBER = 2,
}

export interface MemberConstructor {
  /**
   * Role of the member
   */

  role: ChatRole;

  /**
   * Date when the member joined the chat
   */

  joinedAt: Date;

  /**
   * User of the member
   */

  user: UserConstructor;
}
