import { BannedMemberConstructor } from '../types/BannedMember.types';

export class BannedMember {
  /**
   * Date when the user was banned
   */

  public readonly bannedAt: Date;

  /**
   * Uuid of the user
   */

  public readonly uuid: string;

  /**
   * Date when the user was created
   */

  public readonly createdAt: Date;

  /**
   * Name of the user
   */

  public readonly name: string;

  /**
   * Tag of the user
   */

  public readonly tag: string;

  /**
   * Description of the user
   */

  public readonly description: string;

  /**
   * Link to the user's avatar
   */

  public readonly avatarURL: string | null;

  constructor({ bannedAt, user }: BannedMemberConstructor) {
    this.bannedAt = new Date(bannedAt);
    this.uuid = user.uuid;
    this.createdAt = new Date(user.createdAt);
    this.name = user.name;
    this.tag = user.tag;
    this.description = user.description;
    this.avatarURL = user.avatar;
  }
}
