import { ChatType, Member, MemberConstructor, Message } from '../../chat';
import { ChatSocketConstructor, ChatSocketEvent } from '../types/ChatSocket.types';
import { BaseSocket } from './BaseSocket.class';

export class ChatSocket extends BaseSocket {
  constructor(props: ChatSocketConstructor) {
    super(props);
    this.addEvent(ChatSocketEvent.MESSAGE, (message: any) => [
      message.chat,
      new Message(props.client, message),
    ]);
    this.addEvent(ChatSocketEvent.CHAT_DELETE, ({ chat }: { chat: string }) => chat);
    this.addEvent(ChatSocketEvent.MEMBER_ONLINE);
    this.addEvent(ChatSocketEvent.MEMBER_OFFLINE);
    this.addEvent(ChatSocketEvent.MEMBER_BAN, ({ chat, user }: { chat: string; user: string }) => [
      chat,
      user,
    ]);
    this.addEvent(
      ChatSocketEvent.MEMBER_UNBAN,
      ({ chat, user }: { chat: string; user: string }) => [chat, user]
    );
    this.addEvent(ChatSocketEvent.GROUP_CREATE);

    this.addEvent(ChatSocketEvent.MEMBER_EDIT, ({ chat, ...rest }) => [chat, rest]);

    this.addEvent(ChatSocketEvent.CHAT_EDIT, (data) => [data.chat, data]);

    this.addEvent(ChatSocketEvent.MESSAGE_EDIT, ({ chat, message, ...rest }) => [
      chat,
      { chat: chat, uuid: message, ...rest },
    ]);

    this.addEvent(ChatSocketEvent.MEMBER_JOIN, (member) => [
      member.chat,
      new Member({ ...member, user: { client: props.client, ...member.user } }),
    ]);

    this.addEvent(ChatSocketEvent.MEMBER_LEAVE, (member: { chat: string; user: string }) => [
      member.chat,
      member.user,
    ]);

    this.addEvent(
      ChatSocketEvent.PRIVATE_CREATE,
      (chat: {
        uuid: string;
        type: ChatType;
        messages: Array<any>;
        members: Array<MemberConstructor>;
      }) => ({ ...chat, name: null, tag: null, description: null })
    );
  }
}
