import { Locale } from '../../client';
import { BaseSocketConstructor, SocketEvents } from './BaseSocket.types';

export interface UserSocketConstructor extends BaseSocketConstructor {}

export interface UserSocketEvents extends SocketEvents {
  USER_CONNECT: () => void;

  USER_DISCONNECT: () => void;

  USER_EDIT: (
    uuid: string,
    user: { name: string; tag: string; description: string; locale: Locale; avatar: string | null }
  ) => void;

  USER_DELETE: (uuid: string) => void;
}

export enum UserSocketEvent {
  /**
   * UserSocket connect event
   */

  CONNECT = 'USER_CONNECT',

  /**
   * UserSocket disconnect event
   */

  DISCONNECT = 'USER_DISCONNECT',

  /**
   * User edit event
   */

  USER_EDIT = 'USER_EDIT',

  /**
   * User delete event
   */

  USER_DELETE = 'USER_DELETE',
}
