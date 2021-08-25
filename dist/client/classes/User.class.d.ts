import { UserConstructor } from '../types';
import { Client } from './Client.class';
export declare class User {
    readonly uuid: string;
    readonly createdAt: Date;
    readonly client: Client;
    private _name;
    private _tag;
    private _avatar;
    private _lastSeen;
    private _description;
    private _locale;
    private _online;
    private _color;
    constructor(props: UserConstructor);
    get name(): string;
    get tag(): string;
    get avatarURL(): string | null;
    get lastSeen(): Date;
    get description(): string;
    get locale(): string;
    get online(): boolean;
    get color(): string;
}
