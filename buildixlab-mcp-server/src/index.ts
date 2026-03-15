import 'dotenv/config';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { BuildixLabClient } from './services/api-client';
import { AuthService } from './services/auth';
import { registerAuthTools } from './tools/auth-tools';
import { registerPageTools } from './tools/page-tools';
import { registerPublishTools } from './tools/publish-tools';
import { registerTemplateTools } from './tools/template-tools';
import { registerProjectTools } from './tools/project-tools';

async function main(): Promise<void> {
  console.error('[BuildixLab MCP] Servidor iniciado. Versão 1.0.0');
  // Validate environment variables
  const authToken = process.env.BUILDIXLAB_AUTH_TOKEN;
  const authEmail = process.env.BUILDIXLAB_EMAIL;
  if (!authToken && !authEmail) {
    console.error('⚠️  Nenhuma credencial configurada. Use buildixlab_login ou defina BUILDIXLAB_AUTH_TOKEN.');
  }

  const apiBaseUrl = process.env.BUILDIXLAB_API_BASE_URL;
  if (apiBaseUrl) {
    console.error(`API Base URL: ${apiBaseUrl}`);
  }

  const transportEnv = process.env.TRANSPORT;
  if (transportEnv && transportEnv !== 'http' && transportEnv !== 'stdio') {
    console.error(`⚠️  Valor desconhecido para TRANSPORT: "${transportEnv}". Valores aceitos: "http", "stdio".`);
  }

  const server = new McpServer({
    name: 'buildixlab-mcp-server',
    version: '1.0.0',
  });

  const client = new BuildixLabClient();
  const authService = new AuthService(client);

  // Register all tool groups
  registerAuthTools(server, authService);
  registerPageTools(server, client);
  registerPublishTools(server, client);
  registerTemplateTools(server, client);
  registerProjectTools(server, client);

  const transport = process.env.TRANSPORT;

  if (transport === 'http') {
    const express = await import('express');
    const { StreamableHTTPServerTransport } = await import(
      '@modelcontextprotocol/sdk/server/streamableHttp.js'
    );

    const app = express.default();
    app.use(express.default.json());

    const httpTransport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });

    app.post('/mcp', async (req, res) => {
      await httpTransport.handleRequest(req, res, req.body);
    });

    app.get('/mcp', async (req, res) => {
      await httpTransport.handleRequest(req, res);
    });

    app.delete('/mcp', async (req, res) => {
      await httpTransport.handleRequest(req, res);
    });

    await server.connect(httpTransport);

    const port = parseInt(process.env.PORT || '3000', 10);
    app.listen(port, () => {
      console.error(`BuildixLab MCP Server rodando em http://localhost:${port}/mcp`);
    });
  } else {
    const stdioTransport = new StdioServerTransport();
    await server.connect(stdioTransport);
    console.error('BuildixLab MCP Server iniciado via stdio.');
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Erro fatal ao iniciar o servidor: ${message}`);
  process.exit(1);
});
