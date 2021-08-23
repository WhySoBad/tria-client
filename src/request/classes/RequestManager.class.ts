import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { Logger } from '../../util';
import { config } from '../../util/config';
import { RequestManagerProps, RequestManagerRequest } from '../types/RequestManager.types';

const baseurl = config.apiUrl;

/**
 * RequestManager class
 *
 * Base class for all request classes with functions to add requests
 *
 * and send typesafe request without creating requests with axios
 *
 */

/** @internal */

export abstract class RequestManager<
  T extends { [key: string]: any } & (T[keyof T] extends void | object
    ? {}
    : 'Values can only be object or undefined')
> {
  private _logging: boolean = false;

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
   * @param name name of the request
   *
   * @param path path of the request e.g. "login" when the suburl is set to "auth" [fires auth/login]
   *
   * @param method method of the request ["GET", "POST"]
   *
   * @param options options for the request which are constant
   *
   * @returns void
   */

  protected addRequest<K extends keyof T>(
    name: K,
    path: string,
    method: 'POST' | 'GET' | 'DELETE' | 'PUT',
    options: AxiosRequestConfig = {}
  ): void {
    this._requests[name as string] = {
      path: path,
      method: method,
      options: options,
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
      let { method, path, options = {} }: RequestManagerRequest = this._requests[name as string];
      Object.entries((props as object) || {}).forEach(([key, value]) => {
        if (
          key.toLowerCase() !== 'token' &&
          key.toLowerCase() !== 'authorization' &&
          key.toLowerCase() !== 'body'
        ) {
          path = path.replace(`%${key}`, `${value}`);
        }
      });

      const token: string | null = (props && props.authorization) || null;
      config.headers = { ...config.headers, ...options, Authorization: `Bearer ${token}` };
      switch (method) {
        case 'POST': {
          this._instance
            .post(
              path,
              props.body.formData ? props.body.formData : (props && props.body) || {},
              config
            )
            .then(resolve)
            .then(() => this._logging && Logger.Request(name))
            .catch(reject);
          break;
        }
        case 'PUT': {
          this._instance
            .put(
              path,
              props.body.formData ? props.body.formData : (props && props.body) || {},
              config
            )
            .then(resolve)
            .then(() => this._logging && Logger.Request(name))
            .catch(reject);
          break;
        }
        case 'DELETE': {
          this._instance
            .delete(path, config)
            .then(resolve)
            .then(() => this._logging && Logger.Request(name))
            .catch(reject);
          break;
        }
        case 'GET': {
          this._instance
            .get(path, config)
            .then(resolve)
            .then(() => this._logging && Logger.Request(name))
            .catch(reject);
          break;
        }
      }
    });
  }

  /**
   * Url of the manager [including suburl]
   */

  public get url(): string {
    return this._url;
  }

  /**
   * Function to enable request logging
   */

  public enableLogging(): void {
    this._logging = true;
  }
}
