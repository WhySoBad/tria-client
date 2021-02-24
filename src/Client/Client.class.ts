import { ClientConstructor, ClientEvents, ConnectionProps, Credentials } from './Client.types';
import { EventEmitter } from 'events';
import TypedEventEmitter from 'typed-emitter';
import { config } from '../config';
import * as requests from './Client.requests';
import io from 'socket.io-client';
import { Logger } from '../Logger.class';
import { ClientUser } from '../ClientUser/ClientUser.class';
import { ClientUserProps } from '../ClientUser';

/**
 * Instance of the logged in user
 * @constructor void
 */

export class Client extends (EventEmitter as new () => TypedEventEmitter<ClientEvents>) {
  private socket: SocketIOClient.Socket;
  private ready: boolean = false;
  private credentials: Credentials;
  private logger: boolean;

  /**
   * Whether the client is connected or not
   * @default false
   */

  public connected: boolean = false;

  /**
   * Current user token
   */

  public token: string;

  public user: ClientUser;

  /**
   * Initialize new user client
   * @param constructor ClientConstructor
   */

  constructor(constructor?: ClientConstructor) {
    super();
    this.logger = !!constructor?.log;
    this.logger && Logger.Info('Client initialized');
  }

  /**
   * Start the client connection
   *
   * Validates the given token or forces a login with the given credentials
   *
   * @param props ConnectionProps
   * @returns Promise<void>
   * @see
   */

  public async connect(props: ConnectionProps): Promise<void> {
    return new Promise(async (resolve, reject) => {
      if (typeof props == 'string') {
        this.token = props;
        await this.validate()
          .then(() => {
            this.ready = true;
            this.logger && Logger.Event('Token validated');
            this.emit('validate');
          })
          .catch((error: string) => reject(error));
      } else if (typeof props == 'object') {
        this.credentials = props;
        await this.login()
          .then((token: string) => {
            this.token = token;
            this.ready = true;
            this.logger && Logger.Event('Client logged in');
            this.emit('login');
          })
          .catch(reject);
      }

      if (!this.ready) reject('Client Has To Be Logged In');
      this.socket = io(config.url, {
        transportOptions: { polling: { extraHeaders: { Authorization: `Bearer ${this.token}` } } },
      });
      this.socket.on('connect', () => {
        this.handleSocketEvents();
        this.logger && Logger.Event('Socket connected');
        this.emit('connect');
        this.initializeUser().then(resolve).catch(reject);
      });
    });
  }

  /**
   * Disconnects the websocket from the server
   */

  public async disconnect(): Promise<void> {
    return new Promise((resolve) => {
      this.socket.disconnect();
      this.socket.once('disconnect', resolve);
    });
  }

  /**
   * Logs the user out
   *
   * The current JWT gets banned until it expires
   * @returns Promise<void>
   */

  public logout(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.token) reject('No Token Provided');
      if (!this.connected) reject('Client Not Connected');
      requests.logout(this.token).then(resolve).catch(reject);
    });
  }

  public log(message: any): void {
    Logger.Log(message);
  }

  /**
   * Validates the user JWT
   * @returns Promise<void>
   * @see
   */

  private validate(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.token) {
        reject('No Token Provided');
      }
      requests
        .validate(this.token)
        .then((valid: boolean) => {
          valid ? resolve() : reject('Invalid');
        })
        .catch(reject);
    });
  }

  /**
   * Logs the user in with the given credentials
   * @returns Promise<string>
   * @see
   */

  private login(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.credentials) reject('No Credentials Provided');
      requests.login(this.credentials).then(resolve).catch(reject);
    });
  }

  /**
   * Initializes the user on connection
   * @returns Promise<void>
   */

  private initializeUser(): Promise<void> {
    return new Promise((resolve, reject) => {
      requests
        .get(this.token)
        .then((data: ClientUserProps) => {
          this.user = new ClientUser({ client: this, props: data });
          resolve();
        })
        .catch(reject);
    });
  }

  /**
   * Initialize the SocketEvents
   * @returns void
   */

  private handleSocketEvents(): void {
    this.socket.on('disconnect', () => {
      this.connected = false;
      this.logger && Logger.Event('Socket disconnected');
      this.emit('disconnect');
    });

    this.socket.on('error', (error: any) => {
      this.logger && Logger.Error('Socket error');
      this.emit('error', error);
    });

    this.socket.on('chatMessage', (message: any) => {
      this.logger && Logger.Event('Message received');
      this.emit('message', 'br');
    });

    this.socket.on('chatEdit', (chat: any) => {
      this.logger && Logger.Event('Chat edited');
    });

    this.socket.on('messageEdit', (message: any) => {
      this.logger && Logger.Event('Message edited');
    });

    this.socket.on('memberEdit', (member: any) => {
      this.logger && Logger.Event('Member edited');
    });

    this.socket.on('chatDelete', (chat: any) => {
      this.logger && Logger.Event('Chat deleted');
    });

    this.socket.on('memberJoin', (member: any) => {
      this.logger && Logger.Event('Member joined');
    });

    this.socket.on('memberLeave', (member: any) => {
      this.logger && Logger.Event('Member left');
    });
  }
}
