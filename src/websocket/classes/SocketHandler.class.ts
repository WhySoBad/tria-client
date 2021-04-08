import { EventEmitter } from 'events';
import TypedEventEmitter from 'typed-emitter';
import { ClientEvents } from '../../client';
import { Logger } from '../../util';
import { config } from '../../util/config';
import { ChatSocketEvent, SocketEvent } from '../types';
import { ChatSocket } from './ChatSocket.class';

export abstract class SocketHandler extends (EventEmitter as new () => TypedEventEmitter<ClientEvents>) {
  /**
   * ChatSocket instance
   */

  private _chat: ChatSocket;

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

  /**
   * Subclass to emit and receive events for the ChatSocket
   */

  public chat = {
    emit: (event: ChatSocketEvent, ...args: Array<any>) => this._chat.socket.emit(event, ...args),
    on: (event: ChatSocketEvent | SocketEvent, handler: (...args: Array<any>) => void) => {
      this._chat.on(event, handler);
    },
  };

  constructor(protected logging: boolean) {
    super();
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
      this._chat = new ChatSocket({ token: token, url: config.apiUrl });
      await this._chat.connect().then(() => {
        this._chat.on('*', async (...args: Array<any>) => {
          const [event, ...rest] = args;
          this.logging && Logger.Event(event);
          this.raw.emit(event, ...rest);
          setTimeout(() => this.emit(event, ...rest), config.eventDelay);
        });
        this.emit(SocketEvent.CONNECT);
        this.logging && Logger.Event(SocketEvent.CONNECT);
      });
      this._chat.once('error', reject);
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
      await this._chat.disconnect().catch(reject);
      resolve();
    });
  }
}
