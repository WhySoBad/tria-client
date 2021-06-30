import { User } from '../../client';
import { GroupRole, MemberConstructor } from '../types';

export class Member {
  /**
   * Corresponding user instance of the member
   */

  public readonly user: User;

  /**
   * Date when the user joined the chat
   */

  public readonly joinedAt: Date;

  /**
   * Role of the member
   */

  public readonly role: GroupRole;

  constructor(props: MemberConstructor) {
    this.user = new User(props.user);
    this.joinedAt = new Date(props.joinedAt);
    this.role = props.role;
  }
}
