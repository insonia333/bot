import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { AuthService } from '../services/auth';

const LoginSchema = z.object({
  email: z.string().email().describe('E-mail da conta BuildixLab'),
  password: z.string().min(1).describe('Senha da conta BuildixLab'),
}).strict();

function textResult(data: unknown): { content: Array<{ type: 'text'; text: string }> } {
  return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
}

export function registerAuthTools(server: McpServer, authService: AuthService): void {
  server.tool(
    'buildixlab_login',
    'Autentica na plataforma BuildixLab com e-mail e senha. Necessário antes de usar qualquer outra ferramenta.',
    LoginSchema.shape,
    async ({ email, password }) => {
      try {
        const result = await authService.login(email, password);
        return textResult({
          message: 'Login realizado com sucesso.',
          session: result.session,
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Erro desconhecido ao fazer login.';
        return textResult({ error: `Falha no login: ${message}. Verifique suas credenciais e tente novamente.` });
      }
    }
  );

  server.tool(
    'buildixlab_get_session',
    'Retorna informações da sessão atual, incluindo plano, uso de páginas e validade.',
    {},
    async () => {
      try {
        const session = await authService.getSession();
        return textResult(session);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Erro desconhecido ao obter sessão.';
        return textResult({ error: `Falha ao obter sessão: ${message}` });
      }
    }
  );
}
