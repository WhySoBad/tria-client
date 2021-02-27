import { ChatConstructor } from './Chat.types';

export interface ClientUserConstructor {
  uuid: string;
  createdAt: Date;
  lastSeen: Date;
  mail: string;
  name: string;
  tag: string;
  description: string;
  avatar: string;
  locale: string;
  online: boolean;
  chats: Array<ChatConstructor>;
}
