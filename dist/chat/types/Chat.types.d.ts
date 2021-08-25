import { MemberConstructor } from './Member.types';
import { MemberLogConstructor } from './MemberLog.types';
import { MessageContstructor } from './Message.types';
export declare enum ChatType {
    GROUP = "GROUP",
    PRIVATE = "PRIVATE",
    PRIVATE_GROUP = "PRIVATE_GROUP"
}
export interface ChatConstructor {
    uuid: string;
    type: ChatType;
    createdAt: Date;
    name: string | null;
    tag: string | null;
    description: string | null;
    members: Array<MemberConstructor>;
    messages: Array<MessageContstructor>;
    memberLog: Array<MemberLogConstructor>;
    lastRead: Date;
}
export interface ChatEdit {
    uuid: string;
    type: ChatType;
    name: string | null;
    tag: string | null;
    description: string | null;
    avatar: string | null;
}
export interface ChatPreview {
    uuid: string;
    type: ChatType;
    name: string | null;
    tag: string | null;
    description: string | null;
    size: number;
    online: number;
    color: string;
    avatarURL: string;
}
