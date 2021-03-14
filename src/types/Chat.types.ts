import { MessageContstructor, MemberConstructor } from '.';

export enum ChatType {
  GROUP = 0,
  PRIVATE = 1,
  PRIVATE_GROUP = 2,
}

export interface ChatConstructor {
  uuid: string;
  type: ChatType;
  name: string | null;
  tag: string | null;
  description: string | null;
  members: Array<MemberConstructor>;
  messages: Array<MessageContstructor>;
}

export interface ChatEdit {
  uuid: string;
  type: ChatType;
  name: string | null;
  tag: string | null;
  description: string | null;
}
