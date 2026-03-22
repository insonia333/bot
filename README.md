# Bot - Assistente Pessoal com Claude Code

Projeto de automação pessoal usando Claude Code com integração a Google Calendar e Gmail via MCP.

## Funcionalidades

### Comandos Disponíveis
| Comando | Descrição |
|---------|-----------|
| `/daily-briefing` | Resumo diário com agenda e emails |
| `/email-summary` | Resumo categorizado dos emails recentes |
| `/schedule-check` | Verificar agenda e horários livres (3 dias) |
| `/email-draft` | Criar rascunho de email assistido |
| `/quick-event` | Criar evento rápido no calendário |

### Integrações MCP
- **Google Calendar**: Gerenciamento completo de agenda
- **Gmail**: Leitura, busca e criação de rascunhos

### Hooks
- **SessionStart**: Inicializa ambiente em sessões remotas
- **Stop** (global): Verifica commits/pushes pendentes antes de encerrar

## Setup

O projeto já vem configurado. Basta abrir com Claude Code:

```bash
cd bot
claude
```

Os comandos customizados estarão disponíveis como slash commands.

## Verificar Ambiente

```bash
bash scripts/check-env.sh
```
