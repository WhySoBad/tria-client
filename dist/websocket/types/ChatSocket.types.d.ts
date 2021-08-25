import { GroupConstructor, GroupRole, Member, Message, PrivateChatConstructor } from '../../chat';
import { Permission } from '../../chat/types/Admin.types';
import { ChatEdit } from '../../chat/types/Chat.types';
import { BaseSocketConstructor, SocketEvents } from './BaseSocket.types';
export interface ChatSocketConstructor extends BaseSocketConstructor {
}
export interface ChatSocketEvents extends SocketEvents {
    CHAT_CONNECT: () => void;
    CHAT_DISCONNECT: () => void;
    MESSAGE: (chat: string, message: Message) => void;
    CHAT_EDIT: (chat: string, edit: ChatEdit) => void;
    MESSAGE_EDIT: (chat: string, message: {
        chat: string;
        uuid: string;
        text: string;
        pinned: boolean;
        edited: number;
        editedAt: Date;
    }) => void;
    MEMBER_EDIT: (chat: string, member: {
        user: string;
        role: GroupRole;
        permissions: Array<Permission>;
    }) => void;
    CHAT_DELETE: (chat: string) => void;
    MEMBER_JOIN: (chat: string, member: Member) => void;
    MEMBER_LEAVE: (chat: string, member: string) => void;
    MEMBER_BAN: (chat: string, member: string) => void;
    MEMBER_UNBAN: (chat: string, member: string) => void;
    MEMBER_ONLINE: (member: string) => void;
    MEMBER_OFFLINE: (member: string) => void;
    PRIVATE_CREATE: (privateChat: PrivateChatConstructor) => void;
    GROUP_CREATE: (groupChat: GroupConstructor) => void;
}
export declare enum ChatSocketEvent {
    CONNECT = "CHAT_CONNECT",
    DISCONNECT = "CHAT_DISCONNECT",
    MESSAGE = "MESSAGE",
    CHAT_EDIT = "CHAT_EDIT",
    MESSAGE_EDIT = "MESSAGE_EDIT",
    MEMBER_EDIT = "MEMBER_EDIT",
    CHAT_DELETE = "CHAT_DELETE",
    MEMBER_JOIN = "MEMBER_JOIN",
    MEMBER_LEAVE = "MEMBER_LEAVE",
    MEMBER_BAN = "MEMBER_BAN",
    MEMBER_UNBAN = "MEMBER_UNBAN",
    MEMBER_ONLINE = "MEMBER_ONLINE",
    MEMBER_OFFLINE = "MEMBER_OFFLINE",
    PRIVATE_CREATE = "PRIVATE_CREATE",
    GROUP_CREATE = "GROUP_CREATE"
}
