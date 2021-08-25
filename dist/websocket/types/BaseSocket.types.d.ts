import { Client } from '../../client';
export interface BaseSocketConstructor {
    client: Client;
    token: string;
    url: string;
}
export interface ActionError {
    uuid: string;
    statusCode: number;
    message: string;
    error: string;
}
export interface SocketEvents {
    CONNECT: () => void;
    DISCONNECT: () => void;
    ERROR: (error: any) => void;
    ACTION_SUCCESS: (uuid: string) => void;
    ACTION_ERROR: (action: ActionError) => void;
}
export declare enum SocketEvent {
    CONNECT = "CONNECT",
    DISCONNECT = "DISCONNECT",
    ERROR = "ERROR",
    ACTION_SUCCESS = "ACTION_SUCCESS",
    ACTION_ERROR = "ACTION_ERROR"
}
