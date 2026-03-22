#!/bin/bash
set -euo pipefail

# Somente executar em ambiente remoto (Claude Code on the web)
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

# Verificar se jq está disponível
if ! command -v jq &>/dev/null; then
  apt-get update -qq && apt-get install -y -qq jq >/dev/null 2>&1 || true
fi

# Exportar variáveis de ambiente úteis para a sessão
if [ -n "${CLAUDE_ENV_FILE:-}" ]; then
  echo 'export BOT_PROJECT=true' >> "$CLAUDE_ENV_FILE"
  echo "export BOT_START_TIME=$(date -u +%Y-%m-%dT%H:%M:%SZ)" >> "$CLAUDE_ENV_FILE"
fi

echo "Bot session initialized successfully."
