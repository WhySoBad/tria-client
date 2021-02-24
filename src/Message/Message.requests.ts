import axios from 'axios';
import { config } from '../config';
axios({
  baseURL: config.url,
  url: '/message',
  transformResponse: [(data, headers) => data],
});

export const getMessage = () => {};
