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
    this.promotedAt = constructor.promotedAt;
    this.permissions = constructor.permissions;
  }
}
