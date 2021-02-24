import { Message } from '../Message';

export interface Credentials {
  username: string;
  password: string;
}

export interface ClientConstructor {
  log?: boolean;
}

export type ConnectionProps = Credentials | string;

export interface ClientEvents {
  message: (message: Message) => void;
  error: (error: Error) => void;
  validate: () => void;
  login: () => void;
  connect: () => void;
  disconnect: () => void;
}
