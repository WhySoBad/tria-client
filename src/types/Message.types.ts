import { Chat } from '../classes';

export interface MessageContstructor {
  uuid: string;
  user: string;
  chat: Chat;
  createdAt: Date;
  editedAt: Date | null;
  edited: number;
  text: string;
  pinned: boolean;
}
