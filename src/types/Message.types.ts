export interface MessageContstructor {
  /**
   * Uuid of the message
   */

  uuid: string;

  /**
   * Uuid of the sender
   */

  user: string;

  /**
   * Uuid of the chat
   */

  chat: string;

  /**
   * Date when the message was sent
   */

  createdAt: Date;

  /**
   * Date when the message was last edited
   */

  editedAt: Date | null;

  /**
   * Times the message was edited
   */

  edited: number;

  /**
   * Text of the message
   */

  text: string;

  /**
   * Boolean whether the message is pinned or not
   */

  pinned: boolean;
}

export interface MessageEdit {
  /**
   * Uuid of the chat
   */

  chat: string;

  /**
   * Uuid of the message
   */

  uuid: string;

  /**
   * Text of the message
   */

  text: string;

  /**
   * Boolean whether the message is pinned or not
   */

  pinned: boolean;

  /**
   * Times the message was edited
   */

  edited: number;

  /**
   * Date when the message was last edited
   */

  editedAt: Date;
}
