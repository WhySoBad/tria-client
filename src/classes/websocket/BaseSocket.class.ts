import { EventEmitter } from 'events';
import { SocketEvent, BaseSocketConstructor } from '../../types';
import { connect } from 'socket.io-client';

export abstract class BaseSocket extends EventEmitter {
  private token: string;

  private url: string;

  private _connected: boolean = false;

  protected socket: SocketIOClient.Socket;

  constructor(props: BaseSocketConstructor) {
    super();
    this.token = props.token;
    this.url = props.url;
  }

  /**
   * Connects the WebSocket to the server
   * @returns Promise<void>
   */

  public connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this._connected) reject('Already Connected');
      this.socket = connect(this.url, {
        transportOptions: { polling: { extraHeaders: { Authorization: `Bearer ${this.token}` } } },
      });

      this.socket.once('connect', () => {
        this._connected = true;
        this.emit('connect');
        resolve();
      });
    });
  }

  /**
   * Disconnects the WebSocket from the server
   * @returns Promise<void>
   */

  public disconnect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this._connected) reject("Socket Isn't Connected");
      this.socket.disconnect();
      this.socket.once(SocketEvent.DISCONNECT, () => {
        this._connected = false;
        this.socket.removeAllListeners();
        resolve();
      });
    });
  }

  /**
   * Boolean whether the socket is connected or not
   * @default false
   */

  public get connected(): boolean {
    return this._connected;
  }
}
