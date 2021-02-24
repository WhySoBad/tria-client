import { Client } from '../Client/Client.class';
import { ChatMemberProps } from '../Member';

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
  chats: Array<ChatMemberProps>;
}

export interface ClientUserConstructor {
  client: Client;
  props: ClientUserProps;
}
