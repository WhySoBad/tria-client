import axios from 'axios';
import { config } from '../config';

const { url } = config;

axios({ baseURL: url });

export interface ClientUserEdit {
  name?: string;
  tag?: string;
  avatar?: string;
  description?: string;
  locale?: string;
}

export const edit = (token: string, params: ClientUserEdit): Promise<void> => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${url}/user/edit`, params, { headers: { Authorization: `Bearer ${token}` } })
      .then(() => resolve())
      .catch(({ response }) => reject(response?.data?.message));
  });
};
