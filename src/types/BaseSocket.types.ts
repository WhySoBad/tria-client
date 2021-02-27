export interface BaseSocketConstructor {
  token: string;
  url: string;
}

export interface SocketEvents {
  CONNECT: () => void;

  DISCONNECT: () => void;

  ERROR: (error: any) => void;
}

export enum SocketEvent {
  CONNECT = 'CONNECT',
  DISCONNECT = 'DISCONNECT',
  ERROR = 'ERROR',
}
