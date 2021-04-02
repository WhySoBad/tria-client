export interface BaseSocketConstructor {
  /**
   * Token of the user
   */

  token: string;

  /**
   * Url to connect to
   */

  url: string;
}

export interface SocketEvents {
  CONNECT: () => void;

  DISCONNECT: () => void;

  ERROR: (error: any) => void;
}

export enum SocketEvent {
  /**
   * WebSocket connect event
   */

  CONNECT = 'CONNECT',

  /**
   * WebSocket disconnect event
   */

  DISCONNECT = 'DISCONNECT',

  /**
   * WebSocket error event
   */

  ERROR = 'ERROR',
}
