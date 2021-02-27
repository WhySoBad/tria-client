import { EventEmitter } from 'events';
import TypedEventEmitter from 'typed-emitter';
import { config } from '../../config';
import { ClientEvent, ClientEvents, ClientUserConstructor, Credentials } from '../../types';
import { Member } from '../Member.class';
import { Message } from '../Message.class';
import { ChatSocket } from '../websocket';
import * as requests from '../../requests/Client.requests';
import { BaseSocket } from '../websocket/BaseSocket.class';
import { Logger } from '../Logger.class';
import { ClientUser } from '../ClientUser.class';
import { Client } from './Client.class';

/**
 * Base for the client class
 *
 * Used for big methods to keep the Client class small
 *
 * @see documentation reference
 *
 */

export abstract class BaseClient extends (EventEmitter as new () => TypedEventEmitter<ClientEvents>) {
  /**
   * Credentials of the user
   *
   * Can alternatively be provided instead of an existing token
   *
   * @default null
   */

  public readonly credentials: Credentials;

  protected _client: Client;

  private _user: ClientUser;

  private _token: string;

  private _connected: boolean = false;

  /**
   * Whether the token is validated or not
   *
   * @default false
   */

  private _validated: boolean = false;

  /**
   * Array with all connected sockets
   */

  private sockets: Array<BaseSocket> = [];

  constructor(auth: string | Credentials) {
    super();
    if (!auth) throw new Error('No Arguments Provided');
    if (typeof auth == 'string') this._token = auth;
    else this.credentials = auth;
  }

  /**
   * Connect the client to the server
   *
   * Connects all corresponding websockets
   *
   * @returns Promise<void>
   */

  public connect(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      if (!this._validated) {
        if (this.credentials) await this.login().catch(reject);
        else await this.validate().catch(reject);
      }
      if (!this._validated) reject('Invalid Token');
      const chat: ChatSocket = new ChatSocket({
        token: this._token,
        url: config.url,
      });
      this.sockets.push(chat);
      await chat.connect().then(() => {
        this.emit(ClientEvent.CONNECT);

        chat.on(ClientEvent.CONNECT, () => this.emit(ClientEvent.CONNECT));

        chat.on(ClientEvent.DISCONNECT, () => this.emit(ClientEvent.DISCONNECT));

        chat.on(ClientEvent.ERROR, (error: any) => this.emit(ClientEvent.ERROR, error));

        chat.on(ClientEvent.MESSAGE, (message: Message) => {
          this.emit(ClientEvent.MESSAGE, message);
        });

        chat.on(ClientEvent.CHAT_EDIT, (chat: string) => {
          this.emit(ClientEvent.CHAT_EDIT, chat);
        });

        chat.on(ClientEvent.MESSAGE_EDIT, (message: any) => {
          this.emit(ClientEvent.MESSAGE_EDIT, message);
        });

        chat.on(ClientEvent.MEMBER_EDIT, (chat: string, member: any) => {
          this.emit(ClientEvent.MEMBER_EDIT, chat, member);
        });

        chat.on(ClientEvent.CHAT_DELETE, (chat: string) => {
          this.emit(ClientEvent.CHAT_DELETE, chat);
        });

        chat.on(ClientEvent.MEMBER_JOIN, (chat: string, member: Member) => {
          this.emit(ClientEvent.MEMBER_JOIN, chat, member);
        });

        chat.on(ClientEvent.MEMBER_LEAVE, (chat: string, member: string) => {
          this.emit(ClientEvent.MEMBER_LEAVE, chat, member);
        });
      });

      this.fetchUser()
        .then((user: ClientUser) => {
          this._user = user;
          this.emit(ClientEvent.READY);
          resolve();
        })
        .catch(reject);
    });
  }

  /**
   * Disconnect the client from the server
   *
   * @returns Promise<void>
   */

  public disconnect(): Promise<void> {
    return new Promise(async (resolve) => {
      await Promise.all(this.sockets.map(async (socket: BaseSocket) => await socket.disconnect()));
      this.emit(ClientEvent.DISCONNECT);
      resolve();
    });
  }

  /**
   * Log the user in with the given credentials
   *
   * @returns Promise<string>
   */

  public login(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.credentials) reject('No Credentials Provided');
      requests
        .login(this.credentials)
        .then((token: string) => {
          this.setToken(token);
          this._validated = true;
          resolve(token);
        })
        .catch(reject);
    });
  }

  /**
   * Validate the user JWT
   *
   * @returns Promise<boolean>
   */

  protected validate(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (!this.token) {
        reject('No Token Provided');
      }
      requests
        .validate(this.token)
        .then((valid: boolean) => {
          this._validated = valid;
          resolve(valid);
        })
        .catch(reject);
    });
  }

  /**
   * Log the user out
   *
   * The current JWT gets banned until it expires
   *
   * @returns Promise<void>
   */

  public logout(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.token) reject('No Token Provided');
      if (!this.connected) reject('Client Not Connected');
      requests.logout(this.token).then(resolve).catch(reject);
    });
  }

  /**
   * Fetch the user on connection
   *
   * @returns Promise<void>
   */

  protected fetchUser(): Promise<ClientUser> {
    return new Promise((resolve, reject) => {
      requests
        .get(this.token)
        .then((data: ClientUserConstructor) => resolve(new ClientUser(this._client, data)))
        .catch(reject);
    });
  }

  /**
   * Integrated logger
   *
   * @param message message to log
   *
   * @returns void
   */

  public log(message: any): void {
    Logger.Log(message);
  }

  /**
   * User auth token
   */

  public get token(): string {
    return this._token;
  }

  /**
   * Set the user auth token
   *
   * @returns void
   */

  protected setToken(token: string): void {
    this._token = token;
  }

  /**
   * Boolean whether the client is connected or not
   *
   * @default false
   */

  public get connected(): boolean {
    return this._connected;
  }

  /**
   * Set the connection state
   *
   * @returns void
   */

  protected setConnected(state: boolean): void {
    this._connected = state;
  }

  public get client(): Client {
    return this._client;
  }

  public get user(): ClientUser {
    return this._user;
  }
}
