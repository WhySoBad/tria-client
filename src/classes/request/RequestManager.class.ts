import axios, { AxiosError, AxiosInstance, AxiosResponse, AxiosRequestConfig } from 'axios';
import { config } from '../../config';
import { RequestManagerProps, RequestManagerRequest } from '../../types/RequestManager.types';

const baseurl = config.url;

/**
 * RequestManager class
 *
 * Base class for all request classes with functions to add requests
 *
 * and send typesafe request without creating requests with axios
 */

export abstract class RequestManager<
  T extends { [key: string]: any } & (T[keyof T] extends void | object
    ? {}
    : 'Values can only be object or undefined')
> {
  private _url: string;

  private _instance: AxiosInstance;

  private _requests: { [name: string]: RequestManagerRequest } = {};

  constructor({ suburl }: RequestManagerProps) {
    this._url = suburl ? `${baseurl}/${suburl}` : baseurl;
    this._instance = axios.create({
      baseURL: this._url,
      timeoutErrorMessage: 'Timed Out',
    });
    this._instance.interceptors.response.use(
      (response: AxiosResponse) => response.data,
      (error: AxiosError) => {
        if (!error.response) return Promise.reject('Timed Out');
        else return Promise.reject(error?.response?.data?.message);
      }
    );
    this._instance.post;
  }

  /**
   * Add a new request to the manager
   *
   * @param path path of the request e.g. "login" when the suburl is set to "auth" [fires auth/login]
   *
   * @param method method of the request ["GET", "POST"]
   *
   * @returns void
   */

  protected addRequest(name: keyof T, path: string, method: 'POST' | 'GET'): void {
    this._requests[name as string] = {
      path: path,
      method: method,
    };
  }

  /**
   * Send a specific request to the backend server
   *
   * @param request name of the request [same string as the generic type K]
   *
   * @param options RequestOptions
   *
   * @returns Promise<any>
   */

  public sendRequest<K extends keyof T>(
    name: K,
    props: T[K] extends void ? null : T[K],
    config: AxiosRequestConfig = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this._requests[name as string]) {
        throw new Error("Request hasn't been added yet");
      }
      let { method, path }: RequestManagerRequest = this._requests[name as string];
      Object.entries((props as object) || {}).forEach(([key, value]) => {
        if (
          key.toLowerCase() != 'token' &&
          key.toLowerCase() != 'authorization' &&
          key.toLowerCase() != 'body'
        ) {
          path = path.replace(`%${key}`, `${value}`);
        }
      });
      const token: string | null = (props && props.token) || null;
      config.headers = { ...config.headers, Authorization: `Bearer ${token}` };
      if (method === 'POST') {
        this._instance
          .post(path, (props && props.body) || {}, config)
          .then(resolve)
          .catch(reject);
      } else this._instance.get(path, config).then(resolve).catch(reject);
    });
  }

  /**
   * Url of the manager [including suburl]
   */

  public get url(): string {
    return this._url;
  }
}
