import { Locale } from '../../client';
import { RequestManager } from './RequestManager.class';
interface UserRequests {
    REGISTER: {
        body: {
            mail: string;
            password: string;
        };
    };
    REGISTER_VALIDATE: {
        token: string;
    };
    REGISTER_VERIFY: {
        body: {
            token: string;
            name: string;
            tag: string;
            description: string;
            locale: Locale;
        };
    };
    EDIT: {
        authorization: string;
        body: {
            name?: string;
            tag?: string;
            description?: string;
            locale?: Locale;
        };
    };
    PASSWORD_CHANGE: {
        authorization: string;
        body: {
            old: string;
            new: string;
        };
    };
    PASSWORD_RESET: {
        body: {
            mail: string;
        };
    };
    PASSWORD_RESET_VALIDATE: {
        token: string;
    };
    PASSWORD_RESET_CONFIRM: {
        body: {
            token: string;
            password: string;
        };
    };
    DELETE: {
        authorization: string;
    };
    GET_CURRENT: {
        authorization: string;
    };
    GET_PREVIEW: {
        uuid: string;
    };
    GET_AVATAR: {
        uuid: string;
    };
    UPLOAD_AVATAR: {
        authorization: string;
        body: {
            formData: FormData;
        };
    };
    DELETE_AVATAR: {
        authorization: string;
    };
    CHECK_TAG: {
        tag: string;
    };
    CHECK_MAIL: {
        mail: string;
    };
}
export declare class UserRequestManager extends RequestManager<UserRequests> {
    constructor();
}
export {};
