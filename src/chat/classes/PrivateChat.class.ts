import { Client } from '../../client';
import { Chat } from '../classes';
import { PrivateChatConstructor } from '../types';
import { Member } from './Member.class';

export class PrivateChat extends Chat {
  constructor(client: Client, props: PrivateChatConstructor) {
    super(client, props);
  }

  /**
   * Participant of the private chat
   */

  public get participant(): Member {
    return this.members.get(
      [...this.members.keys().filter((uuid: string) => uuid !== this.client.user.uuid)][0]
    ) as any;
  }
}
