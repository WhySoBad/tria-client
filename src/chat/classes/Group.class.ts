import { v4 } from 'uuid';
import { Client } from '../../client';
import { ChatRequestManager } from '../../request';
import { handleAction } from '../../util';
import { Collection } from '../../util/Collection.class';
import { ChatSocketEvent } from '../../websocket';
import { Chat } from '../classes';
import {
  BannedMemberConstructor,
  ChatType,
  EditMemberOptions,
  GroupConstructor,
  GroupRole,
} from '../types';
import { Admin } from './Admin.class';
import { BannedMember } from './BannedMember.class';
import { Member } from './Member.class';
import { Owner } from './Owner.class';

const chatManager: ChatRequestManager = new ChatRequestManager();

export class Group extends Chat {
  /**
   * Boolean whether the group is public or not
   */

  public readonly public: boolean;

  private _name: string;

  private _tag: string;

  private _description: string;

  private _banned: Map<string, BannedMember> = new Map<string, BannedMember>();

  constructor(client: Client, props: GroupConstructor) {
    super(client, props);
    if (props.type === ChatType.PRIVATE_GROUP) this.public = false;
    else if (props.type === ChatType.GROUP) this.public = true;
    this._name = props.name as any;
    this._tag = props.tag as any;
    this._description = props.description as any;
    props.banned.forEach((member: BannedMemberConstructor) => {
      this._banned.set(member.user.uuid, new BannedMember(member));
    });
    props.members.forEach((member: any) => {
      if (member.role === GroupRole.ADMIN) {
        const admin: Admin = new Admin({
          joinedAt: member.joinedAt,
          role: GroupRole.ADMIN,
          user: member?.user,
          permissions: member?.admin?.permissions || member?.permissions,
          promotedAt: member?.admin?.promotedAt || member?.promotedAt,
        });
        this._members.set(admin.user.uuid, admin);
      } else if (member.role === GroupRole.OWNER) {
        const owner: Owner = new Owner(member);
        this._members.set(owner.user.uuid, owner);
      }
    });

    this.client.raw.on(ChatSocketEvent.MEMBER_EDIT, (uuid: string, { user, role, permissions }) => {
      if (this.uuid !== uuid) return;
      const member: Member | undefined = this._members.get(user);
      if (!member) return this.client.error('Failed To Edit Chat Member');
      switch (role) {
        case GroupRole.OWNER: {
          const owner: Owner = new Owner({ ...member, role: GroupRole.OWNER });
          this._members.set(user, owner);
          break;
        }
        case GroupRole.ADMIN: {
          const admin: Admin = new Admin({
            ...member,
            role: GroupRole.ADMIN,
            permissions: [],
            promotedAt: new Date(),
          });
          this._members.set(user, admin);
          break;
        }
        case GroupRole.MEMBER: {
          const newMember: Member = new Member({ ...member, role: GroupRole.MEMBER });
          this._members.set(user, newMember);
          break;
        }
      }
    });

    this.client.raw.on(ChatSocketEvent.MEMBER_BAN, (chat: string, uuid: string) => {
      if (chat !== this.uuid) return;
      const member: Member | undefined = this._members.get(uuid);
      if (!member) return this.client.error('Failed To Edit Banned Member');
      const bannedMember: BannedMember = new BannedMember({
        bannedAt: new Date(),
        user: { ...member.user, avatar: member.user.avatarURL },
      });
      this._banned.set(uuid, bannedMember);
      this._members.delete(uuid);
    });

    this.client.raw.on(ChatSocketEvent.MEMBER_UNBAN, (chat: string, uuid: string) => {
      if (chat !== this.uuid) return;
      this._banned.delete(uuid);
    });
  }

  /**
   * Name of the group
   */

  public get name(): string {
    return this._name;
  }

  /**
   * Unique tag of the group
   */

  public get tag(): string {
    return this._tag;
  }

  /**
   * Description of the group
   */

  public get description(): string {
    return this._description;
  }

  /**
   * Boolean whether the user is allowed the edit the group
   *
   * Since only admins can edit groups the default value is false
   *
   * @default false
   */

  public get canEditGroup(): boolean {
    if (!this.writeable) return false;
    const member: Member | undefined = this._members.get(this.client.user.uuid);
    if (!member) return false;
    if (member instanceof Owner) return true;
    else if (member instanceof Admin) return member.canEditGroup;
    else return false;
  }

  /**
   * Boolean whether the user is allowed to edit members
   *
   * Since only admins can edit members the default value is false
   *
   * @default false
   */

  public get canEditMembers(): boolean {
    if (!this.writeable) return false;
    const member: Member | undefined = this._members.get(this.client.user.uuid);
    if (!member) return false;
    if (member instanceof Owner) return true;
    else if (member instanceof Admin) return member.canEditMembers;
    else return false;
  }

  /**
   * Boolean whether the user is allowed to ban members
   *
   * Since only admins can ban members the default value is false
   *
   * @default false
   */

  public get canBan(): boolean {
    if (!this.writeable) return false;
    const member: Member | undefined = this._members.get(this.client.user.uuid);
    if (!member) return false;
    if (member instanceof Owner) return true;
    else if (member instanceof Admin) return member.canBan;
    else return false;
  }

  /**
   * Boolean whether the user is allowed to unban members
   *
   * Since only admins can unban members the default value is false
   *
   * @default false
   */

