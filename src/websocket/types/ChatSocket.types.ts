import { ChatEdit } from '../../chat/types/Chat.types';
import { Permission } from '../../chat/types/Admin.types';
import { GroupRole, Member, Message } from '../../chat';
import { BaseSocketConstructor, SocketEvents } from './BaseSocket.types';

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
      role: GroupRole;
      permissions: Array<Permission>;
    }
  ) => void;

  CHAT_DELETE: (chat: string) => void;

  MEMBER_JOIN: (chat: string, member: Member) => void;

  MEMBER_LEAVE: (chat: string, member: string) => void;

  MEMBER_BAN: (chat: string, member: string) => void;

  MEMBER_UNBAN: (chat: string, member: string) => void;

  MEMBER_ONLINE: (member: string) => void;

  MEMBER_OFFLINE: (member: string) => void;
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
   * Member ban event
   */

  MEMBER_BAN = 'MEMBER_BAN',

  /**
   * Member unban event
   */

  MEMBER_UNBAN = 'MEMBER_UNBAN',

  /**
   * Member online event
   */

  MEMBER_ONLINE = 'MEMBER_ONLINE',

  /**
   * Member offline event
   */

  MEMBER_OFFLINE = 'MEMBER_OFFLINE',
}
