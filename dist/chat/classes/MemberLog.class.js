"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemberLog = void 0;
class MemberLog {
    constructor({ user, chat, timestamp, joined }) {
        this.user = user;
        this.chat = chat;
        this.timestamp = timestamp;
        this.joined = joined;
    }
}
exports.MemberLog = MemberLog;
