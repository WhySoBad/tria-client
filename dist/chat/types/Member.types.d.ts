import { UserConstructor } from '../../client';
export declare enum GroupRole {
    OWNER = "OWNER",
    ADMIN = "ADMIN",
    MEMBER = "MEMBER"
}
export interface MemberConstructor {
    role: GroupRole;
    joinedAt: Date;
    user: UserConstructor;
}
