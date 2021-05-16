import { config } from '../../util/config';
import { UserConstructor } from '../types';

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

  public readonly avatarURL: string | null;

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
    this.createdAt = new Date(props.createdAt);
    this.lastSeen = new Date(props.lastSeen);
    this.description = props.description;
    this.locale = props.locale;
    this.online = props.online;
    this.avatarURL = props.avatar ? `${config.apiUrl}/user/${props.uuid}/avatar` : null;
  }
}
