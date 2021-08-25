"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatRequestManager = void 0;
const RequestManager_class_1 = require("./RequestManager.class");
class ChatRequestManager extends RequestManager_class_1.RequestManager {
    constructor() {
        super({ suburl: 'chat' });
        this.addRequest('CREATE_GROUP', 'create/group', 'POST');
        this.addRequest('CREATE_PRIVATE', 'create/private', 'POST');
        this.addRequest('GET', '%uuid', 'GET');
        this.addRequest('GET_PREVIEW', '%uuid/preview', 'GET');
        this.addRequest('DELETE', '%uuid/delete', 'DELETE');
        this.addRequest('JOIN', '%uuid/join', 'POST');
        this.addRequest('LEAVE', '%uuid/leave', 'POST');
        this.addRequest('ADMIN_BAN', '%uuid/admin/ban', 'POST');
        this.addRequest('ADMIN_UNBAN', '%uuid/admin/unban', 'POST');
        this.addRequest('ADMIN_KICK', '%uuid/admin/kick', 'POST');
        this.addRequest('FETCH_MESSAGES', '%uuid/messages/get/%timestamp/%amount', 'GET');
        this.addRequest('CHECK_TAG', 'check/tag/%tag', 'GET');
        this.addRequest('LAST_READ', '%uuid/messages/read/%timestamp', 'GET');
        this.addRequest('GET_AVATAR', '%uuid/avatar', 'GET');
        this.addRequest('UPLOAD_AVATAR', '%uuid/avatar/upload', 'POST');
        this.addRequest('DELETE_AVATAR', '%uuid/avatar/delete', 'DELETE');
        this.addRequest('READ_MESSAGES', '%uuid/messages/read/%timestamp', 'GET');
    }
}
exports.ChatRequestManager = ChatRequestManager;
