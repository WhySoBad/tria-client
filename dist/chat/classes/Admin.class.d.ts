import { AdminConstructor, Permission } from '../types/Admin.types';
import { Member } from './Member.class';
export declare class Admin extends Member {
    readonly promotedAt: Date;
    readonly permissions: Array<Permission>;
    constructor(constructor: AdminConstructor);
    get canBan(): boolean;
    get canUnban(): boolean;
    get canEditGroup(): boolean;
    get canEditMembers(): boolean;
    get canKick(): boolean;
}
