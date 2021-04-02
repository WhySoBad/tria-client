export interface UserConstructor {
  /**
   * Uuid of the user
   */

  uuid: string;

  /**
   * Name of the user
   */

  name: string;

  /**
   * Unique tag of the user
   */

  tag: string;

  /**
   * Avatar of the user
   */

  avatar: string;

  /**
   * Date when the account was created
   */

  createdAt: Date;

  /**
   * Date when the user was seen for the last time
   */

  lastSeen: Date;

  /**
   * Description of the user
   */

  description: string;

  /**
   * Spoken locale by the user
   */

  locale: Locale;

  /**
   * Boolean whether the user is online or not
   */

  online: boolean;
}

export type Locale = 'EN' | 'DE' | 'FR';
