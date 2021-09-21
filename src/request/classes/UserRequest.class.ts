import { Locale } from '../../client';
import { RequestManager } from './RequestManager.class';

interface UserRequests {
  REGISTER: { body: { mail: string; password: string } };
  REGISTER_VALIDATE: { token: string };
  REGISTER_VERIFY: {
    body: { token: string; name: string; tag: string; description: string; locale: Locale };
  };
  EDIT: {
    authorization: string;
    body: { name?: string; tag?: string; description?: string; locale?: Locale };
  };
  PASSWORD_CHANGE: { authorization: string; body: { old: string; new: string } };
  PASSWORD_RESET: { body: { mail: string } };
  PASSWORD_RESET_VALIDATE: { token: string };
  PASSWORD_RESET_CONFIRM: { body: { token: string; password: string } };
  DELETE: { authorization: string };
  GET_CURRENT: { authorization: string };
  GET_PREVIEW: { uuid: string };
  GET_AVATAR: { uuid: string };
  UPLOAD_AVATAR: { authorization: string; body: { formData: FormData } };
  DELETE_AVATAR: { authorization: string };
  CHECK_TAG: { tag: string };
  CHECK_MAIL: { mail: string };
}

/**
 * UserRequestManager class to easily send user requests
 */

export class UserRequestManager extends RequestManager<UserRequests> {
  constructor() {
    super({ suburl: 'user' });
    this.addRequest<'DELETE'>('DELETE', 'delete', 'DELETE');
    this.addRequest<'REGISTER'>('REGISTER', 'register', 'POST');
    this.addRequest<'REGISTER_VALIDATE'>('REGISTER_VALIDATE', 'register/validate/%token', 'GET');
    this.addRequest<'REGISTER_VERIFY'>('REGISTER_VERIFY', 'register/verify', 'POST');
    this.addRequest<'EDIT'>('EDIT', 'edit', 'PUT');
    this.addRequest<'PASSWORD_CHANGE'>('PASSWORD_CHANGE', 'password/change', 'PUT');
    this.addRequest<'PASSWORD_RESET'>('PASSWORD_RESET', 'password/reset', 'POST');
    this.addRequest<'PASSWORD_RESET_VALIDATE'>(
      'PASSWORD_RESET_VALIDATE',
      'password/reset/validate/%token',
      'GET'
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
    this.addRequest<'DELETE_AVATAR'>('DELETE_AVATAR', 'avatar/delete', 'DELETE');
    this.addRequest<'CHECK_TAG'>('CHECK_TAG', 'check/tag/%tag', 'GET');
    this.addRequest<'CHECK_MAIL'>('CHECK_MAIL', 'check/mail/%mail', 'GET');
  }
}
