import { Member, Message } from '../classes';
import { BaseSocketConstructor, SocketEvents, ChatRole } from '.';
import { ChatEdit } from './Chat.types';

export interface ChatSocketConstructor extends BaseSocketConstructor {}

export interface ChatSocketEvents extends SocketEvents {
  MESSAGE: (message: Message) => void;

  CHAT_EDIT: (chat: ChatEdit) => void;

  MESSAGE_EDIT: (message: {
    chat: string;
    uuid: string;
    text: string;
    pinned: boolean;
    edited: number;
    editedAt: Date;
  }) => void;

  MEMBER_EDIT: (
    chat: string,
    member: {
      user: string;
      role: ChatRole;
      permissions: Array<any>;
    }
  ) => void;

  CHAT_DELETE: (chat: string) => void;

  MEMBER_JOIN: (chat: string, member: Member) => void;

  MEMBER_LEAVE: (chat: string, member: string) => void;

  MEMBER_BANNED: (chat: string, member: string) => void;
}

export enum ChatSocketEvent {
  /**
   * Message event
   */

  MESSAGE = 'MESSAGE',

  /**
   * Chat edit event
   */

  CHAT_EDIT = 'CHAT_EDIT',

  /**
   * Message edit event
   */

  MESSAGE_EDIT = 'MESSAGE_EDIT',

  /**
   * Member edit event
   */

  MEMBER_EDIT = 'MEMBER_EDIT',

  /**
   * Chat delete event
   */

  CHAT_DELETE = 'CHAT_DELETE',

  /**
   * Member join event
   */

  MEMBER_JOIN = 'MEMBER_JOIN',

  /**
   * Member leave event
   */

  MEMBER_LEAVE = 'MEMBER_LEAVE',

  /**
   * Member banned event
   */

  MEMBER_BANNED = 'MEMBER_BANNED',
}
