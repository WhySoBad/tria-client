import { BaseSocket } from './BaseSocket.class';
import { UserSocketConstructor, UserSocketEvent } from '../types/UserSocket.types';

export class UserSocket extends BaseSocket {
  constructor(props: UserSocketConstructor) {
    super(props);

    this.addEvent(UserSocketEvent.USER_EDIT, ({ user, ...rest }) => [user, rest]);
    this.addEvent(UserSocketEvent.USER_DELETE);
  }
}
