# Bot - Assistente Pessoal com Claude Code

## Visão Geral
Bot pessoal integrado com Google Calendar e Gmail via MCP.
Utiliza hooks, skills e automações para produtividade.

## Estrutura do Projeto
```
bot/
├── CLAUDE.md              # Este arquivo - instruções para o Claude
├── .claude/
│   ├── settings.json      # Configurações do projeto
│   ├── hooks/             # Scripts de hooks
│   │   └── session-start.sh
│   └── commands/          # Comandos customizados
│       ├── daily-briefing.md
│       ├── email-summary.md
│       └── schedule-check.md
├── scripts/
│   ├── check-env.sh       # Verificação de ambiente
│   └── utils.sh           # Utilitários compartilhados
└── src/
    └── prompts/
        └── templates.md   # Templates de prompts reutilizáveis
```

## MCPs Disponíveis
- **Google Calendar**: Criar, listar, atualizar e deletar eventos; encontrar horários livres
- **Gmail**: Ler emails, criar rascunhos, buscar mensagens, listar labels

## Convenções
- Hooks usam bash com `set -euo pipefail`
- Commits em português quando o contexto é pt-BR
- Comandos customizados em markdown no `.claude/commands/`

## Comandos Disponíveis
- `/daily-briefing` - Resumo diário (agenda + emails importantes)
- `/email-summary` - Resumo dos emails recentes
- `/schedule-check` - Verificar agenda e encontrar horários livres
