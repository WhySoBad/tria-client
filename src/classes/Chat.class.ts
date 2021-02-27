import { Message, Member } from '.';
import { ChatConstructor, ChatType } from '../types';
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

  /**
   * Members of the chat
   */

  public members: Map<string, Member> = new Map<string, Member>();

  /**
   * Messages of the chat
   */

  public messages: Map<string, Message> = new Map<string, Message>();

  constructor(client: Client, props: ChatConstructor) {
    this.client = client;
    this.uuid = props.uuid;
    props.members.forEach((member) => this.members.set(member.user.uuid, new Member(member)));
    props.messages.forEach((message) => {
      this.messages.set(message.uuid, new Message(this.client, message));
    });
  }
}
