import { User } from '../../client';
import { GroupRole, MemberConstructor } from '../types';
export declare class Member {
    readonly user: User;
    readonly joinedAt: Date;
    readonly role: GroupRole;
    constructor(props: MemberConstructor);
}
