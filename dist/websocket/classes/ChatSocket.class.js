"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatSocket = void 0;
const tslib_1 = require("tslib");
const chat_1 = require("../../chat");
const ChatSocket_types_1 = require("../types/ChatSocket.types");
const BaseSocket_class_1 = require("./BaseSocket.class");
class ChatSocket extends BaseSocket_class_1.BaseSocket {
    constructor(props) {
        super(props);
        this.addEvent(ChatSocket_types_1.ChatSocketEvent.MESSAGE, (message) => [
            message.chat,
            new chat_1.Message(props.client, message),
        ]);
        this.addEvent(ChatSocket_types_1.ChatSocketEvent.CHAT_DELETE, ({ chat }) => chat);
        this.addEvent(ChatSocket_types_1.ChatSocketEvent.MEMBER_ONLINE);
        this.addEvent(ChatSocket_types_1.ChatSocketEvent.MEMBER_OFFLINE);
        this.addEvent(ChatSocket_types_1.ChatSocketEvent.MEMBER_BAN, ({ chat, user }) => [chat, user]);
        this.addEvent(ChatSocket_types_1.ChatSocketEvent.MEMBER_UNBAN, ({ chat, user }) => [chat, user]);
        this.addEvent(ChatSocket_types_1.ChatSocketEvent.GROUP_CREATE);
        this.addEvent(ChatSocket_types_1.ChatSocketEvent.MEMBER_EDIT, (_a) => {
            var { chat } = _a, rest = tslib_1.__rest(_a, ["chat"]);
            return [chat, rest];
        });
        this.addEvent(ChatSocket_types_1.ChatSocketEvent.CHAT_EDIT, (data) => [data.chat, data]);
        this.addEvent(ChatSocket_types_1.ChatSocketEvent.MESSAGE_EDIT, (_a) => {
            var { chat, message } = _a, rest = tslib_1.__rest(_a, ["chat", "message"]);
            return [
                chat,
                Object.assign({ chat: chat, uuid: message }, rest),
            ];
        });
        this.addEvent(ChatSocket_types_1.ChatSocketEvent.MEMBER_JOIN, (member) => [
            member.chat,
            new chat_1.Member(Object.assign(Object.assign({}, member), { user: Object.assign({ client: props.client }, member.user) })),
        ]);
        this.addEvent(ChatSocket_types_1.ChatSocketEvent.MEMBER_LEAVE, ({ chat, user }) => [chat, user]);
        this.addEvent(ChatSocket_types_1.ChatSocketEvent.PRIVATE_CREATE, (chat) => (Object.assign(Object.assign({}, chat), { name: null, tag: null, description: null })));
    }
}
exports.ChatSocket = ChatSocket;
