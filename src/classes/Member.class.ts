import { ChatRole, MemberConstructor } from '../types';
import { User } from '.';

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

  public readonly role: ChatRole;

  constructor(props: MemberConstructor) {
    this.user = new User(props.user);
    this.joinedAt = props.joinedAt;
    this.role = props.role;
  }
}
