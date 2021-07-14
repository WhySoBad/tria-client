import { BaseSocket } from './BaseSocket.class';
import { ChatSocketConstructor, ChatSocketEvent } from '../types/ChatSocket.types';
import { ChatType, Member, MemberConstructor, Message } from '../../chat';

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

    this.addEvent(ChatSocketEvent.MEMBER_EDIT, ({ chat, user, role, permissions }) => [
      chat,
      {
        user: user,
        role: role,
        permissions: permissions,
      },
    ]);

    this.addEvent(ChatSocketEvent.CHAT_EDIT, ({ chat, tag, name, description, type }) => [
      chat,
      {
        uuid: chat,
        tag: tag,
        name: name,
        description: description,
        type: type,
      },
    ]);

    this.addEvent(
      ChatSocketEvent.MESSAGE_EDIT,
      ({ chat, message, text, pinned, edited, editedAt }) => [
        chat,
        {
          chat: chat,
          uuid: message,
          text: text,
          pinned: pinned,
          edited: edited,
          editedAt: editedAt,
        },
      ]
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
