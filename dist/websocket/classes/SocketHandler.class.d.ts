/// <reference types="socket.io-client" />
import TypedEventEmitter from 'typed-emitter';
import { Client, ClientEvents } from '../../client';
import { ChatSocketEvent, SocketEvent } from '../types';
import { UserSocketEvent } from '../types/UserSocket.types';
declare const SocketHandler_base: new () => TypedEventEmitter<ClientEvents>;
export declare abstract class SocketHandler extends SocketHandler_base {
    private _chatSocket;
    private _userSocket;
    raw: TypedEventEmitter<ClientEvents>;
    protected _client: Client;
    readonly logging: boolean;
    socket: {
        chat: {
            emit: (event: ChatSocketEvent, ...args: Array<any>) => SocketIOClient.Socket;
            on: (event: ChatSocketEvent | SocketEvent, handler: (...args: Array<any>) => void) => void;
        };
        user: {
            emit: (event: UserSocketEvent, ...args: Array<any>) => SocketIOClient.Socket;
            on: (event: UserSocketEvent | SocketEvent, handler: (...args: Array<any>) => void) => void;
        };
    };
    constructor(logging: boolean);
    protected connectSockets(token: string): Promise<void>;
    protected disconnectSockets(): Promise<void>;
}
export {};
