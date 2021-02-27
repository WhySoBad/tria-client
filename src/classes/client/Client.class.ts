import { ClientConstructor } from '../../types';
import * as requests from '../../requests/Client.requests';
import { Logger } from '..';
import { BaseClient } from './BaseClient.class';

/**
 * Instance of the logged in user
 */

export class Client extends BaseClient {
  private logger: boolean;

  /**
   * Initialize new user client
   *
   * @param constructor ClientConstructor
   */

  constructor(props: ClientConstructor) {
    super(props.credentials || props.token || '');
    this.logger = !!props.log;
    this.logger && Logger.Info('Client initialized');
  }
}
