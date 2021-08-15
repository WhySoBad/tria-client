import { UserConstructor } from '../../client';

export enum GroupRole {
  /**
   * Owner role
   */

  OWNER = 'OWNER',

  /**
   * Admin role
   */

  ADMIN = 'ADMIN',

  /**
   * Member role
   */

  MEMBER = 'MEMBER',
}

export interface MemberConstructor {
  /**
   * Role of the member
   */

  role: GroupRole;

  /**
   * Date when the member joined the chat
   */

  joinedAt: Date;

  /**
   * User of the member
   */

  user: UserConstructor;
}
