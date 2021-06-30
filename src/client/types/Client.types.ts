import { ChatSocketEvents } from '../../websocket';

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

export interface SearchOptions {
  /**
   * Text to query for
   */

  text: string;

  /**
   * Boolean whether users should be searched
   */

  checkUser?: boolean;

  /**
   * Boolean whether chats should be searched
   */

  checkChat?: boolean;

  /**
   * Boolean whether uuids should be checked
   */

  checkUuid?: boolean;

  /**
   * Boolean whether tags should be checked
   */

  checkTag?: boolean;

  /**
   * Boolean whether names should be checked
   */

  checkName?: boolean;
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

  /**
   * Member ban event
   */

  MEMBER_BAN = 'MEMBER_BAN',

  /**
   * Member unban event
   */

  MEMBER_UNBAN = 'MEMBER_UNBAN',
}
