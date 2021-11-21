import axios, { AxiosResponse } from 'axios';

export function apiCall(
  action: 'get' | 'post' | 'put' | 'patch' | 'delete',
  url: string,
  params?: Record<string, unknown>
): Promise<AxiosResponse> {
  return axios[action](url, params);
}
