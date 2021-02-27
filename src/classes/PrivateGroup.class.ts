import { Chat } from './Chat.class';
import { PrivateGroupConstructor } from '../types/PrivateGroup.types';

export class PrivateGroup extends Chat {
  constructor(props: PrivateGroupConstructor) {
    super(props);
  }
}
