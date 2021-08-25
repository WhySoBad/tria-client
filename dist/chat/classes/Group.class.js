"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Group = void 0;
const uuid_1 = require("uuid");
const request_1 = require("../../request");
const util_1 = require("../../util");
const Collection_class_1 = require("../../util/Collection.class");
const config_1 = require("../../util/config");
const websocket_1 = require("../../websocket");
const classes_1 = require("../classes");
const types_1 = require("../types");
const Admin_class_1 = require("./Admin.class");
const BannedMember_class_1 = require("./BannedMember.class");
const Member_class_1 = require("./Member.class");
const MemberLog_class_1 = require("./MemberLog.class");
const Owner_class_1 = require("./Owner.class");
const chatManager = new request_1.ChatRequestManager();
class Group extends classes_1.Chat {
    constructor(client, props) {
        super(client, props);
        this._banned = new Map();
        if (props.type === types_1.ChatType.PRIVATE_GROUP)
            this._public = false;
        else if (props.type === types_1.ChatType.GROUP)
            this._public = true;
        if (client.logging)
            chatManager.enableLogging();
        this._name = props.name;
        this._tag = props.tag;
        this._avatar = props.avatar;
        this._description = props.description;
        props.banned.forEach((member) => {
            this._banned.set(member.user.uuid, new BannedMember_class_1.BannedMember(member));
        });
        props.members.forEach((member) => {
            var _a, _b;
            if (member.role === types_1.GroupRole.ADMIN) {
                const admin = new Admin_class_1.Admin({
                    joinedAt: member.joinedAt,
                    role: types_1.GroupRole.ADMIN,
                    user: Object.assign({ client: this.client }, member === null || member === void 0 ? void 0 : member.user),
                    permissions: ((_a = member === null || member === void 0 ? void 0 : member.admin) === null || _a === void 0 ? void 0 : _a.permissions) || (member === null || member === void 0 ? void 0 : member.permissions),
                    promotedAt: ((_b = member === null || member === void 0 ? void 0 : member.admin) === null || _b === void 0 ? void 0 : _b.promotedAt) || (member === null || member === void 0 ? void 0 : member.promotedAt),
                });
                this._members.set(admin.user.uuid, admin);
            }
            else if (member.role === types_1.GroupRole.OWNER) {
                const owner = new Owner_class_1.Owner(Object.assign(Object.assign({}, member), { chat: this.uuid, user: Object.assign({ client: this.client }, member.user) }));
                this._members.set(owner.user.uuid, owner);
            }
        });
        this.client.raw.on(websocket_1.ChatSocketEvent.MEMBER_EDIT, (uuid, { user, role, permissions }) => {
            if (this.uuid !== uuid)
                return;
            const member = this._members.get(user);
            if (!member)
                return this.client.error('Failed To Edit Chat Member');
            const ctr = {
                avatar: member.user.avatarURL,
                client: member.user.client,
                createdAt: member.user.createdAt,
                description: member.user.description,
                lastSeen: member.user.lastSeen,
                locale: member.user.locale,
                name: member.user.name,
                online: member.user.online,
                tag: member.user.tag,
                uuid: member.user.uuid,
            };
            switch (role) {
                case types_1.GroupRole.OWNER: {
                    const owner = new Owner_class_1.Owner(Object.assign(Object.assign({}, member), { role: types_1.GroupRole.OWNER, user: ctr }));
                    this._members.set(user, owner);
                    break;
                }
                case types_1.GroupRole.ADMIN: {
                    const admin = new Admin_class_1.Admin(Object.assign(Object.assign({}, member), { role: types_1.GroupRole.ADMIN, permissions: [...permissions], promotedAt: new Date(), user: ctr }));
                    this._members.set(user, admin);
                    break;
                }
                case types_1.GroupRole.MEMBER: {
                    const newMember = new Member_class_1.Member(Object.assign(Object.assign({}, member), { role: types_1.GroupRole.MEMBER, user: ctr }));
                    this._members.set(user, newMember);
                    break;
                }
            }
        });
        this.client.raw.on(websocket_1.ChatSocketEvent.MEMBER_BAN, (chat, uuid) => {
            if (chat !== this.uuid)
                return;
            const member = this._members.get(uuid);
            if (!member)
                return this.client.error('Failed To Edit Banned Member');
            const bannedMember = new BannedMember_class_1.BannedMember({
                bannedAt: new Date(),
                user: {
                    uuid: member.user.uuid,
                    avatar: member.user.avatarURL,
                    name: member.user.name,
                    tag: member.user.tag,
                    description: member.user.description,
                    createdAt: member.user.createdAt,
                },
            });
            this._memberLog.set(uuid, new MemberLog_class_1.MemberLog({ user: uuid, chat: this.uuid, timestamp: new Date(), joined: false }));
            this._banned.set(uuid, bannedMember);
            this._members.delete(uuid);
        });
        this.client.raw.on(websocket_1.ChatSocketEvent.MEMBER_UNBAN, (chat, uuid) => {
            if (chat !== this.uuid)
                return;
            this._banned.delete(uuid);
        });
        this.client.raw.on(websocket_1.ChatSocketEvent.CHAT_EDIT, (chat, data) => {
            if (chat !== this.uuid)
                return;
            this._name = data.name;
            this._tag = data.tag;
            this._description = data.description;
            this._type = data.type;
            if (data.type === types_1.ChatType.GROUP)
                this._public = true;
            else
                this._public = false;
        });
    }
    get name() {
        return this._name;
    }
    get tag() {
        return this._tag;
    }
    get description() {
        return this._description;
    }
    get avatarURL() {
        return this._avatar ? `${config_1.config.apiUrl}/chat/${this._avatar}/avatar` : null;
    }
    get public() {
        return this._public;
    }
    get canEditGroup() {
        if (!this.writeable)
            return false;
        const member = this._members.get(this.client.user.uuid);
        if (!member)
            return false;
        if (member instanceof Owner_class_1.Owner)
            return true;
        else if (member instanceof Admin_class_1.Admin)
            return member.canEditGroup;
        else
            return false;
    }
    get canEditMembers() {
        if (!this.writeable)
            return false;
        const member = this._members.get(this.client.user.uuid);
        if (!member)
            return false;
        if (member instanceof Owner_class_1.Owner)
            return true;
        else if (member instanceof Admin_class_1.Admin)
            return member.canEditMembers;
        else
            return false;
    }
    get canBan() {
        if (!this.writeable)
            return false;
        const member = this._members.get(this.client.user.uuid);
        if (!member)
            return false;
        if (member instanceof Owner_class_1.Owner)
            return true;
        else if (member instanceof Admin_class_1.Admin)
            return member.canBan;
        else
            return false;
    }
    get canUnban() {
        if (!this.writeable)
            return false;
        const member = this._members.get(this.client.user.uuid);
        if (!member)
            return false;
        if (member instanceof Owner_class_1.Owner)
            return true;
        else if (member instanceof Admin_class_1.Admin)
            return member.canUnban;
        else
            return false;
    }
    get canKick() {
        if (!this.writeable)
            return false;
        const member = this._members.get(this.client.user.uuid);
        if (!member)
            return false;
        if (member instanceof Owner_class_1.Owner)
            return true;
        else if (member instanceof Admin_class_1.Admin)
            return member.canKick;
        else
            return false;
    }
    get canDelete() {
        const member = this._members.get(this.client.user.uuid);
        return !!(member && member instanceof Owner_class_1.Owner);
    }
    get bannedMembers() {
        return new Collection_class_1.Collection(this._banned);
    }
    delete() {
        return new Promise((resolve, reject) => {
            if (!this.canDelete)
                reject('Only Owner Can Delete A Group');
            else
                super.delete().then(resolve).catch(reject);
        });
    }
    setName(name) {
        return new Promise((resolve, reject) => {
            if (!this.canEditGroup)
                reject("User Hasn't The Permission To Edit The Chat");
            const actionUuid = uuid_1.v4();
            this.client.socket.chat.emit(websocket_1.ChatSocketEvent.CHAT_EDIT, {
                actionUuid: actionUuid,
                chat: this.uuid,
                name: name,
            });
            util_1.handleAction(this.client, actionUuid).then(resolve).catch(reject);
        });
    }
    setTag(tag) {
        return new Promise((resolve, reject) => {
            if (!this.canEditGroup)
                reject("User Hasn't The Permission To Edit The Chat");
            const actionUuid = uuid_1.v4();
            this.client.socket.chat.emit(websocket_1.ChatSocketEvent.CHAT_EDIT, {
                actionUuid: actionUuid,
                chat: this.uuid,
                tag: tag,
            });
            util_1.handleAction(this.client, actionUuid).then(resolve).catch(reject);
        });
    }
    setDescription(description) {
        return new Promise((resolve, reject) => {
            if (!this.canEditGroup)
                reject("User Hasn't The Permission To Edit The Chat");
            const actionUuid = uuid_1.v4();
            this.client.socket.chat.emit(websocket_1.ChatSocketEvent.CHAT_EDIT, {
                actionUuid: actionUuid,
                chat: this.uuid,
                description: description,
            });
            util_1.handleAction(this.client, actionUuid).then(resolve).catch(reject);
        });
    }
    setType(type) {
        return new Promise((resolve, reject) => {
            if (!this.canEditGroup)
                reject("User Hasn't The Permission To Edit The Chat");
            const isPublic = type === types_1.GroupType.GROUP;
            if ((this._public && isPublic) || (!this._public && !isPublic)) {
                reject(`Group Is Already Of Type ${type}`);
            }
            const actionUuid = uuid_1.v4();
            this.client.socket.chat.emit(websocket_1.ChatSocketEvent.CHAT_EDIT, {
                actionUuid: actionUuid,
                chat: this.uuid,
                type: type,
            });
            util_1.handleAction(this.client, actionUuid).then(resolve).catch(reject);
        });
    }
    setSettings(settings) {
        return new Promise((resolve, reject) => {
            if (!this.canEditGroup)
                reject("User Hasn't The Permission To Edit The Chat");
            if (Object.keys(settings).length === 0)
                reject("Settings Can't Be Empty");
            const isPublic = settings.type === types_1.GroupType.GROUP;
            if ((settings.type && this._public && isPublic) || (!this._public && !isPublic)) {
                reject(`Group Is Already Of Type ${settings.type}`);
            }
            const actionUuid = uuid_1.v4();
            this.client.socket.chat.emit(websocket_1.ChatSocketEvent.CHAT_EDIT, Object.assign({ actionUuid: actionUuid, chat: this.uuid }, settings));
            util_1.handleAction(this.client, actionUuid).then(resolve).catch(reject);
        });
    }
    setAvatar(avatar) {
        return new Promise((resolve, reject) => {
            chatManager
                .sendRequest('UPLOAD_AVATAR', {
                uuid: this.uuid,
                authorization: this.client.token,
                body: {
                    formData: avatar,
                },
            })
                .then(() => {
                this._avatar = this.uuid;
                resolve();
            })
                .catch(reject);
        });
    }
    deleteAvatar() {
        return new Promise((resolve, reject) => {
            chatManager
                .sendRequest('DELETE_AVATAR', {
                uuid: this.uuid,
                authorization: this.client.token,
            })
                .then(() => {
                this._avatar = null;
                resolve();
            })
                .catch(reject);
        });
    }
    banMember(member) {
        return new Promise((resolve, reject) => {
            if (!this.canKick)
                reject("User Hasn't The Permission To Ban Members");
            if (!this.members.get(member.user.uuid))
                reject('Member Has To Be Member Of This Group');
            chatManager
                .sendRequest('ADMIN_BAN', {
                uuid: this.uuid,
                body: { uuid: member.user.uuid },
                authorization: this.client.token,
            })
                .then(resolve)
                .catch(reject);
        });
    }
    unbanMember(member) {
        return new Promise((resolve, reject) => {
            if (!this.bannedMembers.get(member))
                reject("Member Isn't Banned In This Group");
            chatManager
                .sendRequest('ADMIN_UNBAN', {
                uuid: this.uuid,
                body: { uuid: member },
                authorization: this.client.token,
            })
                .then(resolve)
                .catch(reject);
        });
    }
    kickMember(member) {
        return new Promise((resolve, reject) => {
            if (!this.canKick)
                reject("User Hasn't The Permission To Kick Members");
            if (!this.members.get(member.user.uuid))
                reject('Member Has To Be Member Of This Group');
            chatManager
                .sendRequest('ADMIN_KICK', {
                uuid: this.uuid,
                body: { uuid: member.user.uuid },
                authorization: this.client.token,
            })
                .then(resolve)
                .catch(reject);
        });
    }
    editMember(member, { role, permissions }) {
        return new Promise((resolve, reject) => {
            if (!this.canKick)
                reject("User Hasn't The Permission To Edit Members");
            if (!this.members.get(member.user.uuid))
                reject('Member Has To Be Member Of This Group');
            const actionUuid = uuid_1.v4();
            this.client.socket.chat.emit(websocket_1.ChatSocketEvent.MEMBER_EDIT, {
                actionUuid: actionUuid,
                chat: this.uuid,
                user: member.user.uuid,
                role: role,
                permissions: permissions || [],
            });
            util_1.handleAction(this.client, actionUuid).then(resolve).catch(reject);
        });
    }
}
exports.Group = Group;
