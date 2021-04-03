import { ChatSocketEvents } from '.';

export interface Credentials {
  /**
   * Username of the user
   */

  username: string;

  /**
   * Password of the user
   */

  password: string;
}

export interface ClientConstructor {
  /**
   * Boolean whether the integrated logger should be used
   */

  log?: boolean;

  /**
   * Credentials of the user
   */

  credentials?: Credentials;

  /**
   * Token of the user
   */

  token?: string;
}

export type ConnectionProps = Credentials | string;

export interface ClientEvents extends ChatSocketEvents {
  READY: () => void;
}

export enum ClientEvent {
  /**
   * Client ready event
   */

  READY = 'READY',

  /**
   * WebSocket connect event
   */

  CONNECT = 'CONNECT',

  /**
   * WebSocket disconnect event
   */

  DISCONNECT = 'DISCONNECT',

  /**
   * Error event
   */

  ERROR = 'ERROR',

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
}
