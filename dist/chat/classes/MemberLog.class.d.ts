import { MemberLogConstructor } from '../types/MemberLog.types';
export declare class MemberLog {
    readonly user: string;
    readonly chat: string;
    readonly timestamp: Date;
    readonly joined: boolean;
    constructor({ user, chat, timestamp, joined }: MemberLogConstructor);
}
