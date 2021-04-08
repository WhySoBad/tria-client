import { BannedMemberConstructor } from './BannedMember.types';
import { ChatConstructor } from './Chat.types';
import { GroupRole } from './Member.types';

export interface GroupConstructor extends ChatConstructor {
  /**
   * Banned members of the group
   */

  banned: Array<BannedMemberConstructor>;
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
   * Members of the group
   */

  members?: Array<{ uuid: string; role: GroupRole }>;
}
