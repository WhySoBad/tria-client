import { BannedMemberConstructor } from '../types/BannedMember.types';
export declare class BannedMember {
    readonly bannedAt: Date;
    readonly uuid: string;
    readonly createdAt: Date;
    readonly name: string;
    readonly tag: string;
    readonly description: string;
    readonly avatarURL: string | null;
    readonly color: string;
    constructor({ bannedAt, user }: BannedMemberConstructor);
}
