export interface BuildixLabPage {
  id: string;
  title: string;
  status: 'draft' | 'published';
  url: string | null;
  preview_url: string;
  created_at: string;
  updated_at: string;
  template_id?: string;
  language: string;
}

export interface BuildixLabTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  thumbnail_url: string;
  created_at: string;
}

export interface BuildixLabSession {
  authenticated: boolean;
  email: string;
  plan: string;
  pages_used: number;
  pages_limit: number;
  expires_at: string;
}

export interface BuildixLabSEO {
  title: string;
  description: string;
  keywords: string[];
  og_image: string | null;
  canonical_url: string | null;
}

export interface BuildixLabTracking {
  google_analytics_id: string | null;
  facebook_pixel_id: string | null;
  custom_scripts: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  offset: number;
  limit: number;
  has_more: boolean;
}

export interface ApiError {
  status: number;
  message: string;
  code: string;
}
