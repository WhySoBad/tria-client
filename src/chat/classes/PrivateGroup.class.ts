import { Client } from '../../client';
import { PrivateGroupConstructor } from '../types';
import { Group } from './Group.class';

export class PrivateGroup extends Group {
  constructor(client: Client, props: PrivateGroupConstructor) {
    super(client, props);
  }
}
