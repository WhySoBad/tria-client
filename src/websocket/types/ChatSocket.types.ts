import { GroupConstructor, GroupRole, Member, Message, PrivateChatConstructor } from '../../chat';
import { Permission } from '../../chat/types/Admin.types';
import { ChatEdit } from '../../chat/types/Chat.types';
import { BaseSocketConstructor, SocketEvents } from './BaseSocket.types';

export interface ChatSocketConstructor extends BaseSocketConstructor {}

export interface ChatSocketEvents extends SocketEvents {
  CHAT_CONNECT: () => void;

  CHAT_DISCONNECT: () => void;

  MESSAGE: (chat: string, message: Message) => void;

  CHAT_EDIT: (chat: string, edit: ChatEdit) => void;

  MESSAGE_EDIT: (
    chat: string,
    message: {
      chat: string;
      uuid: string;
      text: string;
      edited: number;
      editedAt: Date;
    }
  ) => void;

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

  PRIVATE_CREATE: (privateChat: PrivateChatConstructor) => void;

  GROUP_CREATE: (groupChat: GroupConstructor) => void;
}

export enum ChatSocketEvent {
  /**
   * Connect event
   */

  CONNECT = 'CHAT_CONNECT',

  /**
   * Disconnect event
   */

  DISCONNECT = 'CHAT_DISCONNECT',
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

  /**
   * Private chat create event
   */

  PRIVATE_CREATE = 'PRIVATE_CREATE',

  /**
   * Group chat create event
   */

  GROUP_CREATE = 'GROUP_CREATE',
}
