import { ChatConstructor, ChatPreview, GroupProps } from '../../chat';
import { AuthRequestManager, ChatRequestManager, UserRequestManager } from '../../request';
import { SearchRequestManager } from '../../request/classes/SearchRequest.class';
import { colorForUuid, enableLogging, Logger } from '../../util';
import { config } from '../../util/config';
import { SocketEvent } from '../../websocket';
import { SocketHandler } from '../../websocket/classes/SocketHandler.class';
import {
  BaseClientConstructor,
  ClientEvent,
  ClientUserConstructor,
  Credentials,
  SearchOptions,
  UserPreview,
} from '../types';
import { Client } from './Client.class';
import { ClientUser } from './ClientUser.class';

const authManager: AuthRequestManager = new AuthRequestManager();
const userManager: UserRequestManager = new UserRequestManager();
const chatManager: ChatRequestManager = new ChatRequestManager();
const searchManager: SearchRequestManager = new SearchRequestManager();

/**
 * Base for the client class
 *
 * Used for big methods to keep the Client class small
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

  private _user: ClientUser;

  private _token: string;

  private _connected: boolean = false;

  /**
   * Whether the token is validated or not
   *
   * @default false
   */

  private _validated: boolean = false;

  constructor({ auth, logging }: BaseClientConstructor) {
    super(logging);
    if (logging) {
      userManager.enableLogging();
      chatManager.enableLogging();
      searchManager.enableLogging();
      enableLogging();
    }
    if (!auth) throw new Error('No Arguments Provided');
    if (typeof auth === 'string') this._token = auth;
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
   * Delete the user
   *
   * @returns Promise<void>
   */

  public delete(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.token) reject('No Token Provided');
      else if (!this.connected) reject('Client Not Connected');
      else {
        userManager
          .sendRequest<'DELETE'>('DELETE', { authorization: this.token })
          .then(resolve)
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
        .then(async (data: ClientUserConstructor) => {
          const chats: Array<ChatConstructor> = [];
          for (const uuid of data.chats) {
            const chat: ChatConstructor = await chatManager
              .sendRequest<'GET'>('GET', {
                uuid: uuid as any,
                authorization: this.client.token,
              })
              .catch(() => this.error(`Failed to load chat "${uuid}"`));
            chats.push(chat);
          }
          resolve(new ClientUser(this._client, { ...data, chats: chats }));
        })
        .catch(reject);
    });
  }

  /**
   * Create a new private chat with another user
   *
   * @param user uuid of the user on the other side of the private chat
   *
   * @returns Promise<string>
   */

  public createPrivateChat(user: string): Promise<string> {
    return new Promise((resolve, reject) => {
      chatManager
        .sendRequest<'CREATE_PRIVATE'>('CREATE_PRIVATE', {
          body: { user: user },
          authorization: this.token,
        })
        .then(resolve)
        .catch(reject);
    });
  }

  /**
   * Create a new group
   *
   * @param props GroupProps to with information about the new group
   *
   * @returns Promise<string>
   */

  public createGroupChat({
    name,
    tag,
    description,
    type,
    members = [],
  }: GroupProps): Promise<string> {
    return new Promise((resolve, reject) => {
      chatManager
        .sendRequest<'CREATE_GROUP'>('CREATE_GROUP', {
          body: { name: name, tag: tag, description: description, members: members, type: type },
          authorization: this.token,
        })
        .then(resolve)
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
        .then(resolve)
        .catch(reject);
    });
  }

  /**
   * Change the password using the old password
   *
   * @param oldPassword old password
   *
   * @param newPassword new password
   *
   * @returns Promise<void>
   */

  public changePassword(oldPassword: string, newPassword: string): Promise<void> {
    return new Promise((resolve, reject) => {
      userManager
        .sendRequest<'PASSWORD_CHANGE'>('PASSWORD_CHANGE', {
          authorization: this.client.token,
          body: {
            new: newPassword,
            old: oldPassword,
          },
        })
        .then(resolve)
        .catch(reject);
    });
  }

  /**
   * Search for new chats or users
   *
   * @param options search options
   *
   * @returns Promise<Array<ChatPreview | UserPreview>>
   */

  public search(options: SearchOptions): Promise<Array<ChatPreview | UserPreview>> {
    return new Promise((resolve, reject) => {
      searchManager
        .sendRequest<'SEARCH'>('SEARCH', { authorization: this.token, body: options })
        .then((value: Array<ChatPreview | UserPreview>) => {
          resolve(
            value.map(({ uuid, color, ...rest }) => {
              const { avatar, ...rest2 }: any = rest;
              const isChat: boolean = Object.keys(rest).includes('type');
              return {
                uuid: uuid,
                color: colorForUuid(uuid),
                avatarURL: avatar
                  ? `${config.apiUrl}/${isChat ? 'chat' : 'user'}/${uuid}/avatar`
                  : null,
                ...rest2,
              };
            })
          );
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

  /**
   * Current User
   */

  public get user(): ClientUser {
    return this._user;
  }
}
