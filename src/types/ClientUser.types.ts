import { BaseClient } from '../classes';
import { Client } from '../classes/client/Client.class';
import { ChatConstructor } from './Chat.types';

export interface ClientUserProps {
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

export interface ClientUserConstructor {
  client: BaseClient;
  props: ClientUserProps;
}
