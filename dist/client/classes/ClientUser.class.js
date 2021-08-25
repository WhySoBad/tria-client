"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientUser = void 0;
const tslib_1 = require("tslib");
const chat_1 = require("../../chat");
const request_1 = require("../../request");
const util_1 = require("../../util");
const Collection_class_1 = require("../../util/Collection.class");
const config_1 = require("../../util/config");
const websocket_1 = require("../../websocket");
const userManager = new request_1.UserRequestManager();
const chatManager = new request_1.ChatRequestManager();
class ClientUser {
    constructor(client, props) {
        this._chats = new Map();
        this.client = client;
        this.uuid = props.uuid;
        this._name = props.name;
        this._tag = props.tag;
        this._description = props.description;
        this._mail = props.mail;
        this.createdAt = new Date(props.createdAt);
        this._lastSeen = new Date(props.lastSeen);
        this._online = props.online;
        this._locale = props.locale;
        this._avatar = props.avatar;
        this._color = util_1.colorForUuid(this.uuid);
        if (this.client.logging) {
            userManager.enableLogging();
            chatManager.enableLogging();
        }
        props.chats.forEach((chat) => {
            if (chat.type === chat_1.ChatType.GROUP || chat.type === chat_1.ChatType.PRIVATE_GROUP) {
                const group = new chat_1.Group(this.client, chat);
                this._chats.set(group.uuid, group);
            }
            else if (chat.type === chat_1.ChatType.PRIVATE) {
                const privateChat = new chat_1.PrivateChat(this.client, chat);
                this._chats.set(privateChat.uuid, privateChat);
            }
        });
        this.client.raw.on(websocket_1.ChatSocketEvent.MEMBER_LEAVE, (chat, member) => {
            if (member === this.uuid)
                this._chats.delete(chat);
        });
        this.client.raw.on(websocket_1.ChatSocketEvent.MEMBER_JOIN, (chat, member) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (member.user.uuid !== this.uuid || this.chats.get(chat))
                return;
            const constructor = yield chatManager
                .sendRequest('GET', {
                uuid: chat,
                authorization: this.client.token,
            })
                .catch(client.error);
            if (constructor) {
                if (constructor.type === chat_1.ChatType.GROUP || constructor.type === chat_1.ChatType.PRIVATE_GROUP) {
                    const group = new chat_1.Group(this.client, constructor);
                    this._chats.set(group.uuid, group);
                }
                else if (constructor.type === chat_1.ChatType.PRIVATE) {
                    const privateChat = new chat_1.PrivateChat(this.client, constructor);
                    this._chats.set(privateChat.uuid, privateChat);
                }
            }
        }));
        this.client.raw.on(websocket_1.ChatSocketEvent.MEMBER_BAN, (chat, member) => {
            if (member === this.uuid)
                this._chats.delete(chat);
        });
        this.client.raw.on(websocket_1.ChatSocketEvent.CHAT_DELETE, (chat) => this._chats.delete(chat));
        this.client.raw.on(websocket_1.ChatSocketEvent.PRIVATE_CREATE, (constructor) => {
            this._chats.set(constructor.uuid, new chat_1.PrivateChat(this.client, constructor));
        });
        this.client.raw.on(websocket_1.ChatSocketEvent.GROUP_CREATE, (constructor) => {
            this._chats.set(constructor.uuid, new chat_1.Group(this.client, constructor));
        });
    }
    get name() {
        return this._name;
    }
    get tag() {
        return this._tag;
    }
    get description() {
        return this._description;
    }
    get mail() {
        return this._mail;
    }
    get lastSeen() {
        return this._lastSeen;
    }
    get online() {
        return this._online;
    }
    get locale() {
        return this._locale;
    }
    get avatarURL() {
        return this._avatar ? `${config_1.config.apiUrl}/user/${this._avatar}/avatar` : null;
    }
    get chats() {
        return new Collection_class_1.Collection(this._chats);
    }
    get color() {
        return this._color;
    }
    setName(name) {
        return new Promise((resolve, reject) => {
            if (this._name === name)
                reject('New Name Is Equal To Old Name');
            userManager
                .sendRequest('EDIT', {
                authorization: this.client.token,
                body: { name: name },
            })
                .then(() => {
                this._name = name;
                resolve();
            })
                .catch(reject);
        });
    }
    setTag(tag) {
        return new Promise((resolve, reject) => {
            if (this._tag === tag)
                reject('New Tag Is Equal To Old Tag');
            userManager
                .sendRequest('EDIT', {
                authorization: this.client.token,
                body: { tag: tag },
            })
                .then(() => {
                this._tag = tag;
                resolve();
            })
                .catch(reject);
        });
    }
    setDescription(description) {
        return new Promise((resolve, reject) => {
            if (this._description === description)
                reject('New Description Is Equal To Old Description');
            userManager
                .sendRequest('EDIT', {
                authorization: this.client.token,
                body: { description: description },
            })
                .then(() => {
                this._description = description;
                resolve();
            })
                .catch(reject);
        });
    }
    setLocale(locale) {
        return new Promise((resolve, reject) => {
            if (this._locale === locale)
                reject('New Locale Is Equal To Old Locale');
            userManager
                .sendRequest('EDIT', {
                authorization: this.client.token,
                body: { locale: locale },
            })
                .then(() => {
                this._locale = locale;
                resolve();
            })
                .catch(reject);
        });
    }
    setSettings(settings) {
        return new Promise((resolve, reject) => {
            userManager
                .sendRequest('EDIT', { authorization: this.client.token, body: settings })
                .then(() => {
                this._name = settings.name || this._name;
                this._tag = settings.tag || this._tag;
                this._description = settings.description || this._description;
                this._locale = settings.locale || this._locale;
                resolve();
            })
                .catch(reject);
        });
    }
    setAvatar(avatar) {
        return new Promise((resolve, reject) => {
            userManager
                .sendRequest('UPLOAD_AVATAR', {
                authorization: this.client.token,
                body: { formData: avatar },
            })
                .then(() => {
                this._avatar = this.client.user.uuid;
                resolve();
            })
                .catch(reject);
        });
    }
    deleteAvatar() {
        return new Promise((resolve, reject) => {
            userManager
                .sendRequest('DELETE_AVATAR', {
                authorization: this.client.token,
            })
                .then(() => {
                this._avatar = null;
                resolve();
            })
                .catch(reject);
        });
    }
    setUserInfo(userInfo) {
        return new Promise((resolve, reject) => {
            Object.entries(userInfo).forEach(([key, value]) => {
                if (!value)
                    delete userInfo[key];
            });
            if (Object.keys(userInfo).length === 0)
                reject('No Informations Provided');
            userManager
                .sendRequest('EDIT', {
                authorization: this.client.token,
                body: userInfo,
            })
                .then(() => {
                this._locale = userInfo.locale || this._locale;
                this._description = userInfo.description || this._description;
                this._name = userInfo.name || this._name;
                this._tag = userInfo.tag || this._tag;
                this._avatar = userInfo.avatar || this._avatar;
                resolve();
            })
                .catch(reject);
        });
    }
}
exports.ClientUser = ClientUser;
