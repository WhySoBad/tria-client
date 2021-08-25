"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Admin = void 0;
const Admin_types_1 = require("../types/Admin.types");
const Member_class_1 = require("./Member.class");
class Admin extends Member_class_1.Member {
    constructor(constructor) {
        super(constructor);
        this.promotedAt = new Date(constructor.promotedAt);
        this.permissions = constructor.permissions;
    }
    get canBan() {
        return this.permissions.includes(Admin_types_1.Permission.BAN);
    }
    get canUnban() {
        return this.permissions.includes(Admin_types_1.Permission.UNBAN);
    }
    get canEditGroup() {
        return this.permissions.includes(Admin_types_1.Permission.CHAT_EDIT);
    }
    get canEditMembers() {
        return this.permissions.includes(Admin_types_1.Permission.MEMBER_EDIT);
    }
    get canKick() {
        return this.permissions.includes(Admin_types_1.Permission.KICK);
    }
}
exports.Admin = Admin;
