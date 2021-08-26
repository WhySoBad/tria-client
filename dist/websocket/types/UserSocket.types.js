"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSocketEvent = void 0;
var UserSocketEvent;
(function (UserSocketEvent) {
    UserSocketEvent["CONNECT"] = "USER_CONNECT";
    UserSocketEvent["DISCONNECT"] = "USER_DISCONNECT";
    UserSocketEvent["USER_EDIT"] = "USER_EDIT";
    UserSocketEvent["USER_DELETE"] = "USER_DELETE";
    UserSocketEvent["MESSAGE_READ"] = "MESSAGE_READ";
})(UserSocketEvent = exports.UserSocketEvent || (exports.UserSocketEvent = {}));
