#!/bin/bash
# Moom Agency — Script de Backup
set -euo pipefail

BACKUP_BASE="/backups/moom"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
BACKUP_DIR="$BACKUP_BASE/$TIMESTAMP"
PROJECT_DIR="$(cd "$(dirname "$0")/../.." && pwd)"

echo "========================================="
echo "  MOOM AGENCY — Backup"
echo "  $TIMESTAMP"
echo "========================================="

mkdir -p "$BACKUP_DIR"

# Backup site files
echo "[1/4] Backup dos sites..."
tar -czf "$BACKUP_DIR/sites.tar.gz" \
    -C "$PROJECT_DIR" \
    site/ demos/ marketing/ legal/ \
    sitemap.xml robots.txt 2>/dev/null

# Backup automations
echo "[2/4] Backup das automações..."
tar -czf "$BACKUP_DIR/automations.tar.gz" \
    -C "$PROJECT_DIR" automations/ 2>/dev/null

# Backup deploy configs
echo "[3/4] Backup das configs de deploy..."
tar -czf "$BACKUP_DIR/deploy-configs.tar.gz" \
    -C "$PROJECT_DIR" deploy/ 2>/dev/null

# Cleanup old backups (keep 30 days)
echo "[4/4] Limpando backups antigos (>30 dias)..."
find "$BACKUP_BASE" -maxdepth 1 -type d -mtime +30 -exec rm -rf {} + 2>/dev/null || true

# Summary
TOTAL_SIZE=$(du -sh "$BACKUP_DIR" 2>/dev/null | cut -f1)
echo ""
echo "✅ Backup concluído!"
echo "📁 Local: $BACKUP_DIR"
echo "📦 Tamanho: $TOTAL_SIZE"
echo ""
ls -la "$BACKUP_DIR"
