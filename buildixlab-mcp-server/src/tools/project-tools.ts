import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { BuildixLabClient } from '../services/api-client';
import { ENDPOINTS, resolveEndpoint } from '../constants';
import {
  UpdateSEOSchema,
  SetDomainSchema,
  AddTrackingSchema,
  GetPageHtmlSchema,
} from '../schemas/project';
import type { BuildixLabSEO, BuildixLabTracking } from '../types';

function textResult(data: unknown): { content: Array<{ type: 'text'; text: string }> } {
  return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
}

export function registerProjectTools(server: McpServer, client: BuildixLabClient): void {
  server.tool(
    'buildixlab_update_seo',
    'Atualiza as configurações de SEO de uma página (título, descrição, palavras-chave, Open Graph).',
    UpdateSEOSchema.shape,
    async ({ id, title, description, keywords, og_image, canonical_url }) => {
      try {
        const path = resolveEndpoint(ENDPOINTS.PAGE_SEO, { id });
        const body: Record<string, unknown> = { title, description, keywords };
        if (og_image !== undefined) body.og_image = og_image;
        if (canonical_url !== undefined) body.canonical_url = canonical_url;
        const seo = await client.put<BuildixLabSEO>(path, body);
        return textResult({
          message: 'Configurações de SEO atualizadas com sucesso.',
          seo,
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Erro desconhecido ao atualizar SEO.';
        return textResult({ error: `Falha ao atualizar SEO da página "${id}": ${message}` });
      }
    }
  );

  server.tool(
    'buildixlab_set_custom_domain',
    'Configura um domínio personalizado para uma página.',
    SetDomainSchema.shape,
    async ({ id, domain }) => {
      try {
        const path = resolveEndpoint(ENDPOINTS.PAGE_DOMAIN, { id });
        const result = await client.put<{ domain: string }>(path, { domain });
        return textResult({
          message: `Domínio "${result.domain}" configurado com sucesso. Configure o DNS conforme as instruções.`,
          domain: result.domain,
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Erro desconhecido ao configurar domínio.';
        return textResult({ error: `Falha ao configurar domínio para página "${id}": ${message}` });
      }
    }
  );

  server.tool(
    'buildixlab_add_tracking',
    'Adiciona scripts de rastreamento (Google Analytics, Facebook Pixel, scripts personalizados) a uma página.',
    AddTrackingSchema.shape,
    async ({ id, google_analytics_id, facebook_pixel_id, custom_scripts }) => {
      try {
        const path = resolveEndpoint(ENDPOINTS.PAGE_TRACKING, { id });
        const body: Record<string, unknown> = {};
        if (google_analytics_id !== undefined) body.google_analytics_id = google_analytics_id;
        if (facebook_pixel_id !== undefined) body.facebook_pixel_id = facebook_pixel_id;
        if (custom_scripts !== undefined) body.custom_scripts = custom_scripts;
        const tracking = await client.put<BuildixLabTracking>(path, body);
        return textResult({
          message: 'Scripts de rastreamento configurados com sucesso.',
          tracking,
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Erro desconhecido ao configurar rastreamento.';
        return textResult({ error: `Falha ao configurar rastreamento da página "${id}": ${message}` });
      }
    }
  );

  server.tool(
    'buildixlab_get_page_html',
    'Exporta o HTML completo de uma página para download ou integração externa.',
    GetPageHtmlSchema.shape,
    async ({ id }) => {
      try {
        const path = resolveEndpoint(ENDPOINTS.PAGE_EXPORT, { id });
        const result = await client.get<{ html: string }>(path);
        return textResult({
          message: 'HTML exportado com sucesso.',
          html: result.html,
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Erro desconhecido ao exportar HTML.';
        return textResult({ error: `Falha ao exportar HTML da página "${id}": ${message}` });
      }
    }
  );
}
