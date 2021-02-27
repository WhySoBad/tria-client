import { Chat } from '.';
import { GroupConstructor } from '../types';

export class Group extends Chat {
  private _name: string;
  private _tag: string;
  private _description: string;

  constructor(props: GroupConstructor) {
    super(props);
    this._name = props.name as any;
    this._tag = props.tag as any;
    this._description = props.description as any;
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
    return false;
  }

  /**
   * Edit the name of the group
   * @param name new name of the group
   * @returns Promise<void>
   */

  public setName(name: string): Promise<void> {
    return new Promise((resolve, reject) => {});
  }

  /**
   * Edit the tag of the group
   * @param tag new tag of the group
   * @returns Promise<void>
   */

  public setTag(tag: string): Promise<void> {
    return new Promise((resolve, reject) => {});
  }

  /**
   * Edit the description of the group
   * @param description new description of the group
   * @returns Promise<void>
   */

  public setDescription(description: string): Promise<void> {
    return new Promise((resolve, reject) => {});
  }
}
