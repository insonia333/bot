import { describe, it, expect } from 'vitest';
import { CreatePageSchema, ListPagesSchema } from '../schemas/page';

describe('CreatePageSchema', () => {
  it('should accept valid input', () => {
    const result = CreatePageSchema.safeParse({
      title: 'Minha Página',
      content: 'Conteúdo da página de teste',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.title).toBe('Minha Página');
      expect(result.data.language).toBe('pt-BR');
    }
  });

  it('should reject missing title', () => {
    const result = CreatePageSchema.safeParse({
      content: 'Conteúdo sem título',
    });
    expect(result.success).toBe(false);
  });
});

describe('ListPagesSchema', () => {
  it('should have correct defaults', () => {
    const result = ListPagesSchema.safeParse({});
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.offset).toBe(0);
      expect(result.data.limit).toBeGreaterThan(0);
    }
  });
});
