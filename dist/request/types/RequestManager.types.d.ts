import { AxiosRequestConfig } from 'axios';
export interface RequestManagerRequest {
    path: string;
    method: 'POST' | 'GET' | 'DELETE' | 'PUT';
    options?: AxiosRequestConfig;
}
export interface RequestManagerProps {
    suburl?: string;
}
