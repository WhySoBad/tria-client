import axios from 'axios';
import { config } from '../config';
import { ClientUserProps, Credentials } from '../types';

const { url } = config;

axios({ baseURL: url });

export const login = ({ username, password }: Credentials): Promise<string> => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${url}/auth/login`, {
        username: username,
        password: password,
      })
      .then(({ data }) => resolve(data))
      .catch(({ response }) => reject(response?.data?.message));
  });
};

export const validate = (token: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${url}/auth/validate`, { headers: { Authorization: `Bearer ${token}` } })
      .then(({ data }) => resolve(data))
      .catch(({ response }) => reject(response?.data?.message));
  });
};

export const logout = (token: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${url}/auth/logout`, { headers: { Authorization: `Bearer ${token}` } })
      .then(({ data }) => resolve(data))
      .catch(({ response }) => reject(response?.data?.message));
  });
};

export const get = (token: string): Promise<ClientUserProps> => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${url}/user/get`, { headers: { Authorization: `Bearer ${token}` } })
      .then(({ data }) => resolve(data))
      .catch(({ response }) => reject(response?.data?.message));
  });
};
