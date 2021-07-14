import { v4 } from 'uuid';
import { Client } from '../../client';
import { ChatRequestManager } from '../../request';
import { colorForUuid, handleAction } from '../../util';
import { Collection } from '../../util/Collection.class';
import { ChatSocketEvent } from '../../websocket';
import { Message, Member } from '../classes';
import { ChatConstructor, ChatType, MemberConstructor, MessageContstructor } from '../types';
import { MemberLogConstructor } from '../types/MemberLog.types';
import { MemberLog } from './MemberLog.class';

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

  /**
   * Date when the chat was created
   */

  public readonly createdAt: Date;

  /**
   * Hex color of the chat
   */

  public readonly color: string;

  protected _members: Map<string, Member> = new Map<string, Member>();

  protected _messages: Map<string, Message> = new Map<string, Message>();

  protected _memberLog: Map<string, MemberLog> = new Map<string, MemberLog>();

  protected _lastFetched: boolean = false;

  protected _lastRead: Date;

  constructor(
    client: Client,
    { uuid, members, messages, type, memberLog, createdAt, lastRead }: ChatConstructor
  ) {
    this.client = client;
    this.uuid = uuid;
    this.type = type;
    this.createdAt = new Date(createdAt);
    this.color = colorForUuid(uuid);
    this._lastRead = new Date(lastRead);

    members.forEach((member: MemberConstructor) => {
      this._members.set(
        member.user.uuid,
        new Member({ ...member, user: { ...member.user, client: this.client } })
      );
    });
    messages.forEach((message: MessageContstructor) => {
      this._messages.set(message.uuid, new Message(this.client, message));
    });
    memberLog.forEach((memberLog: MemberLogConstructor) => {
      this._memberLog.set(
        memberLog.user,
        new MemberLog({ ...memberLog, timestamp: new Date(memberLog.timestamp) })
      );
    });

    if (this.messages.size === 0) this._lastFetched = true;

    this.client.raw.on(ChatSocketEvent.MEMBER_LEAVE, (chat: string, member: string) => {
      if (chat !== this.uuid) return;
      this._members.delete(member);
      this._memberLog.set(
        member,
        new MemberLog({ user: member, chat: this.uuid, timestamp: new Date(), joined: false })
      );
    });

    this.client.raw.on(ChatSocketEvent.MEMBER_JOIN, (chat: string, member: Member) => {
      if (chat !== this.uuid) return;
      this._members.set(member.user.uuid, member);
      this._memberLog.set(
        member.user.uuid,
        new MemberLog({
          user: member.user.uuid,
          chat: this.uuid,
          timestamp: new Date(),
          joined: true,
        })
      );
    });

    this.client.raw.on(ChatSocketEvent.MESSAGE, (chat: string, message: Message) => {
      if (chat === this.uuid) this._messages.set(message.uuid, message);
    });

    this.client.raw.on(ChatSocketEvent.MESSAGE_EDIT, (chat: string, editedMessage) => {
      if (chat !== this.uuid) return;
      const { uuid, edited, editedAt, pinned, text } = editedMessage;
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
  }

  /**
   * Date when the user last read a message in the chat
   */

  public get lastRead(): Date {
    return this._lastRead;
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
   * Boolean whether the last message of the chat were fetched
   *
   * @default false
   */

  public get lastFetched(): boolean {
    return this._lastFetched;
  }

  /**
   * Member log of the chat
   */

  public get memberLog(): Collection<string, MemberLog> {
    return new Collection<string, MemberLog>(this._memberLog);
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
    return new Promise((resolve, reject) => {
      if (!this.writeable) reject('User Has To Be Member');
      const actionUuid = v4();
      this.client.socket.chat.emit(ChatSocketEvent.MESSAGE, {
        actionUuid: actionUuid,
        chat: this.uuid,
        data: message,
      });
      handleAction(this.client, actionUuid)
        .then(() => {
          this._lastRead = new Date();
          resolve();
        })
        .catch(reject);
    });
  }

  /**
   * Fetch a specific amount of messages after a certain timestamp
   *
   * @param timestamp timestamp older than the message's create date
   *
   * @param amount amount of messages
   *
   * @returns Promise<void>
   */

  public fetchMessages(timestamp: number, amount: number = 25): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.writeable) reject('User Has To Be Member');
      if (this._lastFetched) reject('Last Message Already Fetched');
      chatManager
        .sendRequest<'FETCH_MESSAGES'>('FETCH_MESSAGES', {
          uuid: this.uuid,
          amount: amount?.toString(),
          timestamp: timestamp,
          authorization: this.client.token,
        })
        .then(
          (fetched: {
            messages: Array<MessageContstructor>;
            log: Array<MemberLogConstructor>;
            last: boolean;
          }) => {
            const { messages, log, last } = fetched;
            if (last) this._lastFetched = true;
            messages.forEach((constructor: MessageContstructor) => {
              const message: Message = new Message(this.client, constructor);
              this._messages.set(message.uuid, message);
            });

            log.forEach((constructor: MemberLogConstructor) => {
              const log: MemberLog = new MemberLog({
                ...constructor,
                timestamp: new Date(constructor.timestamp),
              });
              this._memberLog.set(log.user, log);
            });
            resolve();
          }
        )
        .catch(reject);
    });
  }

  /**
   * Mark messages until a given timestamp as read
   *
   * @param timestamp timestamp to be read to
   *
   * @returns Promise<void>
   */

  public readUntil(timestamp: Date | number): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.members.get(this.client.user.uuid)) reject('Invalid User');
      else
        chatManager
          .sendRequest<'READ_MESSAGES'>('READ_MESSAGES', {
            uuid: this.uuid,
            timestamp: timestamp instanceof Date ? timestamp.getTime() : timestamp,
            authorization: this.client.token,
          })
          .then(() => {
            this._lastRead = new Date(timestamp);
            resolve();
          })
          .catch(reject);
    });
  }
}
