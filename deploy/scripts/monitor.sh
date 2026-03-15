#!/bin/bash
# Moom Agency — Script de Monitoramento
set -euo pipefail

DOMAIN="moomagencia.com"
ALERT_PHONE="${ALERT_PHONE:-5511999999999}"
EVOLUTION_API_URL="${EVOLUTION_API_URL:-http://localhost:8080}"
INSTANCE_NAME="${INSTANCE_NAME:-moom-bot}"

SITES=(
    "https://$DOMAIN"
    "https://$DOMAIN/demos/clinica/"
    "https://$DOMAIN/demos/salao/"
    "https://$DOMAIN/demos/petshop/"
    "https://$DOMAIN/demos/imobiliaria/"
    "https://$DOMAIN/demos/automacao/"
    "https://$DOMAIN/demos/restaurante/"
)

echo "========================================="
echo "  MOOM AGENCY — Monitor"
echo "  $(date '+%Y-%m-%d %H:%M:%S')"
echo "========================================="

ERRORS=0

for site in "${SITES[@]}"; do
    STATUS=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$site" 2>/dev/null || echo "TIMEOUT")
    RESPONSE_TIME=$(curl -s -o /dev/null -w "%{time_total}" --max-time 10 "$site" 2>/dev/null || echo "N/A")

    if [ "$STATUS" = "200" ]; then
        echo "✅ $site — ${STATUS} (${RESPONSE_TIME}s)"
    else
        echo "❌ $site — ${STATUS} (${RESPONSE_TIME}s)"
        ERRORS=$((ERRORS + 1))
    fi
done

# Check Docker containers
echo ""
echo "--- Containers Docker ---"
docker-compose -f "$(dirname "$0")/../docker-compose.yml" ps 2>/dev/null || echo "Docker compose não disponível"

# Check disk usage
echo ""
echo "--- Uso de Disco ---"
df -h / | tail -1

# Send alert if errors found
if [ $ERRORS -gt 0 ]; then
    echo ""
    echo "⚠️ $ERRORS site(s) com problema! Enviando alerta..."

    ALERT_MSG="⚠️ *ALERTA — Moom Agency*%0A%0A$ERRORS site(s) fora do ar!%0AVerifique: $(date '+%H:%M %d/%m/%Y')"

    curl -s -X POST \
        "$EVOLUTION_API_URL/message/sendText/$INSTANCE_NAME" \
        -H "Content-Type: application/json" \
        -d "{\"number\": \"$ALERT_PHONE\", \"text\": \"$ALERT_MSG\"}" \
        > /dev/null 2>&1 || echo "Falha ao enviar alerta WhatsApp"
fi

echo ""
echo "Monitor concluído. Erros: $ERRORS"
exit $ERRORS
