#!/bin/bash
# ==============================================================================
# Script de Restauration PostgreSQL - Game Plug
# ==============================================================================
# Usage: ./scripts/restore-database.sh <backup-file.sql>
#
# ⚠️ ATTENTION: Ce script va ÉCRASER toutes les données actuelles de la base!
# Un backup de sécurité sera créé automatiquement avant la restauration.

set -euo pipefail

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
BACKUP_DIR="$PROJECT_DIR/backups"
CONTAINER_NAME="game-plug-db-dev"
DB_NAME="roleplug"
DB_USER="roleplug"
DB_PASSWORD="${POSTGRES_PASSWORD:-roleplug_020a2db75da6b5674c084a09d4e22b14}"

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Fonction de log
log() {
    local level=$1
    shift
    local message="$@"

    case $level in
        INFO)  echo -e "${GREEN}[INFO]${NC} $message" ;;
        WARN)  echo -e "${YELLOW}[WARN]${NC} $message" ;;
        ERROR) echo -e "${RED}[ERROR]${NC} $message" ;;
    esac
}

# Vérifier les arguments
check_arguments() {
    if [ $# -eq 0 ]; then
        log ERROR "Aucun fichier de backup spécifié"
        echo ""
        echo "Usage: $0 <backup-file.sql>"
        echo ""
        echo "Exemples:"
        echo "  $0 backups/auto-backup-20260104-120000.sql"
        echo "  $0 backups/latest-backup.sql"
        echo ""
        exit 1
    fi

    RESTORE_FILE="$1"

    # Résoudre les liens symboliques
    if [ -L "$RESTORE_FILE" ]; then
        local target=$(readlink -f "$RESTORE_FILE")
        log INFO "Lien symbolique détecté: $RESTORE_FILE -> $(basename $target)"
        RESTORE_FILE="$target"
    fi

    if [ ! -f "$RESTORE_FILE" ]; then
        log ERROR "Fichier de backup introuvable: $RESTORE_FILE"
        exit 1
    fi

    log INFO "Fichier de restauration: $RESTORE_FILE ($(du -h "$RESTORE_FILE" | cut -f1))"
}

# Confirmation utilisateur
confirm_restore() {
    log WARN "⚠️  ATTENTION: Cette opération va ÉCRASER toutes les données actuelles!"
    echo ""
    echo "Base de données: $DB_NAME"
    echo "Container: $CONTAINER_NAME"
    echo "Fichier source: $(basename $RESTORE_FILE)"
    echo ""

    # Afficher un aperçu du backup
    log INFO "Aperçu du backup à restaurer:"
    if grep -q "PostgreSQL database dump" "$RESTORE_FILE"; then
        local dump_date=$(grep "Dumped" "$RESTORE_FILE" | head -1 || echo "Date inconnue")
        local dump_version=$(grep "PostgreSQL" "$RESTORE_FILE" | head -1 || echo "Version inconnue")
        echo "  $dump_date"
        echo "  $dump_version"
    fi

    echo ""
    read -p "Voulez-vous continuer? (tapez 'OUI' en majuscules pour confirmer): " confirmation

    if [ "$confirmation" != "OUI" ]; then
        log WARN "Restauration annulée par l'utilisateur"
        exit 0
    fi

    log INFO "Confirmation reçue, poursuite de la restauration..."
}

# Créer un backup de sécurité avant restauration
create_safety_backup() {
    log INFO "Création d'un backup de sécurité avant restauration..."

    local safety_backup="$BACKUP_DIR/pre-restore-backup-$(date +%Y%m%d-%H%M%S).sql"

    if docker exec "$CONTAINER_NAME" pg_dump -U "$DB_USER" "$DB_NAME" > "$safety_backup"; then
        log INFO "Backup de sécurité créé: $(basename $safety_backup) ($(du -h "$safety_backup" | cut -f1))"
    else
        log ERROR "Impossible de créer le backup de sécurité!"
        exit 1
    fi
}

# Vérifier que le container est en cours d'exécution
check_container() {
    if ! docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
        log ERROR "Le container PostgreSQL '$CONTAINER_NAME' n'est pas en cours d'exécution"
        exit 1
    fi

    log INFO "Container PostgreSQL trouvé et actif"
}

# Restaurer la base de données
restore_database() {
    log INFO "Début de la restauration de la base de données..."

    # Méthode 1: Tentative de restauration directe via psql
    log INFO "Tentative de restauration via psql..."

    if docker exec -i "$CONTAINER_NAME" psql -U "$DB_USER" -d "$DB_NAME" < "$RESTORE_FILE" 2>&1 | tee /tmp/restore.log; then
        log INFO "Restauration terminée"
    else
        local exit_code=$?

        # Vérifier si c'est juste des warnings ou de vraies erreurs
        if grep -qi "error" /tmp/restore.log && ! grep -qi "already exists" /tmp/restore.log; then
            log ERROR "Erreurs détectées pendant la restauration (code: $exit_code)"
            log WARN "Vérifiez le fichier /tmp/restore.log pour plus de détails"
            exit 1
        else
            log WARN "Restauration terminée avec des warnings (objets existants)"
        fi
    fi

    rm -f /tmp/restore.log
}

# Vérifier la restauration
verify_restore() {
    log INFO "Vérification de la restauration..."

    # Compter les tables
    local table_count=$(docker exec "$CONTAINER_NAME" psql -U "$DB_USER" -d "$DB_NAME" -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public'" | tr -d ' ')

    log INFO "  Tables dans la base: $table_count"

    # Compter les enregistrements dans les tables principales
    local tables=("users:Utilisateurs" "game_sessions:Sessions" "characters:Personnages")

    for table_info in "${tables[@]}"; do
        IFS=':' read -r table label <<< "$table_info"

        local count=$(docker exec "$CONTAINER_NAME" psql -U "$DB_USER" -d "$DB_NAME" -t -c "SELECT COUNT(*) FROM $table" 2>/dev/null | tr -d ' ' || echo "0")

        log INFO "  $label ($table): $count"
    done

    log INFO "Vérification terminée ✓"
}

# Fonction principale
main() {
    log INFO "=========================================="
    log INFO "Restauration Game Plug - Début"
    log INFO "=========================================="

    check_arguments "$@"
    check_container
    confirm_restore
    create_safety_backup
    restore_database
    verify_restore

    log INFO "=========================================="
    log INFO "Restauration terminée avec succès ✓"
    log INFO "=========================================="

    log INFO "Les données ont été restaurées depuis: $(basename $RESTORE_FILE)"
    log INFO "Un backup de sécurité a été créé dans: $BACKUP_DIR/pre-restore-backup-*.sql"
}

# Gestion des erreurs
trap 'log ERROR "Le script a échoué à la ligne $LINENO"; exit 1' ERR

# Exécution
main "$@"
