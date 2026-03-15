# Moom Agency — Agência Digital Premium

Projeto completo da Moom Agency: site institucional, demos de portfolio, automações e infraestrutura.

## Estrutura

```
site/           → Site principal (moomagencia.com)
demos/          → 6 demos de portfolio por nicho
automations/    → Workflows N8N (WhatsApp, CRM, etc.)
marketing/      → Lead magnets, campanhas, SEO
deploy/         → Docker, Nginx, scripts de deploy
legal/          → LGPD, política de privacidade
```

## Tecnologias

- HTML5 / CSS3 / JavaScript (vanilla)
- Three.js v0.180.0 (partículas 3D)
- GSAP v3.14.2 + ScrollTrigger (animações)
- N8N + Evolution API (automações WhatsApp)
- Docker + Nginx (deploy)

## Demos de Portfolio

| Nicho | URL | Cor |
|-------|-----|-----|
| Clínica | `/demos/clinica/` | Teal |
| Salão de Beleza | `/demos/salao/` | Rose |
| Pet Shop | `/demos/petshop/` | Amber |
| Imobiliária | `/demos/imobiliaria/` | Blue |
| Automação | `/demos/automacao/` | Violet |
| Restaurante | `/demos/restaurante/` | Red |

## Deploy

```bash
cd deploy && docker-compose up -d
```

## Licença

Copyright 2024-2026 Moom Agency. Todos os direitos reservados.
