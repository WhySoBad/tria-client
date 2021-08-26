"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSocket = void 0;
const tslib_1 = require("tslib");
const UserSocket_types_1 = require("../types/UserSocket.types");
const BaseSocket_class_1 = require("./BaseSocket.class");
class UserSocket extends BaseSocket_class_1.BaseSocket {
    constructor(props) {
        super(props);
        this.addEvent(UserSocket_types_1.UserSocketEvent.USER_EDIT, (_a) => {
            var { user } = _a, rest = tslib_1.__rest(_a, ["user"]);
            return [user, rest];
        });
        this.addEvent(UserSocket_types_1.UserSocketEvent.USER_DELETE);
        this.addEvent(UserSocket_types_1.UserSocketEvent.MESSAGE_READ, ({ chat, timestamp }) => [chat, timestamp]);
    }
}
exports.UserSocket = UserSocket;
