import { Message, Member } from '.';
import { ChatConstructor, ChatType } from '../types/Chat.types';

export abstract class Chat {
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

  constructor(props: ChatConstructor) {
    this.uuid = props.uuid;
    props.members.forEach((member) => this.members.set(member.user.uuid, new Member(member)));
    props.messages.forEach((message) => this.messages.set(message.uuid, new Message(message)));
  }
}
