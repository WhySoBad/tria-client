import { Client } from '../../client';
import { Collection } from '../../util/Collection.class';
import { Member, Message } from '../classes';
import { ChatConstructor, ChatType } from '../types';
import { MemberLog } from './MemberLog.class';
export declare abstract class Chat {
    readonly client: Client;
    readonly uuid: string;
    readonly createdAt: Date;
    readonly color: string;
    protected _type: ChatType;
    protected _members: Map<string, Member>;
    protected _messages: Map<string, Message>;
    protected _memberLog: Map<string, MemberLog>;
    protected _lastFetched: boolean;
    protected _lastRead: Date;
    constructor(client: Client, { uuid, members, messages, type, memberLog, createdAt, lastRead }: ChatConstructor);
    get type(): ChatType;
    get lastRead(): Date;
    get members(): Collection<string, Member>;
    get writeable(): boolean;
    get messages(): Collection<string, Message>;
    get lastFetched(): boolean;
    get memberLog(): Collection<string, MemberLog>;
    delete(): Promise<void>;
    sendMessage(message: string): Promise<void>;
    fetchMessages(timestamp: number, amount?: number): Promise<void>;
    readUntil(timestamp: Date | number): Promise<void>;
}
