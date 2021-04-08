import { v4 } from 'uuid';
import { Client } from '../../client';
import { ActionMaintainer } from '../../util';
import { ChatSocketEvent } from '../../websocket';
import { Chat } from '../classes';
import { BannedMemberConstructor, GroupConstructor, GroupRole } from '../types';
import { Admin } from './Admin.class';
import { BannedMember } from './BannedMember.class';
import { Member } from './Member.class';
import { Owner } from './Owner.class';

export class Group extends Chat {
  private _name: string;

  private _tag: string;

  private _description: string;

  private _banned: Map<string, BannedMember> = new Map<string, BannedMember>();

  constructor(client: Client, props: GroupConstructor) {
    super(client, props);
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
   * Boolean whether the chat is editable
   *
   * Since only admins can edit a chat the default value is false
   *
   * @default false
   */

  public get editable(): boolean {
    return true;
  }

  /**
   * Banned members of the group
   */

  public get bannedMembers(): Map<string, BannedMember> {
    return this._banned;
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
      if (!this.editable) reject("User Hasn't The Permission To Edit The Chat");
      const actionUuid: string = v4();
      this.client.chat.emit(ChatSocketEvent.CHAT_EDIT, {
        uuid: actionUuid,
        chat: this.uuid,
        data: { name: name },
      });
      new ActionMaintainer(this.client, actionUuid).handle().then(resolve).catch(reject);
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
      if (!this.editable) reject("User Hasn't The Permission To Edit The Chat");
      const actionUuid: string = v4();
      this.client.chat.emit(ChatSocketEvent.CHAT_EDIT, {
        uuid: actionUuid,
        chat: this.uuid,
        data: { tag: tag },
      });
      new ActionMaintainer(this.client, actionUuid).handle().then(resolve).catch(reject);
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
      if (!this.editable) reject("User Hasn't The Permission To Edit The Chat");
      const actionUuid: string = v4();
      this.client.chat.emit(ChatSocketEvent.CHAT_EDIT, {
        uuid: actionUuid,
        chat: this.uuid,
        data: { description: description },
      });
      new ActionMaintainer(this.client, actionUuid).handle().then(resolve).catch(reject);
    });
  }
}
