import { z } from 'zod';

export const UpdateSEOSchema = z.object({
  id: z.string().min(1).describe('ID da página'),
  title: z.string().min(1).describe('Título SEO'),
  description: z.string().min(1).describe('Descrição SEO'),
  keywords: z.array(z.string()).describe('Palavras-chave para SEO'),
  og_image: z.string().url().optional().describe('URL da imagem Open Graph'),
  canonical_url: z.string().url().optional().describe('URL canônica da página'),
}).strict();

export const SetDomainSchema = z.object({
  id: z.string().min(1).describe('ID da página'),
  domain: z.string().min(1).describe('Domínio personalizado (ex: meusite.com)'),
}).strict();

export const AddTrackingSchema = z.object({
  id: z.string().min(1).describe('ID da página'),
  google_analytics_id: z.string().optional().describe('ID do Google Analytics (ex: G-XXXXXXXXXX)'),
  facebook_pixel_id: z.string().optional().describe('ID do Facebook Pixel'),
  custom_scripts: z.array(z.string()).optional().describe('Scripts personalizados de rastreamento'),
}).strict();

export const GetPageHtmlSchema = z.object({
  id: z.string().min(1).describe('ID da página para exportar HTML'),
}).strict();
