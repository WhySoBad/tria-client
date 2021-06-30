import { Client } from '../classes';

export interface UserConstructor {
  /**
   * Logged in client
   */

  client: Client;
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

  avatar: string | null;

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

export interface UserPreview {
  uuid: string;
  name: string;
  tag: string;
  description: string;
  color: string;
}

export type Locale = 'EN' | 'DE' | 'FR';
