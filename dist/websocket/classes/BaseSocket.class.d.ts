/// <reference types="socket.io-client" />
/// <reference types="node" />
import { EventEmitter } from 'events';
import { BaseSocketConstructor } from '../types';
export declare abstract class BaseSocket extends EventEmitter {
    private token;
    private url;
    private _connected;
    private _events;
    socket: SocketIOClient.Socket;
    constructor(props: BaseSocketConstructor);
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    get connected(): boolean;
    protected addEvent(event: string, handler?: (...args: Array<any>) => any): void;
    private removeEvent;
}
