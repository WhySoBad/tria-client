export interface MessageContstructor {
  uuid: string;
  user: string;
  chat: string;
  createdAt: Date;
  editedAt: Date | null;
  edited: number;
  text: string;
  pinned: boolean;
}

export interface MessageEdit {
  chat: string;
  uuid: string;
  text: string;
  pinned: boolean;
  edited: number;
  editedAt: Date;
}
