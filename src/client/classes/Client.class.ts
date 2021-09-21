import { ClientConstructor } from '../types';
import { BaseClient } from './BaseClient.class';

/**
 * Instance of the logged in user
 */

export class Client extends BaseClient {
  /**
   * Initialize new user client
   *
   * @param constructor ClientConstructor
   */

  constructor({ credentials, log, token }: ClientConstructor) {
    if (!token && !credentials) throw new Error('Missing token or credentials');
    super({ auth: credentials || token || '', logging: !!log });
    this._client = this;
  }
}
