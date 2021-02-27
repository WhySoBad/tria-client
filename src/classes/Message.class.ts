import { Chat } from '.';
import * as requests from '../requests/Message.requests';
import { ClientEvent, MessageContstructor } from '../types';
import { Client } from './client';

/**
 * Message instance
 *
 * @see documentation reference
 */

export class Message {
  /**
   * Current client
   */

  public readonly client: Client;

  /**
   * Uuid of the message
   */

  public readonly uuid: string;

  /**
   * Uuid of the chat the message is in
   */

  public readonly chat: Chat;

  /**
   * Date when the message was created
   */

  public readonly createdAt: Date;

  /**
   * Uuid of the user who created the message
   */

  public readonly user: string;

  private _editedAt: Date | null;

  private _edited: number;

  private _text: string;

  private _pinned: boolean;

  constructor(client: Client, props: MessageContstructor) {
    this.client = client;
    this.uuid = props.uuid;
    this.chat = props.chat;
    this.createdAt = props.createdAt;
    this.user = props.user;
    this._editedAt = props.editedAt;
    this._edited = props.edited;
    this._text = props.text;
    this._pinned = props.pinned;
  }

  /**
   * Date when the message was the last time edited
   */

  public get editedAt(): Date | null {
    return this._editedAt;
  }

  /**
   * Number how often the message was edited
   */

  public get edited(): number {
    return this._edited;
  }

  /**
   * Text of the message
   */

  public get text(): string {
    return this._text;
  }

  /**
   * Boolean whether the message is pinned or not
   */

  public get pinned(): boolean {
    return this._pinned;
  }

  /**
   * Boolean wether the message can be edited or not
   *
   * Since only the creator of the message can edit the message the default value is false
   *
   * @default false
   */

  public get editable(): boolean {
    return this.user == this.client.user.uuid;
  }

  /**
   * Boolean wether the message can be pinned or not
   *
   * Since only admins can pin messages the default value is false
   *
   * @default false
   */

  public get pinnable(): boolean {
    //TODO: Admins and permissions -> check for existing "pin" permission
    return false;
  }

  /**
   * Edit the text of the message
   *
   * @param text new text of the message
   *
   * @returns Promise<void>
   */

  public setText(text: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.editable) reject('User Is Not Allowed To Edit');
      this.client.emit(ClientEvent.MESSAGE_EDIT, { message: this.uuid, text: text } as any);
      this.client.once(ClientEvent.MESSAGE_EDIT, (message) => {
        if (message.message == this.uuid) {
          this._text = message.text;
          resolve();
        }
      });
    });
  }

  /**
   * Pin the message
   *
   * @returns Promise<void>
   */

  public pin(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this._pinned) reject('Message Is Already Pinned');
      this.client.emit(ClientEvent.MESSAGE_EDIT, { message: this.uuid, pinned: true } as any);
      this.client.once(ClientEvent.MESSAGE_EDIT, (message) => {
        if (message.message == this.uuid) {
          this._pinned = message.pinned;
          resolve();
        }
      });
    });
  }

  /**
   * Unpin the message
   *
   * @returns Promise<void>
   */

  public unpin(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this._pinned) reject('Message Is Not Pinned');
      this.client.emit(ClientEvent.MESSAGE_EDIT, { message: this.uuid, pinned: false } as any);
      this.client.once(ClientEvent.MESSAGE_EDIT, (message) => {
        if (message.message == this.uuid) {
          this._pinned = message.pinned;
          resolve();
        }
      });
    });
  }
}
