import { ClientConstructor } from '../types';
import { BaseClient } from './BaseClient.class';
export declare class Client extends BaseClient {
    constructor({ credentials, log, token }: ClientConstructor);
}
