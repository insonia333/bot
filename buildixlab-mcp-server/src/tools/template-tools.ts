import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { BuildixLabClient } from '../services/api-client';
import { ENDPOINTS } from '../constants';
import { PaginationSchema } from '../schemas/common';
import { CreatePageSchema } from '../schemas/page';
import type { BuildixLabTemplate, BuildixLabPage, PaginatedResponse } from '../types';

function textResult(data: unknown): { content: Array<{ type: 'text'; text: string }> } {
  return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
}

export function registerTemplateTools(server: McpServer, client: BuildixLabClient): void {
  server.tool(
    'buildixlab_list_templates',
    'Lista os templates disponíveis para criação de páginas.',
    PaginationSchema.shape,
    async ({ offset, limit }) => {
      try {
        const result = await client.get<PaginatedResponse<BuildixLabTemplate>>(
          ENDPOINTS.TEMPLATES,
          { offset, limit }
        );
        return textResult(result);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Erro desconhecido ao listar templates.';
        return textResult({ error: `Falha ao listar templates: ${message}` });
      }
    }
  );

  server.tool(
    'buildixlab_create_from_template',
    'Cria uma nova página a partir de um template existente.',
    CreatePageSchema.shape,
    async ({ title, content, language, template_id }) => {
      try {
        if (!template_id) {
          return textResult({
            error: 'O campo template_id é obrigatório para criar a partir de um template. Use buildixlab_list_templates para ver os templates disponíveis.',
          });
        }
        const body: Record<string, unknown> = { title, content, language, template_id };
        const page = await client.post<BuildixLabPage>(ENDPOINTS.PAGE_GENERATE, body);
        return textResult({
          message: 'Página criada a partir do template com sucesso.',
          page,
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Erro desconhecido ao criar página a partir do template.';
        return textResult({ error: `Falha ao criar página a partir do template: ${message}` });
      }
    }
  );
}
