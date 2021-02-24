export type MemberConstructor = '';

export enum ChatRole {
  OWNER = 0,
  ADMIN = 1,
  MEMBER = 2,
}

export interface ChatMemberProps {
  userUuid: string;
  chatUuid: string;
  joinedAt: Date;
  role: ChatRole;
}

export type Locale = 'EN' | 'DE' | 'FR';
