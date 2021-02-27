import { Chat } from '.';
import { PrivateGroupConstructor } from '../types';
import { Client } from './client';

export class PrivateGroup extends Chat {
  constructor(client: Client, props: PrivateGroupConstructor) {
    super(client, props);
  }
}
