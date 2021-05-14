import { AdminConstructor, Permission } from '../types/Admin.types';
import { Member } from './Member.class';

export class Admin extends Member {
  /**
   * Date when the member was promoted
   */

  public readonly promotedAt: Date;

  /**
   * Permissions of the admin
   */

  public readonly permissions: Array<Permission>;

  constructor(constructor: AdminConstructor) {
    super(constructor);
    this.promotedAt = new Date(constructor.promotedAt);
    this.permissions = constructor.permissions;
  }

  /**
   * Boolean whether the admin can ban group members
   */

  public get canBan(): boolean {
    return this.permissions.includes(Permission.BAN);
  }

  /**
   * Boolean whether the admin can unban banned members
   */

  public get canUnban(): boolean {
    return this.permissions.includes(Permission.UNBAN);
  }

  /**
   * Boolean whether the admin can edit the group
   */

  public get canEditGroup(): boolean {
    return this.permissions.includes(Permission.GROUP_EDIT);
  }

  /**
   * Boolean whether the admin can edit group members
   */

  public get canEditMembers(): boolean {
    return this.permissions.includes(Permission.MEMBER_EDIT);
  }

  /**
   * Boolean whether the admin can kick group members
   */

  public get canKick(): boolean {
    return this.permissions.includes(Permission.KICK);
  }
}
