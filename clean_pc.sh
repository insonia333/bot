#!/bin/bash
# Script de Limpeza e Otimização do PC (Linux)
# Uso: sudo bash clean_pc.sh

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log()   { echo -e "${GREEN}[OK]${NC} $1"; }
warn()  { echo -e "${YELLOW}[AVISO]${NC} $1"; }
info()  { echo -e "${BLUE}[INFO]${NC} $1"; }
error() { echo -e "${RED}[ERRO]${NC} $1"; }

check_root() {
    if [[ $EUID -ne 0 ]]; then
        error "Execute este script como root: sudo bash $0"
        exit 1
    fi
}

show_space_before() {
    info "Espaço em disco ANTES da limpeza:"
    df -h / | tail -1
    echo ""
}

show_space_after() {
    info "Espaço em disco DEPOIS da limpeza:"
    df -h / | tail -1
    echo ""
}

# ─────────────────────────────────────────────
# 1. LIMPEZA DE PACOTES
# ─────────────────────────────────────────────
clean_packages() {
    echo -e "\n${BLUE}=== Limpeza de Pacotes ===${NC}"

    if command -v apt &>/dev/null; then
        info "Removendo pacotes desnecessários (apt)..."
        apt autoremove -y --purge
        apt autoclean -y
        apt clean -y
        log "Pacotes apt limpos."
    fi

    if command -v dnf &>/dev/null; then
        info "Removendo pacotes desnecessários (dnf)..."
        dnf autoremove -y
        dnf clean all
        log "Pacotes dnf limpos."
    fi

    if command -v pacman &>/dev/null; then
        info "Removendo pacotes órfãos (pacman)..."
        pacman -Rns $(pacman -Qtdq) --noconfirm 2>/dev/null || true
        pacman -Sc --noconfirm
        log "Pacotes pacman limpos."
    fi
}

# ─────────────────────────────────────────────
# 2. LIMPEZA DE CACHE
# ─────────────────────────────────────────────
clean_cache() {
    echo -e "\n${BLUE}=== Limpeza de Cache ===${NC}"

    info "Limpando cache do sistema..."
    sync && echo 3 > /proc/sys/vm/drop_caches
    log "Cache de memória RAM limpo."

    info "Limpando cache de usuários (~/.cache)..."
    for home_dir in /home/*/; do
        if [[ -d "${home_dir}.cache" ]]; then
            find "${home_dir}.cache" -type f -atime +30 -delete 2>/dev/null || true
            log "Cache de $(basename $home_dir) limpo (arquivos > 30 dias)."
        fi
    done

    if [[ -d /root/.cache ]]; then
        find /root/.cache -type f -atime +30 -delete 2>/dev/null || true
        log "Cache de root limpo."
    fi

    # Cache do pip
    if [[ -d /root/.cache/pip ]]; then
        rm -rf /root/.cache/pip
        log "Cache do pip limpo."
    fi
    for home_dir in /home/*/; do
        [[ -d "${home_dir}.cache/pip" ]] && rm -rf "${home_dir}.cache/pip" && \
            log "Cache pip de $(basename $home_dir) limpo."
    done

    # Cache do npm
    if command -v npm &>/dev/null; then
        npm cache clean --force 2>/dev/null || true
        log "Cache do npm limpo."
    fi

    # Cache do yarn
    if command -v yarn &>/dev/null; then
        yarn cache clean 2>/dev/null || true
        log "Cache do yarn limpo."
    fi
}

# ─────────────────────────────────────────────
# 3. LIMPEZA DE LOGS
# ─────────────────────────────────────────────
clean_logs() {
    echo -e "\n${BLUE}=== Limpeza de Logs ===${NC}"

    if command -v journalctl &>/dev/null; then
        info "Limpando logs do journald (mantendo últimas 2 semanas)..."
        journalctl --vacuum-time=2weeks
        journalctl --vacuum-size=200M
        log "Logs do journald limpos."
    fi

    info "Limpando logs antigos em /var/log..."
    find /var/log -name "*.gz" -delete 2>/dev/null || true
    find /var/log -name "*.old" -delete 2>/dev/null || true
    find /var/log -name "*.1" -delete 2>/dev/null || true
    find /var/log -type f -name "*.log" -size +100M -exec truncate -s 10M {} \; 2>/dev/null || true
    log "Logs antigos limpos."
}

