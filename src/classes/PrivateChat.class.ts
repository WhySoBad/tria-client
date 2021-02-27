import { Chat } from '.';
import { PrivateChatConstructor } from '../types';
import { Client } from './client';

export class PrivateChat extends Chat {
  constructor(client: Client, props: PrivateChatConstructor) {
    super(client, props);
  }
}
