import { describe, it, expect, beforeEach } from 'vitest';
import { BuildixLabClient } from '../services/api-client';

describe('BuildixLabClient', () => {
  let client: BuildixLabClient;

  beforeEach(() => {
    delete process.env.BUILDIXLAB_AUTH_TOKEN;
    client = new BuildixLabClient('https://api.example.com');
  });

  it('should be instantiated', () => {
    expect(client).toBeInstanceOf(BuildixLabClient);
  });

  it('should set and get token', () => {
    expect(client.getToken()).toBeNull();
    client.setToken('test-token-123');
    expect(client.getToken()).toBe('test-token-123');
  });

  it('should return correct authentication status', () => {
    expect(client.isAuthenticated()).toBe(false);
    client.setToken('some-token');
    expect(client.isAuthenticated()).toBe(true);
  });
});
