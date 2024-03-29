export interface MessageContstructor {
  /**
   * Uuid of the message
   */

  uuid: string;

  /**
   * Uuid of the sender
   */

  sender: string;

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
   * Times the message was edited
   */

  edited: number;

  /**
   * Date when the message was last edited
   */

  editedAt: Date;
}
