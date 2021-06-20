import { SHA256 } from 'crypto-js';
import { ChatPreview } from '../chat';
import { Client, Credentials, Locale, UserPreview } from '../client';
import { AuthRequestManager, ChatRequestManager, UserRequestManager } from '../request';
import { ActionError, SocketEvent } from '../websocket';

const authManager: AuthRequestManager = new AuthRequestManager();
const userManager: UserRequestManager = new UserRequestManager();
const chatManager: ChatRequestManager = new ChatRequestManager();

/**
 * Login a user using the credentials
 *
 * @param credentials credentials of the user
 *
 * @returns Promise<string>
 */

export const loginUser = (credentials: Credentials): Promise<string> => {
  return new Promise((resolve, reject) => {
    authManager.sendRequest<'LOGIN'>('LOGIN', { body: credentials }).then(resolve).catch(reject);
  });
};

/**
 * Validate an auth token whether it's still valid
 *
 * @param token token to be validated
 *
 * @returns Promise<boolean>
 */

export const validateToken = (token: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    authManager
      .sendRequest<'VALIDATE'>('VALIDATE', { authorization: token })
      .then(resolve)
      .catch(reject);
  });
};

/**
 * Register a new user
 *
 * @param credentials credentials of the user
 *
 * @returns Promise<void>
 */

export const registerUser = ({ password, username }: Credentials): Promise<void> => {
  return new Promise((resolve, reject) => {
    userManager
      .sendRequest<'REGISTER'>('REGISTER', { body: { mail: username, password: password } })
      .then(resolve)
      .catch(reject);
  });
};

/**
 * Validate a register token
 *
 * @param token register token to be validated
 *
 * @returns Promise<boolean>
 */

export const validateRegister = (token: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    userManager
      .sendRequest<'REGISTER_VALIDATE'>('REGISTER_VALIDATE', { body: { token: token } })
      .then(resolve)
      .catch(reject);
  });
};

/**
 * Verify a register
 *
 * @param token register token
 *
 * @param data additional user data [name, tag, description, ...]
 *
 * @returns Promise<void>
 */

export const verifyRegister = (
  token: string,
  data: { name: string; tag: string; description: string; locale: Locale }
): Promise<void> => {
  return new Promise((resolve, reject) => {
    userManager
      .sendRequest<'REGISTER_VERIFY'>('REGISTER_VERIFY', {
        body: { token: token, ...data },
      })
      .then(resolve)
      .catch(reject);
  });
};

/**
 * Request a password reset
 *
 * @param mail mail address of the user
 *
 * @returns Promise<void>
 */

export const requestPasswordReset = (mail: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    userManager
      .sendRequest<'PASSWORD_RESET'>('PASSWORD_RESET', { body: { mail: mail } })
      .then(resolve)
      .catch(reject);
  });
};

/**
 * Validate a password reset token
 *
 * @param token password reset token to be validated
 *
 * @returns Promise<boolean>
 */

export const validatePasswordReset = (token: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    userManager
      .sendRequest<'PASSWORD_RESET_VALIDATE'>('PASSWORD_RESET_VALIDATE', {
        body: { token: token },
      })
      .then(resolve)
      .catch(reject);
  });
};

/**
 * Confirm a password reset and set a new password
 *
 * @param token password reset token
 *
 * @param password new password
 *
 * @returns Promise<void>
 */

export const confirmPasswordReset = (token: string, password: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    userManager
      .sendRequest<'PASSWORD_RESET_CONFIRM'>('PASSWORD_RESET_CONFIRM', {
        body: { token: token, password: password },
      })
      .then(resolve)
      .catch(reject);
  });
};

/**
 * Get a preview of an user without being logged in
 *
 * @param uuid uuid of the user
 *
 * @returns Promise<UserPreview>
 */

export const getUserPreview = (uuid: string): Promise<UserPreview> => {
  return new Promise((resolve, reject) => {
    userManager
      .sendRequest<'GET_PREVIEW'>('GET_PREVIEW', { uuid: uuid })
      .then((value: any) => resolve({ ...value, color: colorForUuid(uuid) }))
      .catch(reject);
  });
};

