import { GroupRole, GroupType } from '../../chat';
import { RequestManager } from './RequestManager.class';
interface ChatRequests {
    CREATE_GROUP: {
        body: {
            name: string;
            tag: string;
            description: string;
            type: GroupType;
            members: Array<{
                uuid: string;
                role: GroupRole;
            }>;
        };
        authorization: string;
    };
    CREATE_PRIVATE: {
        body: {
            user: string;
        };
        authorization: string;
    };
    GET: {
        uuid: string;
        authorization: string;
    };
    GET_PREVIEW: {
        uuid: string;
    };
    DELETE: {
        uuid: string;
        authorization: string;
    };
    JOIN: {
        uuid: string;
        authorization: string;
    };
    LEAVE: {
        uuid: string;
        authorization: string;
    };
    ADMIN_BAN: {
        uuid: string;
        body: {
            uuid: string;
        };
        authorization: string;
    };
    ADMIN_UNBAN: {
        uuid: string;
        body: {
            uuid: string;
        };
        authorization: string;
    };
    ADMIN_KICK: {
        uuid: string;
        body: {
            uuid: string;
        };
        authorization: string;
    };
    FETCH_MESSAGES: {
        uuid: string;
        timestamp: number;
        amount: string;
        authorization: string;
    };
    CHECK_TAG: {
        tag: string;
    };
    LAST_READ: {
        uuid: string;
        timestamp: number;
        authorization: string;
    };
    GET_AVATAR: {
        uuid: string;
    };
    UPLOAD_AVATAR: {
        uuid: string;
        authorization: string;
        body: {
            formData: FormData;
        };
    };
    DELETE_AVATAR: {
        uuid: string;
        authorization: string;
    };
    READ_MESSAGES: {
        uuid: string;
        timestamp: number;
        authorization: string;
    };
}
export declare class ChatRequestManager extends RequestManager<ChatRequests> {
    constructor();
}
export {};
