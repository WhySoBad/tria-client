import { MemberConstructor } from './Member.types';

export interface AdminConstructor extends MemberConstructor {
  /**
   * Date when the member was promoted
   */

  promotedAt: Date;

  /**
   * Permissions of the admin
   */

  permissions: Array<Permission>;
}

export enum Permission {
  KICK = 'KICK', //kick users
  BAN = 'BAN', //ban users
  UNBAN = 'UNBAN', //unban users
  CHAT_EDIT = 'CHAT_EDIT', //edit chat
  MEMBER_EDIT = 'MEMBER_EDIT', //edit users
}