/**
 * Get the avatar of an user without being logged in
 *
 * @param uuid uuid of the user
 *
 * @returns Promise<Buffer>
 */

export const getUserAvatar = (uuid: string): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    userManager
      .sendRequest<'GET_AVATAR'>('GET_AVATAR', { uuid: uuid })
      .then((data: any) => resolve(Buffer.from(data)))
      .catch(reject);
  });
};

/**
 * Get a preview of a chat without being member or being logged in
 *
 * @param uuid uuid of the chat
 *
 * @returns Promise<ChatPreview>
 */

export const getChatPreview = (uuid: string): Promise<ChatPreview> => {
  return new Promise((resolve, reject) => {
    chatManager
      .sendRequest<'GET_PREVIEW'>('GET_PREVIEW', { uuid: uuid })
      .then((value: any) => resolve({ ...value, color: colorForUuid(uuid) }))
      .catch(reject);
  });
};

/**
 * Check whether a user has a given tag
 *
 * @param tag tag to check
 *
 * @returns Promise<boolean>
 */

export const checkUserTag = (tag: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    userManager
      .sendRequest<'CHECK_TAG'>('CHECK_TAG', { body: { tag: tag } })
      .then((value: any) => resolve(value))
      .catch(reject);
  });
};

/**
 * Check whether a user is already registered with a given mail address
 *
 * @param mail mail address to check
 *
 * @returns Promise<boolean>
 */

export const checkUserMail = (mail: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    userManager
      .sendRequest<'CHECK_MAIL'>('CHECK_MAIL', { body: { mail: mail } })
      .then((value: any) => resolve(value))
      .catch(reject);
  });
};

/**
 * Check whether a group has a given tag
 *
 * @param tag tag to check
 *
 * @returns Promise<boolean>
 */

export const checkGroupTag = (tag: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    chatManager
      .sendRequest<'CHECK_TAG'>('CHECK_TAG', { body: { tag: tag } })
      .then((value: any) => resolve(value))
      .catch(reject);
  });
};

/**
 * Function to create delays
 *
 * @param ms delay duration in milliseconds
 *
 * @returns Promise<void>
 */

export const delay = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(() => resolve, ms));
};

/**
 * Maintainer waiting for the right success/error socket
 *
 * @param client current client
 *
 * @param actionUuid uuid of the action
 *
 * @returns Promise<void>
 */

export const handleAction = (client: Client, actionUuid: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const handleSuccess = (uuid: string) => {
      if (actionUuid === uuid) {
        client.raw.removeListener(SocketEvent.ACTION_ERROR, handleError);
        client.raw.removeListener(SocketEvent.ACTION_SUCCESS, handleSuccess);
        resolve();
      }
    };

    const handleError = ({ uuid, ...error }: ActionError) => {
      if (actionUuid === uuid) {
        client.raw.removeListener(SocketEvent.ACTION_ERROR, handleError);
        client.raw.removeListener(SocketEvent.ACTION_SUCCESS, handleSuccess);
        reject(error);
      }
    };

    client.raw.on(SocketEvent.ACTION_ERROR, handleError);
    client.raw.on(SocketEvent.ACTION_SUCCESS, handleSuccess);
  });
};

/**
 * Function to get the hex value for a specific uuid
 *
 * @param uuid uuid
 *
 * @returns string
 */

export const colorForUuid = (uuid: string): string => {
  const h = parseInt(Number('0x' + SHA256(uuid).toString().substr(0, 6)).toString(), 10) / 16777215; // h / 360
  const s = 1; // s / 100
  const l = 0.65; // l / 100

  const convertHue = (p: number, q: number, t: number): number => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;

  const [r, g, b]: Array<number> = [
    convertHue(p, q, h + 1 / 3),
    convertHue(p, q, h),
    convertHue(p, q, h - 1 / 3),
  ].map((x: number) => Math.round(x * 255));
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};
