"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
const BaseClient_class_1 = require("./BaseClient.class");
class Client extends BaseClient_class_1.BaseClient {
    constructor({ credentials, log, token }) {
        if (!token && !credentials)
            throw new Error('Missing token or credentials');
        super({ auth: credentials || token || '', logging: !!log });
        this._client = this;
    }
}
exports.Client = Client;
