import { Credentials } from '.';
export interface BaseClientConstructor {
    auth: string | Credentials;
    logging: boolean;
}
