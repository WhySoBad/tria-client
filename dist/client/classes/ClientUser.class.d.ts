import { Chat } from '../../chat';
import { Collection } from '../../util/Collection.class';
import { ClientUserConstructor, Locale } from '../types';
import { Client } from './Client.class';
export declare class ClientUser {
    readonly client: Client;
    readonly uuid: string;
    readonly createdAt: Date;
    private _name;
    private _tag;
    private _description;
    private _mail;
    private _lastSeen;
    private _online;
    private _locale;
    private _avatar;
    private _chats;
    private _color;
    constructor(client: Client, props: ClientUserConstructor);
    get name(): string;
    get tag(): string;
    get description(): string;
    get mail(): string;
    get lastSeen(): Date;
    get online(): boolean;
    get locale(): Locale;
    get avatarURL(): string | null;
    get chats(): Collection<string, Chat>;
    get color(): string;
    setName(name: string): Promise<void>;
    setTag(tag: string): Promise<void>;
    setDescription(description: string): Promise<void>;
    setLocale(locale: Locale): Promise<void>;
    setSettings(settings: {
        name?: string;
        tag?: string;
        description?: string;
        locale?: Locale;
    }): Promise<void>;
    setAvatar(avatar: FormData): Promise<void>;
    deleteAvatar(): Promise<void>;
    setUserInfo(userInfo: {
        locale?: Locale;
        description?: string;
        name?: string;
        tag?: string;
        avatar?: string;
    }): Promise<void>;
}
