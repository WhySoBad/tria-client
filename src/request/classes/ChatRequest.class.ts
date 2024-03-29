import { GroupRole, GroupType } from '../../chat';
import { RequestManager } from './RequestManager.class';

interface ChatRequests {
  CREATE_GROUP: {
    body: {
      name: string;
      tag: string;
      description: string;
      type: GroupType;
      members: Array<{ uuid: string; role: GroupRole }>;
    };
    authorization: string;
  };
  CREATE_PRIVATE: { body: { user: string }; authorization: string };
  GET: { uuid: string; authorization: string };
  GET_PREVIEW: { uuid: string };
  DELETE: { uuid: string; authorization: string };
  JOIN: { uuid: string; authorization: string };
  LEAVE: { uuid: string; authorization: string };
  ADMIN_BAN: { uuid: string; body: { uuid: string }; authorization: string };
  ADMIN_UNBAN: { uuid: string; body: { uuid: string }; authorization: string };
  ADMIN_KICK: { uuid: string; body: { uuid: string }; authorization: string };
  FETCH_MESSAGES: { uuid: string; timestamp: number; amount: string; authorization: string };
  CHECK_TAG: { tag: string };
  LAST_READ: { uuid: string; timestamp: number; authorization: string };
  GET_AVATAR: { uuid: string };
  UPLOAD_AVATAR: { uuid: string; authorization: string; body: { formData: FormData } };
  DELETE_AVATAR: { uuid: string; authorization: string };
  READ_MESSAGES: { uuid: string; timestamp: number; authorization: string };
}

/**
 * ChatRequestManager class to easily send chat requests
 */

export class ChatRequestManager extends RequestManager<ChatRequests> {
  constructor() {
    super({ suburl: 'chat' });
    this.addRequest<'CREATE_GROUP'>('CREATE_GROUP', 'create/group', 'POST');
    this.addRequest<'CREATE_PRIVATE'>('CREATE_PRIVATE', 'create/private', 'POST');
    this.addRequest<'GET'>('GET', '%uuid', 'GET');
    this.addRequest<'GET_PREVIEW'>('GET_PREVIEW', '%uuid/preview', 'GET');
    this.addRequest<'DELETE'>('DELETE', '%uuid/delete', 'DELETE');
    this.addRequest<'JOIN'>('JOIN', '%uuid/join', 'POST');
    this.addRequest<'LEAVE'>('LEAVE', '%uuid/leave', 'POST');
    this.addRequest<'ADMIN_BAN'>('ADMIN_BAN', '%uuid/admin/ban', 'POST');
    this.addRequest<'ADMIN_UNBAN'>('ADMIN_UNBAN', '%uuid/admin/unban', 'POST');
    this.addRequest<'ADMIN_KICK'>('ADMIN_KICK', '%uuid/admin/kick', 'POST');
    this.addRequest<'FETCH_MESSAGES'>(
      'FETCH_MESSAGES',
      '%uuid/messages/get/%timestamp/%amount',
      'GET'
    );
    this.addRequest<'CHECK_TAG'>('CHECK_TAG', 'check/tag/%tag', 'GET');
    this.addRequest<'LAST_READ'>('LAST_READ', '%uuid/messages/read/%timestamp', 'GET');
    this.addRequest<'GET_AVATAR'>('GET_AVATAR', '%uuid/avatar', 'GET');
    this.addRequest<'UPLOAD_AVATAR'>('UPLOAD_AVATAR', '%uuid/avatar/upload', 'POST');
    this.addRequest<'DELETE_AVATAR'>('DELETE_AVATAR', '%uuid/avatar/delete', 'DELETE');
    this.addRequest<'READ_MESSAGES'>('READ_MESSAGES', '%uuid/messages/read/%timestamp', 'GET');
  }
}
