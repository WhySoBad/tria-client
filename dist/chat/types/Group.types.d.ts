import { Permission } from './Admin.types';
import { BannedMemberConstructor } from './BannedMember.types';
import { ChatConstructor } from './Chat.types';
import { GroupRole } from './Member.types';
export interface GroupConstructor extends ChatConstructor {
    banned: Array<BannedMemberConstructor>;
    avatar: string | null;
}
export declare enum GroupType {
    PRIVATE_GROUP = "PRIVATE_GROUP",
    GROUP = "GROUP"
}
export interface GroupProps {
    name: string;
    tag: string;
    description: string;
    type: GroupType;
    members?: Array<{
        uuid: string;
        role: GroupRole;
    }>;
    avatar: string | null;
}
export interface EditMemberOptions {
    role: GroupRole;
    permissions?: Array<Permission>;
}
