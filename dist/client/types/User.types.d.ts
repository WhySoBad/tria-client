import { Client } from '../classes';
export interface UserConstructor {
    client: Client;
    uuid: string;
    name: string;
    tag: string;
    avatar: string | null;
    createdAt: Date;
    lastSeen: Date;
    description: string;
    locale: Locale;
    online: boolean;
}
export interface UserPreview {
    uuid: string;
    name: string;
    tag: string;
    description: string;
    color: string;
    avatarURL: string | null;
}
export declare type Locale = 'EN' | 'DE' | 'FR';
