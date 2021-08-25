"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const util_1 = require("../../util");
const config_1 = require("../../util/config");
const websocket_1 = require("../../websocket");
const UserSocket_types_1 = require("../../websocket/types/UserSocket.types");
class User {
    constructor(props) {
        this.uuid = props.uuid;
        this._name = props.name;
        this._tag = props.tag;
        this.client = props.client;
        this.createdAt = new Date(props.createdAt);
        this._lastSeen = new Date(props.lastSeen);
        this._description = props.description;
        this._locale = props.locale;
        this._online = props.online;
        this._avatar = props.avatar ? `${config_1.config.apiUrl}/user/${props.uuid}/avatar` : null;
        this._color = util_1.colorForUuid(this.uuid);
        this.client.raw.on(UserSocket_types_1.UserSocketEvent.USER_EDIT, (uuid, { name, tag, description, avatar, locale }) => {
            if (uuid !== this.uuid)
                return;
            this._name = name;
            this._tag = tag;
            this._description = description;
            this._avatar = avatar ? `${config_1.config.apiUrl}/user/${props.uuid}/avatar` : null;
            this._locale = locale;
        });
        this.client.raw.on(websocket_1.ChatSocketEvent.MEMBER_ONLINE, (uuid) => {
            if (this.uuid !== uuid)
                return;
            this._online = true;
        });
        this.client.raw.on(websocket_1.ChatSocketEvent.MEMBER_OFFLINE, (uuid) => {
            if (this.uuid !== uuid)
                return;
            this._online = false;
            this._lastSeen = new Date();
        });
    }
    get name() {
        return this._name;
    }
    get tag() {
        return this._tag;
    }
    get avatarURL() {
        return this._avatar;
    }
    get lastSeen() {
        return this._lastSeen;
    }
    get description() {
        return this._description;
    }
    get locale() {
        return this._locale;
    }
    get online() {
        return this._online;
    }
    get color() {
        return this._color;
    }
}
exports.User = User;
