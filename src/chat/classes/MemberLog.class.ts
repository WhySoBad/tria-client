import { MemberLogConstructor } from '../types/MemberLog.types';

export class MemberLog {
  /**
   * Uuid of the user
   */

  public readonly user: string;

  /**
   * Uuid of the chat
   */

  public readonly chat: string;

  /**
   * Timestamp of the action
   */

  public readonly timestamp: Date;

  /**
   * Boolean whether the user joined or left the chat
   */

  public readonly joined: boolean;

  constructor({ user, chat, timestamp, joined }: MemberLogConstructor) {
    this.user = user;
    this.chat = chat;
    this.timestamp = timestamp;
    this.joined = joined;
  }
}
