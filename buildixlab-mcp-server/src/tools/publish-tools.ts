import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { BuildixLabClient } from '../services/api-client';
import { ENDPOINTS, resolveEndpoint } from '../constants';
import { IdParamSchema } from '../schemas/common';
import type { BuildixLabPage } from '../types';

function textResult(data: unknown): { content: Array<{ type: 'text'; text: string }> } {
  return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
}

export function registerPublishTools(server: McpServer, client: BuildixLabClient): void {
  server.tool(
    'buildixlab_publish_page',
    'Publica uma página, tornando-a acessível publicamente pela URL.',
    IdParamSchema.shape,
    async ({ id }) => {
      try {
        const path = resolveEndpoint(ENDPOINTS.PAGE_PUBLISH, { id });
        const page = await client.post<BuildixLabPage>(path);
        return textResult({
          message: 'Página publicada com sucesso.',
          url: page.url,
          page,
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Erro desconhecido ao publicar página.';
        return textResult({ error: `Falha ao publicar página "${id}": ${message}` });
      }
    }
  );

  server.tool(
    'buildixlab_unpublish_page',
    'Despublica uma página, removendo o acesso público.',
    IdParamSchema.shape,
    async ({ id }) => {
      try {
        const path = resolveEndpoint(ENDPOINTS.PAGE_UNPUBLISH, { id });
        const page = await client.post<BuildixLabPage>(path);
        return textResult({
          message: 'Página despublicada com sucesso.',
          page,
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Erro desconhecido ao despublicar página.';
        return textResult({ error: `Falha ao despublicar página "${id}": ${message}` });
      }
    }
  );

  server.tool(
    'buildixlab_preview_page',
    'Obtém a URL de pré-visualização de uma página (mesmo não publicada).',
    IdParamSchema.shape,
    async ({ id }) => {
      try {
        const path = resolveEndpoint(ENDPOINTS.PAGE_PREVIEW, { id });
        const result = await client.get<{ preview_url: string }>(path);
        return textResult({
          message: 'URL de pré-visualização gerada.',
          preview_url: result.preview_url,
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Erro desconhecido ao gerar pré-visualização.';
        return textResult({ error: `Falha ao gerar pré-visualização da página "${id}": ${message}` });
      }
    }
  );

  server.tool(
    'buildixlab_get_page_url',
    'Retorna a URL pública de uma página publicada.',
    IdParamSchema.shape,
    async ({ id }) => {
      try {
        const path = resolveEndpoint(ENDPOINTS.PAGE_BY_ID, { id });
        const page = await client.get<BuildixLabPage>(path);
        if (!page.url) {
          return textResult({
            message: 'Esta página ainda não foi publicada. Use buildixlab_publish_page para publicá-la primeiro.',
            status: page.status,
          });
        }
        return textResult({
          url: page.url,
          status: page.status,
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Erro desconhecido ao obter URL da página.';
        return textResult({ error: `Falha ao obter URL da página "${id}": ${message}` });
      }
    }
  );
}
