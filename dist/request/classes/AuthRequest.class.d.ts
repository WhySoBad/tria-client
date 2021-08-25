import { RequestManager } from './RequestManager.class';
interface AuthRequests {
    LOGIN: {
        body: {
            username: string;
            password: string;
        };
    };
    VALIDATE: {
        authorization: string;
    };
}
export declare class AuthRequestManager extends RequestManager<AuthRequests> {
    constructor();
}
export {};
