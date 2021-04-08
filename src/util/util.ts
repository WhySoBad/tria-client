import { ChatPreview } from '../chat';
import { Credentials, Locale, UserPreview } from '../client';
import { ChatRequestManager, UserRequestManager } from '../request';

const userManager: UserRequestManager = new UserRequestManager();
const chatManager: ChatRequestManager = new ChatRequestManager();

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
      .sendRequest<'GET_PREVIEW'>('GET_PREVIEW', { body: { uuid: uuid } })
      .then(resolve)
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
      .then(resolve)
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
