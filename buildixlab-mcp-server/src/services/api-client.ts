import axios, { AxiosInstance, AxiosError } from 'axios';
import { API_BASE_URL } from '../constants';

export class BuildixLabClient {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor(baseURL?: string) {
    this.client = axios.create({
      baseURL: baseURL || API_BASE_URL,
      timeout: 30000,
      headers: { 'Content-Type': 'application/json' }
    });

    this.client.interceptors.request.use((config) => {
      if (this.token) {
        config.headers.Authorization = `Bearer ${this.token}`;
      }
      return config;
    });

    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
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

  setToken(token: string): void {
    this.token = token;
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
