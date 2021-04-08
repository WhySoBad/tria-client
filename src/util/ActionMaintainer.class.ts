import { Client } from '../client';
import { ActionError, SocketEvent } from '../websocket';

export class ActionMaintainer {
  constructor(private client: Client, private uuid: string) {}

  /**
   * Maintainer waiting for the right success/error socket
   *
   * @returns Promise<void>
   */

  public handle(): Promise<void> {
    return new Promise((resolve, reject) => {
      const handleSuccess = (uuid: string) => {
        if (uuid === this.uuid) {
          this.client.raw.removeListener(SocketEvent.ACTION_ERROR, handleError);
          this.client.raw.removeListener(SocketEvent.ACTION_SUCCESS, handleSuccess);
          resolve();
        }
      };

      const handleError = ({ uuid, ...error }: ActionError) => {
        if (uuid === this.uuid) {
          this.client.raw.removeListener(SocketEvent.ACTION_ERROR, handleError);
          this.client.raw.removeListener(SocketEvent.ACTION_SUCCESS, handleSuccess);
          reject(error);
        }
      };

      this.client.raw.on(SocketEvent.ACTION_ERROR, handleError);
      this.client.raw.on(SocketEvent.ACTION_SUCCESS, handleSuccess);
    });
  }
}
