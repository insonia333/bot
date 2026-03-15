import { BuildixLabClient } from './api-client';
import { ENDPOINTS } from '../constants';
import { BuildixLabSession } from '../types';

export class AuthService {
  constructor(private client: BuildixLabClient) {}

  async login(email: string, password: string): Promise<{ token: string; session: BuildixLabSession }> {
    const result = await this.client.post<{ token: string; session: BuildixLabSession }>(
      ENDPOINTS.LOGIN,
      { email, password }
    );
    this.client.setToken(result.token);
    return result;
  }

  async getSession(): Promise<BuildixLabSession> {
    if (!this.client.isAuthenticated()) {
      throw new Error('Não autenticado. Use buildixlab_login primeiro.');
    }
    return this.client.get<BuildixLabSession>(ENDPOINTS.SESSION);
  }

  async refreshToken(): Promise<string> {
    if (!this.client.isAuthenticated()) {
      throw new Error('Não autenticado. Use buildixlab_login primeiro.');
    }
    const result = await this.client.post<{ token: string }>(ENDPOINTS.REFRESH);
    this.client.setToken(result.token);
    return result.token;
  }
}
