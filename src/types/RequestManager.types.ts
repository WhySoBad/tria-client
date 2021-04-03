export interface RequestManagerRequest {
  /**
   * Path of the request
   */

  path: string;

  /**
   * Method of the request
   */

  method: 'GET' | 'POST';
}

export interface RequestManagerProps {
  /**
   * Suburl of the manager e.g. "auth"
   */

  suburl?: string;
}
