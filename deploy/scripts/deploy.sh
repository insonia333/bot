#!/bin/bash
# Moom Agency — Script de Deploy
set -euo pipefail

DEPLOY_DIR="$(cd "$(dirname "$0")/.." && pwd)"
PROJECT_DIR="$(cd "$DEPLOY_DIR/.." && pwd)"

echo "========================================="
echo "  MOOM AGENCY — Deploy"
echo "  $(date '+%Y-%m-%d %H:%M:%S')"
echo "========================================="

# Pull latest code
echo "[1/4] Atualizando código..."
cd "$PROJECT_DIR"
git pull origin main

# Stop containers
echo "[2/4] Parando containers..."
cd "$DEPLOY_DIR"
docker-compose down --remove-orphans 2>/dev/null || true

# Start containers
echo "[3/4] Iniciando containers..."
docker-compose up -d --build

# Verify
echo "[4/4] Verificando..."
sleep 3
if docker-compose ps | grep -q "Up"; then
    echo ""
    echo "✅ Deploy concluído com sucesso!"
    echo ""
    docker-compose ps
    echo ""
    STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost 2>/dev/null || echo "N/A")
    echo "HTTP Status: $STATUS"
else
    echo "❌ Erro no deploy. Verificando logs..."
    docker-compose logs --tail=20
    exit 1
fi
