import { MemberConstructor } from './Member.types';
import { MemberLogConstructor } from './MemberLog.types';
import { MessageContstructor } from './Message.types';

export enum ChatType {
  /**
   * Group chat
   */

  GROUP = 'GROUP',

  /**
   * Private chat
   */

  PRIVATE = 'PRIVATE',

  /**
   * Private group
   */

  PRIVATE_GROUP = 'PRIVATE_GROUP',
}

export interface ChatConstructor {
  /**
   * Uuid of the chat
   */

  uuid: string;

  /**
   * Type of the chat
   */

  type: ChatType;

  /**
   * Date when the chat was created
   */

  createdAt: Date;

  /**
   * Name of the chat
   */

  name: string | null;

  /**
   * Unique tag of the chat
   */

  tag: string | null;

  /**
   * Description of the chat
   */

  description: string | null;

  /**
   * Members of the chat
   */

  members: Array<MemberConstructor>;

  /**
   * Messages of the chat
   */

  messages: Array<MessageContstructor>;

  /**
   * MemberLog of the chat
   */

  memberLog: Array<MemberLogConstructor>;

  /**
   * Date when the current user read the chat for the last time
   */

  lastRead: Date;
}

export interface ChatEdit {
  /**
   * Uuid of the chat
   */

  uuid: string;

  /**
   * Type of the chat
   */

  type: ChatType;

  /**
   * Name of the chat
   */

  name: string | null;

  /**
   * Unique tag of the chat
   */

  tag: string | null;

  /**
   * Description of the chat
   */

  description: string | null;

  /**
   * Avatar url of the chat
   */

  avatar: string | null;
}

export interface ChatPreview {
  /**
   * Uuid of the chat
   */

  uuid: string;

  /**
   * Type of the chat
   */

  type: ChatType;

  /**
   * Name of the chat
   */

  name: string | null;

  /**
   * Unique tag of the chat
   */

  tag: string | null;

  /**
   * Description of the chat
   */

  description: string | null;

  /**
   * Amount of members of the chat
   */

  size: number;

  /**
   * Current online members
   */

  online: number;

  /**
   * Color of the chat
   */

  color: string;

  /**
   * URL to the avatar of the chat
   */

  avatarURL: string;
}
