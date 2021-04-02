import { Message, Member } from '.';
import {
  ChatConstructor,
  ChatSocketEvent,
  ChatType,
  MemberConstructor,
  MessageContstructor,
} from '../types';
import { Admin } from './Admin.class';
import { Client } from './client';

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

  private _members: Map<string, Member> = new Map<string, Member>();

  private _messages: Map<string, Message> = new Map<string, Message>();

  constructor(client: Client, { uuid, members, messages }: ChatConstructor) {
    this.client = client;
    this.uuid = uuid;
    members.forEach((member: MemberConstructor) => {
      this._members.set(member.user.uuid, new Member(member));
    });
    messages.forEach((message: MessageContstructor) => {
      this._messages.set(message.uuid, new Message(this.client, message));
    });
  }

  /**
   * Members of the chat
   */

  public get members(): Map<string, Member> {
    return this._members;
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

  public get messages(): Map<string, Message> {
    return this._messages;
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
      this.client.chat.emit(ChatSocketEvent.MESSAGE, { chat: this.uuid, data: message });
      const handler: (message: Message) => void = (message: Message) => {
        if (message.chat == this.uuid) {
          console.log('MessageSenderFunction');
          this._messages.set(message.uuid, message);
          this.client.removeListener(ChatSocketEvent.MESSAGE, handler);
          resolve();
        }
      };
      this.client.on(ChatSocketEvent.MESSAGE, handler);
    });
  }
}
