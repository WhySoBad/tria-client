import { MemberConstructor } from '../../types';
import { Member } from '..';
import { BaseSocket } from './BaseSocket.class';
import { ChatSocketConstructor, ChatSocketEvent } from '../../types/ChatSocket.types';

export class ChatSocket extends BaseSocket {
  constructor(props: ChatSocketConstructor) {
    super(props);
    this.addEvent(ChatSocketEvent.MESSAGE);
    this.addEvent(ChatSocketEvent.CHAT_EDIT, ({ chat, tag, name, description, type }) => {
      return { uuid: chat, tag: tag, name: name, description: description, type: type };
    });
    this.addEvent(
      ChatSocketEvent.MESSAGE_EDIT,
      ({ chat, message, text, pinned, edited, editedAt }) => {
        return {
          chat: chat,
          uuid: message,
          text: text,
          pinned: pinned,
          edited: edited,
          editedAt: editedAt,
        };
      }
    );
    this.addEvent(ChatSocketEvent.MEMBER_EDIT);
    this.addEvent(ChatSocketEvent.CHAT_DELETE);
    this.addEvent(
      ChatSocketEvent.MEMBER_JOIN,
      (member: { chat: string; user: MemberConstructor }) => {
        return [member.chat, new Member(member.user)];
      }
    );
    this.addEvent(ChatSocketEvent.MEMBER_LEAVE, (member: { chat: string; user: string }) => {
      return [member.chat, member.user];
    });

    /*     this.socket?.on('chatMessage', (message: any) => {});

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
    }); */
  }
}
