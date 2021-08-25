import { MemberConstructor } from './Member.types';
export interface AdminConstructor extends MemberConstructor {
    promotedAt: Date;
    permissions: Array<Permission>;
}
export declare enum Permission {
    KICK = "KICK",
    BAN = "BAN",
    UNBAN = "UNBAN",
    CHAT_EDIT = "CHAT_EDIT",
    MEMBER_EDIT = "MEMBER_EDIT"
}
