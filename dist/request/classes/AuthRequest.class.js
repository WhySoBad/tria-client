"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRequestManager = void 0;
const RequestManager_class_1 = require("./RequestManager.class");
class AuthRequestManager extends RequestManager_class_1.RequestManager {
    constructor() {
        super({ suburl: 'auth' });
        this.addRequest('LOGIN', 'login', 'POST');
        this.addRequest('VALIDATE', 'validate', 'GET');
    }
}
exports.AuthRequestManager = AuthRequestManager;
