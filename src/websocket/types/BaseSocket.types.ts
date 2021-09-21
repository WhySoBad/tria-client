import { Client } from '../../client';

export interface BaseSocketConstructor {
  /**
   * Client who initialized the socket
   */

  client: Client;
  /**
   * Token of the user
   */

  token: string;

  /**
   * Url to connect to
   */

  url: string;
}

export interface ActionError {
  /**
   * Uuid of the action
   */

  uuid: string;

  /**
   * Error status code
   */

  statusCode: number;

  /**
   * Error message
   */

  message: string;

  /**
   * Reason
   */

  error: string;
}

export interface SocketEvents {
  CONNECT: () => void;

  DISCONNECT: () => void;

  ERROR: (error: any) => void;

  ACTION_SUCCESS: (uuid: string) => void;

  ACTION_ERROR: (action: ActionError) => void;
}

export enum SocketEvent {
  /**
   * WebSocket connect event
   */

  CONNECT = 'CONNECT',

  /**
   * Disconnect event
   */

  DISCONNECT = 'DISCONNECT',

  /**
   * WebSocket error event
   */

  ERROR = 'ERROR',

  /**
   * WebSocket action success event
   */

  ACTION_SUCCESS = 'ACTION_SUCCESS',

  /**
   * WebSocket action error event
   */

  ACTION_ERROR = 'ACTION_ERROR',
}
