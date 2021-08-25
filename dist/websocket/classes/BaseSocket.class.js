"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseSocket = void 0;
const events_1 = require("events");
const socket_io_client_1 = require("socket.io-client");
const config_1 = require("../../util/config");
const types_1 = require("../types");
class BaseSocket extends events_1.EventEmitter {
    constructor(props) {
        super();
        this._connected = false;
        this._events = new Map();
        this.token = props.token;
        this.url = props.url;
        this.setMaxListeners(config_1.config.maxListenerCount);
    }
    connect() {
        return new Promise((resolve, reject) => {
            if (this._connected)
                reject('Already Connected');
            this.socket = socket_io_client_1.connect(this.url, {
                transportOptions: { polling: { extraHeaders: { Authorization: `Bearer ${this.token}` } } },
                transports: ['polling', 'websocket'],
            });
            this.socket.once('connect', () => {
                this._connected = true;
                this.socket.on('connect', () => {
                    this.emit(types_1.SocketEvent.CONNECT);
                    this.emit('*', types_1.SocketEvent.CONNECT);
                });
                this.socket.on('disconnect', () => {
                    this.emit(types_1.SocketEvent.DISCONNECT);
                    this.emit('*', types_1.SocketEvent.DISCONNECT);
                });
                this.socket.on('error', (error) => {
                    this.emit(types_1.SocketEvent.ERROR, error);
                    this.emit('*', types_1.SocketEvent.ERROR, error);
                });
                this.socket.on(types_1.SocketEvent.ACTION_SUCCESS, (uuid) => {
                    this.emit(types_1.SocketEvent.ACTION_SUCCESS, uuid);
                    this.emit('*', types_1.SocketEvent.ACTION_SUCCESS, uuid);
                });
                this.socket.on(types_1.SocketEvent.ACTION_ERROR, (action) => {
                    this.emit(types_1.SocketEvent.ACTION_ERROR, action);
                    this.emit('*', types_1.SocketEvent.ACTION_ERROR, action);
                });
                this.emit(types_1.SocketEvent.CONNECT);
                this.emit('*', types_1.SocketEvent.CONNECT);
                this._events.forEach((handler, key) => {
                    this.socket.on(key, (...args) => {
                        if (handler) {
                            const value = handler(...args);
                            if (Array.isArray(value)) {
                                this.emit(key, ...value);
                                this.emit('*', key, ...value);
                            }
                            else {
                                this.emit(key, value);
                                this.emit('*', key, value);
                            }
                        }
                        else {
                            this.emit(key, ...args);
                            this.emit('*', key, ...args);
                        }
                    });
                });
                resolve();
            });
        });
    }
    disconnect() {
        return new Promise((resolve, reject) => {
            if (!this._connected)
                reject("Socket Isn't Connected");
            this.socket.disconnect();
            this.socket.once(types_1.SocketEvent.DISCONNECT, () => {
                this._connected = false;
                this.socket.removeAllListeners();
                resolve();
            });
        });
    }
    get connected() {
        return this._connected;
    }
    addEvent(event, handler) {
        if (typeof event !== 'string')
            throw new Error('Event has to be of type string');
        !this._events.get(event) && this._events.set(event, handler);
    }
    removeEvent(event) {
        if (this._events.get(event)) {
            this._events.delete(event);
            this.socket && this.socket.removeEventListener(event);
        }
    }
}
exports.BaseSocket = BaseSocket;
