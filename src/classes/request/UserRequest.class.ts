import { Locale } from '../../types';
import { RequestManager } from './RequestManager.class';

interface UserRequests {
  DELETE: { authorization: string };
  REGISTER: {
    body: {
      name: string;
      tag: string;
      mail: string;
      password: string;
      description: string;
      avatar: string;
      locale: Locale;
    };
  };
  GET: { uuid: string };
  GET_CURRENT: { authorization: string };
  VERIFY: { uuid: string };
  EDIT: {
    authorization: string;
    body: { name?: string; tag?: string; avatar?: string; description?: string; locale?: Locale };
  };
}

/**
 * UserRequestManager class to easily send user requests
 */

export class UserRequestManager extends RequestManager<UserRequests> {
  constructor() {
    super({ suburl: 'user' });
    this.addRequest<'DELETE'>('DELETE', 'delete', 'GET');
    this.addRequest<'REGISTER'>('REGISTER', 'register', 'POST');
    this.addRequest<'GET'>('GET', 'get/%uuid', 'GET');
    this.addRequest<'GET_CURRENT'>('GET_CURRENT', 'get', 'GET');
    this.addRequest<'VERIFY'>('VERIFY', 'verify/%uuid', 'GET');
    this.addRequest<'EDIT'>('EDIT', 'edit', 'POST');
  }
}
