import { Client } from '../../client';
import { Chat } from '../classes';
import { PrivateChatConstructor } from '../types';

export class PrivateChat extends Chat {
  constructor(client: Client, props: PrivateChatConstructor) {
    super(client, props);
  }
}
