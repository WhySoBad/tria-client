"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketHandler = void 0;
const tslib_1 = require("tslib");
const events_1 = require("events");
const util_1 = require("../../util");
const config_1 = require("../../util/config");
const types_1 = require("../types");
const UserSocket_types_1 = require("../types/UserSocket.types");
const ChatSocket_class_1 = require("./ChatSocket.class");
const UserSocket_class_1 = require("./UserSocket.class");
class SocketHandler extends events_1.EventEmitter {
    constructor(logging) {
        super();
        this.raw = new events_1.EventEmitter();
        this.socket = {
            chat: {
                emit: (event, ...args) => this._chatSocket.socket.emit(event, ...args),
                on: (event, handler) => {
                    this._chatSocket.on(event, handler);
                },
            },
            user: {
                emit: (event, ...args) => this._userSocket.socket.emit(event, ...args),
                on: (event, handler) => {
                    this._userSocket.on(event, handler);
                },
            },
        };
        this.logging = logging;
        this.setMaxListeners(config_1.config.maxListenerCount);
        this.raw.setMaxListeners(config_1.config.maxListenerCount);
    }
    connectSockets(token) {
        return new Promise((resolve, reject) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            this._chatSocket = new ChatSocket_class_1.ChatSocket({ client: this._client, token: token, url: config_1.config.apiUrl });
            yield this._chatSocket.connect().then(() => {
                this._chatSocket.on('*', (...args) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                    const [event, ...rest] = args;
                    if (event.toLowerCase() === 'connect') {
                        this.logging && util_1.Logger.Event(types_1.ChatSocketEvent.CONNECT);
                        this.raw.emit(types_1.ChatSocketEvent.CONNECT);
                    }
                    else if (event.toLowerCase() === 'disconnect') {
                        this.logging && util_1.Logger.Event(types_1.ChatSocketEvent.DISCONNECT);
                        this.raw.emit(types_1.ChatSocketEvent.DISCONNECT);
                    }
                    else {
                        this.logging && util_1.Logger.Event(event);
                        this.raw.emit(event, ...rest);
                    }
                    setTimeout(() => this.emit(event, ...rest), config_1.config.eventDelay);
                }));
            });
            this.logging && util_1.Logger.Event(types_1.ChatSocketEvent.CONNECT);
            this._chatSocket.once('error', reject);
            this._userSocket = new UserSocket_class_1.UserSocket({
                client: this._client,
                token: token,
                url: config_1.config.apiUrl + '/user',
            });
            yield this._userSocket.connect().then(() => {
                this._userSocket.on('*', (...args) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                    const [event, ...rest] = args;
                    if (event.toLowerCase() === 'connect') {
                        this.logging && util_1.Logger.Event(UserSocket_types_1.UserSocketEvent.CONNECT);
                        this.raw.emit(types_1.ChatSocketEvent.CONNECT);
                    }
                    else if (event.toLowerCase() === 'disconnect') {
                        this.logging && util_1.Logger.Event(UserSocket_types_1.UserSocketEvent.DISCONNECT);
                        this.raw.emit(types_1.ChatSocketEvent.DISCONNECT);
                    }
                    else {
                        this.logging && util_1.Logger.Event(event);
                        this.raw.emit(event, ...rest);
                    }
                    setTimeout(() => this.emit(event, ...rest), config_1.config.eventDelay);
                }));
            });
            this.logging && util_1.Logger.Event(UserSocket_types_1.UserSocketEvent.CONNECT);
            this._userSocket.once('error', reject);
            this.emit(types_1.SocketEvent.CONNECT);
            this.logging && util_1.Logger.Event(types_1.SocketEvent.CONNECT);
            resolve();
        }));
    }
    disconnectSockets() {
        return new Promise((resolve, reject) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this._chatSocket.disconnect().catch(reject);
            yield this._userSocket.disconnect().catch(reject);
            resolve();
        }));
    }
}
exports.SocketHandler = SocketHandler;
