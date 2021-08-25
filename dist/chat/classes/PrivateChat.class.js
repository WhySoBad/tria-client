"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrivateChat = void 0;
const classes_1 = require("../classes");
class PrivateChat extends classes_1.Chat {
    constructor(client, props) {
        super(client, props);
    }
    get participant() {
        return this.members.get([...this.members.keys().filter((uuid) => uuid !== this.client.user.uuid)][0]);
    }
}
exports.PrivateChat = PrivateChat;
