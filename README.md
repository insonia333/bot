# Bot - Script de Limpeza e Otimização do PC

Script Bash para limpar e otimizar sistemas Linux, incluindo redução do tempo de inicialização.

## Como usar

```bash
sudo bash clean_pc.sh
```

## O que o script faz

| Módulo | Ação |
|--------|------|
| **Pacotes** | Remove pacotes desnecessários (apt/dnf/pacman) |
| **Cache** | Limpa cache de RAM, usuários, pip, npm, yarn |
| **Logs** | Remove logs antigos e compactados, limita journald a 2 semanas/200MB |
| **Temporários** | Limpa `/tmp` e `/var/tmp` (arquivos > 2/7 dias) |
| **Lixeira** | Esvazia lixeira de todos os usuários |
| **Kernels** | Remove kernels antigos (somente apt) |
| **Inicialização** | Analisa serviços lentos e lista serviços opcionais para desabilitar |
| **Desempenho** | Ajusta swappiness, VFS cache pressure e scheduler de I/O para SSD |

## Requisitos

- Linux com systemd
- Executar como root (`sudo`)

## Após executar

Reinicie o sistema para aplicar todas as otimizações:

```bash
sudo reboot
```