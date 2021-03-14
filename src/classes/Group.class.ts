import { Chat } from '.';
import { ChatEdit, ChatSocketEvent, GroupConstructor } from '../types';
import { Admin } from './Admin.class';
import { Client } from './client';

export class Group extends Chat {
  private _name: string;

  private _tag: string;

  private _description: string;

  private _admins: Map<string, Admin> = new Map<string, Admin>();

  constructor(client: Client, props: GroupConstructor) {
    super(client, props);
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
    return true;
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
      this.client.chat.emit(ChatSocketEvent.CHAT_EDIT, { chat: this.uuid, data: { name: name } });
      const handler: (chat: ChatEdit) => void = (chat: ChatEdit) => {
        if (chat.uuid == this.uuid && chat.name == name) {
          this._name = chat.name as any;
          this.client.removeListener(ChatSocketEvent.CHAT_EDIT, handler);
          resolve();
        }
      };
      this.client.on(ChatSocketEvent.CHAT_EDIT, handler);
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
      this.client.chat.emit(ChatSocketEvent.CHAT_EDIT, { chat: this.uuid, data: { tag: tag } });
      const handler: (chat: ChatEdit) => void = (chat: ChatEdit) => {
        if (chat.uuid == this.uuid && chat.tag == tag) {
          this._tag = chat.tag as any;
          this.client.removeListener(ChatSocketEvent.CHAT_EDIT, handler);
          resolve();
        }
      };
      this.client.on(ChatSocketEvent.CHAT_EDIT, handler);
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
      this.client.chat.emit(ChatSocketEvent.CHAT_EDIT, {
        chat: this.uuid,
        data: { description: description },
      });
      const handler: (chat: ChatEdit) => void = (chat: ChatEdit) => {
        if (chat.uuid == this.uuid && chat.description == description) {
          this._description = chat.description as any;
          this.client.removeListener(ChatSocketEvent.CHAT_EDIT, handler);
          resolve();
        }
      };
      this.client.on(ChatSocketEvent.CHAT_EDIT, handler);
    });
  }
}
