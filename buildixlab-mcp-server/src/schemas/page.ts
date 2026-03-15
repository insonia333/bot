import { z } from 'zod';
import { CHARACTER_LIMIT, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from '../constants';

export const CreatePageSchema = z.object({
  title: z.string().min(1).describe('Título da página'),
  content: z.string().max(CHARACTER_LIMIT).describe('Conteúdo da página (máximo 100.000 caracteres)'),
  language: z.string().default('pt-BR').describe('Idioma da página'),
  template_id: z.string().optional().describe('ID do template a ser utilizado'),
}).strict();

export const UpdatePageSchema = z.object({
  id: z.string().min(1).describe('ID da página'),
  title: z.string().min(1).optional().describe('Novo título da página'),
  content: z.string().max(CHARACTER_LIMIT).optional().describe('Novo conteúdo da página'),
  language: z.string().optional().describe('Novo idioma da página'),
}).strict();

export const ListPagesSchema = z.object({
  offset: z.number().int().min(0).default(0)
    .describe('Deslocamento para paginação'),
  limit: z.number().int().min(1).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE)
    .describe(`Número de itens por página (máximo ${MAX_PAGE_SIZE})`),
  status: z.enum(['draft', 'published']).optional()
    .describe('Filtrar por status da página'),
}).strict();

export const GetPageSchema = z.object({
  id: z.string().min(1).describe('ID da página'),
}).strict();

export const DeletePageSchema = z.object({
  id: z.string().min(1).describe('ID da página a ser excluída'),
}).strict();

export const DuplicatePageSchema = z.object({
  id: z.string().min(1).describe('ID da página a ser duplicada'),
  new_title: z.string().optional().describe('Título para a página duplicada'),
}).strict();
