import { Locale } from '../../client';
import { BaseSocketConstructor, SocketEvents } from './BaseSocket.types';
export interface UserSocketConstructor extends BaseSocketConstructor {
}
export interface UserSocketEvents extends SocketEvents {
    USER_CONNECT: () => void;
    USER_DISCONNECT: () => void;
    USER_EDIT: (uuid: string, user: {
        name: string;
        tag: string;
        description: string;
        locale: Locale;
        avatar: string | null;
    }) => void;
    USER_DELETE: (uuid: string) => void;
    MESSAGE_READ: (chat: string, timestamp: number) => void;
}
export declare enum UserSocketEvent {
    CONNECT = "USER_CONNECT",
    DISCONNECT = "USER_DISCONNECT",
    USER_EDIT = "USER_EDIT",
    USER_DELETE = "USER_DELETE",
    MESSAGE_READ = "MESSAGE_READ"
}
