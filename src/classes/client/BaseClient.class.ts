import {
  ClientEvent,
  ClientUserConstructor,
  Credentials,
  GroupProps,
  SocketEvent,
} from '../../types';
import { BaseSocket } from '../websocket/BaseSocket.class';
import { Logger } from '../Logger.class';
import { ClientUser } from '../ClientUser.class';
import { Client } from './Client.class';
import { SocketHandler } from '../websocket/SocketHandler.class';
import { AuthRequestManager } from '../request/AuthRequest.class';
import { UserRequestManager } from '../request/UserRequest.class';
import { ChatRequestManager } from '../request/ChatRequest.class';

const authManager: AuthRequestManager = new AuthRequestManager();
const userManager: UserRequestManager = new UserRequestManager();
const chatManager: ChatRequestManager = new ChatRequestManager();

/**
 * Base for the client class
 *
 * Used for big methods to keep the Client class small
 *
 * @see documentation reference
 *
 */

export abstract class BaseClient extends SocketHandler {
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

  constructor(auth: string | Credentials, logging: boolean) {
    super(logging);
    if (!auth) throw new Error('No Arguments Provided');
    if (typeof auth == 'string') this._token = auth;
    else this.credentials = auth;
    this.logging && Logger.Info('Client initialized');
    this.on(SocketEvent.ERROR, (error: any) => this.logging && Logger.Error(error));
  }

  /**
   * Connect the client to the server
   *
   * Connects all corresponding websockets
   *
   * @returns Promise<void>
   */

  public connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      const handle: () => void = () => {
        if (!this._validated) reject('Token Not Validated');
        this.connectSockets(this._token)
          .catch(reject)
          .then(() => {
            this.fetchUser()
              .then((user: ClientUser) => {
                this._user = user;
                this._connected = true;
                this.emit(ClientEvent.READY);
                resolve();
              })
              .catch(reject);
          });
      };
      if (!this._validated) {
        if (this.credentials) this.login().then(handle).catch(reject);
        else this.validate().then(handle).catch(reject);
      } else handle();
    });
  }

  /**
   * Disconnect the client from the server
   *
   * @returns Promise<void>
   */

  public disconnect(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      this.disconnectSockets()
        .then(() => {
          this.emit(ClientEvent.DISCONNECT);
          resolve();
        })
        .catch(reject);
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
      authManager
        .sendRequest('LOGIN', { body: this.credentials })
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
      if (!this.token) reject('No Token Provided');
      authManager
        .sendRequest<'VALIDATE'>('VALIDATE', { authorization: this.token })
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
      else if (!this.connected) reject('Client Not Connected');
      else {
        authManager
          .sendRequest<'LOGOUT'>('LOGOUT', { authorization: this.token })
          .then(() => {
            this.disconnect().then(resolve).catch(reject);
          })
          .catch(reject);
      }
    });
  }

  /**
   * Fetch the user on connection
   *
   * @returns Promise<void>
   */

  protected fetchUser(): Promise<ClientUser> {
    return new Promise((resolve, reject) => {
      userManager
        .sendRequest<'GET_CURRENT'>('GET_CURRENT', { authorization: this.token })
        .then((data: ClientUserConstructor) => resolve(new ClientUser(this._client, data)))
        .catch(reject);
    });
  }

  /**
   * Create a new private chat with another user
   *
   * @param user uuid of the user on the other side of the private chat
   *
   * @returns Promise<void>
   */

  public createPrivateChat(user: string): Promise<void> {
    return new Promise((resolve, reject) => {
      chatManager
        .sendRequest<'CREATE_PRIVATE'>('CREATE_PRIVATE', {
          body: { user: user },
          authorization: this.token,
        })
        .then(() => {})
        .catch(reject);
    });
  }

  /**
   * Create a new group
   *
   * @param props GroupProps to with information about the new group
   *
   * @returns Promise<void>
   */

  public createGroupChat({ name, tag, description, members = [] }: GroupProps): Promise<void> {
    return new Promise((resolve, reject) => {
      chatManager
        .sendRequest<'CREATE_GROUP'>('CREATE_GROUP', {
          body: { name: name, tag: tag, description: description, members: members },
          authorization: this.token,
        })
        .then(() => resolve()) //TODO: Add group to chats
        .catch(reject);
    });
  }

  /**
   * Join a group by the group uuid
   *
   * @param group uuid of the group
   *
   * @returns Promise<void>
   */

  public joinGroup(group: string): Promise<void> {
    return new Promise((resolve, reject) => {
      chatManager
        .sendRequest<'JOIN'>('JOIN', { uuid: group, authorization: this.token })
        .then(resolve)
        .catch(reject);
    });
  }

  /**
   * Leave a group by the group uuid
   *
   * @param group uuid of the group
   *
   * @returns Promise<void>
   */

  public leaveGroup(group: string): Promise<void> {
    return new Promise((resolve, reject) => {
      chatManager
        .sendRequest<'LEAVE'>('LEAVE', { uuid: group, authorization: this.token })
        .then(() => {
          resolve();
        })
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

  public log(...message: Array<any>): void {
    Logger.Log(...message);
  }

  /**
   * Integrated error Logger
   *
   * @param error error message to log
   *
   * @returns void
   */

  public error(...error: Array<any>): void {
    Logger.Error(...error);
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

  /**
   * Current Client
   */

  public get client(): Client {
    return this._client;
  }

  public get user(): ClientUser {
    return this._user;
  }
}
