import { Logger } from '../Logger.class';
import { RequestManager } from './RequestManager.class';

interface Test {
  LOGIN: { body: { username: string; password: string } };
  GET_USER: { body: object; uuid: string; token: string };
  RESET: void;
}

enum AuthRequests {
  'LOGIN' = 'LOGIN',
  'RESET' = 'RESET',
}

export class AuthRequest extends RequestManager<Test> {
  constructor() {
    super({ suburl: 'auth' });
    this.addRequest('GET_USER', 'login', 'POST');
    this.addRequest('LOGIN', 'login', 'POST');
  }
}

const auth: AuthRequest = new AuthRequest();
auth
  .sendRequest<AuthRequests.LOGIN>(AuthRequests.LOGIN, {
    body: { username: 'asdf@gmail.com', password: 'bruhh' },
  })
  .then((data) => Logger.Info(data))
  .catch((error) => Logger.Error(error));
