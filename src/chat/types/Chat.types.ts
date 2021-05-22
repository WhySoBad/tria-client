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
}

export interface ChatPreview {
  uuid: string;
  type: ChatType;
  description: string;
  name: string;
  tag: string;
  size: number;
  online: number;
  color: string;
}
