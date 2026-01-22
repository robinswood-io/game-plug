#!/bin/bash
# ==============================================================================
# Configuration Cron pour Backups Automatiques - Game Plug
# ==============================================================================
# Ce script configure un cron job pour exécuter des backups quotidiens

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
BACKUP_SCRIPT="$SCRIPT_DIR/backup-database.sh"
CRON_SCHEDULE="${1:-0 3 * * *}"  # Par défaut: 3h du matin tous les jours

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}Configuration du cron job pour backups automatiques${NC}"
echo ""

# Vérifier que le script de backup existe
if [ ! -f "$BACKUP_SCRIPT" ]; then
    echo "Erreur: Script de backup introuvable: $BACKUP_SCRIPT"
    exit 1
fi

# Créer l'entrée cron
CRON_JOB="$CRON_SCHEDULE POSTGRES_PASSWORD=roleplug_020a2db75da6b5674c084a09d4e22b14 $BACKUP_SCRIPT >> /srv/workspace/game-plug/backups/backup.log 2>&1"

echo "Entrée cron à ajouter:"
echo "  $CRON_JOB"
echo ""

# Vérifier si une entrée similaire existe déjà
if crontab -l 2>/dev/null | grep -q "backup-database.sh"; then
    echo -e "${YELLOW}Une entrée cron pour backup-database.sh existe déjà${NC}"
    echo ""
    echo "Entrées cron actuelles:"
    crontab -l 2>/dev/null | grep "backup-database.sh" || true
    echo ""
    read -p "Voulez-vous la remplacer? (y/N): " replace

    if [[ "$replace" =~ ^[Yy]$ ]]; then
        # Supprimer l'ancienne entrée
        crontab -l 2>/dev/null | grep -v "backup-database.sh" | crontab -
        echo "Ancienne entrée supprimée"
    else
        echo "Configuration annulée"
        exit 0
    fi
fi

# Ajouter la nouvelle entrée
(crontab -l 2>/dev/null; echo "$CRON_JOB") | crontab -

echo ""
echo -e "${GREEN}✓ Cron job configuré avec succès!${NC}"
echo ""
echo "Détails:"
echo "  Planification: $CRON_SCHEDULE"
echo "  Script: $BACKUP_SCRIPT"
echo "  Rétention: 30 jours"
echo "  Logs: /srv/workspace/game-plug/backups/backup.log"
echo ""
echo "Pour modifier la planification, éditez directement:"
echo "  crontab -e"
echo ""
echo "Pour voir les cron jobs actuels:"
echo "  crontab -l"
echo ""
echo "Formats cron courants:"
echo "  0 3 * * *     - Tous les jours à 3h du matin"
echo "  0 */6 * * *   - Toutes les 6 heures"
echo "  0 2 * * 0     - Tous les dimanches à 2h du matin"
echo "  */30 * * * *  - Toutes les 30 minutes"
