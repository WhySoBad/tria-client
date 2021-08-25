import { Client } from '../../client';
import { MessageContstructor } from '../types';
export declare class Message {
    readonly client: Client;
    readonly uuid: string;
    readonly chat: string;
    readonly createdAt: Date;
    readonly sender: string;
    private _editedAt;
    private _edited;
    private _text;
    private _pinned;
    constructor(client: Client, props: MessageContstructor);
    get editedAt(): Date | null;
    get edited(): number;
    get text(): string;
    get pinned(): boolean;
    get editable(): boolean;
    get pinnable(): boolean;
    setText(text: string): Promise<void>;
    pin(): Promise<void>;
    unpin(): Promise<void>;
}
