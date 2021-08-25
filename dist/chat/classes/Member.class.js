"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Member = void 0;
const client_1 = require("../../client");
class Member {
    constructor(props) {
        this.user = new client_1.User(props.user);
        this.joinedAt = new Date(props.joinedAt);
        this.role = props.role;
    }
}
exports.Member = Member;
