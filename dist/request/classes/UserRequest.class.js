"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRequestManager = void 0;
const RequestManager_class_1 = require("./RequestManager.class");
class UserRequestManager extends RequestManager_class_1.RequestManager {
    constructor() {
        super({ suburl: 'user' });
        this.addRequest('DELETE', 'delete', 'DELETE');
        this.addRequest('REGISTER', 'register', 'POST');
        this.addRequest('REGISTER_VALIDATE', 'register/validate/%token', 'GET');
        this.addRequest('REGISTER_VERIFY', 'register/verify', 'POST');
        this.addRequest('EDIT', 'edit', 'PUT');
        this.addRequest('PASSWORD_CHANGE', 'password/change', 'PUT');
        this.addRequest('PASSWORD_RESET', 'password/reset', 'POST');
        this.addRequest('PASSWORD_RESET_VALIDATE', 'password/reset/validate/%token', 'GET');
        this.addRequest('PASSWORD_RESET_CONFIRM', 'password/reset/confirm', 'POST');
        this.addRequest('GET_PREVIEW', '%uuid', 'GET');
        this.addRequest('GET_CURRENT', 'current', 'GET');
        this.addRequest('GET_AVATAR', '%uuid/avatar', 'GET', { responseType: 'blob' });
        this.addRequest('UPLOAD_AVATAR', 'avatar/upload', 'POST');
        this.addRequest('DELETE_AVATAR', 'avatar/delete', 'DELETE');
        this.addRequest('CHECK_TAG', 'check/tag/%tag', 'GET');
        this.addRequest('CHECK_MAIL', 'check/mail/%mail', 'GET');
    }
}
exports.UserRequestManager = UserRequestManager;
