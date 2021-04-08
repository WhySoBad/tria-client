import { ChatConstructor } from '../../chat/types/Chat.types';
import { UserConstructor } from './User.types';

export interface ClientUserConstructor extends UserConstructor {
  /**
   * Mail address of the user
   */

  mail: string;

  /**
   * Chats of the user
   */

  chats: Array<ChatConstructor>;
}
