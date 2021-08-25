import { ChatConstructor } from '../../chat/types/Chat.types';
import { UserConstructor } from './User.types';
export interface ClientUserConstructor extends UserConstructor {
    mail: string;
    chats: Array<ChatConstructor>;
}
