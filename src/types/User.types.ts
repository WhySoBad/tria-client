export interface UserConstructor {
  uuid: string;
  name: string;
  tag: string;
  avatar: string;
  createdAt: Date;
  lastSeen: Date;
  description: string;
  locale: string;
  online: boolean;
}

export type Locale = 'EN' | 'DE' | 'FR';
