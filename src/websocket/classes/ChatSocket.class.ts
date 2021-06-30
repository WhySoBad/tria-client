import { BaseSocket } from './BaseSocket.class';
import { ChatSocketConstructor, ChatSocketEvent } from '../types/ChatSocket.types';
import { ChatType, Member, MemberConstructor, Message } from '../../chat';

export class ChatSocket extends BaseSocket {
  constructor(props: ChatSocketConstructor) {
    super(props);
    this.addEvent(ChatSocketEvent.MESSAGE, (message: any) => new Message(props.client, message));
    this.addEvent(ChatSocketEvent.CHAT_DELETE);
    this.addEvent(ChatSocketEvent.MEMBER_ONLINE);
    this.addEvent(ChatSocketEvent.MEMBER_OFFLINE);
    this.addEvent(ChatSocketEvent.MEMBER_BAN);
    this.addEvent(ChatSocketEvent.MEMBER_UNBAN);
    this.addEvent(ChatSocketEvent.GROUP_CREATE);

    this.addEvent(ChatSocketEvent.MEMBER_EDIT, ({ chat, user, role, permissions }) => [
      chat,
      {
        user: user,
        role: role,
        permissions: permissions,
      },
    ]);

    this.addEvent(ChatSocketEvent.CHAT_EDIT, ({ chat, tag, name, description, type }) => ({
      uuid: chat,
      tag: tag,
      name: name,
      description: description,
      type: type,
    }));

    this.addEvent(
      ChatSocketEvent.MESSAGE_EDIT,
      ({ chat, message, text, pinned, edited, editedAt }) => ({
        chat: chat,
        uuid: message,
        text: text,
        pinned: pinned,
        edited: edited,
        editedAt: editedAt,
      })
    );

    this.addEvent(ChatSocketEvent.MEMBER_JOIN, (member) => [member.chat, new Member(member)]);

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
