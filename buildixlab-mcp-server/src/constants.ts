export const API_BASE_URL = process.env.BUILDIXLAB_API_BASE_URL
  || 'https://www.buildixlab.com/api';

export const ENDPOINTS = {
  // Auth
  LOGIN:          '/auth/login',
  SESSION:        '/auth/session',
  REFRESH:        '/auth/refresh',

  // Pages
  PAGES:          '/pages',
  PAGE_BY_ID:     '/pages/:id',
  PAGE_GENERATE:  '/pages/generate',
  PAGE_DUPLICATE: '/pages/:id/duplicate',

  // Publish
  PAGE_PUBLISH:   '/pages/:id/publish',
  PAGE_UNPUBLISH: '/pages/:id/unpublish',
  PAGE_PREVIEW:   '/pages/:id/preview',

  // Templates
  TEMPLATES:      '/templates',

  // Settings
  PAGE_SEO:       '/pages/:id/seo',
  PAGE_DOMAIN:    '/pages/:id/domain',
  PAGE_TRACKING:  '/pages/:id/tracking',
  PAGE_EXPORT:    '/pages/:id/export',
} as const;

export const CHARACTER_LIMIT = 100_000;
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

export function resolveEndpoint(endpoint: string, params: Record<string, string>): string {
  let resolved = endpoint;
  for (const [key, value] of Object.entries(params)) {
    resolved = resolved.replace(`:${key}`, encodeURIComponent(value));
  }
  return resolved;
}
