import { EventEmitter } from 'events';
import { SocketEvent, BaseSocketConstructor } from '../../types';
import { connect } from 'socket.io-client';

export abstract class BaseSocket extends EventEmitter {
  private token: string;

  private url: string;

  private _connected: boolean = false;

  private _events: Map<string, ((args?: Array<any>) => any) | undefined> = new Map();

  /**
   * WebSocket instance
   */

  public socket: SocketIOClient.Socket;

  constructor(props: BaseSocketConstructor) {
    super();
    this.token = props.token;
    this.url = props.url;
  }

  /**
   * Connects the WebSocket to the server
   *
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
        this.socket.on('connect', () => {
          this.emit(SocketEvent.CONNECT);
          this.emit('*', SocketEvent.CONNECT);
        });
        this.socket.on('disconnect', () => {
          this.emit(SocketEvent.DISCONNECT);
          this.emit('*', SocketEvent.DISCONNECT);
        });
        this.socket.on('error', (error: any) => {
          this.emit(SocketEvent.ERROR, error);
          this.emit('*', SocketEvent.ERROR, error);
        });

        this.emit(SocketEvent.CONNECT);
        this.emit('*', SocketEvent.CONNECT);
        this._events.forEach((handler: ((args?: Array<any>) => any) | undefined, key: string) => {
          this.socket.on(key, (...args: Array<any>) => {
            if (handler) {
              const value: any = handler(...args);
              this.emit(key, value);
              this.emit('*', key, value);
            } else {
              this.emit(key, ...args);
              this.emit('*', key, ...args);
            }
          });
        });
        resolve();
      });
    });
  }

  /**
   * Disconnects the WebSocket from the server
   *
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
   *
   * @default false
   */

  public get connected(): boolean {
    return this._connected;
  }

  /**
   * Adds an EventListener to the WebSocket
   *
   * @param event name of the event
   *
   * @param handler handler for the event
   *
   * @returns void
   */

  protected addEvent(event: string, handler?: (...args: Array<any>) => any): void {
    if (typeof event != 'string') throw new Error('Event has to be of type string');
    !this._events.get(event) && this._events.set(event, handler);
  }

  /**
   * Removes an EventListener from the WebSocket
   *
   * @param event name of the event
   *
   * @returns void
   */

  private removeEvent(event: string): void {
    if (this._events.get(event)) {
      this._events.delete(event);
      this.socket && this.socket.removeEventListener(event);
    }
  }
}
