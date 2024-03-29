"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
const uuid_1 = require("uuid");
const util_1 = require("../../util");
const websocket_1 = require("../../websocket");
class Message {
    constructor(client, props) {
        this.client = client;
        this.uuid = props.uuid;
        this.chat = props.chat;
        this.createdAt = new Date(props.createdAt);
        this.sender = props.sender;
        this._editedAt = props.editedAt ? new Date(props.editedAt) : null;
        this._edited = props.edited;
        this._text = props.text;
    }
    get editedAt() {
        return this._editedAt;
    }
    get edited() {
        return this._edited;
    }
    get text() {
        return this._text;
    }
    get editable() {
        return this.sender === this.client.user.uuid;
    }
    setText(text) {
        return new Promise((resolve, reject) => {
            if (!this.editable)
                reject('User Is Not Allowed To Edit');
            const actionUuid = uuid_1.v4();
            this.client.socket.chat.emit(websocket_1.ChatSocketEvent.MESSAGE_EDIT, {
                actionUuid: actionUuid,
                message: this.uuid,
                text: text,
            });
            util_1.handleAction(this.client, actionUuid).then(resolve).catch(reject);
        });
    }
}
exports.Message = Message;
