import { UserConstructor } from '../types/User.types';

export class User {
  /**
   * Uuid of the user
   */

  public readonly uuid: string;

  /**
   * Username of the user
   */

  public readonly name: string;

  /**
   * Unique tag of the user
   */

  public readonly tag: string;

  /**
   * Avatar of the user
   */

  public readonly avatar: string;

  /**
   * Date when the user was created
   */

  public readonly createdAt: Date;

  /**
   * Date when the user was connected with a websocket for the last time
   */

  public readonly lastSeen: Date;

  /**
   * Description of the user
   */

  public readonly description: string;

  /**
   * Locale of the user
   */

  public readonly locale: string;

  /**
   * Boolean whether the user is online or not
   */

  public readonly online: boolean;

  constructor(props: UserConstructor) {
    this.uuid = props.uuid;
    this.name = props.name;
    this.tag = props.tag;
    this.createdAt = props.createdAt;
    this.lastSeen = props.lastSeen;
    this.description = props.description;
    this.locale = props.locale;
    this.online = props.online;
  }
}
