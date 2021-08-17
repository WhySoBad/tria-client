import { RequestManager } from './RequestManager.class';

interface AuthRequests {
  LOGIN: { body: { username: string; password: string } };
  VALIDATE: { authorization: string };
}

/**
 * AuthRequestManager class to easily send auth requets
 */

export class AuthRequestManager extends RequestManager<AuthRequests> {
  constructor() {
    super({ suburl: 'auth' });
    this.addRequest<'LOGIN'>('LOGIN', 'login', 'POST');
    this.addRequest<'VALIDATE'>('VALIDATE', 'validate', 'GET');
  }
}
