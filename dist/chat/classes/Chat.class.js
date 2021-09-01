"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chat = void 0;
const tslib_1 = require("tslib");
const uuid_1 = require("uuid");
const request_1 = require("../../request");
const util_1 = require("../../util");
const Collection_class_1 = require("../../util/Collection.class");
const websocket_1 = require("../../websocket");
const classes_1 = require("../classes");
const MemberLog_class_1 = require("./MemberLog.class");
const chatManager = new request_1.ChatRequestManager();
class Chat {
    constructor(client, { uuid, members, messages, type, memberLog, createdAt, lastRead }) {
        this._members = new Map();
        this._messages = new Map();
        this._memberLog = new Map();
        this._lastFetched = false;
        this.client = client;
        this.uuid = uuid;
        this._type = type;
        this.createdAt = new Date(createdAt);
        this.color = util_1.colorForUuid(uuid);
        this._lastRead = new Date(lastRead);
        if (this.client.logging)
            chatManager.enableLogging();
        members.forEach((member) => {
            this._members.set(member.user.uuid, new classes_1.Member(Object.assign(Object.assign({}, member), { user: Object.assign(Object.assign({}, member.user), { client: this.client }) })));
        });
        messages.forEach((message) => {
            this._messages.set(message.uuid, new classes_1.Message(this.client, message));
        });
        memberLog.forEach((memberLog) => {
            this._memberLog.set(memberLog.user, new MemberLog_class_1.MemberLog(Object.assign(Object.assign({}, memberLog), { timestamp: new Date(memberLog.timestamp) })));
        });
        if (this.messages.size === 0)
            this._lastFetched = true;
        this.client.raw.on(websocket_1.ChatSocketEvent.MEMBER_LEAVE, (chat, member) => {
            if (chat !== this.uuid)
                return;
            this._members.delete(member);
            this._memberLog.set(member, new MemberLog_class_1.MemberLog({ user: member, chat: this.uuid, timestamp: new Date(), joined: false }));
        });
        this.client.raw.on(websocket_1.ChatSocketEvent.MEMBER_JOIN, (chat, member) => {
            if (chat !== this.uuid)
                return;
            this._members.set(member.user.uuid, member);
            this._memberLog.set(member.user.uuid, new MemberLog_class_1.MemberLog({
                user: member.user.uuid,
                chat: this.uuid,
                timestamp: new Date(),
                joined: true,
            }));
        });
        this.client.raw.on(websocket_1.ChatSocketEvent.MESSAGE, (chat, message) => {
            if (chat === this.uuid)
                this._messages.set(message.uuid, message);
        });
        this.client.raw.on(websocket_1.ChatSocketEvent.MESSAGE_EDIT, (chat, editedMessage) => {
            if (chat !== this.uuid)
                return;
            const { uuid, edited, editedAt, pinned, text } = editedMessage;
            const message = this._messages.get(uuid);
            if (!message)
                return client.error('Failed To Edit Message');
            this._messages.set(uuid, new classes_1.Message(message.client, Object.assign(Object.assign({}, message), { edited: edited, editedAt: editedAt, pinned: pinned, text: text })));
        });
    }
    get type() {
        return this._type;
    }
    get lastRead() {
        return this._lastRead;
    }
    get members() {
        return new Collection_class_1.Collection(this._members);
    }
    get writeable() {
        return !!this._members.get(this.client.user.uuid);
    }
    get messages() {
        return new Collection_class_1.Collection(this._messages);
    }
    get lastFetched() {
        return this._lastFetched;
    }
    get memberLog() {
        return new Collection_class_1.Collection(this._memberLog);
    }
    delete() {
        return new Promise((resolve, reject) => {
            if (!this.writeable)
                reject('User Has To Be Member');
            chatManager
                .sendRequest('DELETE', {
                uuid: this.uuid,
                authorization: this.client.token,
            })
                .then(resolve)
                .catch(reject);
        });
    }
    sendMessage(message) {
        return new Promise((resolve, reject) => {
            if (!this.writeable)
                reject('User Has To Be Member');
            const actionUuid = uuid_1.v4();
            this.client.socket.chat.emit(websocket_1.ChatSocketEvent.MESSAGE, {
                actionUuid: actionUuid,
                chat: this.uuid,
                data: message,
            });
            util_1.handleAction(this.client, actionUuid)
                .then(() => {
                this._lastRead = new Date();
                resolve();
            })
                .catch(reject);
        });
    }
    fetchMessages(timestamp, amount = 25) {
        return new Promise((resolve, reject) => {
            if (!this.writeable)
                reject('User Has To Be Member');
            if (this._lastFetched)
                reject('Last Message Already Fetched');
            chatManager
                .sendRequest('FETCH_MESSAGES', {
                uuid: this.uuid,
                amount: amount === null || amount === void 0 ? void 0 : amount.toString(),
                timestamp: timestamp,
                authorization: this.client.token,
            })
                .then((fetched) => {
                const { messages, log, last } = fetched;
                if (last)
                    this._lastFetched = true;
                messages.forEach((constructor) => {
                    const message = new classes_1.Message(this.client, constructor);
                    this._messages.set(message.uuid, message);
                });
                log.forEach((constructor) => {
                    const log = new MemberLog_class_1.MemberLog(Object.assign(Object.assign({}, constructor), { timestamp: new Date(constructor.timestamp) }));
                    this._memberLog.set(log.user, log);
                });
                resolve();
            })
                .catch(reject);
        });
    }
    readUntil(timestamp) {
        return new Promise((resolve, reject) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!this.members.get(this.client.user.uuid))
                reject('Invalid User');
            else {
                chatManager
                    .sendRequest('READ_MESSAGES', {
                    uuid: this.uuid,
                    timestamp: timestamp instanceof Date ? timestamp.getTime() : timestamp,
                    authorization: this.client.token,
                })
                    .catch(reject);
                const handleReadMessage = (chat, timestamp) => {
                    if (chat === this.uuid) {
                        this._lastRead = new Date(timestamp);
                        this.client.raw.off(websocket_1.UserSocketEvent.MESSAGE_READ, handleReadMessage);
                        resolve();
                    }
                };
                this.client.raw.on(websocket_1.UserSocketEvent.MESSAGE_READ, handleReadMessage);
            }
        }));
    }
}
exports.Chat = Chat;
