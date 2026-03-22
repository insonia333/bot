#!/bin/bash
set -euo pipefail

# Verifica o ambiente e lista recursos disponíveis

echo "=== Bot Environment Check ==="
echo "Date: $(date)"
echo "User: $(whoami)"
echo "Shell: $SHELL"
echo ""

echo "=== Git Status ==="
if git rev-parse --git-dir >/dev/null 2>&1; then
  echo "Branch: $(git branch --show-current)"
  echo "Last commit: $(git log --oneline -1)"
  echo "Status: $(git status --short | wc -l) changed files"
else
  echo "Not a git repository"
fi
echo ""

echo "=== Tools Available ==="
for cmd in jq curl git node python3 npm; do
  if command -v "$cmd" &>/dev/null; then
    echo "  [OK] $cmd ($(command -v "$cmd"))"
  else
    echo "  [--] $cmd (not found)"
  fi
done
echo ""

echo "=== Claude Config ==="
if [ -f ".claude/settings.json" ]; then
  echo "  Project settings: found"
  echo "  Hooks: $(jq '.hooks | keys | length' .claude/settings.json 2>/dev/null || echo 'N/A') configured"
  echo "  Permissions: $(jq '.permissions.allow | length' .claude/settings.json 2>/dev/null || echo 'N/A') allowed"
else
  echo "  No project settings found"
fi

if [ -f "CLAUDE.md" ]; then
  echo "  CLAUDE.md: found"
else
  echo "  CLAUDE.md: not found"
fi

echo ""
echo "=== Commands Available ==="
if [ -d ".claude/commands" ]; then
  for f in .claude/commands/*.md; do
    name=$(basename "$f" .md)
    echo "  /$name"
  done
else
  echo "  No custom commands"
fi

echo ""
echo "Environment check complete."
