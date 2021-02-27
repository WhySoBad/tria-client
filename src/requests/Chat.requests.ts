import axios from 'axios';
import { config } from '../config';
axios({
  baseURL: config.url,
  url: '/chats',
  transformResponse: [(data, headers) => data],
});

export const getChat = async (uuid: string): Promise<void> => {};
