import { EventEmitter } from 'events';
import TypedEventEmitter from 'typed-emitter';
import { Client, ClientEvents } from '../../client';
import { Logger } from '../../util';
import { config } from '../../util/config';
import { ChatSocketEvent, SocketEvent } from '../types';
import { UserSocketEvent } from '../types/UserSocket.types';
import { ChatSocket } from './ChatSocket.class';
import { UserSocket } from './UserSocket.class';

export abstract class SocketHandler extends (EventEmitter as new () => TypedEventEmitter<ClientEvents>) {
  /**
   * ChatSocket instance
   */

  private _chatSocket: ChatSocket;

  /**
   * UserSocket instance
   */

  private _userSocket: UserSocket;

  /**
   * Get raw events
   *
   * This are the same events as the base EventEmitter but
   *
   * the raw events don't have any delay to give some time
   *
   * to treat the changes
   *
   * @important Thought for internal use only
   */

  public raw = new EventEmitter() as TypedEventEmitter<ClientEvents>;

  protected _client: Client;

  /**
   * Subclass to emit and receive events
   */

  public socket = {
    chat: {
      emit: (event: ChatSocketEvent, ...args: Array<any>) =>
        this._chatSocket.socket.emit(event, ...args),
      on: (event: ChatSocketEvent | SocketEvent, handler: (...args: Array<any>) => void) => {
        this._chatSocket.on(event, handler);
      },
    },
    user: {
      emit: (event: UserSocketEvent, ...args: Array<any>) =>
        this._userSocket.socket.emit(event, ...args),
      on: (event: UserSocketEvent | SocketEvent, handler: (...args: Array<any>) => void) => {
        this._userSocket.on(event, handler);
      },
    },
  };

  constructor(protected logging: boolean) {
    super();
    this.setMaxListeners(config.maxListenerCount);
    this.raw.setMaxListeners(config.maxListenerCount);
  }

  /**
   * Connects all WebSockets to the server
   *
   * Resolves when all sockets are successfully connected
   *
   * @param token User auth token
   *
   * @returns Promise<void>
   */

  protected connectSockets(token: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      this._chatSocket = new ChatSocket({ client: this._client, token: token, url: config.apiUrl });
      await this._chatSocket.connect().then(() => {
        this._chatSocket.on('*', async (...args: Array<any>) => {
          const [event, ...rest] = args;
          if (event.toLowerCase() === 'connect') {
            this.logging && Logger.Event(ChatSocketEvent.CONNECT);
            this.raw.emit(ChatSocketEvent.CONNECT);
          } else if (event.toLowerCase() === 'disconnect') {
            this.logging && Logger.Event(ChatSocketEvent.DISCONNECT);
            this.raw.emit(ChatSocketEvent.DISCONNECT);
          } else {
            this.logging && Logger.Event(event);
            this.raw.emit(event, ...rest);
          }

          setTimeout(() => this.emit(event, ...rest), config.eventDelay);
        });
      });
      this.logging && Logger.Event(ChatSocketEvent.CONNECT);
      this._chatSocket.once('error', reject);

      this._userSocket = new UserSocket({
        client: this._client,
        token: token,
        url: config.apiUrl + '/user',
      });
      await this._userSocket.connect().then(() => {
        this._userSocket.on('*', async (...args: Array<any>) => {
          const [event, ...rest] = args;
          if (event.toLowerCase() === 'connect') {
            this.logging && Logger.Event(UserSocketEvent.CONNECT);
            this.raw.emit(ChatSocketEvent.CONNECT);
          } else if (event.toLowerCase() === 'disconnect') {
            this.logging && Logger.Event(UserSocketEvent.DISCONNECT);
            this.raw.emit(ChatSocketEvent.DISCONNECT);
          } else {
            this.logging && Logger.Event(event);
            this.raw.emit(event, ...rest);
          }
          setTimeout(() => this.emit(event, ...rest), config.eventDelay);
        });
      });
      this.logging && Logger.Event(UserSocketEvent.CONNECT);
      this._userSocket.once('error', reject);

      this.emit(SocketEvent.CONNECT);
      this.logging && Logger.Event(SocketEvent.CONNECT);
      resolve();
    });
  }

  /**
   * Disconnects all WebSockets from the server
   *
   * Resolves when all sockets are successfully disconnected
   *
   * @returns Promise<void>
   */

  protected disconnectSockets(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      await this._chatSocket.disconnect().catch(reject);
      await this._userSocket.disconnect().catch(reject);
      resolve();
    });
  }
}
