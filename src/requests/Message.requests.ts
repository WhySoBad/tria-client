import axios from 'axios';
import { config } from '../config';

const { url } = config;

axios({ baseURL: url });

export interface MessageEdit {
  uuid: string;
  text?: string;
  pinned?: boolean;
}

export const get = (token: string, params: MessageEdit): Promise<void> => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${url}/user/get`, params, { headers: { Authorization: `Bearer ${token}` } })
      .then(() => resolve())
      .catch(({ response }) => reject(response?.data?.message));
  });
};
