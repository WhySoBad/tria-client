import { MessageContstructor, MemberConstructor } from '.';

export enum ChatType {
  /**
   * Group chat
   */

  GROUP = 0,

  /**
   * Private chat
   */

  PRIVATE = 1,

  /**
   * Private group
   */

  PRIVATE_GROUP = 2,
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
