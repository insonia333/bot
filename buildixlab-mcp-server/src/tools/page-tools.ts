import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { BuildixLabClient } from '../services/api-client';
import { ENDPOINTS, resolveEndpoint } from '../constants';
import {
  CreatePageSchema,
  ListPagesSchema,
  GetPageSchema,
  UpdatePageSchema,
  DeletePageSchema,
  DuplicatePageSchema,
} from '../schemas/page';
import type { BuildixLabPage, PaginatedResponse } from '../types';

function textResult(data: unknown): { content: Array<{ type: 'text'; text: string }> } {
  return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
}

export function registerPageTools(server: McpServer, client: BuildixLabClient): void {
  server.tool(
    'buildixlab_create_page',
    'Cria uma nova landing page com IA. Informe título, conteúdo descritivo e idioma.',
    CreatePageSchema.shape,
    async ({ title, content, language, template_id }) => {
      try {
        const body: Record<string, unknown> = { title, content, language };
        if (template_id) {
          body.template_id = template_id;
        }
        const page = await client.post<BuildixLabPage>(ENDPOINTS.PAGE_GENERATE, body);
        return textResult({
          message: 'Página criada com sucesso.',
          page,
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Erro desconhecido ao criar página.';
        return textResult({ error: `Falha ao criar página: ${message}` });
      }
    }
  );

  server.tool(
    'buildixlab_list_pages',
    'Lista todas as páginas da conta com paginação e filtro opcional por status.',
    ListPagesSchema.shape,
    async ({ offset, limit, status }) => {
      try {
        const params: Record<string, unknown> = { offset, limit };
        if (status) {
          params.status = status;
        }
        const result = await client.get<PaginatedResponse<BuildixLabPage>>(ENDPOINTS.PAGES, params);
        return textResult(result);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Erro desconhecido ao listar páginas.';
        return textResult({ error: `Falha ao listar páginas: ${message}` });
      }
    }
  );

  server.tool(
    'buildixlab_get_page',
    'Obtém detalhes completos de uma página pelo ID.',
    GetPageSchema.shape,
    async ({ id }) => {
      try {
        const path = resolveEndpoint(ENDPOINTS.PAGE_BY_ID, { id });
        const page = await client.get<BuildixLabPage>(path);
        return textResult(page);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Erro desconhecido ao obter página.';
        return textResult({ error: `Falha ao obter página "${id}": ${message}` });
      }
    }
  );

  server.tool(
    'buildixlab_update_page',
    'Atualiza título, conteúdo ou idioma de uma página existente.',
    UpdatePageSchema.shape,
    async ({ id, title, content, language }) => {
      try {
        const path = resolveEndpoint(ENDPOINTS.PAGE_BY_ID, { id });
        const body: Record<string, unknown> = {};
        if (title !== undefined) body.title = title;
        if (content !== undefined) body.content = content;
        if (language !== undefined) body.language = language;
        const page = await client.put<BuildixLabPage>(path, body);
        return textResult({
          message: 'Página atualizada com sucesso.',
          page,
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Erro desconhecido ao atualizar página.';
        return textResult({ error: `Falha ao atualizar página "${id}": ${message}` });
      }
    }
  );

  server.tool(
    'buildixlab_delete_page',
    'Exclui permanentemente uma página. Esta ação não pode ser desfeita.',
    DeletePageSchema.shape,
    async ({ id }) => {
      try {
        const path = resolveEndpoint(ENDPOINTS.PAGE_BY_ID, { id });
        await client.delete<{ deleted: boolean }>(path);
        return textResult({ message: `Página "${id}" excluída com sucesso.` });
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Erro desconhecido ao excluir página.';
        return textResult({ error: `Falha ao excluir página "${id}": ${message}` });
      }
    }
  );

  server.tool(
    'buildixlab_duplicate_page',
    'Duplica uma página existente, opcionalmente com um novo título.',
    DuplicatePageSchema.shape,
    async ({ id, new_title }) => {
      try {
        const path = resolveEndpoint(ENDPOINTS.PAGE_DUPLICATE, { id });
        const body: Record<string, unknown> = {};
        if (new_title) {
          body.new_title = new_title;
        }
        const page = await client.post<BuildixLabPage>(path, body);
        return textResult({
          message: 'Página duplicada com sucesso.',
          page,
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Erro desconhecido ao duplicar página.';
        return textResult({ error: `Falha ao duplicar página "${id}": ${message}` });
      }
    }
  );
}
