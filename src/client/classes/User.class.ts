import { colorForUuid } from '../../util';
import { config } from '../../util/config';
import { ChatSocketEvent } from '../../websocket';
import { UserSocketEvent } from '../../websocket/types/UserSocket.types';
import { UserConstructor } from '../types';
import { Client } from './Client.class';

export class User {
  /**
   * Uuid of the user
   */

  public readonly uuid: string;

  /**
   * Date when the user was created
   */

  public readonly createdAt: Date;

  /**
   * Current logged in client
   */

  public readonly client: Client;

  private _name: string;

  private _tag: string;

  private _avatar: string | null;

  private _lastSeen: Date;

  private _description: string;

  private _locale: string;

  private _online: boolean;

  private _color: string;

  constructor(props: UserConstructor) {
    this.uuid = props.uuid;
    this._name = props.name;
    this._tag = props.tag;
    this.client = props.client;
    this.createdAt = new Date(props.createdAt);
    this._lastSeen = new Date(props.lastSeen);
    this._description = props.description;
    this._locale = props.locale;
    this._online = props.online;
    this._avatar = props.avatar ? `${config.apiUrl}/user/${props.uuid}/avatar` : null;
    this._color = colorForUuid(this.uuid);

    this.client.raw.on(
      UserSocketEvent.USER_EDIT,
      (uuid: string, { name, tag, description, avatar, locale }) => {
        if (uuid !== this.uuid) return;
        this._name = name;
        this._tag = tag;
        this._description = description;
        this._avatar = avatar ? `${config.apiUrl}/user/${props.uuid}/avatar` : null;
        this._locale = locale;
      }
    );

    this.client.raw.on(ChatSocketEvent.MEMBER_ONLINE, (uuid: string) => {
      if (this.uuid !== uuid) return;
      this._online = true;
    });

    this.client.raw.on(ChatSocketEvent.MEMBER_OFFLINE, (uuid: string) => {
      if (this.uuid !== uuid) return;
      this._online = false;
      this._lastSeen = new Date();
    });
  }

  /**
   * Username of the user
   */

  public get name(): string {
    return this._name;
  }

  /**
   * Unique tag of the user
   */

  public get tag(): string {
    return this._tag;
  }

  /**
   * Avatar of the user
   */

  public get avatarURL(): string | null {
    return this._avatar;
  }

  /**
   * Date when the user was connected with a websocket for the last time
   */

  public get lastSeen(): Date {
    return this._lastSeen;
  }

  /**
   * Description of the user
   */

  public get description(): string {
    return this._description;
  }

  /**
   * Locale of the user
   */

  public get locale(): string {
    return this._locale;
  }

  /**
   * Boolean whether the user is online or not
   */

  public get online(): boolean {
    return this._online;
  }

  /**
   * Hex color of the user
   */

  public get color(): string {
    return this._color;
  }
}
