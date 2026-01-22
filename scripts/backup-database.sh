#!/bin/bash
# ==============================================================================
# Script de Backup Automatique PostgreSQL - Game Plug
# ==============================================================================
# Usage: ./scripts/backup-database.sh [--retention-days N]
#
# Ce script crée un backup quotidien de la base de données roleplug
# et supprime les backups plus anciens que N jours (défaut: 30 jours)

set -euo pipefail

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
BACKUP_DIR="$PROJECT_DIR/backups"
CONTAINER_NAME="game-plug-db-dev"
DB_NAME="roleplug"
DB_USER="roleplug"
DB_PASSWORD="${POSTGRES_PASSWORD:-roleplug_020a2db75da6b5674c084a09d4e22b14}"
RETENTION_DAYS="${1:-30}"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
BACKUP_FILE="$BACKUP_DIR/auto-backup-$TIMESTAMP.sql"
LOG_FILE="$BACKUP_DIR/backup.log"

# Couleurs pour logs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Fonction de log
log() {
    local level=$1
    shift
    local message="$@"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')

    case $level in
        INFO)  echo -e "${GREEN}[INFO]${NC} $message" ;;
        WARN)  echo -e "${YELLOW}[WARN]${NC} $message" ;;
        ERROR) echo -e "${RED}[ERROR]${NC} $message" ;;
    esac

    echo "[$timestamp] [$level] $message" >> "$LOG_FILE"
}

# Vérifications préliminaires
check_prerequisites() {
    log INFO "Vérification des prérequis..."

    # Vérifier que le répertoire de backup existe
    if [ ! -d "$BACKUP_DIR" ]; then
        log WARN "Création du répertoire de backups: $BACKUP_DIR"
        mkdir -p "$BACKUP_DIR"
    fi

    # Vérifier que le container PostgreSQL est en cours d'exécution
    if ! docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
        log ERROR "Le container PostgreSQL '$CONTAINER_NAME' n'est pas en cours d'exécution"
        exit 1
    fi

    # Vérifier la santé du container
    HEALTH_STATUS=$(docker inspect --format='{{.State.Health.Status}}' "$CONTAINER_NAME" 2>/dev/null || echo "no-health")
    if [ "$HEALTH_STATUS" != "healthy" ] && [ "$HEALTH_STATUS" != "no-health" ]; then
        log WARN "Le container PostgreSQL n'est pas healthy (status: $HEALTH_STATUS)"
    fi

    log INFO "Prérequis vérifiés ✓"
}

# Créer le backup
create_backup() {
    log INFO "Début du backup de la base de données '$DB_NAME'..."

    # Exécuter pg_dump via docker exec
    if docker exec "$CONTAINER_NAME" pg_dump -U "$DB_USER" "$DB_NAME" > "$BACKUP_FILE"; then
        local size=$(du -h "$BACKUP_FILE" | cut -f1)
        log INFO "Backup créé avec succès: $BACKUP_FILE ($size)"
    else
        log ERROR "Échec de la création du backup"
        rm -f "$BACKUP_FILE"
        exit 1
    fi
}

# Vérifier l'intégrité du backup
verify_backup() {
    log INFO "Vérification de l'intégrité du backup..."

    # Vérifier que le fichier n'est pas vide
    if [ ! -s "$BACKUP_FILE" ]; then
        log ERROR "Le fichier de backup est vide!"
        exit 1
    fi

    # Vérifier que le fichier contient du SQL valide
    if ! grep -q "PostgreSQL database dump" "$BACKUP_FILE"; then
        log ERROR "Le fichier de backup ne semble pas être un dump PostgreSQL valide"
        exit 1
    fi

    # Compter les lignes
    local line_count=$(wc -l < "$BACKUP_FILE")
    log INFO "Backup vérifié: $line_count lignes"

    # Vérifier que les tables principales sont présentes
    local tables=("users" "game_sessions" "characters")
    for table in "${tables[@]}"; do
        if grep -q "CREATE TABLE.*$table" "$BACKUP_FILE"; then
            log INFO "  ✓ Table '$table' présente"
        else
            log WARN "  ⚠ Table '$table' non trouvée dans le backup"
        fi
    done

    log INFO "Vérification terminée ✓"
}

# Nettoyer les anciens backups
cleanup_old_backups() {
    log INFO "Nettoyage des backups de plus de $RETENTION_DAYS jours..."

    local deleted_count=0

    # Trouver et supprimer les backups automatiques plus anciens
    while IFS= read -r -d '' backup_file; do
        if [ -f "$backup_file" ]; then
            rm -f "$backup_file"
            log INFO "  Supprimé: $(basename "$backup_file")"
            ((deleted_count++))
        fi
    done < <(find "$BACKUP_DIR" -name "auto-backup-*.sql" -mtime +$RETENTION_DAYS -print0 2>/dev/null)

    if [ $deleted_count -gt 0 ]; then
        log INFO "Nettoyage terminé: $deleted_count backup(s) supprimé(s)"
    else
        log INFO "Aucun backup à supprimer"
    fi
}

# Créer un lien symbolique vers le dernier backup
create_latest_link() {
    local latest_link="$BACKUP_DIR/latest-backup.sql"

    # Supprimer l'ancien lien s'il existe
    rm -f "$latest_link"

    # Créer un nouveau lien symbolique
    ln -s "$(basename "$BACKUP_FILE")" "$latest_link"

    log INFO "Lien 'latest-backup.sql' créé vers le dernier backup"
}

# Statistiques des backups
show_backup_stats() {
    log INFO "Statistiques des backups:"

    local total_backups=$(find "$BACKUP_DIR" -name "auto-backup-*.sql" -type f 2>/dev/null | wc -l)
    local total_size=$(du -sh "$BACKUP_DIR" 2>/dev/null | cut -f1)
    local oldest_backup=$(find "$BACKUP_DIR" -name "auto-backup-*.sql" -type f -printf '%T+ %p\n' 2>/dev/null | sort | head -1 | cut -d' ' -f2- | xargs basename 2>/dev/null || echo "N/A")

    log INFO "  Total backups automatiques: $total_backups"
    log INFO "  Taille totale répertoire: $total_size"
    log INFO "  Backup le plus ancien: $oldest_backup"
    log INFO "  Rétention configurée: $RETENTION_DAYS jours"
}

# Fonction principale
main() {
    log INFO "=========================================="
    log INFO "Backup automatique Game Plug - Début"
    log INFO "=========================================="

    check_prerequisites
    create_backup
    verify_backup
    create_latest_link
    cleanup_old_backups
    show_backup_stats

    log INFO "=========================================="
    log INFO "Backup automatique terminé avec succès ✓"
    log INFO "=========================================="
}

# Gestion des erreurs
trap 'log ERROR "Le script a échoué à la ligne $LINENO"; exit 1' ERR

# Exécution
main "$@"
