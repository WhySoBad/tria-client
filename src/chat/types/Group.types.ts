import { Permission } from './Admin.types';
import { BannedMemberConstructor } from './BannedMember.types';
import { ChatConstructor } from './Chat.types';
import { GroupRole } from './Member.types';

export interface GroupConstructor extends ChatConstructor {
  /**
   * Banned members of the group
   */

  banned: Array<BannedMemberConstructor>;
}

export enum GroupType {
  PRIVATE_GROUP = 'PRIVATE_GROUP',
  GROUP = 'GROUP',
}

export interface GroupProps {
  /**
   * Name of the group
   */

  name: string;

  /**
   * Unique tag of the group
   */

  tag: string;

  /**
   * Description of the group
   */

  description: string;

  /**
   * Type of the group
   */

  type: GroupType;

  /**
   * Members of the group
   */

  members?: Array<{ uuid: string; role: GroupRole }>;
}

export interface EditMemberOptions {
  /**
   * New role of the member
   */

  role: GroupRole;

  /**
   * New permissions of the member
   */

  permissions?: Array<Permission>;
}
