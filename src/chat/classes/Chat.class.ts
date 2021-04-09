import { v4 } from 'uuid';
import { Client } from '../../client';
import { ChatRequestManager } from '../../request';
import { handleAction } from '../../util';
import { Collection } from '../../util/Collection.class';
import { ChatSocketEvent } from '../../websocket';
import { Message, Member } from '../classes';
import { ChatConstructor, ChatType, MemberConstructor, MessageContstructor } from '../types';

const chatManager: ChatRequestManager = new ChatRequestManager();

export abstract class Chat {
  /**
   * Current client
   */

  public readonly client: Client;

  /**
   * Uuid of the chat
   */

  public readonly uuid: string;

  /**
   * Type of the chat
   */

  public readonly type: ChatType;

  protected _members: Map<string, Member> = new Map<string, Member>();

  protected _messages: Map<string, Message> = new Map<string, Message>();

  constructor(client: Client, { uuid, members, messages, type }: ChatConstructor) {
    this.client = client;
    this.uuid = uuid;
    this.type = type;
    members.forEach((member: MemberConstructor) => {
      this._members.set(member.user.uuid, new Member(member));
    });
    messages.forEach((message: MessageContstructor) => {
      this._messages.set(message.uuid, new Message(this.client, message));
    });

    this.client.raw.on(ChatSocketEvent.MEMBER_LEAVE, (chat: string, member: string) => {
      if (chat === this.uuid) this._members.delete(member);
    });

    this.client.raw.on(ChatSocketEvent.MEMBER_JOIN, (chat: string, member: Member) => {
      if (chat === this.uuid) this._members.set(member.user.uuid, member);
    });

    this.client.raw.on(ChatSocketEvent.MESSAGE, (message: Message) => {
      if (message.chat === this.uuid) this._messages.set(message.uuid, message);
    });

    this.client.raw.on(ChatSocketEvent.MESSAGE_EDIT, (editedMessage) => {
      const { chat, uuid, edited, editedAt, pinned, text } = editedMessage;
      if (chat !== this.uuid) return;
      const message: Message | undefined = this._messages.get(uuid);
      if (!message) return client.error('Failed To Edit Message');
      this._messages.set(
        uuid,
        new Message(message.client, {
          ...message,
          edited: edited,
          editedAt: editedAt,
          pinned: pinned,
          text: text,
        })
      );
    });

    this.client.raw.on(ChatSocketEvent.MEMBER_ONLINE, (uuid: string) => {
      if (this._members.get(uuid)) {
        const member: Member | undefined = this._members.get(uuid);
        if (!member) client.error('Failed To Change User Status');
        else this._members.set(uuid, { ...member, user: { ...member.user, online: true } });
      }
    });

    this.client.raw.on(ChatSocketEvent.MEMBER_OFFLINE, (uuid: string) => {
      if (this._members.get(uuid)) {
        const member: Member | undefined = this._members.get(uuid);
        if (!member) client.error('Failed To Change User Status');
        else this._members.set(uuid, { ...member, user: { ...member.user, online: false } });
      }
    });
  }

  /**
   * Members of the chat
   */

  public get members(): Collection<string, Member> {
    return new Collection<string, Member>(this._members);
  }

  /**
   * Get whether the current user can write in the chat or not
   *
   * @default false
   */

  public get writeable(): boolean {
    return !!this._members.get(this.client.user.uuid);
  }

  /**
   * Messages of the chat
   */

  public get messages(): Collection<string, Message> {
    return new Collection<string, Message>(this._messages);
  }

  /**
   * Delete the chat
   *
   * @returns Promise<void>
   */

  public delete(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.writeable) reject('User Has To Be Member');
      chatManager
        .sendRequest<'DELETE'>('DELETE', {
          uuid: this.uuid,
          authorization: this.client.token,
        })
        .then(resolve)
        .catch(reject);
    });
  }

  /**
   * Send a message in the chat
   *
   * @param message content of the message
   *
   * @returns Promise<void>
   */

  public sendMessage(message: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      if (!this.writeable) reject('User Has To Be Member');
      const actionUuid = v4();
      this.client.chat.emit(ChatSocketEvent.MESSAGE, {
        actionUuid: actionUuid,
        chat: this.uuid,
        data: message,
      });
      handleAction(this.client, actionUuid).then(resolve).catch(reject);
    });
  }
}
