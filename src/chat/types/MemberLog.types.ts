export interface MemberLogConstructor {
  /**
   * Uuid of the user
   */

  user: string;

  /**
   * Uuid of the chat
   */

  chat: string;

  /**
   * Timestamp of the action
   */

  timestamp: Date;

  /**
   * Boolean whether the user joined or left the chat
   */

  joined: boolean;
}
