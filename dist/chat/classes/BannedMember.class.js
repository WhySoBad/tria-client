"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BannedMember = void 0;
const util_1 = require("../../util");
const config_1 = require("../../util/config");
class BannedMember {
    constructor({ bannedAt, user }) {
        this.bannedAt = new Date(bannedAt);
        this.uuid = user.uuid;
        this.createdAt = new Date(user.createdAt);
        this.name = user.name;
        this.tag = user.tag;
        this.description = user.description;
        this.avatarURL = user.avatar ? `${config_1.config.apiUrl}/user/${this.uuid}/avatar` : null;
        this.color = util_1.colorForUuid(this.uuid);
    }
}
exports.BannedMember = BannedMember;
