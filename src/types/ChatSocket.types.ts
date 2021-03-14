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
  MESSAGE = 'MESSAGE',
  CHAT_EDIT = 'CHAT_EDIT',
  MESSAGE_EDIT = 'MESSAGE_EDIT',
  MEMBER_EDIT = 'MEMBER_EDIT',
  CHAT_DELETE = 'CHAT_DELETE',
  MEMBER_JOIN = 'MEMBER_JOIN',
  MEMBER_LEAVE = 'MEMBER_LEAVE',
  MEMBER_BANNED = 'MEMBER_BANNED',
}
