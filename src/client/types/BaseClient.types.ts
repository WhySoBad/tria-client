import { Credentials } from '.';

export interface BaseClientConstructor {
  /**
   * Auth method
   *
   * JWT Token or credentials
   */

  auth: string | Credentials;

  /**
   * Boolean whether logs are enabled
   */

  logging: boolean;
}
