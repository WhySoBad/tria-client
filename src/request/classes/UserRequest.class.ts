import { Locale } from '../../client';
import { RequestManager } from './RequestManager.class';

interface UserRequests {
  REGISTER: {
    body: { mail: string; password: string };
  };
  REGISTER_VALIDATE: { body: { token: string } };
  REGISTER_VERIFY: {
    body: { token: string; name: string; tag: string; description: string; locale: Locale };
  };
  EDIT: {
    authorization: string;
    body: { name?: string; tag?: string; description?: string; locale?: Locale };
  };
  PASSWORD_CHANGE: {
    authorization: string;
    body: { old: string; new: string };
  };
  PASSWORD_RESET: { body: { mail: string } };
  PASSWORD_RESET_VALIDATE: { body: { token: string } };
  PASSWORD_RESET_CONFIRM: { body: { token: string; password: string } };
  DELETE: { authorization: string };
  GET_CURRENT: { authorization: string };
  GET_PREVIEW: { body: { uuid: string } };
  GET_AVATAR: { uuid: string };
  UPLOAD_AVATAR: { authorization: string; body: { formData: FormData } }; //TODO: Look after how to upload formdata with axios and implement it into the manager
  DELETE_AVATAR: { authorization: string };
}

/**
 * UserRequestManager class to easily send user requests
 */

export class UserRequestManager extends RequestManager<UserRequests> {
  constructor() {
    super({ suburl: 'user' });
    this.addRequest<'DELETE'>('DELETE', 'delete', 'GET');
    this.addRequest<'REGISTER'>('REGISTER', 'register', 'POST');
    this.addRequest<'REGISTER_VALIDATE'>('REGISTER_VALIDATE', 'register/validate', 'POST');
    this.addRequest<'REGISTER_VERIFY'>('REGISTER_VERIFY', 'register/verify', 'POST');
    this.addRequest<'EDIT'>('EDIT', 'edit', 'POST');
    this.addRequest<'PASSWORD_CHANGE'>('PASSWORD_CHANGE', 'password/change', 'POST');
    this.addRequest<'PASSWORD_RESET'>('PASSWORD_RESET', 'password/reset', 'POST');
    this.addRequest<'PASSWORD_RESET_VALIDATE'>(
      'PASSWORD_RESET_VALIDATE',
      'password/reset/validate',
      'POST'
    );
    this.addRequest<'PASSWORD_RESET_CONFIRM'>(
      'PASSWORD_RESET_CONFIRM',
      'password/reset/confirm',
      'POST'
    );
    this.addRequest<'GET_PREVIEW'>('GET_PREVIEW', '%uuid', 'GET');
    this.addRequest<'GET_CURRENT'>('GET_CURRENT', 'current', 'GET');
    this.addRequest<'GET_AVATAR'>('GET_AVATAR', '%uuid/avatar', 'GET', { responseType: 'blob' });
    this.addRequest<'UPLOAD_AVATAR'>('UPLOAD_AVATAR', 'avatar/upload', 'POST');
    this.addRequest<'DELETE_AVATAR'>('DELETE_AVATAR', 'avatar/delete', 'GET');
  }
}
