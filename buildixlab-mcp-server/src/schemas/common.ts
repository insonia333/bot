import { z } from 'zod';
import { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from '../constants';

export const PaginationSchema = z.object({
  offset: z.number().int().min(0).default(0)
    .describe('Deslocamento para paginação (começa em 0)'),
  limit: z.number().int().min(1).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE)
    .describe(`Número de itens por página (máximo ${MAX_PAGE_SIZE})`),
}).strict();

export const IdParamSchema = z.object({
  id: z.string().min(1).describe('ID único do recurso'),
}).strict();
