import { ChatSocketEvents } from '../../websocket';
import { UserSocketEvents } from '../../websocket/types/UserSocket.types';
export interface Credentials {
    username: string;
    password: string;
}
export interface SearchOptions {
    text: string;
    checkUser?: boolean;
    checkChat?: boolean;
    checkUuid?: boolean;
    checkTag?: boolean;
    checkName?: boolean;
}
export interface ClientConstructor {
    log?: boolean;
    credentials?: Credentials;
    token?: string;
}
export declare type ConnectionProps = Credentials | string;
export interface ClientEvents extends ChatSocketEvents, UserSocketEvents {
    READY: () => void;
}
export declare enum ClientEvent {
    READY = "READY",
    CONNECT = "CONNECT",
    DISCONNECT = "DISCONNECT",
    CHAT_CONNECT = "CHAT_CONNECT",
    CHAT_DISCONNECT = "CHAT_DISCONNECT",
    USER_CONNECT = "USER_CONNECT",
    USER_DISCONNECT = "USER_DISCONNECT",
    ERROR = "ERROR",
    MESSAGE = "MESSAGE",
    CHAT_EDIT = "CHAT_EDIT",
    MESSAGE_EDIT = "MESSAGE_EDIT",
    MEMBER_EDIT = "MEMBER_EDIT",
    CHAT_DELETE = "CHAT_DELETE",
    MEMBER_JOIN = "MEMBER_JOIN",
    MEMBER_LEAVE = "MEMBER_LEAVE",
    MEMBER_BAN = "MEMBER_BAN",
    MEMBER_UNBAN = "MEMBER_UNBAN"
}
