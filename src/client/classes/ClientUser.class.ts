import {
  BannedMember,
  Chat,
  ChatConstructor,
  ChatEdit,
  ChatType,
  Group,
  GroupConstructor,
  Member,
  PrivateChat,
  PrivateChatConstructor,
} from '../../chat';
import { ChatRequestManager, UserRequestManager } from '../../request';
import { colorForUuid } from '../../util';
import { Collection } from '../../util/Collection.class';
import { config } from '../../util/config';
import { ChatSocketEvent } from '../../websocket';
import { ClientUserConstructor, Locale } from '../types';
import { Client } from './Client.class';

const userManager: UserRequestManager = new UserRequestManager();
const chatManager: ChatRequestManager = new ChatRequestManager();

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

  private _avatar: string | null;

  private _chats: Map<string, Chat> = new Map<string, Chat>();

  private _color: string;

  constructor(client: Client, props: ClientUserConstructor) {
    this.client = client;
    this.uuid = props.uuid;
    this._name = props.name;
    this._tag = props.tag;
    this._description = props.description;
    this._mail = props.mail;
    this.createdAt = new Date(props.createdAt);
    this._lastSeen = new Date(props.lastSeen);
    this._online = props.online;
    this._locale = props.locale as Locale;
    this._avatar = props.avatar;
    this._color = colorForUuid(this.uuid);

    props.chats.forEach((chat: ChatConstructor) => {
      if (chat.type === ChatType.GROUP || chat.type === ChatType.PRIVATE_GROUP) {
        const group: Group = new Group(this.client, chat as GroupConstructor);
        this._chats.set(group.uuid, group);
      } else if (chat.type === ChatType.PRIVATE) {
        const privateChat: PrivateChat = new PrivateChat(this.client, chat);
        this._chats.set(privateChat.uuid, privateChat);
      }
    });

    this.client.raw.on(ChatSocketEvent.MEMBER_LEAVE, (chat: string, member: string) => {
      if (member === this.uuid) this._chats.delete(chat);
    });

    this.client.raw.on(ChatSocketEvent.MEMBER_BAN, (chat: string, member: string) => {
      if (member === this.uuid) this._chats.delete(chat);
    });

    this.client.raw.on(ChatSocketEvent.CHAT_DELETE, (chat: string) => this._chats.delete(chat));

    this.client.raw.on(ChatSocketEvent.CHAT_EDIT, (data: ChatEdit) => {
      const chat: Chat | undefined = this._chats.get(data.uuid);
      if (!chat) return client.error('Failed To Edit Chat');
      if (!(chat instanceof Group)) return client.error('Chat Has To Be A Group To Be Edited');
      const group: Group = new Group(chat.client, {
        ...chat,
        name: data.name as string,
        tag: data.tag as string,
        type: data.type,
        avatar: chat.avatarURL,
        description: data.description as string,
        messages: [...chat.messages.values()],
        members: [
          ...chat.members.values().map((member: Member) => ({
            role: member.role,
            joinedAt: member.joinedAt,
            user: {
              avatar: member.user.avatarURL,
              client: member.user.client,
              createdAt: member.user.createdAt,
              description: member.user.description,
              lastSeen: member.user.lastSeen,
              locale: member.user.locale as Locale,
              name: member.user.name,
              online: member.user.online,
              tag: member.user.tag,
              uuid: member.user.uuid,
            },
          })),
        ],
        banned: [...chat.bannedMembers.values()].map((banned: BannedMember) => ({
          ...banned,
          user: { ...banned, avatar: banned.avatarURL },
        })),
        memberLog: [...chat.memberLog.values()],
      });
      this._chats.set(data.uuid, group);
    });

    this.client.raw.on(ChatSocketEvent.PRIVATE_CREATE, (constructor: PrivateChatConstructor) => {
      this._chats.set(constructor.uuid, new PrivateChat(this.client, constructor));
    });

    this.client.raw.on(ChatSocketEvent.GROUP_CREATE, (constructor: GroupConstructor) => {
      this._chats.set(constructor.uuid, new Group(this.client, constructor));
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

  public get locale(): Locale {
    return this._locale;
  }

  /**
   * Avatar of the user
   */

  public get avatarURL(): string | null {
    return this._avatar ? `${config.apiUrl}/user/${this._avatar}/avatar` : null;
  }

  /**
   * Chats of the user
   */

  public get chats(): Collection<string, Chat> {
    return new Collection<string, Chat>(this._chats);
  }

  /**
   * Hex color of the user
   */

  public get color(): string {
    return this._color;
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
   * @param avatar FormData of the avatar image
   *
   * @returns Promise<void>
   */

  public setAvatar(avatar: FormData): Promise<void> {
    return new Promise((resolve, reject) => {
      userManager
        .sendRequest<'UPLOAD_AVATAR'>('UPLOAD_AVATAR', {
          authorization: this.client.token,
          body: { formData: avatar },
        })
        .then(() => {
          this._avatar = this.client.user.uuid;
          resolve();
        })
        .catch(reject);
    });
  }

  /**
   * Delete the avatar of the user
   *
   * @returns Promise<void>
   */

  public deleteAvatar(): Promise<void> {
    return new Promise((resolve, reject) => {
      userManager
        .sendRequest<'DELETE_AVATAR'>('DELETE_AVATAR', {
          authorization: this.client.token,
        })
        .then(() => {
          this._avatar = null;
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
      if (Object.keys(userInfo).length === 0) reject('No Informations Provided');
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