# ─────────────────────────────────────────────
# 4. LIMPEZA DE ARQUIVOS TEMPORÁRIOS
# ─────────────────────────────────────────────
clean_temp() {
    echo -e "\n${BLUE}=== Limpeza de Arquivos Temporários ===${NC}"

    info "Limpando /tmp..."
    find /tmp -type f -atime +2 -delete 2>/dev/null || true
    find /tmp -type d -empty -not -path "/tmp" -delete 2>/dev/null || true
    log "/tmp limpo."

    info "Limpando /var/tmp..."
    find /var/tmp -type f -atime +7 -delete 2>/dev/null || true
    log "/var/tmp limpo."

    info "Limpando miniaturas antigas..."
    for home_dir in /home/*/; do
        [[ -d "${home_dir}.cache/thumbnails" ]] && \
            find "${home_dir}.cache/thumbnails" -type f -atime +30 -delete 2>/dev/null || true
    done
    log "Miniaturas antigas removidas."
}

# ─────────────────────────────────────────────
# 5. LIMPEZA DA LIXEIRA
# ─────────────────────────────────────────────
clean_trash() {
    echo -e "\n${BLUE}=== Limpeza da Lixeira ===${NC}"

    for home_dir in /home/*/; do
        trash_dir="${home_dir}.local/share/Trash"
        if [[ -d "$trash_dir" ]]; then
            rm -rf "${trash_dir}/files/"* 2>/dev/null || true
            rm -rf "${trash_dir}/info/"* 2>/dev/null || true
            log "Lixeira de $(basename $home_dir) esvaziada."
        fi
    done

    if [[ -d /root/.local/share/Trash ]]; then
        rm -rf /root/.local/share/Trash/files/* 2>/dev/null || true
        rm -rf /root/.local/share/Trash/info/* 2>/dev/null || true
        log "Lixeira de root esvaziada."
    fi
}

# ─────────────────────────────────────────────
# 6. OTIMIZAÇÃO DA INICIALIZAÇÃO (SYSTEMD)
# ─────────────────────────────────────────────
optimize_startup() {
    echo -e "\n${BLUE}=== Otimização da Inicialização ===${NC}"

    if ! command -v systemctl &>/dev/null; then
        warn "systemd não encontrado, pulando otimização de inicialização."
        return
    fi

    info "Serviços que mais demoram na inicialização:"
    systemd-analyze blame 2>/dev/null | head -15 || true
    echo ""

    info "Tempo total de boot atual:"
    systemd-analyze 2>/dev/null || true
    echo ""

    # Serviços que geralmente podem ser desabilitados com segurança
    local optional_services=(
        "bluetooth.service"
        "cups.service"
        "avahi-daemon.service"
        "ModemManager.service"
        "whoopsie.service"
        "apport.service"
        "speech-dispatcher.service"
        "fwupd.service"
    )

    echo -e "${YELLOW}Serviços opcionais (verifique antes de desabilitar):${NC}"
    for svc in "${optional_services[@]}"; do
        if systemctl is-enabled "$svc" &>/dev/null 2>&1; then
            status=$(systemctl is-active "$svc" 2>/dev/null || echo "inativo")
            echo "  - $svc [status: $status]"
        fi
    done

    echo ""
    warn "Para desabilitar um serviço use: sudo systemctl disable --now <nome_do_serviço>"
    warn "Para reabilitar use:             sudo systemctl enable --now <nome_do_serviço>"
}

# ─────────────────────────────────────────────
# 7. AJUSTES DE DESEMPENHO DO SISTEMA
# ─────────────────────────────────────────────
optimize_performance() {
    echo -e "\n${BLUE}=== Ajustes de Desempenho ===${NC}"

    # Swappiness - reduz uso de swap para sistemas com RAM >= 4GB
    RAM_GB=$(free -g | awk '/^Mem:/{print $2}')
    if [[ $RAM_GB -ge 4 ]]; then
        current_swappiness=$(cat /proc/sys/vm/swappiness)
        if [[ $current_swappiness -gt 10 ]]; then
            sysctl -w vm.swappiness=10 > /dev/null
            if ! grep -q "vm.swappiness" /etc/sysctl.conf 2>/dev/null; then
                echo "vm.swappiness=10" >> /etc/sysctl.conf
            else
                sed -i 's/^vm.swappiness=.*/vm.swappiness=10/' /etc/sysctl.conf
            fi
            log "Swappiness ajustado de $current_swappiness para 10 (melhor para ${RAM_GB}GB RAM)."
        else
            log "Swappiness já está otimizado ($current_swappiness)."
        fi
    fi

    # VFS cache pressure
    sysctl -w vm.vfs_cache_pressure=50 > /dev/null
    if ! grep -q "vm.vfs_cache_pressure" /etc/sysctl.conf 2>/dev/null; then
        echo "vm.vfs_cache_pressure=50" >> /etc/sysctl.conf
    else
        sed -i 's/^vm.vfs_cache_pressure=.*/vm.vfs_cache_pressure=50/' /etc/sysctl.conf
    fi
    log "VFS cache pressure ajustado para 50."

    # Scheduler de I/O para SSD (se aplicável)
    for disk in /sys/block/sd* /sys/block/nvme*; do
        if [[ -f "$disk/queue/rotational" ]]; then
            rotational=$(cat "$disk/queue/rotational")
            disk_name=$(basename "$disk")
            if [[ "$rotational" == "0" ]]; then
                echo "none" > "$disk/queue/scheduler" 2>/dev/null || \
                echo "mq-deadline" > "$disk/queue/scheduler" 2>/dev/null || true
                log "Scheduler de I/O otimizado para SSD: $disk_name"
            fi
        fi
    done
}

