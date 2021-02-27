import { Chat, Group, PrivateChat, PrivateGroup } from '.';
import * as requests from '../requests/ClientUser.requests';
import { ChatConstructor, ChatType, ClientUserConstructor, Locale } from '../types';
import { BaseClient } from './client';

export class ClientUser {
  /**
   * Client which initialized the ClientUser
   */

  public readonly client: BaseClient;

  /**
   * Uuid of the user
   */

  public readonly uuid: string;

  /**
   * Date when the user was created
   */

  public readonly createdAt: Date;

  private _name: string;

  private _tag: string;

  private _description: string;

  private _mail: string;

  private _lastSeen: Date;

  private _online: boolean;

  private _locale: Locale;

  private _avatar: string;

  private _chats: Map<string, Chat> = new Map<string, Chat>();

  constructor({ client, props }: ClientUserConstructor) {
    this.client = client;
    this.uuid = props.uuid;
    this._name = props.name;
    this._tag = props.tag;
    this._description = props.description;
    this._mail = props.mail;
    this.createdAt = props.createdAt;
    this._lastSeen = props.lastSeen;
    this._online = props.online;
    this._locale = props.locale as Locale;
    this._avatar = props.avatar;
    props.chats.forEach((chat: ChatConstructor) => {
      if (chat.type == ChatType.GROUP) this._chats.set(chat.uuid, new Group(chat));
      else if (chat.type == ChatType.PRIVATE) this._chats.set(chat.uuid, new PrivateChat(chat));
      else this._chats.set(chat.uuid, new PrivateGroup(chat));
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
   * Description of the user
   */

  public get description(): string {
    return this._description;
  }

  /**
   * Mail address of the user
   */

  public get mail(): string {
    return this._mail;
  }

  /**
   * Date when the user was connected with a websocket for the last time
   */

  public get lastSeen(): Date {
    return this._lastSeen;
  }

  /**
   * Boolean whether the user is online or not
   */

  public get online(): boolean {
    return this._online;
  }

  /**
   * Locale of the user
   */

  public get locale(): string {
    return this._locale;
  }

  /**
   * Avatar of the user
   */

  public get avatar(): string {
    return this._avatar;
  }

  /**
   * Chats of the user
   */

  public get chats(): Map<string, Chat> {
    return this._chats;
  }

  /**
   * Edit the username of the user
   *
   * @returns Promise<void>
   */

  public setName(name: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this._name === name) reject('New Name Is Equal To Old Name');
      requests
        .edit(this.client.token, { name: name })
        .catch(reject)
        .then(() => {
          this._name = name;
          resolve();
        });
    });
  }

  /**
   * Edit the tag of the user
   *
   * @returns Promise<void>
   */

  public setTag(tag: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this._tag === tag) reject('New Tag Is Equal To Old Tag');
      requests
        .edit(this.client.token, { tag: tag })
        .catch(reject)
        .then(() => {
          this._tag = tag;
          resolve();
        });
    });
  }

  /**
   * Edit the description of the user
   *
   * @returns Promise<void>
   */

  public setDescription(description: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this._description === description) reject('New Description Is Equal To Old Description');
      requests
        .edit(this.client.token, { description: description })
        .catch(reject)
        .then(() => {
          this._description = description;
          resolve();
        });
    });
  }

  /**
   * Edit the locale of the user
   *
   * @returns Promise<void>
   */

  public setLocale(locale: Locale): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this._locale === locale) reject('New Locale Is Equal To Old Locale');
      requests
        .edit(this.client.token, { locale: locale })
        .catch(reject)
        .then(() => {
          this._locale = locale;
          resolve();
        });
    });
  }

  /**
   * Edit the avatar of the user
   *
   * @returns Promise<void>
   */

  public setAvatar(avatar: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this._avatar === avatar) reject('New Avatar Is Equal To Old Avatar');
      requests
        .edit(this.client.token, { avatar: avatar })
        .catch(reject)
        .then(() => {
          this._avatar = avatar;
          resolve();
        });
    });
  }
}
