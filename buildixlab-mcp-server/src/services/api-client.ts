import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios';
import { API_BASE_URL } from '../constants';

const RETRYABLE_NETWORK_ERRORS = ['ECONNRESET', 'ETIMEDOUT', 'ECONNABORTED', 'EPIPE', 'EAI_AGAIN'];
const MAX_RETRIES = 3;
const BASE_DELAY_MS = 1000;

export class BuildixLabClient {
  private client: AxiosInstance;
  private token: string | null = null;
  private refreshCallback: (() => Promise<string>) | null = null;

  constructor(baseURL?: string) {
    this.client = axios.create({
      baseURL: baseURL || API_BASE_URL,
      timeout: 30000,
      headers: { 'Content-Type': 'application/json' }
    });

    this.client.interceptors.request.use((config) => {
      console.error('[BuildixLab]', config.method?.toUpperCase(), config.url);
      if (this.token) {
        config.headers.Authorization = `Bearer ${this.token}`;
      }
      return config;
    });

    this.client.interceptors.response.use(
      (response) => {
        console.error('[BuildixLab]', response.status, response.config.url, response.config.method?.toUpperCase());
        return response;
      },
      async (error: AxiosError) => {
        // Retry on 5xx or retryable network errors with exponential backoff
        if (this.isRetryable(error)) {
          const config = error.config;
          if (config) {
            const retryCount = (config as AxiosRequestConfig & { __retryCount?: number }).__retryCount || 0;
            if (retryCount < MAX_RETRIES) {
              (config as AxiosRequestConfig & { __retryCount?: number }).__retryCount = retryCount + 1;
              const delay = BASE_DELAY_MS * Math.pow(2, retryCount); // 1s, 2s, 4s
              await new Promise(resolve => setTimeout(resolve, delay));
              return this.client.request(config);
            }
          }
        }

        if (error.response?.status === 401) {
          if (this.refreshCallback) {
            try {
              const newToken = await this.refreshCallback();
              this.token = newToken;
              const originalRequest = error.config!;
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return this.client.request(originalRequest);
            } catch {
              this.token = null;
              throw new Error('Sessão expirada. Use buildixlab_login para reconectar.');
            }
          }
          this.token = null;
          throw new Error('Sessão expirada. Use buildixlab_login para reconectar.');
        }
        if (error.response?.status === 429) {
          throw new Error('Rate limit atingido. Aguarde antes de tentar novamente.');
        }
        if (error.response?.status === 403) {
          throw new Error('Acesso negado. Verifique suas permissões ou faça upgrade do plano.');
        }
        const data = error.response?.data as Record<string, unknown> | undefined;
        const message = (data?.message as string) || error.message;
        throw new Error(
          `BuildixLab API Error [${error.response?.status || 'NETWORK'}]: ${message}`
        );
      }
    );

    // Load token from env if available
    const envToken = process.env.BUILDIXLAB_AUTH_TOKEN;
    if (envToken) {
      this.token = envToken;
    }
  }

  private isRetryable(error: AxiosError): boolean {
    // Retry on 5xx server errors
    if (error.response && error.response.status >= 500) {
      return true;
    }
    // Retry on network errors
    if (error.code && RETRYABLE_NETWORK_ERRORS.includes(error.code)) {
      return true;
    }
    return false;
  }

  setToken(token: string): void {
    this.token = token;
  }

  setRefreshCallback(cb: () => Promise<string>): void {
    this.refreshCallback = cb;
  }

  getToken(): string | null {
    return this.token;
  }

  isAuthenticated(): boolean {
    return this.token !== null;
  }

  async get<T>(path: string, params?: Record<string, unknown>): Promise<T> {
    const { data } = await this.client.get<T>(path, { params });
    return data;
  }

  async post<T>(path: string, body?: unknown): Promise<T> {
    const { data } = await this.client.post<T>(path, body);
    return data;
  }

  async put<T>(path: string, body?: unknown): Promise<T> {
    const { data } = await this.client.put<T>(path, body);
    return data;
  }

  async delete<T>(path: string): Promise<T> {
    const { data } = await this.client.delete<T>(path);
    return data;
  }
}