  public get canUnban(): boolean {
    if (!this.writeable) return false;
    const member: Member | undefined = this._members.get(this.client.user.uuid);
    if (!member) return false;
    if (member instanceof Owner) return true;
    else if (member instanceof Admin) return member.canUnban;
    else return false;
  }

  /**
   * Boolean whether the user is allowed to kick members
   *
   * Since only admins can kick members the default value is false
   *
   * @default false
   */

  public get canKick(): boolean {
    if (!this.writeable) return false;
    const member: Member | undefined = this._members.get(this.client.user.uuid);
    if (!member) return false;
    if (member instanceof Owner) return true;
    else if (member instanceof Admin) return member.canKick;
    else return false;
  }

  /**
   * Boolean whether the user can delete the group
   */

  public get canDelete(): boolean {
    const member: Member | undefined = this._members.get(this.client.user.uuid);
    return !!(member && member instanceof Owner);
  }

  /**
   * Banned members of the group
   */

  public get bannedMembers(): Collection<string, BannedMember> {
    return new Collection<string, BannedMember>(this._banned);
  }

  /**
   * Delete the group
   *
   * @returns Promise<void>
   */

  public delete(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.canDelete) reject('Only Owner Can Delete A Group');
      else super.delete().then(resolve).catch(reject);
    });
  }

  /**
   * Edit the name of the group
   *
   * @param name new name of the group
   *
   * @returns Promise<void>
   */

  public setName(name: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.canEditGroup) reject("User Hasn't The Permission To Edit The Chat");
      const actionUuid: string = v4();
      this.client.chat.emit(ChatSocketEvent.CHAT_EDIT, {
        uuid: actionUuid,
        chat: this.uuid,
        data: { name: name },
      });
      handleAction(this.client, actionUuid).then(resolve).catch(reject);
    });
  }

  /**
   * Edit the tag of the group
   *
   * @param tag new tag of the group
   *
   * @returns Promise<void>
   */

  public setTag(tag: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.canEditGroup) reject("User Hasn't The Permission To Edit The Chat");
      const actionUuid: string = v4();
      this.client.chat.emit(ChatSocketEvent.CHAT_EDIT, {
        uuid: actionUuid,
        chat: this.uuid,
        data: { tag: tag },
      });
      handleAction(this.client, actionUuid).then(resolve).catch(reject);
    });
  }

  /**
   * Edit the description of the group
   *
   * @param description new description of the group
   *
   * @returns Promise<void>
   */

  public setDescription(description: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.canEditGroup) reject("User Hasn't The Permission To Edit The Chat");
      const actionUuid: string = v4();
      this.client.chat.emit(ChatSocketEvent.CHAT_EDIT, {
        uuid: actionUuid,
        chat: this.uuid,
        data: { description: description },
      });
      handleAction(this.client, actionUuid).then(resolve).catch(reject);
    });
  }

  /**
   * Ban a member of the group
   *
   * @param member member to be banned
   *
   * @returns Promise<void>
   */

  public banMember(member: Member): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.canKick) reject("User Hasn't The Permission To Ban Members");
      if (!this.members.get(member.user.uuid)) reject('Member Has To Be Member Of This Group');
      chatManager
        .sendRequest<'ADMIN_BAN'>('ADMIN_BAN', {
          uuid: this.uuid,
          body: { uuid: member.user.uuid },
          authorization: this.client.token,
        })
        .then(resolve)
        .catch(reject);
    });
  }

  /**
   * Unban a banned member of the group
   *
   * @param member uuid of the banned member
   *
   * @returns Promise<void>
   */

  public unbanMember(member: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.bannedMembers.get(member)) reject("Member Isn't Banned In This Group");
      chatManager
        .sendRequest<'ADMIN_UNBAN'>('ADMIN_UNBAN', {
          uuid: this.uuid,
          body: { uuid: member },
          authorization: this.client.token,
        })
        .then(resolve)
        .catch(reject);
    });
  }

  /**
   * Kick a member of the group
   *
   * @param member member to be kicked
   *
   * @returns Promise<void>
   */

  public kickMember(member: Member): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.canKick) reject("User Hasn't The Permission To Kick Members");
      if (!this.members.get(member.user.uuid)) reject('Member Has To Be Member Of This Group');
      chatManager
        .sendRequest<'ADMIN_KICK'>('ADMIN_KICK', {
          uuid: this.uuid,
          body: { uuid: member.user.uuid },
          authorization: this.client.token,
        })
        .then(resolve)
        .catch(reject);
    });
  }

  /**
   * Edit a member of the group
   *
   * @param member member to be edited
   *
   * @param options EditMemberOptions
   *
   * @returns Promise<void>
   */

  public editMember(member: Member, { role, permissions }: EditMemberOptions): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.canKick) reject("User Hasn't The Permission To Edit Members");
      if (!this.members.get(member.user.uuid)) reject('Member Has To Be Member Of This Group');
      const actionUuid: string = v4();
      this.client.chat.emit(ChatSocketEvent.MEMBER_EDIT, {
        actionUuid: actionUuid,
        chat: this.uuid,
        user: member.user.uuid,
        role: role,
        permissions: permissions || [],
      });
      handleAction(this.client, actionUuid).then(resolve).catch(reject);
    });
  }
}
