import { Chat, Group, PrivateChat, PrivateGroup } from '.';
import {
  ChatConstructor,
  ChatSocketEvent,
  ChatType,
  ClientUserConstructor,
  Locale,
} from '../types';
import { Client } from './client';
import { UserRequestManager } from './request/UserRequest.class';

const userManager: UserRequestManager = new UserRequestManager();

export class ClientUser {
  /**
   * Client which initialized the ClientUser
   */

  public readonly client: Client;

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

  constructor(client: Client, props: ClientUserConstructor) {
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
      if (chat.type == ChatType.GROUP) this._chats.set(chat.uuid, new Group(this.client, chat));
      else if (chat.type == ChatType.PRIVATE) {
        this._chats.set(chat.uuid, new PrivateChat(this.client, chat));
      } else this._chats.set(chat.uuid, new PrivateGroup(this.client, chat));
    });

    /*     this.client.on(ChatSocketEvent.MEMBER_JOIN, (chat: string, member: Member) => {
      if (member.user.uuid == this.uuid) this._chats.set(chat, {});
    }); */

    this.client.on(ChatSocketEvent.MEMBER_LEAVE, (chat: string, member: string) => {
      if (member == this.uuid) this._chats.delete(chat);
    });

    this.client.on(ChatSocketEvent.MEMBER_BANNED, (chat: string, member: string) => {
      if (member == this.uuid) this._chats.delete(chat);
    });

    this.client.on(ChatSocketEvent.CHAT_DELETE, (chat: string) => this._chats.delete(chat));
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

  public get locale(): Locale {
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
      userManager
        .sendRequest<'EDIT'>('EDIT', {
          authorization: this.client.token,
          body: { name: name },
        })
        .then(() => {
          this._name = name;
          resolve();
        })
        .catch(reject);
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
      userManager
        .sendRequest<'EDIT'>('EDIT', {
          authorization: this.client.token,
          body: { tag: tag },
        })
        .then(() => {
          this._tag = tag;
          resolve();
        })
        .catch(reject);
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
      userManager
        .sendRequest<'EDIT'>('EDIT', {
          authorization: this.client.token,
          body: { description: description },
        })
        .then(() => {
          this._description = description;
          resolve();
        })
        .catch(reject);
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
      userManager
        .sendRequest<'EDIT'>('EDIT', {
          authorization: this.client.token,
          body: { locale: locale },
        })
        .then(() => {
          this._locale = locale;
          resolve();
        })
        .catch(reject);
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
      userManager
        .sendRequest<'EDIT'>('EDIT', {
          authorization: this.client.token,
          body: { avatar: avatar },
        })
        .then(() => {
          this._avatar = avatar;
          resolve();
        })
        .catch(reject);
    });
  }

  /**
   * Edit multiple user informations at once
   *
   * @param userInfo object with the informations to edit
   *
   * @returns Promise<void>
   */

  public setUserInfo(userInfo: {
    locale?: Locale;
    description?: string;
    name?: string;
    tag?: string;
    avatar?: string;
  }): Promise<void> {
    return new Promise((resolve, reject) => {
      Object.entries(userInfo).forEach(([key, value]) => {
        if (!value) delete (userInfo as any)[key];
      });
      if (Object.keys(userInfo).length == 0) reject('No Informations Provided');
      userManager
        .sendRequest<'EDIT'>('EDIT', {
          authorization: this.client.token,
          body: userInfo,
        })
        .then(() => {
          this._locale = userInfo.locale || this._locale;
          this._description = userInfo.description || this._description;
          this._name = userInfo.name || this._name;
          this._tag = userInfo.tag || this._tag;
          this._avatar = userInfo.avatar || this._avatar;
          resolve();
        })
        .catch(reject);
    });
  }
}
