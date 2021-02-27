import { ChatRole, MemberConstructor, SocketEvent } from '../../types';
import { Member } from '..';
import { BaseSocket } from './BaseSocket.class';
import { ChatSocketConstructor, ChatSocketEvent } from '../../types/ChatSocket.types';

export class ChatSocket extends BaseSocket {
  constructor(props: ChatSocketConstructor) {
    super(props);

    this.socket?.on('connect', () => this.emit(SocketEvent.CONNECT));

    this.socket?.on('disconnect', () => this.emit(SocketEvent.DISCONNECT));

    this.socket?.on('error', (error: any) => this.emit(SocketEvent.ERROR, error));

    this.socket?.on('chatMessage', (message: any) => {});

    this.socket?.on('chatEdit', (chat: any) => {});

    this.socket?.on('messageEdit', (message: any) => {});

    this.socket?.on(
      'memberEdit',
      (member: { chat: string; user: string; role: ChatRole; permissions: Array<any> }) => {}
    );

    this.socket?.on('chatDelete', (chat: string) => this.emit(ChatSocketEvent.CHAT_DELETE, chat));

    this.socket?.on('memberJoin', (member: { chat: string; user: MemberConstructor }) => {
      this.emit(ChatSocketEvent.MEMBER_JOIN, member.chat, new Member(member.user));
    });

    this.socket?.on('memberLeave', (member: { chat: string; user: string }) => {
      this.emit(ChatSocketEvent.MEMBER_LEAVE, member.chat, member.user);
    });
  }
}