# ─────────────────────────────────────────────
# 8. LIMPEZA DE KERNELS ANTIGOS
# ─────────────────────────────────────────────
clean_old_kernels() {
    echo -e "\n${BLUE}=== Limpeza de Kernels Antigos ===${NC}"

    if ! command -v apt &>/dev/null; then
        info "Pulando limpeza de kernels (apenas para sistemas apt)."
        return
    fi

    current_kernel=$(uname -r)
    info "Kernel atual: $current_kernel"

    old_kernels=$(dpkg -l 'linux-image-*' 2>/dev/null | \
        grep '^ii' | \
        grep -v "$current_kernel" | \
        grep -v "linux-image-generic" | \
        awk '{print $2}' || true)

    if [[ -z "$old_kernels" ]]; then
        log "Nenhum kernel antigo encontrado."
    else
        echo "Kernels antigos encontrados:"
        echo "$old_kernels"
        apt purge -y $old_kernels 2>/dev/null || true
        log "Kernels antigos removidos."
    fi
}

# ─────────────────────────────────────────────
# MAIN
# ─────────────────────────────────────────────
main() {
    echo -e "${GREEN}"
    echo "╔══════════════════════════════════════════════╗"
    echo "║   Script de Limpeza e Otimização do PC       ║"
    echo "║   Linux - $(date '+%d/%m/%Y %H:%M')                   ║"
    echo "╚══════════════════════════════════════════════╝"
    echo -e "${NC}"

    check_root
    show_space_before

    clean_packages
    clean_cache
    clean_logs
    clean_temp
    clean_trash
    clean_old_kernels
    optimize_startup
    optimize_performance

    echo ""
    show_space_after

    echo -e "${GREEN}"
    echo "╔══════════════════════════════════════════════╗"
    echo "║         Limpeza concluída com sucesso!       ║"
    echo "║  Reinicie o sistema para aplicar todas as   ║"
    echo "║  otimizações.                                ║"
    echo "╚══════════════════════════════════════════════╝"
    echo -e "${NC}"
}

main "$@"
