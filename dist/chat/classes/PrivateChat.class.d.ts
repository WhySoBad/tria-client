import { Client } from '../../client';
import { Chat } from '../classes';
import { PrivateChatConstructor } from '../types';
import { Member } from './Member.class';
export declare class PrivateChat extends Chat {
    constructor(client: Client, props: PrivateChatConstructor);
    get participant(): Member;
}
