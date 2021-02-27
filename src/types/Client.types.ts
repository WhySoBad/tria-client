import { ChatSocketEvents } from '.';

export interface Credentials {
  username: string;
  password: string;
}

export interface ClientConstructor {
  log?: boolean;
  credentials?: Credentials;
  token?: string;
}

export type ConnectionProps = Credentials | string;

export interface ClientEvents extends ChatSocketEvents {
  READY: () => void;
}

export enum ClientEvent {
  READY = 'READY',
  /**
   * BaseSocket events
   */

  CONNECT = 'CONNECT',
  DISCONNECT = 'DISCONNECT',
  ERROR = 'ERROR',

  /**
   * ChatSocket events
   */

  MESSAGE = 'MESSAGE',
  CHAT_EDIT = 'CHAT_EDIT',
  MESSAGE_EDIT = 'MESSAGE_EDIT',
  MEMBER_EDIT = 'MEMBER_EDIT',
  CHAT_DELETE = 'CHAT_DELETE',
  MEMBER_JOIN = 'MEMBER_JOIN',
  MEMBER_LEAVE = 'MEMBER_LEAVE',
}
