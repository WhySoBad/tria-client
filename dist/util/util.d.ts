/// <reference types="node" />
import { ChatPreview } from '../chat';
import { Client, Credentials, Locale, UserPreview } from '../client';
export declare const loginUser: (credentials: Credentials) => Promise<string>;
export declare const validateToken: (token: string) => Promise<boolean>;
export declare const registerUser: ({ password, username }: Credentials) => Promise<void>;
export declare const validateRegister: (token: string) => Promise<boolean>;
export declare const verifyRegister: (token: string, data: {
    name: string;
    tag: string;
    description: string;
    locale: Locale;
}) => Promise<void>;
export declare const requestPasswordReset: (mail: string) => Promise<void>;
export declare const validatePasswordReset: (token: string) => Promise<boolean>;
export declare const confirmPasswordReset: (token: string, password: string) => Promise<void>;
export declare const getUserPreview: (uuid: string) => Promise<UserPreview>;
export declare const getUserAvatar: (uuid: string) => Promise<Buffer>;
export declare const getChatPreview: (uuid: string) => Promise<ChatPreview>;
export declare const checkUserTag: (tag: string) => Promise<boolean>;
export declare const checkUserMail: (mail: string) => Promise<boolean>;
export declare const checkGroupTag: (tag: string) => Promise<boolean>;
export declare const delay: (ms: number) => Promise<void>;
export declare const handleAction: (client: Client, actionUuid: string) => Promise<void>;
export declare const colorForUuid: (uuid: string) => string;
