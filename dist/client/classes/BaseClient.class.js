"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseClient = void 0;
const tslib_1 = require("tslib");
const request_1 = require("../../request");
const SearchRequest_class_1 = require("../../request/classes/SearchRequest.class");
const util_1 = require("../../util");
const config_1 = require("../../util/config");
const websocket_1 = require("../../websocket");
const SocketHandler_class_1 = require("../../websocket/classes/SocketHandler.class");
const types_1 = require("../types");
const ClientUser_class_1 = require("./ClientUser.class");
const authManager = new request_1.AuthRequestManager();
const userManager = new request_1.UserRequestManager();
const chatManager = new request_1.ChatRequestManager();
const searchManager = new SearchRequest_class_1.SearchRequestManager();
class BaseClient extends SocketHandler_class_1.SocketHandler {
    constructor(auth, logging) {
        super(logging);
        this._connected = false;
        this._validated = false;
        if (logging) {
            userManager.enableLogging();
            chatManager.enableLogging();
            searchManager.enableLogging();
            util_1.enableLogging();
        }
        if (!auth)
            throw new Error('No Arguments Provided');
        if (typeof auth === 'string')
            this._token = auth;
        else
            this.credentials = auth;
        this.logging && util_1.Logger.Info('Client initialized');
        this.on(websocket_1.SocketEvent.ERROR, (error) => this.logging && util_1.Logger.Error(error));
    }
    connect() {
        return new Promise((resolve, reject) => {
            const handle = () => {
                if (!this._validated)
                    reject('Token Not Validated');
                this.connectSockets(this._token)
                    .catch(reject)
                    .then(() => {
                    this.fetchUser()
                        .then((user) => {
                        this._user = user;
                        this._connected = true;
                        this.emit(types_1.ClientEvent.READY);
                        resolve();
                    })
                        .catch(reject);
                });
            };
            if (!this._validated) {
                if (this.credentials)
                    this.login().then(handle).catch(reject);
                else
                    this.validate().then(handle).catch(reject);
            }
            else
                handle();
        });
    }
    disconnect() {
        return new Promise((resolve, reject) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.disconnectSockets()
                .then(() => {
                this.emit(types_1.ClientEvent.DISCONNECT);
                resolve();
            })
                .catch(reject);
        }));
    }
    login() {
        return new Promise((resolve, reject) => {
            if (!this.credentials)
                reject('No Credentials Provided');
            authManager
                .sendRequest('LOGIN', { body: this.credentials })
                .then((token) => {
                this.setToken(token);
                this._validated = true;
                resolve(token);
            })
                .catch(reject);
        });
    }
    validate() {
        return new Promise((resolve, reject) => {
            if (!this.token)
                reject('No Token Provided');
            authManager
                .sendRequest('VALIDATE', { authorization: this.token })
                .then((valid) => {
                this._validated = valid;
                resolve(valid);
            })
                .catch(reject);
        });
    }
    logout() {
        return new Promise((resolve, reject) => {
            if (!this.token)
                reject('No Token Provided');
            else if (!this.connected)
                reject('Client Not Connected');
            else
                this.disconnect().then(resolve).catch(reject);
        });
    }
    delete() {
        return new Promise((resolve, reject) => {
            if (!this.token)
                reject('No Token Provided');
            else if (!this.connected)
                reject('Client Not Connected');
            else {
                userManager
                    .sendRequest('DELETE', { authorization: this.token })
                    .then(resolve)
                    .catch(reject);
            }
        });
    }
    fetchUser() {
        return new Promise((resolve, reject) => {
            userManager
                .sendRequest('GET_CURRENT', { authorization: this.token })
                .then((data) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                const chats = [];
                for (const uuid of data.chats) {
                    const chat = yield chatManager
                        .sendRequest('GET', {
                        uuid: uuid,
                        authorization: this.client.token,
                    })
                        .catch(() => this.error(`Failed to load chat "${uuid}"`));
                    chats.push(chat);
                }
                resolve(new ClientUser_class_1.ClientUser(this._client, Object.assign(Object.assign({}, data), { chats: chats })));
            }))
                .catch(reject);
        });
    }
    createPrivateChat(user) {
        return new Promise((resolve, reject) => {
            chatManager
                .sendRequest('CREATE_PRIVATE', {
                body: { user: user },
                authorization: this.token,
            })
                .then(resolve)
                .catch(reject);
        });
    }
    createGroupChat({ name, tag, description, type, members = [], }) {
        return new Promise((resolve, reject) => {
            chatManager
                .sendRequest('CREATE_GROUP', {
                body: { name: name, tag: tag, description: description, members: members, type: type },
                authorization: this.token,
            })
                .then(resolve)
                .catch(reject);
        });
    }
    joinGroup(group) {
        return new Promise((resolve, reject) => {
            chatManager
                .sendRequest('JOIN', { uuid: group, authorization: this.token })
                .then(() => {
                const handler = (chat, member) => {
                    if (member.user.uuid === this.client.user.uuid) {
                        handleOff();
                        resolve();
                    }
                };
                const handleOff = () => this.client.off(websocket_1.ChatSocketEvent.MEMBER_JOIN, handler);
                this.client.on(websocket_1.ChatSocketEvent.MEMBER_JOIN, handler);
            })
                .catch(reject);
        });
    }
    leaveGroup(group) {
        return new Promise((resolve, reject) => {
            chatManager
                .sendRequest('LEAVE', { uuid: group, authorization: this.token })
                .then(resolve)
                .catch(reject);
        });
    }
    changePassword(oldPassword, newPassword) {
        return new Promise((resolve, reject) => {
            userManager
                .sendRequest('PASSWORD_CHANGE', {
                authorization: this.client.token,
                body: {
                    new: newPassword,
                    old: oldPassword,
                },
            })
                .then(resolve)
                .catch(reject);
        });
    }
    search(options) {
        return new Promise((resolve, reject) => {
            searchManager
                .sendRequest('SEARCH', { authorization: this.token, body: options })
                .then((value) => {
                resolve(value.map((_a) => {
                    var { uuid, color } = _a, rest = tslib_1.__rest(_a, ["uuid", "color"]);
                    const { avatar } = rest, rest2 = tslib_1.__rest(rest, ["avatar"]);
                    const isChat = Object.keys(rest).includes('type');
                    return Object.assign({ uuid: uuid, color: util_1.colorForUuid(uuid), avatarURL: avatar
                            ? `${config_1.config.apiUrl}/${isChat ? 'chat' : 'user'}/${uuid}/avatar`
                            : null }, rest2);
                }));
            })
                .catch(reject);
        });
    }
    log(...message) {
        util_1.Logger.Log(...message);
    }
    error(...error) {
        util_1.Logger.Error(...error);
    }
    get token() {
        return this._token;
    }
    setToken(token) {
        this._token = token;
    }
    get connected() {
        return this._connected;
    }
    setConnected(state) {
        this._connected = state;
    }
    get client() {
        return this._client;
    }
    get user() {
        return this._user;
    }
}
exports.BaseClient = BaseClient;
