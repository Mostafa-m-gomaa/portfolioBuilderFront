import axios, { AxiosError } from 'axios';
import type { ApiErrorPayload } from '@/types/auth.types';

const API_BASE_URL = 'http://localhost:5000';
export const TOKEN_STORAGE_KEY = 'auth_token';

let onUnauthorized: (() => void) | null = null;

export const setUnauthorizedHandler = (handler: (() => void) | null) => {
  onUnauthorized = handler;
};

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorPayload>) => {
    if (error.response?.status === 401 && onUnauthorized) {
      onUnauthorized();
    }
    return Promise.reject(error);
  },
);

export const parseApiError = (error: unknown, fallback = 'Something went wrong') => {
  if (axios.isAxiosError<ApiErrorPayload>(error)) {
    const apiMessage = error.response?.data?.message || error.response?.data?.error;
    if (apiMessage) return apiMessage;
    if (error.message) return error.message;
  }
  if (error instanceof Error) return error.message;
  return fallback;
};

