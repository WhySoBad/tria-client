import axios, { AxiosError, AxiosRequestConfig, CancelToken, CancelTokenSource } from 'axios';
import { Logger } from '../classes';
import { config } from '../config';
import { ClientUserConstructor, Credentials } from '../types';

const { url } = config;

const cancelToken: CancelTokenSource = axios.CancelToken.source();

axios({ baseURL: url, timeoutErrorMessage: 'Timed Out', cancelToken: cancelToken.token }).catch(
  (reason: AxiosError) => {
    if (reason.code === 'ECONNREFUSED') {
      Logger.Error(`Unable To Connect To Server [${reason.message}]`);
      process.exit(0);
    }
  }
);

axios.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (!error.response) return 'Timed Out';
    else return error.response.data.message;
  }
);

export const login = ({ username, password }: Credentials): Promise<string> => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${url}/auth/login`, {
        username: username,
        password: password,
      })
      .then(resolve as any)
      .catch(reject);
  });
};

export const validate = (token: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${url}/auth/validate`, { headers: { Authorization: `Bearer ${token}` } })
      .then(resolve as any)
      .catch(reject);
  });
};

export const logout = (token: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${url}/auth/logout`, { headers: { Authorization: `Bearer ${token}` } })
      .then(resolve as any)
      .catch(reject);
  });
};

export const get = (token: string): Promise<ClientUserConstructor> => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${url}/user/get`, { headers: { Authorization: `Bearer ${token}` } })
      .then(resolve as any)
      .catch(reject);
  });
};
